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
import {
  CreateRateLimitParams,
  DeleteRateLimitParams,
  GetRateLimitParams,
  ListRateLimitsParams,
  UpdateRateLimitParams,
} from './types/ratelimit/request';
import { ListRateLimitResponse } from './types/ratelimit/response';
import { EmptyObject } from './types';
import { Response } from '../base';

/**
 * Validates that the required ID parameters are provided based on the rate limit type.
 *
 * @param {Object} params - The validation parameters.
 * @param {string} params.type - The type of rate limit: "tenant", "provider", or "model".
 * @param {string} [params.providerId] - The UUID of the provider (required when type is "provider").
 * @param {string} [params.modelId] - The UUID of the model (required when type is "model").
 * @returns {Error | undefined} Returns an Error object with a descriptive message if validation fails, or undefined if validation passes.
 *
 */
function validateIdForType({
  type,
  providerId,
  modelId,
}: {
  type: string;
  providerId?: string;
  modelId?: string;
}) {
  if (type === 'model' && !modelId)
    return new Error(
      "Parameter validation errors: Missing parameter `modelId` for `type: 'model'`"
    );
  if (type === 'provider' && !providerId)
    return new Error(
      "Parameter validation errors: Missing parameter `providerId` for `type: 'provider'`"
    );
  return undefined;
}

/**
 * Class representing the RateLimits resource.
 * This class provides methods to manage rate limit configurations for the ML Gateway.
 */
export class RateLimits extends GatewayResource {
  /**
   * Create Rate Limit.
   *
   * Creates a new rate limit configuration for tenant, provider, or model level.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.type - The type of rate limit: "tenant", "provider", or "model".
   * @param {string} [params.providerId] - The UUID of the provider this rate limit applies to (required when type is "provider").
   * @param {string} [params.modelId] - The UUID of the model this rate limit applies to (required when type is "model").
   * @param {RateLimitItem} [params.token] - Token rate limiting settings.
   * @param {RateLimitItem} [params.request] - Request rate limiting settings.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Record<string, any>>>} - A promise that resolves with the created rate limit configuration.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  create(params: CreateRateLimitParams): Promise<Response<Record<string, any>>> {
    const requiredParams = ['type'];
    const validParams = ['type', 'providerId', 'modelId', 'token', 'request', 'signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { type, providerId, modelId, token, request, signal, headers } = params;

    const idValidationErrors = validateIdForType({ type, providerId, modelId });

    if (idValidationErrors) {
      return Promise.reject(idValidationErrors);
    }

    const body = { type, providerId, modelId, token, request };

    const parameters = {
      url: '/ml/gateway/v1/rate-limits',
      body,
      signal,
      headers,
    };
    return this.client._post<Record<string, any>>(parameters);
  }

  /**
   * Update Rate Limit.
   *
   * Updates an existing rate limit configuration.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.type - The type of rate limit: "tenant", "provider", or "model".
   * @param {string} [params.providerId] - The UUID of the provider this rate limit applies to (required when type is "provider").
   * @param {string} [params.modelId] - The UUID of the model this rate limit applies to (required when type is "model").
   * @param {RateLimitItem} [params.token] - Token rate limiting settings.
   * @param {RateLimitItem} [params.request] - Request rate limiting settings.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Record<string, any>>>} - A promise that resolves with the updated rate limit configuration.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  update(params: UpdateRateLimitParams): Promise<Response<Record<string, any>>> {
    const requiredParams = ['type'];
    const validParams = ['type', 'providerId', 'modelId', 'token', 'request', 'signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { type, providerId, modelId, rateLimitId, token, request, signal, headers } = params;

    const idValidationErrors = validateIdForType({ type, providerId, modelId });

    if (idValidationErrors) {
      return Promise.reject(idValidationErrors);
    }

    const path = { 'rate_limit_id': rateLimitId };

    const body = { type, 'provider_uuid': providerId, 'model_uuid': modelId, token, request };

    const parameters = {
      url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
      body,
      path,
      signal,
      headers,
    };
    return this.client._put<Record<string, any>>(parameters);
  }

  /**
   * Get Rate Limit Details.
   *
   * Retrieves details of a specific rate limit configuration by UUID, or lists all rate limit configurations.
   *
   * @param {GetRateLimitParams | ListRateLimitsParams} [params] - The parameters to send to the service.
   * @param {string} [params.rateLimitId] - The UUID of the rate limit configuration to retrieve. If not provided, lists all rate limits.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<Record<string, any> | ListRateLimitResponse>>} - A promise that resolves with the rate limit details or list.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  getDetails(params?: ListRateLimitsParams): Promise<Response<ListRateLimitResponse>>;
  getDetails(params: GetRateLimitParams): Promise<Response<Record<string, any>>>;
  getDetails(
    params: GetRateLimitParams = {}
  ): Promise<Response<Record<string, any> | ListRateLimitResponse>> {
    const requiredParams: string[] = [];
    const validParams = ['rateLimitId', 'signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { rateLimitId, signal, headers } = params;
    if (rateLimitId) {
      const path = { 'rate_limit_id': rateLimitId };

      const parameters = {
        url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
        path,
        signal,
        headers,
      };
      return this.client._get<Record<string, any>>(parameters);
    }
    const parameters = {
      url: '/ml/gateway/v1/rate-limits',
      signal,
      headers,
    };
    return this.client._get<ListRateLimitResponse>(parameters);
  }

  /**
   * List Rate Limits.
   *
   * Retrieves a list of all rate limit configurations.
   *
   * @param {ListRateLimitsParams} [params] - The parameters to send to the service.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Record<string, any>[]>} - A promise that resolves with an array of rate limit configurations.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  async list(params: ListRateLimitsParams = {}): Promise<Record<string, any>[]> {
    const requiredParams: string[] = [];
    const validParams = ['signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const response = await this.getDetails(params);
    return response.result.data;
  }

  /**
   * Delete Rate Limit.
   *
   * Deletes a specific rate limit configuration by UUID.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.rateLimitId - The UUID of the rate limit configuration to delete.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Record<string, any>>} - A promise that resolves with an empty object on success.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  delete(params: DeleteRateLimitParams): Promise<Record<string, any>> {
    const requiredParams = ['rateLimitId'];
    const validParams = ['rateLimitId', 'signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { rateLimitId, signal, headers } = params;

    const path = { 'rate_limit_id': rateLimitId };

    const parameters = {
      url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
      path,
      signal,
      headers,
    };
    return this.client._delete<EmptyObject>(parameters);
  }
}
