import { serialize } from '../grader.serializer'

import SubmissionScoreModel from '../../submissionScore/submissionScore.model'
import SubmissionProblemScoreModel from '../../submissionProblemScore/submissionProblemScore.model'

import Testing from '../../../utils/testing.utils'

let mockSubmissionScore: SubmissionScoreModel
let mockSubmissionProblemScore1: SubmissionProblemScoreModel
let mockSubmissionProblemScore2: SubmissionProblemScoreModel
let mockArray = new Array()

describe('Grader Serializer', () => {
  beforeEach(() => {
    mockSubmissionScore = Testing.generateTypeOrm<SubmissionScoreModel>(SubmissionScoreModel)
    mockSubmissionProblemScore1 = Testing.generateTypeOrm<SubmissionProblemScoreModel>(SubmissionProblemScoreModel)
    mockSubmissionProblemScore2 = Testing.generateTypeOrm<SubmissionProblemScoreModel>(SubmissionProblemScoreModel)

    mockSubmissionScore.id = 1
    mockSubmissionScore.submissionId = 4
    mockSubmissionScore.score = 5
    mockSubmissionScore.feedback = 'q1: 5/5, q2: 0/5'
    mockSubmissionScore.createdAt = new Date()
    mockSubmissionScore.updatedAt = new Date()

    mockSubmissionProblemScore1.id = 1
    mockSubmissionProblemScore1.submissionId = 4
    mockSubmissionProblemScore1.assignmentProblemId = 1
    mockSubmissionProblemScore1.score = 5
    mockSubmissionProblemScore1.feedback = 'Correct, 5/5 points'
    mockSubmissionProblemScore1.createdAt = new Date()
    mockSubmissionProblemScore1.updatedAt = new Date()

    mockSubmissionProblemScore2.id = 2
    mockSubmissionProblemScore2.submissionId = 4
    mockSubmissionProblemScore2.assignmentProblemId = 2
    mockSubmissionProblemScore2.score = 0
    mockSubmissionProblemScore2.feedback = 'Incorrect, 0/5 points'
    mockSubmissionProblemScore2.createdAt = new Date()
    mockSubmissionProblemScore2.updatedAt = new Date()

    mockArray.push(mockSubmissionProblemScore1)
    mockArray.push(mockSubmissionProblemScore2)
    mockArray.push(mockSubmissionScore)
  })

  describe('Serializing grade info', () => {
    test('GraderInfo values exist in the response', () => {
      const expectedResult = serialize(mockArray)

      expect(expectedResult).toBeDefined()
      expect(expectedResult.submissionScore).toEqual(mockSubmissionScore)
      expect(expectedResult.submissionProblemScores[0]).toEqual(mockSubmissionProblemScore1)
      expect(expectedResult.submissionProblemScores[1]).toEqual(mockSubmissionProblemScore2)
    })
  })
})
