import app from "./app"
import config from "./config"
import logger from "./features/logger"
import "./db/index"

app.on("ready", () => {
  app.listen(config.port, () => {
    logger.log("info", `Server ready - listening on port:${config.port}`)
  })
})
