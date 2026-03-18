/**
 * (C) Copyright IBM Corp. 2025-2026.
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

import type { WatsonXAI } from '../../src';

type PagerConstructor<T> = new (
  service: WatsonXAI,
  params: Record<string, unknown>
) => WatsonXAI.Pager<T, any> | WatsonXAI.ListPromptsPager | WatsonXAI.ListSpacesPager;

/**
 * Custom error class for polling operations that includes additional context about the polling
 * attempt that failed.
 *
 * Use this error type when a polling operation fails after exhausting retry attempts or encounters
 * an unrecoverable error. It preserves the original error context along with metadata about the
 * polling attempt (attempt number and max attempts configured).
 *
 * @example
 *   throw new PollingError('Polling timeout exceeded', originalError, 5, 10);
 */
class PollingError extends Error {
  originalError: unknown;
  attemptNumber: number;
  maxAttempts: number;

  /**
   * Creates a new PollingError instance
   *
   * @param {string} message - Error message
   * @param {unknown} original - The original error that was thrown
   * @param {number} attempt - The attempt number when the error occurred
   * @param {number} max - The maximum number of attempts configured
   */
  constructor(message: string, original: unknown, attempt: number, max: number) {
    super(message);
    this.originalError = original;
    this.attemptNumber = attempt;
    this.maxAttempts = max;
  }
}

/**
 * Utility function to wait for a specified timeout
 *
 * @param {number} timeout - Time to wait in milliseconds
 * @returns {Promise<void>} Promise that resolves after the timeout
 */
const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

type FunctionProperties<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

/**
 * Helper class for mocking module functions in tests
 *
 * This class uses FunctionProperties<T> to restrict functionName to only function properties,
 * providing type safety for public methods. However, when mocking private methods (e.g.,
 * 'createRequest'), you must use 'as any' to bypass TypeScript's type checking:
 *
 * @example
 *   // Mocking a private method requires 'as any' cast
 *   const mocker = new MockingRequest(client, 'createRequest' as any);
 *
 * @template T - Type of the module instance being mocked
 */
class MockingRequest<T extends object> {
  functionMock: jest.SpyInstance | null;
  moduleInstance: T;
  functionName: keyof FunctionProperties<T>;

  /**
   * Creates a new MockingRequest instance
   *
   * @param {T} moduleInstance - The module instance to mock
   * @param {string} functionName - The name of the function to mock
   */

  constructor(moduleInstance: T, functionName: keyof FunctionProperties<T>) {
    this.functionMock = null;
    this.moduleInstance = moduleInstance;
    this.functionName = functionName;
  }

  /**
   * Mocks the function with an optional implementation
   *
   * @param {(...args: unknown[]) => any} [implementation] - Optional function implementation for
   *   the mocked function
   * @returns {void}
   */
  mock(implementation?: (...args: any[]) => any) {
    const spy = jest.spyOn(this.moduleInstance, this.functionName);

    if (!implementation) {
      // Just spy without changing behavior
      this.functionMock = spy;
    } else {
      // Use the provided function as the implementation
      this.functionMock = spy.mockImplementation(implementation);
    }
  }

  /**
   * Restores the original function implementation
   *
   * @returns {void}
   */
  unmock() {
    if (this.functionMock) {
      this.functionMock.mockRestore();
      this.functionMock = null;
    }
  }

  /**
   * Clears the mock call history
   *
   * @returns {void}
   */
  clearMock() {
    if (this.functionMock) {
      this.functionMock.mockClear();
    }
  }
}

/**
 * Assert that a response has the expected status code and result is defined
 *
 * @param {{ status: number; result: Record<string, any> }} res - The response object to validate
 * @param {number} statusCode - Expected HTTP status code
 * @returns {void}
 */
function expectSuccessResponse(
  res: { status: number; result: Record<string, any> },
  statusCode: number
) {
  expect(res.status).toBe(statusCode);
  expect(res.result).toBeDefined();
}

/**
 * Generic polling utility that repeatedly calls an async function until a condition is met
 *
 * @param {() => Promise<WatsonXAI.Response<any>>} asyncFn - Async function to call repeatedly
 * @param {(arg0: Record<string, any>) => boolean} conditionFn - Function that returns true when
 *   condition is met
 * @param {((arg0: Record<string, any>) => any) | null} errorFn - Optional function that returns
 *   true if operation failed
 * @param {number} [maxAttempts] - Maximum number of attempts (default: 5)
 * @param {number} [delay] - Delay between retries in milliseconds (default: 10000)
 * @param {string} [operationName] - Optional name of the operation for better error messages
 * @returns {Promise<WatsonXAI.Response<any>>} Result when condition is met
 * @throws {PollingError} If max retries reached or error condition met
 */
async function pollUntilCondition(
  asyncFn: () => Promise<WatsonXAI.Response<any>>,
  conditionFn: (arg0: Record<string, any>) => boolean,
  errorFn: ((arg0: Record<string, any>) => any) | null,
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
    } catch (error: unknown) {
      const isLastAttempt = i === maxAttempts - 1;
      if (isLastAttempt) {
        const attemptInfo = `attempt ${i + 1}/${maxAttempts}`;
        const errorMessage = error instanceof Error ? error.message : String(error);
        const enhancedError = new PollingError(
          `${operationName} failed on ${attemptInfo}: ${errorMessage}`,
          error,
          i + 1,
          maxAttempts
        );
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
 * @template T - Type of items returned by the pager
 * @param {PagerConstructor<T>} pagerClass - The pager class to test (e.g., ListPromptsPager)
 * @param {WatsonXAI} service - Service instance
 * @param {Record<string, any>} params - Parameters for the pager
 * @param {number} [minExpectedResults=1] - Minimum expected results (default: 1). Default is `1`
 * @returns {Promise<void>}
 */
async function testPagerPattern<T>(
  pagerClass: PagerConstructor<T>,
  service: WatsonXAI,
  params: Record<string, any>,
  minExpectedResults: number = 1
) {
  const allResults = [];

  // Test getNext() - creates first pager instance
  let pager = new pagerClass(service, params);
  while (pager.hasNext()) {
    const nextPage = await pager.getNext();

    expect(nextPage).not.toBeNull();

    allResults.push(...nextPage);
  }

  // Test getAll() - creates second pager instance because pager state is consumed after getNext() iteration
  // The pager cannot be reused as it maintains internal state (hasNext() returns false after iteration completes)
  pager = new pagerClass(service, params);
  const allItems = await pager.getAll();

  expect(allItems).not.toBeNull();
  expect(allItems.length).toBeGreaterThanOrEqual(minExpectedResults);
  expect(allItems).toHaveLength(allResults.length);
}

/**
 * Create a COS (Cloud Object Storage) reference model for text extraction/classification
 *
 * @example
 *   ```typescript
 *   const cosRef = createCosReference('data.pdf', 'my-bucket', 'cos-connection-id-123');
 *   ```;
 *
 * @param {string} fileName - Name of the file in COS
 * @param {string} bucket - COS bucket name
 * @param {string} connectionId - COS connection ID
 * @returns {{
 *   type: string;
 *   connection: { id: string };
 *   location: { file_name: string; bucket: string };
 * }}
 *   COS reference model with connection and location
 */
function createCosReference(fileName: string, bucket: string, connectionId: string) {
  return {
    type: 'connection_asset',
    connection: { id: connectionId },
    location: { file_name: fileName, bucket },
  };
}

export {
  wait,
  MockingRequest,
  expectSuccessResponse,
  pollUntilCondition,
  testPagerPattern,
  createCosReference,
};
