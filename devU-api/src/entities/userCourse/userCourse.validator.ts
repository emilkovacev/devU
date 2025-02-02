import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const userId = check('userId').isNumeric()
const courseId = check('courseId').isNumeric()
const dropped = check('dropped').isBoolean()

// TODO: Check if role is valid for the course
const role = check('role')

const validator = [userId, courseId, role, dropped, validate]

export default validator
