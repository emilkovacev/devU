import express from 'express'

import validator from './user.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

import UserController from './user.controller'
import { isAdmin } from './user.middlware'

const Router = express.Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', UserController.get)
// Router.get('/', isAuthorized('admin'), UserController.get)


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     tags:
 *       - Users
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
// Router.get('/:id', extractOwnerByPathParam('id'), isAuthorized('admin', 'self'), asInt(), UserController.detail)
Router.get('/:id', asInt(), UserController.detail)
// self or admin
// TODO: Add top level authorization. Currently, all authorization is at the course level

/**
 * @swagger
 * /users/course/{course-id}:
 *   get:
 *     summary: Retrieve all users associated with a course
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: course-id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: role
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 */
Router.get('/course/:id', /* isAuthorized('courseViewAll'), */ asInt(), UserController.getByCourse)
// TODO: Removed authorization for now, fix later

const adminRouter = express.Router()

Router.use('/admin', isAdmin, adminRouter)

/**
 * @swagger
 * /users/admin/:
 *   get:
 *     summary: list admin users
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 */
adminRouter.get('/list', UserController.listAdmins)

/**
 * @swagger
 * /users/admin/:
 *   post:
 *     summary: Make a user admin
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              newAdminUserId:
 *                description: "User id to make admin"
 *                type: number
 */
adminRouter.post('/', UserController.createNewAdmin)

/**
 * @swagger
 * /users/admin/:
 *   delete:
 *     summary: delete a user admin
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              newAdminUserId:
 *                description: "User id to make admin"
 *                type: number
 */
adminRouter.delete('/', UserController.deleteAdmin)

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/User'
 */
Router.post('/', validator, UserController.post)
// TODO: do we need authorizer for this?

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user, all fields required but only preferredName is updated
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/User'
 */
Router.put('/:id', asInt(), validator, UserController.put)
// TODO: self or admin

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
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
Router.delete('/:id', isAuthorized('no one. Eventually admin only'), asInt(), UserController._delete)
// TODO: authorization

export default Router
