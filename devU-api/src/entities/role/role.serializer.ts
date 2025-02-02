import { Role } from 'devu-shared-modules'

import RoleModel from './role.model'

export function serialize(role: RoleModel): Role {
  return {
    id: role.id,
    createdAt: role.createdAt.toISOString(),
    updatedAt: role.updatedAt.toISOString(),
    name: role.name,

    enrolled: role.enrolled,
    courseEdit: role.courseEdit,
    courseViewAll: role.courseViewAll,
    assignmentViewAll: role.assignmentViewAll,
    assignmentEditAll: role.assignmentEditAll,
    assignmentViewReleased: role.assignmentViewReleased,
    scoresViewAll: role.scoresViewAll,
    scoresEditAll: role.scoresEditAll,
    scoresViewSelfReleased: role.scoresViewSelfReleased,
    roleEditAll: role.roleEditAll,
    roleViewAll: role.roleViewAll,
    roleViewSelf: role.roleViewSelf,
    submissionCreateAll: role.submissionCreateAll,
    submissionChangeState: role.submissionChangeState,
    submissionCreateSelf: role.submissionCreateSelf,
    submissionViewAll: role.submissionViewAll,
    userCourseEditAll: role.userCourseEditAll,
    stickyNoteViewAll: role.stickyNoteViewAll,
    stickyNoteEditAll: role.stickyNoteEditAll,
  }
}
