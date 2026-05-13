import { BatchInference } from '../../../src/batch_inference';
import { Gateway } from '../../../src/gateway';
import { checkRequest, createTestServiceConfig } from '../utils';
import type { MethodsInvalidParams, MethodsParams } from './types';

/**
 * Converts a camelCase string to snake_case. For example, "myVariableName" becomes
 * "my_variable_name".
 *
 * @param str - The input camelCase string.
 * @returns The converted snake_case string.
 */
const camelToSnake = (str: string) => str.replace(/(?<!^)([A-Z])/g, '_$1').toLowerCase();

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
 * Default HTTP headers for different request methods used in gateway API calls. These headers are
 * automatically applied based on the HTTP method unless overridden.
 */
const REQUEST_HEADERS = {
  'DELETE': {},
  'GET': { 'Accept': 'application/json' },
  'POST': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  'PUT': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
} as const;

/**
 * Creates a test function for gateway API methods. This helper validates that gateway methods make
 * correct HTTP requests with proper parameters, headers, and body content. It's designed to work
 * with Jest's `test.each` pattern for testing multiple methods efficiently.
 *
 * Similar to `describeMethod` but optimized for gateway-specific testing patterns including:
 *
 * - Automatic snake_case conversion for request bodies
 * - Support for custom header overrides
 * - Path, query string, and body parameter validation
 * - Signal/abort controller support
 *
 * @example
 *   ```typescript
 *   const methods: MethodsParams[] = [
 *     {
 *       name: 'Create model',
 *       req: { url: '/ml/gateway/v1/models', params: { modelId: '123' } },
 *       callableMethod: (params) => models.create(params),
 *       method: 'POST',
 *       expectedBody: { model_id: '123' }
 *     }
 *   ];
 *   test.each(methods)('$name', createGatewayTest(() => mockRequest, version));
 *   ```;
 *
 * @param getRequestMock - Function that returns the mocked request spy
 * @param versionParam - API version parameter to include in requests
 * @returns Test function compatible with Jest's test.each pattern
 */
export const createGatewayTest = (getRequestMock: () => jest.SpyInstance, versionParam: string) => {
  return async ({
    req,
    callableMethod,
    customHeaders: testHeaders,
    method,
    expectedPath,
    expectedBody,
    expectedQs,
  }: MethodsParams) => {
    const { params, url } = req;
    const { signal } = new AbortController();
    const response = callableMethod({
      signal,
      ...params,
      headers: testHeaders,
    });

    // Determine headers based on HTTP method, allow custom headers to override
    const defaultHeaders = REQUEST_HEADERS[method];
    const headers = testHeaders || defaultHeaders;

    checkRequest({
      request: {
        signal,
        headers,
        url,
        expectedBody: expectedBody || {},
        expectedPath: expectedPath || {},
        expectedQs: expectedQs || {},
      },
      requestMock: getRequestMock(),
      method,
      version: versionParam,
    });

    expect(response).toBeInstanceOf(Promise);
  };
};

interface GatewayContractSuiteConfig {
  describeName: string;
  getRequestMock: () => jest.SpyInstance;
  methods: MethodsParams[];
  version: string;
  mockResponseFactory?: () => Promise<any>;
  negativeMethods?: MethodsInvalidParams[];
  withCustomHeaders?: boolean;
}

const DEFAULT_CUSTOM_HEADERS = {
  Accept: 'fake/accept',
  'Content-Type': 'fake/contentType',
};

/**
 * Creates a flat list of gateway contract test cases and optionally duplicates each case with a
 * custom-header variant. This keeps the source test definitions focused on request behavior while
 * allowing the suite helper to expand them into concrete Jest samples.
 *
 * @param methods - Base gateway method definitions to execute.
 * @param withCustomHeaders - Whether to add a duplicate test case with overridden headers.
 * @returns Expanded test samples for [`test.each()`](test/unit/gateway/helpers.ts:194).
 */
const createGatewayMethodSamples = (
  methods: MethodsParams[],
  withCustomHeaders: boolean
): Array<MethodsParams & { testCase?: string }> =>
  withCustomHeaders
    ? methods.flatMap((method) => [
        { ...method, testCase: 'default headers' },
        {
          ...method,
          testCase: 'custom headers',
          customHeaders: DEFAULT_CUSTOM_HEADERS,
        },
      ])
    : methods;

/**
 * Defines a reusable gateway request-contract suite with shared mock lifecycle management,
 * [`test.each()`](test/unit/gateway/helpers.ts:194) execution, and optional negative-path coverage.
 * It is intended for endpoint groups that share the same contract-testing pattern across multiple
 * resources or inference variants.
 *
 * @param config - Suite configuration including test cases, mock access, and optional negative
 *   scenarios.
 */
export const describeGatewayContractSuite = ({
  describeName,
  getRequestMock,
  methods,
  version,
  mockResponseFactory = async () => ({}),
  negativeMethods = [],
  withCustomHeaders = false,
}: GatewayContractSuiteConfig) => {
  describe(describeName, () => {
    const requestMock = getRequestMock;

    beforeEach(() => {
      const mock = requestMock();

      if (!mock) {
        throw new Error(
          'Gateway request mock is not initialized. Call the setup method before using the suite helper.'
        );
      }

      mock.mockImplementation(() => mockResponseFactory());
    });

    afterEach(() => {
      const mock = requestMock();
      mock?.mockReset?.();
    });

    const samples = createGatewayMethodSamples(methods, withCustomHeaders);

    test.each(samples)(
      withCustomHeaders ? '$name - $testCase' : '$name',
      createGatewayTest(requestMock, version)
    );

    if (negativeMethods.length > 0) {
      test.each(negativeMethods)('$name without payload', async ({ callableMethod, params }) => {
        if (params) {
          await expect(callableMethod(params)).rejects.toThrow(/Parameter validation errors:/);
        } else {
          await expect(callableMethod()).rejects.toThrow(/Missing required parameters/);
          await expect(callableMethod({})).rejects.toThrow(/Missing required parameters/);
        }
      });
    }
  });
};

/**
 * Creates a parametrized test suite for verifying that gateway resource methods properly use
 * instance-level projectId and spaceId from the Gateway constructor.
 *
 * This helper generates tests that:
 *
 * - Create a Gateway instance with projectId or spaceId
 * - Call resource methods without passing container IDs in params
 * - Verify the appropriate X-IBM-PROJECT-ID or X-IBM-SPACE-ID header is set
 *
 * @example
 *   ```typescript
 *   describeInstanceLevelContainerIds({
 *     describeName: 'Models methods',
 *     getRequestMock: mockSetup.getMock,
 *     methods: [
 *       {
 *         name: 'create',
 *         method: (gateway) => gateway.models.create({ providerId: 'test', modelId: 'test' })
 *       }
 *     ]
 *   });
 *   ```;
 *
 * @param config - Configuration for the test suite
 */
export const describeInstanceLevelContainerIds = ({
  describeName,
  getRequestMock,
  methods,
}: {
  describeName: string;
  getRequestMock: () => jest.SpyInstance;
  methods: Array<{
    name: string;
    method: (gateway: any) => Promise<any>;
  }>;
}) => {
  describe(describeName, () => {
    const PROJECT_ID = 'instance-project-123';
    const SPACE_ID = 'instance-space-123';
    const getHeaders = () => getRequestMock().mock.calls[0][0].defaultOptions.headers;

    beforeEach(() => {
      getRequestMock().mockClear();
    });

    describe.each(methods)('with $name method', ({ name, method }) => {
      test(`${name} uses instance-level projectId`, async () => {
        const gateway = new Gateway({
          ...createTestServiceConfig(),
          projectId: PROJECT_ID,
        });

        await method(gateway);
        const headers = getHeaders();

        expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
      });

      test(`${name} uses instance-level spaceId`, async () => {
        const gateway = new Gateway({
          ...createTestServiceConfig(),
          spaceId: SPACE_ID,
        });

        await method(gateway);
        const headers = getHeaders();

        expect(headers['X-IBM-SPACE-ID']).toBe(SPACE_ID);
      });
    });
  });
};

/**
 * Shared test suite for Container ID header behavior across BatchInference and Files methods. Tests
 * that container ID headers (X-IBM-PROJECT-ID, X-IBM-SPACE-ID) are properly set and that custom
 * headers are preserved.
 *
 * @param getMock - Function that returns the request mock spy
 * @param apiKey - The API key used for authentication
 * @param apiMethods - Array of method specifications to test
 */
export function testContainerIdHeaders(
  getMock: () => any,
  apiKey: string,
  apiMethods: Array<{
    name: string;
    method: ({
      containerId,
      headers,
      svc,
    }: {
      containerId?: Record<string, string>;
      headers?: Record<string, string>;
      svc?: BatchInference;
    }) => Promise<any>;
  }>
) {
  const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
  const SPACE_ID = 'test-space-123';

  const getHeaders = () => getMock().mock.calls[0][0].defaultOptions.headers;

  beforeEach(() => {
    getMock().mockClear();
  });

  describe.each(apiMethods)('with $name method', ({ name, method }) => {
    test(`${name} sends X-IBM-PROJECT-ID header`, async () => {
      await method({ containerId: { projectId: PROJECT_ID } });
      const headers = getHeaders();

      expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
      expect(headers['authorization']).toBe(`Bearer ${apiKey}`);
    });

    test(`${name} sends X-IBM-SPACE-ID header`, async () => {
      await method({ containerId: { spaceId: SPACE_ID } });
      const headers = getHeaders();

      expect(headers['X-IBM-SPACE-ID']).toBe(SPACE_ID);
      expect(headers['authorization']).toBe(`Bearer ${apiKey}`);
    });

    test(`${name} uses instance-level projectId when not provided in params`, async () => {
      const INSTANCE_PROJECT_ID = 'instance-project-123';
      const instanceService = new BatchInference({
        ...createTestServiceConfig(),
        projectId: INSTANCE_PROJECT_ID,
      });

      await method({ svc: instanceService });
      const headers = getHeaders();

      expect(headers['X-IBM-PROJECT-ID']).toBe(INSTANCE_PROJECT_ID);
      expect(headers['authorization']).toBe(`Bearer ${apiKey}`);
    });

    test(`${name} preserves custom headers`, async () => {
      await method({
        containerId: {
          projectId: PROJECT_ID,
        },
        headers: {
          'X-Custom-Header': 'custom-value',
          'X-Request-ID': 'req-123',
        },
      });
      const headers = getHeaders();
      expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
      expect(headers['authorization']).toBe(`Bearer ${apiKey}`);
      expect(headers['X-Custom-Header']).toBe('custom-value');
      expect(headers['X-Request-ID']).toBe('req-123');
    });
  });
}
