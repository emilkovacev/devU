import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const name = check('name').isString().trim().isLength({ max: 128 })
const courseId = check('courseId').isNumeric()

const validator = [name, courseId, validate]

export default validator
