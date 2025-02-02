import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import { UserCourse as UserCourseType } from 'devu-shared-modules'

import UserCourse from './userCourse.model'
import UserService from '../user/user.service'

const connect = () => dataSource.getRepository(UserCourse)

export async function create(userCourse: UserCourseType) {
  const userId = userCourse.userId
  const hasEnrolled = await connect().findOneBy({ userId, courseId: userCourse.courseId })

  if (hasEnrolled) throw new Error('User already enrolled in course')
  return await connect().save(userCourse)
}

// Add/drop students based on a list of users,
// to drop students, set the third param to true
export async function bulkAddDrop(userEmails: string[], courseId: number, drop: boolean) {
  const failed: string[] = []
  const success: string[] = []

  for (const email of userEmails) {
    const user = await UserService.retrieveByEmail(email)
    if (user === null) {
      failed.push(`${email} not found`)
      continue
    }

    const student: UserCourseType = {
      userId: user.id,
      role: 'student',
      courseId: courseId,
      dropped: drop,
    }

    try {
      if (!drop) {
        try {
          await create(student)
        } catch (error) {
            if (error instanceof Error && error.message === 'User already enrolled in course') {
              // update student drop to false, since they re-enrolled after being dropped
              await update(student)
            } else {
              throw error; // re-throw if it's a different error
            }
        }
        success.push(`${email} enrolled successfully`)
      } else {
        await update(student)
        success.push(`${email} dropped successfully`)
      }
    } catch (e) {
      console.error(`Error occurred while bulk add/drop ${e}`)
      failed.push(`${email}: ${e}`)
    }
  }

  return { 'success': JSON.stringify(success), 'failed': JSON.stringify(failed) }
}

export async function update(userCourse: UserCourseType) {
  const { courseId, role, dropped, userId } = userCourse
  if (!courseId) throw new Error('Missing course Id')
  const userCourseData = await connect().findOneBy({ courseId, userId: userId })
  if (!userCourseData) throw new Error('User not enrolled in course')
  userCourseData.role = role
  userCourseData.dropped = dropped
  if (!userCourseData.id) throw new Error('Missing Id')
  return await connect().update(userCourseData.id, userCourseData)
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
  bulkCreate: bulkAddDrop,
}
