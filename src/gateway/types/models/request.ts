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
import { DefaultParams, Metadata } from '../gateway';

/** Parameters for the `listAllModels` operation. */
export interface ListAllModelsParams extends DefaultParams {
  providerId?: string;
}

/** Parameters for the `getModel` operation. */
export interface GetModelParams extends DefaultParams {
  /** Model ID. */
  modelId: string;
}

/** Parameters for the `deleteModel` operation. */
export interface DeleteModelParams extends DefaultParams {
  /** Model ID. */
  modelId: string;
}

/** Parameters for the `listProviderModels` operation. */
export interface ListProviderModelsParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
}

/** Parameters for the `createProviderModel` operation. */
export interface CreateModelParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
  /** The official provider-specific server-side unique identifier of the model instance. */
  modelId: string;
  /** The aliased name of the model. If set, this is the name that should be used by clients to refer to that
   *  model in a more convenient or custom manner. When a client provides the alias instead of the official name, the
   *  middleware will map the alias back to the underlying `id` (e.g., `"gpt-o"`) and execute requests against the
   *  correct model.
   */
  alias?: string;
  /** Contains additional configuration for the model. */
  metadata?: Metadata;
}

/** Parameters for the `replaceModel` operation. */
export interface ReplaceModelParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
  /** Model ID. */
  modelId: string;
  /** The official provider-specific server-side unique identifier of the model instance. */
  id?: string;
  /** The aliased name of the model. If set, this is the name that should be used by clients to refer to that
   *  model in a more convenient or custom manner. When a client provides the alias instead of the official name, the
   *  middleware will map the alias back to the underlying `id` (e.g., `"gpt-o"`) and execute requests against the
   *  correct model.
   */
  alias?: string;
  /** Contains additional configuration for the model. */
  metadata?: Metadata;
}

/** Parameters for the `updateModel` operation. */
export interface UpdateModelParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
  /** Model ID. */
  modelId: string;
  /** The official provider-specific server-side unique identifier of the model instance. */
  id?: string;
  /** The aliased name of the model. If set, this is the name that should be used by clients to refer to that
   *  model in a more convenient or custom manner. When a client provides the alias instead of the official name, the
   *  middleware will map the alias back to the underlying `id` (e.g., `"gpt-o"`) and execute requests against the
   *  correct model.
   */
  alias?: string;
  /** Contains additional configuration for the model. */
  metadata?: Metadata;
}

/** Parameters for the `deleteProviderModel` operation. */
export interface DeleteProviderModelParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
  /** Model ID. */
  modelId: string;
}

/** Parameters for the `listProviderAvailableModels` operation. */
export interface ListProviderAvailableModelsParams extends DefaultParams {
  /** Provider ID. */
  providerId: string;
}
