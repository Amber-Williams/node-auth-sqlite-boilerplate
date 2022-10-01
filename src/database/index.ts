import "reflect-metadata"
import { DataSource } from "typeorm"

import User from "../models/user.model"
import logger from "../features/logger"
import config from "../config"
import { serverReady } from "../index"

const db = new DataSource({
  type: "sqlite",
  database: "./main.sqlite",
  entities: [User],
  logging: true,
  logger: config.debug ? "advanced-console" : logger,
  synchronize: true,
})

db.initialize()
  .then(() => {
    logger.log("info", "Database connected")
    serverReady()
  })
  .catch(error => logger.log("error", error))

export default db
