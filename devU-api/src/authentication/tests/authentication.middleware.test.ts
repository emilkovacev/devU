import { AccessToken, RefreshToken } from 'devu-shared-modules'

import environment from '../../environment'

import { isAuthenticated, isValidRefreshToken, isRefreshNearingExpiration } from '../authentication.middleware'

import AuthService from '../authentication.service'

import Testing from '../../utils/testing.utils'
import { Unauthorized } from '../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let expectedAccessToken: AccessToken = { userId: 1, email: '' }
let expectedRefreshToken: RefreshToken = { userId: 1, isRefreshToken: true }
// let expectedError = new Error('Some error')

describe('AuthMiddleware', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    req.headers.authorization = 'Bearer heehee.nottoken'
  })

  describe('isAuthenticated', () => {
    describe('Authorization Successful', () => {
      beforeEach(async () => {
        AuthService.validateJwt = jest.fn().mockImplementation(<AccessToken>() => expectedAccessToken)

        await isAuthenticated(req, res, next)
      })

      test('Expect access token to be added to req', () => expect(req.currentUser).toEqual(expectedAccessToken))

      test('Expect next to be called on successful token validation', async () => expect(next).toHaveBeenCalled())
      test('Next is called', () => expect(next).toHaveBeenCalledTimes(1))
    })

    describe('Authorization Failure', () => {
      test('Missing authorization header', async () => {
        delete req.headers.authorization
        await isAuthenticated(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(next).toHaveBeenCalledTimes(0)
      })

      test('Missing Bearer', async () => {
        req.headers.authorization = 'NotBearer and.a.fake.token'
        await isAuthenticated(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(next).toHaveBeenCalledTimes(0)
      })

      test('Missing Token', async () => {
        req.headers.authorization = 'Bearer' // missing token
        await isAuthenticated(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(next).toHaveBeenCalledTimes(0)
      })
      test('Invalid token', async () => {
        AuthService.validateJwt = jest.fn().mockImplementation(<AccessToken>() => null)
        await isAuthenticated(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('isValidRefreshToken', () => {
    describe('Validate via cookies', () => {
      beforeEach(() => (req.headers.authorization = undefined)) // no header on cookies requests
      describe('Authorization Successful', () => {
        beforeEach(async () => {
          AuthService.validateJwt = jest.fn().mockImplementation(<RefreshToken>() => expectedRefreshToken)
          await isValidRefreshToken(req, res, next)
        })

        test('Refresh token added to req', () => expect(req.refreshUser).toEqual(expectedRefreshToken))
        test('Next called with no parameters', () => expect(next).toBeCalledWith())
      })

      describe('Authorization Failure', () => {
        beforeEach(async () => {
          AuthService.validateJwt = jest.fn().mockImplementation(<RefreshToken>() => null)
          await isValidRefreshToken(req, res, next)
        })

        test('Status set to 401', () => expect(res.status).toHaveBeenCalledWith(401))
        test('Unauthorized returned as response', () => expect(res.json).toHaveBeenCalledWith(Unauthorized))
        test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
      })
    })

    describe('Validate via header', () => {
      describe('Authorization Successful', () => {
        beforeEach(async () => {
          AuthService.validateJwt = jest.fn().mockImplementation(<RefreshToken>() => expectedRefreshToken)
          await isValidRefreshToken(req, res, next)
        })

        test('Refresh token added to req', () => expect(req.refreshUser).toEqual(expectedRefreshToken))
        test('Next called with no parameters', () => expect(next).toBeCalledWith())
      })

      describe('Authorization Failure', () => {
        beforeEach(async () => {
          AuthService.validateJwt = jest.fn().mockImplementation(<RefreshToken>() => null)
          await isValidRefreshToken(req, res, next)
        })

        test('Status set to 401', () => expect(res.status).toHaveBeenCalledWith(401))
        test('Unauthorized returned as response', () => expect(res.json).toHaveBeenCalledWith(Unauthorized))
        test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
      })
    })
  })

  describe('isRefreshNearingExpiration', () => {
    beforeEach(() => {
      environment.refreshTokenExpirationBufferSeconds = 20 // seconds
    })
    test('Expiration within buffer acts as expired', async () => {
      const nowInEpoch = Math.round(Date.now() / 1000)
      req.refreshUser = { exp: nowInEpoch + 10 } // expires 10 seconds from now

      await isRefreshNearingExpiration(req, res, next)

      expect(res.setHeader).toBeCalledWith('x-nearing-expiration', 'true')
      expect(next).toBeCalledWith()
    })

    test('Token does not act as if expired when expiration is outside of buffer window', async () => {
      const nowInEpoch = Math.round(Date.now() / 1000)
      req.refreshUser = { exp: nowInEpoch + 30 } // expires 30 seconds from now

      await isRefreshNearingExpiration(req, res, next)

      expect(next).toBeCalledWith()
    })
  })
})
