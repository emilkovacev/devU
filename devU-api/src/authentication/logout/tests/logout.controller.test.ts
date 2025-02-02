import Logout from '../logout.controller'

import { refreshToken } from '../../../utils/cookie.utils'
import Testing from '../../../utils/testing.utils'

let req: any
let res: any
let next: any

describe('Logout', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()
  })

  describe('GET - /logout', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        await Logout(req, res, next) // testing logout
      })
      test('Status code is 200', () => expect(res.status).toHaveBeenCalledWith(200))
      test('clearCookie has been called with "refreshToken" ', () =>
        expect(res.clearCookie).toHaveBeenCalledWith(refreshToken))
    })
  })
})
