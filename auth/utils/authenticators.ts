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
/* eslint-disable max-classes-per-file */
import {
  JwtTokenManager,
  JwtTokenManagerOptions,
  TokenRequestBasedAuthenticator,
} from 'ibm-cloud-sdk-core';
import { BaseOptions } from 'ibm-cloud-sdk-core/es/auth/authenticators/token-request-based-authenticator-immutable';

export interface RequestTokenResponse {
  result: {
    access_token: string;
  };
}

export class RequestFunctionJWTTokenManager extends JwtTokenManager {
  constructor(options: JwtTokenManagerOptions, requestToken: () => Promise<RequestTokenResponse>) {
    super(options);
    super.requestToken = requestToken;
  }
}

export class JWTRequestBaseAuthenticator extends TokenRequestBasedAuthenticator {
  static AUTHTYPE_ZEN = 'zen';

  protected tokenManager: RequestFunctionJWTTokenManager;

  constructor(options: BaseOptions, requestToken: () => Promise<RequestTokenResponse>) {
    super(options);
    this.tokenManager = new RequestFunctionJWTTokenManager(options, requestToken);
  }
}
