import { NextFunction, Request, Response } from "express"
import dayjs, { ManipulateType } from "dayjs"

import { ICreateUser, IUserPublic } from "@typings/users.type"
import UserService from "@services/users.service"
import AuthService from "@services/auth.service"
import config from "@config"

class AuthController {
  public userService = new UserService()
  public authService = new AuthService()

  private addTokensToResponse = (res: Response, accessToken: string, idToken?: string, refreshToken?: string) => {
    res.cookie("aid", accessToken, {
      httpOnly: config.isProduction,
      secure: config.isProduction,
      expires: dayjs()
        .add(config.auth.accessTokenExpiry.amount, config.auth.accessTokenExpiry.unit as ManipulateType)
        .toDate(),
    })

    if (idToken) {
      res.cookie("iid", idToken, {
        httpOnly: config.isProduction,
        secure: config.isProduction,
        expires: dayjs()
          .add(config.auth.refreshTokenExpiry.amount, config.auth.refreshTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
    }

    if (refreshToken) {
      res.cookie("rid", refreshToken, {
        httpOnly: config.isProduction,
        secure: config.isProduction,
        expires: dayjs()
          .add(config.auth.refreshTokenExpiry.amount, config.auth.refreshTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
    }
    return res
  }

  private removeTokens = (res: Response, tokenNames: string[]) => {
    for (const token of tokenNames) {
      res.cookie(token, "", {
        httpOnly: config.isProduction,
        secure: config.isProduction,
        expires: dayjs().toDate(),
      })
    }

    return res
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ICreateUser = req.body
      const user: IUserPublic = await this.userService.createUser(userData)
      const { accessToken, refreshToken, idToken } = this.authService.createAuthTokens({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
      res = this.addTokensToResponse(res, accessToken, idToken, refreshToken)
      res.sendStatus(201)
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      const user = await this.authService.getUserIfPasswordMatch(email, password)
      const { accessToken, refreshToken, idToken } = this.authService.createAuthTokens({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      })
      res = this.addTokensToResponse(res, accessToken, idToken, refreshToken)
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }

  public logout = (_: Request, res: Response, next: NextFunction) => {
    try {
      res = this.removeTokens(res, ["rid", "aid", "iid"])
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }

  public refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validRefreshToken = this.authService.verifyRefreshToken(req.cookies.rid)
      if (!validRefreshToken) {
        throw new Error("Invalid refresh token")
      }

      const userTokenPayload = this.authService.getUserTokenPayload(req.cookies.iid)
      if (!userTokenPayload) {
        throw new Error("Invalid id token")
      }

      const user = await this.userService.findUserById(userTokenPayload.id)
      if (!userTokenPayload) {
        throw new Error("No user found")
      }

      const accessToken = this.authService.createAccessToken(user.role)
      res = this.addTokensToResponse(res, accessToken)
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idTokenPayload = this.authService.getUserTokenPayload(req.cookies.iid)
      if (!idTokenPayload) {
        throw new Error("No user found")
      }

      const { currentPassword, newPassword } = req.body
      const user = await this.authService.getUserIfPasswordMatch(idTokenPayload.email, currentPassword)
      user.update({ ...user, password: newPassword })

      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
