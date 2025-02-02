import { Request, Response, NextFunction } from 'express'
import { User } from 'devu-shared-modules'

import environment from '../../environment'

import UserService from '../../entities/user/user.service'
import AuthService from '../authentication.service'

import { samlStrategy } from '../../utils/passport/saml.passport'
import { refreshCookieOptions } from '../../utils/cookie.utils'

export async function callback(req: Request, res: Response, next: NextFunction) {
  try {
    const samlUser = req.user as User

    const { user } = await UserService.ensure(samlUser)

    const refreshToken = AuthService.createRefreshToken(user)

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    res.redirect(environment.clientUrl)
  } catch (err) {
    next(err)
  }
}

export async function generateMetadata(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .type('application/xml')
      .status(200)
      .send(
        samlStrategy.generateServiceProviderMetadata(
          environment.providers.saml.encryption.certificate,
          environment.providers.saml.signing.certificate
        )
      )
  } catch (err) {
    next(err)
  }
}

export default {
  callback,
  generateMetadata,
}
