import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()
const userId = check('userId').isNumeric()
const score = check('score').isNumeric()

const validator = [assignmentId, userId, score, validate]

export default validator
