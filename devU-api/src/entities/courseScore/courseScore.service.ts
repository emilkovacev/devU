import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import CourseScoreModel from './courseScore.model'

import { CourseScore } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(CourseScoreModel)

export async function create(courseScore: CourseScore) {
  return await connect().save(courseScore)
}

export async function update(courseScore: CourseScore) {
  const { id, courseId, userId, score } = courseScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { courseId, userId, score })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

// Retrieve all the courseScores linked to a particular course
export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
