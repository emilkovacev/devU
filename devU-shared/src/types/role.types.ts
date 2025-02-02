export type Role = {
  id?: number
  createdAt?: string
  updatedAt?: string
  name: string
  assignmentViewAll: boolean
  assignmentEditAll: boolean
  assignmentViewReleased: boolean
  courseEdit: boolean
  courseViewAll: boolean
  enrolled: boolean
  roleEditAll: boolean
  roleViewAll: boolean
  roleViewSelf: boolean
  scoresEditAll: boolean
  scoresViewAll: boolean
  scoresViewSelfReleased: boolean
  submissionChangeState: boolean
  submissionCreateAll: boolean
  submissionCreateSelf: boolean
  submissionViewAll: boolean
  userCourseEditAll: boolean
  stickyNoteViewAll: boolean
  stickyNoteEditAll: boolean
}
