import { Router } from "express"

import AuthController from "@controllers/auth.controller"
import Route from "@typings/routes.type"

class UsersRoute implements Route {
  public path = "/auth"
  public router = Router()
  public authController = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.authController.register)
    this.router.post(`${this.path}/login`, this.authController.login)
    this.router.get(`${this.path}/logout`, this.authController.logout)
  }
}

export default UsersRoute
