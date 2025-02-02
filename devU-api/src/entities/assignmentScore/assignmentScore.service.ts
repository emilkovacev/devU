import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import AssignmentScoreModel from './assignmentScore.model'

import { AssignmentScore } from 'devu-shared-modules'

import AssignmentService from '../assignment/assignment.service'

const connect = () => dataSource.getRepository(AssignmentScoreModel)

export async function create(assignmentScore: AssignmentScore) {
  return await connect().save(assignmentScore)
}

export async function update(assignmentScore: AssignmentScore) {
  const { id, assignmentId, userId, score } = assignmentScore

  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { assignmentId, userId, score })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function list(assignmentId: number) {
  // TODO: There's no way this is right. Test to verify that it should be 'assignmentId': assignmentId
  return await connect().findBy({ assignmentId, deletedAt: IsNull() })
}

export async function retrieveByUser(assignmentId: number, userId: number) {
  //TODO: This can't be right.. can it?
  return await connect().findOneBy({ assignmentId, userId, deletedAt: IsNull() })
}

export async function listByUser(userId: number) {
  return await connect().findBy({ userId, deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  const assignments = await AssignmentService.listByCourse(courseId)
  const assignmentScorePromises = assignments.map(a => connect().findBy({ assignmentId: a.id, deletedAt: IsNull() }))
  return (await Promise.all(assignmentScorePromises)).reduce((a, b) => a.concat(b), []) //Must flatten 2D array resulting from array promises
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  retrieveByUser,
  listByUser,
  listByCourse,
}
