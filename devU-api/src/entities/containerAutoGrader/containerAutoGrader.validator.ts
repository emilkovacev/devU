import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()

const graderFile = check('graderFile')
  .optional({ nullable: true })
  .custom(({ req }) => {
    const file = req?.files['grader']
    if (file !== null) {
      if (file.size <= 0) {
        throw new Error('File is empty')
      }
    } else {
      throw new Error('does not have grader file')
    }
  })
  .withMessage('Grader file is required')

const makefileFile = check('makefileFile')
  .optional({ nullable: true })
  .custom(({ req }) => {
    const file = req.files['makefile']
    if (file !== null) {
      if (file.size <= 0) {
        throw new Error('File is empty')
      }
    }
  })

const autogradingImage = check('autogradingImage').isString()

const timeout = check('timeout')
  .isNumeric()
  .custom(value => value > 0)
  .withMessage('Timeout should be a positive integer')

const validator = [assignmentId, graderFile, makefileFile, autogradingImage, timeout, validate]

export default validator
