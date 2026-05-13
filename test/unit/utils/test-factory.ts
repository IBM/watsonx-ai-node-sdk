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

import type { BaseService } from 'ibm-cloud-sdk-core';
import { describeMethod, type MethodTestSpec, type DescribeMethodOptions } from './helpers';

/**
 * Creates a pre-configured describeMethod function with default options. This factory eliminates
 * the need to repeatedly pass the same service, mock getter, API key, and options to describeMethod
 * in each test file.
 *
 * @example
 *   ```typescript
 *   const mockSetup = createRequestMockSetup();
 *   const service = new MyService(serviceOptions);
 *
 *   const describeMethod = createDescribeMethod(
 *     service,
 *     mockSetup.getMock,
 *     'test-api-key',
 *     { version: '2023-07-07' }
 *   );
 *
 *   // Now use it in tests without repeating parameters
 *   describeMethod('myMethod', {
 *     method: (p) => service.myMethod(p),
 *     callParams: { id: '123' },
 *     // ... other spec properties
 *   });
 *   ```;
 *
 * @param service - The service instance being tested
 * @param getRequestMock - Function that returns the mocked request spy
 * @param apiKey - The API key used for authentication
 * @param defaultOptions - Default options to apply to all describeMethod calls
 * @returns A pre-configured describeMethod function
 */
export function createDescribeMethod(
  service: BaseService,
  getRequestMock: () => jest.SpyInstance,
  apiKey: string,
  defaultOptions: DescribeMethodOptions = {}
) {
  return (name: string, spec: MethodTestSpec, options?: DescribeMethodOptions) =>
    describeMethod(name, spec, service, getRequestMock, apiKey, {
      ...defaultOptions,
      ...options,
    });
}

// Made with Bob
