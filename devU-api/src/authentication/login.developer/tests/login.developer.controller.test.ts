import controller from '../login.developer.controller'

import UserModel from '../../../entities/user/user.model'

import UserService from '../../../entities/user/user.service'
import AuthService from '../../authentication.service'

import Testing from '../../../utils/testing.utils'
import { refreshCookieOptions } from '../../../utils/cookie.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedUser: UserModel
let expectedResult: { user: UserModel }
let refreshToken: string = 'pretendRefreshToken'
let expectedError = new Error('Some error')

describe('LoginDeveloperController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedUser = Testing.generateTypeOrm(UserModel)
    expectedResult = { user: mockedUser }
  })

  describe('POST - /login/developer/callback', () => {
    beforeEach(() => {
      UserService.ensure = jest.fn().mockImplementation(() => Promise.resolve(expectedResult))
      AuthService.createRefreshToken = jest.fn().mockImplementation(() => refreshToken)
    })

    describe('200 - Ok', () => {
      beforeEach(async () => {
        await controller.callback(req, res, next)
      })

      test('Returns refreshToken as cookie', () =>
        expect(res.cookie).toBeCalledWith('refreshToken', refreshToken, refreshCookieOptions))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Generic response returned ', () =>
        expect(res.json).toBeCalledWith({
          message: 'Login successful',
          userId: 1,
        }))
    })

    describe('400 - Bad Request', () => {
      test('Next called with err if user service fails', async () => {
        UserService.ensure = jest.fn().mockImplementation(() => {
          throw expectedError
        })

        await controller.callback(req, res, next)

        expect(next).toHaveBeenCalledWith(expectedError)
      })

      test('Next called with err if auth service fails', async () => {
        AuthService.createRefreshToken = jest.fn().mockImplementation(() => {
          throw expectedError
        })

        await controller.callback(req, res, next)

        expect(next).toHaveBeenCalledWith(expectedError)
      })
    })
  })
})
