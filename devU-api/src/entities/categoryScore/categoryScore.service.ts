import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import CategoryScoreModel from './categoryScore.model'

import { CategoryScore } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(CategoryScoreModel)

export async function create(categoryScore: CategoryScore) {
  return await connect().save(categoryScore)
}

export async function update(categoryScore: CategoryScore) {
  const { id, courseId, userId, categoryId, score } = categoryScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { courseId, userId, categoryId, score })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

// Retrieve all the categoryScores linked to a particular category (TODO: This endpoint doesn't have a path)
// export async function listByCategory(categoryId: number) {
//   return await connect().findBy({ categoryId: categoryId, deletedAt: IsNull() })

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  return await connect().findBy({ courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  listByCourse,
  list,
}
