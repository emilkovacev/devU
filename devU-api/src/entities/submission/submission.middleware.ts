// middleware to enforce mac submissions

import { Request, Response, NextFunction } from 'express'
import SubmissionService from './submission.service'
import AssignmentService from '../assignment/assignment.service'

// TODO discuss how to bypass this when an instructor wants to eg bypass for a specific student
// checks number of submissions and checks if the assignment is beyond the deadline
async function checkSubmissions(req: Request, res: Response, next: NextFunction) {
  const userID = req.currentUser?.userId
  const assignmentId = req.body.assignmentId

  if (!userID) {
    return res.status(403).send('userid is missing')
  }

  try {
    const assignmentInfo = await AssignmentService.getMaxSubmissionsForAssignment(assignmentId)

    if (assignmentInfo == null) return res.status(403).send('could not retrieve assignment info')

    if (assignmentInfo!.disableHandins) {
      // console.debug('Handins are now disabled')
      return res.status(403).json({ 'Error': 'Handins are now disabled for this assignment' })
    }

    const currentTime = new Date()

    if (assignmentInfo!.endDate < currentTime) {
      // console.debug('Submission after enddate')
      return res.status(403).json({
        'Error': 'Submission after end date',
        'endDate': assignmentInfo!.endDate,
        'currentTime': currentTime,
      })
    }

    if (assignmentInfo!.maxSubmissions == null) {
      console.debug('Max submissions are not specified, skipping check')
      // check file size
      if (req.file && req.file.size > assignmentInfo!.maxFileSize!) {
        return res.status(403).json({
          'error': 'file is bigger than allowed max file size',
          'allowed size': assignmentInfo!.maxFileSize!,
          'file size': req.file.size,
        })
      }

      return next()
    }

    const submissions = await SubmissionService.listByAssignment(assignmentId, userID)
    // check submissions
    if (submissions.length >= assignmentInfo!.maxSubmissions!) {
      return res.status(403).json({
        'error': 'max submissions reached.',
        'Max submissions': assignmentInfo!.maxSubmissions!,
        'Current submissions': submissions.length,
      })
    }

    // check file size
    if (req.file && req.file.size > assignmentInfo!.maxFileSize!) {
      return res.status(403).json({
        'error': 'file is bigger than allowed max file size',
        'allowed size': assignmentInfo!.maxFileSize!,
        'file size': req.file.size,
      })
    }

    next()
  } catch (e) {
    return res.status(500).send(e)
  }
}

export { checkSubmissions }