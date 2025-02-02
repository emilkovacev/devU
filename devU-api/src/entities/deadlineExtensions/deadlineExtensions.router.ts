// Libraries
import express from 'express'

// Middleware
import validator from './deadlineExtensions.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import DeadlineExtensionsController from './deadlineExtensions.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/deadline-extensions:
 *   get:
 *     summary: Retrieve all deadline-extensions
 *     tags:
 *       - DeadlineExtensionsModel
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized('assignmentViewAll'), DeadlineExtensionsController.get)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/deadline-extensions/{id}:
 *   get:
 *     summary: Retrieve a single Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
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
Router.get('/:id', isAuthorized('assignmentViewAll'), asInt(), DeadlineExtensionsController.detail)
// TODO: self or assignmentViewAll

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/deadline-extensions:
 *   post:
 *     summary: Create a Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/DeadlineExtensionsModel'
 */
Router.post('/', isAuthorized('assignmentEditAll'), validator, DeadlineExtensionsController.post)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/deadline-extensions/{id}:
 *   put:
 *     summary: Update a Deadline-Extensions
 *     tags:
 *       - DeadlineExtensionsModel
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
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/DeadlineExtensionsModel'
 */
Router.put('/:id', isAuthorized('assignmentEditAll'), asInt(), validator, DeadlineExtensionsController.put)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/deadline-extensions/{id}:
 *   delete:
 *     summary: Delete a Deadline-Extension
 *     tags:
 *       - DeadlineExtensionsModel
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
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), DeadlineExtensionsController._delete)

export default Router
