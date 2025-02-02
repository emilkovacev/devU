import submissionService from '../submission/submission.service'
import submissionScoreService from '../submissionScore/submissionScore.service'
import submissionProblemScoreService from '../submissionProblemScore/submissionProblemScore.service'
import nonContainerAutograderService from '../nonContainerAutoGrader/nonContainerAutoGrader.service'
import containerAutograderService from '../containerAutoGrader/containerAutoGrader.service'
import assignmentProblemService from '../assignmentProblem/assignmentProblem.service'
import assignmentScoreService from '../assignmentScore/assignmentScore.service'
import courseService from '../course/course.service'
import { addJob, createCourse, uploadFile, pollJob } from '../../tango/tango.service'

import {
  SubmissionScore,
  SubmissionProblemScore,
  AssignmentScore,
  Submission,
  NonContainerAutoGrader,
  AssignmentProblem,
} from 'devu-shared-modules'
import { checkAnswer } from '../nonContainerAutoGrader/nonContainerAutoGrader.grader'
import { serialize as serializeNonContainer } from '../nonContainerAutoGrader/nonContainerAutoGrader.serializer'
import { serialize as serializeAssignmentScore } from '../assignmentScore/assignmentScore.serializer'
import { serialize as serializeSubmissionScore } from '../submissionScore/submissionScore.serializer'
import { serialize as serializeSubmission } from '../submission/submission.serializer'
import { serialize as serializeAssignmentProblem } from '../assignmentProblem/assignmentProblem.serializer'
import { downloadFile, initializeMinio } from '../../fileStorage'

async function grade(submissionId: number) {
  const submissionModel = await submissionService.retrieve(submissionId)
  if (!submissionModel) throw new Error('Submission not found.')
  const submission = serializeSubmission(submissionModel)

  const assignmentId = submission.assignmentId

  const content = JSON.parse(submission.content)
  const form = content.form
  const filepaths: string[] = content.filepaths

  const nonContainerAutograders = (await nonContainerAutograderService.listByAssignmentId(assignmentId)).map(model =>
    serializeNonContainer(model)
  )
  const assignmentProblems = (await assignmentProblemService.list(assignmentId)).map(model =>
    serializeAssignmentProblem(model)
  )

  let score = 0
  let feedback = ''

  //Run Non-Container Autograders
  const ncagResults = await runNonContainerAutograders(form, nonContainerAutograders, assignmentProblems, submissionId)
  score += ncagResults.score
  feedback += ncagResults.feedback

  //Run Container Autograders
  const cagResults = await runContainerAutograders(filepaths, submission, assignmentId)
  const jobResponse = cagResults.jobResponse
  const containerGrading = cagResults.containerGrading

  //Grading is finished. Create SubmissionScore and AssignmentScore and save to db.
  const scoreObj: SubmissionScore = {
    submissionId: submissionId,
    score: score, //Sum of all SubmissionProblemScore scores
    feedback: feedback, //Concatination of SubmissionProblemScore feedbacks
  }
  submissionScoreService.create(scoreObj)

  //If containergrading is true, tangoCallback handles assignmentScore creation
  if (!containerGrading) {
    await updateAssignmentScore(submission, score)
    return { message: `Noncontainer autograding completed successfully`, submissionScore: scoreObj }
  }
  return {
    message: `Autograder successfully added job #${jobResponse?.jobId} to the queue with status message ${jobResponse?.statusMsg}`,
  }
}

async function runNonContainerAutograders(
  form: any,
  nonContainerAutograders: NonContainerAutoGrader[],
  assignmentProblems: AssignmentProblem[],
  submissionId: number
) {
  let score = 0
  let feedback = ''

  for (const question in form) {
    const nonContainerGrader = nonContainerAutograders.find(grader => grader.question === question)
    const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)

    if (nonContainerGrader && assignmentProblem) {
      const [problemScore, problemFeedback] = checkAnswer(form[question], nonContainerGrader)
      score += problemScore
      feedback += `${problemFeedback}\n`

      const problemScoreObj: SubmissionProblemScore = {
        submissionId: submissionId,
        assignmentProblemId: assignmentProblem.id ?? 0, //This should never be undefined, not sure why our types have id set as optional
        score: problemScore,
        feedback: problemFeedback,
      }
      submissionProblemScoreService.create(problemScoreObj)
    }
  }
  return { score, feedback }
}

async function runContainerAutograders(filepaths: string[], submission: Submission, assignmentId: number) {
  let containerGrading = true
  let jobResponse = null

  const { graderData, makefileData, autogradingImage, timeout } =
    await containerAutograderService.getGraderByAssignmentId(assignmentId)
  if (!graderData || !makefileData || !autogradingImage || !timeout) {
    containerGrading = false
  } else {
    try {
      const bucketName = await courseService.retrieve(submission.courseId).then(course => {
        return course ? (course.number + course.semester + course.id).toLowerCase() : 'submission'
      })
      await initializeMinio(bucketName)

      const labName = `${bucketName}-${submission.assignmentId}`
      const optionFiles = []
      const openResponse = await createCourse(labName)
      if (openResponse) {
        await uploadFile(labName, graderData, 'Graderfile')
        await uploadFile(labName, makefileData, 'Makefile')

        for (const filepath of filepaths) {
          const buffer = await downloadFile(bucketName, filepath)
          if (await uploadFile(labName, buffer, filepath)) {
            optionFiles.push({ localFile: filepath, destFile: filepath })
          }
        }
        const jobOptions = {
          image: autogradingImage,
          files: [
            { localFile: 'Graderfile', destFile: 'autograde.tar' },
            { localFile: 'Makefile', destFile: 'Makefile' },
          ].concat(optionFiles),
          jobName: `${labName}-${submission.id}`,
          output_file: `${labName}-${submission.id}-output.txt`,
          timeout: timeout,
          callback_url: `http://api:3001/course/${submission.courseId}/grade/callback/${labName}-${submission.id}-output.txt`,
        }
        jobResponse = await addJob(labName, jobOptions)
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }
  return { containerGrading, jobResponse }
}

async function tangoCallback(outputFile: string) {
  //Output filename consists of 4 sections separated by hyphens. + and () only for visual clarity, not a part of the filename
  //(course.number+course.semester+course.id)-(assignment.id)-(submission.id)-(output.txt)
  const filenameSplit = outputFile.split('-')
  const labName = `${filenameSplit[0]}-${filenameSplit[1]}`
  const assignmentId = Number(filenameSplit[1])
  const submissionId = Number(filenameSplit[2])

  try {
    const response = await pollJob(labName, outputFile)
    if (typeof response !== 'string') throw 'Autograder output file not found'

    try {
      const splitResponse = response.split(/\r\n|\r|\n/)
      var scoresLine = JSON.parse(splitResponse[splitResponse.length - 2])
    } catch {
      throw response
    }
    const scores = scoresLine.scores

    let score = 0
    const assignmentProblems = await assignmentProblemService.list(assignmentId)
    const submissionScoreModel = await submissionScoreService.retrieve(submissionId)
    const submissionModel = await submissionService.retrieve(submissionId)
    if (!submissionModel) throw 'Submission not found.'
    const submission = serializeSubmission(submissionModel)

    for (const question in scores) {
      const assignmentProblem = assignmentProblems.find(problem => problem.problemName === question)
      if (assignmentProblem) {
        const problemScoreObj: SubmissionProblemScore = {
          submissionId: submissionId,
          assignmentProblemId: assignmentProblem.id,
          score: Number(scores[question]),
          feedback: `Autograder graded ${assignmentProblem.problemName} for ${Number(scores[question])} points`,
        }
        submissionProblemScoreService.create(problemScoreObj)
        score += Number(scores[question])
      }
    }
    if (submissionScoreModel) {
      //If noncontainer grading has occured
      var submissionScore = serializeSubmissionScore(submissionScoreModel)
      submissionScore.score = (submissionScore.score ?? 0) + score
      score = submissionScore.score
      submissionScore.feedback += `\n${response}`

      await submissionScoreService.update(submissionScore)
    } else {
      //If submission is exclusively container graded
      var submissionScore: SubmissionScore = {
        submissionId: submissionId,
        score: score, //Sum of all SubmissionProblemScore scores
        feedback: response, //Feedback from Tango
      }
      await submissionScoreService.create(submissionScore)
    }
    await updateAssignmentScore(submission, score)

    return { submissionScore: submissionScore, outputFile: response }
  } catch (e: any) {
    callbackFailure(assignmentId, submissionId, e)
    throw new Error(e)
  }
}

export async function callbackFailure(assignmentId: number, submissionId: number, file: string) {
  const assignmentProblems = await assignmentProblemService.list(assignmentId)
  const submissionScoreModel = await submissionScoreService.retrieve(submissionId)
  const submissionProblemScoreModels = await submissionProblemScoreService.list(submissionId)

  for (const assignmentProblem of assignmentProblems) {
    const submissionProblemScore = submissionProblemScoreModels.find(
      sps => sps.assignmentProblemId === assignmentProblem.id
    )
    if (!submissionProblemScore) {
      //If assignmentProblem hasn't already been graded by noncontainer autograder
      const problemScoreObj: SubmissionProblemScore = {
        submissionId: submissionId,
        assignmentProblemId: assignmentProblem.id,
        score: 0,
        feedback: 'Autograding failed to complete.',
      }
      submissionProblemScoreService.create(problemScoreObj)
    }
  }
  if (submissionScoreModel) {
    //If noncontainer grading has occured
    var submissionScore = serializeSubmissionScore(submissionScoreModel)
    submissionScore.score = submissionScore.score ?? 0
    submissionScore.feedback += `\n${file}`

    submissionScoreService.update(submissionScore)
  } else {
    //If submission is exclusively container graded
    var submissionScore: SubmissionScore = {
      submissionId: submissionId,
      score: 0,
      feedback: file,
    }
    submissionScoreService.create(submissionScore)
  }
}

//Currently just sets assignmentscore to the latest submission. Pulled this function out for easy future modification.
async function updateAssignmentScore(submission: Submission, score: number) {
  const assignmentScoreModel = await assignmentScoreService.retrieveByUser(submission.assignmentId, submission.userId)
  if (assignmentScoreModel) {
    //If assignmentScore already exists, update existing entity
    const assignmentScore = serializeAssignmentScore(assignmentScoreModel)
    assignmentScore.score = score
    assignmentScoreService.update(assignmentScore)
  } else {
    //Otherwise create a new one
    const assignmentScore: AssignmentScore = {
      assignmentId: submission.assignmentId,
      userId: submission.userId,
      score: score,
    }
    assignmentScoreService.create(assignmentScore)
  }
}

export default { grade, tangoCallback }
