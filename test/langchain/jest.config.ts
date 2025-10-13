import type { Config } from 'jest';
import global from '../../jest.global.config.js';

const config: Config = {
  ...global,
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  collectCoverage: true,
  testEnvironment: '../../jest-silent-env.js',
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 20000,
  testNamePattern: 'test',
  collectCoverageFrom: ['**/src/**/*.{js,ts}', '!**/.yalc/**', '!**/dist/**', '!**/coverage/**'],
  verbose: true,
  modulePathIgnorePatterns: ['dist/', 'docs/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(?:@ibm-cloud/watsonx-ai)/)', '/\\.yalc/'],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
};

export default config;
