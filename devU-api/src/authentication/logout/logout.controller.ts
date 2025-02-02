import { Request, Response, NextFunction } from 'express'
import { GenericResponse } from '../../utils/apiResponse.utils'
import { refreshToken } from '../../utils/cookie.utils'

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie(refreshToken).status(200).json(new GenericResponse('Refresh token cookie has been cleared!'))
  } catch (err) {
    next(err)
  }
}

export default logout
