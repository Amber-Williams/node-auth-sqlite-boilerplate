import express, { Request, Response } from "express"

import config from "./config"
import logger from "./features/logger"
import apiLimiter from "./middleware/rate-limiter"
import "./db/index"

const app = express()

app.use("/api", apiLimiter)

app.get("/api/v0/test", (_: Request, res: Response) => {
  res.send("hello world")
})

app.listen(config.port, () => logger.log("info", `server listening on port:${config.port}`))
