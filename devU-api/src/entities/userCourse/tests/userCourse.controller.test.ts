import { UpdateResult } from 'typeorm'

import { UserCourse } from 'devu-shared-modules'

import controller from '../userCourse.controller'

import UserCourseModel from '../userCourse.model'

import UserCourseService from '../userCourse.service'

import { serialize } from '../userCourse.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedUserCourses: UserCourseModel[]
let mockedUserCourse: UserCourseModel
let expectedResults: UserCourse[]
let expectedResult: UserCourse
let expectedError: Error
let expectedUserId: number

let expectedDbResult: UpdateResult

describe('UserCourseController', () => {
  beforeEach(() => {
    expectedUserId = 1234

    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    req.currentUser.userId = expectedUserId

    mockedUserCourses = Testing.generateTypeOrmArray(UserCourseModel, 3)
    mockedUserCourse = Testing.generateTypeOrm(UserCourseModel)

    expectedResults = mockedUserCourses.map(serialize)
    expectedResult = serialize(mockedUserCourse)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /user-courses', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        UserCourseService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedUserCourses))
        req.params.id = expectedUserId
        await controller.get(req, res, next) // what we're testing
      })

      test('UserId is passed to UserCourseService', () => expect(UserCourseService.list).toBeCalledWith(expectedUserId))
      test('Returns list of userCourses', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        UserCourseService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /user-course/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        UserCourseService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedUserCourse))
        await controller.detail(req, res, next)
      })

      test('Returns expected user', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        UserCourseService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing userCourse', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing userCourse', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing userCourse', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        UserCourseService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /user-course', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        UserCourseService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedUserCourse))
        await controller.post(req, res, next)
      })

      test('Returns expected user', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        UserCourseService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.post(req, res, next)

          fail('Expected test to throw')
        } catch {
          // continue to tests
        }
      })

      test('Status code is 400', () => expect(res.status).toBeCalledWith(400))
      test('Responds with generic error', () =>
        expect(res.json).toBeCalledWith(new GenericResponse(expectedError.message)))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })
  })

  describe('PUT - /user-course/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        UserCourseService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        UserCourseService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        UserCourseService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /user-course/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        UserCourseService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        UserCourseService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        UserCourseService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
