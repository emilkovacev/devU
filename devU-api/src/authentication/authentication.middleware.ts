import passport from 'passport'
import { Request, Response, NextFunction } from 'express'

import environment from '../environment'

import { AccessToken, RefreshToken } from 'devu-shared-modules'

import AuthService from './authentication.service'

import { GenericResponse, Unauthorized } from '../utils/apiResponse.utils'

function checkAuthentication<TokenType>(req: Request): [TokenType | null, GenericResponse | null] {
  const authorization = req.headers.authorization

  if (!authorization) return [null, new GenericResponse('Missing authentication headers')]

  const [type, token] = authorization.split(' ')

  if (type !== 'Bearer') return [null, new GenericResponse('Missing Bearer in authentication header')]
  if (!token) return [null, Unauthorized]

  const deserializedToken = AuthService.validateJwt<TokenType>(token)

  if (!deserializedToken) return [null, Unauthorized]

  return [deserializedToken, null]
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const [currentUser, error] = checkAuthentication<AccessToken>(req)

  if (!currentUser) return res.status(401).json(error)

  req.currentUser = currentUser

  next()
}

export async function isValidRefreshToken(req: Request, res: Response, next: NextFunction) {
  // If authorization header exists DON'T CHECK COOKIE AT ALL
  if (req.headers.authorization) {
    const [refreshToken, error] = checkAuthentication<RefreshToken>(req)

    if (!refreshToken) return res.status(401).json(error)
    // Because the refresh token and access token are signed the same way the access token
    // would be valid up to here. If the token isn't a refresh token kick back a 401
    if (!refreshToken.isRefreshToken) return res.status(401).json(new GenericResponse('Not a refresh token'))

    req.refreshUser = refreshToken

    return next()
  }

  // Check cookie
  const { refreshToken = '' } = req.cookies

  const deserializedToken = AuthService.validateJwt<RefreshToken>(refreshToken)

  if (!deserializedToken) return res.status(401).json(Unauthorized)

  req.refreshUser = deserializedToken

  next()
}

export async function isRefreshNearingExpiration(req: Request, res: Response, next: NextFunction) {
  if (!req.refreshUser?.exp) return res.status(401).json(Unauthorized)

  const nowEpochTime = Math.round(Date.now() / 1000)

  // If the difference in time between expiration and now is larger than the buffer time, continue
  // aka if our refresh token is outside of our buffer window, continue. Otherwise tell them
  // their token is nearing expiration
  if (environment.refreshTokenExpirationBufferSeconds > req.refreshUser.exp - nowEpochTime)
    res.setHeader('x-nearing-expiration', 'true')

  next()
}

export const saml = passport.authenticate('saml', { session: false })

export default {
  isAuthorized: isAuthenticated,
  isValidRefreshToken,
  isRefreshNearingExpiration,
}
