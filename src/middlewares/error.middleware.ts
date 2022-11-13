import { NextFunction, Request, Response } from "express"

import errorHandler from "@exceptions/ErrorHandler"

const errorMiddleware = async (error: Error, _: Request, __: Response, next: NextFunction) => {
  try {
    if (!errorHandler.isTrustedError(error)) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
