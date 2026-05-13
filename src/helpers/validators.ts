/**
 * (C) Copyright IBM Corp. 2026.
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

import { validateParams } from 'ibm-cloud-sdk-core';

/**
 * Validates parameters including common parameters (signal, headers). This is a wrapper around
 * validateParams that automatically includes common parameters.
 *
 * @param {Record<string, any>} params - Object containing parameters to validate.
 * @param {string[] | null} requiredParams - Array of required parameter names, or null if no
 *   required params.
 * @param {string[] | null} validParams - Array of valid parameter names (common params will be
 *   added automatically), or null if no valid params.
 * @throws {Error} Throws Error object if validation fails, void otherwise.
 */
export const validateRequestParams = (
  params: Record<string, any>,
  requiredParams: string[] | null,
  validParams: string[] | null
) => {
  const commonParams = ['headers', 'signal'];

  const validParamsWithCommon = [...commonParams];
  if (requiredParams) validParamsWithCommon.push(...requiredParams);
  if (validParams) validParamsWithCommon.push(...validParams);
  // @ts-expect-error validateParams has invalid typing
  const validationResult = validateParams(params, requiredParams, validParamsWithCommon);
  if (validationResult) throw validationResult;
};

/**
 * Validates that exactly one (or optionally none) of the specified parameters is provided.
 *
 * This function enforces mutual exclusivity among a set of parameters, ensuring that only one
 * parameter from the list is present at a time. This is useful for API methods that accept
 * alternative parameters but not multiple simultaneously (e.g., projectId OR spaceId).
 *
 * @example
 *   // Ensures exactly one of projectId or spaceId is provided
 *   validateRequiredOneOf(params, ['projectId', 'spaceId'], true);
 *
 * @example
 *   // Allows zero or one of the parameters (but not both)
 *   validateRequiredOneOf(params, ['projectId', 'spaceId'], false);
 *
 * @param {Record<string, any>} [params={}] - Object containing optional parameters to validate for
 *   mutual exclusivity. Default is `{}`
 * @param {string[]} requiredParams - Array of parameter names to check for mutual exclusivity
 * @param {boolean} [isAnyRequired=true] - If true, at least one parameter must be provided. If
 *   false, all parameters can be absent (useful for optional alternative parameters). Default is
 *   `true`
 * @throws {Error} If more than one of the specified parameters is provided
 * @throws {Error} If isAnyRequired is true and none of the specified parameters is provided
 * @note When isAnyRequired=false and all parameters are absent, the function returns
 *   without error (allows zero parameters).
 */
export const validateRequiredOneOf = (
  params: Record<string, any> = {},
  requiredParams: string[],
  isAnyRequired: boolean = true
): void => {
  const foundExactlyOne = requiredParams.reduce((acc, curr) => {
    if (params[curr] && !acc) return true;
    if (params[curr] && acc)
      throw new Error(`Only one of the following parameters is allowed: ${requiredParams}`);
    return acc;
  }, false);

  if (isAnyRequired && foundExactlyOne === false)
    throw new Error(`One of the following parameters is required: ${requiredParams}`);
};
