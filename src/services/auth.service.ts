import * as jwt from "jsonwebtoken"

import config from "@config"
import User from "@models/user.model"
import HttpException from "@exceptions/HttpExeption"
import { isEmpty } from "@utils"
import database from "@database"

class AuthService {
  private createIdToken = (payload: { [key: string]: string }) => {
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

  public createAccessToken = () => {
    const { amount, unit } = config.auth.accessTokenExpiry
    const accessToken = jwt.sign({}, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return accessToken
  }

  public createAuthTokens(payload?: { [key: string]: string }) {
    const refreshToken = this.createRefreshToken()
    const accessToken = this.createAccessToken()
    const idToken = this.createIdToken(payload)

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

export default AuthService
