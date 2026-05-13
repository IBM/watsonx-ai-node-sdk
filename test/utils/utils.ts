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

import type { BaseService } from 'ibm-cloud-sdk-core';
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

/**
 * Test helper to enforce required parameters validation
 *
 * @param methodFn - The method to test
 * @param emptyObjectError - Expected error pattern when called with empty object (default: /Missing
 *   required parameters/)
 * @param undefinedError - Expected error pattern when called with undefined (default: /Missing
 *   required parameters/)
 * @param baseParams - Optional base parameters to merge with test params (e.g., { projectId: 'xxx'
 *   })
 */
export function testRequiredParams(
  methodFn: (params?: any) => Promise<any>,
  emptyObjectError: RegExp = /Missing required parameters/,
  undefinedError: RegExp = /Missing required parameters/,
  baseParams?: Record<string, any>
) {
  test('enforces required parameters – empty object', async () => {
    const params = baseParams ? { ...baseParams } : {};
    await expect(methodFn(params)).rejects.toThrow(emptyObjectError);
  });
  test('enforces required parameters – undefined', async () => {
    const params = baseParams ? { ...baseParams } : undefined;
    await expect(methodFn(params)).rejects.toThrow(undefinedError);
  });
}

/**
 * Test helper to validate invalid parameters are rejected
 *
 * @param {(params?: any) => Promise<any>} methodFn - The method to test
 * @param {Record<string, any>} [minParams] - Minimum valid parameters
 * @returns {void}
 */
export function testInvalidParams(
  methodFn: (params?: any) => Promise<any>,
  minParams?: Record<string, any>
) {
  test('fails with invalid params passed', () => {
    expect(methodFn({ ...minParams, invalidParams: 'invalidParam' })).rejects.toThrow(
      /Found invalid parameters: invalidParams/
    );
  });
}

/**
 * Test helper to run tests with retries enabled and disabled
 *
 * @param {() => void} testFn - The test function to run
 * @param {any} service - The service instance with enableRetries/disableRetries methods
 * @param {jest.SpyInstance} [createRequestMock] - Optional mock to clear between runs
 * @returns {void}
 */
export function testWithRetries(
  testFn: () => void,
  service: BaseService,
  createRequestMock?: jest.SpyInstance
) {
  testFn();
  createRequestMock?.mockClear();
  service.enableRetries();
  testFn();
  createRequestMock?.mockClear();
  service.disableRetries();
  testFn();
}

export async function testAsyncWithRetries(
  testFn: () => Promise<void>,
  service: any,
  createRequestMock?: jest.SpyInstance
) {
  await testFn();
  createRequestMock?.mockClear();
  service.enableRetries();
  await testFn();
  createRequestMock?.mockClear();
  service.disableRetries();
  await testFn();
}

/**
 * Test helper for stream methods with retry configurations. Runs a stream test function three times
 * with different retry configurations: baseline, retries enabled, and retries disabled. Sets up the
 * stream mock before each run.
 *
 * @param {() => void} testFn - The test function to run
 * @param {any} service - The service instance with enableRetries/disableRetries methods
 * @param {jest.SpyInstance} createRequestMock - Mock to set up and clear between runs
 * @param {any} streamResult - The stream object to return from the mock
 * @returns {void}
 */
export function testWithRetriesStream(
  testFn: () => void,
  service: any,
  createRequestMock: jest.SpyInstance,
  streamResult: any
) {
  const setupStreamMock = () =>
    createRequestMock.mockImplementation(() => Promise.resolve({ result: streamResult }));

  const variants: Array<() => void> = [
    () => {},
    () => service.enableRetries(),
    () => service.disableRetries(),
  ];

  for (const configure of variants) {
    setupStreamMock();
    configure();
    testFn();
    createRequestMock.mockClear();
  }
}

export const getDefaultHeadersFromMock = (mock: jest.Mock | jest.SpyInstance) => {
  return mock.mock.calls[0][0].defaultOptions.headers;
};

export { wait, expectSuccessResponse, pollUntilCondition, testPagerPattern, createCosReference };
