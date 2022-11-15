import { Request, Response, NextFunction } from "express"

import { HTTP401Error } from "@exceptions"
import catchAsync from "@utils/catchAsync"
import AuthService from "@services/auth.service"

export const blockInvalidScope = (scope: string) => {
  const authService = new AuthService()

  return catchAsync(async (_: Request, res: Response, next: NextFunction) => {
    const accessTokenPayload = authService.verifyToken(res.locals.cookies.aid)
    if (accessTokenPayload && accessTokenPayload.scopes.includes(scope)) {
      next()
    } else {
      throw new HTTP401Error()
    }
  })
}
