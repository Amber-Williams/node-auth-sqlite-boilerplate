import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"

import config from "@config"
import { HTTP401Error } from "@exceptions"

export const blockInvalidScope = (scope: string) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const accessTokenPayload = jwt.verify(res.locals.cookies.aid, config.auth.jwtSecret, {
        complete: false,
      }) as jwt.JwtPayload
      if (accessTokenPayload.scopes.includes(scope)) {
        next()
      } else {
        throw new HTTP401Error()
      }
    } catch {
      const unauthorizedError = new HTTP401Error()
      res.sendStatus(unauthorizedError.httpCode)
    }
  }
}
