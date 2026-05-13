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
import { APIBaseService } from '../base/base';
import { ChatCompletions, EmbeddingCompletions, GenerateTextCompletions } from './completions';
import { Models } from './models';
import { Providers } from './providers';
import { Policies } from './policies';
import { RateLimits } from './ratelimit';
import type {
  DeleteParameters,
  GetParameters,
  PostParameters,
  PutParameters,
  Response,
} from '../base';
import type { ContextIdentifiers } from '../types/common';

/** Represents the chat functionality of the gateway. */
export class Chat {
  /* ChatCompletions instance. */
  completion: ChatCompletions;

  /**
   * Creates an instance of Chat.
   *
   * @param {APIBaseService} gateway - The base API service instance.
   */
  constructor(gateway: APIBaseService) {
    this.completion = new ChatCompletions(gateway);
  }
}

/** Represents the embeddings functionality of the gateway. */
export class Embeddings {
  /** EmbeddingCompletions instance. */
  completion: EmbeddingCompletions;

  /**
   * Creates an instance of Embeddings.
   *
   * @param {APIBaseService} gateway - The base API service instance.
   */
  constructor(gateway: APIBaseService) {
    this.completion = new EmbeddingCompletions(gateway);
  }
}

/** Main gateway class that extends APIBaseService. */
export class Gateway extends APIBaseService {
  /** GenerateTextCompletions instance. */
  completion: GenerateTextCompletions;

  /** Chat instance. */
  chat: Chat;

  /** Embeddings instance. */
  embeddings: Embeddings;

  /** Models instance. */
  models: Models;

  /** Providers instance. */
  providers: Providers;

  policies: Policies;

  rateLimit: RateLimits;

  /**
   * Constructs an instance of Gateway with passed in options and external configuration.
   *
   * @category Constructor
   * @param {UserOptions} options - The parameters to send to the service.
   * @param {string} options.version - The version date for the API of the form `YYYY-MM-DD`
   * @param {string} options.serviceUrl - The base URL for the service
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate
   *   requests to the service
   */
  constructor(options: UserOptions) {
    super(options);

    this.chat = new Chat(this);
    this.completion = new GenerateTextCompletions(this);
    this.embeddings = new Embeddings(this);
    this.models = new Models(this);
    this.providers = new Providers(this);
    this.policies = new Policies(this);
    this.rateLimit = new RateLimits(this);
  }

  private appendContainerIdToHeaders(
    params: (GetParameters | PostParameters | PutParameters | DeleteParameters) & ContextIdentifiers
  ) {
    return this.appendDataToHeaders(params, this._formContainerIdHeaders(params));
  }

  _get<T>(params: GetParameters & ContextIdentifiers): Promise<Response<T>> {
    return super._get(this.appendContainerIdToHeaders(params));
  }

  _post<T>(params: PostParameters): Promise<Response<T>> {
    return super._post(this.appendContainerIdToHeaders(params));
  }

  _delete<T>(params: DeleteParameters): Promise<Response<T>> {
    return super._delete(this.appendContainerIdToHeaders(params));
  }

  _put<T>(params: PutParameters): Promise<Response<T>> {
    return super._put(this.appendContainerIdToHeaders(params));
  }
}
