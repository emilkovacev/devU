const API_URL = 'http://localhost:3001'

let apiToken: { [key: string]: string } = {}
let content = ''
let file
let makefile

async function fetchToken(email: string, externalId: string) {
  const urlencoded = new URLSearchParams()
  urlencoded.append('email', email)
  urlencoded.append('externalId', externalId)

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: urlencoded,
  }

  const res = await fetch(API_URL + '/login/developer', options)
  const responseBody = await res.json()
  const tmp = res.headers.get('Set-Cookie')?.split('=')[1]

  if (tmp === undefined) {
    throw Error('Api token not found')
  }

  apiToken[externalId] = tmp.split(';')[0]
  return responseBody.userId
}

async function initAdmin() {
  await fetchToken('admin@admin.admin', 'admin')
}

//Returns the ID of the newly created entry
async function SendPOST(path: string, requestBody: string | FormData, requesterExternalId: string) {
  console.log(path)
  console.log(requestBody)
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${apiToken[requesterExternalId]}`)
  headers.append('Content-Type', 'application/json')
  if (requestBody instanceof FormData) {
    headers.delete('Content-Type')
  } else if (typeof requestBody === 'object') {
    requestBody = JSON.stringify(requestBody)
  }

  let response = await fetch(API_URL + path, {
    method: 'POST',
    headers: headers,
    body: requestBody,
  })
  const responseBody = await response.json()
  console.log(responseBody)
  return responseBody
}

async function CreateCourse(
  name: string, 
  number: string, 
  semester: string, 
  isPublic: boolean 
) {
  const courseData = {
      name: name,
      semester: semester,
      number: number,
      startDate: '2024-01-24T00:00:00-0500',
      endDate: '2024-05-10T23:59:59-0500',
      is_public: isPublic // Include the public property
  };

  console.log('Creating course: ', courseData.name);
  return await SendPOST('/courses/instructor', JSON.stringify(courseData), 'admin');
}

async function joinCourse(courseId: number, userId: number, role: string) {
  const userCourseData = {
    userId: userId,
    courseId: courseId,
    role: role,
    dropped: false,
  }
  console.log(`Joining course: ${courseId} for user: ${userId}`)
  return await SendPOST(`/course/${courseId}/user-courses`, JSON.stringify(userCourseData), 'admin')
}

async function createAssignment(courseId: number, name: string, categoryName: string) {
  const time = new Date().getTime()
  const startDate = new Date(time + 60 * 1000).toISOString()
  const dueDate = new Date(time + 7 * 24 * 60 * 60 * 1000).toISOString()
  const endDate = new Date(time + 14 * 24 * 60 * 60 * 1000).toISOString()

  const assignmentData = {
    courseId: courseId,
    name: name,
    startDate: startDate,
    dueDate: dueDate,
    endDate: endDate,
    categoryName: categoryName,
    description: 'This is a test assignment for course Id:.' + courseId,
    maxFileSize: 1024 * 20,
    disableHandins: false,
  }
  console.log(`Creating assignment for Course Id: ${courseId}, Name: ${name}`)
  return await SendPOST(`/course/${courseId}/assignments`, JSON.stringify(assignmentData), 'admin')
}

async function createNonContainerAutoGrader(
  courseId: number,
  assignmentId: number,
  problemName: string,
  Score: number,
  Regex: string,
  isRegex: boolean
) {
  const problemData = {
    assignmentId: assignmentId,
    question: problemName,
    score: Score,
    correctString: Regex,
    isRegex: isRegex,
  }
  console.log('Creating NonContainerAutoGrader for Assignment Id: ', assignmentId)
  return await SendPOST(
    `/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`,
    JSON.stringify(problemData),
    'admin'
  )
}

async function createContainerAutoGrader(
  courseId: number,
  assignmentId: number,
  imageName: string,
  timeout: number,
  graderFile: File,
  makefile?: File
) {
  const formData = new FormData()
  formData.append('assignmentId', assignmentId.toString())
  formData.append('autogradingImage', imageName)
  formData.append('graderFile', graderFile)
  formData.append('timeout', timeout.toString())
  if (makefile) {
    formData.append('makefileFile', makefile)
  }
  console.log('Creating ContainerAutoGrader for Assignment Id: ', assignmentId)
  return await SendPOST(`/course/${courseId}/assignment/${assignmentId}/container-auto-graders`, formData, 'admin')
}

async function createSubmission(
  courseId: number,
  assignmentId: number,
  userId: number,
  externalId: string,
  content?: string,
  file?: File
) {
  const time = new Date().toISOString()

  content = content || `This is a test submission for assignment Id: ${assignmentId}`
  const fullContent = `{"form":${JSON.stringify(content)}}`

  let response
  console.log('Creating submission for assignment Id: ', assignmentId)
  if (file) {
    const formData = new FormData()
    formData.append('content', fullContent)
    formData.append('createdAt', time)
    formData.append('updatedAt', time)
    formData.append('courseId', courseId.toString())
    formData.append('assignmentId', assignmentId.toString())
    formData.append('userId', userId.toString())
    formData.append('files', file)

    response = await SendPOST(`/course/${courseId}/assignment/${assignmentId}/submissions`, formData, externalId)
  } else {
    const submissionData = {
      createdAt: time,
      updatedAt: time,
      courseId: courseId,
      assignmentId: assignmentId,
      userId: userId,
      content: fullContent,
    }
    //@ts-ignore
    response = await SendPOST(`/course/${courseId}/assignment/${assignmentId}/submissions`, submissionData, externalId)
  }
  return response
}

async function createAssignmentProblem(courseId: number, assignmentId: number, problemName: string, maxScore: number) {
  const problemData = {
    assignmentId: assignmentId,
    problemName: problemName,
    maxScore: maxScore,
  }
  return await SendPOST(
    `/course/${courseId}/assignment/${assignmentId}/assignment-problems`,
    JSON.stringify(problemData),
    'admin'
  )
}

async function gradeSubmission(courseId: number, submissionId: number) {
  return await SendPOST(`/course/${courseId}/grade/${submissionId}`, '', 'admin')
}

async function runCourseAndSubmission() {
  // try {
  //Create users
  const billy = await fetchToken('billy@buffalo.edu', 'billy')
  const bob = await fetchToken('bob@buffalo.edu', 'bob')
  const jones = await fetchToken('jones@buffalo.edu', 'jones')

  //Create courses
  const courseId1 = (await CreateCourse('Testing Course Name1', 'CSE101', 's2024',true)).id
  const courseId2 = (await CreateCourse('Testing Course Name2', 'CSE102', 's2024',true)).id

  //Enroll students
  await joinCourse(courseId1, billy, 'student')
  await joinCourse(courseId1, bob, 'student')
  await joinCourse(courseId1, jones, 'instructor')
  await joinCourse(courseId2, billy, 'student')
  await joinCourse(courseId2, bob, 'student')
  await joinCourse(courseId2, jones, 'instructor')

  //Create assignments
  const assignment1 = await createAssignment(courseId1, 'Course1 Assignment 1', 'Quiz')
  const assignmentId1 = assignment1.id
  const assignmentId2 = (await createAssignment(courseId1, 'Course1 Assignment 2', 'Homework')).id

  const assignmentId3 = (await createAssignment(courseId2, 'Course2 Assignment 1', 'Quiz')).id
  const assignmentId4 = (await createAssignment(courseId2, 'Course2 Assignment 2', 'Homework')).id

  const problemName1 = (await createAssignmentProblem(courseId1, assignmentId1, 'Please answer A', 10)).problemName
  const problemName2 = (await createAssignmentProblem(courseId1, assignmentId1, 'Please answer B', 10)).problemName

  const problemName3 = (await createAssignmentProblem(courseId2, assignmentId3, 'Please NOT answer A', 10)).problemName
  const problemName4 = (await createAssignmentProblem(courseId2, assignmentId3, 'Please NOT answer B', 10)).problemName

  //NonContainerAutoGrader
  await createNonContainerAutoGrader(courseId1, assignmentId1, problemName1, 10, 'A', false)
  await createNonContainerAutoGrader(courseId1, assignmentId1, problemName2, 10, 'B', false)
  await createNonContainerAutoGrader(courseId2, assignmentId3, problemName1, 10, '/^[^Aa]+$/', true)
  await createNonContainerAutoGrader(courseId2, assignmentId3, problemName2, 10, '/^[^Bb]+$/', true)

  //ContainerAutoGrader
  makefile = new File(['This is a test makefile'], 'makefile')
  file = new File(['This is a test grader file'], 'grader.code')
  await createContainerAutoGrader(courseId1, assignmentId2, 'NewestImageInTheWorld', 300, file, makefile)

  file = new File(['This is another test grader file'], 'grader.code')
  await createContainerAutoGrader(courseId2, assignmentId4, 'OldestImageInTheWorld', 300, file, makefile)

  //Create submissions
  content = `{"${problemName1}": "A", "${problemName2}": "B"}`
  const submission1 = await createSubmission(courseId1, assignmentId1, billy, 'billy', content)

  content = `{"${problemName1}": "C", "${problemName2}": "D"}`
  const submission2 = await createSubmission(courseId1, assignmentId1, bob, 'bob', content)

  content = `{"${problemName3}": "A", "${problemName4}": "B"}`
  const submission3 = await createSubmission(courseId2, assignmentId3, billy, 'billy', content)

  content = `{"${problemName3}": "C", "${problemName4}": "D"}`
  const submission4 = await createSubmission(courseId2, assignmentId3, bob, 'bob', content)

  file = new File(['This is a test file1'], 'test.txt')
  const submission5 = await createSubmission(courseId1, assignmentId2, billy, 'billy', undefined, file)
  const submission6 = await createSubmission(courseId1, assignmentId2, bob, 'bob', undefined, file)

  file = new File(['These are lines of codes'], 'code.code')
  const submission7 = await createSubmission(courseId1, assignmentId4, billy, 'billy', undefined, file)
  const submission8 = await createSubmission(courseId1, assignmentId4, bob, 'bob', undefined, file)

  //Grade the submissions
  for (const submission of [
    submission1,
    submission2,
    submission3,
    submission4,
    submission5,
    submission6,
    submission7,
    submission8,
  ]) {
    console.log('Grading submission: ', submission)
    await gradeSubmission(submission.courseId, submission.id)
  }

  console.log('Script completed successfully!')
  // } catch (e) {
  //   console.error(e)
  // }
}

initAdmin()
runCourseAndSubmission()
