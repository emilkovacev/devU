import { UpdateResult } from 'typeorm'

import { Assignment } from 'devu-shared-modules'

import controller from '../assignment.controller'

import AssignmentModel from '../assignment.model'

import AssignmentService from '../assignment.service'

import { serialize } from '../assignment.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedAssignments: AssignmentModel[]
let mockedAssignment: AssignmentModel
let expectedResults: Assignment[]
let expectedResult: Assignment
let expectedError: Error

let expectedDbResult: UpdateResult

function populateAssignment(assignment: AssignmentModel) {
  assignment.startDate = new Date()
  assignment.endDate = new Date()
  assignment.dueDate = new Date()

  return assignment
}

describe('AssignmentController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedAssignments = Testing.generateTypeOrmArray(AssignmentModel, 3).map(populateAssignment)
    mockedAssignment = populateAssignment(Testing.generateTypeOrm(AssignmentModel))

    expectedResults = mockedAssignments.map(serialize)
    expectedResult = serialize(mockedAssignment)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /assignments', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        AssignmentService.listByCourse = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignments))
        await controller.getByCourse(req, res, next) // what we're testing
      })

      test('Returns list of assignments', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        AssignmentService.listByCourse = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.getByCourse(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /assignments/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        AssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignment))
        await controller.detail(req, res, next)
      })

      test('Returns expected assignment', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        AssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing assignment', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing assignment', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing assignment', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      test('Next called with expected error', async () => {
        AssignmentService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /assignments/', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        AssignmentService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignment))
        await controller.post(req, res, next)
      })

      test('Returns expected assignment', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /assignments/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking service return shape
        AssignmentService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 // No records affected in db
        AssignmentService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /assignments/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        AssignmentService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        AssignmentService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
