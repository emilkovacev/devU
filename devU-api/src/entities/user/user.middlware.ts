import { NextFunction, Request, Response } from 'express'
import UserService from './user.service'

// is admin middleware, use this when marking an endpoint as only accessible by admin
// different from userCourse permissions. this is attached to a user instead of a course level permission
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.currentUser?.userId
  if (!userId) {
    return res.status(403).json({ 'error': 'Unauthorized' })
  }

  const isAdmin = await UserService.isAdmin(userId)
  if (!isAdmin!.isAdmin!) return res.status(403).json({ "error": 'Unauthorized' })

  next()
}
