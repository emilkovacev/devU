import { Request, Response, NextFunction } from 'express'

import UserService from '../../entities/user/user.service'
import AuthService from '../authentication.service'
import ProviderService from '../../provider/provider.service'

import { Unauthorized } from '../../utils/apiResponse.utils'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.refreshUser === undefined) return res.status(401).json(Unauthorized)

    const { userId } = req.refreshUser

    if (!userId) return res.status(401).json(Unauthorized)

    const user = await UserService.retrieve(userId)

    if (!user) return res.status(401).json(Unauthorized)

    const accessToken = AuthService.createAccessToken(user)

    res.status(200).json({ accessToken })
  } catch (err) {
    next(err)
  }
}

export function getProviders(req: Request, res: Response, next: NextFunction) {
  try {
    const providers = ProviderService.get()

    res.status(200).json(providers)
  } catch (err) {
    next(err)
  }
}

export default {
  login,
  getProviders,
}
