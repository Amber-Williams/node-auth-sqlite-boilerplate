import User from "@models/user.model"
import { IUserPublic, IUpdateUser, ICreateUser } from "@typings/users.type"
import HttpException from "@exceptions/HttpExeption"
import { isEmpty } from "@utils"
import database from "@database"
class UserService {
  public async findAllUser() {
    const users = await User.find()
    return users
  }

  public async findUserById(userId: string) {
    if (isEmpty(userId)) {
      throw new HttpException(400, "Invalid data")
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpException(404, "User doesn't exist")
    }

    return user
  }

  public async createUser(userData: ICreateUser) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Invalid data")
    }
    const user = await User.findOne({ where: { email: userData.email } })
    if (user) {
      throw new HttpException(409, "Email already exists")
    }

    const createUserData: Partial<User> = await User.create<User>(userData).save()
    delete createUserData.password

    return createUserData as IUserPublic
  }

  public async updateUser(userId: string, userData: IUpdateUser) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Invalid data")
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpException(404, "User doesn't exist")
    }

    const updatedUser = (await user.update({ ...userData, id: userId })) as undefined | Partial<User>
    if (!updatedUser) {
      throw new HttpException(500, "Something went wrong")
    }
    delete updatedUser.password

    return updatedUser
  }

  public async deleteUser(userId: string) {
    if (isEmpty(userId)) {
      throw new HttpException(400, "Invalid data")
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpException(404, "User doesn't exist")
    }

    await User.delete({ id: userId })
    return user
  }
  public async getUserIfPasswordMatch(email: string, password: string) {
    if (isEmpty(email)) {
      throw new HttpException(400, "Invalid data")
    }

    const userRepository = database.dataSource.getRepository(User)
    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: email })
      .getOne()

    if (!user || !user.checkIfPasswordMatch(password, user.password)) {
      throw new HttpException(401, "Unauthorized")
    }

    return user
  }
}

export default UserService
