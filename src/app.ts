import http from "http"
import express from "express"

import config from "./../src/config"
import logger from "./../src/features/logger"
import apiLimiter from "./../src/middleware/rate-limiter.middleware"
import Routes from "./types/routes.type"
import errorMiddleware from "./../src/middleware/error.middleware"

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
    this.initializeErrorHandling()
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      logger.log("info", `Server ready - listening on port:${config.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use("/api", apiLimiter)
    this.app.use(express.json())
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/api", route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

export default App
