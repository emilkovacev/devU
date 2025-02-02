import { IsNull } from 'typeorm'
import { dataSource } from '../../database'
import NonContainerAutoGraderModel from './nonContainerAutoGrader.model'
import { NonContainerAutoGrader } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(NonContainerAutoGraderModel)

export async function create(nonContainerQuestion: NonContainerAutoGrader) {
  return await connect().save(nonContainerQuestion)
}

export async function update(nonContainerQuestion: NonContainerAutoGrader) {
  const { id, question, score, correctString, isRegex, assignmentId } = nonContainerQuestion
  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { score, question, correctString, isRegex, assignmentId })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

// Retrieve all the nonContainerQuestions linked to a particular assignment by assignmentId
export async function listByAssignmentId(assignmentId: number) {
  if (!assignmentId) throw new Error('Missing AssignmentId')
  return await connect().findBy({ assignmentId: assignmentId, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByAssignmentId,
}
