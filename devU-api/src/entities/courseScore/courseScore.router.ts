//Libraries
import express from 'express'

//validators
import validator from './courseScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

//Controller
import CourseScoreController from './courseScore.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/course-score:
 *  get:
 *      summary: Retrieve a list of all course scores
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 */
Router.get('/', isAuthorized('scoresViewAll'), CourseScoreController.get)

/**
 * @swagger
 * /course/:courseId/course-score/{id}:
 *  get:
 *      summary: Retrieve a single course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 */
Router.get('/:id', isAuthorized('scoresViewAll'), asInt(), CourseScoreController.detail)
// TODO: view self

/**
 * @swagger
 * /course/:courseId/course-score:
 *  post:
 *      summary: Create a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/CourseScore'
 */
Router.post('/', isAuthorized('scoresEditAll'), validator, CourseScoreController.post)

/**
 * @swagger
 * /course/:courseId/course-score/{id}:
 *  put:
 *      summary: Update a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/CourseScore'
 */
Router.put('/:id', isAuthorized('scoresEditAll'), validator, asInt(), CourseScoreController.put)

/**
 * @swagger
 * /course/:courseId/course-score/{id}:
 *  delete:
 *      summary: Delete a course score
 *      tags:
 *        - CourseScores
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 */
Router.delete('/:id', isAuthorized('scoresEditAll'), asInt(), CourseScoreController._delete)

export default Router
