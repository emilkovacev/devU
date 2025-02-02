export type SubmissionProblemScore = {
  id?: number
  submissionId: number
  assignmentProblemId: number
  score: number | null
  feedback: string | null
  releasedAt?: string
  createdAt?: string
  updatedAt?: string
}