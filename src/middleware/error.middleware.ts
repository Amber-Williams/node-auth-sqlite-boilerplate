import { Request, Response } from "express"

import HttpException from "./../../src/exceptions/HttpExeption"
import logger from "./../../src/features/logger"

const errorMiddleware = (error: HttpException, _: Request, res: Response) => {
  const status = error.status || 500
  const message = error.message || "Something went wrong"
  logger.log("error", `code: ${status} | message: ${message}`)
  res.status(status).json({ message })
}

export default errorMiddleware
