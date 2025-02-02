// Libraries
import express from 'express'

// Middleware
import validator from './nonContainerAutoGrader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import nonContainerQuestions from './nonContainerAutoGrader.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/non-container-auto-graders:
 *   get:
 *     summary: Retrieve a list of all nonContainerAutoGrader with the assignment ID
 *     tags:
 *       - NonContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/', isAuthorized('enrolled'), nonContainerQuestions.getByAssignmentId)
// TODO: Authorization set to enrolled temporarily, add proper authorization in context of retrieving questions on assignment detail page

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/non-container-auto-graders/byId/{id}:
 *   get:
 *     summary: Retrieve a single non container auto grader
 *     tags:
 *       - NonContainerAutoGraders
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
Router.get('/byId/:id', isAuthorized('assignmentViewAll'), asInt(), nonContainerQuestions.detail)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/non-container-auto-graders:
 *   post:
 *     summary: Create a question
 *     tags:
 *       - NonContainerAutoGraders
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/NonContainerAutoGrader'
 */
Router.post('/', isAuthorized('assignmentEditAll'), validator, nonContainerQuestions.post)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/non-container-auto-graders:
 *   put:
 *     summary: Update a question
 *     tags:
 *       - NonContainerAutoGraders
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
 *             $ref: '#/components/schemas/NonContainerAutoGrader'
 */
Router.put('/:id', isAuthorized('assignmentEditAll'), asInt(), validator, nonContainerQuestions.put)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/non-container-auto-graders/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags:
 *       - NonContainerAutoGraders
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
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), nonContainerQuestions._delete)

export default Router
