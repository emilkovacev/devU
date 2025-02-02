# Entities

- [x] [User](#user)
- [x] [Course](#course)
- [x] [UserCourse](#usercourse)
- [x] [Assignment](#assignment)
- [x] [Submission](#submission)
- [x] [AssignmentProblem](#assignmentproblem)
- [x] [SubmissionProblemScore](#submissionproblemscore)
- [x] [SubmissionScore](#submissionscore)
- [ ] [AssignmentScore](#assignmentscore)
- [ ] [CategoryScore](#categoryscore)
- [ ] [Category](#category)
- [ ] [CourseScore](#coursescore)

# Entity Details

### User

_Student user for devu_

- id: number
- createdAt: Date
- updatedAt: Date
- deletedAt: Date
- email: string
- externalId: foreign_key
- preferredName: string
-

### Course

- id: number primary_key
- name: string
- semester: string
- number: string _ex: cse220_
- startDate: Date
- endDate: Date
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date

### UserCourse

_Links a user to a course_

- id: number
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date
- userId: number foreign_key ManyToOne -> User
- courseId: number foreign_key ManyToOne -> Course
- level: UserCourseLevel
- dropped: boolean

### Assignment

- id: number primary_key
- courseId: foreign_key ManyToOne -> Course
- name: string
- startDate: Date
- dueDate: Date
- endDate: Date
- gradingType: GradingType
- categoryName: string
- description: string | null
- maxFileSize: number
- maxSubmissions: number | null
- disableHandins: boolean
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date

### Submission

- id: number primary_key
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date
- courseId: number foreign_key ManyToOne -> Course
- assignmentId: number foreign_key -> ManyToOne -> Assignment
- userId: number foreign_key -> ManyToOne -> User
- content: string
- type: SubmissionType
- submitterIp: string
- submittedBy: number foreign_key ManyToOne -> User
- orignalSubmissionId: number | null foreign_key ManyToOne -> Submission

### AssignmentProblem

- id: number primary_key
- assignmentId: number foreign_key ManyToOne -> Assignment
- problemName: string
- maxScore: number
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date

### SubmissionProblemScore

- submissionProblemScoreId: number (primary_key)
- submissionId: foreign_key ManyToOne -> submission
- assignmentProblemId: foreign_key ManyToOne -> AssignmentProblem
- createdAt: Date
- updatedAt: Date
- deletedAt?: Date
- score: number | null
- feedback: string | null
- releasedAt?: Dated

### SubmissionScore

- id: number primary_key
- submissionId: number foreign_key ManyToOne -> Submission
- score: number | null
- createAt: Date
- updatedAt: Date
- delatedAt: ?Date
- feedback: string | null
- releasedAt: ?Date

### Category

- id: number primary_key
- name: string
- createdAt: Date
- updatedAt: Date
- delatedAt: ?Date

### AssignmentScore

- id: number primary_key
- assignmentId: number foreign_key ManyToOne -> Assignment
- userId: number foreign_key User
- score: number
- createdAt: Date
- updatedAt: Date
- DeletedAt: ?Date

### CategoryScore

- if: number
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date
- courseId: number foreign_key ManyToOne -> Course
- userId: number foreign_key ManyToOne -> Category
- category: string
- score: number
- letterGrade: LetterGrade

### CourseScore

- id: number
- courseId: number foreign_key ManyToOne -> Course
- score: number
- letterGrade: string
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date
