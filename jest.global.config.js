const path = require('path');

module.exports = {
  testEnvironment: path.resolve(__dirname, 'jest-silent-env.js'),
  testEnvironmentOptions: {
    logPassedTests: false,
  },
  verbose: true,
};
