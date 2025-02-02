import { FindManyOptions, IsNull } from 'typeorm'
import { dataSource } from '../../database'

import SubmissionScoreModel from '../submissionScore/submissionScore.model'

import { SubmissionScore } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(SubmissionScoreModel)

export async function create(submissionScore: SubmissionScore) {
  return await connect().save(submissionScore)
}

export async function update(submissionScore: SubmissionScore) {
  const { id, submissionId, score, feedback, releasedAt } = submissionScore

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, {
    submissionId,
    score,
    feedback,
    releasedAt,
  })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function list(submissionId?: number) {
  const options: FindManyOptions = {
    where: {
      deletedAt: IsNull(),
      ...(submissionId !== undefined && { submissionId }),
    },
  }
  return await connect().find(options)
}

export async function listByUser(userId: number, assignmentId: number) {
  //This doesn't work, the SubmissionScore entity doesn't have userId and assignmentId.
  const options: FindManyOptions = {
    where: {
      userId: userId,
      assignmentId: assignmentId,
      deletedAt: IsNull(),
    },
  }
  return await connect().find(options)
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByUser,
}
