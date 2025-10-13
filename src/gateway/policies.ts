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
import { Response } from '../base/types/base';
import {
  CreatePolicyParams,
  DeletePolicyParams,
  GetPolicyParams,
  ListPolicyParams,
  TenantPolicy,
  TenantPolicyCollection,
} from './types';

/**
 * Class representing the Policies resource.
 * This class provides methods to interact with ML Gateway policies.
 */
export class Policies extends GatewayResource {
  /**
   * Create policy.
   *
   * Creates policy with provided params.
   *
   * @param {CreatePolicyParams} params - The parameters to send to the service.
   * @param {string} params.action - The action to perform on the policy, either read or write.
   * @param {string} params.effect - The effect that the policy is to have, either allow or deny.
   * @param {string} params.resource - The resource ID that the policy affects.
   * @param {string} params.subject - The subject that the policy pertains to.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Response<EmptyObject>> } - Resolves with the response from the server.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  create(params: CreatePolicyParams): Promise<Response<TenantPolicy>> {
    const requiredParams = ['action', 'effect', 'resource', 'subject'];
    const validParams = ['action', 'effect', 'resource', 'subject', 'signal', 'headers'];

    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { action, effect, resource, subject, signal, headers } = params;

    const body = {
      'action': action,
      'effect': effect,
      'resource': resource,
      'subject': subject,
    };

    const parameters = {
      url: '/ml/gateway/v1/policies',
      body,
      signal,
      headers,
    };
    return this.client._post<TenantPolicy>(parameters);
  }

  /**
   * Get Policy's details by id.
   *
   * Retrieves the details of a specific policy.
   *
   * @param {GetPolicyParams} params - The parameters to send to the service.
   * @param {string} params.policyId - Policy id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<TenantPolicy>} Resolves with the response from the server.
   * @throws {Error} If validation fails, policy with provided id is not listed or an error occurs during the request.
   */
  async getDetails(params: GetPolicyParams): Promise<TenantPolicy> {
    const requiredParams = ['policyId'];
    const validParams = ['policyId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const { policyId } = params;
    const policies = await this.list();
    const policy = policies.find((item) => item.uuid === policyId);

    if (!policy) throw new Error(`Policy with provided id: ${policyId} does not exist`);

    return policy;
  }

  /**
   * Delete Policy.
   *
   * Deletes the specified policy.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.policyId - Policy id.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<EmptyObject>} Resolves with an empty object on success.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  delete(params: DeletePolicyParams): Promise<Response<EmptyObject>> {
    const requiredParams = ['policyId'];
    const validParams = ['policyId', 'signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }
    const { policyId, signal, headers } = params;

    const path = {
      'policy_id': policyId,
    };
    const parameters = {
      url: '/ml/gateway/v1/policies/{policy_id}',
      path,
      signal,
      headers,
    };
    return this.client._delete<EmptyObject>(parameters);
  }

  /**
   * List all policies.
   * @param {Object} params - Parameters for listing policies.
   * @param {string} [params.providerId] - Policy id.
   * @returns {Promise<Response<TenantPolicyCollection>>} Resolves with the list of policies.
   * @throws {Error} If validation fails or an error occurs during the request.
   */
  async list(params: ListPolicyParams = {}): Promise<TenantPolicy[]> {
    const requiredParams: string[] = [];
    const validParams = ['signal', 'headers'];
    const validationErrors = validateParams(params, requiredParams, validParams);
    if (validationErrors) {
      return Promise.reject(validationErrors);
    }

    const { signal, headers } = params;
    const parameters = {
      url: '/ml/gateway/v1/policies',
      signal,
      headers,
    };
    const response = await this.client._get<TenantPolicyCollection>(parameters);

    return response.result.data;
  }
}
