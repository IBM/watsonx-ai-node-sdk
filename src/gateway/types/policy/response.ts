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
/**
 * TenantPolicy specifies an access policy for the tenant.
 */
export interface TenantPolicy {
  /** Policy id */
  uuid: string;
  /** The action to perform on the policy, either read or write. */
  action: TenantPolicy.Constants.Action | string;
  /** The effect that the policy is to have, either allow or deny. */
  effect: TenantPolicy.Constants.Effect | string;
  /** The resource ID that the policy affects. */
  resource: string;
  /** The subject that the policy pertains to. */
  subject: string;
}
export namespace TenantPolicy {
  export namespace Constants {
    /** The action to perform on the policy, either read or write. */
    export enum Action {
      READ = 'read',
      WRITE = 'write',
    }
    /** The effect that the policy is to have, either allow or deny. */
    export enum Effect {
      ALLOW = 'allow',
      DENY = 'deny',
    }
  }
}

/**
 * A list of tenant policies.
 */
export interface TenantPolicyCollection {
  /** The array of tenant policies. */
  data: TenantPolicy[];
  /** The object type, always "list". */
  object: 'list';
}
