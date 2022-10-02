import { NextFunction, Request, Response } from "express"

import HttpException from "@exceptions/HttpExeption"
import logger from "@logger"

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    let message: string = error.message || "Something went wrong"
    if (status === 500) {
      message = "Something went wrong"
    }

    logger.log("error", `code: ${status} | message: ${message}`)
    res.status(status).json({ message })
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
