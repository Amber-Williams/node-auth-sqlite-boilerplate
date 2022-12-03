import cookieParser from "cookie-parser"
import express from "express"
import http from "http"

import config from "@config"
import logger from "@logger"
import attachCookiesMiddleware from "@middlewares/cookies.middleware"
import errorMiddleware from "@middlewares/error.middleware"
import apiLimiterMiddleware from "@middlewares/rate-limiter.middleware"
import Routes from "@typings/routes.type"

class App {
  public app: express.Application
  public port: string | number
  public server: http.Server | undefined

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = config.port
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
