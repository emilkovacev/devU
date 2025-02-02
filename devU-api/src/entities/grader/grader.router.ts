// Libraries
import express from 'express'

// Middleware
//import validator from './grader.validator'
import { asInt } from '../../middleware/validator/generic.validator'
//import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import GraderController from './grader.controller'
import { isAuthenticated } from '../../authentication/authentication.middleware'

const Router = express.Router()

/**
 * @swagger
 * tags:
 *    - name: Grader
 *      description:
 * /grade/{id}:
 *   post:
 *     summary: Grade a submission, currently only with non-container autograders
 *     tags:
 *       - Grader
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
Router.post('/:id', asInt(), isAuthenticated, /*isAuthorized('enrolled'),*/ GraderController.grade)
// TODO: Add authorization, 'enrolled' was causing issues

/**
 * @swagger
 * tags:
 *    - name: Grader callback
 *      description:
 * /grade/callback/{outputFilename}:
 *   post:
 *     summary: Not directly called by the user. Tells the API that a container grading job has finished and creates relevant entities from the results.
 *     tags:
 *       - Grader
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: outputFilename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
Router.post('/callback/:outputFile', GraderController.tangoCallback) //Unauthorized route so tango can make callback without needing token

export default Router
