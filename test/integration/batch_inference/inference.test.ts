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

import path from 'path';
import { BatchInference } from '../../../src/batch_inference/batch_inference';
import * as authHelper from '../../resources/auth-helper';
import { generateBatchInferenceFile } from '../../utils/data_generators';
import {
  TEST_COMPLETION_WINDOW,
  TEST_ENDPOINT,
  verifyResponse,
  createTestBatch,
  verifyBatchResponse,
  removeLocalFile,
} from './utils';

const configFile = path.resolve(__dirname, '../../../credentials/watsonx_ai_ml_vml_v1.env');
const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();

const version = '2024-03-14';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const projectId = process.env.WATSONX_AI_PROJECT_ID;

const BATCH_FILE_NAME = 'batch.jsonl';
const batchFilePath = path.resolve(__dirname, BATCH_FILE_NAME);
const TIMEOUT = 60000;

describe.skip('BatchInference Integration Tests', () => {
  jest.setTimeout(TIMEOUT);

  let batchInferenceService: BatchInference;
  let uploadedFileId: string;
  let createdBatchId: string | null;

  beforeAll(async () => {
    batchInferenceService = new BatchInference({
      serviceUrl,
      version,
    });
    await generateBatchInferenceFile(4, ['ibm/granite-4-h-small'], batchFilePath);
    const uploadResponse = await batchInferenceService.files.upload({
      projectId,
      file: batchFilePath,
    });
    if (uploadResponse.result.id) uploadedFileId = uploadResponse.result.id;
  });

  afterAll(async () => {
    await removeLocalFile(batchFilePath);
  });

  afterEach(async () => {
    if (createdBatchId) {
      await batchInferenceService.cancel({
        projectId,
        batchId: createdBatchId,
      });
      createdBatchId = null;
    }
  });

  describe('Batch Creation with API', () => {
    test('create a batch job', async () => {
      const metadata = {
        environment: 'test',
        version: '1.0.0',
        user: 'Node.js-SDK-integration-test',
      };

      const response = await batchInferenceService.create({
        projectId,
        inputFileId: uploadedFileId,
        completionWindow: TEST_COMPLETION_WINDOW,
        endpoint: TEST_ENDPOINT,
        metadata,
      });

      verifyResponse(response);

      createdBatchId = response.result.id as string;
    });
  });

  describe('Batch Retrieval from API', () => {
    test('retrieve a specific batch by ID', async () => {
      // Create a batch first
      const batchId = await createTestBatch(batchInferenceService, uploadedFileId);

      // Retrieve the batch
      const response = await batchInferenceService.getDetails({
        projectId,
        batchId,
      });

      const retrievedBatch = verifyBatchResponse(response);
      expect(retrievedBatch.id).toBe(batchId);

      createdBatchId = batchId;
    });

    test('list all batches', async () => {
      const response = await batchInferenceService.getDetails({
        projectId,
      });

      expect(response.result.data).toBeInstanceOf(Array);
    });

    test('list batches with limit', async () => {
      const limit = 3;
      const response = await batchInferenceService.getDetails({
        projectId,
        limit,
      });

      const collection = response.result;

      expect(collection.data.length).toBeLessThanOrEqual(limit);
    });

    test('use list() convenience method', async () => {
      const batches = await batchInferenceService.list({
        projectId,
        limit: 10,
      });

      expect(batches).toBeInstanceOf(Array);
    });
  });

  describe('Batch Cancellation via API', () => {
    test('cancel a batch job', async () => {
      const batchIdToCancel = await createTestBatch(batchInferenceService, uploadedFileId);

      const cancelResponse = await batchInferenceService.cancel({
        projectId,
        batchId: batchIdToCancel,
      });

      const cancelledBatch = verifyResponse(cancelResponse);
      expect(cancelledBatch.id).toBe(batchIdToCancel);
    });
  });

  describe('Error Handling with Real API', () => {
    test('handle invalid file ID when creating batch', async () => {
      await expect(
        batchInferenceService.create({
          projectId,
          inputFileId: 'invalid-file-id-12345',
          completionWindow: TEST_COMPLETION_WINDOW,
          endpoint: TEST_ENDPOINT,
        })
      ).rejects.toThrow();
    });

    test('handle invalid batch ID when retrieving', async () => {
      await expect(
        batchInferenceService.getDetails({
          projectId,
          batchId: 'invalid-batch-id-12345',
        })
      ).rejects.toThrow();
    });

    test('handle invalid batch ID when cancelling', async () => {
      await expect(
        batchInferenceService.cancel({
          projectId,
          batchId: 'invalid-batch-id-12345',
        })
      ).rejects.toThrow();
    });
  });
});
