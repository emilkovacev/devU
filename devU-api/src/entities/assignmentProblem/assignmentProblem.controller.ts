import { Request, Response, NextFunction } from 'express'

import AssignmentProblemService from './assignmentProblem.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './assignmentProblem.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = parseInt(req.params.assignmentId)
    const assignmentProblems = await AssignmentProblemService.list(assignmentId)
    const response = assignmentProblems.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const assignmentProblem = await AssignmentProblemService.retrieve(id)

    if (!assignmentProblem) return res.status(404).json(NotFound)

    const response = serialize(assignmentProblem)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentProblem = await AssignmentProblemService.create(req.body)
    const response = serialize(assignmentProblem)

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
    const results = await AssignmentProblemService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await AssignmentProblemService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
