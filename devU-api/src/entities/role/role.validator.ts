import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const name = check('name').isString()
const assignmentViewAll = check('assignmentViewAll').isBoolean()
const assignmentEditAll = check('assignmentEditAll').isBoolean()
const assignmentViewReleased = check('assignmentViewReleased').isBoolean()
const courseEdit = check('courseEdit').isBoolean()
const courseViewAll = check('courseViewAll').isBoolean()
const enrolled = check('enrolled').isBoolean()
const roleEditAll = check('roleEditAll').isBoolean()
const roleViewAll = check('roleViewAll').isBoolean()
const roleViewSelf = check('roleViewSelf').isBoolean()
const scoresEditAll = check('scoresEditAll').isBoolean()
const scoresViewAll = check('scoresViewAll').isBoolean()
const scoresViewSelfReleased = check('scoresViewSelfReleased').isBoolean()
const submissionChangeState = check('submissionChangeState').isBoolean()
const submissionCreateAll = check('submissionCreateAll').isBoolean()
const submissionCreateSelf = check('submissionCreateSelf').isBoolean()
const submissionViewAll = check('submissionViewAll').isBoolean()
const userCourseEditAll = check('userCourseEditAll').isBoolean()

const validator = [
  name,
  assignmentViewAll,
  assignmentEditAll,
  assignmentViewReleased,
  courseEdit,
  courseViewAll,
  enrolled,
  roleEditAll,
  roleViewAll,
  roleViewSelf,
  scoresEditAll,
  scoresViewAll,
  scoresViewSelfReleased,
  submissionChangeState,
  submissionCreateAll,
  submissionCreateSelf,
  submissionViewAll,
  userCourseEditAll,
  validate,
]

export default validator
