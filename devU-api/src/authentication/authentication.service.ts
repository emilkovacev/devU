import jws from 'jws'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'

import { AccessToken, RefreshToken } from 'devu-shared-modules'

import environment from '../environment'

import UserModel from '../entities/user/user.model'

const signingKey = environment.keys[environment.activeKeyId].privateKey

function getVerificationKey(kid?: string) {
  if (!kid || !environment.keys[kid]) throw new Error('Invalid key id')

  return environment.keys[kid].publicKey
}

// TODO - Add jwtid to refresh tokens for revocation ability in the future
// or add rev_sig (hashed value of some fields that revoke tokens if any change)
const jwtOptions: SignOptions & VerifyOptions = {
  issuer: 'devU-auth',
  audience: ['devU-api', 'devU-client'],
  keyid: environment.activeKeyId,
}

function createToken(payload: AccessToken | RefreshToken, expiresIn: string) {
  const token = jwt.sign(payload, signingKey, {
    ...jwtOptions,
    expiresIn,
    algorithm: 'RS256',
    subject: `${payload.userId}`,
  })

  return token
}

export function createAccessToken(user: UserModel): string {
  const payload: AccessToken = { userId: user.id, email: user.email }
  return createToken(payload, `${environment.accessTokenValiditySeconds}s`)
}

export function createRefreshToken(user: UserModel): string {
  const payload: RefreshToken = { userId: user.id, isRefreshToken: true }
  return createToken(payload, `${environment.refreshTokenValiditySeconds}s`)
}

export function validateJwt<TokenType>(token: string): TokenType | null {
  try {
    // @ts-ignore
    const verificationKey = getVerificationKey(jws.decode(token).header.kid)
    const payload: unknown = jwt.verify(token, verificationKey, { ...jwtOptions, algorithms: ['RS256'] })

    return payload as TokenType
  } catch (_err) {
    return null
  }
}

export default {
  createAccessToken,
  createRefreshToken,
  validateJwt,
}
