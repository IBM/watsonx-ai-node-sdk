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

import { validateParams } from 'ibm-cloud-sdk-core';
import { GatewayResource } from './resources';
import { EmptyObject } from './types/gateway';
import { ListProviderAvailableModelsParams } from './types/models/request';
import {
  CreateProviderParams,
  DeleteProviderParams,
  GetProviderParams,
  ListProvidersParams,
  UpdateProviderParams,
} from './types/providers/request';
import {
  AvailableModel,
  AvailableModelCollection,
  Provider,
  ProviderCollection,
  ProviderResponse,
} from './types/providers/response';
import { Response } from '../base/types/base';

/**
 * Class representing the Providers resource.
 * This class provides methods to interact with ML Gateway providers.
 */
export class Providers extends GatewayResource {
  /**
   * @param {CreateProviderParams} params - The parameters to send to the service.
   * @param {string} params.providerName - Name of the selected provider. Allowed names: watsonxai, anthropic, openai, nim, azure-openai, bedrock, cerebas
   * @param {string} params.name - Name can only contain alphanumeric characters, single spaces (no consecutive spaces),
   * hyphens (-), parentheses (), and square brackets []. No leading or trailing spaces are allowed.
   * @param {Object} params.dataReference - Data Reference is a reference to a remote credential store. For example, an IBM Cloud Secrets Manager secret.
   * The Value in the remote store is expected to be a JSON representation of the Data field.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<ProviderResponse>> } Resolves with the response from the server.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  create(params: CreateProviderParams): Promise<Response<ProviderResponse>> {
    const requiredParams = ['name', 'providerName', 'dataReference'];
    const validParams = [
      'dataReference',
      'name',
      'providerName',
      'description',
      'signal',
      'headers',
    ];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { providerName, dataReference, name, signal, headers } = params;

    const path = {
      'provider_name': providerName,
    };
    const body = {
      name,
      data_reference: dataReference,
    };

    const parameters = {
      url: '/ml/gateway/v1/providers/{provider_name}',
      body,
      path,
      signal,
      headers,
    };
    return this.client._post<ProviderResponse>(parameters);
  }

  /**
   * Get Provider's details by id.
   *
   * Retrieves the details of a specific provider.
   *
   * @param {GetProviderParams | ListProvidersParams} params - The parameters to send to the service.
   * @param {string} params.providerId - Provider id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Provider | ProviderCollection>>} Resolves with the response from the server.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  getDetails(params: GetProviderParams): Promise<Response<Provider>>;
  getDetails(params: ListProvidersParams): Promise<Response<ProviderCollection>>;

  getDetails(
    params: GetProviderParams | ListProvidersParams = {}
  ): Promise<Response<Provider | ProviderCollection>> {
    if ('providerId' in params) {
      const requiredParams = ['providerId'];
      const validParams = ['providerId', 'signal', 'headers'];
      const validationErrors = validateParams(params, requiredParams, validParams);
      if (validationErrors) {
        return Promise.reject(validationErrors);
      }

      const { providerId, signal, headers } = params;
      const path = {
        'provider_id': providerId,
      };

      const parameters = {
        url: '/ml/gateway/v1/providers/{provider_id}',
        path,
        signal,
        headers,
      };

      return this.client._get<Provider>(parameters);
    }
    const requiredParams: string[] = [];
    const validParams = ['signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { signal, headers } = params;
    const parameters = {
      url: '/ml/gateway/v1/providers',
      signal,
      headers,
    };
    return this.client._get<ProviderCollection>(parameters);
  }

  /**
   * Get available models' details.
   *
   * Get all models available for the specified provider.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.providerId - Provider id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<AvailableModelCollection>>} Resolves with the list of available models' details.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  getAvailableModelsDetails(
    params: ListProviderAvailableModelsParams
  ): Promise<Response<AvailableModelCollection>> {
    const requiredParams = ['providerId'];
    const validParams = ['providerId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const { signal, headers, providerId } = params;

    const path = {
      'provider_id': providerId,
    };

    const parameters = {
      url: '/ml/gateway/v1/providers/{provider_id}/models/available',
      path,
      signal,
      headers,
    };

    return this.client._get<AvailableModelCollection>(parameters);
  }

  /**
   * Update provider
   *
   * Updates an existing provider.
   *
   * @param {UpdateProviderParams} params - The parameters to send to the service.
   * @param {string} params.providerName - Name of the selected provider. Allowed names: watsonxai, anthropic, openai, nim, azure-openai, bedrock, cerebas
   * @param {string} params.providerId - Id of selected provider to be updated
   * @param {Object} params.dataReference - Data Reference is a reference to a remote credential store. For example, an IBM Cloud Secrets Manager secret.
   * The Value in the remote store is expected to be a JSON representation of the Data field.
   * @param {string} params.name - Name can only contain alphanumeric characters, single spaces (no consecutive spaces),
   * hyphens (-), parentheses (), and square brackets []. No leading or trailing spaces are allowed.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<ProviderResponse>> } Resolves with the response from the server.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  update(params: UpdateProviderParams): Promise<Response<ProviderResponse>> {
    const requiredParams = ['providerId', 'providerName', 'dataReference', 'name'];
    const validParams = [
      'providerId',
      'providerName',
      'dataReference',
      'name',
      'signal',
      'headers',
    ];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { name, providerName, providerId, dataReference, signal, headers } = params;
    const body = {
      'name': name,
      'data_reference': dataReference,
    };

    const path = {
      'provider_id': providerId,
      'provider_name': providerName,
    };

    const parameters = {
      url: '/ml/gateway/v1/providers/{provider_id}/{provider_name}',
      body,
      path,
      signal,
      headers,
    };

    return this.client._put<ProviderResponse>(parameters);
  }

  /**
   * Delete Provider.
   *
   * Deletes the specified provider.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.providerId - Provider id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<EmptyObject>} Resolves with an empty object on success.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  delete(params: DeleteProviderParams): Promise<Response<EmptyObject>> {
    const requiredParams = ['providerId'];
    const validParams = ['providerId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const { providerId, signal, headers } = params;

    const path = {
      'provider_id': providerId,
    };

    const parameters = {
      url: '/ml/gateway/v1/providers/{provider_id}',
      path,
      signal,
      headers,
    };
    return this.client._delete<EmptyObject>(parameters);
  }

  /**
   * List all providers or a specific provider by ID.
   * @param [params] - Parameters for listing providers or getting a specific provider.
   * @param {string} [params.providerId] - Provider id.
   * @returns {Promise<Provider[]>} Resolves with the list of providers or a single provider.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  async list(params: ListProvidersParams = {}): Promise<Provider[]> {
    const requiredParams: string[] = [];
    const validParams = ['providerId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const response = await this.getDetails(params);
    return response.result.data;
  }

  /**
   * List available models for a provider.
   * @param params - Parameters for listing available models.
   * @param {string} params.providerId - Provider id.
   * @returns {Promise<AvailableModel[]>} Resolves with the list of available models.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  async listAvailableModels(params: ListProviderAvailableModelsParams): Promise<AvailableModel[]> {
    const response = await this.getAvailableModelsDetails(params);
    return response.result.data;
  }
}
