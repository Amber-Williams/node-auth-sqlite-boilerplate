import * as jwt from "jsonwebtoken"

import config from "@config"

class AuthService {
  public createAccessToken = (payload: { [key: string]: string }) => {
    const { amount, unit } = config.auth.accessTokenExpiry
    const accessToken = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return accessToken
  }
  public createRefreshToken = () => {
    const { amount, unit } = config.auth.refreshTokenExpiry
    const refreshToken = jwt.sign({}, config.auth.jwtSecret, {
      expiresIn: `${amount} ${unit}`,
    })
    return refreshToken
  }

  public createAuthTokens(payload: { [key: string]: string }) {
    const accessToken = this.createAccessToken(payload)
    const refreshToken = this.createRefreshToken()

    return { accessToken, refreshToken }
  }

  public getAccessTokenPayload = (token: string) => {
    // also verifies payload
    try {
      const payload = jwt.verify(token, config.auth.jwtSecret, { complete: false })
      return payload
    } catch {
      return false
    }
  }

  public verifyRefreshToken = (refreshToken: string) => {
    try {
      return Boolean(jwt.verify(refreshToken, config.auth.jwtSecret, { complete: false }))
    } catch {
      return false
    }
  }
}

export default AuthService