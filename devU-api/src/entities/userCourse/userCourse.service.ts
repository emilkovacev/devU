import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import { UserCourse as UserCourseType } from 'devu-shared-modules'

import UserCourse from './userCourse.model'

const connect = () => dataSource.getRepository(UserCourse)

export async function create(userCourse: UserCourseType) {
  const userId = userCourse.userId
  const hasEnrolled = await connect().findOneBy({ userId, courseId: userCourse.courseId })
  if (hasEnrolled) throw new Error('User already enrolled in course')
  return await connect().save(userCourse)
}

export async function update(userCourse: UserCourseType, currentUser: number) {
  const { courseId, role, dropped } = userCourse
  if (!courseId) throw new Error('Missing course Id')
  const userCourseData = await connect().findOneBy({ courseId, userId: currentUser })
  if (!userCourseData) throw new Error('User not enrolled in course')
  userCourseData.role = role
  userCourseData.dropped = dropped
  if (!userCourse.id) throw new Error('Missing Id')
  return await connect().update(userCourse.id, userCourseData)
}

export async function _delete(courseId: number, userId: number) {
  const userCourse = await connect().findOneBy({ courseId, userId })
  if (!userCourse) throw new Error('User Not Found in Course')
  return await connect().softDelete({ courseId, userId, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function retrieveByCourseAndUser(courseId: number, userId: number) {
  return await connect().findOneBy({ courseId: courseId, userId: userId, deletedAt: IsNull() })
}

export async function list(userId: number) {
  // TODO: look into/test this
  return await connect().findBy({ userId, deletedAt: IsNull() })
}
export async function listAll() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  // TODO: look into/test this
  return await connect().findBy({ courseId, deletedAt: IsNull() })
}

export async function listByUser(userId: number) {
  return await connect().findBy({ userId: userId, dropped: false, deletedAt: IsNull() })
}

export async function checkIfEnrolled(userId: number, courseId: number) {
  return await connect().findOneBy({ userId, courseId, dropped: false, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  retrieveByCourseAndUser,
  update,
  _delete,
  list,
  listAll,
  listByCourse,
  listByUser,
  checking: checkIfEnrolled,
}
