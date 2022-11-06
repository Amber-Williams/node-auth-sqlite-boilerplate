import User from "@models/user.model"
import { IUserPublic, IUpdateUser, ICreateUser } from "@typings/users.type"
import { HTTP400Error, HTTP404Error, HTTP409Error, HTTP500Error } from "@exceptions"
import { isEmpty } from "@utils"

class UserService {
  public async findAllUser() {
    const users = await User.find()
    return users
  }

  public async findUserById(userId: string) {
    if (isEmpty(userId)) {
      throw new HTTP400Error()
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HTTP404Error()
    }

    return user
  }

  public async createUser(userData: ICreateUser) {
    if (isEmpty(userData)) {
      throw new HTTP400Error()
    }
    const user = await User.findOne({ where: { email: userData.email } })
    if (user) {
      throw new HTTP409Error()
    }

    const createUserData: Partial<User> = await User.create<User>(userData).save()
    delete createUserData.password

    return createUserData as IUserPublic
  }

  public async updateUser(userId: string, userData: IUpdateUser) {
    if (isEmpty(userData)) {
      throw new HTTP400Error()
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HTTP404Error()
    }

    const updatedUser = (await user.update({ ...userData, id: userId })) as undefined | Partial<User>
    if (!updatedUser) {
      throw new HTTP500Error(500)
    }
    delete updatedUser.password

    return updatedUser
  }

  public async deleteUser(userId: string) {
    if (isEmpty(userId)) {
      throw new HTTP400Error()
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HTTP404Error()
    }

    await User.delete({ id: userId })
    return user
  }
}

export default UserService
