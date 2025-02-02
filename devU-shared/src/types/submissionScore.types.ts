export type SubmissionScore = {
  id?: number
  submissionId: number
  score: number | null
  feedback: string | null
  releasedAt?: string
  createdAt?: string
  updatedAt?: string
}