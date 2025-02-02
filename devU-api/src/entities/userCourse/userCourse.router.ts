// Libraries
import express from 'express'

// Middleware
import validator from './userCourse.validator'
import { asInt } from '../../middleware/validator/generic.validator'
import { extractOwnerByPathParam, isAuthorized } from '../../authorization/authorization.middleware'

// Controller
import UserCourseController from './userCourse.controller'

const Router = express.Router({ mergeParams: true })

/**
 * TODO: Document this
 */
Router.get('/users', UserCourseController.checkEnroll)
/**
 * @swagger
 * /course/:courseId/user-courses/:
 *   get:
 *     summary: Retrieve a list of all of a course's user-course associations.
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: course-id
 *         description: Enter Course Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/', isAuthorized('courseViewAll'), UserCourseController.getByCourse)

/**
 * @swagger
 * /course/:courseId/user-courses/{id}:
 *   get:
 *     summary: Retrieve a single user-course association
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter User-Course Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
Router.get('/:id', isAuthorized('courseViewAll'), asInt(), UserCourseController.detail)
// TODO: self or all

/**
 * @swagger
 * /course/:courseId/user-courses/user/{userId}:
 *   get:
 *     summary: Retrieve a single user-course by course and user
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     parameters:
 *       - name: id
 *         description: Enter User-Course Id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */

Router.get(
  '/user/:userId',
  extractOwnerByPathParam('userId'),
  isAuthorized('courseViewAll', 'enrolled'),
  asInt('userId'),
  UserCourseController.detailByUser,
)

/**
 * @swagger
 * /course/:courseId/user-courses:
 *   post:
 *     summary: Create a new user-course association
 *     tags:
 *       - UserCourses
 *     responses:
 *       '200':
 *         description: OK
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserCourse'
 */
Router.post('/', validator, UserCourseController.post)
// TODO: userCourseEditAll eventually. For now, allow self enroll


/**
 * @swagger
 * /courses/{courseId}/students/add:
 *   put:
 *     summary: Add multiple students to a course
 *     tags:
 *       - UserCourses
 *     responses:
 *          200:
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: string
 *                      description: Array of successfully enrolled users as a string
 *                      example: '["test@test1.com enrolled successfully"]'
 *                    failed:
 *                      type: string
 *                      description: Array of failed enrollments with error messages as a string
 *                      example: '["user@email.com: Error: User already enrolled in course", "user2@email.com not found"]'
 *                  required:
 *                    - success
 *                    - failed
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: A list of emails in a json array
 *       content:
 *         application/json:
 *       schema:
 *         type: object
 *         properties:
 *           users:
 *             type: array
 *             items:
 *               type: string
 *               format: email
 *         required:
 *           - users
 */
Router.post('/students/add', asInt('courseId'), isAuthorized('courseViewAll'), UserCourseController.addStudents)

/**
 * @swagger
 * /courses/{courseId}/students/drop:
 *   put:
 *     summary: Drop multiple students from a course
 *     tags:
 *       - UserCourses
 *     responses:
 *          200:
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    success:
 *                      type: string
 *                      description: Array of successfully dropped students as a string
 *                      example: '["test@test1.com dropped successfully"]'
 *                    failed:
 *                      type: string
 *                      description: Array of failed drops with error messages as a string
 *                      example: '["user2@email.com not found"]'
 *                  required:
 *                    - success
 *                    - failed
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: A list of emails in a json array
 *       content:
 *         application/json:
 *       schema:
 *         type: object
 *         properties:
 *           users:
 *             type: array
 *             items:
 *               type: string
 *               format: email
 *         required:
 *           - users
 */
Router.post('/students/drop', asInt('courseId'), isAuthorized('courseViewAll'), UserCourseController.dropStudents)


/**
 * @swagger
 * /course/:courseId/users-courses/{id}:
 *   put:
 *     summary: Update a user-course association
 *     tags:
 *       - UserCourses
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
 *             $ref: '#/components/schemas/UserCourse'
 */
Router.put('/:id', isAuthorized('userCourseEditAll'), asInt(), validator, UserCourseController.put)

/**
 * @swagger
 * /course/:courseId/user-courses:
 *   delete:
 *     summary: Delete a user-course association for current user
 *     tags:
 *       - UserCourses
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
Router.delete('/', UserCourseController._delete)
// TODO: eventually add authorization to this. For now, everyone can remove anyone

/**
 * @swagger
 * /course/:courseId/user-courses/{id}:
 *   delete:
 *     summary: Delete a user-course association given a specific user
 *     tags:
 *       - UserCourses
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
Router.delete('/:id', UserCourseController._deleteUser)
// TODO: eventually add authorization to this. For now, everyone can remove anyone
export default Router
