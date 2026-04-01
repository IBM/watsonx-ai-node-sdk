import { access, unlink } from 'fs/promises';
import type { Response } from '../../../src/base';
import type { BatchInference } from '../../../src/batch_inference/batch_inference';

export const VALID_BATCH_STATUSES = [
  'validating',
  'in_progress',
  'finalizing',
  'completed',
  'failed',
  'expired',
  'cancelling',
  'cancelled',
] as const;
export const TEST_COMPLETION_WINDOW = '24h' as const;
export const TEST_ENDPOINT = '/v1/chat/completions' as const;

export const verifyResponse = <T extends { id?: string }>(
  response: Response<T>,
  code: number = 200
): T => {
  expect(response.status).toBe(code);
  expect(response.result).toBeDefined();
  expect(response.result.id).toBeDefined();

  return response.result;
};

export const verifyBatchResponse = (response: Response<any>, expectedStatus?: number) => {
  const result = verifyResponse(response, expectedStatus);

  expect(result.status).toBeDefined();
  expect(VALID_BATCH_STATUSES).toContain(result.status);
  expect(result.input_file_id).toBeDefined();
  expect(result.endpoint).toBeDefined();

  return result;
};

export const createTestBatch = async (
  service: BatchInference,
  fileId: string,
  overrides: Partial<any> = {}
): Promise<string> => {
  const response = await service.create({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    inputFileId: fileId,
    completionWindow: TEST_COMPLETION_WINDOW,
    endpoint: TEST_ENDPOINT,
    ...overrides,
  });
  const batch = verifyBatchResponse(response);

  return batch.id;
};

export const uploadFile = async (service: BatchInference, file: string, projectId?: string) => {
  const response = await service.files.upload({
    projectId,
    file,
  });
  const fileId = response.result.id;
  if (!fileId) throw new Error(`Unable to upload file: ${file}`);
  return fileId;
};

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch (_error) {
    return false;
  }
};

export const removeLocalFile = async (file: string) => {
  if (await fileExists(file)) await unlink(file);
  else console.log(`File does not exist: ${file}`);
};
