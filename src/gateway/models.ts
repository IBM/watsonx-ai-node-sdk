/**
 * (C) Copyright IBM Corp. 2025.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import { validateParams } from 'ibm-cloud-sdk-core';
import {
  CreateModelParams,
  DeleteModelParams,
  GetModelParams,
  ListAllModelsParams,
  ListProviderModelsParams,
} from './types/models/request';
import { EmptyObject } from './types/gateway';
import { Model, ModelCollection } from './types/models/response';
import { GatewayResource } from './resources';
import { Response } from '../base/types/base';

/**
 * Models class for handling model-related operations.
 */
export class Models extends GatewayResource {
  /**
   * Add Model.
   *
   * Adds a new model configuration for the specified provider.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.providerId - Provider ID.
   * @param {string} params.modelId - The official provider-specific server-side unique identifier of the model instance.
   * @param {string} [params.alias] - The aliased name of the model. If set, this is the name that should be used by
   * clients to refer to that model in a more convenient or custom manner. When a client provides the alias instead of
   * the official name, the middleware will map the alias back to the underlying `id` (e.g., `"gpt-o"`) and execute
   * requests against the correct model.
   * @param {Metadata} [params.metadata] - Contains additional configuration for the model.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Model>>} - A promise that resolves with the created model.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  create(params: CreateModelParams): Promise<Response<Model>> {
    const requiredParams = ['providerId', 'modelId'];
    const validParams = ['providerId', 'modelId', 'alias', 'metadata', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const body = {
      'id': params.modelId,
      'alias': params.alias,
      'metadata': params.metadata,
    };

    const path = {
      'provider_id': params.providerId,
    };

    const parameters = {
      url: '/ml/gateway/v1/providers/{provider_id}/models',
      body,
      path,
      signal: params.signal,
      headers: params.headers,
    };
    return this.client._post<Model>(parameters);
  }

  /**
   * Get a Model.
   *
   * Retrieves a specific model configuration or muliple models configurations by model id or provider id.
   *
   * @param {GetModelParams | ListProviderModelsParams | ListAllModelsParams} params - The parameters to send to the service.
   * @param {string} params.modelId - Model id.
   * @param {string} [params.providerId] - Provider id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Model | ModelCollection>>} - A promise that resolves with the model details or collection.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  getDetails(params: GetModelParams): Promise<Response<Model>>;
  getDetails(
    params?: ListProviderModelsParams | ListAllModelsParams
  ): Promise<Response<ModelCollection>>;
  getDetails(
    params: GetModelParams | ListProviderModelsParams | ListAllModelsParams = {}
  ): Promise<Response<Model | ModelCollection>> {
    if ('modelId' in params) {
      const { modelId, signal, headers } = params;
      const requiredParams = ['modelId'];
      const validParams = ['modelId', 'signal', 'headers'];
      const validationErrors = validateParams(params, requiredParams, validParams);
      if (validationErrors) {
        return Promise.reject(validationErrors);
      }

      const path = {
        'model_id': modelId,
      };

      const parameters = {
        url: '/ml/gateway/v1/models/{model_id}',
        path,
        signal,
        headers,
      };
      return this.client._get<Model>(parameters);
    }
    if ('providerId' in params) {
      const { providerId, signal, headers } = params;
      const requiredParams = ['providerId'];
      const validParams = ['providerId', 'signal', 'headers'];
      const validationErrors = validateParams(params, requiredParams, validParams);
      if (validationErrors) {
        return Promise.reject(validationErrors);
      }

      const path = {
        'provider_id': providerId,
      };

      const parameters = {
        url: '/ml/gateway/v1/providers/{provider_id}/models',
        path,
        signal,
        headers,
      };
      return this.client._get<ModelCollection>(parameters);
    }
    const { signal, headers } = params;
    const requiredParams: string[] = [];
    const validParams = ['signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const parameters = {
      url: '/ml/gateway/v1/models',
      signal,
      headers,
    };
    return this.client._get<ModelCollection>(parameters);
  }

  /**
   * List all models or models for a specific provider.
   *
   * @param {ListAllModelsParams} [params] - Parameters for listing all models or models for a provider.
   * @param {string} [params.providerId] - Provider id
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Model[]>} - A promise that resolves with the list of models.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  async list(params: ListAllModelsParams = {}): Promise<Model[]> {
    if (params.providerId) {
      const parameters = { ...params, providerId: params.providerId };
      const response = await this.getDetails(parameters);
      return response.result.data;
    }
    const response = await this.getDetails();
    return response.result.data;
  }

  /**
   * Delete Model.
   *
   * Removes a specific model configuration from the tenant by id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - Model id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  delete(params: DeleteModelParams): Promise<EmptyObject> {
    const requiredParams = ['modelId'];
    const validParams = ['modelId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const { modelId, signal, headers } = params;
    const path = {
      'model_id': modelId,
    };

    const parameters = {
      url: '/ml/gateway/v1/models/{model_id}',
      method: 'DELETE',
      path,
      signal,
      headers,
    };

    return this.client._delete<EmptyObject>(parameters);
  }
}
