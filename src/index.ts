import app from "./app"
import config from "./config"
import logger from "./features/logger"
import "./db/index"

app.on("ready", () => {
  const server = app.listen(config.port, () => {
    logger.log("info", `Server ready - listening on port:${config.port}`)
  })
  app.set("server", server)
})

const exitHandler = () => {
  const server = app.get("server")
  if (server) {
    server.close(() => {
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
