import { Request, Response, NextFunction } from 'express'

import CategoryScoreService from './categoryScore.service'

import { NotFound, Updated } from '../../utils/apiResponse.utils'

import { serialize } from './categoryScore.serializer'

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryScores = await CategoryScoreService.list()
    const response = categoryScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId)
    const categoryScores = await CategoryScoreService.listByCourse(courseId)
    const response = categoryScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const categoryScore = await CategoryScoreService.retrieve(id)

    if (!categoryScore) return res.status(404).json(NotFound)

    const response = serialize(categoryScore)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryScore = await CategoryScoreService.create(req.body)
    const response = serialize(categoryScore)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export async function put(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.id = parseInt(req.params.id)
    const results = await CategoryScoreService.update(req.body)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}
export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const results = await CategoryScoreService._delete(id)

    if (!results.affected) return res.status(404).json(NotFound)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default { get, getByCourse, detail, post, put, _delete }
