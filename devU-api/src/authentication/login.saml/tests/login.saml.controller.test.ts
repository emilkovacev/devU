import controller from '../login.saml.controller'

import UserModel from '../../../entities/user/user.model'

import UserService from '../../../entities/user/user.service'
import AuthService from '../../authentication.service'

import Testing from '../../../utils/testing.utils'
import { refreshCookieOptions } from '../../../utils/cookie.utils'
import generateSamlStrategy, { samlStrategy } from '../../../utils/passport/saml.passport'

// Testing Globals
let req: any
let res: any
let next: any

let mockedUser: UserModel
let expectedResult: { user: UserModel }
let expectedXml = '<p>Fake XML</p>'
let refreshToken = 'pretendRefreshToken'
let expectedError = new Error('Some error')

describe('LoginSamlController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    req.user = { email: 'samlresponse@mail.com' }

    mockedUser = Testing.generateTypeOrm(UserModel)
    expectedResult = { user: mockedUser }
  })

  describe('POST - /login/saml/callback', () => {
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
      test('Redirect to be called ', () => expect(res.redirect).toHaveBeenCalled())
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

  describe('GET - /login/saml/metadata', () => {
    beforeEach(generateSamlStrategy) // initializes saml strategy

    describe('200 - Ok', () => {
      beforeEach(async () => {
        samlStrategy.generateServiceProviderMetadata = jest.fn().mockImplementation(() => expectedXml)
        await controller.generateMetadata(req, res, next)
      })

      test('200 Status returned', () => expect(res.status).toHaveBeenCalledWith(200))
      test('Response matches XML', () => expect(res.send).toHaveBeenCalledWith(expectedXml))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error ', async () => {
        samlStrategy.generateServiceProviderMetadata = jest.fn().mockImplementation(() => {
          throw expectedError
        })

        await controller.generateMetadata(req, res, next)

        expect(next).toHaveBeenCalledWith(expectedError)
      })
    })
  })
})
