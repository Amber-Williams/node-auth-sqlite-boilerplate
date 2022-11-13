import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

import config from "@config"
import { HTTP401Error } from "@exceptions"
import catchAsync from "@utils/catchAsync"

export const blockInvalidScope = (scope: string) => {
  return catchAsync(async (_: Request, res: Response, next: NextFunction) => {
    const accessTokenPayload = jwt.verify(res.locals.cookies.aid, config.auth.jwtSecret, {
      complete: false,
    }) as jwt.JwtPayload
    if (accessTokenPayload.scopes.includes(scope)) {
      next()
    } else {
      throw new HTTP401Error()
    }
  })
}
