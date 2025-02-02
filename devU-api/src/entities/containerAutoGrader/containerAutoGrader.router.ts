import express from 'express'
import multer from 'multer'

import validator from './containerAutoGrader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

import ContainerAutoGraderController from './containerAutoGrader.controller'

const Router = express.Router({ mergeParams: true })
const upload = multer()

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   get:
 *     summary: Retrieve a list of all container auto graders
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized('assignmentViewAll'), ContainerAutoGraderController.get)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   get:
 *     summary: Retrieve a single container auto grader
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized('assignmentViewAll'), asInt(), ContainerAutoGraderController.detail)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   get:
 *     summary: Retrieve an assignment's container auto grader
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/assignment/:id', asInt(), ContainerAutoGraderController.getObjectByAssignment)

/**
 * @swagger
 * /container-auto-graders:
 * /course/:courseId/assignment/:assignmentId/container-auto-graders:
 *   post:
 *     summary: Create a new container auto grader
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.post(
  '/',
  isAuthorized('assignmentEditAll'),
  upload.fields([{ name: 'graderFile' }, { name: 'makefileFile' }]),
  validator,
  ContainerAutoGraderController.post
)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   put:
 *     summary: Update a container auto grader's grader file and/or makefile
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ContainerAutoGrader'
 */
Router.put(
  '/:id',
  isAuthorized('assignmentEditAll'),
  asInt(),
  upload.fields([{ name: 'graderFile' }, { name: 'makefileFile' }]),
  validator,
  ContainerAutoGraderController.put
)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/container-auto-graders/{id}:
 *   delete:
 *     summary: Delete a container auto grader
 *     tags:
 *       - ContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), ContainerAutoGraderController._delete)

export default Router
