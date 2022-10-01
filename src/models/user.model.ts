import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import bcrypt from "bcrypt"

import logger from "../features/logger"
import { IUser } from "src/types/users.type"

class RecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @Column({ select: false })
  @CreateDateColumn()
  createdAt: Date

  @Column()
  @UpdateDateColumn()
  updatedAt: Date
}

@Entity("users")
class User extends RecordEntity implements IUser {
  @Column({ unique: true })
  public email: string

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
    }
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
