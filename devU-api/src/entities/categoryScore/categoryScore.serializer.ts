import { CategoryScore } from 'devu-shared-modules'

import CategoryScoreModel from './categoryScore.model'

export function serialize(categoryScore: CategoryScoreModel): CategoryScore {
  return {
    id: categoryScore.id,
    userId: categoryScore.userId,
    courseId: categoryScore.courseId,
    categoryId: categoryScore.categoryId,
    score: categoryScore.score,
  }
}
