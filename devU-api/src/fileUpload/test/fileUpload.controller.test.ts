// import { FileUpload } from '../../../devu-shared-modules'
import controller from '../fileUpload.controller'
import FileUploadService from '../fileUpload.service'
import Testing from '../../utils/testing.utils'
import FileModel from '../fileUpload.model'

// Testing Globals
let req: any
let res: any
let next: any
let mockFile: any

let mockedFileUpload: FileModel
let expectedError: Error

describe('FileUploadController', () => {
  beforeEach(() => {
    req = Testing.fakeRequest()
    res = Testing.fakeResponse()
    next = Testing.fakeNext()
    mockFile = {
      studentSubmission: [
        {
          fieldname: 'studentSubmission',
          originalname: 'test.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          buffer: Buffer.from('Hello, world!', 'utf-8'),
          size: 13,
        },
      ],
    }
    mockedFileUpload = Testing.generateTypeOrm(FileModel)
    expectedError = new Error('Expected Error')
  })
  describe('GET - /file-upload/:bucketName', () => {
    describe('200 - Ok', () => {
      beforeEach(async () => {
        FileUploadService.list = jest.fn().mockImplementation(() => Promise.resolve(mockedFileUpload))
        req.files = mockFile
        await controller.get(req, res, next)
      })

      test('Status code is 200', () => expect(res.status).toBeCalledWith(200))
    })

    describe('400 - Bad request', () => {
      test('Next called with expected error', async () => {
        FileUploadService.list = jest.fn().mockImplementation(() => Promise.reject(expectedError))
        await controller.get(req, res, next) // what we're testing
        expect(next).toBeCalledWith(expectedError)
      })
    })
  })
  describe('POST - /file-upload', () => {
    describe('201 - Created', () => {
      beforeEach(async () => {
        req.files = mockFile
        FileUploadService.create = jest.fn().mockImplementation(() => Promise.resolve(mockedFileUpload))
        await controller.post(req, res, next)
      })
      test('Status code is 201', () => {
        expect(res.status).toBeCalledWith(201)
      })
    })
    describe('400 - Bad request', () => {
      beforeEach(async () => {
        req.files = undefined
        await controller.post(req, res, next)
      })
      test('Status code is 400', () => expect(res.status).toBeCalledWith(400))
    })

    describe('403 - Wrong file type', () => {
      beforeEach(async () => {
        req.files = {
          WrongType: [
            {
              fieldName: 'WrongType',
              originalName: 'test.txt',
              encoding: '7bit',
              mimetype: 'text/plain',
              buffer: Buffer.from('Hello, world!', 'utf-8'),
              size: 13,
            },
          ],
        }
        await controller.post(req, res, next)
      })
      test('Status code is 403', () => expect(res.status).toBeCalledWith(403))
    })
  })
})
