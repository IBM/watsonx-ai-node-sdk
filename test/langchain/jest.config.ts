import type { Config } from 'jest';
import global from '../../jest.global.config.js';

const config: Config = {
  ...global,
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  collectCoverage: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 20000,
};

export default config;
