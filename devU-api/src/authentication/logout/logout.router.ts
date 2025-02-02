import express from 'express'

import Logout from './logout.controller'

const Router = express.Router()

Router.get('/', Logout)

export default Router
