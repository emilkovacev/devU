import { GraderInfo, SubmissionScore, SubmissionProblemScore } from 'devu-shared-modules'

import controller from '../grader.controller'

import GraderService from '../grader.service'

import { serialize } from '../grader.serializer'

import Testing from '../../../utils/testing.utils'

import { GenericResponse } from '../../../utils/apiResponse.utils'

//THIS TEST FAILS,

// Testing Globals
let req: any
let res: any
let next: any

let expectedReturn = new Array()
let expectedResult: GraderInfo
let expectedError: Error

let expectedScore: SubmissionScore
let expectedProblemScore1: SubmissionProblemScore
let expectedProblemScore2: SubmissionProblemScore

describe('GraderController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    expectedReturn.push(expectedProblemScore1)
    expectedReturn.push(expectedProblemScore2)
    expectedReturn.push(expectedScore)
    expectedResult = serialize(expectedReturn)

    expectedError = new Error('Expected Error')
  })
  describe('POST - /grade/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        GraderService.grade = jest.fn().mockImplementation(() => Promise.resolve(expectedReturn))
        await controller.grade(req, res, next)
      })
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns Grading Info', () => expect(res.json).toBeCalledWith(expectedResult))
    })
    describe('400 - Bad Request', () => {
      beforeEach(async () => {
        GraderService.grade = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.grade(req, res, next)

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
})
