import { UpdateResult } from 'typeorm'

import { NonContainerAutoGrader } from 'devu-shared-modules'

import controller from '../nonContainerAutoGrader.controller'

import NonContainerAutoGraderModel from '../nonContainerAutoGrader.model'

import NonContainerAutoGraderService from '../nonContainerAutoGrader.service'

import { serialize } from '../nonContainerAutoGrader.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedNonContainerAutoGraders: NonContainerAutoGraderModel[]
let mockedNonContainerAutoGrader: NonContainerAutoGraderModel
let expectedResults: NonContainerAutoGrader[]
let expectedResult: NonContainerAutoGrader
let expectedError: Error

let expectedDbResult: UpdateResult

describe('NonContainerAutoGraderController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedNonContainerAutoGraders = Testing.generateTypeOrmArray(NonContainerAutoGraderModel, 3)
    mockedNonContainerAutoGrader = Testing.generateTypeOrm(NonContainerAutoGraderModel)

    expectedResults = mockedNonContainerAutoGraders.map(serialize)
    expectedResult = serialize(mockedNonContainerAutoGrader)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  // test auto graders by assignmentID
  describe('GET - /nonContainerAutoGrader', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.list = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedNonContainerAutoGraders))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of nonContainerAutoGrader', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        NonContainerAutoGraderService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /nonContainerAutoGrader/byAssignmentID/:assignmentId', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.listByAssignmentId = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedNonContainerAutoGraders))
        await controller.getByAssignmentId(req, res, next) // what we're testing
      })

      test('Returns list of nonContainerAutoGrader', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.listByAssignmentId = jest.fn().mockImplementation(() => Promise.resolve())
        await controller.getByAssignmentId(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })
  })

  describe('GET - /nonContainerAutoGrader/byId/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.retrieve = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedNonContainerAutoGrader))
        await controller.detail(req, res, next)
      })

      test('Returns expected category', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing category', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing category', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing category', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        NonContainerAutoGraderService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /nonContainerAutoGrader/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.create = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedNonContainerAutoGrader))
        await controller.post(req, res, next)
      })

      test('Returns expected category', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /nonContainerAutoGrader/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        NonContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        NonContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /nonContainerAutoGrader/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        NonContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        NonContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        NonContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
