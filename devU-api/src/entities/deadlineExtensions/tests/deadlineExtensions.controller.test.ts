import { UpdateResult } from 'typeorm'

import { DeadlineExtensions } from 'devu-shared-modules'

import controller from '../deadlineExtensions.controller'

import DeadlineExtensionsModel from '../deadlineExtensions.model'

import DeadlineExtensionsService from '../deadlineExtensions.service'

import { serialize } from '../deadlineExtensions.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedDeadlineExtensions: DeadlineExtensionsModel[]
let mockedDeadlineExtension: DeadlineExtensionsModel
let expectedResults: DeadlineExtensions[]
let expectedResult: DeadlineExtensions
let expectedError: Error

let expectedDbResult: UpdateResult

function populateAssignment(extension: DeadlineExtensionsModel) {
  extension.deadlineDate = new Date()
  extension.newEndDate = new Date()
  extension.newStartDate = new Date()

  return extension
}

describe('Deadline Extensions', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedDeadlineExtensions = Testing.generateTypeOrmArray(DeadlineExtensionsModel, 3).map(populateAssignment)
    mockedDeadlineExtension = populateAssignment(Testing.generateTypeOrm(DeadlineExtensionsModel))

    expectedResults = mockedDeadlineExtensions.map(serialize)
    expectedResult = serialize(mockedDeadlineExtension)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /deadline-extensions', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedDeadlineExtensions))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of deadline-extensions', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        DeadlineExtensionsService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /deadline-extensions/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.retrieve = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedDeadlineExtension))
        await controller.detail(req, res, next)
      })

      test('Returns expected DeadlineExtension', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing DeadlineExtension', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing DeadlineExtension', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing DeadlineExtension', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        DeadlineExtensionsService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /deadline-extensions/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedDeadlineExtension))
        await controller.post(req, res, next)
      })

      test('Returns expected DeadlineExtension', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /deadline-extensions/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        DeadlineExtensionsService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        DeadlineExtensionsService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        DeadlineExtensionsService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /deadline-extensions/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        DeadlineExtensionsService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        DeadlineExtensionsService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        DeadlineExtensionsService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
