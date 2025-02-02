import { CourseScore } from 'devu-shared-modules'

import CourseScoreModel from './courseScore.model'

export function serialize(courseScore: CourseScoreModel): CourseScore {
  return {
    id: courseScore.id,
    userId: courseScore.userId,
    courseId: courseScore.courseId,
    score: courseScore.score,
    createdAt: courseScore.createdAt.toISOString(),
    updatedAt: courseScore.updatedAt.toISOString(),
  }
}
