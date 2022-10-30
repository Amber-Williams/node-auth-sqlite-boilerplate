import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"

import { ICreateUser, IUserPublic } from "@typings/users.type"
import userService from "@services/users.service"
import config from "@config"

class AuthController {
  public userService = new userService()
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ICreateUser = req.body
      const user: IUserPublic = await this.userService.createUser(userData)
      const accessToken = jwt.sign({ userId: user.id, username: user.username }, config.auth.jwtSecret, {
        expiresIn: config.auth.accessTokenExpiry,
      })
      const refreshToken = jwt.sign({ userId: user.id, username: user.username }, config.auth.jwtSecret, {
        expiresIn: config.auth.refreshTokenExpiry,
      })
      res.cookie("aid", accessToken, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: true,
      })
      res.cookie("rid", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      })
      res.sendStatus(201)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
