import { Entity, Column, BeforeUpdate, BeforeInsert } from "typeorm"
import bcrypt from "bcrypt"

import logger from "@logger"
import { IUser, Roles } from "@typings/users.type"
import Record from "@models/record.model"

@Entity("users")
class User extends Record implements IUser {
  @Column({ unique: true })
  public email: string

  @Column("text", { default: Roles.User })
  public role: Roles

  @Column({ unique: true })
  public username: string

  @Column({ select: false })
  password: string

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10)
      this.password = hashedPassword
    } catch (error) {
      logger.log("error", "Password failed hash")
      throw new Error()
    }
  }

  public checkIfPasswordMatch(unencryptedPassword: string, password: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, password)
  }

  public async update(user: IUser): Promise<User | undefined> {
    const entity = await User.findOne({ where: { id: user.id } })
    if (!entity) {
      return undefined
    }
    entity.updatedAt = new Date()

    return await User.save(Object.assign(entity, user))
  }
}

export default User
