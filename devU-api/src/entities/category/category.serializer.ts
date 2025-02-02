import { Category } from 'devu-shared-modules'

import CategoryModel from './category.model'

export function serialize(category: CategoryModel): Category {
  return {
    id: category.id,
    courseId: category.courseId,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }
}
