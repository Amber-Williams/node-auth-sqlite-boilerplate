export interface IUser {
  id: string
  email: string
  username: string
  password: string
  role: Roles
}

export type IUserPublic = Pick<IUser, "id" | "email" | "username" | "role">

export type IUsers = IUser[]

export type ICreateUser = Pick<IUser, "email" | "username" | "password">

export interface IUpdateUser extends ICreateUser {
  role: Roles
}

export enum Roles {
  User = "user",
  Admin = "admin",
}
