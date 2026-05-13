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

import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import type { Authenticator } from 'ibm-cloud-sdk-core';

/** Configuration options for creating a test service instance */
export interface TestServiceConfig {
  serviceUrl: string;
  apikey: string;
  version: string;
  authenticator: Authenticator;
  url: string;
}

/**
 * Creates a standard test service configuration with default values
 *
 * @param overrides - Optional configuration overrides
 * @returns Service configuration object
 */
export function createTestServiceConfig(
  overrides: Partial<TestServiceConfig> = {}
): TestServiceConfig {
  return {
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',
    apikey: 'test-api-key',
    version: '2023-07-07',
    authenticator: new NoAuthAuthenticator(),
    url: 'https://us-south.ml.cloud.ibm.com',
    ...overrides,
  };
}
