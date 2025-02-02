// Libraries
import express from 'express'

// Middleware
import validator from '../submissionProblemScore/submissionProblemScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import SubmissionProblemScoreController from '../submissionProblemScore/submissionProblemScore.controller'

const Router = express.Router({ mergeParams: true })

// TODO: get by assignment and user

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission/:{submissionId}/submission-problem-scores:
 *   get:
 *    summary: Retrieve a list of submission problem scores belonging to a submission by submission id
 *    tags:
 *      - SubmissionProblemScores
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: submissionId
 *        description: Enter Submission Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get(
  '/submission/:submissionId',
  asInt('submissionId'),
  isAuthorized('enrolled'),
  SubmissionProblemScoreController.get
)
// TODO: scoresViewAll or scoresViewSelfReleased by the submission owner

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-problem-scores/detail/{id}:
 *   get:
 *     summary: Retrieve a single submission problem score
 *     tags:
 *       - SubmissionProblemScores
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter SubmissionProblemScore Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/detail/:id', isAuthorized('enrolled'), asInt(), SubmissionProblemScoreController.detail)
// TODO: scoresViewAll or scoresViewSelfReleased by the submission problem score

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-problem-scores:
 *   post:
 *     summary: Create a submission problem score
 *     tags:
 *       - SubmissionProblemScores
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionProblemScore'
 */
Router.post('/', isAuthorized('scoresEditAll'), validator, SubmissionProblemScoreController.post)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-problem-scores:
 *   put:
 *     summary: Update a submission problem score
 *     tags:
 *       - SubmissionProblemScores
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
 *             $ref: '#/components/schemas/SubmissionProblemScore'
 */
Router.put('/:id', isAuthorized('scoresEditAll'), asInt(), validator, SubmissionProblemScoreController.put)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submission-problem-scores/{id}:
 *   delete:
 *     summary: Delete a submission problem score
 *     tags:
 *       - SubmissionProblemScores
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
Router.delete('/:id', isAuthorized('scoresEditAll'), asInt(), SubmissionProblemScoreController._delete)

export default Router
