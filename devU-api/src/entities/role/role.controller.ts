import { Request, Response, NextFunction } from 'express'

import RoleService from './role.service'
import { serialize } from './role.serializer'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const roles = await RoleService.listAll()

    res.status(200).json(roles.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const roles = await RoleService.listByCourse(courseId)

    const response = roles.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const role = await RoleService.retrieve(id)

    if (!role) return res.status(404).json(NotFound)

    const response = serialize(role)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
export async function detailByName(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const roleName = req.params.roleName
    const role = await RoleService.retrieveByCourseAndName(courseId, roleName)

    if (!role) return res.status(404).json(NotFound)

    const response = serialize(role)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const role = await RoleService.create(req.body)
    const response = serialize(role)

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
    const results = await RoleService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await RoleService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { getByCourse, getAll, detail, detailByName, post, put, _delete }
