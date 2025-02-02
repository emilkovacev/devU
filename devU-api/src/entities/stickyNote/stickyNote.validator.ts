import {check} from 'express-validator'

import validate from '../../middleware/validator/generic.validator'

const submissionId = check('submissionId').isNumeric()
const content = check('content').isString()

const validator = [submissionId, content, validate]

export default validator