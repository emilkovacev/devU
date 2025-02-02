import { Request, Response, NextFunction } from 'express'

import UserService from '../../entities/user/user.service'
import AuthService from '../authentication.service'

// import { GenericResponse } from '../../utils/apiResponse.utils'
import { refreshCookieOptions } from '../../utils/cookie.utils'

export async function callback(req: Request, res: Response, next: NextFunction) {
  try {
    const { email = '', externalId = '' } = req.body

    const { user } = await UserService.ensure({ email, externalId, isAdmin: false })
    const refreshToken = AuthService.createRefreshToken(user)

    res.cookie('refreshToken', refreshToken, refreshCookieOptions)
    //res.status(200).json(new GenericResponse('Login successful'))
    res.status(200).json({ message: 'Login successful', userId: user.id })
  } catch (err) {
    next(err)
  }
}

export default {
  callback,
}
