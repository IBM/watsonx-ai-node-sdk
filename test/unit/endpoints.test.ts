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

import { PLATFORM_URL_MAPPINGS } from '../../src/config/endpoints';

/**
 * Hardcoded fixture URLs that reflect the actual platform URL mappings used in production. These
 * fixtures serve as a reference to ensure no URLs are accidentally removed or modified. If
 * PLATFORM_URL_MAPPINGS changes, these tests will catch the discrepancy.
 */
const EXPECTED_PLATFORM_URL_MAPPINGS: Record<string, string> = {
  // Dallas
  'https://us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com',
  'https://private.us-south.ml.cloud.ibm.com': 'https://private.api.dataplatform.cloud.ibm.com',
  // Frankfurt
  'https://eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com',
  'https://private.eu-de.ml.cloud.ibm.com': 'https://private.api.eu-de.dataplatform.cloud.ibm.com',
  // London
  'https://eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com',
  'https://private.eu-gb.ml.cloud.ibm.com': 'https://private.api.eu-gb.dataplatform.cloud.ibm.com',
  // Tokyo
  'https://jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com',
  'https://private.jp-tok.ml.cloud.ibm.com':
    'https://private.api.jp-tok.dataplatform.cloud.ibm.com',
  // Sydney
  'https://au-syd.ml.cloud.ibm.com': 'https://api.au-syd.dai.cloud.ibm.com',
  'https://private.au-syd.ml.cloud.ibm.com': 'https://private.api.au-syd.dai.cloud.ibm.com',
  // Toronto
  'https://ca-tor.ml.cloud.ibm.com': 'https://api.ca-tor.dai.cloud.ibm.com',
  'https://private.ca-tor.ml.cloud.ibm.com': 'https://private.api.ca-tor.dai.cloud.ibm.com',
  // YP-QA
  'https://yp-qa.ml.cloud.ibm.com': 'https://api.dataplatform.test.cloud.ibm.com',
  'https://private.yp-qa.ml.cloud.ibm.com': 'https://private.api.dataplatform.test.cloud.ibm.com',
  // MCSP
  'https://wxai-qa.ml.cloud.ibm.com': 'https://api.dai.test.cloud.ibm.com',
  'https://wml-mcsp-dev.ml.test.cloud.ibm.com': 'https://api.dai.dev.cloud.ibm.com',
  'https://private.wml-mcsp-dev.ml.test.cloud.ibm.com': 'https://private.api.dai.dev.cloud.ibm.com',
  // AWS
  'https://ap-south-1.aws.wxai.ibm.com': 'https://api.ap-south-1.aws.data.ibm.com/wx',
  'https://private.ap-south-1.aws.wxai.ibm.com': 'https://api.ap-south-1.aws.data.ibm.com',
  'https://us-east-1.aws.wxai.ibm.com': 'https://api.us-east-1.aws.data.ibm.com',
  'https://private.us-east-1.aws.wxai.ibm.com': 'https://api.us-east-1.aws.data.ibm.com',
};

describe('Platform URL Mappings Tests', () => {
  describe('PLATFORM_URL_MAPPINGS integrity', () => {
    test('contains all expected URL mappings', () => {
      // Verify that all expected URLs are present in PLATFORM_URL_MAPPINGS
      const missingUrls: string[] = [];
      Object.keys(EXPECTED_PLATFORM_URL_MAPPINGS).forEach((mlUrl) => {
        if (!(mlUrl in PLATFORM_URL_MAPPINGS)) {
          missingUrls.push(mlUrl);
        }
      });

      expect(missingUrls).toEqual([]);
    });

    test('not to have any URLs removed from the expected mappings', () => {
      // Verify that no URLs have been removed
      const expectedUrlCount = Object.keys(EXPECTED_PLATFORM_URL_MAPPINGS).length;
      const actualUrlCount = Object.keys(PLATFORM_URL_MAPPINGS).length;

      expect(actualUrlCount).toBe(expectedUrlCount);
    });

    test('maps each ML URL to the correct platform URL', () => {
      // Iterate over expected mappings and verify each one
      Object.entries(EXPECTED_PLATFORM_URL_MAPPINGS).forEach(([mlUrl, expectedPlatformUrl]) => {
        expect(PLATFORM_URL_MAPPINGS[mlUrl]).toBe(expectedPlatformUrl);
      });
    });
  });

  describe('Individual URL mapping verification', () => {
    test.each(Object.entries(EXPECTED_PLATFORM_URL_MAPPINGS))(
      'correctly maps %s to %s',
      (mlUrl, expectedPlatformUrl) => {
        expect(PLATFORM_URL_MAPPINGS[mlUrl]).toBe(expectedPlatformUrl);
      }
    );
  });

  describe('URL mapping structure validation', () => {
    test('has all ML URLs starting with https://', () => {
      Object.keys(PLATFORM_URL_MAPPINGS).forEach((mlUrl) => {
        expect(mlUrl).toMatch(/^https:\/\//);
      });
    });

    test('has all platform URLs starting with https://', () => {
      Object.values(PLATFORM_URL_MAPPINGS).forEach((platformUrl) => {
        expect(platformUrl).toMatch(/^https:\/\//);
      });
    });

    test('does not have any empty or undefined mappings', () => {
      Object.entries(PLATFORM_URL_MAPPINGS).forEach(([mlUrl, platformUrl]) => {
        expect(mlUrl).toBeTruthy();
        expect(platformUrl).toBeTruthy();
        expect(mlUrl.trim()).not.toBe('');
        expect(platformUrl.trim()).not.toBe('');
      });
    });
  });

  describe('Regression detection', () => {
    test('detects if any expected URLs are missing', () => {
      const missingUrls: string[] = [];

      Object.keys(EXPECTED_PLATFORM_URL_MAPPINGS).forEach((mlUrl) => {
        if (!(mlUrl in PLATFORM_URL_MAPPINGS)) {
          missingUrls.push(mlUrl);
        }
      });

      if (missingUrls.length > 0) {
        fail(
          `The following URLs are missing from PLATFORM_URL_MAPPINGS:\n${missingUrls.join('\n')}`
        );
      }
    });

    test('detects if any URL mappings have changed', () => {
      const changedMappings: Array<{ url: string; expected: string; actual: string }> = [];

      Object.entries(EXPECTED_PLATFORM_URL_MAPPINGS).forEach(([mlUrl, expectedPlatformUrl]) => {
        const actualPlatformUrl = PLATFORM_URL_MAPPINGS[mlUrl];
        if (actualPlatformUrl && actualPlatformUrl !== expectedPlatformUrl) {
          changedMappings.push({
            url: mlUrl,
            expected: expectedPlatformUrl,
            actual: actualPlatformUrl,
          });
        }
      });

      if (changedMappings.length > 0) {
        const errorMessage = changedMappings
          .map(
            (change) =>
              `URL: ${change.url}\n  Expected: ${change.expected}\n  Actual: ${change.actual}`
          )
          .join('\n\n');
        fail(`The following URL mappings have changed:\n\n${errorMessage}`);
      }
    });
  });
});

// Made with Bob
