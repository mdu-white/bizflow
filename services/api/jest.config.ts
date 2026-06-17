import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  testEnvironment: "node",

  testMatch: [
    "<rootDir>/src/test/e2e/**/*.e2e-spec.ts"
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true
        }
      }
    ]
  }
};

export default config;