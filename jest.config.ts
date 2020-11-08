import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ]
}

export default config;