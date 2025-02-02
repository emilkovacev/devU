import express from 'express'

import userCourse from '../entities/userCourse/userCourse.router'
import assignments from '../entities/assignment/assignment.router'
import submissions from '../entities/submission/submission.router'
import submissionScore from '../entities/submissionScore/submissionScore.router'
import containerAutoGrader from '../entities/containerAutoGrader/containerAutoGrader.router'
import assignmentProblem from '../entities/assignmentProblem/assignmentProblem.router'
import submissionProblemScore from '../entities/submissionProblemScore/submissionProblemScore.router'
import deadlineExtensions from '../entities/deadlineExtensions/deadlineExtensions.router'
import fileUpload from '../fileUpload/fileUpload.router'
import categories from '../entities/category/category.router'
import categoryScores from '../entities/categoryScore/categoryScore.router'
import courseScores from '../entities/courseScore/courseScore.router'
import assignmentScore from '../entities/assignmentScore/assignmentScore.router'
import role from '../entities/role/role.router'
import stickyNotes from '../entities/stickyNote/stickyNote.router'

import nonContainerAutoGraderRouter from '../entities/nonContainerAutoGrader/nonContainerAutoGrader.router'

import { asInt } from '../middleware/validator/generic.validator'
import webhooksRouter from '../entities/webhooks/webhooks.router'

const submissionRouter = express.Router({ mergeParams: true })
submissionRouter.use('/sticky-notes', stickyNotes)

const assignmentRouter = express.Router({ mergeParams: true })
assignmentRouter.use('/submission/:submissionId', asInt('submissionId'), submissionRouter)

assignmentRouter.use('/assignment-problems', assignmentProblem)
assignmentRouter.use('/container-auto-graders', containerAutoGrader)
assignmentRouter.use('/deadline-extensions', deadlineExtensions)
assignmentRouter.use('/non-container-auto-graders', nonContainerAutoGraderRouter)
assignmentRouter.use('/submissions', submissions)
assignmentRouter.use('/submission-problem-scores', submissionProblemScore)
assignmentRouter.use('/submission-scores', submissionScore)

const Router = express.Router({ mergeParams: true })
Router.use('/assignment/:assignmentId/', asInt('assignmentId'), assignmentRouter)
Router.use('/a/:assignmentId/', asInt('assignmentId'), assignmentRouter)

Router.use('/assignments', assignments)
Router.use('/assignment-scores', assignmentScore)
Router.use('/categories', categories)
Router.use('/category-scores', categoryScores)
Router.use('/course-scores', courseScores)
Router.use('/file-upload', fileUpload)
Router.use('/roles', role)
Router.use('/user-courses', userCourse)

Router.use('/webhooks', webhooksRouter)


export default Router
