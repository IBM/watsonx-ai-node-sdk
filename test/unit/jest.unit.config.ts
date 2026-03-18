import type { Config } from 'jest';
import global from '../../jest.global.config';

const config: Config = {
  ...global,
  rootDir: '../../',
  testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: {
          types: ['jest', 'node'],
        },
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(axios)/)'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
};

export default config;
