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

import { DefaultParams } from '../gateway';

/** Parameters for the `getCurrentTenant` operation. */
export interface GetCurrentTenantParams extends DefaultParams {}

/** Parameters for the `createTenant` operation. */
export interface CreateTenantParams extends DefaultParams {
  /** The name of the tenant to be created. */
  name?: string;
  /** Secrets Manager url */
  secretsManager: string;
}

/** Parameters for the `replaceCurrentTenant` operation. */
export interface ReplaceCurrentTenantParams extends DefaultParams {
  /** Tenant name to replace. Currently, only the tenant name can be replaced. */
  name: string;
}

/** Parameters for the `updateCurrentTenant` operation. */
export interface UpdateCurrentTenantParams extends DefaultParams {
  /** Tenant name to update. Currently, only the tenant name can be updated. */
  name: string;
}

/** Parameters for the `deleteTenant` operation. */
export interface DeleteTenantParams extends DefaultParams {}
