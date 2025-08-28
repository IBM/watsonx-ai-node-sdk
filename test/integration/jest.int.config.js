const global = require('../../jest.global.config');

module.exports = {
  ...global,
  rootDir: '../../',
  testMatch: ['<rootDir>/test/integration/**/*.test.js'],
};
