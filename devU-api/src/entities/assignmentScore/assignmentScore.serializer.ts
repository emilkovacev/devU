import { AssignmentScore } from 'devu-shared-modules'

import AssignmentScoreModel from './assignmentScore.model'

export function serialize(assignmentScore: AssignmentScoreModel): AssignmentScore {
  return {
    id: assignmentScore.id,
    assignmentId: assignmentScore.assignmentId,
    userId: assignmentScore.userId,
    score: assignmentScore.score,
    createdAt: assignmentScore.createdAt.toISOString(),
    updatedAt: assignmentScore.updatedAt.toISOString(),
  }
}
