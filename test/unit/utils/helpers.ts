import unitTestUtils from '@ibm-cloud/sdk-test-utilities';
import type { BaseService } from 'ibm-cloud-sdk-core';
import { checkRequest } from './checks';
import {
  getDefaultHeadersFromMock,
  testRequiredParams,
  testInvalidParams,
  testWithRetries,
  testWithRetriesStream,
} from '../../utils/utils';

const { checkMediaHeaders, expectToBePromise, checkForSuccessfulExecution, getOptions } =
  unitTestUtils;

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
  expectedPath?: Record<string, any>;
  expectedQs?: Record<string, any>;
  noRequiredParams?: boolean;
  requiresOneOf?: boolean;
  skipBodyCheck?: boolean;
  isStream?: boolean;
  testNoParams?: boolean;
  skipInvalidParamsTest?: boolean;
  instanceProjectId?: string;
  instanceSpaceId?: string;
}

export interface DescribeMethodOptions {
  version?: string;
  streamResult?: unknown;
  headerOverride?: { Accept: string; 'Content-Type': string };
  assertAuthHeader?: boolean;
  testRetryModes?: boolean;
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
  apiKey: string,
  version?: string,
  assertAuthHeader = true
) {
  const { method, callParams, url, httpMethod, headers, expectedBody, expectedPath, expectedQs } =
    spec;

  return () => {
    const { signal } = new AbortController();
    const result = method({ ...callParams, signal });
    const requestMock = getRequestMock();

    expectToBePromise(result);
    expect(requestMock).toHaveBeenCalledTimes(1);

    checkRequest({
      request: {
        url,
        expectedBody,
        expectedPath,
        expectedQs,
        signal,
        headers,
      },
      method: httpMethod,
      version,
      requestMock,
    });
    if (assertAuthHeader) {
      const requestHeaders = getDefaultHeadersFromMock(requestMock);
      expect(requestHeaders).toHaveProperty('authorization', `Bearer ${apiKey}`);
    }
  };
}

/**
 * Runs the header priority test to ensure user-given headers override defaults.
 *
 * @param spec - The method test specification.
 * @param getRequestMock - Function that returns the request mock spy.
 * @returns A function that performs the header priority test.
 */
function runHeaderPriorityTest(
  spec: MethodTestSpec,
  getRequestMock: () => jest.SpyInstance,
  headerOverride: { Accept: string; 'Content-Type': string }
) {
  const { method, minParams, headers, skipBodyCheck = false } = spec;

  const expectedAccept = headers?.Accept;
  const expectedContentType = headers?.['Content-Type'];

  return () => {
    method({
      ...minParams,
      headers: headerOverride,
    });
    const requestMock = getRequestMock();
    if (!skipBodyCheck && (expectedAccept !== undefined || expectedContentType !== undefined)) {
      checkMediaHeaders(requestMock, headerOverride.Accept, headerOverride['Content-Type']);
    }
  };
}

/**
 * Test helper to validate that exactly one of projectId or spaceId is required. This is a common
 * pattern in WatsonX AI APIs
 *
 * @param methodFn - The method to test
 * @param baseParams - Base parameters that include projectId or spaceId
 */
export function testRequiredOneOf(
  methodFn: (params?: any) => Promise<any>,
  baseParams: Record<string, any>
) {
  const { projectId: _projectId, spaceId: _spaceId, ...restParams } = baseParams;

  test('requires either projectId or spaceId', async () => {
    await expect(methodFn(restParams)).rejects.toThrow(
      /One of the following parameters is required: projectId,spaceId/
    );
  });

  test('rejects when both projectId and spaceId are provided', async () => {
    await expect(
      methodFn({ ...restParams, projectId: 'test-project-id', spaceId: 'test-space-id' })
    ).rejects.toThrow(/Only one of the following parameters is allowed: projectId,spaceId/);
  });
}

/**
 * Runs negative tests for a service method, including required and invalid parameter tests.
 *
 * @param spec - The method test specification.
 */
function runNegativeTests(spec: MethodTestSpec) {
  const {
    method,
    minParams,
    noRequiredParams = false,
    requiresOneOf = false,
    skipInvalidParamsTest = false,
  } = spec;

  describe('negative tests', () => {
    if (!noRequiredParams) {
      // If method requires one of projectId/spaceId, pass projectId as base param
      // so we can test other required parameters
      const baseParams =
        requiresOneOf && minParams?.projectId ? { projectId: minParams.projectId } : undefined;
      testRequiredParams(
        method,
        /Missing required parameters/,
        /Missing required parameters/,
        baseParams
      );
    }
    if (!skipInvalidParamsTest) {
      testInvalidParams(method, minParams);
    }
    if (requiresOneOf) {
      testRequiredOneOf(method, minParams);
    }
  });
}

export function describeMethod(
  name: string,
  spec: MethodTestSpec,
  service: BaseService,
  getRequestMock: () => jest.SpyInstance,
  apiKey: string,
  options: DescribeMethodOptions = {}
) {
  const {
    version,
    streamResult,
    headerOverride = { Accept: 'application/json', 'Content-Type': 'application/json' },
    assertAuthHeader = true,
    testRetryModes = false,
  } = options;

  describe(name, () => {
    const runCheck = runMainTestCheck(spec, getRequestMock, apiKey, version, assertAuthHeader);
    const checkHeaders = runHeaderPriorityTest(spec, getRequestMock, headerOverride);

    test('sends correct request params', () => {
      if (testRetryModes) {
        if (spec.isStream) {
          testWithRetriesStream(runCheck, service, getRequestMock(), streamResult);
        } else {
          testWithRetries(runCheck, service, getRequestMock());
        }
      } else {
        runCheck();
      }
    });

    test('prioritizes user-given headers', () => {
      if (testRetryModes) {
        if (spec.isStream) {
          testWithRetriesStream(checkHeaders, service, getRequestMock(), streamResult);
        } else {
          testWithRetries(checkHeaders, service, getRequestMock());
        }
      } else {
        checkHeaders();
      }
    });

    if (spec.testNoParams) {
      test('succeeds with no parameters', () => {
        spec.method({});
        checkForSuccessfulExecution(getRequestMock());
      });
    }

    // Test instance-level fallback for projectId/spaceId
    if (spec.instanceProjectId || spec.instanceSpaceId) {
      const { method, minParams, expectedBody } = spec;
      if (spec.instanceProjectId) {
        test('uses instance projectId when not in params', () => {
          if (spec.isStream && streamResult) {
            getRequestMock().mockImplementation(() => Promise.resolve({ result: streamResult }));
          }
          method(minParams);
          const mockRequestOptions = getOptions(getRequestMock());
          const location =
            expectedBody && expectedBody.project_id
              ? mockRequestOptions.body
              : mockRequestOptions.qs;
          expect(location?.project_id).toBe(spec.instanceProjectId);
          expect(location?.space_id).toBeUndefined();
        });
      }

      if (spec.instanceSpaceId) {
        test('uses instance spaceId when not in params', () => {
          if (spec.isStream && streamResult) {
            getRequestMock().mockImplementation(() => Promise.resolve({ result: streamResult }));
          }
          method(minParams);
          const mockRequestOptions = getOptions(getRequestMock());
          const location =
            expectedBody && expectedBody.space_id ? mockRequestOptions.body : mockRequestOptions.qs;
          expect(location?.space_id).toBe(spec.instanceSpaceId);
          expect(location?.project_id).toBeUndefined();
        });
      }
    }

    runNegativeTests(spec);
  });
}
