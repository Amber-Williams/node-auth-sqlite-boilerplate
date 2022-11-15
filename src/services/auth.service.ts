import * as jwt from "jsonwebtoken"

import config from "@config"
import User from "@models/user.model"
import Tokens from "@models/tokens.model"
import { HTTP400Error, HTTP401Error, HTTP500Error } from "@exceptions"
import { isEmpty } from "@utils"
import database from "@database"
import { Roles, IUserPublic } from "@typings/users.type"
import { ICreateAuthTokens } from "@typings/auth.type"

class AuthService {
  private getScopes(role: Roles): Array<string> {
    const scopes = ["auth", "user:read", "user:delete", "user:update"]
    if (role === Roles.Admin) {
      return [...scopes, "user:create", "users:read"]
    }
    return scopes
  }

  private createIdToken = (payload: { userId: string; username: string; email: string }) => {
    const { amount, unit } = config.auth.refreshTokenExpiry
    const idToken = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return idToken
  }

  private createRefreshToken = () => {
    const { amount, unit } = config.auth.refreshTokenExpiry
    const refreshToken = jwt.sign({}, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return refreshToken
  }

  private createAccessToken = (role: Roles) => {
    const payload = { scopes: this.getScopes(role) }
    const { amount, unit } = config.auth.accessTokenExpiry
    const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return accessToken
  }

  public createAuthTokens = async ({ userId, username, email, role }: ICreateAuthTokens) => {
    try {
      const refresh = this.createRefreshToken()
      const access = this.createAccessToken(role)
      const identity = this.createIdToken({ userId, username, email })
      const userTokens = await Tokens.findOne({ where: { userId } })
      if (!userTokens) {
        await Tokens.save({ userId, refresh, access, identity })
        return { access, refresh, identity }
      }

      const updatedUserTokens = await userTokens.update({ userId, refresh, access, identity })
      if (!updatedUserTokens) {
        throw new HTTP500Error(500)
      }

      return { access, refresh, identity }
    } catch (error) {
      throw new Error(error)
    }
  }

  public removeAuthTokens = async (userId: string) => {
    try {
      const userTokens = await Tokens.findOne({ where: { userId } })
      userTokens.remove()
    } catch (error) {
      throw new Error(error)
    }
  }

  public verifyToken = (token: string): jwt.JwtPayload | false => {
    // returns payload if valid
    try {
      return jwt.verify(token, config.auth.jwtSecret) as jwt.JwtPayload
    } catch {
      return false
    }
  }

  public getUserIfPasswordMatch = async (email: string, password: string) => {
    if (isEmpty(email)) {
      throw new HTTP400Error()
    }

    const userRepository = database.dataSource.getRepository(User)
    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: email })
      .getOne()

    if (!user || !user.checkIfPasswordMatch(password, user.password)) {
      throw new HTTP401Error()
    }

    return user
  }

  public getUserIdentityByToken = async (identity: string): Promise<IUserPublic> => {
    const user = this.verifyToken(identity)
    if (!user) {
      throw new HTTP401Error()
    }
    return user as IUserPublic
  }

  public verifyTokens = async ({ userId, refresh, identity }: { userId: string; refresh: string; identity: string }) => {
    const userTokens = await Tokens.findOne({ where: { userId, refresh, identity } })
    if (!userTokens) {
      throw new HTTP401Error()
    }
    return true
  }
}

export default AuthService
