const NodeEnvironment = require('jest-environment-node').default;

class SilentConsoleEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.logPassedTests = config.projectConfig.testEnvironmentOptions?.logPassedTests || false;
    this.logBuffer = [];
  }

  async setup() {
    await super.setup();
    this.originalLog = this.global.console.log;

    if (this.logPassedTests) return;

    this.logBuffer = [];

    this.global.console.log = (...args) => {
      this.logBuffer.push(args);
    };
    this.global.console.warn = (...args) => {
      this.logBuffer.push(args);
    };
  }

  async teardown() {
    if (!this.logPassedTests) {
      this.global.console.log = this.originalLog;
    }
    await super.teardown();
  }

  async handleTestEvent(event) {
    if (event.name !== 'test_done' || this.logPassedTests) return;

    const shouldLog = event.test.errors.length > 0;

    if (shouldLog) {
      this.originalLog(`\n--- Console output for failed  test: ${event.test.name} ---`);

      if (this.logBuffer.length > 0) {
        this.logBuffer.forEach((args) => this.originalLog(...args));
      } else {
        this.originalLog('\n--- No logs in failed test ---');
      }

      this.originalLog('--- end of logs ---\n');
    }

    // Clear for next test
    this.logBuffer.length = 0;
  }
}

module.exports = SilentConsoleEnvironment;
