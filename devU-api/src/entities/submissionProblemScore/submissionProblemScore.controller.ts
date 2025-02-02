import { SubmissionProblemScore } from 'devu-shared-modules'
import { Request, Response, NextFunction } from 'express'

import SubmissionProblemScoreService from './submissionProblemScore.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './submissionProblemScore.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const submissionId = parseInt(req.params.submissionId)
    const submissionProblemScores = await SubmissionProblemScoreService.list(submissionId)
    const response = submissionProblemScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const submissionProblemScore = await SubmissionProblemScoreService.retrieve(id, -1) // TODO: what to do about course id

    if (!submissionProblemScore) return res.status(404).json(NotFound)

    const response = serialize(submissionProblemScore)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))

    const requestBody: SubmissionProblemScore = req.body

    const submissionProblemScore = await SubmissionProblemScoreService.create(requestBody)
    const response = serialize(submissionProblemScore)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await SubmissionProblemScoreService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await SubmissionProblemScoreService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
