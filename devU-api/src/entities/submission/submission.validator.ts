import { check } from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const assignmentId = check('assignmentId').isNumeric()
const courseId = check('courseId').isNumeric()
const content = check('content').isString()

const file = check('file')
  .optional({ nullable: true })
  .custom((value, { req }) => {
    if (req.file !== null) {
      if (req.file.size == 0) {
        throw new Error('File is empty')
      }
    }
  })

const validator = [courseId, assignmentId, content, file, validate]

export default validator
