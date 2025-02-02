import express from 'express'

import controller from '../login.developer/login.developer.controller'

import { validateDeveloper } from '../login/login.validator'

const Router = express.Router()

/**
 * @swagger
 * /login/developer:
 *   post:
 *     summary: NOT IN PRODUCTION. Gives a way for developers to log in while developing locally via an externalId & email
 */
Router.post('/', validateDeveloper, controller.callback)

export default Router
