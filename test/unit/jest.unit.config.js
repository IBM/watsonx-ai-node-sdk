const global = require('../../jest.global.config.js');

module.exports = {
  ...global,
  rootDir: '../../',
  testMatch: ['<rootDir>/test/unit/**/*.test.js'],
};
