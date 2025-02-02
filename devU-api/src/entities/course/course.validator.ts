import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'
import { isAfterParam, isBeforeParam } from '../../middleware/validator/date.validator'

const name = check('name').isString().trim().isLength({ max: 128, min: 1 })

const number = check('number').isString().trim().isLength({ max: 128, min: 1 })
const startDate = check('startDate').isString().trim().isISO8601().custom(isBeforeParam('endDate')).toDate()
const endDate = check('endDate').isString().trim().isISO8601().custom(isAfterParam('startDate')).toDate()

const semester = check('semester')
  .isString()
  .trim()
  .matches(/(f|w|s|u)\d{4}$/)
  .withMessage('Semester expects to be in format u2021, f2021, s2022, w2022')

const validator = [name, semester, number, startDate, endDate, validate]

export default validator
