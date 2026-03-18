import path from 'path';

export default {
  testEnvironment: path.resolve(__dirname, 'jest-silent-env.js'),
  testEnvironmentOptions: {
    logPassedTests: false,
  },
  verbose: true,
};
