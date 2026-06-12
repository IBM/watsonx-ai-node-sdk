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
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 20000,
  testNamePattern: 'test',
  collectCoverageFrom: ['**/src/**/*.{js,ts}', '!**/.yalc/**', '!**/dist/**', '!**/coverage/**'],
  modulePathIgnorePatterns: ['dist/', 'docs/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@ibm-cloud/watsonx-ai|@langchain|langchain|deepagents|p-.*|uuid|eventemitter3|is-network-error))',
    '/\\.yalc/',
  ],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        module: { type: 'es6' },
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
          },
          target: 'es2022',
        },
      },
    ],
  },
  reporters: [
    'default',
    [
      'jest-allure2-reporter',
      {
        resultsDir: '../../allure-results',
        overwrite: false,
      },
    ],
  ],
};

export default config;

// Made with Bob
