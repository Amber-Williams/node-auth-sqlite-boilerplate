import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

export default {
  environment: process.env.ENVIRONMENT || "development",
  isProduction: process.env.ENVIRONMENT === "production",
  port: process.env.PORT || 3000,
  debug: false,
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiry: {
      unit: "minute",
      amount: 30,
    },
    refreshTokenExpiry: {
      unit: "day",
      amount: 7,
    },
  },
}
