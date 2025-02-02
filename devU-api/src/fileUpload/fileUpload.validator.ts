import { check } from 'express-validator'

import validate from '../middleware/validator/generic.validator'

/*
 * This file is a validator for the file upload routes.
 * It now only checks if the file is uploaded
 * It does not check the file type or size because this entity handles multiple files uploads
 * This can be added in the future
 */

const fileUploaded = check('files').custom((_value, { req }) => {
  if (!req.files) {
    throw new Error('No file uploaded')
  }
  return true
})

const validator = [fileUploaded, validate]

export default validator
