// Libraries
import express from 'express'

// Middleware
import validator from './submissionScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { extractOwnerByPathParam, isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import SubmissionScoreController from './submissionScore.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores:
 *   get:
 *     summary: Retrieve a list of submission score
 *     tags:
 *       - SubmissionScores
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized('enrolled'), SubmissionScoreController.get)
// TODO: Allow retrieving score by submission by the submission owner

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores/user/:userId:
 *   get:
 *     summary: Retrieve a list of the released submission scores by user
 *     tags:
 *       - SubmissionScores
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: false
 *         schema:
 *           type: integer
 */
Router.get(
  '/user/:userId',
  asInt('userId'),
  extractOwnerByPathParam('userId'),
  isAuthorized('scoresViewAll', 'scoresViewSelfReleased'),
  SubmissionScoreController.getByUser
)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores/{id}:
 *   get:
 *     summary: Retrieve a single submission score
 *     tags:
 *       - SubmissionScores
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
Router.get('/:id', isAuthorized('scoresViewAll'), asInt(), SubmissionScoreController.detail)
// TODO:.. self or all

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores:
 *   post:
 *     summary: Create a submission score
 *     tags:
 *       - SubmissionScores
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionScore'
 */
Router.post('/', isAuthorized('scoresEditAll'), validator, SubmissionScoreController.post)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores:
 *   put:
 *     summary: Update a submission score
 *     tags:
 *       - SubmissionScores
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
 *             $ref: '#/components/schemas/SubmissionScore'
 */
Router.put('/:id', isAuthorized('scoresEditAll'), asInt(), validator, SubmissionScoreController.put)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-scores/{id}:
 *   delete:
 *     summary: Delete a submission score
 *     tags:
 *       - SubmissionScores
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
Router.delete('/:id', isAuthorized('scoresEditAll'), asInt(), SubmissionScoreController._delete)

export default Router
