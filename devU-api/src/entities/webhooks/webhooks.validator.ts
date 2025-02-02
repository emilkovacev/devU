import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'


const destinationUrl = check('destinationUrl').isString().trim()
const matcherUrl = check('matcherUrl').isString().trim()


const validator = [
  destinationUrl,
  matcherUrl,
  validate,
]

export default validator
