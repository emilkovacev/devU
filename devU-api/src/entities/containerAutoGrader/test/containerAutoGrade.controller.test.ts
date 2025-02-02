import { UpdateResult } from 'typeorm'

import { ContainerAutoGrader } from 'devu-shared-modules'

import controller from '../containerAutoGrader.controller'

import ContainerAutoGraderModel from '../containerAutoGrader.model'

import ContainerAutoGraderService from '../containerAutoGrader.service'

import { serialize } from '../containerAutoGrader.serializer'

import Testing from '../../../utils/testing.utils'
import { GenericResponse, NotFound, Updated } from '../../../utils/apiResponse.utils'

// Testing Globals
let req: any
let res: any
let next: any

let mockedContainerAutoGraders: ContainerAutoGraderModel[]
let mockedContainerAutoGrader: ContainerAutoGraderModel
let expectedResults: ContainerAutoGrader[]
let expectedResult: ContainerAutoGrader
let expectedError: Error

let expectedDbResult: UpdateResult

describe('ContainerAutoGraderController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()

    mockedContainerAutoGraders = Testing.generateTypeOrmArray(ContainerAutoGraderModel, 3)
    mockedContainerAutoGrader = Testing.generateTypeOrm(ContainerAutoGraderModel)

    expectedResults = mockedContainerAutoGraders.map(serialize)
    expectedResult = serialize(mockedContainerAutoGrader)
    expectedError = new Error('Expected Error')

    expectedDbResult = {} as UpdateResult
  })

  describe('GET - /container-auto-graders', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.list = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedContainerAutoGraders))
        await controller.get(req, res, next) // what we're testing
      })

      test('Returns list of containerAutoGraders', () => expect(res.json).toBeCalledWith(expectedResults))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        ContainerAutoGraderService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.get(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('GET - /container-auto-graders/:id', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.retrieve = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedContainerAutoGrader))
        await controller.detail(req, res, next)
      })

      test('Returns containerAutoGrader', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('404 - Not found', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.retrieve = jest.fn().mockImplementation(() => Promise.resolve())
        await controller.detail(req, res, next)
      })

      test('Returns notfound', () => expect(res.json).toBeCalledWith(NotFound))
      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        ContainerAutoGraderService.retrieve = jest.fn().mockImplementation(() => Promise.reject(expectedError))

        try {
          await controller.detail(req, res, next)

          fail('Expected test to throw')
        } catch {
          expect(next).toBeCalledWith(expectedError)
        }
      })
    })
  })

  describe('POST - /container-auto-graders', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.create = jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedContainerAutoGrader))
        req.files = { graderFile: { name: 'graderFile' }, makefileFile: { name: 'makefileFile' } }
        await controller.post(req, res, next)
      })

      test('Returns containerAutoGrader', () => expect(res.json).toBeCalledWith(expectedResult))
      test('Status code is 201', () => expect(res.status).toBeCalledWith(201))
    })

    describe('400 - Bad request', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.create = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        req.files = { graderFile: { name: 'graderFile' }, makefileFile: { name: 'makefileFile' } }

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
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
    })
  })

  describe('PUT - /container-auto-graders/:id', () => {
    describe('200 - OK', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        ContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        req.files = { graderFile: { name: 'graderFile' }, makefileFile: { name: 'makefileFile' } }
        await controller.put(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
      test('Returns updated', () => expect(res.json).toBeCalledWith(Updated))
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('404 - Not found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        ContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        req.files = { graderFile: { name: 'graderFile' }, makefileFile: { name: 'makefileFile' } }
        await controller.put(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Returns notfound', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad request', () => {
      beforeEach(async () => {
        ContainerAutoGraderService.update = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        req.files = { graderFile: { name: 'graderFile' }, makefileFile: { name: 'makefileFile' } }
        await controller.put(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })

  describe('DELETE - /container-auto-graders/:id', () => {
    describe('204 - No content', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 1
        ContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 204', () => expect(res.status).toBeCalledWith(204))
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
      test('Response to have no content', () => expect(res.send).toBeCalledWith())
    })

    describe('404 - Not found', () => {
      beforeEach(async () => {
        expectedDbResult.affected = 0
        ContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.resolve(expectedDbResult))
        await controller._delete(req, res, next)
      })

      test('Status code is 404', () => expect(res.status).toBeCalledWith(404))
      test('Response to have no content', () => expect(res.json).toBeCalledWith(NotFound))
      test('Next is not called', () => expect(next).toBeCalledTimes(0))
    })

    describe('400 - Bad request', () => {
      beforeEach(async () => {
        ContainerAutoGraderService._delete = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller._delete(req, res, next)
      })

      test('Next is called with error', () => expect(next).toBeCalledWith(expectedError))
    })
  })
})
