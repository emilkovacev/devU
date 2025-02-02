import { Assignment } from 'devu-shared-modules'

import AssignmentModel from './assignment.model'

export function serialize(assignment: AssignmentModel): Assignment {
  return {
    id: assignment.id,
    courseId: assignment.courseId,
    name: assignment.name,
    startDate: assignment.startDate.toISOString(),
    dueDate: assignment.dueDate.toISOString(),
    endDate: assignment.endDate.toISOString(),
    categoryName: assignment.categoryName,
    description: assignment.description,
    maxFileSize: assignment.maxFileSize,
    maxSubmissions: assignment.maxSubmissions,
    disableHandins: assignment.disableHandins,
    createdAt: assignment.createdAt.toISOString(),
    updatedAt: assignment.updatedAt.toISOString(),
    attachmentsHashes: assignment.attachmentsHashes,
    attachmentsFilenames: assignment.attachmentsFilenames
  }
}
