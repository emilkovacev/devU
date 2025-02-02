import express from 'express'

// Middleware
import validator from './stickyNote.validator'
import { isAuthorized } from '../../authorization/authorization.middleware'
import { asInt } from '../../middleware/validator/generic.validator'

// Controller
import StickyNoteController from './stickyNote.controller'

const Router = express.Router({ mergeParams: true })

Router.get('/all', isAuthorized("stickyNoteViewAll"), validator , StickyNoteController.listBySubmission)

Router.get('/:id' ,isAuthorized("stickyNoteViewAll") , asInt("id"), validator , StickyNoteController.retrieve)

Router.post('/',isAuthorized("stickyNoteEditAll") ,validator, StickyNoteController.post)

Router.put('/:id',isAuthorized("stickyNoteEditAll") , validator, StickyNoteController.put)

Router.delete('/:id',isAuthorized("stickyNoteEditAll") , asInt("id"), validator, StickyNoteController.remove)

export default Router


