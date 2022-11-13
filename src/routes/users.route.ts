import { Router } from "express"

import UsersController from "@controllers/users.controller"
import Route from "@typings/routes.type"
import { blockInvalidScope } from "@middlewares/scope.middleware"

class UsersRoute implements Route {
  public path = "/users"
  public router = Router()
  public usersController = new UsersController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, [blockInvalidScope("users:read")], this.usersController.getUsers)
    this.router.get(`${this.path}/:id`, [blockInvalidScope("user:read")], this.usersController.getUserById)
    this.router.post(`${this.path}`, [blockInvalidScope("user:create")], this.usersController.createUser)
    this.router.put(`${this.path}/:id`, [blockInvalidScope("user:update")], this.usersController.updateUser)
    this.router.delete(`${this.path}/:id`, [blockInvalidScope("user:delete")], this.usersController.deleteUser)
  }
}

export default UsersRoute
