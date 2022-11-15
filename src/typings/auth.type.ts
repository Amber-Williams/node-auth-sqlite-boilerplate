import { IUser } from "@typings/users.type"

export interface ICreateAuthTokens extends Pick<IUser, "email" | "username" | "password" | "role"> {
  userId: string
}

export interface IAuthTokens extends Pick<ICreateAuthTokens, "userId"> {
  access: string
  refresh: string
  identity: string
}
