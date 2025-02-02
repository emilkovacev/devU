import express from 'express'
import multer, { Field } from 'multer'

import validator from './fileUpload.validator'

import FileUploadController from './fileUpload.controller'
import { fileUploadTypes } from '../../devu-shared-modules'
import { isAuthorized } from '../authorization/authorization.middleware'

const Router = express.Router({ mergeParams: true })
const upload = multer()

/*
  * This is a list of all the fields that can be uploaded
  * if you want to limit the file upload to a specific type, you can change the list here by
  * changing into the following lines:
   fileUploadTypes.map(name => ({
   if (name === 'fileTypeYouWantToLimitTo'){
    return {name, maxCount: Number}
   }
   return {name}
   })
 */
const fields: Field[] = fileUploadTypes.map(name => ({ name }))
/**
 * @swagger
 * /course/:courseId/file-upload/{bucketName}:
 *   get:
 *     summary: Retrieve a list of all files in the bucket
 */
Router.get('/:bucketName', isAuthorized('courseViewAll'), FileUploadController.get)

/**
 * @swagger
 * /course/:courseId/file-upload/{bucketName}/{fileName}:
 *   get:
 *     summary: Retrieve a single file from the bucket
 */
Router.get('/:bucketName/:fileName', isAuthorized('courseViewAll'), FileUploadController.detail)

/**
 * @swagger
 * /course/:courseId/file-upload/:
 *   post:
 *     summary: Upload a new file to the bucket
 */
Router.post('/', isAuthorized('enrolled'), upload.fields(fields), validator, FileUploadController.post)

export default Router
