import pino from "pino"

import config from "./../../config"

const logger = pino({
  level: config.environment === "production" ? "info" : "debug",
  formatters: {
    level(label: string, number: number) {
      return { level: label }
    },
  },
  timestamp: () => {
    const date = new Date().toISOString()
    return `, "time":" ${date}`
  },
})

export default logger
