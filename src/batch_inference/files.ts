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

import fs, { constants } from 'fs';
import { access, writeFile } from 'fs/promises';
import { Readable } from 'stream';
import FormData from 'form-data';
import { validateRequestParams, validateRequiredOneOf } from '../helpers/validators';
import type { BatchInference } from './batch_inference';
import type {
  DownloadFileContentParams,
  GetFileContentParams,
  ListFilesParams,
  UploadBatchFileParams,
  UploadedFile,
  UploadedFileCollection,
} from './types';
import { ENDPOINTS } from '../config';
import type { Response } from '../base';

/**
 * Helper function to validate file operation request parameters.
 *
 * This function performs two levels of validation:
 *
 * 1. Ensures that exactly one of 'projectId' or 'spaceId' is provided (required one-of validation)
 * 2. Validates that all required parameters are present and all provided parameters are valid
 *
 * Use this function before making file API calls to ensure the request parameters meet the API
 * requirements and prevent invalid requests from being sent.
 *
 * @param params - The parameters object to validate (typically the request parameters)
 * @param requiredParams - Array of required parameter names that must be present in params
 * @param validParams - Array of all valid parameter names that are allowed in params
 * @throws {Error} If validation fails - either missing required one-of fields, missing required
 *   params, or invalid params present
 */
function validateFilesParams(
  params: Record<string, any>,
  requiredParams: string[],
  validParams: string[]
): void {
  validateRequiredOneOf(params, ['projectId', 'spaceId']);
  const validationErrors = validateRequestParams(params, requiredParams, validParams);
  if (validationErrors) throw validationErrors;
}

/**
 * Class for managing files used in batch inference operations.
 *
 * Provides methods to upload, retrieve, list, download, and manage files associated with batch
 * inference jobs.
 */
export class Files {
  /**
   * Creates an instance of Files.
   *
   * @param {BatchInference} client - The BatchInference client instance.
   */
  constructor(public client: BatchInference) {}

  /**
   * Upload a file for batch inference.
   *
   * Uploads a JSONL file containing batch requests. The file will be used as input for batch
   * inference jobs.
   *
   * @param {UploadBatchFileParams} params - The parameters to send to the service.
   * @param {string | ReadableStream | Blob} params.file - JSONL file containing batch requests.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<UploadedFile>>} A promise that resolves to the response with
   *   uploaded file data
   */
  async upload(params: UploadBatchFileParams): Promise<Response<UploadedFile>> {
    validateFilesParams(params, ['file'], ['projectId', 'spaceId']);

    const { file, projectId, spaceId, signal } = params;

    // Validate file parameter
    if (typeof file === 'string') {
      try {
        await access(file, constants.R_OK);
      } catch {
        throw new Error(`File path does not exist or is not readable: ${file}`);
      }
    }

    const form = new FormData();

    if (typeof file === 'string') {
      form.append('file', fs.createReadStream(file));
    } else if (file instanceof ReadableStream) {
      const nodeStream = Readable.fromWeb(file);
      form.append('file', nodeStream);
    } else {
      form.append('file', file);
    }
    form.append('purpose', 'batch');

    const headers = { ...form.getHeaders(), ...params.headers };
    const parameters = {
      url: ENDPOINTS.FILES.BASE,
      headers,
      signal,
      body: form,
      projectId,
      spaceId,
    };

    return this.client._post(parameters);
  }

  /**
   * Retrieve file details or list all files.
   *
   * When called with `fileId`, retrieves details of a specific file. When called without `fileId`,
   * retrieves a list of all files.
   *
   * @param {ListFilesParams | GetFileContentParams} params - The parameters to send to the service.
   * @param {string} [params.fileId] - The ID of the file to retrieve.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {string} [params.after] - A cursor for pagination. Use the last file ID from the
   *   previous response to retrieve the next page.
   * @param {number} [params.limit] - Maximum number of files to return. Must be between 1 and
   *   10,000.
   * @param {string} [params.purpose] - Filter files by purpose.
   * @param {string} [params.order] - Order of results. Options are "asc" or "desc".
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<UploadedFile | UploadedFileCollection>>} A promise that resolves to
   *   either a single file or a collection of files
   */
  async getDetails(params: ListFilesParams): Promise<Response<UploadedFileCollection>>;
  async getDetails(params: GetFileContentParams): Promise<Response<UploadedFile>>;
  async getDetails(
    params: ListFilesParams | GetFileContentParams
  ): Promise<Response<UploadedFileCollection | UploadedFile>> {
    if (params && 'fileId' in params) {
      validateFilesParams(params, ['fileId'], ['projectId', 'spaceId']);

      const { fileId, projectId, spaceId } = params;
      const parameters = {
        url: ENDPOINTS.FILES.BY_ID,
        headers: params.headers,
        signal: params.signal,
        path: { 'file_id': fileId },
        projectId,
        spaceId,
      };

      return this.client._get(parameters);
    }

    validateFilesParams(params, [], ['projectId', 'spaceId', 'after', 'limit', 'purpose', 'order']);

    const { projectId, spaceId, after, limit, purpose = 'batch', order, signal } = params;

    const headers = {
      Accept: 'application/json',
      ...params.headers,
    };
    const query = { after, limit, purpose, order };
    const parameters = {
      url: ENDPOINTS.FILES.BASE,
      headers,
      signal,
      query,
      projectId,
      spaceId,
    };

    return this.client._get(parameters);
  }

  /**
   * Retrieve file content.
   *
   * Retrieves the content of a specific file by its ID.
   *
   * @param {GetFileContentParams} params - The parameters to send to the service.
   * @param {string} params.fileId - The ID of the file to retrieve.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<string>>} A promise that resolves to the response with file content
   */
  async getContent(params: GetFileContentParams): Promise<Response<string>> {
    validateFilesParams(params, ['fileId'], ['projectId', 'spaceId']);

    const { fileId, projectId, spaceId } = params;
    const parameters = {
      url: ENDPOINTS.FILES.CONTENT_BY_ID,
      headers: params.headers,
      signal: params.signal,
      path: { 'file_id': fileId },
      projectId,
      spaceId,
    };

    return this.client._get(parameters);
  }

  /**
   * Check if a file exists at the specified path.
   *
   * @private
   * @param {string} path - The file path to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the file exists, false otherwise
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Download file content to local filesystem.
   *
   * Downloads the content of a file and saves it to the local filesystem. The file must be in JSONL
   * format.
   *
   * @param {DownloadFileContentParams} params - The parameters to send to the service.
   * @param {string} params.filename - Name of the file to save. Must end with `.jsonl`.
   * @param {string} [params.path] - Directory path where the file should be saved.
   * @param {string} [params.fileId] - The ID of the file to download.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<string>} A promise that resolves to a success message with the file path
   * @throws {Error} If the file already exists or if the filename doesn't end with `.jsonl`
   */
  async download(params: DownloadFileContentParams): Promise<string> {
    validateFilesParams(params, ['filename'], ['projectId', 'spaceId', 'fileId', 'path']);

    const { filename, path, ...rest } = params;

    if (!filename.endsWith('.jsonl')) throw new Error('Downloaded files must be in jsonl format');

    const filenameWithPath = path ? `${path}/${filename}` : filename;
    const fileExistsError = new Error(`File already exists: ${filenameWithPath}`);

    if (await this.fileExists(filenameWithPath)) throw fileExistsError;

    const response = await this.getContent(rest);
    const content = response.result;

    try {
      await writeFile(filenameWithPath, content, { flag: 'wx' });
    } catch (err: any) {
      if (err.code === 'EEXIST') {
        throw fileExistsError;
      }
      throw err;
    }

    return `File written successfully to ${filenameWithPath}`;
  }

  /**
   * List all files.
   *
   * Retrieves a list of all files for the specified space or project.
   *
   * @param {ListFilesParams} params - The parameters to send to the service.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {string} [params.after] - A cursor for pagination. Use the last file ID from the
   *   previous response to retrieve the next page.
   * @param {number} [params.limit] - Maximum number of files to return. Must be between 1 and
   *   10,000.
   * @param {string} [params.purpose] - Filter files by purpose.
   * @param {string} [params.order] - Order of results. Options are "asc" or "desc".
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<UploadedFile[]>} A promise that resolves to an array of files
   */
  async list(params: ListFilesParams): Promise<UploadedFile[]> {
    validateFilesParams(params, [], ['projectId', 'spaceId', 'after', 'limit', 'purpose', 'order']);
    const response = await this.getDetails(params);
    return response.result.data;
  }
}
