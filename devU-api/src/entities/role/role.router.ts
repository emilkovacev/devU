// Libraries
import express from 'express'

// Middleware
import validator from './role.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import RoleController from './role.controller'

const Router = express.Router({ mergeParams: true })

/**
 * @swagger
 * /course/:courseId/roles:
 *   get:
 *     summary: List of all roles for a course
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/', isAuthorized('roleViewAll'), RoleController.getAll)

/**
 * @swagger
 * /course/:courseId/roles:
 *   get:
 *     summary: Retrieve a list of all of a course's roles.
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         description: Enter Course Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/', isAuthorized('roleViewAll'), RoleController.getByCourse)

/**
 * @swagger
 * /course/:courseId/roles/{id}:
 *   get:
 *     summary: Retrieve a single role by id
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter role id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized('roleViewAll'), asInt(), RoleController.detail)
// TODO: make sure all details are checking the courseId. Add matching 'detailByCourse' for each and only admin can hit 'detail'?

/**
 * @swagger
 * /course/:courseId/roles/{name}:
 *   get:
 *     summary: Retrieve a single role by name
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter role id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:roleName', isAuthorized('enrolled'), RoleController.detailByName)

/**
 * @swagger
 * /course/:courseId/roles:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Roles
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 */
Router.post('/', isAuthorized('roleEditAll'), validator, RoleController.post)

/**
 * @swagger
 * /course/:courseId/roles/{id}:
 *   put:
 *     summary: Update a role association
 *     tags:
 *       - Roles
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
 *             $ref: '#/components/schemas/Role'
 */
Router.put('/:id', isAuthorized('roleEditAll'), asInt(), validator, RoleController.put)

/**
 * @swagger
 * /course/:courseId/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags:
 *       - Roles
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
Router.delete('/:id', isAuthorized('roleEditAll'), asInt(), RoleController._delete)

export default Router
