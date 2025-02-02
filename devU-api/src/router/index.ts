import express, { Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'

import swagger from '../utils/swagger.utils'

import courses from '../entities/course/course.router'
import login from '../authentication/login/login.router'
import logout from '../authentication/logout/logout.router'
import status from '../status/status.router'
import users from '../entities/user/user.router'
import courseRoutes from './courseData.router'
import grader from '../entities/grader/grader.router'

import { isAuthenticated } from '../authentication/authentication.middleware'

import { NotFound } from '../utils/apiResponse.utils'
import { asInt } from '../middleware/validator/generic.validator'

const Router = express.Router()

// TODO: Decide if we want to pull the course object (And return a 404 if not found) in middleware here or let it
//  happen later... do this check in isAuthorized

//Has to be pulled out of course router due to unauthenticated route
Router.use('/course/:courseId/grade', asInt('courseId'), grader)

Router.use('/course/:courseId', isAuthenticated, asInt('courseId'), courseRoutes)
Router.use('/c/:courseId', isAuthenticated, asInt('courseId'), courseRoutes)

// Router.use('/course/:courseId', isAuthenticated, asInt('courseId'), getCourse, courseRoutes)
// Router.use('/c/:courseId', isAuthenticated, asInt('courseId'), getCourse, courseRoutes)

Router.use('/users', isAuthenticated, users)
Router.use('/courses', isAuthenticated, courses)
// TODO: Courses by user

Router.use('/login', login)
Router.use('/logout', logout)

//To access docs, go to localhost:3001/docs in your browser
Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger))

Router.use('/status', status)

Router.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).send(NotFound))

export default Router
