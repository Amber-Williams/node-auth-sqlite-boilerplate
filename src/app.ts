import express, { Request, Response } from "express"

import apiLimiter from "./middleware/rate-limiter"

const app = express()

app.use("/api", apiLimiter)

app.get("/api/v0/test", (_: Request, res: Response) => {
  res.send("hello world")
})

export default app
