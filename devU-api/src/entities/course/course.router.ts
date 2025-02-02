// Libraries
import express from 'express'

// Middleware
import validator from './course.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import CourseController from './course.controller'

const Router = express.Router()

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 */
// Router.get('/', isAuthorized(''), CourseController.get)
Router.get('/', CourseController.get)
// TODO: Top-level authorization

/**
 * @swagger
 * /courses/user/{userId}:
 *   get:
 *     summary: Retrieve a list of courses by user
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 */
Router.get('/user/:userId', asInt('userId'), CourseController.getByUser)
// TODO: Top-level authorization

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Retrieve a single course
 *     tags:
 *       - Courses
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
Router.get('/:courseId', /*isAuthorized('enrolled'),*/ asInt('courseId'), CourseController.detail)
// TODO: authorization. Can only view if enrolled

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 */
Router.post('/', /*isAuthorized('admin..'),*/ validator, CourseController.post)
// TODO: Eventually, only admins can create courses. For now, anyone can create their own courses and they gain all permissions for that course

/**
 * @swagger
 * /courses/instructor:
 *   post:
 *     summary: Creates a course and adds the requester as an instructor in the course. Intended to be used during
 *              development only. Production will have an admin who can create courses and add the first instructor
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 */
Router.post('/instructor', validator, CourseController.postAddInstructor)

/**
 * @swagger
 * /courses/{courseId}:
 *   put:
 *     summary: Update a course
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 */
Router.put('/:courseId', isAuthorized('courseEdit'), asInt('courseId'), validator, CourseController.put)

/**
 * @swagger
 * /courses/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags:
 *       - Courses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.delete('/:courseId', isAuthorized('courseEdit'), asInt('courseId'), CourseController._delete)

export default Router
