import { Request, Response, NextFunction } from 'express'

import ContainerAutoGraderService from './containerAutoGrader.service'
import { serialize } from './containerAutoGrader.serializer'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const containerAutoGrader = await ContainerAutoGraderService.list()

    res.status(200).json(containerAutoGrader.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const containerAutoGrader = await ContainerAutoGraderService.retrieve(id)

    if (!containerAutoGrader) return res.status(404).json(NotFound)

    const response = serialize(containerAutoGrader)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function getObjectByAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const assignmentId = parseInt(req.params.id)
    const containerAutoGrader = await ContainerAutoGraderService.getGraderObjectByAssignmentId(assignmentId)

    res.status(200).json(containerAutoGrader.map(serialize))
  } catch (err) {
    next(err)
  }
}

/*
 * for the post method, I changed how the upload is handled. I am now using fields instead of
 * single(for the purpose of uploading grader file and makefile). But I set the makefile to be
 * optional, since it is not required. I also added the makefile to the create method in the
 * ContainerAutoGraderService.
 */
export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))
    if (!req.files || !('graderFile' in req.files)) {
      return res.status(400).json(new GenericResponse('Container Auto Grader requires file upload for grader'))
    }
    const graderFile = req.files['graderFile'][0]
    const makefile = req.files['makefileFile']?.[0] ?? null
    const requestBody = req.body
    const userId = req.currentUser?.userId

    const containerAutoGrader = await ContainerAutoGraderService.create(requestBody, graderFile, makefile, userId)
    const response = serialize(containerAutoGrader)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))
    if (req.files && !('graderFile' in req.files) && !('makefileFile' in req.files)) {
      return res.status(400).json(new GenericResponse('Uploaded files must be grader or makefile'))
    }

    const graderFile = req.files?.['graderFile']?.[0] ?? null
    const makefile = req.files?.['makefileFile']?.[0] ?? null
    req.body.id = parseInt(req.params.id)
    const userId = req.currentUser?.userId

    const results = await ContainerAutoGraderService.update(req.body, graderFile, makefile, userId)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await ContainerAutoGraderService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default {
  get,
  detail,
  post,
  put,
  _delete,
  getObjectByAssignment,
}
