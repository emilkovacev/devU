import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import CourseModel from './course.model'

import { Course } from 'devu-shared-modules'
import { initializeMinio } from '../../fileStorage'
import UserCourseService from '../userCourse/userCourse.service'

const connect = () => dataSource.getRepository(CourseModel)

export async function create(course: Course) {
  const output = await connect().save(course)
  const bucketName = (course.number + course.semester + course.id).replace(/ /g, '-').toLowerCase()
  await initializeMinio(bucketName)
  return output
}

export async function update(course: Course) {
  const { id, name, semester, number, startDate, endDate } = course
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { name, semester, number, startDate, endDate })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByUser(userId: number) {
  const userCourses = await UserCourseService.listByUser(userId)
  const date = new Date()
  const activeCourses = []
  const pastCourses = []
  const instructorCourses = []
  const upcomingCourses = []

  const userCourseIds = userCourses.map(userCourse => userCourse.courseId)

  const allCourses =
    userCourseIds.length > 0
      ? await connect()
          .createQueryBuilder('course')
          .where('course.id IN (:...ids)', { ids: userCourseIds })
          .andWhere('course.deletedAt IS NULL')
          .getMany()
      : []

  for (const course of allCourses) {
    const userCourse = userCourses.find(userCourse => userCourse.courseId === course.id)
    switch (true) {
      case course.startDate > date:
        upcomingCourses.push(course)
        break
      case course.endDate < date:
        pastCourses.push(course)
        break
      case userCourse && userCourse.role === 'instructor':
        instructorCourses.push(course)
        break
      default:
        activeCourses.push(course)
    }
  }

  return { activeCourses, pastCourses, instructorCourses, upcomingCourses }
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByUser,
}
