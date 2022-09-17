import express, { Request, Response } from "express"

import config from "./config"
import logger from "./features/logger"
import apiLimiter from "./middleware/rate-limiter"

const app = express()

app.use("/api", apiLimiter)

app.get("/api/v0/test", (_: Request, res: Response) => {
  res.send("hello world")
})

// eslint-disable-next-line no-console
app.listen(config.port, () => logger.info(`server listening on port:${config.port}`))
