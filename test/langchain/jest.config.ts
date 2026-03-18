import type { Config } from 'jest';
import path from 'path';

const config: Config = {
  testEnvironment: path.resolve('../../jest-silent-env.js'),
  testEnvironmentOptions: {
    logPassedTests: false,
  },
  verbose: true,
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  collectCoverage: true,
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 20000,
  testNamePattern: 'test',
  collectCoverageFrom: ['**/src/**/*.{js,ts}', '!**/.yalc/**', '!**/dist/**', '!**/coverage/**'],
  modulePathIgnorePatterns: ['dist/', 'docs/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(?:@ibm-cloud/watsonx-ai)/)', '/\\.yalc/'],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', { module: { type: 'module' } }],
  },
};

export default config;
