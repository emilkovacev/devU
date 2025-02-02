//Libraries
import express from 'express'

//validators
import validator from './categoryScore.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

//Controller
import CategoryScoreController from './categoryScore.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/category-score:
 *  get:
 *      summary: Retrieve a list of all category scores
 *      tags:
 *        - CategoryScores
 *      responses:
 *        '200':
 *          description: OK
 */
Router.get('/', isAuthorized('scoresViewAll'), CategoryScoreController.getByCourse)

/**
 * @swagger
 * /course/:courseId/category-score/{id}:
 *  get:
 *      summary: Retrieve a single category score
 *      tags:
 *        - CategoryScores
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
Router.get('/:id', isAuthorized('scoresViewSelfReleased'), asInt(), CategoryScoreController.detail)
// TODO: They can see everyone's scores... chance to self or all

/**
 * @swagger
 * /course/:courseId/category-score:
 *  post:
 *      summary: Create a category score
 *      tags:
 *        - CategoryScores
 *      responses:
 *        '200':
 *          description: OK
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/CategoryScore'
 */
Router.post('/', isAuthorized('scoresEditAll'), validator, CategoryScoreController.post)

/**
 * @swagger
 * /course/:courseId/category-score/{id}:
 *  put:
 *      summary: Update a category score
 *      tags:
 *        - CategoryScores
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
 *              $ref: '#/components/schemas/CategoryScore'
 */
Router.put('/:id', isAuthorized('scoresEditAll'), validator, asInt(), CategoryScoreController.put)

/**
 * @swagger
 * /course/:courseId/category-score/{id}:
 *  delete:
 *      summary: Delete a category score
 *      tags:
 *        - CategoryScores
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
Router.delete('/:id', isAuthorized('scoresEditAll'), asInt(), CategoryScoreController._delete)

export default Router
