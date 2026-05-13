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

import { BatchInference } from '../../../src/batch_inference/batch_inference';
import { Files } from '../../../src/batch_inference/files';
import { createTestServiceConfig, createRequestMockSetup, createDescribeMethod } from '../utils';

// ─── Service Setup ────────────────────────────────────────────────────────────

const serviceOptions = {
  ...createTestServiceConfig(),
};
const API_KEY = serviceOptions.apikey;

const service = new BatchInference(serviceOptions);

// ─── Mock Setup ───────────────────────────────────────────────────────────────

const mockSetup = createRequestMockSetup();

// ─── Shared Test Fixtures ─────────────────────────────────────────────────────

const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
const BATCH_ID = 'batch_abc123';
const INPUT_FILE_ID = 'file_abc123';
const ENDPOINT = '/ml/v1/text/chat';
const COMPLETION_WINDOW = '24h';

const describeMethod = createDescribeMethod(service, mockSetup.getMock, API_KEY, {
  version: serviceOptions.version,
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BatchInference', () => {
  beforeAll(() => {
    mockSetup.setup();
  });

  beforeEach(() => {
    mockSetup.getMock().mockImplementation(() => Promise.resolve({ result: {} }));
  });

  afterEach(() => {
    mockSetup.reset();
  });

  describe('constructor', () => {
    test('initializes with apikey', () => {
      expect(service).toBeInstanceOf(BatchInference);
    });

    test('initializes Files instance', () => {
      expect(service.files).toBeInstanceOf(Files);
    });

    test('throws error when apikey is missing', () => {
      expect(() => {
        new BatchInference({
          ...createTestServiceConfig({ apikey: undefined }),
        });
      }).toThrow('API key is required.');
    });
  });

  describeMethod('create', {
    method: (p) => service.create(p),
    callParams: {
      inputFileId: INPUT_FILE_ID,
      endpoint: ENDPOINT,
      completionWindow: COMPLETION_WINDOW,
      projectId: PROJECT_ID,
      metadata: { key: 'value' },
    },
    minParams: {
      inputFileId: INPUT_FILE_ID,
      endpoint: ENDPOINT,
      completionWindow: COMPLETION_WINDOW,
      projectId: PROJECT_ID,
    },
    url: '/ml/v1/batches',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedBody: {
      input_file_id: INPUT_FILE_ID,
      endpoint: ENDPOINT,
      completion_window: COMPLETION_WINDOW,
      metadata: { key: 'value' },
    },
    requiresOneOf: true,
  });

  describe('getDetails', () => {
    describeMethod('with batchId', {
      method: (p) => service.getDetails(p),
      callParams: {
        batchId: BATCH_ID,
        projectId: PROJECT_ID,
      },
      minParams: {
        batchId: BATCH_ID,
        projectId: PROJECT_ID,
      },
      url: '/ml/v1/batches/{batch_id}',
      httpMethod: 'GET',
      headers: { Accept: 'application/json' },
      expectedPath: {
        batch_id: BATCH_ID,
      },
      requiresOneOf: true,
      noRequiredParams: true,
    });

    describeMethod('without batchId (list all)', {
      method: (p) => service.getDetails(p),
      callParams: {
        projectId: PROJECT_ID,
        limit: 10,
      },
      minParams: {
        projectId: PROJECT_ID,
      },
      url: '/ml/v1/batches',
      httpMethod: 'GET',
      headers: { Accept: 'application/json' },
      expectedQs: {
        limit: 10,
      },
      noRequiredParams: true,
    });
  });

  describe('list', () => {
    test('returns array of batches', async () => {
      const mockBatches = [
        { id: 'batch_1', status: 'completed' },
        { id: 'batch_2', status: 'in_progress' },
      ];
      mockSetup.getMock().mockResolvedValue({
        result: { data: mockBatches },
      });

      const result = await service.list({ projectId: PROJECT_ID, limit: 10 });
      expect(result).toEqual(mockBatches);
      expect(mockSetup.getMock()).toHaveBeenCalledTimes(1);
    });
  });

  describeMethod('cancel', {
    method: (p) => service.cancel(p),
    callParams: {
      batchId: BATCH_ID,
      projectId: PROJECT_ID,
    },
    minParams: {
      batchId: BATCH_ID,
      projectId: PROJECT_ID,
    },
    url: '/ml/v1/batches/{batch_id}/cancel',
    httpMethod: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    expectedPath: {
      batch_id: BATCH_ID,
    },
    requiresOneOf: true,
  });

  describe('Container ID Headers', () => {
    const SPACE_ID = 'test-space-123';

    const getHeaders = () => mockSetup.getMock().mock.calls[0][0].defaultOptions.headers;
    const httpMethods = [
      { method: '_get', params: { url: '/test' } },
      { method: '_post', params: { url: '/test', body: {} } },
    ] as const;

    beforeEach(() => {
      mockSetup.getMock().mockClear();
    });

    describe('API methods', () => {
      describe.each(httpMethods)('with $method method', ({ method, params }) => {
        test('includes X-IBM-PROJECT-ID and authorization headers', async () => {
          await service[method]({ ...params, projectId: PROJECT_ID });
          const headers = getHeaders();

          expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
        });

        test('includes X-IBM-SPACE-ID when spaceId provided', async () => {
          await service[method]({ ...params, spaceId: SPACE_ID });
          const headers = getHeaders();

          expect(headers['X-IBM-SPACE-ID']).toBe(SPACE_ID);
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
        });

        test('params override instance-level container IDs', async () => {
          const instanceService = new BatchInference({
            ...createTestServiceConfig(),
            projectId: 'instance-project-id',
          });
          await instanceService[method]({
            ...params,
            projectId: 'param-project-id',
          });
          const headers = getHeaders();

          expect(headers['X-IBM-PROJECT-ID']).toBe('param-project-id');
        });

        test('uses instance-level container IDs when not in params', async () => {
          const instanceService = new BatchInference({
            ...createTestServiceConfig(),
            spaceId: 'instance-space-id',
          });
          await instanceService[method](params);
          const headers = getHeaders();

          expect(headers['X-IBM-SPACE-ID']).toBe('instance-space-id');
        });

        test('merges container ID headers with custom headers', async () => {
          await service[method]({
            ...params,
            projectId: PROJECT_ID,
            headers: { 'Custom-Header': 'custom-value' },
          });
          const headers = getHeaders();

          expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
          expect(headers['Custom-Header']).toBe('custom-value');
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
        });
      });
    });

    describe('BatchInference methods', () => {
      const apiMethods: Array<{
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
      }> = [
        {
          name: 'create',
          method: ({ containerId, headers, svc = service }) =>
            svc.create({
              inputFileId: INPUT_FILE_ID,
              endpoint: ENDPOINT,
              completionWindow: COMPLETION_WINDOW,
              ...containerId,
              headers,
            }),
        },
        {
          name: 'getDetails (with batchId)',
          method: ({ containerId, headers, svc = service }) =>
            svc.getDetails({
              batchId: BATCH_ID,
              ...containerId,
              headers,
            }),
        },
        {
          name: 'getDetails (list)',
          method: ({ containerId, headers, svc = service }) =>
            svc.getDetails({
              limit: 10,
              ...containerId,
              headers,
            }),
        },
        {
          name: 'cancel',
          method: ({ containerId, headers, svc = service }) =>
            svc.cancel({
              batchId: BATCH_ID,
              ...containerId,
              headers,
            }),
        },
      ];

      describe.each(apiMethods)('with $name method', ({ name, method }) => {
        test(`${name} sends X-IBM-PROJECT-ID header`, async () => {
          await method({ containerId: { projectId: PROJECT_ID } });
          const headers = getHeaders();

          expect(headers['X-IBM-PROJECT-ID']).toBe(PROJECT_ID);
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
        });

        test(`${name} sends X-IBM-SPACE-ID header`, async () => {
          await method({ containerId: { spaceId: SPACE_ID } });
          const headers = getHeaders();

          expect(headers['X-IBM-SPACE-ID']).toBe(SPACE_ID);
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
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
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
        });

        test(`${name} preserve custom headers`, async () => {
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
          expect(headers['authorization']).toBe(`Bearer ${API_KEY}`);
          expect(headers['X-Custom-Header']).toBe('custom-value');
          expect(headers['X-Request-ID']).toBe('req-123');
        });
      });
    });
  });
});
