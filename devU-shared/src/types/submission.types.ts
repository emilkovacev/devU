export type Submission = {
  id?: number
  userId: number
  assignmentId: number
  courseId: number
  content: string
  submitterIp?: string
  submittedBy?: number
  createdAt?: string
  updatedAt?: string
}
