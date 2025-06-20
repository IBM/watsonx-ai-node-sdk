import type { Config } from 'jest';
import global from '../jest.global.config.js';

const config: Config = {
  ...global,
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  collectCoverage: true,
  testEnvironment: '../jest-silent-env.js',
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 60000,
  testNamePattern: 'test',
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: ['**src/**/*.{js,ts}', '!**/.yalc/**', '!**/dist/**', '!**/coverage/**'],
  verbose: true,
};

export default config;
