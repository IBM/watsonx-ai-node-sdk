/**
 * (C) Copyright IBM Corp. 2025-2026.
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
import { BaseService, readExternalSources } from 'ibm-cloud-sdk-core';
import { Agent } from 'https';
import { readFileSync } from 'fs';
import { getAuthenticatorFromEnvironment } from '../authentication/utils/get-authenticator-from-environment';
import { VERSION_DATE } from '../version';
import type { Stream } from '../lib/common';
import {
  getSdkHeaders,
  transformStreamToObjectStream,
  transformStreamToStringStream,
} from '../lib/common';
import type {
  CreateStreamParameters,
  DeleteParameters,
  GetParameters,
  HttpsAgentMap,
  PostParameters,
  PutParameters,
  Response,
  Certificates,
  TokenAuthenticationOptions,
} from './types/base';
import { PLATFORM_URL_MAPPINGS } from '../config';
import { validateRequiredOneOf } from '../helpers/validators';
import type { ContextIdentifiers } from '../types/common';

/**
 * WatsonxBaseService class extends BaseService and provides common functionalities for Watsonx
 * services.
 *
 * @category BaseService
 */
export class WatsonxBaseService extends BaseService {
  /** @ignore */
  static DEFAULT_SERVICE_URL: string = 'https://us-south.ml.cloud.ibm.com';

  /** @ignore */
  static DEFAULT_SERVICE_NAME: string = 'watsonx_ai';

  static PLATFORM_URLS_MAP = PLATFORM_URL_MAPPINGS;

  /** The version date for the API of the form `YYYY-MM-DD`. */
  version: string;

  /** URL required for dataplatform endpoints */
  wxServiceUrl: string;

  /** URL required for watsonx inference endpoints */
  serviceUrl: string;

  httpsAgentMap: HttpsAgentMap = { service: undefined, dataplatform: undefined };

  projectId?: string;

  spaceId?: string;

  /**
   * Constructs an instance of WatsonxBaseService with passed in options and external configuration.
   *
   * @category Constructor
   * @param {UserOptions} [options] - The parameters to send to the service.
   * @param {string} [options.version] - The version date for the API of the form `YYYY-MM-DD`
   * @param {string} [options.serviceUrl] - The base URL for the service
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate
   *   requests to the service
   * @param {Certificates['caCert']} [options.caCert] - Certificate configuration for HTTPS
   *   connections
   * @param {string} [options.projectId] - The project ID to use for API requests
   * @param {string} [options.spaceId] - The space ID to use for API requests
   */
  constructor(options: UserOptions & Certificates & TokenAuthenticationOptions = {}) {
    // If version is not provided, use the VERSION_DATE from version.ts
    if (!options.version) {
      options.version = VERSION_DATE;
    }

    // version is now guaranteed to be set (either provided or from VERSION_DATE)
    options.version = options.version as string;

    options.serviceName ??= WatsonxBaseService.DEFAULT_SERVICE_NAME;

    let httpsAgentAuth: Agent | undefined;

    if (typeof options.caCert === 'string') {
      const certFile = readFileSync(options.caCert);

      httpsAgentAuth = new Agent({
        ca: certFile,
      });

      options.httpsAgent = httpsAgentAuth;
    } else if (options.caCert?.auth?.path) {
      const certFile = readFileSync(options.caCert.auth.path);

      httpsAgentAuth = new Agent({
        ca: certFile,
      });
    }

    // Create authenticator with user given params and environment variables
    if (!options.authenticator) {
      const { serviceName, requestToken, serviceUrl } = options;
      options.authenticator = getAuthenticatorFromEnvironment({
        serviceName,
        requestToken,
        serviceUrl,
        httpsAgent: httpsAgentAuth,
      });
    }

    options.url ??= options.serviceUrl;

    super(options);

    this.version = options.version;

    validateRequiredOneOf(options, ['projectId', 'spaceId'], false);
    this.projectId = options.projectId;
    this.spaceId = options.spaceId;

    this.configureService(options.serviceName);
    // Using build-in method to ensure user-given URL is correct ex. trimming slashes
    if (options.serviceUrl) {
      this.setServiceUrl(options.serviceUrl);
    } else {
      this.setServiceUrl(WatsonxBaseService.DEFAULT_SERVICE_URL);
    }

    if (typeof options.caCert !== 'string') {
      if (options.caCert?.service?.path) {
        const certFile = readFileSync(options.caCert.service.path);

        this.httpsAgentMap.service = new Agent({
          ca: certFile,
        });
      }
      if (options.caCert?.dataplatform?.path) {
        const certFile = readFileSync(options.caCert.dataplatform.path);

        this.httpsAgentMap.dataplatform = new Agent({
          ca: certFile,
        });
      }
    }

    if (!this.baseOptions.serviceUrl)
      throw new Error('Something went wrong with setting up serviceUrl');
    type PlatformURLKeys = keyof typeof WatsonxBaseService.PLATFORM_URLS_MAP;

    // Read platformUrl from environment variables
    options.platformUrl ??= readExternalSources(options.serviceName).platformUrl;
    // Set platformUrl depending on user given urls
    if (options.platformUrl) {
      this.wxServiceUrl = options.platformUrl.concat('/wx');
      this.serviceUrl = options.platformUrl;
    } else if (
      Object.keys(WatsonxBaseService.PLATFORM_URLS_MAP).includes(this.baseOptions.serviceUrl)
    ) {
      const platformUrl =
        WatsonxBaseService.PLATFORM_URLS_MAP[this.baseOptions.serviceUrl as PlatformURLKeys];
      this.wxServiceUrl = platformUrl.concat('/wx');
      this.serviceUrl = platformUrl;
    } else {
      this.wxServiceUrl = this.baseOptions.serviceUrl.concat('/wx');
      this.serviceUrl = this.baseOptions.serviceUrl;
    }
  }

  /**
   * Resolves projectId and spaceId with fallback to instance values.
   *
   * This method implements a priority-based resolution strategy:
   *
   * 1. If both instance values (this.projectId/this.spaceId) AND parameter values exist, parameter
   *    values take absolute precedence and instance values are ignored
   * 2. Otherwise, parameter values are used if provided, falling back to instance values
   *
   * This ensures that explicitly passed parameters always override instance configuration when both
   * are present, preventing unintended mixing of project and space contexts.
   *
   * @private
   * @param {Object} params - Object containing optional projectId and spaceId
   * @param {string} [params.projectId] - The project ID to use for the request
   * @param {string} [params.spaceId] - The space ID to use for the request
   * @returns {Object} Resolved projectId and spaceId values
   * @returns {string | undefined} Return.projectId - The resolved project ID (from params or
   *   instance)
   * @returns {string | undefined} Return.spaceId - The resolved space ID (from params or instance)
   */
  protected resolveContextId(params: { projectId?: string; spaceId?: string }): {
    projectId?: string;
    spaceId?: string;
  } {
    if (params.projectId !== undefined || params.spaceId !== undefined)
      return {
        projectId: params.projectId,
        spaceId: params.spaceId,
      };

    return {
      projectId: this.projectId,
      spaceId: this.spaceId,
    };
  }
}

/**
 * APIBaseService class extends WatsonxBaseService and provides common API request functionalities.
 *
 * @category APIBaseService
 */
export class APIBaseService extends WatsonxBaseService {
  /**
   * Forms container ID headers based on project ID or space ID.
   *
   * This method creates the appropriate IBM-specific headers for identifying the container (project
   * or space) that the API request should operate within. It prioritizes parameters passed in the
   * request over instance-level defaults.
   *
   * @param {ContextIdentifiers} [params={}] - Container identifiers (projectId or spaceId). Default
   *   is `{}`
   * @returns {{ 'X-IBM-PROJECT-ID': string } | { 'X-IBM-SPACE-ID': string } | {}} An object
   *   containing either the project ID header, space ID header, or an empty object if neither is
   *   provided
   * @protected
   */
  protected _formContainerIdHeaders(
    params: ContextIdentifiers = {},
    requireContainerId: boolean = false
  ): { 'X-IBM-PROJECT-ID': string } | { 'X-IBM-SPACE-ID': string } | {} {
    const { projectId, spaceId } = this.resolveContextId(params);
    if (requireContainerId) validateRequiredOneOf({ projectId, spaceId }, ['projectId', 'spaceId']);
    return {
      ...(projectId
        ? {
            'X-IBM-PROJECT-ID': projectId,
          }
        : {}),
      ...(spaceId
        ? {
            'X-IBM-SPACE-ID': spaceId,
          }
        : {}),
    };
  }

  /**
   * Appends additional data to request headers.
   *
   * This utility method merges override headers with existing headers in the parameters object,
   * ensuring that custom headers are properly combined without losing existing header data.
   *
   * @template T - The type of parameters, constrained to request parameter types with container
   *   identifiers
   * @param {T} params - The request parameters containing existing headers
   * @param {Record<string, any>} overrides - Additional headers to merge into the request
   * @returns {T} A new parameters object with merged headers
   * @protected
   */
  protected appendDataToHeaders<
    T extends (GetParameters | PostParameters | PutParameters | DeleteParameters) &
      ContextIdentifiers,
  >(params: T, overrides: Record<string, any>): T {
    return {
      ...params,
      headers: {
        ...params.headers,
        ...overrides,
      },
    };
  }

  /**
   * Performs a POST request to the specified URL.
   *
   * @template T
   * @param {PostParameters} params - The parameters for the POST request.
   * @param {string} params.url - The parameters for the POST request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the POST
   *   request.
   */
  async _post<T>(params: PostParameters): Promise<Response<T>> {
    if (!params) throw new Error('Input is required');
    const { url, signal = null, path, body = {}, query = {}, headers = {} } = params;
    const qs = {
      'version': this.version,
      ...query,
    };

    const sdkHeaders = getSdkHeaders();

    const parameters = {
      options: {
        url,
        method: 'POST',
        body,
        qs,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        axiosOptions: {
          signal,
        },
      },
    };
    return this.createRequest(parameters);
  }

  /**
   * Performs a GET request to the specified URL.
   *
   * @template T
   * @param {GetParameters} params - The parameters for the GET request.
   * @param {string} [params.url] - The parameters for the GET request.
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the GET request.
   */
  async _get<T>(params: GetParameters): Promise<Response<T>> {
    if (!params) throw new Error('Input is required');
    const { url, signal = null, query = {}, path, headers = {} } = params;

    const qs = {
      'version': this.version,
      ...query,
    };

    const sdkHeaders = getSdkHeaders();

    const parameters = {
      options: {
        url,
        method: 'GET',
        qs,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ...headers,
        },
        axiosOptions: {
          signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Performs a DELETE request to the specified URL.
   *
   * @template T
   * @param {DeleteParameters} params - The parameters for the DELETE request.
   * @param {string} params.url - The parameters for the DELETE request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the DELETE
   *   request.
   */
  async _delete<T>(params: DeleteParameters): Promise<Response<T>> {
    if (!params) throw new Error('Input is required');

    const { url, signal = null, path, body, query = {}, headers = {} } = params;

    const qs = {
      'version': this.version,
      ...query,
    };

    const sdkHeaders = getSdkHeaders();
    const deleteHeaders = body ? { 'Content-Type': 'application/json' } : {};
    const parameters = {
      options: {
        url,
        method: 'DELETE',
        qs,
        body,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          ...deleteHeaders,
          ...headers,
        },
        axiosOptions: {
          signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Performs a PUT request to the specified URL.
   *
   * @template T
   * @param {PutParameters} params - The parameters for the PUT request.
   * @param {string} params.url - The parameters for the PUT request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the PUT request.
   */
  async _put<T>(params: PutParameters): Promise<Response<T>> {
    if (!params) throw new Error('Input is required');
    const { url, signal = null, path, body = {}, query = {}, headers = {} } = params;

    const qs = {
      'version': this.version,
      ...query,
    };

    const sdkHeaders = getSdkHeaders();

    const parameters = {
      options: {
        url,
        method: 'PUT',
        body,
        qs,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        axiosOptions: {
          signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Performs a POST request to the specified URL and returns a stream.
   *
   * @template T
   * @param {CreateStreamParameters} params - The parameters for the POST request.
   * @param {string} params.url - The parameters for the POST request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {Record<string, any>} [params.returnObject] - Flag that indicates return type. Set
   *   'true' to return objects, 'false' to return SSE
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Stream<T | string>>} - A promise that resolves to a stream from the POST
   *   request.
   */
  async _postStream<T>(params: CreateStreamParameters): Promise<Stream<T | string>> {
    if (!params) throw new Error('Input is required');
    const { url, returnObject = true, signal = null, body = {}, query = {}, headers = {} } = params;

    const qs = {
      'version': this.version,
      ...query,
    };

    const sdkHeaders = getSdkHeaders();

    const parameters = {
      options: {
        url,
        method: 'POST',
        body,
        qs,
        responseType: 'stream',
        adapter: 'fetch',
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'text/event-stream',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          ...headers,
        },
        axiosOptions: {
          signal,
        },
      },
    };

    const apiResponse = await this.createRequest(parameters);
    const stream = returnObject
      ? transformStreamToObjectStream<T>(apiResponse)
      : transformStreamToStringStream<string>(apiResponse);
    return stream;
  }
}
