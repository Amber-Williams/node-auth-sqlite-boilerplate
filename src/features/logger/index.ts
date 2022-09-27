import pino, { Logger as PinoLogger } from "pino"

import config from "./../../config"

import { Logger as TypeormLogger } from "typeorm"

const pinoLogger = pino({
  level: config.environment === "production" ? "info" : "debug",
  formatters: {
    level(label: string) {
      return { level: label }
    },
  },
  timestamp: () => {
    const date = new Date().toISOString()
    return `, "time":" ${date}`
  },
})

export class Logger implements TypeormLogger {
  constructor(private readonly logger: PinoLogger) {}
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  logQuery(query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "")
    this.log("log", sql)
  }

  logQueryError(_: string, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "")
    this.log("error", sql)
  }

  logQuerySlow(_: number, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "")
    this.log("info", sql)
  }

  logSchemaBuild(message: string) {
    this.log("log", message)
  }

  logMigration(message: string) {
    this.log("log", message)
  }

  log(level: "log" | "info" | "warn" | "error", message: any) {
    switch (level) {
      case "log":
      case "info":
        this.logger.info(message)
        break
      case "warn":
        this.logger.warn(message)
        break
      case "error":
        this.logger.error(message)
        break
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters)
    } catch (error) {
      // circular objects
      return parameters
    }
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
}

const logger = new Logger(pinoLogger)

export default logger
