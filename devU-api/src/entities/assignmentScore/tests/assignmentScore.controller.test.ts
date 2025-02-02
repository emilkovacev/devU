import { UpdateResult } from 'typeorm'

import { AssignmentScore } from 'devu-shared-modules'

import controller from '../assignmentScore.controller'

import AssignmentScoresModel from '../assignmentScore.model'

import AssignmentScoreService from '../assignmentScore.service'

import { serialize } from '../assignmentScore.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

//Testing Globals
let req: any
let res: any
let next: any

let mockedAssignmentScore: AssignmentScoresModel
let expectedResult: AssignmentScore
let expectedError: Error

let expectedDbResult: UpdateResult

describe('AssignmentScoreController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    // mockedAssignmentScores = Testing.generateTypeOrmArray(AssignmentScoresModel, 3)
    mockedAssignmentScore = Testing.generateTypeOrm(AssignmentScoresModel)

    expectedResult = serialize(mockedAssignmentScore)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /assignment-score/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        AssignmentScoreService.retrieve = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignmentScore))
        await controller.detail(req, res, next)
      })

      test('Returns expected assignmentScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        AssignmentScoreService.retrieve = jest.fn().mockImplementation(() => Promise.resolve()) // No results
        await controller.detail(req, res, next)
      })

      test('Status code is 404 on missing assignmentScore', () => expect(res.status).toBeCalledWith(404))
      test('Responds with NotFound on missing assignmentScore', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called on missing assignmentScore', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Requesst', () => {
      test('Next called with expected error', async () => {
        AssignmentScoreService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('Post - /assignment-score', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        AssignmentScoreService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedAssignmentScore))
        await controller.post(req, res, next)
      })

      test('Returns expected assignmentScore', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentScoreService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))

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

  describe('PUT - /assignment-score/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1 // mocking serice return shape
        AssignmentScoreService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Updated message', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0 //No records afected in db
        AssignmentScoreService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns Not found message', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toHaveBeenCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentScoreService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /assignment-score/:id', () => {
    describe('204 - No Content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        AssignmentScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status coe is 204', () => expect(res.status).toBeCalledWith(204))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not Found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        AssignmentScoreService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        AssignmentScoreService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next called with expected error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
