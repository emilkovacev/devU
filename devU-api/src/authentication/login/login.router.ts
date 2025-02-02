import express from 'express'
import colors from 'colors'

import environment from '../../environment'

import controller from '../login/login.controller'

import { isValidRefreshToken, isRefreshNearingExpiration } from '../authentication.middleware'

import SamlRouter from '../login.saml/login.saml.router'
import DeveloperRouter from '../login.developer/login.developer.router'

const Router = express.Router()

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Gets access token by via refresh token (called on client bootstrap)
 */
Router.get('/', isValidRefreshToken, isRefreshNearingExpiration, controller.login)

/**
 * @swagger
 * /login/providers:
 *   get:
 *     summary: Gets a list of available authentication providers
 */
Router.get('/providers', controller.getProviders)

// Provider Routers
if (environment.providers.saml.enabled) Router.use('/saml', SamlRouter)
if (environment.providers.devAuth.enabled) {
  console.log(colors.red.bold(`DEVELOPER AUTH ENABLED. IF YOU'RE SEEING THIS MESSAGE IN PRODUCTION, YOU SHOULD PANIC.`))
  Router.use('/developer', DeveloperRouter)
}

export default Router
