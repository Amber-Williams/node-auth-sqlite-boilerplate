import http from "http"
import express from "express"
import cookieParser from "cookie-parser"

import config from "@config"
import logger from "@logger"
import Routes from "@typings/routes.type"
import apiLimiterMiddleware from "@middlewares/rate-limiter.middleware"
import errorMiddleware from "@middlewares/error.middleware"
import attachCookiesMiddleware from "@middlewares/cookies.middleware"

class App {
  public app: express.Application
  public port: string | number
  public server: http.Server | undefined

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.server

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      logger.log("info", `Server ready - listening on port:${config.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(errorMiddleware)
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use("/api", apiLimiterMiddleware)
    this.app.use(attachCookiesMiddleware)
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/api", route.router)
    })
  }
}

export default App
