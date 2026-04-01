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

/**
 * Type definitions for @ibm-cloud/sdk-test-utilities Project:
 * https://github.com/IBM/ibm-cloud-sdk-common
 */

declare module '@ibm-cloud/sdk-test-utilities' {
  /** Extract options from a mocked request */
  export function getOptions(createRequestMock: jest.Mock | jest.SpyInstance): any;

  /** Check URL and HTTP method of a request */
  export function checkUrlAndMethod(
    mockRequestOptions: any,
    expectedUrl: string,
    expectedMethod: string
  ): void;

  /** Check media headers (Accept and Content-Type) of a request */
  export function checkMediaHeaders(
    createRequestMock: jest.Mock | jest.SpyInstance,
    expectedAccept?: string,
    expectedContentType?: string
  ): void;

  /** Check if a value is a Promise */
  export function expectToBePromise(value: any): void;

  /** Check if a request was executed successfully */
  export function checkForSuccessfulExecution(
    createRequestMock: jest.Mock | jest.SpyInstance
  ): void;

  const unitTestUtils: {
    getOptions: typeof getOptions;
    checkUrlAndMethod: typeof checkUrlAndMethod;
    checkMediaHeaders: typeof checkMediaHeaders;
    expectToBePromise: typeof expectToBePromise;
    checkForSuccessfulExecution: typeof checkForSuccessfulExecution;
  };

  export default unitTestUtils;
}

// Made with Bob
