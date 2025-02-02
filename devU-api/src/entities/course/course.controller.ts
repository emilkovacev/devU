import { NextFunction, Request, Response } from 'express'

import CourseService from './course.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './course.serializer'
import UserCourseService from '../userCourse/userCourse.service'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const courses = await CourseService.list()
    const response = courses.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
export async function getByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = parseInt(req.params.userId)
    const { activeCourses, pastCourses, instructorCourses, upcomingCourses } = await CourseService.listByUser(userId)

    const response = {
      activeCourses: activeCourses.map(serialize),
      pastCourses: pastCourses.map(serialize),
      instructorCourses: instructorCourses.map(serialize),
      upcomingCourses: upcomingCourses.map(serialize),
    }

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.courseId)
    const course = await CourseService.retrieve(id)

    if (!course) return res.status(404).json(NotFound)

    const response = serialize(course)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await CourseService.create(req.body)
    const response = serialize(course)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function postAddInstructor(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await CourseService.create(req.body)
    const response = serialize(course)

    if (req.currentUser?.userId) {
      await UserCourseService.create({
        userId: req.currentUser?.userId,
        courseId: course.id,
        dropped: false,
        role: 'instructor',
      })
    }

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.courseId)
    const results = await CourseService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await CourseService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, getByUser, detail, post, postAddInstructor, put, _delete }
