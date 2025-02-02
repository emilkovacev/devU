import { Course } from 'devu-shared-modules'

import CourseModel from './course.model'

export function serialize(course: CourseModel): Course {
  return {
    id: course.id,
    name: course.name,
    semester: course.semester,
    number: course.number,
    startDate: course.startDate.toISOString(),
    endDate: course.endDate.toISOString(),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    isPublic: course.isPublic,
    private_data: course.private_data ? course.private_data.toISOString() : undefined
  }
}
