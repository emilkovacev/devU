import { Request, Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator'
import { User } from 'devu-shared-modules'

import validate from '../../middleware/validator/generic.validator'
import environment from '../../environment'

const email = check('email').isString().trim().isEmail()
const externalId = check('externalId').isString().trim()

export const validateDeveloper = [email, externalId, validate]

function forcePassportAuthToBody(req: Request, res: Response, next: NextFunction) {
  const callbackUser = req.user as User

  // express-validator only checks the body/headers/cookies/params/query so we have to set passports info
  // onto the body (or the others listed) to use express-validator validation
  req.body.email = callbackUser.email
  req.body.externalId = callbackUser.externalId

  next()
}

function callbackValidator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (errors.isEmpty()) return next()

  return res.redirect(
    `${environment.clientUrl}/authProviderError?message=Invalid email or externalId provided by auth provider`
  )
}

export const authCallbackValidator = [forcePassportAuthToBody, email, externalId, callbackValidator]
