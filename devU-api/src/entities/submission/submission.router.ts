// Libraries
import express from 'express'
import Multer from 'multer'

// Middleware
import validator from '../submission/submission.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import SubmissionController from '../submission/submission.controller'
import { checkSubmissions } from './submission.middleware'

const Router = express.Router({ mergeParams: true })
const upload = Multer()

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions:
 *   get:
 *     summary: Retrieve a list of submissions
 *     authorization: submissionViewAll
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: user
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: assignment
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *
 */
Router.get('/', /*isAuthorized('submissionViewAll'),*/ SubmissionController.getByAssignment)
// TODO: Authorization

Router.get('/assignments/:assignmentId', asInt('assignmentId'), SubmissionController.getByAssignment)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions/{id}:
 *   get:
 *     summary: Retrieve a single submission
 *     tags:
 *       - Submissions
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
Router.get('/:id', isAuthorized('enrolled'), asInt(), SubmissionController.detail)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions/user/{userId}:
 *   get:
 *     summary: Retrieve submission by user
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/user/:userId', isAuthorized('enrolled'), asInt('userId'), SubmissionController.listByUser)
// TODO: submissionViewAll or enrolled/self

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions:
 *   post:
 *     summary: Create a submission
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 */
Router.post('/', isAuthorized('enrolled'), upload.single('files'), validator, checkSubmissions, SubmissionController.post)
// TODO: submissionCreateSelf or submissionCreateAll

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions/{id}/revoke:
 *   delete:
 *     summary: Revokes a submission. The submission's score will not count and the submission will not count towards the
 *              user's submission total or numbering. User's can still view their revoked submissions
 *     tags:
 *       - Submissions
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 */
Router.put('/:id/revoke', isAuthorized('submissionChangeState'), asInt(), SubmissionController.revoke)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions/{id}/unrevoke:
 *   delete:
 *     summary: Un-revokes a submission
 *     tags:
 *       - Submissions
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
Router.put('/:id/unrevoke', isAuthorized('submissionChangeState'), asInt(), SubmissionController.unrevoke)

/**
 * @swagger
 * /course/:courseId/assignment/:assignmentId/submissions/{id}:
 *   delete:
 *     summary: Delete a submission
 *     tags:
 *       - Submissions
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
Router.delete('/:id', isAuthorized('no one can delete submissions'), asInt(), SubmissionController._delete)

export default Router
