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

import { NoAuthAuthenticator, BaseService } from 'ibm-cloud-sdk-core';
import { BatchInference } from '../../../src/batch_inference/batch_inference';
import { Files } from '../../../src/batch_inference/files';
import type { MethodTestSpec } from '../utils/helpers';
import { describeMethod } from '../utils/helpers';

// ─── Service Setup ────────────────────────────────────────────────────────────

const SERVICE_URL = 'https://us-south.ml.cloud.ibm.com';
const API_KEY = 'test-api-key';
const VERSION = '2023-07-07';

const serviceOptions = {
  authenticator: new NoAuthAuthenticator(),
  serviceUrl: SERVICE_URL,
  apikey: API_KEY,
  version: VERSION,
};

const service = new BatchInference(serviceOptions);

// ─── Mock Setup ───────────────────────────────────────────────────────────────

let createRequestMock: jest.SpyInstance;

function getRequestMock(): jest.SpyInstance {
  return createRequestMock;
}

// ─── Shared Test Fixtures ─────────────────────────────────────────────────────

const SPACE_ID = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
const BATCH_ID = 'batch_abc123';
const INPUT_FILE_ID = 'file_abc123';
const ENDPOINT = '/ml/v1/text/chat';
const COMPLETION_WINDOW = '24h';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function testRequiredOneOf(
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
      methodFn({ ...restParams, projectId: PROJECT_ID, spaceId: SPACE_ID })
    ).rejects.toThrow(/Only one of the following parameters is allowed: projectId,spaceId/);
  });
}

// Helper wrapper to use the shared describeMethod with local context and requiresOneOf support
function describeBatchMethod(name: string, spec: MethodTestSpec) {
  const { requiresOneOf = false, ...restSpec } = spec;

  // Use the shared describeMethod
  describeMethod(name, restSpec, service, getRequestMock, API_KEY);

  // Add requiresOneOf tests if needed
  if (requiresOneOf) {
    describe(name, () => {
      describe('negative tests', () => {
        testRequiredOneOf(spec.method, spec.minParams);
      });
    });
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BatchInference', () => {
  beforeAll(() => {
    createRequestMock = jest.spyOn(BaseService.prototype, 'createRequest' as keyof BaseService);
  });

  beforeEach(() => {
    createRequestMock.mockImplementation(() => Promise.resolve({ result: {} }));
  });

  afterEach(() => {
    createRequestMock.mockReset();
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
          authenticator: new NoAuthAuthenticator(),
          serviceUrl: SERVICE_URL,
          version: VERSION,
        });
      }).toThrow('API key is required.');
    });
  });

  describeBatchMethod('create', {
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
    describeBatchMethod('with batchId', {
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

    describeBatchMethod('without batchId (list all)', {
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
      createRequestMock.mockResolvedValue({
        result: { data: mockBatches },
      });

      const result = await service.list({ projectId: PROJECT_ID, limit: 10 });
      expect(result).toEqual(mockBatches);
      expect(createRequestMock).toHaveBeenCalledTimes(1);
    });
  });

  describeBatchMethod('cancel', {
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
});
