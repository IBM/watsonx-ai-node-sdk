/**
 * © Copyright IBM Corporation 2024. All Rights Reserved.
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

import { BaseService, validateParams, UserOptions, readExternalSources } from 'ibm-cloud-sdk-core';
import { getAuthenticatorFromEnvironment } from '../authentication/utils/get-authenticator-from-environment';
import {
  getSdkHeaders,
  Stream,
  transformStreamToObjectStream,
  transformStreamToStringStream,
} from '../lib/common';
import {
  CreateStreamParameters,
  DeleteParameters,
  GetParameters,
  PostParameters,
  PutParameters,
  Response,
} from './types/base';

/**
 * WatsonxBaseService class extends BaseService and provides common functionalities for Watsonx services.
 *
 * @category BaseService
 */
export class WatsonxBaseService extends BaseService {
  /** @hidden */
  static DEFAULT_SERVICE_URL: string = 'https://us-south.ml.cloud.ibm.com';

  /** @hidden */
  static DEFAULT_SERVICE_NAME: string = 'watsonx_ai';

  /** The version date for the API of the form `YYYY-MM-DD`. */
  version: string;

  /** URL required for dataplatform endpoints */
  wxServiceUrl: string;

  /** URL required for watsonx inference endpoints */
  serviceUrl: string;

  static PLATFORM_URLS_MAP = {
    'https://ca-tor.ml.cloud.ibm.com': 'https://api.ca-tor.dai.cloud.ibm.com/wx',
    'https://jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
    'https://eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
    'https://eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
    'https://us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
    'https://private.ca-tor.ml.cloud.ibm.com': 'https://private.api.ca-tor.dai.cloud.ibm.com/wx',
    'https://private.jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
    'https://private.eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
    'https://private.eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
    'https://private.us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
  };

  /**
   * Constructs an instance of WatsonxBaseService with passed in options and external configuration.
   *
   * @param {UserOptions} [options] - The parameters to send to the service.
   * @param {string} [options.version] - The version date for the API of the form `YYYY-MM-DD`
   * @param {string} [options.serviceUrl] - The base URL for the service
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
   *
   * @category constructor
   *
   */
  constructor(options: UserOptions) {
    const _requiredParams = ['version'];
    // @ts-expect-error
    const validationErrors = validateParams(options, _requiredParams, null);
    if (validationErrors) {
      throw validationErrors;
    }
    // version is required parameter, if it is 'undefined' it will throw an error above
    options.version = options.version as string;

    options.serviceName ??= WatsonxBaseService.DEFAULT_SERVICE_NAME;

    // Create authenticator with user given params and environment variables
    if (!options.authenticator) {
      const { serviceName, serviceUrl, requestToken } = options;
      options.authenticator = getAuthenticatorFromEnvironment({
        serviceName,
        serviceUrl,
        requestToken,
      });
    }

    options.url ??= options.serviceUrl;

    super(options);

    this.version = options.version;

    // Using build-in method to ensure user-given URL is correct ex. trimming slashes
    if (options.serviceUrl) {
      this.setServiceUrl(options.serviceUrl);
    } else {
      this.setServiceUrl(WatsonxBaseService.DEFAULT_SERVICE_URL);
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
      this.wxServiceUrl =
        WatsonxBaseService.PLATFORM_URLS_MAP[this.baseOptions.serviceUrl as PlatformURLKeys];
      [this.serviceUrl] =
        WatsonxBaseService.PLATFORM_URLS_MAP[this.baseOptions.serviceUrl as PlatformURLKeys].split(
          '/wx'
        );
    } else {
      this.wxServiceUrl = this.baseOptions.serviceUrl.concat('/wx');
      this.serviceUrl = this.baseOptions.serviceUrl;
    }
  }
}

/**
 * APIBaseService class extends WatsonxBaseService and provides common API request functionalities.
 *
 * @category APIBaseService
 */
export class APIBaseService extends WatsonxBaseService {
  /**
   * Performs a POST request to the specified URL.
   *
   * @param {PostParameters} params - The parameters for the POST request.
   * @param {string} params.url - The parameters for the POST request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the POST request.
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
   * @param {DeleteParameters} params - The parameters for the DELETE request.
   * @param {string} params.url - The parameters for the DELETE request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   * @returns {Promise<Response<T>>} - A promise that resolves to the response from the DELETE request.
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
   * @param {CreateStreamParameters} params - The parameters for the POST request.
   * @param {string} params.url - The parameters for the POST request.
   * @param {Record<string, any>} [params.body] - Body parameters to be passed to an endpoint
   * @param {Record<string, any>} [params.query] - Query parameters to be passed with url.
   * @param {Record<string, any>} [params.path] - Path parameters to be used to create url.
   * @param {Record<string, any>} [params.returnObject] - Flag that indicates return type. Set 'true' to return objects, 'false' to return SSE
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers.
   * @param {AbortSignal} [params.signal] - Signal from AbortController
   *
   * @returns {Promise<Stream<T | string>>} - A promise that resolves to a stream from the POST request.
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
