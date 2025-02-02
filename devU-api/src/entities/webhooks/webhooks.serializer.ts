import WebhooksModel from './webhooks.model'
import { Webhooks } from 'devu-shared-modules'

export function serialize(webhooks: WebhooksModel): Webhooks {
  return {
    id: webhooks.id,
    userId: webhooks.userId,
    destinationUrl: webhooks.destinationUrl,
    matcherUrl: webhooks.matcherUrl,
    updatedAt: webhooks.updatedAt.toISOString(),
    createdAt: webhooks.createdAt.toISOString(),
  }
}
