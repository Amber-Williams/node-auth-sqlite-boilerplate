import "reflect-metadata"
import { DataSource } from "typeorm"

import User from "./models/user"
import logger from "./../features/logger"
import config from "./../config"

const db = new DataSource({
  type: "sqlite",
  database: "./main.sqlite",
  entities: [User],
  logging: true,
  logger: config.debug ? "advanced-console" : logger,
  synchronize: true,
})

db.initialize().catch(error => logger.log("error", error))

export default db
