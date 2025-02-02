import { Request, Response, NextFunction } from 'express'

import GraderService from './grader.service'

import { GenericResponse } from '../../utils/apiResponse.utils' //, NotFound

//import { serialize } from '../grader/grader.serializer'

export async function grade(req: Request, res: Response, next: NextFunction) {
  try {
    const submissionId = parseInt(req.params.id)
    const response = await GraderService.grade(submissionId) //grade

    res.status(200).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export async function tangoCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const outputFile = req.params.outputFile
    const response = await GraderService.tangoCallback(outputFile)

    res.status(200).json(response)
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json(new GenericResponse(err.message))
    }
  }
}

export default { grade, tangoCallback }
