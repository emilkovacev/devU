import { NextFunction, Request, Response } from 'express'

import { Updated } from '../../utils/apiResponse.utils'
import { serialize } from './webhooks.serializer'
import WebhooksService from './webhooks.service'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const hooksModel = await WebhooksService.list()
    const hooks = hooksModel.map(serialize)
    res.status(200).json(hooks)
  } catch (err) {
    next(err)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const hooksModel = await WebhooksService.retrieveByUserId(req.currentUser!.userId!)
    if (!hooksModel) {
      return res.status(404).json({ 'error': 'Webhook for user not found not found' })
    }
    const hooks = hooksModel.map(serialize)

    res.status(200).json(hooks)
  } catch (err) {
    next(err)
  }
}


export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    req.body['userId'] = req.currentUser!.userId!

    const created = await WebhooksService.create(req.body)
    res.status(201).json(serialize(created))
  } catch (err: any) {
    next(err)
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    const webhookId = parseInt(req.params.id)
    await WebhooksService.update(webhookId, req.body)

    res.status(201).json(Updated)
  } catch (err: any) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const webhookId = parseInt(req.params.id)
    await WebhooksService._delete(webhookId)

    res.status(204).json('Deleted')
  } catch (err: any) {
    next(err)
  }
}

export default {
  get,
  put,
  post,
  _delete,
  getById,
}
