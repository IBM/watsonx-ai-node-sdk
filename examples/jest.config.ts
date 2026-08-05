import type { Config } from 'jest';
import global from '../jest.global.config';

const config: Config = {
  ...global,
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  collectCoverage: true,
  testEnvironment: '../jest-silent-env.js',
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 60000,
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: ['**src/**/*.{js,ts}', '!**/.yalc/**', '!**/dist/**', '!**/coverage/**'],
  verbose: true,
  reporters: [
    'default',
    [
      'jest-allure2-reporter',
      {
        resultsDir: '../allure-results',
        overwrite: false,
        testCase: {
          labels: {
            parentSuite: 'Examples',
            suite: ({ testCase, filePath }: any) => testCase.ancestorTitles[0] ?? filePath.at(-1),
            subSuite: ({ testCase }: any) => testCase.ancestorTitles.slice(1).join(' > '),
          },
        },
      },
    ],
  ],
};

export default config;
