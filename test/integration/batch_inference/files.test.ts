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
import fs from 'fs';
import { BatchInference } from '../../../src/batch_inference/batch_inference';
import * as authHelper from '../../resources/auth-helper';
import type {
  UploadedFile,
  UploadedFileCollection,
} from '../../../src/batch_inference/types/response';
import { generateBatchInferenceFile } from '../../utils/data_generators';
import { writeFile } from 'fs/promises';
import { fileExists, removeLocalFile, uploadFile } from './utils';

const TIMEOUT = 60000;
const configFile = path.resolve(__dirname, '../../../credentials/watsonx_ai_ml_vml_v1.env');
const batchFilePath = path.resolve(__dirname, 'batch.jsonl');
const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();

const version = '2024-03-14';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const projectId = process.env.WATSONX_AI_PROJECT_ID;

describe.skip('Files Integration Tests', () => {
  jest.setTimeout(TIMEOUT);

  let batchInferenceService: BatchInference;
  beforeAll(async () => {
    batchInferenceService = new BatchInference({
      serviceUrl,
      version,
    });
    await generateBatchInferenceFile(4, ['ibm/granite-4-h-small'], batchFilePath);
  });

  afterAll(async () => {
    // Clean up any downloaded test files
    await removeLocalFile(batchFilePath);
  });

  describe('File Upload via API', () => {
    test('uploads a file from file path', async () => {
      const response = await batchInferenceService.files.upload({
        projectId,
        file: batchFilePath,
      });

      expect(response.result.id).toBeDefined();
    });

    test('uploads a file with ReadableStream', async () => {
      const filePath = path.resolve(__dirname, 'batch.jsonl');
      const stream = fs.createReadStream(filePath);

      const response = await batchInferenceService.files.upload({
        projectId,
        file: stream as any,
      });

      expect(response.result.id).toBeDefined();
    });
  });

  describe('File Retrieval via API', () => {
    test('retrieves a specific file by ID', async () => {
      const fileId = await uploadFile(
        batchInferenceService,
        path.resolve(__dirname, 'batch.jsonl'),
        projectId
      );

      // Retrieve the file
      const response = await batchInferenceService.files.getDetails({
        projectId,
        fileId,
      });

      expect((response.result as UploadedFile).id).toBe(fileId);
    });

    test('lists all files', async () => {
      const response = await batchInferenceService.files.getDetails({
        projectId,
      });

      expect((response.result as UploadedFileCollection).data).toBeInstanceOf(Array);
    });

    test('lists files with limit', async () => {
      const limit = 5;
      const response = await batchInferenceService.files.getDetails({
        projectId,
        limit,
      });

      const collection = response.result as UploadedFileCollection;
      expect(collection.data.length).toBeLessThanOrEqual(limit);
    });

    test('lists files with order parameter', async () => {
      const response = await batchInferenceService.files.getDetails({
        projectId,
        order: 'desc',
        limit: 10,
      });

      const collection = response.result as UploadedFileCollection;

      // Verify descending order
      if (collection.data.length > 1) {
        expect(collection.data[0].created_at).toBeGreaterThanOrEqual(
          collection.data[1].created_at as number
        );
      }
    });

    test('uses list() convenience method', async () => {
      const files = await batchInferenceService.files.list({
        projectId,
        limit: 10,
      });

      expect(files).toBeInstanceOf(Array);
    });

    test('handles pagination with after parameter', async () => {
      const firstPage = await batchInferenceService.files.getDetails({
        projectId,
        limit: 2,
      });

      const collection = firstPage.result as UploadedFileCollection;

      if (collection.has_more && collection.last_id) {
        const secondPage = await batchInferenceService.files.getDetails({
          projectId,
          limit: 2,
          after: collection.last_id,
        });

        expect((secondPage.result as UploadedFileCollection).data).toBeInstanceOf(Array);
      }
    });
  });

  describe('File Content Retrieval via API', () => {
    let fileId: string;
    beforeAll(async () => {
      fileId = await uploadFile(
        batchInferenceService,
        path.resolve(__dirname, 'batch.jsonl'),
        projectId
      );
    });

    test('retrieves file content', async () => {
      // Get file content
      const response = await batchInferenceService.files.getContent({
        projectId,
        fileId,
      });

      expect(response.result).toBeDefined();
      expect(typeof response.result).toBe('string');
      expect(response.result.length).toBeGreaterThan(0);

      // Verify it's valid JSONL
      const lines = response.result.trim().split('\n');
      expect(lines.length).toBeGreaterThan(0);

      lines.forEach((line) => {
        expect(() => JSON.parse(line)).not.toThrow();
      });
    });

    test('retrieves content that matches uploaded file', async () => {
      const originalContent = fs.readFileSync(path.resolve(__dirname, 'batch.jsonl'), 'utf-8');

      const contentResponse = await batchInferenceService.files.getContent({
        projectId,
        fileId,
      });

      // Compare content (normalize line endings)
      const normalizedOriginal = originalContent.replace(/\r\n/g, '\n').trim();
      const normalizedRetrieved = contentResponse.result.replace(/\r\n/g, '\n').trim();

      expect(normalizedRetrieved).toBe(normalizedOriginal);
    });
  });

  describe('File Download via API', () => {
    let fileId: string;
    let downloadedFile: string;
    beforeAll(async () => {
      fileId = await uploadFile(
        batchInferenceService,
        path.resolve(__dirname, 'batch.jsonl'),
        projectId
      );
    });

    afterEach(async () => {
      if (downloadedFile) await removeLocalFile(downloadedFile);
    });

    test('downloads file to local filesystem', async () => {
      const downloadFilename = `test-download-${Date.now()}.jsonl`;
      const downloadPath = path.resolve(__dirname, downloadFilename);

      // Download the file
      const result = await batchInferenceService.files.download({
        projectId,
        fileId,
        filename: downloadFilename,
        path: __dirname,
      });

      expect(result).toContain('File written successfully');
      expect(result).toContain(downloadFilename);
      expect(await fileExists(downloadPath)).toBe(true);

      downloadedFile = downloadPath;
    });

    test('downloads file without path parameter', async () => {
      const downloadFilename = `test-download-no-path-${Date.now()}.jsonl`;

      // Download to current directory
      const result = await batchInferenceService.files.download({
        projectId,
        fileId,
        filename: downloadFilename,
      });

      expect(result).toContain('File written successfully');
      expect(fs.existsSync(downloadFilename)).toBe(true);

      downloadedFile = downloadFilename;
    });

    test('rejects download if file already exists', async () => {
      const downloadFilename = `test-download-exists-${Date.now()}.jsonl`;
      const downloadPath = path.resolve(__dirname, downloadFilename);

      await writeFile(downloadPath, 'existing content');

      // Try to download
      await expect(
        batchInferenceService.files.download({
          projectId,
          fileId,
          filename: downloadFilename,
          path: __dirname,
        })
      ).rejects.toThrow('File already exists');

      downloadedFile = downloadPath;
    });

    test('rejects download if filename does not end with .jsonl', async () => {
      await expect(
        batchInferenceService.files.download({
          projectId,
          fileId,
          filename: 'test-download.txt',
          path: __dirname,
        })
      ).rejects.toThrow('Downloaded files must be in jsonl format');
    });
  });

  describe('Error Handling with Real API', () => {
    test('handles invalid file ID when retrieving details', async () => {
      await expect(
        batchInferenceService.files.getDetails({
          projectId,
          fileId: 'invalid-file-id-12345',
        })
      ).rejects.toThrow();
    });

    test('handles invalid file ID when getting content', async () => {
      await expect(
        batchInferenceService.files.getContent({
          projectId,
          fileId: 'invalid-file-id-12345',
        })
      ).rejects.toThrow();
    });

    test('handles invalid file ID when downloading', async () => {
      await expect(
        batchInferenceService.files.download({
          projectId,
          fileId: 'invalid-file-id-12345',
          filename: 'test.jsonl',
        })
      ).rejects.toThrow();
    });

    test('handles missing file parameter on upload', async () => {
      await expect(
        batchInferenceService.files.upload({
          projectId,
        } as any)
      ).rejects.toThrow();
    });

    test('handles non-existent file path on upload', async () => {
      await expect(
        batchInferenceService.files.upload({
          projectId,
          file: '/path/to/non/existent/file.jsonl',
        })
      ).rejects.toThrow();
    });
  });
});
