// Libraries
import 'reflect-metadata'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import passport from 'passport'
import { dataSource } from './database'

import environment from './environment'
import { initializeMinio } from './fileStorage'

// Middleware
import router from './router'
import errorHandler from './middleware/errorHandler.middleware'

// Authentication Handlers
import './utils/passport.utils'
import { responseInterceptor } from './entities/webhooks/webhooks.middleware'

const app = express()

initializeMinio()
  .then(() =>
    dataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
      })
      .catch(err => {
        console.error('Error during Data Source initialization', err)
      })
  )
  .then(_connection => {
    app.use(helmet())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors({ origin: environment.clientUrl, credentials: true }))
    app.use(morgan('combined'))
    app.use(passport.initialize())

    console.log(`Api: ${environment.isDocker ? '' : 'not'} running in docker`)

    app.use(responseInterceptor)

    // Middleware;
    app.use('/', router)
    app.use(errorHandler)

    app.listen(environment.port, () =>
      console.log(`API listening at port - ${environment.port}\n
    If you are running the full app, the front end should be accessible at http://localhost:9000`)
    )
  })
  .catch(err => console.log('TypeORM connection error:', err))
