import express from 'express'

import validator from './webhooks.validator'

import WebhooksController from './webhooks.controller'
import { isAuthorized } from '../../authorization/authorization.middleware'

const Router = express.Router({ mergeParams: true })


/**
 * @swagger
 * /webhooks:
 *   get:
 *     summary: get all webhooks created by a user
 */
Router.get('/', isAuthorized('courseViewAll'), WebhooksController.getById)

/**
 * @swagger
 * /webhooks:
 *   get:
 *     summary: get all webhooks, only for admins
 */
Router.get('/all', isAuthorized('admin'), WebhooksController.get)


/**
 * @swagger
 * /webhooks:
 *   get:
 *     summary: create a webhook
 */
Router.post('/', isAuthorized('courseViewAll'), validator, WebhooksController.post)


/**
 * @swagger
 * /webhooks:
 *   put:
 *     summary: Edit webhook urls
 */
Router.put('/:id', isAuthorized('courseViewAll'), validator, WebhooksController.put)


/**
 * @swagger
 * /webhooks:
 *   delete:
 *     summary: delete a webhook
 */
Router.delete('/:id', isAuthorized('courseViewAll'), WebhooksController._delete)

export default Router
