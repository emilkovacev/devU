import { Role } from 'devu-shared-modules'

const student: Role = {
  name: 'student',
  assignmentViewAll: false,
  assignmentEditAll: false,
  assignmentViewReleased: true,
  courseEdit: false,
  courseViewAll: false,
  enrolled: true,
  roleEditAll: false,
  roleViewAll: false,
  roleViewSelf: true,
  scoresEditAll: false,
  scoresViewAll: false,
  scoresViewSelfReleased: true,
  submissionChangeState: false,
  submissionCreateAll: false,
  submissionCreateSelf: true,
  submissionViewAll: false,
  stickyNoteViewAll: false,
  stickyNoteEditAll: false,
  userCourseEditAll: false,
}

const instructor: Role = {
  name: 'instructor',
  assignmentViewAll: true,
  assignmentEditAll: true,
  assignmentViewReleased: true,
  courseEdit: true,
  courseViewAll: true,
  enrolled: true,
  roleEditAll: true,
  roleViewAll: true,
  roleViewSelf: true,
  scoresEditAll: true,
  scoresViewAll: true,
  scoresViewSelfReleased: true,
  submissionChangeState: true,
  submissionCreateAll: true,
  submissionCreateSelf: true,
  submissionViewAll: true,
  stickyNoteViewAll: true,
  stickyNoteEditAll: true,
  userCourseEditAll: true,
}

const defaultRoles: Map<string, Role> = new Map()
defaultRoles.set('student', student)
defaultRoles.set('instructor', instructor)

export default defaultRoles
