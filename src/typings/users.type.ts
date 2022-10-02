export interface IUser {
  id: string
  email: string
  username: string
  password: string
  should: "fail"
}

export type IUserPublic = Pick<IUser, "id" | "email" | "username">

export type IUsers = IUser[]

export type ICreateUser = Pick<IUser, "email" | "username" | "password">

export interface IUpdateUser extends ICreateUser {}
