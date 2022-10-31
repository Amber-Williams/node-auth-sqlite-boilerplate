import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.join(__dirname, "../../.env"),
})

export default {
  environment: process.env.ENVIRONMENT,
  isProduction: process.env.ENVIRONMENT === "production",
  port: process.env.PORT,
  debug: false,
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiry: {
      unit: "hour",
      amount: 1,
    },
    refreshTokenExpiry: {
      unit: "day",
      amount: 7,
    },
  },
}
