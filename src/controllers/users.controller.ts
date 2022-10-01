import { NextFunction, Request, Response } from "express"

import { IUser, ICreateUser, IUserPublic, IUserUpdate } from "./../types/users.type"
import userService from "./../services/users.service"

class UsersController {
  public userService = new userService()

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users: IUser[] = await this.userService.findAllUser()

      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id
      const user: IUser = await this.userService.findUserById(userId)

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ICreateUser = req.body
      const createUserData: IUserPublic = await this.userService.createUser(userData)

      res.status(201).json(createUserData)
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id
      const userData: IUserUpdate = req.body
      const updateUserData = await this.userService.updateUser(userId, userData)

      res.status(200).json(updateUserData)
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id
      const deleteUserData: IUser = await this.userService.deleteUser(userId)

      res.status(200).json(deleteUserData)
    } catch (error) {
      next(error)
    }
  }
}

export default UsersController
