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
import { ReadableStream } from 'stream/web';
import { BatchInference } from '../../../src/batch_inference/batch_inference';
import { Files } from '../../../src/batch_inference/files';
import { checkAxiosOptions } from '../utils/checks';
import fs, { constants } from 'fs';
import { writeFile, access } from 'fs/promises';
import {
  getDefaultHeadersFromMock,
  testRequiredParams,
  testInvalidParams,
  testWithRetries,
  testAsyncWithRetries,
} from '../../utils/utils';
import type { MethodTestSpec } from '../utils/helpers';
import { describeMethod } from '../utils/helpers';

const { getOptions, checkUrlAndMethod, expectToBePromise } = unitTestUtils;

// ─── Service Setup ────────────────────────────────────────────────────────────

const SERVICE_URL = 'https://us-south.ml.cloud.ibm.com';
const API_KEY = 'test-api-key';
const VERSION = '2020-04-01';

const serviceOptions = {
  authenticator: new NoAuthAuthenticator(),
  serviceUrl: SERVICE_URL,
  apikey: API_KEY,
  version: VERSION,
};

const batchInferenceService = new BatchInference(serviceOptions);
const filesService = batchInferenceService.files;

// ─── Mock Setup ───────────────────────────────────────────────────────────────

let createRequestMock: jest.SpyInstance;

function getRequestMock(): jest.SpyInstance {
  return createRequestMock;
}

// Mock fs module
jest.mock('fs');
jest.mock('fs/promises');

// ─── Shared Test Fixtures ─────────────────────────────────────────────────────

const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
const FILE_ID = 'file_abc123';
const FILE_PATH = '/path/to/file.jsonl';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

// Helper wrapper to use the shared describeMethod with local context
function describeFilesMethod(name: string, spec: MethodTestSpec) {
  describeMethod(name, spec, batchInferenceService, getRequestMock, API_KEY);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Files', () => {
  beforeAll(() => {
    createRequestMock = jest.spyOn(BaseService.prototype, 'createRequest' as keyof BaseService);
  });

  beforeEach(() => {
    createRequestMock.mockImplementation(() => Promise.resolve({ result: {} }));
  });

  afterEach(() => {
    createRequestMock.mockReset();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('initializes with BatchInference client', () => {
      expect(filesService).toBeInstanceOf(Files);
      expect(filesService.client).toBe(batchInferenceService);
    });
  });

  describe('upload', () => {
    test('uploads file from string path', async () => {
      const mockStream = {
        pipe: jest.fn(),
        on: jest.fn().mockReturnThis(),
        once: jest.fn().mockReturnThis(),
        emit: jest.fn(),
        pause: jest.fn(),
      };
      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      // Mock access to simulate file exists and is readable
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockImplementation(() => Promise.resolve());

      const runCheck = async () => {
        const { signal } = new AbortController();
        const result = filesService.upload({
          file: FILE_PATH,
          projectId: PROJECT_ID,
          signal,
        });
        expectToBePromise(result);
        await result;
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(getRequestMock());
        checkUrlAndMethod(mockRequestOptions, '/ml/v1/files', 'POST');
        checkAxiosOptions(getRequestMock(), signal);

        // Verify authentication headers
        const requestHeaders = getDefaultHeadersFromMock(getRequestMock());
        expect(requestHeaders).toHaveProperty('authorization', `Bearer ${API_KEY}`);
        expect(requestHeaders).toHaveProperty('X-IBM-Project-ID', PROJECT_ID);
      };

      testAsyncWithRetries(runCheck, batchInferenceService, createRequestMock);
    });

    test('uploads file from ReadableStream', () => {
      const runCheck = () => {
        // Create a new ReadableStream for each test run to avoid "locked" errors
        const mockStream = new ReadableStream();

        const { signal } = new AbortController();
        const result = filesService.upload({
          file: mockStream,
          projectId: PROJECT_ID,
          signal,
        });
        expectToBePromise(result);
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(getRequestMock());
        checkUrlAndMethod(mockRequestOptions, '/ml/v1/files', 'POST');
        checkAxiosOptions(getRequestMock(), signal);
      };

      testWithRetries(runCheck, batchInferenceService, createRequestMock);
    });

    describe('negative tests', () => {
      testRequiredParams((p) => filesService.upload(p));
      testInvalidParams((p) => filesService.upload(p), { projectId: PROJECT_ID });
    });
  });

  describe('getDetails', () => {
    describeFilesMethod('with fileId', {
      method: (p) => filesService.getDetails(p),
      callParams: {
        fileId: FILE_ID,
        projectId: PROJECT_ID,
      },
      minParams: {
        fileId: FILE_ID,
        projectId: PROJECT_ID,
      },
      url: '/ml/v1/files/{file_id}',
      httpMethod: 'GET',
      headers: { Accept: undefined },
      expectedPath: {
        file_id: FILE_ID,
      },
      noRequiredParams: true,
    });

    describeFilesMethod('without fileId (list all)', {
      method: (p) => filesService.getDetails(p),
      callParams: {
        projectId: PROJECT_ID,
        limit: 10,
        after: 'file_xyz',
        purpose: 'batch' as const,
        order: 'desc' as const,
      },
      minParams: {
        projectId: PROJECT_ID,
      },
      url: '/ml/v1/files',
      httpMethod: 'GET',
      headers: { Accept: 'application/json' },
      expectedQs: {
        limit: 10,
        after: 'file_xyz',
        purpose: 'batch',
        order: 'desc',
      },
      noRequiredParams: true,
    });
  });

  describeFilesMethod('getContent', {
    method: (p) => filesService.getContent(p),
    callParams: {
      fileId: FILE_ID,
      projectId: PROJECT_ID,
    },
    minParams: {
      fileId: FILE_ID,
      projectId: PROJECT_ID,
    },
    url: '/ml/v1/files/{file_id}/content',
    httpMethod: 'GET',
    headers: { Accept: undefined },
    expectedPath: {
      file_id: FILE_ID,
    },
  });

  describe('download', () => {
    const mockFileContent =
      '{"custom_id":"request-1","method":"POST","url":"/v1/chat/completions"}';

    beforeEach(() => {
      createRequestMock.mockResolvedValue({
        result: mockFileContent,
      });
    });

    test('downloads file successfully when file does not exist', async () => {
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const result = await filesService.download({
        fileId: FILE_ID,
        filename: 'output.jsonl',
        projectId: PROJECT_ID,
      });

      expect(result).toBe('File written successfully to output.jsonl');
      expect(createRequestMock).toHaveBeenCalledTimes(1);
      expect(mockAccess).toHaveBeenCalledWith('output.jsonl', constants.F_OK);
    });

    test('downloads file to specified path when file does not exist', async () => {
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const result = await filesService.download({
        fileId: FILE_ID,
        filename: 'output.jsonl',
        path: '/tmp',
        projectId: PROJECT_ID,
      });

      expect(result).toBe('File written successfully to /tmp/output.jsonl');
      expect(mockAccess).toHaveBeenCalledWith('/tmp/output.jsonl', constants.F_OK);
    });

    test('throws error if file already exists (via fileExists check)', async () => {
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockResolvedValue(undefined);

      await expect(
        filesService.download({
          fileId: FILE_ID,
          filename: 'output.jsonl',
          projectId: PROJECT_ID,
        })
      ).rejects.toThrow('File already exists: output.jsonl');

      expect(mockAccess).toHaveBeenCalledWith('output.jsonl', constants.F_OK);
    });

    test('throws error if file is created between fileExists check and writeFile (race condition)', async () => {
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
      const eexistError = Object.assign(new Error('EEXIST: file already exists'), {
        code: 'EEXIST',
      });
      mockWriteFile.mockRejectedValue(eexistError);

      await expect(
        filesService.download({
          fileId: FILE_ID,
          filename: 'output.jsonl',
          projectId: PROJECT_ID,
        })
      ).rejects.toThrow('File already exists: output.jsonl');

      expect(mockAccess).toHaveBeenCalledWith('output.jsonl', constants.F_OK);
      expect(mockWriteFile).toHaveBeenCalled();
    });

    test('throws original error if writeFile fails with non-EEXIST error', async () => {
      const mockAccess = access as jest.MockedFunction<typeof access>;
      mockAccess.mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
      const permissionError = Object.assign(new Error('EACCES: permission denied'), {
        code: 'EACCES',
      });
      mockWriteFile.mockRejectedValue(permissionError);

      await expect(
        filesService.download({
          fileId: FILE_ID,
          filename: 'output.jsonl',
          projectId: PROJECT_ID,
        })
      ).rejects.toThrow('EACCES: permission denied');

      expect(mockAccess).toHaveBeenCalledWith('output.jsonl', constants.F_OK);
      expect(mockWriteFile).toHaveBeenCalled();
    });

    test('throws error if filename does not end with .jsonl', async () => {
      await expect(
        filesService.download({
          fileId: FILE_ID,
          filename: 'output.txt',
          projectId: PROJECT_ID,
        })
      ).rejects.toThrow('Downloaded files must be in jsonl format');
    });

    describe('negative tests', () => {
      testRequiredParams((p) => filesService.download(p));
      testInvalidParams((p) => filesService.download(p), { projectId: PROJECT_ID });
    });
  });

  describe('list', () => {
    test('returns array of files', async () => {
      const mockFiles = [
        { id: 'file_1', filename: 'input1.jsonl', purpose: 'batch' },
        { id: 'file_2', filename: 'input2.jsonl', purpose: 'batch' },
      ];
      createRequestMock.mockResolvedValue({
        result: { data: mockFiles },
      });

      const result = await filesService.list({ projectId: PROJECT_ID, limit: 10 });
      expect(result).toEqual(mockFiles);
      expect(createRequestMock).toHaveBeenCalledTimes(1);
    });
  });
});

// Made with Bob
