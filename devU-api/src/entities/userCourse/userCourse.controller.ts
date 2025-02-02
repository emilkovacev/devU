import { NextFunction, Request, Response } from 'express'

import UserCourseService from './userCourse.service'
import { serialize } from './userCourse.serializer'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userCourses = await UserCourseService.listAll()

    res.status(200).json(userCourses.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourses = await UserCourseService.list(id)

    res.status(200).json(userCourses.map(serialize))
  } catch (err) {
    next(err)
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.courseId)
    const userCourses = await UserCourseService.listByCourse(id)

    const response = userCourses.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const userCourse = await UserCourseService.retrieve(id)

    if (!userCourse) return res.status(404).json(NotFound)

    const response = serialize(userCourse)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detailByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const userId = parseInt(req.params.userId)
    const userCourse = await UserCourseService.retrieveByCourseAndUser(courseId, userId)

    if (!userCourse) return res.status(404).json(NotFound)

    const response = serialize(userCourse)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const userCourse = await UserCourseService.create(req.body)
    if (userCourse === null) {
      return res.status(409).json('User already enrolled')
    }

    const response = serialize(userCourse)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.courseId = parseInt(req.params.id)
    const currentUser = req.currentUser?.userId
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' })

    req.body.userId = currentUser

    const results = await UserCourseService.update(req.body)
    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function checkEnroll(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const userId = req.currentUser?.userId
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const userCourse = await UserCourseService.checking(userId, courseId)
    if (!userCourse) return res.status(404).json(NotFound)

    res.status(200).json(serialize(userCourse))
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.courseId)
    console.log("DELETE PARAMS: ", req.params)
    const currentUser = req.currentUser?.userId
    if (!currentUser) return res.status(401).json({ message: 'Unauthorized' })

    const results = await UserCourseService._delete(id, currentUser)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}


export async function _deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const courseID = parseInt(req.params.courseId)
    console.log("DELETE PARAMS2: ", req.params)
    // const currentUser = req.currentUser?.userId
    const userID = parseInt(req.params.id)
    if (!userID) return res.status(401).json({ message: 'Unauthorized' })

    const results = await UserCourseService._delete(courseID, userID)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function addStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const userEmails = req.body['users'] as string[]
    if (!userEmails || userEmails.length == 0) return res.status(422).json({ message: 'users field not found or is empty' })
    const courseId = parseInt(req.params.courseId)

    const result = await UserCourseService.bulkCreate(userEmails, courseId, false)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export async function dropStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const userEmails = req.body['users'] as string[]
    if (!userEmails || userEmails.length == 0) return res.status(422).json({ message: 'users field not found or is empty' })
    const courseId = parseInt(req.params.courseId)

    const result = await UserCourseService.bulkCreate(userEmails, courseId, true)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  get,
  getByCourse,
  getAll,
  detail,
  detailByUser,
  post,
  put,
  _delete,
  _deleteUser,
  checkEnroll,
  addStudents,
  dropStudents,
}
