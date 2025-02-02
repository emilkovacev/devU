import { NextFunction, Request, Response } from 'express'

import SubmissionService from '../submission/submission.service'

import { GenericResponse, NotFound } from '../../utils/apiResponse.utils'

import { serialize } from './submission.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.currentUser?.userId
    const query = req.query

    if (!userId) return res.status(400).json(new GenericResponse('Request requires auth'))

    const submissions = await SubmissionService.list(query, userId)
    const response = submissions.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
export async function listByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.currentUser?.userId
    const query = req.query

    if (!userId) return res.status(400).json(new GenericResponse('Request requires auth'))

    const submissions = await SubmissionService.list(query, userId)
    const response = submissions.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const submission = await SubmissionService.retrieve(id)

    if (!submission) return res.status(404).json(NotFound)

    const response = serialize(submission)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    // If this is hit, developer messed up above in the chain by not checking the user for auth
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))

    const reqSubmission = req.body
    reqSubmission.userId = req.currentUser?.userId
    reqSubmission.submitterIp = req.header('x-forwarded-for') || req.socket.remoteAddress
    reqSubmission.submittedBy = req.currentUser?.userId

    const submission = await SubmissionService.create(reqSubmission, req.file)
    const response = serialize(submission)

    res.status(201).json(response)
  } catch (err: any) {
    res.status(400).json(new GenericResponse(err.message))
  }
}
export async function revoke(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Revoke a submission
  } catch (err: any) {
    next(err)
  }
}
export async function unrevoke(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Unrevoke a submission
  } catch (err: any) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await SubmissionService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function getByAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = parseInt(req.params.assignmentId)
    const userId = req.currentUser?.userId
    if (!userId) return res.status(400).json(new GenericResponse('Request requires auth'))
    const submissions = await SubmissionService.listByAssignment(assignmentId, userId)
    const response = submissions.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export default { get, listByUser, detail, post, revoke, getByAssignment, unrevoke, _delete }
