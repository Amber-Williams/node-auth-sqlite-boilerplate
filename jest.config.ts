import type { Config } from "@jest/types"

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      verbose: true,
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/**/*.ts"],
      moduleNameMapper: {
        "^@server(.*)$": "<rootDir>/src/index.ts",
        "^@app(.*)$": "<rootDir>/src/app.ts",
        "^@database(.*)$": "<rootDir>/src/database/index.ts",
        "^@config(.*)$": "<rootDir>/src/config/index.ts",
        "^@logger(.*)$": "<rootDir>/src/features/logger/index.ts",
        "^@utils(.*)$": "<rootDir>/src/utils/$1",
        "^@controllers(.*)$": "<rootDir>/src/controllers/$1",
        "^@models(.*)$": "<rootDir>/src/models/$1",
        "^@exceptions(.*)$": "<rootDir>/src/exceptions/$1",
        "^@typings(.*)$": "<rootDir>/src/typings/$1",
        "^@middlewares(.*)$": "<rootDir>/src/middlewares/$1",
        "^@routes(.*)$": "<rootDir>/src/routes/$1",
        "^@services(.*)$": "<rootDir>/src/services/$1",
      },
    },
  ],
}

export default config
