import express, { Request, Response } from "express"

import config from "./config"
import logger from "./features/logger"

const app = express()

app.get("/", (_: Request, res: Response) => {
  res.send("hello world")
})

// eslint-disable-next-line no-console
app.listen(config.port, () => logger.info(`server listening on port:${config.port}`))
