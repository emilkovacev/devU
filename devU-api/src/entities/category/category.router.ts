import express from 'express'

import validator from './category.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

import CategoryController from './category.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/categories/{id}:
 *    get:
 *      summary: Retrieve a single category
 *      tags:
 *        - Categories
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Enter category id
 *          required: true
 *          schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized('enrolled'), asInt(), CategoryController.detail)

/**
 * @swagger
 * /course/:courseId/categories/:
 *    get:
 *      summary: Retrieve a list of categories by courseId
 *      tags:
 *        - Categories
 *      responses:
 *        '200':
 *          description: OK
 *      parameters:
 *        - name: courseId
 *          in: path
 *          description: Enter course id
 *          required: true
 *          schema:
 *           type: integer
 */
Router.get('/', isAuthorized('enrolled'), CategoryController.getByCourse)

/**
 * @swagger
 * /course/:courseId/categories:
 *   post:
 *     summary: Create a category
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 */
Router.post('/', isAuthorized('courseEdit'), validator, CategoryController.post)

/**
 * @swagger
 * /course/:courseId/categories:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Categories
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
 *             $ref: '#/components/schemas/Category'
 */
Router.put('/:id', isAuthorized('courseEdit'), asInt(), validator, CategoryController.put)

/**
 * @swagger
 * /course/:courseId/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags:
 *       - Categories
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
Router.delete('/:id', isAuthorized('courseEdit'), asInt(), CategoryController._delete)

export default Router
