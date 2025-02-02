// Libraries
import express from 'express'

//Middleware
import validator from './assignmentScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { extractOwnerByPathParam, isAuthorized } from '../../authorization/authorization.middleware'

//Controller
import AssignmentScoreController from './assignmentScore.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/assignment-scores:
 *  get:
 *    summary: Retrieve a list of assignment scores belonging to a course
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: assignmentId TODO
 *        description: Enter Assignment Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get('/', isAuthorized('scoresViewAll'), AssignmentScoreController.getByCourse)

/**
 * @swagger
 * /course/:courseId/assignment-scores/{id}:
 *  get:
 *    summary: Retrieve a single assignment score's details
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        description: Enter AssignmentScore Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get('/:id', isAuthorized('scoresViewAll'), asInt(), AssignmentScoreController.detail)

/**
 * @swagger
 * /course/:courseId/assignment-scores/user/{userId}:
 *  get:
 *    summary: Retrieve a list of assignment scores belonging to a user
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: userId
 *        description: Enter User Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get(
  '/user/:userId',
  extractOwnerByPathParam('userId'),
  isAuthorized('scoresViewAll', 'scoresViewSelfReleased'),
  asInt('userId'),
  AssignmentScoreController.getByUser
)

/**
 * @swagger
 * /course/:courseId/assignment-scores/detail/{assignment-id}/{user-id}:
 *  get:
 *    summary: Retrieve an assignment score belonging to a specific assignment and user
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: assignment-id
 *        description: Enter Assignment Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *      - name: user-id
 *        description: Enter User Id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.get(
  '/detail/:id/:userId',
  asInt(),
  asInt('userId'),
  extractOwnerByPathParam('userId'),
  isAuthorized('scoresViewAll', 'scoresViewSelfReleased'),
  AssignmentScoreController.detailByUser
)

/**
 * @swagger
 * /course/:courseId/assignment-scores:
 *  post:
 *    summary: Create an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/AssignmentScore'
 */
Router.post('/', isAuthorized('scoresEditAll'), validator, AssignmentScoreController.post)

/**
 * @swagger
 * /course/:courseId/assignment-scores/{id}:
 *  put:
 *    summary: Update an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/AssignmentScore'
 */
Router.put('/:id', isAuthorized('scoresEditAll'), asInt(), validator, AssignmentScoreController.put)

/**
 * @swagger
 * /course/:courseId/assignment-scores/{id}:
 *  delete:
 *    summary: Delete an assignment score
 *    tags:
 *      - AssignmentScore
 *    responses:
 *      '200':
 *        description: OK
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */
Router.delete('/:id', isAuthorized('scoresEditAll'), asInt(), AssignmentScoreController._delete)

export default Router
