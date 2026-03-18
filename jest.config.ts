import type { Config } from 'jest';
import global from './jest.global.config';

const config: Config = {
  ...global,
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
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
  testPathIgnorePatterns: [
    '<rootDir>/test/langchain/',
    '<rootDir>/examples',
    '<rootDir>/test/integration/watsonx-ai-ml-lora_qlora.vml_v1.test.js',
    '<rootDir>/test/integration/watsonx-ai-ml-ilab.vml_v1.test.js',
  ],
};

export default config;
