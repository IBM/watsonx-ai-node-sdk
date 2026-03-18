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

import unitTestUtils from '@ibm-cloud/sdk-test-utilities';
import { NoAuthAuthenticator, BaseService } from 'ibm-cloud-sdk-core';
import fs from 'fs';
import { StreamTransform } from '../../src/lib/common';
import * as getAuthenticatorFromEnvironment from '../../src/authentication/utils/get-authenticator-from-environment';
import { WatsonXAI } from '../../src';
import { checkAxiosOptions, checkRequest } from './utils/checks';

const {
  getOptions,
  checkUrlAndMethod,
  checkMediaHeaders,
  expectToBePromise,
  checkForSuccessfulExecution,
} = unitTestUtils;

// ─── Service Setup ────────────────────────────────────────────────────────────

const SERVICE_URL = 'https://us-south.ml.cloud.ibm.com';
const VERSION = '2023-07-07';

const serviceOptions = {
  authenticator: new NoAuthAuthenticator(),
  url: SERVICE_URL,
  version: VERSION,
};

const stream = new StreamTransform();
const service = new WatsonXAI(serviceOptions);

// ─── Mock Setup ───────────────────────────────────────────────────────────────

let createRequestMock: jest.SpyInstance;

function getMock(): jest.SpyInstance {
  return createRequestMock;
}

const getAuthenticatorMock = jest.spyOn(
  getAuthenticatorFromEnvironment,
  'getAuthenticatorFromEnvironment'
);
getAuthenticatorMock.mockImplementation(() => new NoAuthAuthenticator());

// ─── Shared Test Fixtures ─────────────────────────────────────────────────────

const SPACE_ID = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
const DEPLOYMENT_ID = 'test-deployment-id';
const MODEL_ID = 'ibm/granite-13b-chat-v2';
const PROMPT_ID = 'test-prompt-id';
const SESSION_ID = 'test-session-id';
const ENTRY_ID = 'test-entry-id';
const RESOURCE_ID = 'test-resource-id';
const TOOL_ID = 'test-tool-id';

const jsonPatchOperation = { op: 'add' as const, path: '/name', value: 'new-name' };
const wxUtilityAgentToolsRunRequest = { tool_name: 'weather', input: { location: 'London' } };
const chatMessage = { role: 'user' as const, content: 'Hello' };
const onlineDeployment = { parameters: { serving_name: 'churn' } };
const hardwareSpec = { id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab', num_nodes: 2 };
const cosDataConnection = { id: '6f5688fd-f3bf-42c2-a18b-49c0d8a1920d' };
const cosDataLocation = { file_name: 'files/document.pdf', bucket: 'my-bucket' };
const textExtractionDataReference = {
  type: 'connection_asset',
  connection: cosDataConnection,
  location: cosDataLocation,
};
const promptObj = { input: [['What is AI?', 'AI is...']] };
const chatItem = {
  type: 'question' as const,
  content: [{ type: 'text' as const, text: 'Hi' }],
  status: 'ready' as const,
};
const cryptoConfig = { key_ref: 'test-key-ref' };

// ─── Shared undefined chat fields ─────────────────────────────────────────────

/**
 * Optional chat body fields that the SDK always serialises (even when undefined). Shared by both
 * deployment-chat and text-chat method specs.
 */
const sharedChatUndefinedFields = {
  tools: undefined,
  tool_choice_option: undefined,
  tool_choice: undefined,
  frequency_penalty: undefined,
  logit_bias: undefined,
  logprobs: undefined,
  top_logprobs: undefined,
  max_completion_tokens: undefined,
  n: undefined,
  presence_penalty: undefined,
  response_format: undefined,
  seed: undefined,
  stop: undefined,
  top_p: undefined,
  repetition_penalty: undefined,
  length_penalty: undefined,
  include_reasoning: undefined,
  reasoning_effort: undefined,
  time_limit: undefined,
};

// ─── Shared inline fixtures ────────────────────────────────────────────────────

const trainingResultsRef = { type: 'container', location: { path: 'results' } };
const textChatUndefinedFields = {
  ...sharedChatUndefinedFields,
  max_tokens: undefined,
  guided_choice: undefined,
  guided_regex: undefined,
  guided_grammar: undefined,
  guided_json: undefined,
};
const fineTuningResultsRef = { type: 'container', location: { path: 'ft-results' } };
const fineTuningDataRef = [{ type: 'container', location: { path: 'train-data' } }];
const docRef = [{ type: 'connection_asset', location: { path: 'doc.pdf' } }];
const docResultsRef = { type: 'container', location: { path: 'doc-results' } };
const spaceStorage = {
  resource_crn: 'crn:v1:bluemix:public:cloud-object-storage:global:a/abc:def::',
};
const classificationDocRef = { type: 'connection_asset', location: { path: 'doc.pdf' } };
const classificationParams = { labels: ['positive', 'negative'] };
const AUDIO_FILE_PATH = 'test/data/sample_audio_file.mp3';

// ─── Chat param factories ──────────────────────────────────────────────────────

/**
 * Builds the expected params object for a deployment text-chat method call. Spreads
 * sharedChatUndefinedFields so that any new optional fields added there are automatically reflected
 * in both the non-stream and stream variants.
 */
function deploymentChatExpectedParams(
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    id_or_name: DEPLOYMENT_ID,
    messages: [chatMessage],
    ...sharedChatUndefinedFields,
    ...extra,
  };
}

/**
 * Builds the expected params object for a text-chat method call. Spreads textChatUndefinedFields
 * (which extends sharedChatUndefinedFields) so that both the non-stream and stream variants stay in
 * sync automatically.
 */
function textChatExpectedParams(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    model_id: MODEL_ID,
    messages: [chatMessage],
    space_id: SPACE_ID,
    project_id: PROJECT_ID,
    ...textChatUndefinedFields,
    ...extra,
  };
}

// ─── Sentinel values for header-override tests ────────────────────────────────

const FAKE_ACCEPT = 'fake/accept';
const FAKE_CONTENT_TYPE = 'fake/contentType';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

/** Runs a test function three times: baseline, retries enabled, retries disabled. */
function testWithRetries(testFn: () => void) {
  testFn();
  createRequestMock?.mockClear();
  service.enableRetries();
  testFn();
  createRequestMock?.mockClear();
  service.disableRetries();
  testFn();
}

/** Runs a stream method test three times, setting up the stream mock each time. */
function testWithRetriesStream(testFn: () => void) {
  const setupStreamMock = () =>
    createRequestMock?.mockImplementation(() => Promise.resolve({ result: stream }));

  const variants: Array<() => void> = [
    () => {},
    () => service.enableRetries(),
    () => service.disableRetries(),
  ];

  for (const configure of variants) {
    setupStreamMock();
    configure();
    testFn();
    createRequestMock?.mockClear();
  }
}

/** Adds negative tests asserting that a method rejects when required params are missing. */
function testRequiredParams(methodFn: (params?: any) => Promise<any>) {
  test('enforces required parameters – empty object', async () => {
    await expect(methodFn({})).rejects.toThrow(/Missing required parameters/);
  });
  test('enforces required parameters – undefined', async () => {
    await expect(methodFn()).rejects.toThrow(/Missing required parameters/);
  });
}

function testInvalidParams(methodFn: (params?: any) => Promise<any>) {
  test('fails with invalid params passed', () => {
    expect(methodFn({ invalidParams: 'invalidParam' })).rejects.toThrow(
      /Found invalid parameters: invalidParams/
    );
  });
}

// ─── Additional Test Helpers ──────────────────────────────────────────────────

interface RawBodyRequestExpectations {
  url: string;
  httpMethod: string;
  acceptHeader: string | undefined;
  /** Content-Type header expected on the request. Omit for GET/DELETE methods that send no body. */
  contentTypeHeader?: string;
  signal: AbortSignal;
  body: unknown;
  expectedQs: Record<string, unknown>;
  expectedPath?: Record<string, unknown>;
}

/** Validates all request options for a raw-body method call. */
function validateRawBodyRequest(
  mockRequestOptions: ReturnType<typeof getOptions>,
  expected: RawBodyRequestExpectations
): void {
  checkUrlAndMethod(mockRequestOptions, expected.url, expected.httpMethod);
  // Only assert Content-Type when the spec declares one; GET/DELETE methods legitimately omit it.
  checkMediaHeaders(getMock(), expected.acceptHeader, expected.contentTypeHeader);
  checkAxiosOptions(getMock(), expected.signal);
  expect(mockRequestOptions.body).toEqual(expected.body);
  Object.entries(expected.expectedQs).forEach(([k, v]) =>
    expect(mockRequestOptions.qs[k]).toEqual(v)
  );
  if (expected.expectedPath) {
    Object.entries(expected.expectedPath).forEach(([k, v]) =>
      expect(mockRequestOptions.path[k]).toEqual(v)
    );
  }
}

interface RawBodyMethodOpts<P extends Record<string, unknown>> {
  /**
   * The service method under test. Typed as `(params: any)` so that concrete SDK method wrappers
   * (e.g. `(p) => service.updateDeployment(p)`) are assignable here regardless of their strict
   * param types, while `params` and `minParams` still enforce the shape of the test fixtures via
   * `P`.
   */
  method: (params: any) => Promise<unknown>;
  params: P;
  minParams: Partial<P>;
  url: string;
  httpMethod: string;
  acceptHeader: string | undefined;
  contentTypeHeader: string;
  bodyKey: keyof P;
  expectedQs: Record<string, unknown>;
  expectedPath?: Record<string, unknown>;
}

/**
 * Generates a describe block for methods that use a raw array body (e.g. JSON Patch). These cannot
 * use checkRequest because the body is not merged into qs/path/body object.
 */
function describeRawBodyMethod<P extends Record<string, unknown>>(
  name: string,
  opts: RawBodyMethodOpts<P>
) {
  const {
    method,
    params,
    minParams,
    url,
    httpMethod,
    acceptHeader,
    contentTypeHeader,
    bodyKey,
    expectedQs,
    expectedPath,
  } = opts;

  const runCheck = () => {
    const { signal } = new AbortController();
    const result = method({ ...params, signal });
    expectToBePromise(result);
    expect(createRequestMock).toHaveBeenCalledTimes(1);
    const mockRequestOptions = getOptions(getMock());
    validateRawBodyRequest(mockRequestOptions, {
      url,
      httpMethod,
      acceptHeader,
      contentTypeHeader,
      signal,
      body: params[bodyKey],
      expectedQs,
      expectedPath,
    });
  };

  describe(name, () => {
    test('sends correct request params', () => {
      testWithRetries(runCheck);
    });

    test('prioritizes user-given headers', () => {
      method({
        ...minParams,
        headers: { Accept: FAKE_ACCEPT, 'Content-Type': FAKE_CONTENT_TYPE },
      });
      checkMediaHeaders(getMock(), FAKE_ACCEPT, FAKE_CONTENT_TYPE);
    });
    describe('negative tests', () => {
      testRequiredParams(method);
      testInvalidParams(method);
    });
  });
}

// ─── Method Test Descriptor ───────────────────────────────────────────────────

interface MethodTestSpec {
  /** The service method to call, bound to `service`. */
  method: (params: any) => Promise<any>;
  /** Full params object (camelCase) passed to the method. */
  callParams: Record<string, any>;
  /** Minimal required params for the user-headers override test. */
  minParams: Record<string, any>;
  /** Expected URL template. */
  url: string;
  /** HTTP method. */
  httpMethod: string;
  /**
   * Expected request headers. Provide the headers that the method is expected to send. GET/DELETE
   * methods typically only set Accept; POST/PUT/PATCH methods also set Content-Type. Both fields
   * are optional at the type level because not every method sends both, but describeMethod will
   * assert whichever values are present.
   */
  headers: { Accept?: string; 'Content-Type'?: string };
  /**
   * Expected flattened params (snake_case) compared via checkRequest (includes version). Mutually
   * exclusive with expectedQs / expectedPath / expectedBody.
   */
  expectedParams?: Record<string, any>;
  /**
   * When provided, assertions are made directly against qs/path/body without appending version. Use
   * for methods whose URL does not include the `version` query parameter.
   */
  expectedQs?: Record<string, any>;
  /** Expected path params (snake_case). Used together with expectedQs. */
  expectedPath?: Record<string, any>;
  /** Expected body fields. Used together with expectedQs. */
  expectedBody?: Record<string, any>;
  /** Whether this is a streaming method (uses testWithRetriesStream). */
  isStream?: boolean;
  /** Whether the method has no required params (skip testRequiredParams). */
  noRequiredParams?: boolean;
  /** Whether to add a "succeeds with no parameters" test. */
  testNoParams?: boolean;
}

/**
 * Generates a full describe block for a service method:
 *
 * - "sends correct request params" (with retries)
 * - "prioritizes user-given headers"
 * - Negative required-param tests (unless noRequiredParams)
 * - "succeeds with no parameters" (if testNoParams)
 *
 * When `expectedQs` is provided the check is done via direct assertions (no version appended). When
 * `expectedParams` is provided the check is done via checkRequest (version appended).
 */
function describeMethod(name: string, spec: MethodTestSpec) {
  const {
    method,
    callParams,
    minParams,
    url,
    httpMethod,
    headers,
    expectedParams,
    expectedQs,
    expectedPath,
    expectedBody,
    isStream = false,
    noRequiredParams = false,
    testNoParams = false,
  } = spec;

  // Enforce mutual exclusion: callers must use either expectedParams (standard SDK path, version
  // appended by checkRequest) or expectedQs (raw-body/prompt-style path, no version appended).
  // Supplying both would silently ignore expectedParams and produce a false-positive test.
  if (expectedParams !== undefined && expectedQs !== undefined) {
    throw new Error(
      `describeMethod('${name}'): expectedParams and expectedQs are mutually exclusive. ` +
        'Use expectedParams for standard SDK methods or expectedQs for raw-body/prompt-style methods.'
    );
  }

  const { Accept: expectedAccept, 'Content-Type': expectedContentType } = headers;

  describe(name, () => {
    // Dispatch helper: wraps fn with the appropriate retry harness depending on whether the method
    // under test is a streaming method. Non-stream methods are run through testWithRetries (baseline
    // + retries-enabled + retries-disabled). Stream methods use testWithRetriesStream which also
    // re-installs the stream mock before each variant.
    const runWithRetries = (fn: () => void) =>
      isStream ? testWithRetriesStream(fn) : testWithRetries(fn);

    // A single AbortController is created per test invocation so that each retry variant receives
    // a fresh, non-aborted signal. The signal is captured in the closure and asserted against the
    // value forwarded by the SDK, verifying that the SDK does not substitute its own signal.
    const runCheck = () => {
      const { signal } = new AbortController();
      const result = method({ ...callParams, signal });
      if (!isStream) expectToBePromise(result);
      else expect(result).toBeInstanceOf(Promise);
      expect(createRequestMock).toHaveBeenCalledTimes(1);

      if (expectedQs !== undefined) {
        // Raw-body / prompt-style path: these endpoints do NOT include the SDK 'version' query
        // parameter, so we assert qs/path/body directly instead of delegating to checkRequest
        // (which always appends version to the expected params).
        // When the spec declares a body (expectedBody is set), Content-Type must also be provided
        // so the assertion is meaningful. GET/DELETE methods that use expectedQs for path routing
        // but send no body legitimately omit Content-Type.
        if (expectedBody !== undefined && expectedContentType === undefined) {
          throw new Error(
            `describeMethod('${name}'): headers must include 'Content-Type' when expectedBody is provided.`
          );
        }
        const mockRequestOptions = getOptions(getMock());
        validateRawBodyRequest(mockRequestOptions, {
          url,
          httpMethod,
          acceptHeader: expectedAccept,
          contentTypeHeader: expectedContentType,
          signal,
          body: expectedBody,
          expectedQs,
          expectedPath,
        });
      } else {
        // Standard SDK path: checkRequest merges qs/path/body and appends version before comparing.
        checkRequest({
          request: { url, params: expectedParams, signal, headers },
          method: httpMethod,
          version: VERSION,
          requestMock: getMock(),
        });
      }
    };

    test('sends correct request params', () => {
      runWithRetries(runCheck);
    });

    test('prioritizes user-given headers', () => {
      const checkHeaders = () => {
        method({
          ...minParams,
          headers: { Accept: FAKE_ACCEPT, 'Content-Type': FAKE_CONTENT_TYPE },
        });
        checkMediaHeaders(getMock(), FAKE_ACCEPT, FAKE_CONTENT_TYPE);
      };
      runWithRetries(checkHeaders);
    });

    if (testNoParams) {
      test('succeeds with no parameters', () => {
        method({});
        checkForSuccessfulExecution(getMock());
      });
    }
    describe('negative tests', () => {
      if (!noRequiredParams) {
        testRequiredParams(method);
      }
      testInvalidParams(method);
    });
  });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('WatsonXAI', () => {
  beforeAll(() => {
    createRequestMock = jest.spyOn(BaseService.prototype, 'createRequest' as keyof BaseService);
  });

  beforeEach(() => {
    createRequestMock.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    createRequestMock.mockReset();
    getAuthenticatorMock.mockClear();
  });

  // ─── Service Construction ──────────────────────────────────────────────────

  describe('newInstance', () => {
    test('uses defaults when options not provided', () => {
      const instance = WatsonXAI.newInstance({ version: VERSION });
      expect(getAuthenticatorMock).toHaveBeenCalled();
      expect(instance['baseOptions'].authenticator).toBeInstanceOf(NoAuthAuthenticator);
      expect(instance['baseOptions'].serviceName).toBe(WatsonXAI.DEFAULT_SERVICE_NAME);
      expect(instance['baseOptions'].serviceUrl).toBe(WatsonXAI.DEFAULT_SERVICE_URL);
      expect(instance).toBeInstanceOf(WatsonXAI);
    });

    test('sets serviceName, serviceUrl, and authenticator when provided', () => {
      const instance = WatsonXAI.newInstance({
        version: VERSION,
        authenticator: new NoAuthAuthenticator(),
        serviceUrl: 'custom.com',
        serviceName: 'my-service',
      });
      expect(getAuthenticatorMock).not.toHaveBeenCalled();
      expect(instance['baseOptions'].serviceUrl).toBe('custom.com');
      expect(instance['baseOptions'].serviceName).toBe('my-service');
      expect(instance).toBeInstanceOf(WatsonXAI);
    });
  });

  describe('constructor', () => {
    test('uses user-given service url', () => {
      const opts = { ...serviceOptions, serviceUrl: 'custom.com' };
      expect(new WatsonXAI(opts)['baseOptions'].serviceUrl).toBe('custom.com');
    });

    test('uses default service url', () => {
      const opts = { authenticator: new NoAuthAuthenticator(), version: VERSION };
      expect(new WatsonXAI(opts)['baseOptions'].serviceUrl).toBe(WatsonXAI.DEFAULT_SERVICE_URL);
    });
  });

  describe('constructServiceUrl', () => {
    test('uses all default variable values if null is passed', () => {
      expect(WatsonXAI.constructServiceUrl(null)).toStrictEqual(
        'https://us-south.ml.cloud.ibm.com'
      );
    });

    test('fails if an invalid variable name is provided', () => {
      expect(() =>
        WatsonXAI.constructServiceUrl(new Map([['invalid_variable_name', 'value']]))
      ).toThrow();
    });
  });

  describe('service-level tests', () => {
    test('construct service with global params', () => {
      const serviceObj = new WatsonXAI(serviceOptions);
      expect(serviceObj).not.toBeNull();
      expect(serviceObj.version).toEqual(serviceOptions.version);
    });
  });

  // ─── Deployments ──────────────────────────────────────────────────────────

  describeMethod('createDeployment', {
    method: (p) => service.createDeployment(p),
    callParams: {
      name: 'text_classification',
      online: onlineDeployment,
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      description: 'A test deployment',
      tags: ['tag1'],
      custom: { key: 'value' },
      promptTemplate: { id: PROMPT_ID },
      hardwareSpec,
      asset: { id: RESOURCE_ID, rev: '1' },
      baseModelId: MODEL_ID,
    },
    minParams: { name: 'text_classification', online: onlineDeployment },
    url: '/ml/v4/deployments',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'text_classification',
      online: onlineDeployment,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      description: 'A test deployment',
      tags: ['tag1'],
      custom: { key: 'value' },
      prompt_template: { id: PROMPT_ID },
      hardware_spec: hardwareSpec,
      asset: { id: RESOURCE_ID, rev: '1' },
      base_model_id: MODEL_ID,
    },
  });

  describeMethod('listDeployments', {
    method: (p) => service.listDeployments(p),
    callParams: {
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      servingName: 'classification',
      tagValue: 'my-tag',
      assetId: RESOURCE_ID,
      promptTemplateId: PROMPT_ID,
      name: 'my-deployment',
      type: 'foundation_model',
      state: 'ready',
      conflict: false,
    },
    minParams: {},
    url: '/ml/v4/deployments',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: {
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      serving_name: 'classification',
      'tag.value': 'my-tag',
      asset_id: RESOURCE_ID,
      prompt_template_id: PROMPT_ID,
      name: 'my-deployment',
      type: 'foundation_model',
      state: 'ready',
      conflict: false,
    },
    noRequiredParams: true,
    testNoParams: true,
  });

  describeMethod('getDeployment', {
    method: (p) => service.getDeployment(p),
    callParams: { deploymentId: DEPLOYMENT_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { deploymentId: DEPLOYMENT_ID },
    url: '/ml/v4/deployments/{deployment_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: {
      deployment_id: DEPLOYMENT_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
    },
  });

  describeRawBodyMethod('updateDeployment', {
    method: (p) => service.updateDeployment(p),
    params: {
      deploymentId: DEPLOYMENT_ID,
      jsonPatch: [jsonPatchOperation],
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
    },
    minParams: { deploymentId: DEPLOYMENT_ID, jsonPatch: [jsonPatchOperation] },
    url: '/ml/v4/deployments/{deployment_id}',
    httpMethod: 'PATCH',
    acceptHeader: 'application/json',
    contentTypeHeader: 'application/json-patch+json',
    bodyKey: 'jsonPatch',
    expectedQs: { version: VERSION, space_id: SPACE_ID, project_id: PROJECT_ID },
    expectedPath: { deployment_id: DEPLOYMENT_ID },
  });

  describeMethod('deleteDeployment', {
    method: (p) => service.deleteDeployment(p),
    callParams: { deploymentId: DEPLOYMENT_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { deploymentId: DEPLOYMENT_ID },
    url: '/ml/v4/deployments/{deployment_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      deployment_id: DEPLOYMENT_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
    },
  });

  describeMethod('deploymentGenerateText', {
    method: (p) => service.deploymentGenerateText(p),
    callParams: {
      idOrName: DEPLOYMENT_ID,
      input: 'What is AI?',
      parameters: { max_new_tokens: 100 },
      moderations: {},
    },
    minParams: { idOrName: DEPLOYMENT_ID },
    url: '/ml/v1/deployments/{id_or_name}/text/generation',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      id_or_name: DEPLOYMENT_ID,
      input: 'What is AI?',
      parameters: { max_new_tokens: 100 },
      moderations: {},
    },
  });

  describeMethod('deploymentGenerateTextStream', {
    method: (p) => service.deploymentGenerateTextStream(p),
    callParams: {
      idOrName: DEPLOYMENT_ID,
      input: 'What is AI?',
      parameters: { max_new_tokens: 100 },
      moderations: {},
    },
    minParams: { idOrName: DEPLOYMENT_ID },
    url: '/ml/v1/deployments/{id_or_name}/text/generation_stream',
    httpMethod: 'POST',
    headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
    expectedParams: {
      id_or_name: DEPLOYMENT_ID,
      input: 'What is AI?',
      parameters: { max_new_tokens: 100 },
      moderations: {},
    },
    isStream: true,
  });

  describeMethod('deploymentsTextChat', {
    method: (p) => service.deploymentsTextChat(p),
    callParams: {
      idOrName: DEPLOYMENT_ID,
      messages: [chatMessage],
      temperature: 0.7,
      maxTokens: 200,
    },
    minParams: { idOrName: DEPLOYMENT_ID, messages: [chatMessage] },
    url: '/ml/v1/deployments/{id_or_name}/text/chat',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: deploymentChatExpectedParams({ temperature: 0.7, max_tokens: 200 }),
  });

  describeMethod('deploymentsTextChatStream', {
    method: (p) => service.deploymentsTextChatStream(p),
    callParams: {
      idOrName: DEPLOYMENT_ID,
      messages: [chatMessage],
      temperature: 0.7,
      maxTokens: 200,
    },
    minParams: { idOrName: DEPLOYMENT_ID, messages: [chatMessage] },
    url: '/ml/v1/deployments/{id_or_name}/text/chat_stream',
    httpMethod: 'POST',
    headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
    expectedParams: deploymentChatExpectedParams({ temperature: 0.7, max_tokens: 200 }),
    isStream: true,
  });

  describeMethod('deploymentsTimeSeriesForecast', {
    method: (p) => service.deploymentsTimeSeriesForecast(p),
    callParams: {
      idOrName: DEPLOYMENT_ID,
      data: { timestamp: ['2024-01-01', '2024-01-02'], value: [1.0, 2.0] },
      schema: { timestamp_column: 'timestamp', target_columns: ['value'] },
      parameters: { prediction_length: 10 },
      futureData: { timestamp: ['2024-01-03'], exog: [3.0] },
    },
    minParams: {
      idOrName: DEPLOYMENT_ID,
      data: { timestamp: ['2024-01-01'], value: [1.0] },
      schema: { timestamp_column: 'timestamp', target_columns: ['value'] },
    },
    url: '/ml/v1/deployments/{id_or_name}/time_series/forecast',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      id_or_name: DEPLOYMENT_ID,
      data: { timestamp: ['2024-01-01', '2024-01-02'], value: [1.0, 2.0] },
      schema: { timestamp_column: 'timestamp', target_columns: ['value'] },
      parameters: { prediction_length: 10 },
      future_data: { timestamp: ['2024-01-03'], exog: [3.0] },
    },
  });

  // ─── Foundation Models ─────────────────────────────────────────────────────

  describeMethod('listFoundationModelSpecs', {
    method: (p) => service.listFoundationModelSpecs(p),
    callParams: { start: 'token', limit: 50, filters: 'task_summarization', techPreview: true },
    minParams: {},
    url: '/ml/v1/foundation_model_specs',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: {
      start: 'token',
      limit: 50,
      filters: 'task_summarization',
      tech_preview: true,
    },
    noRequiredParams: true,
    testNoParams: true,
  });

  describeMethod('listFoundationModelTasks', {
    method: (p) => service.listFoundationModelTasks(p),
    callParams: { start: 'token', limit: 20 },
    minParams: {},
    url: '/ml/v1/foundation_model_tasks',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { start: 'token', limit: 20 },
    noRequiredParams: true,
    testNoParams: true,
  });

  // ─── Prompts ───────────────────────────────────────────────────────────────
  // Prompt methods use wxServiceUrl and do NOT include `version` in qs.

  describeMethod('createPrompt', {
    method: (p) => service.createPrompt(p),
    callParams: {
      name: 'My Prompt',
      prompt: promptObj,
      description: 'A test prompt',
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: { name: 'My Prompt', prompt: promptObj },
    url: '/v1/prompts',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedBody: { name: 'My Prompt', prompt: promptObj, description: 'A test prompt' },
  });

  describeMethod('getPrompt', {
    method: (p) => service.getPrompt(p),
    callParams: { promptId: PROMPT_ID, projectId: PROJECT_ID, spaceId: SPACE_ID },
    minParams: { promptId: PROMPT_ID },
    url: '/v1/prompts/{prompt_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
  });

  // listPrompts uses serviceUrl (not wxServiceUrl) and has hardcoded body query
  describeMethod('listPrompts', {
    method: (p) => service.listPrompts(p),
    callParams: { projectId: PROJECT_ID, spaceId: SPACE_ID, limit: '50' },
    minParams: {},
    url: '/v2/asset_types/wx_prompt/search',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedBody: { query: 'asset.asset_type:wx_prompt', limit: '50' },
    noRequiredParams: true,
    testNoParams: true,
  });

  describeMethod('updatePrompt', {
    method: (p) => service.updatePrompt(p),
    callParams: {
      promptId: PROMPT_ID,
      name: 'Updated Prompt',
      prompt: promptObj,
      description: 'Updated',
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: { promptId: PROMPT_ID, name: 'Updated Prompt', prompt: promptObj },
    url: '/v1/prompts/{prompt_id}',
    httpMethod: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
    expectedBody: { name: 'Updated Prompt', prompt: promptObj, description: 'Updated' },
  });

  describeMethod('deletePrompt', {
    method: (p) => service.deletePrompt(p),
    callParams: { promptId: PROMPT_ID, projectId: PROJECT_ID, spaceId: SPACE_ID },
    minParams: { promptId: PROMPT_ID },
    url: '/v1/prompts/{prompt_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
  });

  describeMethod('updatePromptLock', {
    method: (p) => service.updatePromptLock(p),
    callParams: {
      promptId: PROMPT_ID,
      locked: true,
      lockType: 'edit',
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
      force: false,
    },
    minParams: { promptId: PROMPT_ID, locked: true },
    url: '/v1/prompts/{prompt_id}/lock',
    httpMethod: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID, force: false },
    expectedPath: { prompt_id: PROMPT_ID },
    expectedBody: { locked: true, lock_type: 'edit' },
  });

  describeMethod('getPromptLock', {
    method: (p) => service.getPromptLock(p),
    callParams: { promptId: PROMPT_ID, projectId: PROJECT_ID, spaceId: SPACE_ID },
    minParams: { promptId: PROMPT_ID },
    url: '/v1/prompts/{prompt_id}/lock',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
  });

  describeMethod('getPromptInput', {
    method: (p) => service.getPromptInput(p),
    callParams: {
      promptId: PROMPT_ID,
      input: 'What is AI?',
      promptVariables: { topic: 'AI' },
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: { promptId: PROMPT_ID },
    url: '/v1/prompts/{prompt_id}/input',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
    expectedBody: { input: 'What is AI?', prompt_variables: { topic: 'AI' } },
  });

  // createPromptChatItem sends a raw array body
  describeRawBodyMethod('createPromptChatItem', {
    method: (p) => service.createPromptChatItem(p),
    params: { promptId: PROMPT_ID, chatItem: [chatItem], projectId: PROJECT_ID, spaceId: SPACE_ID },
    minParams: { promptId: PROMPT_ID, chatItem: [chatItem] },
    url: '/v1/prompts/{prompt_id}/chat_items',
    httpMethod: 'POST',
    acceptHeader: undefined,
    contentTypeHeader: 'application/json',
    bodyKey: 'chatItem',
    expectedQs: { project_id: PROJECT_ID, space_id: SPACE_ID },
    expectedPath: { prompt_id: PROMPT_ID },
  });

  // ─── Prompt Sessions ───────────────────────────────────────────────────────

  describeMethod('createPromptSession', {
    method: (p) => service.createPromptSession(p),
    callParams: { name: 'My Session', description: 'A test session', projectId: PROJECT_ID },
    minParams: { name: 'My Session' },
    url: '/v1/prompt_sessions',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID },
    expectedBody: { name: 'My Session', description: 'A test session' },
  });

  describeMethod('getPromptSession', {
    method: (p) => service.getPromptSession(p),
    callParams: { sessionId: SESSION_ID, projectId: PROJECT_ID, prefetch: true },
    minParams: { sessionId: SESSION_ID },
    url: '/v1/prompt_sessions/{session_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID, prefetch: true },
    expectedPath: { session_id: SESSION_ID },
  });

  describeMethod('updatePromptSession', {
    method: (p) => service.updatePromptSession(p),
    callParams: {
      sessionId: SESSION_ID,
      name: 'Updated Session',
      description: 'Updated',
      projectId: PROJECT_ID,
    },
    minParams: { sessionId: SESSION_ID },
    url: '/v1/prompt_sessions/{session_id}',
    httpMethod: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID },
    expectedBody: { name: 'Updated Session', description: 'Updated' },
  });

  describeMethod('deletePromptSession', {
    method: (p) => service.deletePromptSession(p),
    callParams: { sessionId: SESSION_ID, projectId: PROJECT_ID },
    minParams: { sessionId: SESSION_ID },
    url: '/v1/prompt_sessions/{session_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID },
  });

  describeMethod('createPromptSessionEntry', {
    method: (p) => service.createPromptSessionEntry(p),
    callParams: {
      sessionId: SESSION_ID,
      name: 'Entry 1',
      createdAt: 1700000000,
      prompt: promptObj,
      projectId: PROJECT_ID,
    },
    minParams: { sessionId: SESSION_ID, name: 'Entry 1', createdAt: 1700000000, prompt: promptObj },
    url: '/v1/prompt_sessions/{session_id}/entries',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID },
    expectedBody: { name: 'Entry 1', created_at: 1700000000, prompt: promptObj },
  });

  describeMethod('listPromptSessionEntries', {
    method: (p) => service.listPromptSessionEntries(p),
    callParams: { sessionId: SESSION_ID, projectId: PROJECT_ID, bookmark: 'bm1', limit: '10' },
    minParams: { sessionId: SESSION_ID },
    url: '/v1/prompt_sessions/{session_id}/entries',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID, bookmark: 'bm1', limit: '10' },
    expectedPath: { session_id: SESSION_ID },
  });

  // createPromptSessionEntryChatItem sends a raw array body
  describeRawBodyMethod('createPromptSessionEntryChatItem', {
    method: (p) => service.createPromptSessionEntryChatItem(p),
    params: {
      sessionId: SESSION_ID,
      entryId: ENTRY_ID,
      chatItem: [chatItem],
      projectId: PROJECT_ID,
    },
    minParams: { sessionId: SESSION_ID, entryId: ENTRY_ID, chatItem: [chatItem] },
    url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}/chat_items',
    httpMethod: 'POST',
    acceptHeader: undefined,
    contentTypeHeader: 'application/json',
    bodyKey: 'chatItem',
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID, entry_id: ENTRY_ID },
  });

  describeMethod('updatePromptSessionLock', {
    method: (p) => service.updatePromptSessionLock(p),
    callParams: {
      sessionId: SESSION_ID,
      locked: true,
      lockType: 'edit',
      projectId: PROJECT_ID,
      force: false,
    },
    minParams: { sessionId: SESSION_ID, locked: true },
    url: '/v1/prompt_sessions/{session_id}/lock',
    httpMethod: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: { project_id: PROJECT_ID, force: false },
    expectedPath: { session_id: SESSION_ID },
    expectedBody: { locked: true, lock_type: 'edit' },
  });

  describeMethod('getPromptSessionLock', {
    method: (p) => service.getPromptSessionLock(p),
    callParams: { sessionId: SESSION_ID, projectId: PROJECT_ID },
    minParams: { sessionId: SESSION_ID },
    url: '/v1/prompt_sessions/{session_id}/lock',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID },
  });

  describeMethod('getPromptSessionEntry', {
    method: (p) => service.getPromptSessionEntry(p),
    callParams: { sessionId: SESSION_ID, entryId: ENTRY_ID, projectId: PROJECT_ID },
    minParams: { sessionId: SESSION_ID, entryId: ENTRY_ID },
    url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID, entry_id: ENTRY_ID },
  });

  describeMethod('deletePromptSessionEntry', {
    method: (p) => service.deletePromptSessionEntry(p),
    callParams: { sessionId: SESSION_ID, entryId: ENTRY_ID, projectId: PROJECT_ID },
    minParams: { sessionId: SESSION_ID, entryId: ENTRY_ID },
    url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedQs: { project_id: PROJECT_ID },
    expectedPath: { session_id: SESSION_ID, entry_id: ENTRY_ID },
  });

  // ─── Text Chat ─────────────────────────────────────────────────────────────

  describeMethod('textChat', {
    method: (p) => service.textChat(p),
    callParams: {
      modelId: MODEL_ID,
      messages: [chatMessage],
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      temperature: 0.7,
      crypto: cryptoConfig,
    },
    minParams: { modelId: MODEL_ID, messages: [chatMessage] },
    url: '/ml/v1/text/chat',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: textChatExpectedParams({ temperature: 0.7, crypto: cryptoConfig }),
  });

  describeMethod('textChatStream', {
    method: (p) => service.textChatStream(p),
    callParams: {
      modelId: MODEL_ID,
      messages: [chatMessage],
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      temperature: 0.7,
    },
    minParams: { modelId: MODEL_ID, messages: [chatMessage] },
    url: '/ml/v1/text/chat_stream',
    httpMethod: 'POST',
    headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
    expectedParams: textChatExpectedParams({ temperature: 0.7 }),
    isStream: true,
  });

  // ─── Text Embeddings ───────────────────────────────────────────────────────

  describeMethod('embedText', {
    method: (p) => service.embedText(p),
    callParams: {
      modelId: MODEL_ID,
      inputs: ['Hello world'],
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      parameters: { truncate_input_tokens: 512 },
      crypto: cryptoConfig,
    },
    minParams: { modelId: MODEL_ID, inputs: ['Hello world'] },
    url: '/ml/v1/text/embeddings',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      model_id: MODEL_ID,
      inputs: ['Hello world'],
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      parameters: { truncate_input_tokens: 512 },
      crypto: cryptoConfig,
    },
  });

  // ─── Text Extraction ───────────────────────────────────────────────────────

  describeMethod('createTextExtraction', {
    method: (p) => service.createTextExtraction(p),
    callParams: {
      documentReference: textExtractionDataReference,
      resultsReference: textExtractionDataReference,
      steps: { ocr: { process_image: true } },
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: {
      documentReference: textExtractionDataReference,
      resultsReference: textExtractionDataReference,
    },
    url: '/ml/v1/text/extractions',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      document_reference: textExtractionDataReference,
      results_reference: textExtractionDataReference,
      steps: { ocr: { process_image: true } },
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
    },
  });

  describeMethod('listTextExtractions', {
    method: (p) => service.listTextExtractions(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID, start: 'token', limit: 10 },
    minParams: {},
    url: '/ml/v1/text/extractions',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID, start: 'token', limit: 10 },
    noRequiredParams: true,
    testNoParams: true,
  });

  describeMethod('getTextExtraction', {
    method: (p) => service.getTextExtraction(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/text/extractions/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  describeMethod('deleteTextExtraction', {
    method: (p) => service.deleteTextExtraction(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/text/extractions/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      hard_delete: true,
    },
  });
  // ─── Text Generation ───────────────────────────────────────────────────────

  describeMethod('generateText', {
    method: (p) => service.generateText(p),
    callParams: {
      input: 'Hello world',
      modelId: MODEL_ID,
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      parameters: { max_new_tokens: 100 },
      crypto: cryptoConfig,
    },
    minParams: { input: 'Hello world', modelId: MODEL_ID },
    url: '/ml/v1/text/generation',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      input: 'Hello world',
      model_id: MODEL_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      parameters: { max_new_tokens: 100 },
      crypto: cryptoConfig,
    },
  });

  describeMethod('generateTextStream', {
    method: (p) => service.generateTextStream(p),
    callParams: {
      input: 'Hello world',
      modelId: MODEL_ID,
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      parameters: { max_new_tokens: 100 },
    },
    minParams: { input: 'Hello world', modelId: MODEL_ID },
    url: '/ml/v1/text/generation_stream',
    httpMethod: 'POST',
    headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
    expectedParams: {
      input: 'Hello world',
      model_id: MODEL_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      parameters: { max_new_tokens: 100 },
    },
    isStream: true,
  });

  // ─── Tokenization ──────────────────────────────────────────────────────────

  describeMethod('tokenizeText', {
    method: (p) => service.tokenizeText(p),
    callParams: {
      modelId: MODEL_ID,
      input: 'Hello world',
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      parameters: { return_tokens: true },
      crypto: cryptoConfig,
    },
    minParams: { modelId: MODEL_ID, input: 'Hello world' },
    url: '/ml/v1/text/tokenization',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      model_id: MODEL_ID,
      input: 'Hello world',
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      parameters: { return_tokens: true },
      crypto: cryptoConfig,
    },
  });

  // ─── Time Series ───────────────────────────────────────────────────────────

  describeMethod('timeSeriesForecast', {
    method: (p) => service.timeSeriesForecast(p),
    callParams: {
      modelId: MODEL_ID,
      data: { target: [[1, 2, 3]] },
      schema: { timestamp_column: 'date', target_columns: ['value'] },
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: {
      modelId: MODEL_ID,
      data: { target: [[1, 2, 3]] },
      schema: { timestamp_column: 'date', target_columns: ['value'] },
    },
    url: '/ml/v1/time_series/forecast',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      model_id: MODEL_ID,
      data: { target: [[1, 2, 3]] },
      schema: { timestamp_column: 'date', target_columns: ['value'] },
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
    },
  });

  // ─── Trainings ─────────────────────────────────────────────────────────────

  describeMethod('createTraining', {
    method: (p) => service.createTraining(p),
    callParams: {
      name: 'my-training',
      resultsReference: trainingResultsRef,
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      description: 'A training job',
    },
    minParams: { name: 'my-training', resultsReference: trainingResultsRef },
    url: '/ml/v4/trainings',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-training',
      results_reference: trainingResultsRef,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      description: 'A training job',
    },
  });

  describeMethod('listTrainings', {
    method: (p) => service.listTrainings(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID, limit: 10, state: 'running' },
    minParams: {},
    url: '/ml/v4/trainings',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID, limit: 10, state: 'running' },
    noRequiredParams: true,
  });

  describeMethod('getTraining', {
    method: (p) => service.getTraining(p),
    callParams: { trainingId: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { trainingId: RESOURCE_ID },
    url: '/ml/v4/trainings/{training_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { training_id: RESOURCE_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  describeMethod('deleteTraining', {
    method: (p) => service.deleteTraining(p),
    callParams: {
      trainingId: RESOURCE_ID,
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      hardDelete: true,
    },
    minParams: { trainingId: RESOURCE_ID },
    url: '/ml/v4/trainings/{training_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      training_id: RESOURCE_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      hard_delete: true,
    },
  });

  // ─── Text Rerank ───────────────────────────────────────────────────────────

  describeMethod('textRerank', {
    method: (p) => service.textRerank(p),
    callParams: {
      modelId: MODEL_ID,
      inputs: [{ text: 'doc one' }],
      query: 'what is AI?',
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      crypto: cryptoConfig,
    },
    minParams: { modelId: MODEL_ID, inputs: [{ text: 'doc one' }], query: 'what is AI?' },
    url: '/ml/v1/text/rerank',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      model_id: MODEL_ID,
      inputs: [{ text: 'doc one' }],
      query: 'what is AI?',
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      crypto: cryptoConfig,
    },
  });

  // ─── Fine Tunings ──────────────────────────────────────────────────────────

  describeMethod('createFineTuning', {
    method: (p) => service.createFineTuning(p),
    callParams: {
      name: 'my-fine-tuning',
      trainingDataReferences: fineTuningDataRef,
      resultsReference: fineTuningResultsRef,
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
      description: 'A fine tuning job',
    },
    minParams: {
      name: 'my-fine-tuning',
      trainingDataReferences: fineTuningDataRef,
      resultsReference: fineTuningResultsRef,
    },
    url: '/ml/v1/fine_tunings',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-fine-tuning',
      training_data_references: fineTuningDataRef,
      results_reference: fineTuningResultsRef,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
      description: 'A fine tuning job',
    },
  });

  // ─── Fine Tunings (list/get/delete) ───────────────────────────────────────

  describeMethod('listFineTunings', {
    method: (p) => service.listFineTunings(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID, limit: 10, state: 'running' },
    minParams: {},
    url: '/ml/v1/fine_tunings',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID, limit: 10, state: 'running' },
    noRequiredParams: true,
  });

  describeMethod('getFineTuning', {
    method: (p) => service.getFineTuning(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/fine_tunings/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  describeMethod('deleteFineTuning', {
    method: (p) => service.deleteFineTuning(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/fine_tunings/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      hard_delete: true,
    },
  });

  // ─── Document Extractions ──────────────────────────────────────────────────

  describeMethod('createDocumentExtraction', {
    method: (p) => service.createDocumentExtraction(p),
    callParams: {
      name: 'my-doc-extraction',
      documentReferences: docRef,
      resultsReference: docResultsRef,
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: { name: 'my-doc-extraction', documentReferences: docRef },
    url: '/ml/v1/tuning/documents',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-doc-extraction',
      document_references: docRef,
      results_reference: docResultsRef,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
    },
  });

  describeMethod('listDocumentExtractions', {
    method: (p) => service.listDocumentExtractions(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: {},
    url: '/ml/v1/tuning/documents',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID },
    noRequiredParams: true,
  });

  describeMethod('getDocumentExtraction', {
    method: (p) => service.getDocumentExtraction(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/documents/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, project_id: PROJECT_ID, space_id: SPACE_ID },
  });

  describeMethod('cancelDocumentExtractions', {
    method: (p) => service.cancelDocumentExtractions(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/documents/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
      hard_delete: true,
    },
  });

  // ─── Synthetic Data Generation ─────────────────────────────────────────────

  describeMethod('createSyntheticDataGeneration', {
    method: (p) => service.createSyntheticDataGeneration(p),
    callParams: {
      name: 'my-sdg',
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      resultsReference: { type: 'container', location: { path: 'sdg-results' } },
    },
    minParams: { name: 'my-sdg' },
    url: '/ml/v1/tuning/synthetic_data',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-sdg',
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      results_reference: { type: 'container', location: { path: 'sdg-results' } },
    },
  });

  describeMethod('listSyntheticDataGenerations', {
    method: (p) => service.listSyntheticDataGenerations(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: {},
    url: '/ml/v1/tuning/synthetic_data',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { project_id: PROJECT_ID, space_id: SPACE_ID },
    noRequiredParams: true,
  });

  describeMethod('getSyntheticDataGeneration', {
    method: (p) => service.getSyntheticDataGeneration(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/synthetic_data/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, project_id: PROJECT_ID, space_id: SPACE_ID },
  });

  // ─── Synthetic Data Generation (cancel) ───────────────────────────────────

  describeMethod('cancelSyntheticDataGeneration', {
    method: (p) => service.cancelSyntheticDataGeneration(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/synthetic_data/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
      hard_delete: true,
    },
  });

  // ─── Taxonomies ────────────────────────────────────────────────────────────

  describeMethod('createTaxonomy', {
    method: (p) => service.createTaxonomy(p),
    callParams: {
      name: 'my-taxonomy',
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      description: 'A taxonomy job',
    },
    minParams: { name: 'my-taxonomy' },
    url: '/ml/v1/tuning/taxonomies_imports',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-taxonomy',
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      description: 'A taxonomy job',
    },
  });

  describeMethod('listTaxonomies', {
    method: (p) => service.listTaxonomies(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: {},
    url: '/ml/v1/tuning/taxonomies_imports',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { project_id: PROJECT_ID, space_id: SPACE_ID },
    noRequiredParams: true,
  });

  describeMethod('getTaxonomy', {
    method: (p) => service.getTaxonomy(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/taxonomies_imports/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, project_id: PROJECT_ID, space_id: SPACE_ID },
  });

  describeMethod('deleteTaxonomy', {
    method: (p) => service.deleteTaxonomy(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/tuning/taxonomies_imports/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
      hard_delete: true,
    },
  });

  // ─── Models ────────────────────────────────────────────────────────────────

  describeMethod('createModel', {
    method: (p) => service.createModel(p),
    callParams: {
      name: 'my-model',
      type: 'prompt_tune_1.0',
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
      description: 'A model',
    },
    minParams: { name: 'my-model', type: 'prompt_tune_1.0' },
    url: '/ml/v4/models',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      name: 'my-model',
      type: 'prompt_tune_1.0',
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      description: 'A model',
    },
  });

  describeMethod('listModels', {
    method: (p) => service.listModels(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID, limit: 10 },
    minParams: {},
    url: '/ml/v4/models',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID, limit: 10 },
    noRequiredParams: true,
  });

  describeMethod('getModel', {
    method: (p) => service.getModel(p),
    callParams: { modelId: MODEL_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { modelId: MODEL_ID },
    url: '/ml/v4/models/{model_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { model_id: MODEL_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  describeRawBodyMethod('updateModel', {
    method: (p) => service.updateModel(p),
    params: {
      modelId: MODEL_ID,
      jsonPatch: [jsonPatchOperation],
      spaceId: SPACE_ID,
      projectId: PROJECT_ID,
    },
    minParams: { modelId: MODEL_ID, jsonPatch: [jsonPatchOperation] },
    url: '/ml/v4/models/{model_id}',
    httpMethod: 'PATCH',
    acceptHeader: 'application/json',
    contentTypeHeader: 'application/json',
    bodyKey: 'jsonPatch',
    expectedQs: { version: VERSION, space_id: SPACE_ID, project_id: PROJECT_ID },
    expectedPath: { model_id: MODEL_ID },
  });

  describeMethod('deleteModel', {
    method: (p) => service.deleteModel(p),
    callParams: { modelId: MODEL_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { modelId: MODEL_ID },
    url: '/ml/v4/models/{model_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: { model_id: MODEL_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  // ─── Utility Agent Tools ───────────────────────────────────────────────────

  describeMethod('listUtilityAgentTools', {
    method: (p) => service.listUtilityAgentTools(p),
    callParams: {},
    minParams: {},
    url: '/v1-beta/utility_agent_tools',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: {},
    noRequiredParams: true,
    testNoParams: true,
  });

  describeMethod('getUtilityAgentTool', {
    method: (p) => service.getUtilityAgentTool(p),
    callParams: { toolId: TOOL_ID },
    minParams: { toolId: TOOL_ID },
    url: '/v1-beta/utility_agent_tools/{tool_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: {},
    expectedPath: { tool_id: TOOL_ID },
  });

  describeRawBodyMethod('runUtilityAgentTool', {
    method: (p) => service.runUtilityAgentTool(p),
    params: { wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequest },
    minParams: { wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequest },
    url: '/v1-beta/utility_agent_tools/run',
    httpMethod: 'POST',
    acceptHeader: 'application/json',
    contentTypeHeader: 'application/json',
    bodyKey: 'wxUtilityAgentToolsRunRequest',
    expectedQs: {},
  });

  describeRawBodyMethod('runUtilityAgentToolByName', {
    method: (p) => service.runUtilityAgentToolByName(p),
    params: {
      toolId: TOOL_ID,
      wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequest,
    },
    minParams: {
      toolId: TOOL_ID,
      wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequest,
    },
    url: '/v1-beta/utility_agent_tools/run/{tool_id}',
    httpMethod: 'POST',
    acceptHeader: 'application/json',
    contentTypeHeader: 'application/json',
    bodyKey: 'wxUtilityAgentToolsRunRequest',
    expectedQs: {},
    expectedPath: { tool_id: TOOL_ID },
  });

  // ─── Spaces ────────────────────────────────────────────────────────────────

  describeMethod('createSpace', {
    method: (p) => service.createSpace(p),
    callParams: { name: 'my-space', storage: spaceStorage, description: 'A space' },
    minParams: { name: 'my-space', storage: spaceStorage },
    url: '/v2/spaces',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedQs: {},
    expectedBody: { name: 'my-space', storage: spaceStorage, description: 'A space' },
  });

  describeMethod('getSpace', {
    method: (p) => service.getSpace(p),
    callParams: { spaceId: SPACE_ID, include: 'members' },
    minParams: { spaceId: SPACE_ID },
    url: '/v2/spaces/{space_id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { include: 'members' },
    expectedPath: { space_id: SPACE_ID },
  });

  describeMethod('deleteSpace', {
    method: (p) => service.deleteSpace(p),
    callParams: { spaceId: SPACE_ID },
    minParams: { spaceId: SPACE_ID },
    url: '/v2/spaces/{space_id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedQs: {},
    expectedPath: { space_id: SPACE_ID },
  });

  describeRawBodyMethod('updateSpace', {
    method: (p) => service.updateSpace(p),
    params: { spaceId: SPACE_ID, jsonPatch: [jsonPatchOperation] },
    minParams: { spaceId: SPACE_ID, jsonPatch: [jsonPatchOperation] },
    url: '/v2/spaces/{space_id}',
    httpMethod: 'PATCH',
    acceptHeader: 'application/json',
    contentTypeHeader: 'application/json-patch+json',
    bodyKey: 'jsonPatch',
    expectedQs: {},
    expectedPath: { space_id: SPACE_ID },
  });

  describeMethod('listSpaces', {
    method: (p) => service.listSpaces(p),
    callParams: { limit: 10, name: 'my-space' },
    minParams: {},
    url: '/v2/spaces',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedQs: { limit: 10, name: 'my-space' },
    noRequiredParams: true,
    testNoParams: true,
  });

  // ─── Text Classification ───────────────────────────────────────────────────

  describeMethod('createTextClassification', {
    method: (p) => service.createTextClassification(p),
    callParams: {
      documentReference: classificationDocRef,
      parameters: classificationParams,
      projectId: PROJECT_ID,
      spaceId: SPACE_ID,
    },
    minParams: {
      documentReference: classificationDocRef,
      parameters: classificationParams,
    },
    url: '/ml/v1/text/classifications',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedParams: {
      document_reference: classificationDocRef,
      parameters: classificationParams,
      project_id: PROJECT_ID,
      space_id: SPACE_ID,
    },
  });

  describeMethod('listTextClassifications', {
    method: (p) => service.listTextClassifications(p),
    callParams: { spaceId: SPACE_ID, projectId: PROJECT_ID, limit: 10 },
    minParams: {},
    url: '/ml/v1/text/classifications',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { space_id: SPACE_ID, project_id: PROJECT_ID, limit: 10 },
    noRequiredParams: true,
  });

  describeMethod('getTextClassification', {
    method: (p) => service.getTextClassification(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/text/classifications/{id}',
    httpMethod: 'GET',
    headers: { Accept: 'application/json' },
    expectedParams: { id: RESOURCE_ID, space_id: SPACE_ID, project_id: PROJECT_ID },
  });

  describeMethod('deleteTextClassification', {
    method: (p) => service.deleteTextClassification(p),
    callParams: { id: RESOURCE_ID, spaceId: SPACE_ID, projectId: PROJECT_ID, hardDelete: true },
    minParams: { id: RESOURCE_ID },
    url: '/ml/v1/text/classifications/{id}',
    httpMethod: 'DELETE',
    headers: {},
    expectedParams: {
      id: RESOURCE_ID,
      space_id: SPACE_ID,
      project_id: PROJECT_ID,
      hard_delete: true,
    },
  });

  // ─── Audio Transcription ───────────────────────────────────────────────────
  // transcribeAudio is hand-written because it enforces a custom "projectId OR spaceId"
  // constraint that cannot be expressed through the generic describeMethod helper.
  describe('transcribeAudio', () => {
    test('sends correct request params with projectId', () => {
      testWithRetries(() => {
        const { signal } = new AbortController();
        const result = service.transcribeAudio({
          model: MODEL_ID,
          file: AUDIO_FILE_PATH,
          projectId: PROJECT_ID,
          language: 'fr',
          signal,
        });
        expectToBePromise(result);
        expect(createRequestMock).toHaveBeenCalledTimes(1);
        const mockRequestOptions = getOptions(getMock());
        checkUrlAndMethod(mockRequestOptions, '/ml/v1/audio/transcriptions', 'POST');
        expect(mockRequestOptions.qs.version).toEqual(VERSION);
        expect(mockRequestOptions.body).toBeDefined();
      });
    });

    test('sends correct request params with spaceId', () => {
      const result = service.transcribeAudio({
        model: MODEL_ID,
        file: AUDIO_FILE_PATH,
        spaceId: SPACE_ID,
        language: 'fr',
      });
      expectToBePromise(result);
      expect(createRequestMock).toHaveBeenCalledTimes(1);
      const mockRequestOptions = getOptions(getMock());
      checkUrlAndMethod(mockRequestOptions, '/ml/v1/audio/transcriptions', 'POST');
      expect(mockRequestOptions.qs.version).toEqual(VERSION);
      expect(mockRequestOptions.body).toBeDefined();
    });

    test('handles file as ReadStream', () => {
      const fileStream = fs.createReadStream(AUDIO_FILE_PATH);

      testWithRetries(() => {
        const result = service.transcribeAudio({
          model: MODEL_ID,
          file: fileStream,
          projectId: PROJECT_ID,
        });
        expectToBePromise(result);
        expect(createRequestMock).toHaveBeenCalledTimes(1);
        const mockRequestOptions = getOptions(getMock());
        checkUrlAndMethod(mockRequestOptions, '/ml/v1/audio/transcriptions', 'POST');
        expect(mockRequestOptions.body).toBeDefined();
      });
    });

    test('handles file as string path', () => {
      testWithRetries(() => {
        const result = service.transcribeAudio({
          model: MODEL_ID,
          file: AUDIO_FILE_PATH,
          projectId: PROJECT_ID,
        });
        expectToBePromise(result);
        expect(createRequestMock).toHaveBeenCalledTimes(1);
        const mockRequestOptions = getOptions(getMock());
        expect(mockRequestOptions.body).toBeDefined();
      });
    });

    test('throws when neither projectId nor spaceId is provided', () => {
      expect(() => service.transcribeAudio({ model: MODEL_ID, file: AUDIO_FILE_PATH })).toThrow(
        'Either projectId or spaceId need to be provided'
      );
    });

    test('prioritizes user-given headers', () => {
      testWithRetries(() => {
        service.transcribeAudio({
          model: MODEL_ID,
          file: AUDIO_FILE_PATH,
          projectId: PROJECT_ID,
          headers: { Accept: 'fake/accept', 'Content-Type': 'fake/contentType' },
        });
        checkMediaHeaders(getMock(), 'fake/accept', 'fake/contentType');
      });
    });

    test('includes default headers when no custom headers provided', () => {
      testWithRetries(() => {
        service.transcribeAudio({
          model: MODEL_ID,
          file: AUDIO_FILE_PATH,
          projectId: PROJECT_ID,
        });
        expect(createRequestMock).toHaveBeenCalledTimes(1);
        const callArgs = getMock().mock.calls[0][0];
        expect(callArgs.defaultOptions.headers['Accept']).toBe('application/json');
        expect(callArgs.defaultOptions.headers['Content-Type']).toContain('multipart/form-data');
      });
    });

    test('handles signal parameter for request cancellation', () => {
      const { signal } = new AbortController();
      testWithRetries(() => {
        service.transcribeAudio({
          model: MODEL_ID,
          file: AUDIO_FILE_PATH,
          projectId: PROJECT_ID,
          signal,
        });
        expect(createRequestMock).toHaveBeenCalledTimes(1);
        checkAxiosOptions(getMock(), signal);
      });
    });

    test('rejects with validation errors for invalid parameters', async () => {
      const invalidParams = {
        model: MODEL_ID,
        file: AUDIO_FILE_PATH,
        projectId: PROJECT_ID,
        invalidParam: 'should-not-be-here',
      };

      await expect(service.transcribeAudio(invalidParams as any)).rejects.toThrow();
    });
  });

  // ─── Callback Tests ────────────────────────────────────────────────────────

  /**
   * Helper to test requestCallback invocation for a method. Verifies that the callback is called
   * with correct parameters and headers are removed.
   */
  function testRequestCallback(
    methodName: string,
    methodFn: (params: any, callbacks?: any) => Promise<any>,
    params: Record<string, any>
  ) {
    test(`${methodName} invokes requestCallback before sending request`, async () => {
      const requestCallback = jest.fn();
      await methodFn(params, { requestCallback });

      expect(requestCallback).toHaveBeenCalledTimes(1);
      expect(requestCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.any(Object),
          defaultOptions: expect.objectContaining({
            serviceUrl: expect.any(String),
            axiosOptions: expect.any(Object),
          }),
        })
      );
      // Verify headers are removed from callback parameters
      expect(requestCallback.mock.calls[0][0].defaultOptions.headers).toBeUndefined();
    });
  }

  /**
   * Helper to test responseCallback invocation for a method. Verifies that the callback is called
   * with the response object.
   */
  function testResponseCallback(
    methodName: string,
    methodFn: (params: any, callbacks?: any) => Promise<any>,
    params: Record<string, any>
  ) {
    test(`${methodName} invokes responseCallback after receiving response`, async () => {
      const responseCallback = jest.fn();
      await methodFn(params, { responseCallback });

      // The responseCallback is called but since handleResponse is not awaited,
      // we just verify it was invoked
      expect(responseCallback).toHaveBeenCalledTimes(1);
    });
  }

  /** Helper to test both callbacks are invoked in correct order. */
  function testBothCallbacks(
    methodName: string,
    methodFn: (params: any, callbacks?: any) => Promise<any>,
    params: Record<string, any>
  ) {
    test(`${methodName} invokes both callbacks`, async () => {
      const requestCallback = jest.fn();
      const responseCallback = jest.fn();

      await methodFn(params, { requestCallback, responseCallback });

      // Both callbacks should be invoked
      expect(requestCallback).toHaveBeenCalledTimes(1);
      expect(responseCallback).toHaveBeenCalledTimes(1);
    });
  }

  /** Generates a full describe block for testing callbacks on a non-streaming method. */
  function describeCallbackMethod(
    methodName: string,
    methodFn: (params: any, callbacks?: any) => Promise<any>,
    params: Record<string, any>
  ) {
    describe(`${methodName} with callbacks`, () => {
      testRequestCallback(methodName, methodFn, params);
      testResponseCallback(methodName, methodFn, params);
      testBothCallbacks(methodName, methodFn, params);
    });
  }

  describe('Request and Response Callbacks', () => {
    // ─── Non-streaming methods with full callback support ─────────────────────

    describeCallbackMethod('generateText', (p, c) => service.generateText(p, c), {
      input: 'What is AI?',
      modelId: MODEL_ID,
      projectId: PROJECT_ID,
    });

    describeCallbackMethod('textChat', (p, c) => service.textChat(p, c), {
      messages: [chatMessage],
      modelId: MODEL_ID,
      projectId: PROJECT_ID,
    });

    describeCallbackMethod('embedText', (p, c) => service.embedText(p, c), {
      inputs: ['Hello world'],
      modelId: MODEL_ID,
      projectId: PROJECT_ID,
    });

    describeCallbackMethod('textRerank', (p, c) => service.textRerank(p, c), {
      inputs: ['doc1', 'doc2'],
      query: 'search query',
      modelId: MODEL_ID,
      projectId: PROJECT_ID,
    });

    // ─── CallbackHandler class tests ───────────────────────────────────────────

    describe('CallbackHandler class', () => {
      test('creates handler with both callbacks', () => {
        const requestCallback = jest.fn();
        const responseCallback = jest.fn();
        const handler = new WatsonXAI.CallbackHandler({ requestCallback, responseCallback });

        expect(handler.requestCallback).toBe(requestCallback);
        expect(handler.responseCallback).toBe(responseCallback);
      });

      test('creates handler with only requestCallback', () => {
        const requestCallback = jest.fn();
        const handler = new WatsonXAI.CallbackHandler({ requestCallback });

        expect(handler.requestCallback).toBe(requestCallback);
        expect(handler.responseCallback).toBeUndefined();
      });

      test('creates handler with only responseCallback', () => {
        const responseCallback = jest.fn();
        const handler = new WatsonXAI.CallbackHandler({ responseCallback });

        expect(handler.requestCallback).toBeUndefined();
        expect(handler.responseCallback).toBe(responseCallback);
      });

      test('handleRequest removes headers from parameters', () => {
        const requestCallback = jest.fn();
        const handler = new WatsonXAI.CallbackHandler({ requestCallback });
        const parameters = {
          options: { body: { test: 'data' } },
          defaultOptions: {
            headers: { 'Content-Type': 'application/json' },
            serviceUrl: 'https://test.com',
            axiosOptions: {},
          },
        };

        handler.handleRequest(parameters);

        expect(requestCallback).toHaveBeenCalledTimes(1);
        const callArgs = requestCallback.mock.calls[0][0];
        expect(callArgs.defaultOptions.headers).toBeUndefined();
        expect(callArgs.defaultOptions.serviceUrl).toBe('https://test.com');
      });

      test('handleRequest does nothing when requestCallback is undefined', () => {
        const handler = new WatsonXAI.CallbackHandler({});
        const parameters = {
          options: {},
          defaultOptions: { headers: {}, axiosOptions: {} },
        };

        expect(() => handler.handleRequest(parameters)).not.toThrow();
      });

      test('handleResponse invokes callback with resolved response', async () => {
        const responseCallback = jest.fn();
        const handler = new WatsonXAI.CallbackHandler({ responseCallback });
        const mockResponse = { result: { data: 'test' }, status: 200 };
        const responsePromise = Promise.resolve(mockResponse);

        await handler.handleResponse(responsePromise);

        expect(responseCallback).toHaveBeenCalledTimes(1);
        expect(responseCallback).toHaveBeenCalledWith(mockResponse);
      });

      test('handleResponse does nothing when responseCallback is undefined', async () => {
        const handler = new WatsonXAI.CallbackHandler({});
        const responsePromise = Promise.resolve({ result: {}, status: 200 });

        await expect(handler.handleResponse(responsePromise)).resolves.toBeUndefined();
      });
    });
  });
});
