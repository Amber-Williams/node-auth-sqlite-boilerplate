import { Request, Response } from "express"

import { IUser, ICreateUser, IUserPublic, IUpdateUser } from "@typings/users.type"
import userService from "@services/users.service"
import catchAsync from "@utils/catchAsync"

class UsersController {
  public userService = new userService()

  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const users: IUser[] = await this.userService.findAllUser()
    res.status(200).json(users)
  })

  public getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user: IUser = await this.userService.findUserById(userId)
    res.status(200).json(user)
  })

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const userData: ICreateUser = req.body
    const createUserData: IUserPublic = await this.userService.createUser(userData)
    res.status(201).json(createUserData)
  })

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const userData: IUpdateUser = req.body
    const updateUserData = await this.userService.updateUser(userId, userData)
    res.status(200).json(updateUserData)
  })

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const deleteUserData: IUser = await this.userService.deleteUser(userId)
    res.status(200).json(deleteUserData)
  })
}

export default UsersController
