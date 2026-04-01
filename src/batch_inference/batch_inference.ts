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

import type { UserOptions } from 'ibm-cloud-sdk-core';
import { NoAuthAuthenticator, readExternalSources } from 'ibm-cloud-sdk-core';
import { APIBaseService } from '../base';
import type {
  Batch,
  BatchCollection,
  CancelBatchParams,
  CreateBatchParams,
  GetBatchParams,
  ListAllBatchesParams,
} from './types';
import { validateRequestParams, validateRequiredOneOf } from '../helpers/validators';
import { ENDPOINTS } from '../config';
import type { GetParameters, PostParameters, Response } from '../base';
import { Files } from './files';
import type { Identifiers } from './types/request';

/**
 * Helper function to validate batch inference request parameters.
 *
 * This function performs two levels of validation:
 *
 * 1. Ensures that exactly one of 'projectId' or 'spaceId' is provided (required one-of validation)
 * 2. Validates that all required parameters are present and all provided parameters are valid
 *
 * Use this function before making batch inference API calls to ensure the request parameters meet
 * the API requirements and prevent invalid requests from being sent.
 *
 * @example
 *   ```typescript
 *   validateBatchParams(
 *     { projectId: 'abc123', modelId: 'model-1' },
 *     ['modelId'],
 *     ['projectId', 'spaceId', 'modelId', 'input']
 *   );
 *   ```;
 *
 * @param params - The parameters object to validate (typically the request parameters)
 * @param requiredParams - Array of required parameter names that must be present in params
 * @param validParams - Array of all valid parameter names that are allowed in params
 * @throws {Error} If validation fails - either missing required one-of fields, missing required
 *   params, or invalid params present
 */
function validateBatchParams(
  params: Record<string, any>,
  requiredParams: string[],
  validParams: string[]
): void {
  validateRequiredOneOf(params, ['projectId', 'spaceId']);
  const validationErrors = validateRequestParams(params, requiredParams, validParams);
  if (validationErrors) throw validationErrors;
}

/**
 * Service for managing batch inference operations in watsonx.ai.
 *
 * Provides methods to create, retrieve, list, and cancel batch inference jobs, as well as manage
 * associated files through the Files instance.
 */
export class BatchInference extends APIBaseService {
  #apikey: string;

  /** Files instance for managing batch inference files. */
  files: Files;

  /**
   * Constructs an instance of BatchInference with passed in options and external configuration.
   *
   * @category Constructor
   * @param {UserOptions} options - The parameters to send to the service.
   * @param {string} [options.apikey] - API key for authentication
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {string} [options.serviceUrl] - The base URL for the service
   */
  constructor(options: UserOptions) {
    options.authenticator = new NoAuthAuthenticator(); // batchInference supports different way of authentication, refer to api docs
    const optionsApiKey = options.apikey;
    delete options.apikey;
    super(options);

    const apikey = optionsApiKey ?? readExternalSources(options.serviceName).apikey;
    if (!apikey) throw new Error('API key is required.');
    this.#apikey = apikey;

    this.files = new Files(this);
  }

  _get<T>(params: GetParameters & Identifiers): Promise<Response<T>> {
    const { projectId, spaceId } = params;

    return super._get({
      ...params,
      headers: {
        ...params.headers,
        'authorization': `Bearer ${this.#apikey}`,
        ...(projectId ? { 'X-IBM-Project-ID': `${projectId}` } : {}),
        ...(spaceId ? { 'X-IBM-Space-ID': `${spaceId}` } : {}),
      },
    });
  }

  _post<T>(params: PostParameters & Identifiers): Promise<Response<T>> {
    const { projectId, spaceId } = params;

    return super._post({
      ...params,
      headers: {
        ...params.headers,
        'authorization': `Bearer ${this.#apikey}`,
        ...(projectId ? { 'X-IBM-Project-ID': `${projectId}` } : {}),
        ...(spaceId ? { 'X-IBM-Space-ID': `${spaceId}` } : {}),
      },
    });
  }

  /**
   * Create a new batch inference job.
   *
   * Creates a batch inference job with the specified input file, endpoint, and completion window.
   * The batch job will process requests from the input file and generate results.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.inputFileId - ID of the uploaded input file for the batch job.
   * @param {string} params.endpoint - API endpoint to use for processing each batch item.
   * @param {string} params.completionWindow - Time window for completion of the batch job.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {Record<string, string>} [params.metadata] - Additional metadata for the batch job.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Batch>>} A promise that resolves to the response with batch job data
   */
  async create(params: CreateBatchParams): Promise<Response<Batch>> {
    const requiredParams = ['inputFileId', 'endpoint', 'completionWindow'];
    const validParams = ['projectId', 'spaceId', 'metadata'];
    validateBatchParams(params, requiredParams, validParams);

    const { projectId, spaceId } = params;

    const body = {
      input_file_id: params.inputFileId,
      endpoint: params.endpoint,
      completion_window: params.completionWindow,
      metadata: params.metadata,
    };

    const headers = {
      ...params.headers,
    };

    const parameters = {
      url: ENDPOINTS.BATCH_INFERENCE.BASE,
      body,
      signal: params.signal,
      headers,
      projectId,
      spaceId,
    };

    return this._post(parameters);
  }
  /**
   * Retrieve batch job details or list all batch jobs.
   *
   * When called with `batchId`, retrieves details of a specific batch job. When called without
   * `batchId`, retrieves a list of all batch jobs.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} [params.batchId] - The ID of the batch job to retrieve.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {number} [params.limit] - Maximum number of batch jobs to return.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Batch | BatchCollection>>} A promise that resolves to either a
   *   single batch job or a collection of batch jobs
   */
  async getDetails(params: ListAllBatchesParams): Promise<Response<BatchCollection>>;
  async getDetails(params: GetBatchParams): Promise<Response<Batch>>;
  async getDetails(
    params: ListAllBatchesParams | GetBatchParams
  ): Promise<Response<Batch | BatchCollection>> {
    if ('batchId' in params) {
      const requiredParams = ['batchId'];
      const validParams = ['projectId', 'spaceId'];
      validateBatchParams(params, requiredParams, validParams);

      const { batchId, projectId, spaceId } = params;
      const headers = {
        ...params.headers,
      };
      const parameters = {
        url: ENDPOINTS.BATCH_INFERENCE.BY_ID,
        path: { batch_id: batchId },
        signal: params.signal,
        headers,
        projectId,
        spaceId,
      };
      return this._get(parameters);
    }

    const requiredParams: string[] = [];
    const validParams = ['projectId', 'spaceId', 'limit'];
    validateBatchParams(params, requiredParams, validParams);

    const { limit, projectId, spaceId } = params;
    const headers = {
      ...params.headers,
    };
    const parameters = {
      url: ENDPOINTS.BATCH_INFERENCE.BASE,
      query: { limit },
      signal: params.signal,
      headers,
      projectId,
      spaceId,
    };
    return this._get(parameters);
  }

  /**
   * List all batch jobs.
   *
   * Retrieves a list of all batch jobs for the specified space or project.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {number} [params.limit] - Maximum number of batch jobs to return.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Batch[]>} A promise that resolves to an array of batch jobs
   */
  async list(params: ListAllBatchesParams): Promise<Batch[]> {
    const response = await this.getDetails(params);
    return response.result.data;
  }

  /**
   * Cancel a batch inference job.
   *
   * Cancels a batch inference job that is in progress. Once cancelled, the job cannot be resumed.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.batchId - The ID of the batch job to cancel.
   * @param {string} [params.projectId] - The project that contains the resource. Either `projectId`
   *   or `spaceId` has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `spaceId` or
   *   `projectId` has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Batch>>} A promise that resolves to the response with cancelled
   *   batch job data
   */
  async cancel(params: CancelBatchParams): Promise<Response<Batch>> {
    const requiredParams = ['batchId'];
    const validParams = ['projectId', 'spaceId'];
    validateBatchParams(params, requiredParams, validParams);

    const { batchId, projectId, spaceId } = params;
    const headers = {
      ...params.headers,
    };

    const parameters = {
      url: ENDPOINTS.BATCH_INFERENCE.CANCEL_BY_ID,
      path: { batch_id: batchId },
      signal: params.signal,
      headers,
      projectId,
      spaceId,
    };

    return this._post(parameters);
  }
}
