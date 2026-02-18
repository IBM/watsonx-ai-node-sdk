/**
 * (C) Copyright IBM Corp. 2025.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

class MockingRequest {
  constructor(moduleInstance, functionName) {
    this.functionMock = null;
    this.moduleInstance = moduleInstance;
    this.functionName = functionName;
  }

  mock(response) {
    if (response)
      this.functionMock = jest
        .spyOn(this.moduleInstance, this.functionName)
        .mockImplementation(async () => response);
    else this.functionMock = jest.spyOn(this.moduleInstance, this.functionName);
  }

  unmock() {
    if (this.functionMock) {
      this.functionMock.mockRestore();
      this.functionMock = null;
    }
  }

  clearMock() {
    if (this.functionMock) {
      this.functionMock.mockClear();
    }
  }
}

/**
 * Assert that a response has the expected status code and result is defined
 *
 * @param {Object} res - The response object to validate
 * @param {number} statusCode - Expected HTTP status code
 */
function expectSuccessResponse(res, statusCode) {
  expect(res.status).toBe(statusCode);
  expect(res.result).toBeDefined();
}

/**
 * Generic polling utility that repeatedly calls an async function until a condition is met
 *
 * @param {Function} asyncFn - Async function to call repeatedly
 * @param {Function} conditionFn - Function that returns true when condition is met
 * @param {Function} errorFn - Optional function that returns true if operation failed
 * @param {number} maxAttempts - Maximum number of attempts (default: 5)
 * @param {number} delay - Delay between retries in milliseconds (default: 10000)
 * @param {string} operationName - Optional name of the operation for better error messages
 * @returns {Promise} Result when condition is met
 * @throws {Error} If max retries reached or error condition met
 */
async function pollUntilCondition(
  asyncFn,
  conditionFn,
  errorFn = null,
  maxAttempts = 5,
  delay = 10000,
  operationName = 'operation'
) {
  if (typeof asyncFn !== 'function' || typeof conditionFn !== 'function') {
    throw new TypeError('asyncFn and conditionFn must be functions');
  }

  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const result = await asyncFn();
      if (conditionFn(result)) {
        return result;
      }
      if (errorFn && errorFn(result)) {
        const errorDetails = result.result?.entity?.results?.error?.message || 'Unknown error';
        throw new Error(`${operationName} failed during polling. Error: ${errorDetails}`);
      }
    } catch (error) {
      const isLastAttempt = i === maxAttempts - 1;
      if (isLastAttempt) {
        const attemptInfo = `attempt ${i + 1}/${maxAttempts}`;
        const enhancedError = new Error(
          `${operationName} failed on ${attemptInfo}: ${error.message}`
        );
        enhancedError.originalError = error;
        enhancedError.attemptNumber = i + 1;
        enhancedError.maxAttempts = maxAttempts;
        throw enhancedError;
      }
      // Continue to next retry
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // If we exhausted retries due to condition not being met (not errors)
  throw new Error(
    `${operationName} failed to complete after ${maxAttempts} retries (waited ${
      (maxAttempts * delay) / 1000
    }s total)`
  );
}

/**
 * Test pager pattern for list operations with pagination
 *
 * @param {Class} PagerClass - The pager class to test (e.g., ListPromptsPager)
 * @param {Object} service - Service instance
 * @param {Object} params - Parameters for the pager
 * @param {number} minExpectedResults - Minimum expected results (default: 1)
 */
async function testPagerPattern(PagerClass, service, params, minExpectedResults = 1) {
  const allResults = [];

  // Test getNext() - creates first pager instance
  let pager = new PagerClass(service, params);
  while (pager.hasNext()) {
    const nextPage = await pager.getNext();

    expect(nextPage).not.toBeNull();

    allResults.push(...nextPage);
  }

  // Test getAll() - creates second pager instance because pager state is consumed after getNext() iteration
  // The pager cannot be reused as it maintains internal state (hasNext() returns false after iteration completes)
  pager = new PagerClass(service, params);
  const allItems = await pager.getAll();

  expect(allItems).not.toBeNull();
  expect(allItems.length).toBeGreaterThanOrEqual(minExpectedResults);
  expect(allItems).toHaveLength(allResults.length);
}

/**
 * Create a COS (Cloud Object Storage) reference model for text extraction/classification
 *
 * @example
 *   const cosRef = createCosReference('data.pdf', 'my-bucket', 'cos-connection-id-123');
 *
 * @param {string} fileName - Name of the file in COS
 * @param {string} bucket - COS bucket name
 * @param {string} connectionId - COS connection ID
 * @returns {Object} COS reference model with connection and location
 */
function createCosReference(fileName, bucket, connectionId) {
  return {
    type: 'connection_asset',
    connection: { id: connectionId },
    location: { file_name: fileName, bucket },
  };
}

module.exports = {
  wait,
  MockingRequest,
  expectSuccessResponse,
  pollUntilCondition,
  testPagerPattern,
  createCosReference,
};
