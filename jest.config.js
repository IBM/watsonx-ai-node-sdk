const global = require('./jest.global.config.js');

module.exports = {
  ...global,
  roots: ['<rootDir>/watsonx-ai-ml', '<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  testPathIgnorePatterns: [
    '<rootDir>/test/langchain/',
    '<rootDir>/examples',
    '<rootDir>/test/integration/watsonx-ai-ml-lora_qlora.vml_v1.test.js',
    '<rootDir>/test/integration/watsonx-ai-ml-ilab.vml_v1.test.js',
  ],
};
