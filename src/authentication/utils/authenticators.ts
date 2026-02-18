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

import type { JwtTokenManagerOptions } from 'ibm-cloud-sdk-core';
import { JwtTokenManager, TokenRequestBasedAuthenticator } from 'ibm-cloud-sdk-core';
import type { Agent } from 'https';
import type { BaseOptions } from 'ibm-cloud-sdk-core/es/auth/authenticators/token-request-based-authenticator-immutable.js';

/* AWS authentication endpoint path for token requests. */
const AWS_AUTHENTICATION_PATH = '/api/2.0/apikeys/token';

/* Response structure for token request operations. */
export interface RequestTokenResponse {
  result: {
    access_token: string;
  };
}

/**
 * JWT Token Manager that uses a custom request function for token retrieval. Extends the base
 * JwtTokenManager with a custom token request implementation.
 *
 * @extends JwtTokenManager
 */
export class RequestFunctionJWTTokenManager extends JwtTokenManager {
  /**
   * Creates a new RequestFunctionJWTTokenManager instance.
   *
   * @param {JwtTokenManagerOptions} options - Configuration options for the token manager
   * @param {() => Promise<RequestTokenResponse>} requestToken - Custom function to request tokens
   */
  constructor(options: JwtTokenManagerOptions, requestToken: () => Promise<RequestTokenResponse>) {
    super(options);
    super.requestToken = requestToken;
  }
}

/**
 * Token Manager specifically designed for AWS authentication. Handles token requests to AWS
 * endpoints using API keys.
 *
 * @extends JwtTokenManager
 */
export class AWSTokenManager extends JwtTokenManager {
  private apikey: string;

  private httpsAgent?: Agent;

  /**
   * Creates a new AWSTokenManager instance.
   *
   * @param {JwtTokenManagerOptions} options - Configuration options including API key and URL
   * @param {string} options.apikey - The API key for AWS authentication
   * @param {Agent} [options.httpsAgent] - Optional custom HTTPS agent for handling requests
   */
  constructor(options: JwtTokenManagerOptions) {
    super(options);
    this.apikey = options.apikey;
    this.tokenName = 'token';
    this.httpsAgent = options.httpsAgent;
  }

  /**
   * Requests a new token from the AWS authentication endpoint. Constructs the request with API key
   * and sends it to the configured URL.
   *
   * @returns {Promise<any>} Promise resolving to the token response
   * @protected
   */
  protected async requestToken(): Promise<any> {
    const authPath = new URL(this.url).pathname === '/' ? AWS_AUTHENTICATION_PATH : '';
    const parameters = {
      options: {
        url: this.url + authPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          apikey: this.apikey,
        },
        rejectUnauthorized: !this.disableSslVerification,
        axiosOptions: {
          httpsAgent: this.httpsAgent,
        },
      },
    };
    return this.requestWrapperInstance.sendRequest(parameters);
  }
}

/**
 * JWT-based authenticator that uses a custom request function for token management. Supports Zen
 * authentication type for IBM Cloud Pak for Data.
 *
 * @extends TokenRequestBasedAuthenticator
 */
export class JWTRequestBaseAuthenticator extends TokenRequestBasedAuthenticator {
  /* Authentication type identifier for Zen (IBM Cloud Pak for Data). */
  static AUTHTYPE_ZEN = 'zen';

  protected tokenManager: RequestFunctionJWTTokenManager;

  /**
   * Creates a new JWTRequestBaseAuthenticator instance.
   *
   * @param {BaseOptions} options - Base authentication options
   * @param {() => Promise<RequestTokenResponse>} requestToken - Custom function to request tokens
   */
  constructor(options: BaseOptions, requestToken: () => Promise<RequestTokenResponse>) {
    super(options);
    this.tokenManager = new RequestFunctionJWTTokenManager(options, requestToken);
  }
}

/**
 * Authenticator specifically designed for AWS authentication. Uses AWSTokenManager to handle token
 * lifecycle for AWS services.
 *
 * @extends TokenRequestBasedAuthenticator
 */
export class AWSAuthenticator extends TokenRequestBasedAuthenticator {
  /* Authentication type identifier for AWS. */
  static AUTHTYPE_AWS = 'aws';

  protected tokenManager: AWSTokenManager;

  /**
   * Creates a new AWSAuthenticator instance.
   *
   * @param {BaseOptions} options - Base authentication options including API key and URL
   */
  constructor(options: BaseOptions) {
    super(options);
    this.tokenManager = new AWSTokenManager(options);
  }
}
