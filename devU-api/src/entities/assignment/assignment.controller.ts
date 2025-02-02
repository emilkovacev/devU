import { Request, Response, NextFunction } from 'express'

import AssignmentService from './assignment.service'

import { GenericResponse, NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './assignment.serializer'
import { BucketNames, downloadFile } from '../../fileStorage'

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.assignmentId)
    const courseId = parseInt(req.params.courseId)
    const assignment = await AssignmentService.retrieve(id, courseId)

    if (!assignment) return res.status(404).json(NotFound)

    const response = serialize(assignment)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function handleAttachmentLink(req: Request, res: Response, next: NextFunction) {
  try {
    const bucketName = BucketNames.ASSIGNMENTSATTACHMENTS
    const courseId = parseInt(req.params.courseId)
    const fileName = req.params.filename
    const assignmentId = parseInt(req.params.assignmentId)

    if (!courseId) return res.status(400).json('Bucket not found')
    if (!fileName) return res.status(400).json('File name not found')
    if (!assignmentId) return res.status(400).json('Assignment id not found')

    const assignment = await AssignmentService.retrieve(assignmentId, courseId)
    if (!assignment) return res.status(404).json('Assignment not found')

    const ind = assignment.attachmentsHashes.findIndex(value => {
      return value == fileName
    })
    if (ind == -1) return res.status(404).json('File not found')

    const file = assignment.attachmentsHashes[ind]
    const name = assignment.attachmentsFilenames[ind]

    const buffer = await downloadFile(bucketName, file)

    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Length', buffer.length)
    res.send(buffer)
  } catch (error) {
    console.error('Error retrieving file:', error)
    res.status(500).send('Error retrieving file')
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const assignments = await AssignmentService.listByCourse(courseId)

    const response = assignments.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function getReleased(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const assignments = await AssignmentService.listByCourseReleased(courseId)

    const response = assignments.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}


export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileNames, fileHashes } = await AssignmentService.processFiles(req)

    req.body['attachmentsFilenames'] = fileNames
    req.body['attachmentsHashes'] = fileHashes

    const assignment = await AssignmentService.create(req.body)
    const response = serialize(assignment)

    res.status(201).json(response)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileNames, fileHashes } = await AssignmentService.processFiles(req)

    req.body['attachmentsFilenames'] = fileNames
    req.body['attachmentsHashes'] = fileHashes

    req.body.id = parseInt(req.params.assignmentId)
    const results = await AssignmentService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.assignmentId)
    const results = await AssignmentService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { detail, post, put, _delete, getByCourse, getReleased, handleAttachmentLink }
