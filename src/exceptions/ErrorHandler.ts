import logger from "@logger"
import BaseError from "@exceptions/BaseError"

class ErrorHandler {
  public async handleError(error: Error): Promise<void> {
    logger.log("error", error)
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}

const errorHandler = new ErrorHandler()

export default errorHandler
