import { check } from 'express-validator'
import validate from '../../middleware/validator/generic.validator'

const correctString = check('correctString').isString().trim().isLength({ max: 128 })
const question = check('question').isString().trim().isLength({ max: 128 })
const score = check('score').isNumeric()
const isRegex = check('isRegex').isBoolean()

const validator = [correctString, validate, question, score, isRegex]

export default validator
