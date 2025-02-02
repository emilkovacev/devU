import { Token } from 'devu-shared-modules'

import controller from '../login.controller'

import UserModel from '../../../entities/user/user.model'

import UserService from '../../../entities/user/user.service'
import AuthService from '../../authentication.service'
import ProviderService from '../../../provider/provider.service'

import Testing from '../../../utils/testing.utils'
import { Unauthorized } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedUser: UserModel
let expectedAccessToken: Token = { accessToken: 'encodedAccessToken' }
let expectedError = new Error('Some error')

describe('LoginController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    req.refreshUser = { userId: 1, isRefreshToken: true }

    mockedUser = Testing.generateTypeOrm(UserModel)
  })

  describe('GET - /login', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedUser))
        AuthService.createAccessToken = jest.fn().mockImplementation(() => expectedAccessToken.accessToken)

        await controller.login(req, res, next)
      })

      test('Returns access token', () => expect(res.json).toBeCalledWith(expectedAccessToken))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad Request', () => {
      test('Next called with err', async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.login(req, res, next)

        expect(next).toBeCalledWith(expectedError)
      })
    })

    describe('401 - Unauthorized', () => {
      test('Without decoded refresh token', async () => {
        req.refreshUser = undefined
        await controller.login(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith(Unauthorized)
      })
      test('Malformed (missing userId) refreshToken', async () => {
        delete req.refreshUser.userId
        await controller.login(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith(Unauthorized)
      })
      test('Unknown userId returned on refresh token', async () => {
        UserService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(undefined))
        await controller.login(req, res, next)

        expect(res.status).toBeCalledWith(401)
        expect(res.json).toBeCalledWith(Unauthorized)
      })
    })
  })

  describe('GET - /login/providers', () => {
    test('Returns providers', async () => {
      const expectedProviders = ['Mock Provider']

      ProviderService.get = jest.fn().mockImplementation(() => expectedProviders)
      await controller.getProviders(req, res, next)

      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledWith(expectedProviders)
    })

    test('Next called with err', async () => {
      ProviderService.get = jest.fn().mockImplementation(() => {
        throw expectedError
      })

      await controller.getProviders(req, res, next)

      expect(next).toBeCalledWith(expectedError)
    })
  })
})
