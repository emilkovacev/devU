import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import { SubmissionProblemScore } from 'devu-shared-modules'

import SubmissionProblemScoreModel from './submissionProblemScore.model'

const connect = () => dataSource.getRepository(SubmissionProblemScoreModel)

export async function create(submissionProblemScore: SubmissionProblemScore) {
  return await connect().save(submissionProblemScore)
}

export async function update(submissionProblemScore: SubmissionProblemScore) {
  const { id, submissionId, assignmentProblemId, score, feedback, releasedAt } = submissionProblemScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { submissionId, assignmentProblemId, score, feedback, releasedAt })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number, courseId: number) {
  // TODO: Submission Problem Score doesn't know its courseId (neither does submission score). Best way to ensure the request is authorized based on course permissions?
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function list(submissionId: number) {
  return await connect().findBy({ submissionId: submissionId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
}
