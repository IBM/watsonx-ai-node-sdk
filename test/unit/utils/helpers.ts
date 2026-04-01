import unitTestUtils from '@ibm-cloud/sdk-test-utilities';
import type { BaseService } from 'ibm-cloud-sdk-core';
import { checkAxiosOptions } from './checks';
import {
  getDefaultHeadersFromMock,
  testRequiredParams,
  testInvalidParams,
  testWithRetries,
} from '../../utils/utils';

const { getOptions, checkUrlAndMethod, checkMediaHeaders, expectToBePromise } = unitTestUtils;

/**
 * Converts a camelCase string to snake_case. For example, "myVariableName" becomes
 * "my_variable_name".
 *
 * @param str - The input camelCase string.
 * @returns The converted snake_case string.
 */
const camelToSnake = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

/**
 * Converts keys of an object (and nested objects) to snake_case. Recursively processes nested
 * objects and arrays, transforming all keys from camelCase to snake_case format.
 *
 * @param obj - The object to convert.
 * @returns The object with converted keys, or undefined if input is falsy.
 */
export const convertKeysToSnakeCase = (
  obj: Record<string, any>
): Record<string, any> | undefined => {
  if (!obj) return undefined;
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [camelToSnake(key), convertKeysToSnakeCase(value)])
    );
  }
  return obj;
};

/**
 * Renames keys in an object based on a provided exceptions mapping. Mutates the original object by
 * replacing keys according to the exceptions map. If an old key exists in the object, it is renamed
 * to the new key and the old key is deleted.
 *
 * @param obj - The object to modify.
 * @param exceptions - Mapping of old keys to new keys.
 */
export const convertExceptions = (obj: Record<string, any>, exceptions: Record<string, any>) => {
  for (const [oldKey, newKey] of Object.entries(exceptions)) {
    if (oldKey in obj) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  }
};

/**
 * Specification for testing a service method. Defines all parameters needed to create a
 * comprehensive test suite for a service method, including expected request details, parameters,
 * and test configuration options.
 *
 * @property method - The service method to test.
 * @property callParams - Full set of parameters to call the method with.
 * @property minParams - Minimum required parameters for the method.
 * @property url - Expected URL path for the API request.
 * @property httpMethod - Expected HTTP method (GET, POST, PUT, DELETE, etc.).
 * @property headers - Expected request headers (Accept and Content-Type).
 * @property expectedBody - Expected request body parameters.
 * @property expectedQs - Expected query string parameters.
 * @property expectedPath - Expected path parameters.
 * @property noRequiredParams - Whether the method has no required parameters.
 * @property requiresOneOf - Whether the method requires one of multiple parameters.
 * @property skipBodyCheck - Whether to skip checking media headers.
 */
export interface MethodTestSpec {
  method: (params: any) => Promise<any>;
  callParams: Record<string, any>;
  minParams: Record<string, any>;
  url: string;
  httpMethod: string;
  headers?: { Accept?: string; 'Content-Type'?: string };
  expectedBody?: Record<string, any>;
  expectedQs?: Record<string, any>;
  expectedPath?: Record<string, any>;
  noRequiredParams?: boolean;
  requiresOneOf?: boolean;
  skipBodyCheck?: boolean;
}

/**
 * Creates a test suite for a service method with standard checks. Generates a comprehensive Jest
 * test suite that validates request parameters, headers, authentication, and handles both positive
 * and negative test cases. The suite includes tests for correct request params, user-given headers
 * priority, and negative tests for required and invalid parameters.
 *
 * @param name - The name of the test suite.
 * @param spec - The method test specification containing all test parameters.
 * @param service - The service instance being tested.
 * @param getRequestMock - Function that returns the request mock spy.
 * @param apiKey - The API key used for authentication.
 */
/**
 * Runs the main test check logic for a service method. Validates request parameters, headers,
 * authentication, and expected body/query string/path parameters.
 *
 * @param spec - The method test specification.
 * @param getRequestMock - Function that returns the request mock spy.
 * @param apiKey - The API key used for authentication.
 * @returns A function that performs the main test check.
 */
function runMainTestCheck(
  spec: MethodTestSpec,
  getRequestMock: () => jest.SpyInstance,
  apiKey: string
) {
  const {
    method,
    callParams,
    url,
    httpMethod,
    headers,
    expectedBody,
    expectedQs,
    expectedPath,
    skipBodyCheck = false,
  } = spec;

  const expectedAccept = headers?.Accept;
  const expectedContentType = headers?.['Content-Type'];

  return () => {
    const { signal } = new AbortController();
    const result = method({ ...callParams, signal });
    expectToBePromise(result);
    expect(getRequestMock()).toHaveBeenCalledTimes(1);

    const mockRequestOptions = getOptions(getRequestMock());
    checkUrlAndMethod(mockRequestOptions, url, httpMethod);

    if (!skipBodyCheck && (expectedAccept !== undefined || expectedContentType !== undefined)) {
      checkMediaHeaders(getRequestMock(), expectedAccept, expectedContentType);
    }

    checkAxiosOptions(getRequestMock(), signal);

    if (expectedBody) {
      Object.entries(expectedBody).forEach(([key, value]) => {
        expect(mockRequestOptions.body[key]).toEqual(value);
      });
    }

    if (expectedQs) {
      Object.entries(expectedQs).forEach(([key, value]) => {
        expect(mockRequestOptions.qs[key]).toEqual(value);
      });
    }

    if (expectedPath) {
      Object.entries(expectedPath).forEach(([key, value]) => {
        expect(mockRequestOptions.path[key]).toEqual(value);
      });
    }

    // Verify authentication headers
    const requestHeaders = getDefaultHeadersFromMock(getRequestMock());
    expect(requestHeaders).toHaveProperty('authorization', `Bearer ${apiKey}`);
  };
}

/**
 * Runs the header priority test to ensure user-given headers override defaults.
 *
 * @param spec - The method test specification.
 * @param getRequestMock - Function that returns the request mock spy.
 * @returns A function that performs the header priority test.
 */
function runHeaderPriorityTest(spec: MethodTestSpec, getRequestMock: () => jest.SpyInstance) {
  const { method, minParams, headers, skipBodyCheck = false } = spec;

  const expectedAccept = headers?.Accept;
  const expectedContentType = headers?.['Content-Type'];

  return () => {
    method({
      ...minParams,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    if (!skipBodyCheck && (expectedAccept !== undefined || expectedContentType !== undefined)) {
      checkMediaHeaders(getRequestMock(), 'application/json', 'application/json');
    }
  };
}

/**
 * Runs negative tests for a service method, including required and invalid parameter tests.
 *
 * @param spec - The method test specification.
 */
function runNegativeTests(spec: MethodTestSpec) {
  const { method, minParams, noRequiredParams = false, requiresOneOf = false } = spec;

  describe('negative tests', () => {
    if (!noRequiredParams) {
      testRequiredParams(method);
    }
    testInvalidParams(method, minParams);
    if (requiresOneOf) {
      // Test for requiresOneOf will be handled by the calling test file
      // as it requires specific logic for projectId/spaceId validation
    }
  });
}

export function describeMethod(
  name: string,
  spec: MethodTestSpec,
  service: BaseService,
  getRequestMock: () => jest.SpyInstance,
  apiKey: string
) {
  describe(name, () => {
    test('sends correct request params', () => {
      const runCheck = runMainTestCheck(spec, getRequestMock, apiKey);
      testWithRetries(runCheck, service, getRequestMock());
    });

    test('prioritizes user-given headers', () => {
      const checkHeaders = runHeaderPriorityTest(spec, getRequestMock);
      testWithRetries(checkHeaders, service, getRequestMock());
    });

    runNegativeTests(spec);
  });
}
