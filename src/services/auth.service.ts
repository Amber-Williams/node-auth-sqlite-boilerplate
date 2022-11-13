import * as jwt from "jsonwebtoken"

import config from "@config"
import User from "@models/user.model"
import { HTTP400Error, HTTP401Error } from "@exceptions"
import { isEmpty } from "@utils"
import database from "@database"
import { Roles } from "@typings/users.type"

class AuthService {
  private getScopes(role: Roles): Array<string> {
    const scopes = ["auth", "user:read", "user:delete", "user:update"]
    if (role === Roles.Admin) {
      return [...scopes, "user:create", "users:read"]
    }
    return scopes
  }

  private createIdToken = (payload: { id: string; username: string; email: string }) => {
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

  public createAccessToken = (role: Roles) => {
    const payload = { scopes: this.getScopes(role) }
    const { amount, unit } = config.auth.accessTokenExpiry
    const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return accessToken
  }

  public createAuthTokens({ id, username, email, role }: { id: string; username: string; email: string; role: Roles }) {
    const refreshToken = this.createRefreshToken()
    const accessToken = this.createAccessToken(role)
    const idToken = this.createIdToken({ id, username, email })

    return { accessToken, refreshToken, idToken }
  }

  public getUserTokenPayload = (token: string) => {
    // also verifies payload
    try {
      const payload = jwt.verify(token, config.auth.jwtSecret, { complete: false }) as jwt.JwtPayload
      return payload
    } catch {
      return false
    }
  }

  public verifyRefreshToken = (refreshToken: string) => {
    try {
      return Boolean(jwt.verify(refreshToken, config.auth.jwtSecret))
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
}

export default AuthService
