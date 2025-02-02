// Libraries
import express from 'express'

// Middleware
import validator from './assignmentProblem.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import AssignmentProblemController from './assignmentProblem.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/assignment-problems:
 *   get:
 *     summary: Retrieve a list of assignment problems belonging to an assignment by assignment id
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: assignmentId
 *         description: Enter Assignment Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/', isAuthorized('enrolled'), AssignmentProblemController.get)
// Router.get('/', isAuthorizedByAssignmentStatus, asInt(), AssignmentProblemController.get)
// TODO: assignment released status

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/assignment-problems/{id}:
 *   get:
 *     summary: Retrieve a single assignment problem's details
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter AssignmentProblem Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized('assignmentEditAll'), asInt(), AssignmentProblemController.detail)
// Router.get('/:id', isAuthorizedByAssignmentStatus, asInt(), AssignmentProblemController.detail)
// TODO: assignment released status

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/assignment-problems:
 *   post:
 *     summary: Create an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.post('/', isAuthorized('assignmentEditAll'), validator, AssignmentProblemController.post)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/assignment-problems:
 *   put:
 *     summary: Update an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.put('/:id', isAuthorized('assignmentEditAll'), asInt(), validator, AssignmentProblemController.put)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/assignment-problems/{id}:
 *   delete:
 *     summary: Delete an assignment problem
 *     tags:
 *       - AssignmentProblems
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentProblem'
 */
Router.delete('/:id', isAuthorized('assignmentEditAll'), asInt(), AssignmentProblemController._delete)

export default Router
