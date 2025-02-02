import {NextFunction, Request, Response} from 'express'

import StickyNoteService from './stickyNote.service'

import {NotFound, Updated} from '../../utils/apiResponse.utils'

import {serialize} from './stickyNote.serializer'

export async function retrieve(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const stickyNote = await StickyNoteService.retrieve(id)

    if (!stickyNote) return res.status(404).json(NotFound)

    const response = serialize(stickyNote)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const reqStickyNote = req.body
    const stickyNote = await StickyNoteService.create(reqStickyNote)
    const response = serialize(stickyNote)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const reqStickyNote = req.body
    const stickyNote = await StickyNoteService.update(id, reqStickyNote)

    if (!stickyNote.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    await StickyNoteService._delete(id)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function listBySubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const submissionId = parseInt(req.params.submissionId)
    const stickyNotes = await StickyNoteService.listBySubmission(submissionId)
    const response = stickyNotes.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export default {
  retrieve,
  post,
  put,
  remove,
  listBySubmission,
}