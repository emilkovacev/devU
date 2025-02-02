import { UserCourse } from 'devu-shared-modules'

import UserCourseModel from './userCourse.model'

export function serialize(userCourse: UserCourseModel): UserCourse {
  return {
    id: userCourse.id,
    userId: userCourse.userId,
    courseId: userCourse.courseId,
    role: userCourse.role,
    dropped: userCourse.dropped,
    createdAt: userCourse.createdAt.toISOString(),
    updatedAt: userCourse.updatedAt.toISOString(),
  }
}
