/**
 * (C) Copyright IBM Corp. 2026.
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

import { BaseService } from 'ibm-cloud-sdk-core';

/** Interface for the mock setup object returned by createMockSetup and createRequestMockSetup. */
export interface MockSetup {
  /** Returns the current mock spy instance (throws if setup() hasn't been called) */
  getMock: () => jest.SpyInstance;
  /** Initializes the mock spy */
  setup: () => void | Promise<void>;
  /** Resets the mock (clears history and implementation) */
  reset: () => void;
  /** Clears the mock call history without resetting implementation */
  clear: () => void;
  /** Restores the original implementation */
  unmock: () => void;
  /** Sets the mock implementation with an optional return value */
  mockReturnValue: (returnValue?: any) => void;
}

/**
 * Creates a reusable mock setup for any method. This unified factory eliminates the need to
 * duplicate mock setup code across test files.
 *
 * @example
 *   ```typescript
 *   // Example 1: Simple spy without mocking return value
 *   const mockSetup = createMockSetup({
 *     target: BaseService.prototype,
 *     method: 'createRequest' as any,
 *   });
 *
 *   beforeAll(() => {
 *     mockSetup.setup();
 *   });
 *
 *   afterEach(() => {
 *     mockSetup.reset();
 *   });
 *   ```;
 *
 * @example
 *   ```typescript
 *   // Example 2: Mock with custom return value
 *   import * as auth from '../utils/auth';
 *   import * as authenticators from '../../src/authentication';
 *
 *   const authMockSetup = createMockSetup({
 *     target: authenticators.IamTokenManager.prototype,
 *     method: 'requestToken' as any,
 *     returnValue: auth.requestAdminToken()
 *   });
 *
 *   beforeEach(async () => {
 *     await authMockSetup.setup();
 *   });
 *
 *   afterEach(() => {
 *     authMockSetup.clear();
 *   });
 *   ```;
 *
 * @param options - Configuration options
 * @param options.target - The target object/prototype to spy on
 * @param options.method - The name of the method to mock
 * @param options.returnValue - Optional value to return from the mock. If not provided, the method
 *   will be spied on without changing its behavior.
 * @returns An object with methods to manage the mock lifecycle
 */
export function createMockSetup<T extends object>(options: {
  target: T;
  method: keyof T;
  returnValue?: any;
}): MockSetup {
  const { target, method, returnValue } = options;
  let mockSpy: jest.SpyInstance | null = null;

  return {
    getMock: () => {
      if (!mockSpy) {
        throw new Error('Mock not initialized. Call setup() first.');
      }
      return mockSpy;
    },
    setup: async () => {
      mockSpy = jest.spyOn(target, method as any);
      if (returnValue !== undefined) {
        if (typeof returnValue === 'function') {
          mockSpy.mockImplementation(returnValue);
        } else {
          mockSpy.mockImplementation(() => returnValue);
        }
      }
    },
    reset: () => {
      if (mockSpy) {
        mockSpy.mockReset();
      }
    },
    clear: () => {
      if (mockSpy) {
        mockSpy.mockClear();
      }
    },
    unmock: () => {
      if (mockSpy) {
        mockSpy.mockRestore();
        mockSpy = null;
      }
    },
    mockReturnValue: (value?: any) => {
      if (!mockSpy) {
        throw new Error('Mock not initialized. Call setup() first.');
      }
      mockSpy.mockImplementation(() => value);
    },
  };
}

/**
 * Creates a reusable mock setup for BaseService.createRequest. This is a convenience wrapper around
 * createMockSetup that targets BaseService.prototype.createRequest specifically.
 *
 * @example
 *   ```typescript
 *   const mockSetup = createRequestMockSetup();
 *
 *   beforeAll(() => {
 *     mockSetup.setup();
 *   });
 *
 *   beforeEach(() => {
 *     mockSetup.mockReturnValue({ result: {} });
 *   });
 *
 *   afterEach(() => {
 *     mockSetup.reset();
 *   });
 *   ```;
 *
 * @param defaultReturnValue - Optional default return value for the mock (default:
 *   Promise.resolve({ result: {} }))
 * @returns An object with methods to manage the mock lifecycle
 */
export function createRequestMockSetup(
  defaultReturnValue: any = Promise.resolve({ result: {} })
): MockSetup {
  const mockSetup = createMockSetup({
    target: BaseService.prototype,
    method: 'createRequest' as keyof BaseService,
  });

  // Wrap mockReturnValue to use defaultReturnValue when no argument is provided
  const originalMockReturnValue = mockSetup.mockReturnValue;
  mockSetup.mockReturnValue = (returnValue: any = defaultReturnValue) => {
    originalMockReturnValue(returnValue);
  };

  return mockSetup;
}

// Made with Bob
