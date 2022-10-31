import { NextFunction, Request, Response } from "express"
import dayjs, { ManipulateType } from "dayjs"

import { ICreateUser, IUserPublic } from "@typings/users.type"
import UserService from "@services/users.service"
import AuthService from "@services/auth.service"
import config from "@config"

class AuthController {
  public userService = new UserService()
  public authService = new AuthService()

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ICreateUser = req.body
      const user: IUserPublic = await this.userService.createUser(userData)
      const { accessToken, refreshToken } = this.authService.createAuthTokens({
        userId: user.id,
        username: user.username,
      })
      res.cookie("aid", accessToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs()
          .add(config.auth.accessTokenExpiry.amount, config.auth.accessTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
      res.cookie("rid", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs()
          .add(config.auth.refreshTokenExpiry.amount, config.auth.refreshTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
      res.sendStatus(201)
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      const user = await this.userService.getUserIfPasswordMatch(email, password)
      const { accessToken, refreshToken } = this.authService.createAuthTokens({
        userId: user.id,
        username: user.username,
      })

      res.cookie("aid", accessToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs()
          .add(config.auth.accessTokenExpiry.amount, config.auth.accessTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
      res.cookie("rid", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: dayjs()
          .add(config.auth.refreshTokenExpiry.amount, config.auth.refreshTokenExpiry.unit as ManipulateType)
          .toDate(),
      })

      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
