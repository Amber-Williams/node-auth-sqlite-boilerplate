import { Request, Response } from "express"
import dayjs, { ManipulateType } from "dayjs"

import { ICreateUser, IUserPublic } from "@typings/users.type"
import UserService from "@services/users.service"
import AuthService from "@services/auth.service"
import config from "@config"
import catchAsync from "@utils/catchAsync"
import { ICreateAuthTokens } from "@typings/auth.type"

class AuthController {
  public userService = new UserService()
  public authService = new AuthService()

  private addTokensToResponse = (res: Response, tokens: { access: string; identity?: string; refresh?: string }) => {
    res.cookie("aid", tokens.access, {
      httpOnly: config.isProduction,
      secure: config.isProduction,
      expires: dayjs()
        .add(config.auth.accessTokenExpiry.amount, config.auth.accessTokenExpiry.unit as ManipulateType)
        .toDate(),
    })

    if (tokens.identity) {
      res.cookie("iid", tokens.identity, {
        httpOnly: config.isProduction,
        secure: config.isProduction,
        expires: dayjs()
          .add(config.auth.refreshTokenExpiry.amount, config.auth.refreshTokenExpiry.unit as ManipulateType)
          .toDate(),
      })
    }

    if (tokens.refresh) {
      res.cookie("rid", tokens.refresh, {
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

  public register = catchAsync(async (req: Request, res: Response) => {
    const userData: ICreateUser = req.body
    const user: IUserPublic = await this.userService.createUser(userData)
    const tokens = await this.authService.createAuthTokens({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    } as ICreateAuthTokens)

    res = this.addTokensToResponse(res, tokens)
    res.sendStatus(201)
  })

  public login = catchAsync(async (req: Request, res: Response) => {
    const b64auth = (req.headers.authorization || "").split(" ")[1] || ""
    const [email, password] = Buffer.from(b64auth, "base64").toString().split(":")

    const user = await this.authService.getUserIfPasswordMatch(email, password)
    const tokens = await this.authService.createAuthTokens({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    } as ICreateAuthTokens)
    res = this.addTokensToResponse(res, tokens)

    res.sendStatus(200)
  })

  public logout = catchAsync(async (req: Request, res: Response) => {
    const { id } = await this.authService.getUserIdentityByToken(req.cookies.iid)
    await this.authService.removeAuthTokens(id)
    res = this.removeTokens(res, ["rid", "aid", "iid"])
    res.sendStatus(200)
  })

  public refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
    const { id, email, username, role } = await this.authService.getUserIdentityByToken(req.cookies.iid)
    await this.authService.verifyTokens({
      userId: req.cookies.iid,
      refresh: req.cookies.riid,
      identity: req.cookies.iid,
    })
    const tokens = await this.authService.createAuthTokens({ userId: id, email, username, role } as ICreateAuthTokens)

    res = this.addTokensToResponse(res, tokens)
    res.sendStatus(200)
  })

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = await this.authService.getUserIdentityByToken(req.cookies.iid)
    const { currentPassword, newPassword } = req.body
    const user = await this.authService.getUserIfPasswordMatch(email, currentPassword)
    user.update({ ...user, password: newPassword })

    res.sendStatus(200)
  })
}

export default AuthController
