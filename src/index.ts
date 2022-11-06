import App from "@app"
import logger from "@logger"
import IndexRoute from "@routes/index.route"
import UsersRoute from "@routes/users.route"
import AuthRoute from "@routes/auth.route"
import errorHandler from "@exceptions/ErrorHandler"
import "@database"

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()])

export const serverReady = () => {
  app.listen()
}

const exitHandler = () => {
  if (app.server) {
    app.server.close(() => {
      logger.log("info", "Server stopped")
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: Error) => {
  errorHandler.handleError(error)
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1)
  }

  logger.log("error", `Unexpected error ${error}`)
  exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", (reason: Error) => {
  throw reason
})
