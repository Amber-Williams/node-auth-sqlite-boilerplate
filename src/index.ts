import App from "./app"
import logger from "./features/logger"
import IndexRoute from "./routes/index.route"
import "./db/index"

const app = new App([new IndexRoute()])

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
  logger.log("error", `Unexpected error ${error}`)
  exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)
