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

import { UserOptions, validateParams } from 'ibm-cloud-sdk-core';
import { APIBaseService } from '../base/base';
import { ChatCompletions, EmbeddingCompletions, GenerateTextCompletions } from './completions';
import { Models } from './models';
import { Providers } from './providers';
import { Policies } from './policies';
import { CreateTenantParams, DeleteTenantParams } from './types/tentant/request';
import { Tenant } from './types/tentant/response';
import { EmptyObject } from './types';
import { Response } from '../base';

/**
 * Represents the chat functionality of the gateway.
 */
export class Chat {
  /**
   * ChatCompletions instance.

   */
  completion: ChatCompletions;

  /**
   * Creates an instance of Chat.
   * @param {APIBaseService} gateway - The base API service instance.
   */
  constructor(gateway: APIBaseService) {
    this.completion = new ChatCompletions(gateway);
  }
}

/**
 * Represents the embeddings functionality of the gateway.
 */
export class Embeddings {
  /**
   * EmbeddingCompletions instance.
   */
  completion: EmbeddingCompletions;

  /**
   * Creates an instance of Embeddings.
   * @param {APIBaseService} gateway - The base API service instance.
   */
  constructor(gateway: APIBaseService) {
    this.completion = new EmbeddingCompletions(gateway);
  }
}

/**
 * Main gateway class that extends APIBaseService.
 */
export class Gateway extends APIBaseService {
  /**
   * GenerateTextCompletions instance.
   */
  completion: GenerateTextCompletions;

  /**
   * Chat instance.
   */
  chat: Chat;

  /**
   * Embeddings instance.
   */
  embeddings: Embeddings;

  /**
   * Models instance.
   */
  models: Models;

  /**
   * Providers instance.
   */
  providers: Providers;

  policies: Policies;

  /**
   * Constructs an instance of Gateway with passed in options and external configuration.
   *
   * @param {UserOptions} options - The parameters to send to the service.
   * @param {string} options.version - The version date for the API of the form `YYYY-MM-DD`
   * @param {string} options.serviceUrl - The base URL for the service
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
   *
   * @category constructor
   *
   */
  constructor(options: UserOptions) {
    super(options);

    this.chat = new Chat(this);
    this.completion = new GenerateTextCompletions(this);
    this.embeddings = new Embeddings(this);
    this.models = new Models(this);
    this.providers = new Providers(this);
    this.policies = new Policies(this);
  }
}
