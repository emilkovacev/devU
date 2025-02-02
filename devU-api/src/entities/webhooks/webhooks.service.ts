import { dataSource } from '../../database'
import WebhooksModel from './webhooks.model'
import { Webhooks } from 'devu-shared-modules'
import { IsNull } from 'typeorm'

const connect = () => dataSource.getRepository(WebhooksModel)

async function create(input: Webhooks) {
  return await connect().save(input)
}



async function retrieveByUserId(userId: number) {
  return await connect().findBy({ userId: userId, deletedAt: IsNull() })
}

async function update(id: number, input: Webhooks) {
  return await connect().update(id, { matcherUrl: input.matcherUrl, destinationUrl: input.destinationUrl })
}

async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export default {
  create,
  list,
  update,
  retrieveByUserId,
  _delete,
}
