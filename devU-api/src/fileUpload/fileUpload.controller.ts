import { NextFunction, Request, Response } from 'express'

import FileUploadService from './fileUpload.service'
import { serialize } from './fileUpload.serializer'
import { fileUploadTypes } from '../../devu-shared-modules'

import { GenericResponse, NotFound } from '../utils/apiResponse.utils'
import { mappingFieldWithBucket } from '../utils/fileUpload.utils'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = req.params.bucketName
    const fileList = await FileUploadService.list(bucketName)

    res.status(200).json(fileList)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = req.params.bucketName
    const fileName = req.params.fileName
    const file: Buffer = await FileUploadService.retrieve(bucketName, fileName)

    if (!file) return res.status(404).json(NotFound)

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Length', file.length)
    res.send(file)
  } catch (err) {
    next(err)
  }
}

/*
  This function is deciding which bucket to upload the file
  however, it only supports one bucket at the moment.
  It can be updated to support multiple buckets in the future

  Marking for discussion
 */
export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser?.userId) return res.status(400).json(new GenericResponse('Request requires auth'))
    if (!req.files) return res.status(400).json(new GenericResponse('No file uploaded'))

    const files = req.files as { [fileType: string]: Express.Multer.File[] }
    if (!files)
      return res.status(400).json(new GenericResponse('Must upload files as an object wih the filetype as keys'))
    // Input field name needs to update to adjust new pattern of bucket names
    const inputFileField = fileUploadTypes.find(type => files[type])
    if (inputFileField === undefined) return res.status(403).json(new GenericResponse('File type not supported'))
    const bucketName = mappingFieldWithBucket(inputFileField)
    const userId = req.currentUser?.userId

    const fileUpload = await FileUploadService.create(files[inputFileField], bucketName, userId)

    const response = serialize(fileUpload)

    res.status(201).json(response)
  } catch (err: any) {
    res.status(400).json(new GenericResponse(err.message))
  }
}

export default {
  get,
  detail,
  post,
}
