import { Request, Response, NextFunction } from 'express'

import CourseScoreService from './courseScore.service'

import { NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './courseScore.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const courseScores = await CourseScoreService.list()
    const response = courseScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const courseScore = await CourseScoreService.retrieve(id)

    if (!courseScore) return res.status(404).json(NotFound)

    const response = serialize(courseScore)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const courseScore = await CourseScoreService.create(req.body)
    const response = serialize(courseScore)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await CourseScoreService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}
export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await CourseScoreService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, detail, post, put, _delete }
