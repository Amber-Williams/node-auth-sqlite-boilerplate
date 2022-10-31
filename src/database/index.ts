import "reflect-metadata"
import { DataSource } from "typeorm"

import User from "@models/user.model"
import logger from "@logger"
import config from "@config"
import { serverReady } from "@server"

class Database {
  public dataSource: DataSource

  constructor() {
    this.dataSource = new DataSource({
      type: "sqlite",
      database: `./main.${config.environment}.sqlite`,
      entities: [User],
      logging: true,
      logger: config.debug ? "advanced-console" : logger,
      synchronize: true,
    })
  }

  public async initialize() {
    return this.dataSource
      .initialize()
      .then(() => {
        logger.log("info", "Database connected")
        serverReady()
      })
      .catch(error => logger.log("error", error))
  }
}

const database = new Database()
database.initialize()

export default database
