"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    rootDir: ".",
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/src/test/e2e/**/*.e2e.spec.ts"
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
exports.default = config;
//# sourceMappingURL=jest.config.js.map