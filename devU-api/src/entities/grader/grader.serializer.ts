import { SubmissionScore, SubmissionProblemScore, GraderInfo } from 'devu-shared-modules'

export function serialize(scores: any[]): GraderInfo {
  const submissionScore = scores.pop()
  return {
    submissionScore: submissionScore as SubmissionScore,
    submissionProblemScores: scores as SubmissionProblemScore[],
  }
}
