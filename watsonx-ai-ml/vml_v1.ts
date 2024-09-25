/**
 * (C) Copyright IBM Corp. 2024.
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
 * IBM OpenAPI SDK Code Generator Version: 3.90.0-5aad763d-20240506-203857
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */

import * as extend from 'extend';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import {
  Authenticator,
  BaseService,
  UserOptions,
  constructServiceUrl,
  getQueryParam,
  readExternalSources,
  validateParams,
} from 'ibm-cloud-sdk-core';
import { getAuthenticatorFromEnvironment } from '../auth/utils/get-authenticator-from-environment';
import { getSdkHeaders, LineTransformStream, transformStream } from '../lib/common';
/**
 * SDK entrypoint for IBM watsonx.ai product
 *
 * API Version: v1
 */

const PLATFORM_URLS_MAP = {
  'https://jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
  'https://eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
  'https://eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
  'https://us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
  'https://private.jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
  'https://private.eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
  'https://private.eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
  'https://private.us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
};

class WatsonxAiMlVml_v1 extends BaseService {
  /** @hidden */
  static DEFAULT_SERVICE_URL: string = 'https://us-south.ml.cloud.ibm.com';

  /** @hidden */
  static DEFAULT_SERVICE_NAME: string = 'watsonx_ai';

  /** @hidden */
  static PARAMETERIZED_SERVICE_URL: string = 'https://{region}.ml.cloud.ibm.com';

  /** @hidden */
  private static defaultUrlVariables = new Map([['region', 'us-south']]);

  static wxServiceUrl: string;

  /**
   * Constructs a service URL by formatting the parameterized service URL.
   *
   * The parameterized service URL is:
   * 'https://{region}.ml.cloud.ibm.com'
   *
   * The default variable values are:
   * - 'region': 'us-south'
   *
   * @param {Map<string, string>} | null providedUrlVariables Map from variable names to desired values.
   *  If a variable is not provided in this map,
   *  the default variable value will be used instead.
   * @returns {string} The formatted URL with all variable placeholders replaced by values.
   */
  static constructServiceUrl(providedUrlVariables: Map<string, string> | null): string {
    return constructServiceUrl(
      WatsonxAiMlVml_v1.PARAMETERIZED_SERVICE_URL,
      WatsonxAiMlVml_v1.defaultUrlVariables,
      providedUrlVariables
    );
  }

  /*************************
   * Factory method
   ************************/

  /**
   * Constructs an instance of WatsonxAiMlVml_v1 with passed in options and external configuration.
   *
   * @param {UserOptions} [options] - The parameters to send to the service.
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
   * @param {string} [options.serviceUrl] - The base URL for the service
   * @returns {WatsonxAiMlVml_v1}
   *
   * @category constructor
   *
   */

  public static newInstance(options: UserOptions): WatsonxAiMlVml_v1 {
    options = options || {};

    if (!options.serviceName) {
      options.serviceName = this.DEFAULT_SERVICE_NAME;
    }
    if (!options.authenticator) {
      options.authenticator = getAuthenticatorFromEnvironment(options.serviceName);
    }
    if (!options.platformUrl) {
      options.platformUrl = readExternalSources(options.serviceName).platformUrl;
    }

    const service = new WatsonxAiMlVml_v1(options);

    service.configureService(options.serviceName);
    if (options.serviceUrl) {
      service.setServiceUrl(options.serviceUrl);
    }
    return service;
  }

  /** The version date for the API of the form `YYYY-MM-DD`. */
  version: string;

  wxServiceUrl: string;

  /**
   * Construct a WatsonxAiMlVml_v1 object.
   *
   * @param {Object} options - Options for the service.
   * @param {string} options.version - The version date for the API of the form `YYYY-MM-DD`.
   * @param {string} [options.serviceUrl] - The base URL for the service
   * @param {OutgoingHttpHeaders} [options.headers] - Default headers that shall be included with every request to the service.
   * @param {Authenticator} options.authenticator - The Authenticator object used to authenticate requests to the service
   * @constructor
   * @returns {WatsonxAiMlVml_v1}
   */
  constructor(options: UserOptions) {
    options = options || {};

    const _requiredParams = ['version'];
    const _validationErrors = validateParams(options, _requiredParams, null);
    if (_validationErrors) {
      throw _validationErrors;
    }
    super(options);
    if (options.serviceUrl) {
      this.setServiceUrl(options.serviceUrl);
    } else {
      this.setServiceUrl(WatsonxAiMlVml_v1.DEFAULT_SERVICE_URL);
    }
    if (options.platformUrl) {
      this.wxServiceUrl = options.platformUrl.concat('/wx');
    } else if (PLATFORM_URLS_MAP[this.baseOptions.serviceUrl]) {
      this.wxServiceUrl = PLATFORM_URLS_MAP[this.baseOptions.serviceUrl];
    } else {
      this.wxServiceUrl = this.baseOptions.serviceUrl.concat('/wx');
    }

    this.version = options.version;
  }

  /*************************
   * deployments
   ************************/

  /**
   * Create a new watsonx.ai deployment.
   *
   * Create a new deployment, currently the only supported type is `online`. If this is a deployment for a prompt tune
   * then the `asset` object must exist and the `id` must be the `id` of the `model` that was created after the prompt
   * training. If this is a deployment for a prompt template then the `prompt_template` object should exist and the `id`
   * must be the `id` of the prompt template to be deployed.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the resource.
   * @param {OnlineDeployment} params.online - Indicates that this is an online deployment. An object has to be
   * specified but can be empty.
   * The `serving_name` can be provided in the `online.parameters`.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.description] - A description of the resource.
   * @param {string[]} [params.tags] - A list of tags for this resource.
   * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
   * @param {SimpleRel} [params.promptTemplate] - A reference to a resource.
   * @param {HardwareSpec} [params.hardwareSpec] - A hardware specification.
   * @param {Rel} [params.asset] - A reference to a resource.
   * @param {string} [params.baseModelId] - The base model that is required for this deployment if this is for a prompt
   * template or a prompt tune for an IBM foundation model.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
   *
   * @category Deployments
   */
  public createDeployment(
    params: WatsonxAiMlVml_v1.CreateDeploymentParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'online'];
    const _validParams = [
      'name',
      'online',
      'projectId',
      'spaceId',
      'description',
      'tags',
      'custom',
      'asset',
      'promptTemplate',
      'hardwareSpec',
      'baseModelId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'online': _params.online,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'description': _params.description,
      'tags': _params.tags,
      'custom': _params.custom,
      'prompt_template': _params.promptTemplate,
      'hardware_spec': _params.hardwareSpec,
      'asset': _params.asset,
      'base_model_id': _params.baseModelId,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'createDeployment'
    );

    const parameters = {
      options: {
        url: '/ml/v4/deployments',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the deployments.
   *
   * Retrieve the list of deployments for the specified space or project.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.servingName] - Retrieves the deployment, if any, that contains this `serving_name`.
   * @param {string} [params.tagValue] - Retrieves only the resources with the given tag value.
   * @param {string} [params.assetId] - Retrieves only the resources with the given asset_id, asset_id would be the
   * model id.
   * @param {string} [params.promptTemplateId] - Retrieves only the resources with the given prompt_template_id.
   * @param {string} [params.name] - Retrieves only the resources with the given name.
   * @param {string} [params.type] - Retrieves the resources filtered with the given type. There are the deployment
   * types as well as an additional
   * `prompt_template` if the deployment type includes a prompt template.
   *
   * The supported deployment types are (see the description for `deployed_asset_type` in the deployment entity):
   *
   * 1. `prompt_tune` - when a prompt tuned model is deployed. 2. `foundation_model` - when a prompt template is used on
   * a pre-deployed IBM provided model.
   *
   * These can be combined with the flag `prompt_template` like this:
   *
   * 1. `type=prompt_tune` - return all prompt tuned model deployments. 2. `type=prompt_tune and prompt_template` -
   * return all prompt tuned model deployments with a prompt template. 3. `type=foundation_model` - return all prompt
   * template deployments. 4. `type=foundation_model and prompt_template` - return all prompt template deployments -
   * this is the same as the previous query because a `foundation_model` can only exist with a prompt template. 5.
   * `type=prompt_template` - return all deployments with a prompt template.
   * @param {string} [params.state] - Retrieves the resources filtered by state. Allowed values are `initializing`,
   * `updating`, `ready` and `failed`.
   * @param {boolean} [params.conflict] - Returns whether `serving_name` is available for use or not. This query
   * parameter cannot be combined with any other parameter except for `serving_name`.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResourceCollection>>}
   *
   * @category Deployments
   */
  public listDeployments(
    params?: WatsonxAiMlVml_v1.ListDeploymentsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResourceCollection>> {
    const _params = { ...params };
    const _requiredParams = [];
    const _validParams = [
      'spaceId',
      'projectId',
      'servingName',
      'tagValue',
      'assetId',
      'promptTemplateId',
      'name',
      'type',
      'state',
      'conflict',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'serving_name': _params.servingName,
      'tag.value': _params.tagValue,
      'asset_id': _params.assetId,
      'prompt_template_id': _params.promptTemplateId,
      'name': _params.name,
      'type': _params.type,
      'state': _params.state,
      'conflict': _params.conflict,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listDeployments'
    );

    const parameters = {
      options: {
        url: '/ml/v4/deployments',
        method: 'GET',
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the deployment details.
   *
   * Retrieve the deployment details with the specified identifier.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.deploymentId - The deployment id.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
   *
   * @category Deployments
   */
  public getDeployment(
    params: WatsonxAiMlVml_v1.DeploymentsGetParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>> {
    const _params = { ...params };
    const _requiredParams = ['deploymentId'];
    const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }
    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'deployment_id': _params.deploymentId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deploymentsGet'
    );

    const parameters = {
      options: {
        url: '/ml/v4/deployments/{deployment_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Update the deployment metadata.
   *
   * Update the deployment metadata. The following parameters of deployment metadata are supported for the patch
   * operation.
   *
   * - `/name`
   * - `/description`
   * - `/tags`
   * - `/custom`
   * - `/online/parameters`
   * - `/asset`
   * - `/prompt_template`
   * - `/hardware_spec`
   *
   * The PATCH operation with path specified as `/online/parameters` can be used to update the `serving_name`.
   *
   * Patching `/asset` or `/prompt_template` should normally be used in the case when these fields already exist.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.deploymentId - The deployment id.
   * @param {JsonPatchOperation[]} params.jsonPatch - The json patch.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
   *
   * @category Deployments
   */
  public updateDeployment(
    params: WatsonxAiMlVml_v1.DeploymentsUpdateParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>> {
    const _params = { ...params };
    const _requiredParams = ['deploymentId', 'jsonPatch'];
    const _validParams = ['deploymentId', 'jsonPatch', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = _params.jsonPatch;
    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'deployment_id': _params.deploymentId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deploymentsUpdate'
    );

    const parameters = {
      options: {
        url: '/ml/v4/deployments/{deployment_id}',
        method: 'PATCH',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json-patch+json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete the deployment.
   *
   * Delete the deployment with the specified identifier.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.deploymentId - The deployment id.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Deployments
   */
  public deleteDeployment(
    params: WatsonxAiMlVml_v1.DeploymentsDeleteParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['deploymentId'];
    const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'deployment_id': _params.deploymentId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deploymentsDelete'
    );

    const parameters = {
      options: {
        url: '/ml/v4/deployments/{deployment_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(true, sdkHeaders, {}, _params.headers),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Infer text.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. If a `serving_name` is used then it must
   * match the `serving_name` that is returned in the `inference` when the deployment was created.
   *
   * ### Return options
   *
   * Note that there is currently a limitation in this operation when using `return_options`, for input only
   * `input_text` will be returned if requested, for output the `input_tokens` and `generated_tokens` will not be
   * returned.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
   * or a `serving_name` that allows a predefined URL to be used to post a prediction.
   *
   * The `project` or `space` for the deployment must have a WML instance that will be used for limits and billing (if a
   * paid plan).
   * @param {string} [params.input] - The prompt to generate completions. Note: The method tokenizes the input
   * internally. It is recommended not to leave any trailing spaces.
   *
   *
   * This field is ignored if there is a prompt template.
   * @param {DeploymentTextGenProperties} [params.parameters] - The template properties if this request refers to a
   * prompt template.
   * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
   * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
   * of moderations.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
   *
   * @category Deployments
   */
  public deploymentGenerateText(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>> {
    const _params = { ...params };
    const _requiredParams = ['idOrName'];
    const _validParams = ['idOrName', 'input', 'parameters', 'moderations', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'parameters': _params.parameters,
      'moderations': _params.moderations,
    };

    const query = {
      'version': this.version,
    };

    const path = {
      'id_or_name': _params.idOrName,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deploymentsTextGeneration'
    );

    const parameters = {
      options: {
        url: '/ml/v1/deployments/{id_or_name}/text/generation',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Infer text event stream.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. This operation will return the output
   * tokens as a stream of events. If a `serving_name` is used then it must match the `serving_name` that is returned in
   * the `inference` when the deployment was created.
   *
   * ### Return options
   *
   * Note that there is currently a limitation in this operation when using `return_options`, for input only
   * `input_text` will be returned if requested, for output the `input_tokens` and `generated_tokens` will not be
   * returned, also the
   * `rank` and `top_tokens` will not be returned.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
   * or a `serving_name` that allows a predefined URL to be used to post a prediction.
   *
   * The `project` or `space` for the deployment must have a WML instance that will be used for limits and billing (if a
   * paid plan).
   * @param {string} [params.input] - The prompt to generate completions. Note: The method tokenizes the input
   * internally. It is recommended not to leave any trailing spaces.
   *
   * ### Response
   * AsyncIterable<string> represents a source of streaming data. If request performed successfully AsyncIterable<string> returns
   * stream line by line. Output will stream as follow:
   * - id: 1
   * - event: message
   * - data: {data}
   * - empty line which separates the next Event Message
   *
   * Here is one of the possibilities to read streaming output:
   *
   * const stream = await watsonxAiMlService.generateTextStream(parameters);
   * for await (const line of stream) {
   *   console.log(line);
   * }
   *
   * This field is ignored if there is a prompt template.
   * @param {DeploymentTextGenProperties} [params.parameters] - The template properties if this request refers to a
   * prompt template.
   * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
   * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
   * of moderations.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<AsyncIterable<string>>}
   *
   * @category Deployments
   */
  public async deploymentGenerateTextStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationStreamParams
  ): Promise<AsyncIterable<string>> {
    const _params = { ...params };
    const _requiredParams = ['idOrName'];
    const _validParams = ['idOrName', 'input', 'parameters', 'moderations', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'parameters': _params.parameters,
      'moderations': _params.moderations,
    };

    const query = {
      'version': this.version,
    };

    const path = {
      'id_or_name': _params.idOrName,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deploymentsTextGenerationStream'
    );

    const parameters = {
      options: {
        url: '/ml/v1/deployments/{id_or_name}/text/generation_stream',
        method: 'POST',
        body,
        qs: query,
        path,
        responseType: 'stream',
        adapter: 'fetch',
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'text/event-stream',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };
    const apiResponse = await this.createRequest(parameters);
    return transformStream(apiResponse);
  }

  /*************************
   * foundationModelSpecs
   ************************/

  /**
   * List the available foundation models.
   *
   * Retrieve the list of deployed foundation models.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
   * is 200.
   * @param {string} [params.filters] - A set of filters to specify the list of models, filters are described as the
   * `pattern` shown below.
   * ```text
   *  pattern: tfilter[,tfilter][:(or|and)]
   *  tfilter: filter | !filter
   *    filter: Requires existence of the filter.
   *    !filter: Requires absence of the filter.
   *  filter: one of
   *    modelid_*:     Filters by model id.
   *                   Namely, select a model with a specific model id.
   *    provider_*:    Filters by provider.
   *                   Namely, select all models with a specific provider.
   *    source_*:      Filters by source.
   *                   Namely, select all models with a specific source.
   *    input_tier_*:  Filters by input tier.
   *                   Namely, select all models with a specific input tier.
   *    output_tier_*: Filters by output tier.
   *                   Namely, select all models with a specific output tier.
   *    tier_*:        Filters by tier.
   *                   Namely, select all models with a specific input or output tier.
   *    task_*:        Filters by task id.
   *                   Namely, select all models that support a specific task id.
   *    lifecycle_*:   Filters by lifecycle state.
   *                   Namely, select all models that are currently in the specified lifecycle state.
   *    function_*:    Filters by function.
   *                   Namely, select all models that support a specific function.
   * ```.
   * @param {boolean} [params.techPreview] - See all the `Tech Preview` models if entitled.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModels>>}
   *
   * @category Foundation Model Specs
   */
  public listFoundationModelSpecs(
    params?: WatsonxAiMlVml_v1.ListFoundationModelSpecsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModels>> {
    const _params = { ...params };
    const _requiredParams = [];
    const _validParams = ['start', 'limit', 'filters', 'techPreview', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'start': _params.start,
      'limit': _params.limit,
      'filters': _params.filters,
      'tech_preview': _params.techPreview,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listFoundationModelSpecs'
    );

    const parameters = {
      options: {
        url: '/ml/v1/foundation_model_specs',
        method: 'GET',
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * List the supported tasks.
   *
   * Retrieve the list of tasks that are supported by the foundation models.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
   * is 200.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModelTasks>>}
   *
   * @category Foundation Model Specs
   */
  public listFoundationModelTasks(
    params?: WatsonxAiMlVml_v1.ListFoundationModelTasksParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModelTasks>> {
    const _params = { ...params };
    const _requiredParams = [];
    const _validParams = ['start', 'limit', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'start': _params.start,
      'limit': _params.limit,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listFoundationModelTasks'
    );

    const parameters = {
      options: {
        url: '/ml/v1/foundation_model_tasks',
        method: 'GET',
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }
  /*************************
   * prompts
   ************************/

  /**
   * Create a new prompt / prompt template.
   *
   * This creates a new prompt with the provided parameters.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - Name used to display the prompt.
   * @param {PromptWithExternal} params.prompt -
   * @param {string} [params.description] - An optional description for the prompt.
   * @param {number} [params.createdAt] - Time the prompt was created.
   * @param {string[]} [params.taskIds] -
   * @param {PromptLock} [params.lock] -
   * @param {WxPromptPostModelVersion} [params.modelVersion] -
   * @param {JsonObject} [params.promptVariables] -
   * @param {string} [params.inputMode] - Input mode in use for the prompt.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
   *
   * @category Prompts / Prompt Templates
   */
  public createPrompt(
    params: WatsonxAiMlVml_v1.PostPromptParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'prompt'];
    const _validParams = [
      'name',
      'prompt',
      'description',
      'createdAt',
      'taskIds',
      'lock',
      'modelVersion',
      'promptVariables',
      'inputMode',
      'projectId',
      'spaceId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'prompt': _params.prompt,
      'description': _params.description,
      'created_at': _params.createdAt,
      'task_ids': _params.taskIds,
      'lock': _params.lock,
      'model_version': _params.modelVersion,
      'prompt_variables': _params.promptVariables,
      'input_mode': _params.inputMode,
    };

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'postPrompt'
    );

    const parameters = {
      options: {
        url: '/v1/prompts',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get a prompt.
   *
   * This retrieves a prompt / prompt template with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {string} [params.restrictModelParameters] - Only return a set of model parameters compatiable with
   * inferencing.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
   *
   * @category Prompts / Prompt Templates
   */
  public getPrompt(
    params: WatsonxAiMlVml_v1.GetPromptParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>> {
    const _params = { ...params };
    const _requiredParams = ['promptId'];
    const _validParams = ['promptId', 'projectId', 'spaceId', 'restrictModelParameters', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'restrict_model_parameters': _params.restrictModelParameters,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPrompt');

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Update a prompt.
   *
   * This updates a prompt / prompt template with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {string} params.name - Name used to display the prompt.
   * @param {Prompt} params.prompt -
   * @param {string} [params.id] - The prompt's id. This value cannot be set. It is returned in responses only.
   * @param {string} [params.description] - An optional description for the prompt.
   * @param {string[]} [params.taskIds] -
   * @param {boolean} [params.governanceTracked] -
   * @param {WxPromptPatchModelVersion} [params.modelVersion] -
   * @param {JsonObject} [params.promptVariable] -
   * @param {string} [params.inputMode] - Input mode in use for the prompt.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
   *
   * @category Prompts / Prompt Templates
   */
  public updatePrompt(
    params: WatsonxAiMlVml_v1.PatchPromptParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>> {
    const _params = { ...params };
    const _requiredParams = ['promptId', 'name', 'prompt'];
    const _validParams = [
      'promptId',
      'name',
      'prompt',
      'id',
      'description',
      'taskIds',
      'governanceTracked',
      'modelVersion',
      'promptVariable',
      'inputMode',
      'projectId',
      'spaceId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'prompt': _params.prompt,
      'id': _params.id,
      'description': _params.description,
      'task_ids': _params.taskIds,
      'governance_tracked': _params.governanceTracked,
      'model_version': _params.modelVersion,
      'prompt_variable': _params.promptVariable,
      'input_mode': _params.inputMode,
    };

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'patchPrompt'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}',
        method: 'PATCH',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete a prompt.
   *
   * This delets a prompt / prompt template with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Prompts / Prompt Templates
   */
  public deletePrompt(
    params: WatsonxAiMlVml_v1.DeletePromptParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['promptId'];
    const _validParams = ['promptId', 'projectId', 'spaceId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deletePrompt'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(true, sdkHeaders, {}, _params.headers),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Prompt lock modifications.
   *
   * Modifies the current locked state of a prompt.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {boolean} params.locked - True if the prompt is currently locked.
   * @param {string} [params.lockType] - Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be
   * supplied in PUT /lock requests.
   * @param {string} [params.lockedBy] - Locked by is computed by the server and shouldn't be passed.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {boolean} [params.force] - Override a lock if it is currently taken.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
   *
   * @category Prompts / Prompt Templates
   */
  public updatePromptLock(
    params: WatsonxAiMlVml_v1.PutPromptLockParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>> {
    const _params = { ...params };
    const _requiredParams = ['promptId', 'locked'];
    const _validParams = [
      'promptId',
      'locked',
      'lockType',
      'lockedBy',
      'projectId',
      'spaceId',
      'force',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'locked': _params.locked,
      'lock_type': _params.lockType,
      'locked_by': _params.lockedBy,
    };

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'force': _params.force,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'putPromptLock'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}/lock',
        method: 'PUT',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get current prompt lock status.
   *
   * Retrieves the current locked state of a prompt.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
   *
   * @category Prompts / Prompt Templates
   */
  public getPromptLock(
    params: WatsonxAiMlVml_v1.GetPromptLockParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>> {
    const _params = { ...params };
    const _requiredParams = ['promptId'];
    const _validParams = ['promptId', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptLock'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}/lock',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get the inference input string for a given prompt.
   *
   * Computes the inference input string based on state of a prompt. Optionally replaces template params.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {string} [params.input] - Override input string that will be used to generate the response. The string can
   * contain template parameters.
   * @param {JsonObject} [params.promptVariable] - Supply only to replace placeholders. Object content must be key:value
   * pairs where the 'key' is the parameter to replace and 'value' is the value to use.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.GetPromptInputResponse>>}
   *
   * @category Prompts / Prompt Templates
   */
  public getPromptInput(
    params: WatsonxAiMlVml_v1.GetPromptInputParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.GetPromptInputResponse>> {
    const _params = { ...params };
    const _requiredParams = ['promptId'];
    const _validParams = ['promptId', 'input', 'promptVariable', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'prompt_variable': _params.promptVariable,
    };

    const query = {
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptInput'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}/input',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Add a new chat item to a prompt.
   *
   * This adds new chat items to the given prompt.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.promptId - Prompt ID.
   * @param {ChatItem[]} params.chatItem -
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Prompts / Prompt Templates
   */
  public createPromptChatItem(
    params: WatsonxAiMlVml_v1.PostPromptChatItemParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['promptId', 'chatItem'];
    const _validParams = ['promptId', 'chatItem', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = _params.chatItem;
    const query = {
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'prompt_id': _params.promptId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'postPromptChatItem'
    );

    const parameters = {
      options: {
        url: '/v1/prompts/{prompt_id}/chat_items',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }
  /*************************
   * promptSessions
   ************************/

  /**
   * Create a new prompt session.
   *
   * This creates a new prompt session.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - Name used to display the prompt session.
   * @param {string} [params.id] - The prompt session's id. This value cannot be set. It is returned in responses only.
   * @param {string} [params.description] - An optional description for the prompt session.
   * @param {number} [params.createdAt] - Time the session was created.
   * @param {string} [params.createdBy] - The ID of the original session creator.
   * @param {number} [params.lastUpdatedAt] - Time the session was updated.
   * @param {string} [params.lastUpdatedBy] - The ID of the last user that modifed the session.
   * @param {PromptLock} [params.lock] -
   * @param {WxPromptSessionEntry[]} [params.prompts] -
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
   *
   * @category Prompt Sessions
   */
  public createPromptSession(
    params: WatsonxAiMlVml_v1.PostPromptSessionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>> {
    const _params = { ...params };
    const _requiredParams = ['name'];
    const _validParams = [
      'name',
      'id',
      'description',
      'createdAt',
      'createdBy',
      'lastUpdatedAt',
      'lastUpdatedBy',
      'lock',
      'prompts',
      'projectId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'id': _params.id,
      'description': _params.description,
      'created_at': _params.createdAt,
      'created_by': _params.createdBy,
      'last_updated_at': _params.lastUpdatedAt,
      'last_updated_by': _params.lastUpdatedBy,
      'lock': _params.lock,
      'prompts': _params.prompts,
    };

    const query = {
      'project_id': _params.projectId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'postPromptSession'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get a prompt session.
   *
   * This retrieves a prompt session with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {boolean} [params.prefetch] - Include the most recent entry.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>>}
   *
   * @category Prompt Sessions
   */
  public getPromptSession(
    params: WatsonxAiMlVml_v1.GetPromptSessionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId'];
    const _validParams = ['sessionId', 'projectId', 'prefetch', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
      'prefetch': _params.prefetch,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptSession'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Update a prompt session.
   *
   * This updates a prompt session with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} [params.name] -
   * @param {string} [params.description] - An optional description for the prompt.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>>}
   *
   * @category Prompt Sessions
   */
  public updatePromptSession(
    params: WatsonxAiMlVml_v1.PatchPromptSessionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId'];
    const _validParams = ['sessionId', 'name', 'description', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'description': _params.description,
    };

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'patchPromptSession'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}',
        method: 'PATCH',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete a prompt session.
   *
   * This deletes a prompt session with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Prompt Sessions
   */
  public deletePromptSession(
    params: WatsonxAiMlVml_v1.DeletePromptSessionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId'];
    const _validParams = ['sessionId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deletePromptSession'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(true, sdkHeaders, {}, _params.headers),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Add a new prompt to a prompt session.
   *
   * This creates a new prompt associated with the given session.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} params.name - Name used to display the prompt.
   * @param {number} params.createdAt - Time the prompt was created.
   * @param {Prompt} params.prompt -
   * @param {string} [params.id] - The prompt's id. This value cannot be set. It is returned in responses only.
   * @param {string} [params.description] - An optional description for the prompt.
   * @param {JsonObject} [params.promptVariables] -
   * @param {boolean} [params.isTemplate] -
   * @param {string} [params.inputMode] - Input mode in use for the prompt.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntry>>}
   *
   * @category Prompt Sessions
   */
  public createPromptSessionEntry(
    params: WatsonxAiMlVml_v1.PostPromptSessionEntryParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntry>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId', 'name', 'createdAt', 'prompt'];
    const _validParams = [
      'sessionId',
      'name',
      'createdAt',
      'prompt',
      'id',
      'description',
      'promptVariables',
      'isTemplate',
      'inputMode',
      'projectId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'created_at': _params.createdAt,
      'prompt': _params.prompt,
      'id': _params.id,
      'description': _params.description,
      'prompt_variables': _params.promptVariables,
      'is_template': _params.isTemplate,
      'input_mode': _params.inputMode,
    };

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'postPromptSessionEntry'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/entries',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get entries for a prompt session.
   *
   * List entries from a given session.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.bookmark] - Bookmark from a previously limited get request.
   * @param {string} [params.limit] - Limit for results to retrieve, default 20.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntryList>>}
   *
   * @category Prompt Sessions
   */
  public listPromptSessionEntries(
    params: WatsonxAiMlVml_v1.GetPromptSessionEntriesParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntryList>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId'];
    const _validParams = ['sessionId', 'projectId', 'bookmark', 'limit', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
      'bookmark': _params.bookmark,
      'limit': _params.limit,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptSessionEntries'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/entries',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Add a new chat item to a prompt session entry.
   *
   * This adds new chat items to the given entry.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} params.entryId - Prompt Session Entry ID.
   * @param {ChatItem[]} params.chatItem -
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Prompt Sessions
   */
  public createPromptSessionEntryChatItem(
    params: WatsonxAiMlVml_v1.PostPromptSessionEntryChatItemParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId', 'entryId', 'chatItem'];
    const _validParams = ['sessionId', 'entryId', 'chatItem', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = _params.chatItem;
    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
      'entry_id': _params.entryId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'postPromptSessionEntryChatItem'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}/chat_items',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Prompt session lock modifications.
   *
   * Modifies the current locked state of a prompt session.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {boolean} params.locked - True if the prompt is currently locked.
   * @param {string} [params.lockType] - Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be
   * supplied in PUT /lock requests.
   * @param {string} [params.lockedBy] - Locked by is computed by the server and shouldn't be passed.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {boolean} [params.force] - Override a lock if it is currently taken.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
   *
   * @category Prompt Sessions
   */
  public updatePromptSessionLock(
    params: WatsonxAiMlVml_v1.PutPromptSessionLockParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId', 'locked'];
    const _validParams = [
      'sessionId',
      'locked',
      'lockType',
      'lockedBy',
      'projectId',
      'force',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'locked': _params.locked,
      'lock_type': _params.lockType,
      'locked_by': _params.lockedBy,
    };

    const query = {
      'project_id': _params.projectId,
      'force': _params.force,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'putPromptSessionLock'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/lock',
        method: 'PUT',
        body,
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get current prompt session lock status.
   *
   * Retrieves the current locked state of a prompt session.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
   *
   * @category Prompt Sessions
   */
  public getPromptSessionLock(
    params: WatsonxAiMlVml_v1.GetPromptSessionLockParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId'];
    const _validParams = ['sessionId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptSessionLock'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/lock',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Get a prompt session entry.
   *
   * This retrieves a prompt session entry with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} params.entryId - Prompt Session Entry ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
   *
   * @category Prompt Sessions
   */
  public getPromptSessionEntry(
    params: WatsonxAiMlVml_v1.GetPromptSessionEntryParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId', 'entryId'];
    const _validParams = ['sessionId', 'entryId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
      'entry_id': _params.entryId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getPromptSessionEntry'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete a prompt session entry.
   *
   * This deletes a prompt session entry with the given id.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.sessionId - Prompt Session ID.
   * @param {string} params.entryId - Prompt Session Entry ID.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Prompt Sessions
   */
  public deletePromptSessionEntry(
    params: WatsonxAiMlVml_v1.DeletePromptSessionEntryParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['sessionId', 'entryId'];
    const _validParams = ['sessionId', 'entryId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
    };

    const path = {
      'session_id': _params.sessionId,
      'entry_id': _params.entryId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deletePromptSessionEntry'
    );

    const parameters = {
      options: {
        url: '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        serviceUrl: this.wxServiceUrl,
        headers: extend(true, sdkHeaders, {}, _params.headers),
      }),
    };

    return this.createRequest(parameters);
  }
  /*************************
   * textEmbeddings
   ************************/

  /**
   * Generate embeddings.
   *
   * Generate embeddings from text input.
   *
   * See the
   * [documentation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-embed-overview.html?context=wx&audience=wdp)
   * for a description of text embeddings.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
   * @param {string[]} params.inputs - The input text.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {EmbeddingParameters} [params.parameters] - Parameters for text embedding requests.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmbeddingsResponse>>}
   *
   * @category Embeddings
   */
  public embedText(
    params: WatsonxAiMlVml_v1.TextEmbeddingsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmbeddingsResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'inputs'];
    const _validParams = ['modelId', 'inputs', 'spaceId', 'projectId', 'parameters', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'model_id': _params.modelId,
      'inputs': _params.inputs,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'parameters': _params.parameters,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textEmbeddings'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/embeddings',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }
  /*************************
   * textGeneration
   ************************/

  /**
   * Infer text.
   *
   * Infer the next tokens for a given deployed model with a set of parameters.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.input - The prompt to generate completions. Note: The method tokenizes the input internally.
   * It is recommended not to leave any trailing spaces.
   * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {TextGenParameters} [params.parameters] - Properties that control the model and response.
   * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
   * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
   * of moderations.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
   *
   * @category Text Generation
   */
  public generateText(
    params: WatsonxAiMlVml_v1.TextGenerationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>> {
    const _params = { ...params };
    const _requiredParams = ['input', 'modelId'];
    const _validParams = [
      'input',
      'modelId',
      'spaceId',
      'projectId',
      'parameters',
      'moderations',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'model_id': _params.modelId,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'parameters': _params.parameters,
      'moderations': _params.moderations,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textGeneration'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/generation',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Infer text event stream.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. This operation will return the output
   * tokens as a stream of events.
   *
   * ### Response
   * AsyncIterable<string> represents a source of streaming data. If request performed successfully AsyncIterable<string> returns
   * stream line by line. Output will stream as follow:
   * - id: 1
   * - event: message
   * - data: {data}
   * - empty line which separates the next Event Message
   *
   * Here is one of the possibilities to read streaming output:
   *
   * const stream = await watsonxAiMlService.generateTextStream(parameters);
   * for await (const line of stream) {
   *   console.log(line);
   * }
   *
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.input - The prompt to generate completions. Note: The method tokenizes the input internally.
   * It is recommended not to leave any trailing spaces.
   * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {TextGenParameters} [params.parameters] - Properties that control the model and response.
   * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
   * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
   * of moderations.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<AsyncIterable<string>>}
   *
   * @category Text Generation
   */
  public async generateTextStream(
    params: WatsonxAiMlVml_v1.TextGenerationStreamParams
  ): Promise<AsyncIterable<string>> {
    const _params = { ...params };
    const _requiredParams = ['input', 'modelId'];
    const _validParams = [
      'input',
      'modelId',
      'spaceId',
      'projectId',
      'parameters',
      'moderations',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'model_id': _params.modelId,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'parameters': _params.parameters,
      'moderations': _params.moderations,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textGenerationStream'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/generation_stream',
        method: 'POST',
        body,
        qs: query,
        responseType: 'stream',
        adapter: 'fetch',
      },

      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'text/event-stream',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };
    const apiResponse = await this.createRequest(parameters);
    return transformStream(apiResponse);
  }

  /*************************
   * tokenization
   ************************/

  /**
   * Text tokenization.
   *
   * The text tokenize operation allows you to check the conversion of provided input to tokens for a given model. It
   * splits text into words or sub-words, which then are converted to ids through a look-up table (vocabulary).
   * Tokenization allows the model to have a reasonable vocabulary size.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
   * @param {string} params.input - The input string to tokenize.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {TextTokenizeParameters} [params.parameters] - The parameters for text tokenization.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextTokenizeResponse>>}
   *
   * @category Tokenization
   */
  public tokenizeText(
    params: WatsonxAiMlVml_v1.TextTokenizationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextTokenizeResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'input'];
    const _validParams = ['modelId', 'input', 'spaceId', 'projectId', 'parameters', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'model_id': _params.modelId,
      'input': _params.input,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'parameters': _params.parameters,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textTokenization'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/tokenization',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }
  /*************************
   * trainings
   ************************/

  /**
   * Create a new watsonx.ai training.
   *
   * Create a new watsonx.ai training in a project or a space.
   *
   * The details of the base model and parameters for the training must be provided in the `prompt_tuning` object.
   *
   *
   * In order to deploy the tuned model you need to follow the following steps:
   *
   *   1. Create a WML model asset, in a space or a project,
   *      by providing the `request.json` as shown below:
   *        ```
   *        curl -X POST 'https://{cpd_cluster}/ml/v4/models?version=2024-01-29' \
   *          -H 'Authorization: Bearer <replace with your token>' \
   *          -H 'content-type: application/json' \
   *          --data '{
   *             'name': 'replace_with_a_meaningful_name',
   *             'space_id': 'replace_with_your_space_id',
   *             'type': 'prompt_tune_1.0',
   *             'software_spec': {
   *               'name': 'watsonx-textgen-fm-1.0'
   *             },
   *             'metrics': [ from the training job ],
   *             'training': {
   *               'id': '05859469-b25b-420e-aefe-4a5cb6b595eb',
   *               'base_model': {
   *                 'model_id': 'google/flan-t5-xl'
   *               },
   *               'task_id': 'generation',
   *               'verbalizer': 'Input: {{input}} Output:'
   *             },
   *             'training_data_references': [
   *               {
   *                 'connection': {
   *                   'id': '20933468-7e8a-4706-bc90-f0a09332b263'
   *                 },
   *                 'id': 'file_to_tune1.json',
   *                 'location': {
   *                   'bucket': 'wxproject-donotdelete-pr-xeyivy0rx3vrbl',
   *                   'path': 'file_to_tune1.json'
   *                 },
   *                 'type': 'connection_asset'
   *               }
   *             ]
   *           }'
   *        ```
   *
   *
   *        **Notes:**
   *
   *        1. If you used the training request field `auto_update_model: true`
   *        then you can skip this step as the model will have been saved at
   *        the end of the training job.
   *        1. Rather than creating the payload for the model you can use the
   *           generated `request.json` that was stored in the `results_reference`
   *           field, look for the path in the field
   *           `entity.results_reference.location.model_request_path`.
   *        1. The model `type` must be `prompt_tune_1.0`.
   *        1. The software spec name must be `watsonx-textgen-fm-1.0`.
   *
   *   1. Create a tuned model deployment as described in the
   *      [create deployment documentation](#create-deployment).
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the training.
   * @param {ObjectLocation} params.resultsReference - The training results. Normally this is specified as
   * `type=container` which
   * means that it is stored in the space or project.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.description] - A description of the training.
   * @param {string[]} [params.tags] - A list of tags for this resource.
   * @param {PromptTuning} [params.promptTuning] - Properties to control the prompt tuning.
   * @param {DataConnectionReference[]} [params.trainingDataReferences] - Training datasets.
   * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
   * @param {boolean} [params.autoUpdateModel] - If set to `true` then the result of the training, if successful, will
   * be uploaded to the repository as a model.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>>}
   *
   * @category Trainings
   */
  public createTraining(
    params: WatsonxAiMlVml_v1.TrainingsCreateParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'resultsReference'];
    const _validParams = [
      'name',
      'resultsReference',
      'spaceId',
      'projectId',
      'description',
      'tags',
      'promptTuning',
      'trainingDataReferences',
      'custom',
      'autoUpdateModel',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'results_reference': _params.resultsReference,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'description': _params.description,
      'tags': _params.tags,
      'prompt_tuning': _params.promptTuning,
      'training_data_references': _params.trainingDataReferences,
      'custom': _params.custom,
      'auto_update_model': _params.autoUpdateModel,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'trainingsCreate'
    );

    const parameters = {
      options: {
        url: '/ml/v4/trainings',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the list of trainings.
   *
   * Retrieve the list of trainings for the specified space or project.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
   * is 200.
   * @param {boolean} [params.totalCount] - Compute the total count. May have performance impact.
   * @param {string} [params.tagValue] - Return only the resources with the given tag value.
   * @param {string} [params.state] - Filter based on on the training job state.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResourceCollection>>}
   *
   * @category Trainings
   */
  public listTrainings(
    params?: WatsonxAiMlVml_v1.TrainingsListParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResourceCollection>> {
    const _params = { ...params };
    const _requiredParams = [];
    const _validParams = [
      'start',
      'limit',
      'totalCount',
      'tagValue',
      'state',
      'spaceId',
      'projectId',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'start': _params.start,
      'limit': _params.limit,
      'total_count': _params.totalCount,
      'tag.value': _params.tagValue,
      'state': _params.state,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'trainingsList'
    );

    const parameters = {
      options: {
        url: '/ml/v4/trainings',
        method: 'GET',
        qs: query,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the training.
   *
   * Retrieve the training with the specified identifier.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.trainingId - The training identifier.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>>}
   *
   * @category Trainings
   */
  public getTraining(
    params: WatsonxAiMlVml_v1.TrainingsGetParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>> {
    const _params = { ...params };
    const _requiredParams = ['trainingId'];
    const _validParams = ['trainingId', 'spaceId', 'projectId', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
    };

    const path = {
      'training_id': _params.trainingId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'trainingsGet'
    );

    const parameters = {
      options: {
        url: '/ml/v4/trainings/{training_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(
          true,
          sdkHeaders,
          {
            'Accept': 'application/json',
          },
          _params.headers
        ),
      }),
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel the training.
   *
   * Cancel the specified training and remove it.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.trainingId - The training identifier.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job metadata information.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   *
   * @category Trainings
   */
  public deleteTraining(
    params: WatsonxAiMlVml_v1.TrainingsDeleteParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['trainingId'];
    const _validParams = ['trainingId', 'spaceId', 'projectId', 'hardDelete', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'hard_delete': _params.hardDelete,
    };

    const path = {
      'training_id': _params.trainingId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'trainingsDelete'
    );

    const parameters = {
      options: {
        url: '/ml/v4/trainings/{training_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: extend(true, sdkHeaders, {}, _params.headers),
      }),
    };

    return this.createRequest(parameters);
  }
}

/*************************
 * interfaces
 ************************/

namespace WatsonxAiMlVml_v1 {
  /** Options for the `WatsonxAiMlVml_v1` constructor. */
  export interface Options extends UserOptions {
    /** The version date for the API of the form `YYYY-MM-DD`. */
    version: string;
  }

  /** An operation response. */
  export interface Response<T = any> {
    result: T;
    status: number;
    statusText: string;
    headers: IncomingHttpHeaders;
  }

  /** The callback for a service request. */
  export type Callback<T> = (error: any, response?: Response<T>) => void;

  /** The body of a service request that returns no response data. */
  export interface EmptyObject {}

  /** A standard JS object, defined to avoid the limitations of `Object` and `object` */
  export interface JsonObject {
    [key: string]: any;
  }

  /*************************
   * request interfaces
   ************************/

  /** Parameters for the `createDeployment` operation. */
  export interface CreateDeploymentParams {
    /** The name of the resource. */
    name: string;
    /** Indicates that this is an online deployment. An object has to be specified but can be empty.
     *  The `serving_name` can be provided in the `online.parameters`.
     */
    online: OnlineDeployment;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** A description of the resource. */
    description?: string;
    /** A list of tags for this resource. */
    tags?: string[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** A reference to a resource. */
    promptTemplate?: SimpleRel;
    /** A hardware specification. */
    hardwareSpec?: HardwareSpec;
    /** A reference to a resource. */
    asset?: Rel;
    /** The base model that is required for this deployment if this is for a prompt template or a prompt tune for an
     *  IBM foundation model.
     */
    baseModelId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `listDeployments` operation. */
  export interface ListDeploymentsParams {
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Retrieves the deployment, if any, that contains this `serving_name`. */
    servingName?: string;
    /** Retrieves only the resources with the given tag value. */
    tagValue?: string;
    /** Retrieves only the resources with the given asset_id, asset_id would be the model id. */
    assetId?: string;
    /** Retrieves only the resources with the given prompt_template_id. */
    promptTemplateId?: string;
    /** Retrieves only the resources with the given name. */
    name?: string;
    /** Retrieves the resources filtered with the given type. There are the deployment types as well as an
     *  additional
     *  `prompt_template` if the deployment type includes a prompt template.
     *
     *  The supported deployment types are (see the description for `deployed_asset_type` in the deployment entity):
     *
     *  1. `prompt_tune` - when a prompt tuned model is deployed. 2. `foundation_model` - when a prompt template is used
     *  on a pre-deployed IBM provided model.
     *
     *  These can be combined with the flag `prompt_template` like this:
     *
     *  1. `type=prompt_tune` - return all prompt tuned model deployments. 2. `type=prompt_tune and prompt_template` -
     *  return all prompt tuned model deployments with a prompt template. 3. `type=foundation_model` - return all prompt
     *  template deployments. 4. `type=foundation_model and prompt_template` - return all prompt template deployments -
     *  this is the same as the previous query because a `foundation_model` can only exist with a prompt template. 5.
     *  `type=prompt_template` - return all deployments with a prompt template.
     */
    type?: string;
    /** Retrieves the resources filtered by state. Allowed values are `initializing`, `updating`, `ready` and
     *  `failed`.
     */
    state?: string;
    /** Returns whether `serving_name` is available for use or not. This query parameter cannot be combined with any
     *  other parameter except for `serving_name`.
     */
    conflict?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deploymentsGet` operation. */
  export interface DeploymentsGetParams {
    /** The deployment id. */
    deploymentId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deploymentsUpdate` operation. */
  export interface DeploymentsUpdateParams {
    /** The deployment id. */
    deploymentId: string;
    /** The json patch. */
    jsonPatch: JsonPatchOperation[];
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deploymentsDelete` operation. */
  export interface DeploymentsDeleteParams {
    /** The deployment id. */
    deploymentId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deploymentsTextGeneration` operation. */
  export interface DeploymentsTextGenerationParams {
    /** The `id_or_name` can be either the `deployment_id` that identifies the deployment or a `serving_name` that
     *  allows a predefined URL to be used to post a prediction.
     *
     *  The `project` or `space` for the deployment must have a WML instance that will be used for limits and billing
     *  (if a paid plan).
     */
    idOrName: string;
    /** The prompt to generate completions. Note: The method tokenizes the input internally. It is recommended not
     *  to leave any trailing spaces.
     *
     *
     *  This field is ignored if there is a prompt template.
     */
    input?: string;
    /** The template properties if this request refers to a prompt template. */
    parameters?: DeploymentTextGenProperties;
    /** Properties that control the moderations, for usages such as `Hate and profanity` (HAP) and `Personal
     *  identifiable information` (PII) filtering. This list can be extended with new types of moderations.
     */
    moderations?: Moderations;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deploymentsTextGenerationStream` operation. */
  export interface DeploymentsTextGenerationStreamParams {
    /** The `id_or_name` can be either the `deployment_id` that identifies the deployment or a `serving_name` that
     *  allows a predefined URL to be used to post a prediction.
     *
     *  The `project` or `space` for the deployment must have a WML instance that will be used for limits and billing
     *  (if a paid plan).
     */
    idOrName: string;
    /** The prompt to generate completions. Note: The method tokenizes the input internally. It is recommended not
     *  to leave any trailing spaces.
     *
     *
     *  This field is ignored if there is a prompt template.
     */
    input?: string;
    /** The template properties if this request refers to a prompt template. */
    parameters?: DeploymentTextGenProperties;
    /** Properties that control the moderations, for usages such as `Hate and profanity` (HAP) and `Personal
     *  identifiable information` (PII) filtering. This list can be extended with new types of moderations.
     */
    moderations?: Moderations;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `listFoundationModelSpecs` operation. */
  export interface ListFoundationModelSpecsParams {
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
    /** A set of filters to specify the list of models, filters are described as the `pattern` shown below.
     *  ```text
     *   pattern: tfilter[,tfilter][:(or|and)]
     *   tfilter: filter | !filter
     *     filter: Requires existence of the filter.
     *     !filter: Requires absence of the filter.
     *   filter: one of
     *     modelid_*:     Filters by model id.
     *                    Namely, select a model with a specific model id.
     *     provider_*:    Filters by provider.
     *                    Namely, select all models with a specific provider.
     *     source_*:      Filters by source.
     *                    Namely, select all models with a specific source.
     *     input_tier_*:  Filters by input tier.
     *                    Namely, select all models with a specific input tier.
     *     output_tier_*: Filters by output tier.
     *                    Namely, select all models with a specific output tier.
     *     tier_*:        Filters by tier.
     *                    Namely, select all models with a specific input or output tier.
     *     task_*:        Filters by task id.
     *                    Namely, select all models that support a specific task id.
     *     lifecycle_*:   Filters by lifecycle state.
     *                    Namely, select all models that are currently in the specified lifecycle state.
     *     function_*:    Filters by function.
     *                    Namely, select all models that support a specific function.
     *  ```.
     */
    filters?: string;
    /** See all the `Tech Preview` models if entitled. */
    techPreview?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `listFoundationModelTasks` operation. */
  export interface ListFoundationModelTasksParams {
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `notebooksCreate` operation. */
  export interface NotebooksCreateParams {
    /** Specification of the notebook to be created. */
    notebooksCreateRequest: NotebooksCreateRequest;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `notebooksList` operation. */
  export interface NotebooksListParams {
    /** The guid of the project. */
    projectId: string;
    /** Additional info that will be included into the notebook details. Possible values are: - runtime. */
    include: string;
    /** The list of notebooks whose details will be retrieved. */
    notebooks?: string[];
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `notebooksDelete` operation. */
  export interface NotebooksDeleteParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `notebooksRevert` operation. */
  export interface NotebooksRevertParams {
    /** The guid of the main notebook. */
    notebookGuid: string;
    /** The guid of the notebook version. */
    source: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `notebooksUpdate` operation. */
  export interface NotebooksUpdateParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    /** The guid of the environment on which the notebook runs. */
    environment?: string;
    /** Spark monitoring enabled or not. */
    sparkMonitoringEnabled?: boolean;
    /** A notebook kernel. */
    kernel?: NotebookKernel;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `versionsCreate` operation. */
  export interface VersionsCreateParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `versionsList` operation. */
  export interface VersionsListParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `versionsGet` operation. */
  export interface VersionsGetParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    /** The guid of the version. */
    versionGuid: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `versionsDelete` operation. */
  export interface VersionsDeleteParams {
    /** The guid of the notebook. */
    notebookGuid: string;
    /** The guid of the version. */
    versionGuid: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `postPrompt` operation. */
  export interface PostPromptParams {
    /** Name used to display the prompt. */
    name: string;
    prompt: PromptWithExternal;
    /** An optional description for the prompt. */
    description?: string;
    /** Time the prompt was created. */
    createdAt?: number;
    taskIds?: string[];
    lock?: PromptLock;
    modelVersion?: WxPromptPostModelVersion;
    promptVariables?: JsonObject;
    /** Input mode in use for the prompt. */
    inputMode?: PostPromptConstants.InputMode | string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `postPrompt` operation. */
  export namespace PostPromptConstants {
    /** Input mode in use for the prompt. */
    export enum InputMode {
      STRUCTURED = 'structured',
      FREEFORM = 'freeform',
      CHAT = 'chat',
      DETACHED = 'detached',
    }
  }

  /** Parameters for the `getPrompt` operation. */
  export interface GetPromptParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** Only return a set of model parameters compatiable with inferencing. */
    restrictModelParameters?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `patchPrompt` operation. */
  export interface PatchPromptParams {
    /** Prompt ID. */
    promptId: string;
    /** Name used to display the prompt. */
    name: string;
    prompt: Prompt;
    /** The prompt's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** An optional description for the prompt. */
    description?: string;
    taskIds?: string[];
    governanceTracked?: boolean;
    modelVersion?: WxPromptPatchModelVersion;
    promptVariable?: JsonObject;
    /** Input mode in use for the prompt. */
    inputMode?: PatchPromptConstants.InputMode | string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `patchPrompt` operation. */
  export namespace PatchPromptConstants {
    /** Input mode in use for the prompt. */
    export enum InputMode {
      STRUCTURED = 'structured',
      FREEFORM = 'freeform',
    }
  }

  /** Parameters for the `deletePrompt` operation. */
  export interface DeletePromptParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `putPromptLock` operation. */
  export interface PutPromptLockParams {
    /** Prompt ID. */
    promptId: string;
    /** True if the prompt is currently locked. */
    locked: boolean;
    /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock
     *  requests.
     */
    lockType?: PutPromptLockConstants.LockType | string;
    /** Locked by is computed by the server and shouldn't be passed. */
    lockedBy?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** Override a lock if it is currently taken. */
    force?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `putPromptLock` operation. */
  export namespace PutPromptLockConstants {
    /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock requests. */
    export enum LockType {
      EDIT = 'edit',
      GOVERNANCE = 'governance',
    }
  }

  /** Parameters for the `getPromptLock` operation. */
  export interface GetPromptLockParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getPromptInput` operation. */
  export interface GetPromptInputParams {
    /** Prompt ID. */
    promptId: string;
    /** Override input string that will be used to generate the response. The string can contain template
     *  parameters.
     */
    input?: string;
    /** Supply only to replace placeholders. Object content must be key:value pairs where the 'key' is the parameter
     *  to replace and 'value' is the value to use.
     */
    promptVariable?: JsonObject;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `postPromptChatItem` operation. */
  export interface PostPromptChatItemParams {
    /** Prompt ID. */
    promptId: string;
    chatItem: ChatItem[];
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `postPromptSession` operation. */
  export interface PostPromptSessionParams {
    /** Name used to display the prompt session. */
    name: string;
    /** The prompt session's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** An optional description for the prompt session. */
    description?: string;
    /** Time the session was created. */
    createdAt?: number;
    /** The ID of the original session creator. */
    createdBy?: string;
    /** Time the session was updated. */
    lastUpdatedAt?: number;
    /** The ID of the last user that modifed the session. */
    lastUpdatedBy?: string;
    lock?: PromptLock;
    prompts?: WxPromptSessionEntry[];
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getPromptSession` operation. */
  export interface GetPromptSessionParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** Include the most recent entry. */
    prefetch?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `patchPromptSession` operation. */
  export interface PatchPromptSessionParams {
    /** Prompt Session ID. */
    sessionId: string;
    name?: string;
    /** An optional description for the prompt. */
    description?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deletePromptSession` operation. */
  export interface DeletePromptSessionParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `postPromptSessionEntry` operation. */
  export interface PostPromptSessionEntryParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Name used to display the prompt. */
    name: string;
    /** Time the prompt was created. */
    createdAt: number;
    prompt: Prompt;
    /** The prompt's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** An optional description for the prompt. */
    description?: string;
    promptVariables?: JsonObject;
    isTemplate?: boolean;
    /** Input mode in use for the prompt. */
    inputMode?: PostPromptSessionEntryConstants.InputMode | string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `postPromptSessionEntry` operation. */
  export namespace PostPromptSessionEntryConstants {
    /** Input mode in use for the prompt. */
    export enum InputMode {
      STRUCTURED = 'structured',
      FREEFORM = 'freeform',
      CHAT = 'chat',
    }
  }

  /** Parameters for the `getPromptSessionEntries` operation. */
  export interface GetPromptSessionEntriesParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** Bookmark from a previously limited get request. */
    bookmark?: string;
    /** Limit for results to retrieve, default 20. */
    limit?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `postPromptSessionEntryChatItem` operation. */
  export interface PostPromptSessionEntryChatItemParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    chatItem: ChatItem[];
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `putPromptSessionLock` operation. */
  export interface PutPromptSessionLockParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** True if the prompt is currently locked. */
    locked: boolean;
    /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock
     *  requests.
     */
    lockType?: PutPromptSessionLockConstants.LockType | string;
    /** Locked by is computed by the server and shouldn't be passed. */
    lockedBy?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** Override a lock if it is currently taken. */
    force?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `putPromptSessionLock` operation. */
  export namespace PutPromptSessionLockConstants {
    /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock requests. */
    export enum LockType {
      EDIT = 'edit',
      GOVERNANCE = 'governance',
    }
  }

  /** Parameters for the `getPromptSessionLock` operation. */
  export interface GetPromptSessionLockParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getPromptSessionEntry` operation. */
  export interface GetPromptSessionEntryParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deletePromptSessionEntry` operation. */
  export interface DeletePromptSessionEntryParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `textEmbeddings` operation. */
  export interface TextEmbeddingsParams {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     */
    modelId: string;
    /** The input text. */
    inputs: string[];
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** Parameters for text embedding requests. */
    parameters?: EmbeddingParameters;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `textGeneration` operation. */
  export interface TextGenerationParams {
    /** The prompt to generate completions. Note: The method tokenizes the input internally. It is recommended not
     *  to leave any trailing spaces.
     */
    input: string;
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     */
    modelId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** Properties that control the model and response. */
    parameters?: TextGenParameters;
    /** Properties that control the moderations, for usages such as `Hate and profanity` (HAP) and `Personal
     *  identifiable information` (PII) filtering. This list can be extended with new types of moderations.
     */
    moderations?: Moderations;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `textGenerationStream` operation. */
  export interface TextGenerationStreamParams {
    /** The prompt to generate completions. Note: The method tokenizes the input internally. It is recommended not
     *  to leave any trailing spaces.
     */
    input: string;
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     */
    modelId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** Properties that control the model and response. */
    parameters?: TextGenParameters;
    /** Properties that control the moderations, for usages such as `Hate and profanity` (HAP) and `Personal
     *  identifiable information` (PII) filtering. This list can be extended with new types of moderations.
     */
    moderations?: Moderations;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `textTokenization` operation. */
  export interface TextTokenizationParams {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     */
    modelId: string;
    /** The input string to tokenize. */
    input: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The parameters for text tokenization. */
    parameters?: TextTokenizeParameters;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `trainingsCreate` operation. */
  export interface TrainingsCreateParams {
    /** The name of the training. */
    name: string;
    /** The training results. Normally this is specified as `type=container` which
     *  means that it is stored in the space or project.
     */
    resultsReference: ObjectLocation;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** A description of the training. */
    description?: string;
    /** A list of tags for this resource. */
    tags?: string[];
    /** Properties to control the prompt tuning. */
    promptTuning?: PromptTuning;
    /** Training datasets. */
    trainingDataReferences?: DataConnectionReference[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** If set to `true` then the result of the training, if successful, will be uploaded to the repository as a
     *  model.
     */
    autoUpdateModel?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `trainingsList` operation. */
  export interface TrainingsListParams {
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
    /** Compute the total count. May have performance impact. */
    totalCount?: boolean;
    /** Return only the resources with the given tag value. */
    tagValue?: string;
    /** Filter based on on the training job state. */
    state?: TrainingsListConstants.State | string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `trainingsList` operation. */
  export namespace TrainingsListConstants {
    /** Filter based on on the training job state. */
    export enum State {
      QUEUED = 'queued',
      PENDING = 'pending',
      RUNNING = 'running',
      STORING = 'storing',
      COMPLETED = 'completed',
      FAILED = 'failed',
      CANCELED = 'canceled',
    }
  }

  /** Parameters for the `trainingsGet` operation. */
  export interface TrainingsGetParams {
    /** The training identifier. */
    trainingId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `trainingsDelete` operation. */
  export interface TrainingsDeleteParams {
    /** The training identifier. */
    trainingId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Set to true in order to also delete the job metadata information. */
    hardDelete?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /*************************
   * model interfaces
   ************************/

  /** An error message. */
  export interface ApiError {
    /** A simple code that should convey the general sense of the error. */
    code: string;
    /** The message that describes the error. */
    message: string;
    /** A reference to a more detailed explanation when available. */
    more_info?: string;
    /** The target of the error. */
    target?: ApiErrorTarget;
  }

  /** The data returned when an error is encountered. */
  export interface ApiErrorResponse {
    /** An identifier that can be used to trace the request. */
    trace: string;
    /** The list of errors. */
    errors: ApiError[];
  }

  /** The target of the error. */
  export interface ApiErrorTarget {
    /** The type of the problematic field. */
    type: ApiErrorTarget.Constants.Type | string;
    /** The name of the problematic field. */
    name: string;
  }
  export namespace ApiErrorTarget {
    export namespace Constants {
      /** The type of the problematic field. */
      export enum Type {
        FIELD = 'field',
        QUERY = 'query',
        HEADER = 'header',
      }
    }
  }

  /** The model id of the base model for this prompt tuning. */
  export interface BaseModel {
    /** The model id of the base model. */
    model_id?: string;
  }

  /** The limits that may be set per request. */
  export interface ConsumptionsLimit {
    /** The hard limit on the call time for a request, if set. */
    call_time?: string;
    /** The hard limit on the number of input tokens for a request, if set. A value of zero will disable this
     *  feature.
     */
    max_input_tokens?: number;
    /** The hard limit on the number of output tokens for a request, if set. A value of zero will disable this
     *  feature.
     */
    max_output_tokens?: number;
  }

  /** Contains a set of fields specific to each connection. See here for [details about specifying connections](#datareferences). */
  export interface DataConnection {
    /** DataConnection accepts additional properties. */
    [propName: string]: any;
  }

  /** A reference to data with an optional data schema. If necessary, it is possible to provide a data connection that contains just the data schema. */
  export interface DataConnectionReference {
    /** Optional item identification inside a collection. */
    id?: string;
    /** The data source type like `connection_asset` or `data_asset`. If the data connection contains just a schema
     *  then this field is not required.
     */
    type: DataConnectionReference.Constants.Type | string;
    /** Contains a set of fields specific to each connection.
     *  See here for [details about specifying connections](#datareferences).
     */
    connection?: DataConnection;
    /** Contains a set of fields that describe the location of the data with respect to the `connection`. */
    location?: JsonObject;
    /** The schema of the expected data, see
     *  [datarecord-metadata-v2-schema](https://raw.githubusercontent.com/elyra-ai/pipeline-schemas/master/common-pipeline/datarecord-metadata/datarecord-metadata-v2-schema.json)
     *  for the schema definition.
     */
    schema?: DataSchema;
  }
  export namespace DataConnectionReference {
    export namespace Constants {
      /** The data source type like `connection_asset` or `data_asset`. If the data connection contains just a schema then this field is not required. */
      export enum Type {
        CONNECTION_ASSET = 'connection_asset',
        DATA_ASSET = 'data_asset',
        CONTAINER = 'container',
        URL = 'url',
      }
    }
  }

  /** The schema of the expected data, see [datarecord-metadata-v2-schema](https://raw.githubusercontent.com/elyra-ai/pipeline-schemas/master/common-pipeline/datarecord-metadata/datarecord-metadata-v2-schema.json) for the schema definition. */
  export interface DataSchema {
    /** An id to identify a schema. */
    id: string;
    /** A name for the schema. */
    name?: string;
    /** The fields that describe the data schema. */
    fields: JsonObject[];
    /** The type of the schema, can be ignored or set to `struct` or `DataFrame`. */
    type?: string;
  }

  /** The definition of the deployment. */
  export interface DeploymentEntity {
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** A reference to a resource. */
    prompt_template?: SimpleRel;
    /** Indicates that this is an online deployment. An object has to be specified but can be empty.
     *  The `serving_name` can be provided in the `online.parameters`.
     */
    online: OnlineDeployment;
    /** A hardware specification. */
    hardware_spec?: HardwareSpec;
    /** A reference to a resource. */
    asset?: ModelRel;
    /** The base model that is required for this deployment if this is for a prompt template or a prompt tune for an
     *  IBM foundation model.
     */
    base_model_id?: string;
    /** The type of the deployed model. The possible values are the following: 1. `prompt_tune` - when a prompt
     *  tuned model is deployed. 2. `foundation_model` - when a prompt template is used on a pre-deployed IBM provided
     *  model.
     */
    deployed_asset_type?: DeploymentEntity.Constants.DeployedAssetType | string;
    /** The verbalizer that was used to train this model if the deployment has `deployed_asset_type` of
     *  `prompt_tune`.
     */
    verbalizer?: string;
    /** Specifies the current status, additional information about the deployment
     *  and any failure messages in case of deployment failures.
     */
    status?: DeploymentStatus;
  }
  export namespace DeploymentEntity {
    export namespace Constants {
      /** The type of the deployed model. The possible values are the following: 1. `prompt_tune` - when a prompt tuned model is deployed. 2. `foundation_model` - when a prompt template is used on a pre-deployed IBM provided model. */
      export enum DeployedAssetType {
        PROMPT_TUNE = 'prompt_tune',
        FOUNDATION_MODEL = 'foundation_model',
      }
    }
  }

  /** A deployment resource. */
  export interface DeploymentResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** The definition of the deployment. */
    entity?: DeploymentEntity;
  }

  /** The deployment resources. */
  export interface DeploymentResourceCollection {
    /** The total number of resources. Computed explicitly only when 'total_count=true' query parameter is present.
     *  This is in order to avoid performance penalties.
     */
    total_count?: number;
    /** The number of items to return in each page. */
    limit: number;
    /** The reference to the first item in the current page. */
    first: PaginationFirst;
    /** A reference to the first item of the next page, if any. */
    next?: PaginationNext;
    /** A list of deployment resources. */
    resources?: DeploymentResource[];
    /** System details including warnings. */
    system?: DeploymentSystem;
  }

  /** The common fields that can be patched. This is a helper for `cpdctl`. */
  export interface DeploymentResourcePatch {
    /** A list of tags for this resource. */
    tags?: string[];
    /** The name of the resource. */
    name?: string;
    /** A description of the resource. */
    description?: string;
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** A reference to a resource. */
    asset?: Rel;
  }

  /** Specifies the current status, additional information about the deployment and any failure messages in case of deployment failures. */
  export interface DeploymentStatus {
    /** Specifies the current state of the deployment. */
    state?: DeploymentStatus.Constants.State | string;
    /** Optional messages related to the deployment. */
    message?: Message;
    /** The data returned when an error is encountered. */
    failure?: ApiErrorResponse;
    /** The URLs that can be used to submit inference API requests. These URLs will contain the
     *  `deployment_id` and the `serving_name`, if the `serving_name` was set.
     */
    inference?: Inference[];
  }
  export namespace DeploymentStatus {
    export namespace Constants {
      /** Specifies the current state of the deployment. */
      export enum State {
        INITIALIZING = 'initializing',
        UPDATING = 'updating',
        READY = 'ready',
        FAILED = 'failed',
      }
    }
  }

  /** System details including warnings. */
  export interface DeploymentSystem {
    /** Optional details provided by the service about statistics of the number of deployments created. The
     *  deployments that are counted will depend on the request parameters.
     */
    system?: DeploymentSystemDetails;
  }

  /** Optional details provided by the service about statistics of the number of deployments created. The deployments that are counted will depend on the request parameters. */
  export interface DeploymentSystemDetails {
    /** Any warnings coming from the system. */
    warnings?: Warning[];
    /** The stats about deployments. */
    stats?: Stats[];
  }

  /** The template properties if this request refers to a prompt template. */
  export interface DeploymentTextGenProperties {
    /** Represents the strategy used for picking the tokens during generation of the output text.
     *
     *  During text generation when parameter value is set to greedy, each successive token corresponds to the highest
     *  probability token given the text that has already been generated. This strategy can lead to repetitive results
     *  especially for longer output sequences. The alternative sample strategy generates text by picking subsequent
     *  tokens based on the probability distribution of possible next tokens defined by (i.e., conditioned on) the
     *  already-generated text and the top_k and top_p parameters described below. See this
     *  [url](https://huggingface.co/blog/how-to-generate) for an informative article about text generation.
     */
    decoding_method?: DeploymentTextGenProperties.Constants.DecodingMethod | string;
    /** It can be used to exponentially increase the likelihood of the text generation terminating once a specified
     *  number of tokens have been generated.
     */
    length_penalty?: TextGenLengthPenalty;
    /** The maximum number of new tokens to be generated. The maximum supported value for this field depends on the
     *  model being used.
     *
     *  How the 'token' is defined depends on the tokenizer and vocabulary size, which in turn depends on the model.
     *  Often the tokens are a mix of full words and sub-words. To learn more about tokenization, [see
     *  here](https://huggingface.co/course/chapter2/4).
     *
     *  Depending on the users plan, and on the model being used, there may be an enforced maximum number of new tokens.
     */
    max_new_tokens?: number;
    /** If stop sequences are given, they are ignored until minimum tokens are generated. */
    min_new_tokens?: number;
    /** Random number generator seed to use in sampling mode for experimental repeatability. */
    random_seed?: number;
    /** Stop sequences are one or more strings which will cause the text generation to stop if/when they are
     *  produced as part of the output. Stop sequences encountered prior to the minimum number of tokens being generated
     *  will be ignored.
     */
    stop_sequences?: string[];
    /** A value used to modify the next-token probabilities in sampling mode. Values less than 1.0 sharpen the
     *  probability distribution, resulting in "less random" output. Values greater than 1.0 flatten the probability
     *  distribution, resulting in "more random" output. A value of 1.0 has no effect.
     */
    temperature?: number;
    /** Time limit in milliseconds - if not completed within this time, generation will stop. The text generated so
     *  far will be returned along with the TIME_LIMIT stop reason.
     *
     *  Depending on the users plan, and on the model being used, there may be an enforced maximum time limit.
     */
    time_limit?: number;
    /** The number of highest probability vocabulary tokens to keep for top-k-filtering. Only applies for sampling
     *  mode. When decoding_strategy is set to sample, only the top_k most likely tokens are considered as candidates
     *  for the next generated token.
     */
    top_k?: number;
    /** Similar to top_k except the candidates to generate the next token are the most likely tokens with
     *  probabilities that add up to at least top_p. Also known as nucleus sampling. A value of 1.0 is equivalent to
     *  disabled.
     */
    top_p?: number;
    /** Represents the penalty for penalizing tokens that have already been generated or belong to the context. The
     *  value 1.0 means that there is no penalty.
     */
    repetition_penalty?: number;
    /** Represents the maximum number of input tokens accepted. This can be used to avoid requests failing due to
     *  input being longer than configured limits. If the text is truncated, then it truncates the start of the input
     *  (on the left), so the end of the input will remain the same. If this value exceeds the `maximum sequence length`
     *  (refer to the documentation to find this value for the model) then the call will fail if the total number of
     *  tokens exceeds the `maximum sequence length`. Zero means don't truncate.
     */
    truncate_input_tokens?: number;
    /** Properties that control what is returned. */
    return_options?: ReturnOptionProperties;
    /** Pass `false` to omit matched stop sequences from the end of the output text. The default is `true`, meaning
     *  that the output will end with the stop sequence text when matched.
     */
    include_stop_sequence?: boolean;
    /** Local typicality measures how similar the conditional probability of predicting a target token next is to
     *  the expected conditional probability of predicting a random token next, given the partial text already
     *  generated. If less than 1, the smallest set of the most locally typical tokens with probabilities that add up to
     *  typical_p or higher are kept for generation.
     */
    typical_p?: number;
    /** The prompt variables. */
    prompt_variables?: JsonObject;
  }
  export namespace DeploymentTextGenProperties {
    export namespace Constants {
      /** Represents the strategy used for picking the tokens during generation of the output text. During text generation when parameter value is set to greedy, each successive token corresponds to the highest probability token given the text that has already been generated. This strategy can lead to repetitive results especially for longer output sequences. The alternative sample strategy generates text by picking subsequent tokens based on the probability distribution of possible next tokens defined by (i.e., conditioned on) the already-generated text and the top_k and top_p parameters described below. See this [url](https://huggingface.co/blog/how-to-generate) for an informative article about text generation. */
      export enum DecodingMethod {
        SAMPLE = 'sample',
        GREEDY = 'greedy',
      }
    }
  }

  /** The embedding values for a text string. The `input` field is only set if the corresponding `return_option` is set. */
  export interface Embedding {
    /** The text input to the model. */
    input?: string;
    /** The embedding values. */
    embedding: number[];
  }

  /** Parameters for text embedding requests. */
  export interface EmbeddingParameters {
    /** Represents the maximum number of input tokens accepted. This can be used to avoid requests failing due to
     *  input being longer than configured limits. If the text is truncated, then it truncates the end of the input (on
     *  the right), so the start of the input will remain the same. If this value exceeds the `maximum sequence length`
     *  (refer to the documentation to find this value for the model) then the call will fail if the total number of
     *  tokens exceeds the `maximum sequence length`. Zero means don't truncate.
     */
    truncate_input_tokens?: number;
    /** The return options for text embeddings. */
    return_options?: EmbeddingReturnOptions;
  }

  /** The return options for text embeddings. */
  export interface EmbeddingReturnOptions {
    /** Include the `input` text in each of the `results` documents. */
    input_text?: boolean;
  }

  /** System details. */
  export interface EmbeddingsResponse {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     */
    model_id: string;
    /** The embedding values for a given text. */
    results: Embedding[];
    /** The time when the response was created. */
    created_at: string;
    /** The number of input tokens that were consumed. */
    input_token_count: number;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** ExternalInformationExternalModel. */
  export interface ExternalInformationExternalModel {
    name: string;
    url: string;
  }

  /** ExternalInformationExternalPrompt. */
  export interface ExternalInformationExternalPrompt {
    url: string;
    additional_information?: ExternalPromptAdditionalInformationItem[][];
  }

  /** ExternalPromptAdditionalInformationItem. */
  export interface ExternalPromptAdditionalInformationItem {
    key?: string;
  }

  /** A supported foundation model. */
  export interface FoundationModel {
    /** The id of the foundation model. */
    model_id: string;
    /** A short label that will be displayed in the UI. */
    label: string;
    /** The provider of the model. */
    provider: string;
    /** The organization or person that tuned this model. */
    tuned_by?: string;
    /** A short description of the model suitable for a title. */
    short_description: string;
    /** A longer description of the model, that may be used if no `description_url` is provided. */
    long_description?: string;
    /** Limits per plan that may be set per request. */
    limits?: FoundationModelLimits;
    /** Deprecated: Deprecated: please use `tasks` instead. */
    task_ids?: string[];
    /** The tasks that are supported by this model. */
    tasks?: TaskDescription[];
    /** The tier of the model, depending on the `tier` the billing will be different, refer to the plan for the
     *  details. Note that input tokens and output tokens may be charged differently.
     */
    input_tier: FoundationModel.Constants.InputTier | string;
    /** The tier of the model, depending on the `tier` the billing will be different, refer to the plan for the
     *  details. Note that input tokens and output tokens may be charged differently.
     */
    output_tier: FoundationModel.Constants.OutputTier | string;
    /** Specifies the provider of this model. */
    source: string;
    /** The minimum number of examples required for the model. */
    min_shot_size?: number;
    /** The number of parameters used for the model, it will accept `m` for million, `b` for billion and `t` for
     *  trillion.
     */
    number_params: string;
    /** The limits that are applied for the model, for all the plans. */
    model_limits?: ModelLimits;
    /** The information related to the lifecycle of this model. */
    lifecycle?: LifeCycleState[];
    /** Training parameters for a given model. */
    training_parameters?: TrainingParameters;
    /** The information related to the minor versions of this model. */
    versions?: FoundationModelVersion[];
    /** If `true` then this model is only available in the `Tech Preview`. */
    tech_preview?: boolean;
  }
  export namespace FoundationModel {
    export namespace Constants {
      /** The tier of the model, depending on the `tier` the billing will be different, refer to the plan for the details. Note that input tokens and output tokens may be charged differently. */
      export enum InputTier {
        CLASS_1 = 'class_1',
        CLASS_2 = 'class_2',
        CLASS_3 = 'class_3',
        CLASS_C1 = 'class_c1',
      }
      /** The tier of the model, depending on the `tier` the billing will be different, refer to the plan for the details. Note that input tokens and output tokens may be charged differently. */
      export enum OutputTier {
        CLASS_1 = 'class_1',
        CLASS_2 = 'class_2',
        CLASS_3 = 'class_3',
        CLASS_C1 = 'class_c1',
      }
    }
  }

  /** Limits per plan that may be set per request. */
  export interface FoundationModelLimits {
    /** The limits that may be set per request. */
    lite?: ConsumptionsLimit;
  }

  /** A task that is covered by some of the foundation models that are supported in the service. */
  export interface FoundationModelTask {
    /** The id of the task. */
    task_id: string;
    /** The label of the task. */
    label: string;
    /** The description of the task. */
    description?: string;
    /** The rank of the task that is mainly for the UI. */
    rank: number;
  }

  /** System details. */
  export interface FoundationModelTasks {
    /** The total number of resources. */
    total_count?: number;
    /** The number of items to return in each page. */
    limit: number;
    /** The reference to the first item in the current page. */
    first: PaginationFirst;
    /** A reference to the first item of the next page, if any. */
    next?: PaginationNext;
    /** The supported foundation model tasks. */
    resources?: FoundationModelTask[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** A minor or patch version for the model. */
  export interface FoundationModelVersion {
    /** The version of the model. This must follow semantic versioning semantics. */
    version?: string;
    /** The date (ISO 8601 format YYYY-MM-DD) when this version first became available. */
    available_date?: string;
  }

  /** System details. */
  export interface FoundationModels {
    /** The total number of resources. */
    total_count?: number;
    /** The number of items to return in each page. */
    limit: number;
    /** The reference to the first item in the current page. */
    first: PaginationFirst;
    /** A reference to the first item of the next page, if any. */
    next?: PaginationNext;
    /** The supported foundation models. */
    resources?: FoundationModel[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** GetPromptInputResponse. */
  export interface GetPromptInputResponse {
    /** The prompt's input string used for inferences. */
    input?: string;
  }

  /** A hardware specification. */
  export interface HardwareSpec {
    /** The id of the hardware specification. */
    id?: string;
    /** The revision of the hardware specification. */
    rev?: string;
    /** The name of the hardware specification. */
    name?: string;
    /** The number of nodes applied to a computation. */
    num_nodes?: number;
  }

  /** The details of an inference API. */
  export interface Inference {
    /** The inference URL. */
    url: string;
    /** This is `true` if the inference API supports SSE streaming. */
    sse?: boolean;
    /** This is `true` if the inference API uses the `serving_name` that was defined in this deployment. */
    uses_serving_name?: boolean;
  }

  /** This model represents an individual patch operation to be performed on a JSON document, as defined by RFC 6902. */
  export interface JsonPatchOperation {
    /** The operation to be performed. */
    op: JsonPatchOperation.Constants.Op | string;
    /** The JSON Pointer that identifies the field that is the target of the operation. */
    path: string;
    /** The JSON Pointer that identifies the field that is the source of the operation. */
    from?: string;
    /** The value to be used within the operation. */
    value?: any;
  }
  export namespace JsonPatchOperation {
    export namespace Constants {
      /** The operation to be performed. */
      export enum Op {
        ADD = 'add',
        REMOVE = 'remove',
        REPLACE = 'replace',
        MOVE = 'move',
        COPY = 'copy',
        TEST = 'test',
      }
    }
  }

  /** The lifecycle details. */
  export interface LifeCycleState {
    /** The possible lifecycle stages, in order, are described below:
     *
     *  - `available`: this means that the model is available for use.
     *  - `deprecated`: this means that the model is still available but the model will be removed soon, so an
     *  alternative model should be used.
     *  - `constricted`: this means that the model is still available for inferencing but cannot be used for training or
     *  in a deployment. The model will be removed soon so an alternative model should be used.
     *  - `withdrawn`: this means that the model is no longer available, check the `alternative_model_ids` to see what
     *  it can be replaced by.
     */
    id: LifeCycleState.Constants.Id | string;
    /** An optional label that may be used in the UI. */
    label?: string;
    /** The date (ISO 8601 format YYYY-MM-DD) when this lifecycle stage starts. */
    start_date?: string;
    /** Alternative models, or model versions, that can be used instead of this model. */
    alternative_model_ids?: string[];
    /** A link to the documentation specifying details on the lifecycle plan for this model. */
    url?: string;
  }
  export namespace LifeCycleState {
    export namespace Constants {
      /** The possible lifecycle stages, in order, are described below: - `available`: this means that the model is available for use. - `deprecated`: this means that the model is still available but the model will be removed soon, so an alternative model should be used. - `constricted`: this means that the model is still available for inferencing but cannot be used for training or in a deployment. The model will be removed soon so an alternative model should be used. - `withdrawn`: this means that the model is no longer available, check the `alternative_model_ids` to see what it can be replaced by. */
      export enum Id {
        AVAILABLE = 'available',
        DEPRECATED = 'deprecated',
        CONSTRICTED = 'constricted',
        WITHDRAWN = 'withdrawn',
      }
    }
  }

  /** The properties specific to masking. If this object exists, even if it is empty, then masking will be applied. */
  export interface MaskProperties {
    /** If this field is `true` then the entity value, that contains the text that was masked, will also be removed
     *  from the output.
     */
    remove_entity_value?: boolean;
  }

  /** Optional messages related to the deployment. */
  export interface Message {
    /** The level of the message, normally one of `debug`, `info` or `warning`. */
    level?: string;
    /** The message. */
    text?: string;
  }

  /** Provides extra information for this training stage in the context of auto-ml. */
  export interface MetricsContext {
    /** The deployment that created the metrics. */
    deployment_id?: string;
    /** The context for prompt tuning metrics. */
    prompt_tuning?: PromptTuningMetricsContext;
  }

  /** The limits that are applied for the model, for all the plans. */
  export interface ModelLimits {
    /** This is the maximum allowed value for the number of tokens in the input prompt plus the number of tokens in
     *  the output generated by the model.
     */
    max_sequence_length?: number;
    /** This is the maximum number of records that can be accepted when training this model. */
    training_data_max_records?: number;
  }

  /** A reference to a resource. */
  export interface ModelRel {
    /** The id of the referenced resource. */
    id: string;
    /** The revision of the referenced resource. */
    rev?: string;
    /** The resource key for this asset if it exists. */
    resource_key?: string;
  }

  /** The properties specific to HAP. */
  export interface ModerationHapProperties {
    /** Properties that control the moderation on the text. */
    input?: TextModeration;
    /** Properties that control the moderation on the text. */
    output?: TextModeration;
    /** The properties specific to masking. If this object exists,
     *  even if it is empty, then masking will be applied.
     */
    mask?: MaskProperties;
    /** ModerationHapProperties accepts additional properties. */
    [propName: string]: any;
  }

  /** The properties specific to PII. */
  export interface ModerationPiiProperties {
    /** Properties that control the moderation on the text. */
    input?: TextModeration;
    /** Properties that control the moderation on the text. */
    output?: TextModeration;
    /** The properties specific to masking. If this object exists,
     *  even if it is empty, then masking will be applied.
     */
    mask?: MaskProperties;
    /** ModerationPiiProperties accepts additional properties. */
    [propName: string]: any;
  }

  /** The properties for the moderation. Each type of moderation may have additional properties that are specific to that moderation. */
  export interface ModerationProperties {
    /** Properties that control the moderation on the text. */
    input?: TextModeration;
    /** Properties that control the moderation on the text. */
    output?: TextModeration;
    /** ModerationProperties accepts additional properties. */
    [propName: string]: any;
  }

  /** A specific moderation result. */
  export interface ModerationResult {
    /** the probability that this is a real match. */
    score: number;
    /** This defines if this was found in the input (`true`) or the output (`false`). */
    input: boolean;
    /** A range of text. */
    position: ModerationTextRange;
    /** The entity that was identified by the moderation. */
    entity: string;
    /** The text that was identified for this entity.
     *
     *  This field may be removed if requested in the moderation request body.
     */
    word?: string;
  }

  /** The result of any detected moderations. */
  export interface ModerationResults {
    /** The HAP results. */
    hap?: ModerationResult[];
    /** The PII results. */
    pii?: ModerationResult[];
    /** ModerationResults accepts additional properties. */
    [propName: string]: any;
  }

  /** A range of text. */
  export interface ModerationTextRange {
    /** The start index of the range. */
    start: number;
    /** The end index of the range. The end index is exclusive meaning that the character at this index will not be
     *  included in the range.
     */
    end: number;
  }

  /** Properties that control the moderations, for usages such as `Hate and profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types of moderations. */
  export interface Moderations {
    /** The properties specific to HAP. */
    hap?: ModerationHapProperties;
    /** The properties specific to PII. */
    pii?: ModerationPiiProperties;
    /** If set, then only these ranges will be applied to the moderations. This is useful in the case that certain
     *  parts of the input text have already been checked.
     */
    input_ranges?: ModerationTextRange[];
    /** Moderations accepts additional properties. */
    [propName: string]: any;
  }

  /** Notebook information as returned by a GET request. */
  export interface Notebook {
    /** Metadata of a notebook. */
    metadata?: NotebookMetadata;
    /** Entity of a notebook. */
    entity?: NotebookEntity;
  }

  /** Entity of a notebook. */
  export interface NotebookEntity {
    /** Definition part of a notebook entity. */
    notebook?: NotebookEntityDefinition;
    /** A notebook runtime. */
    runtime?: NotebookRuntime;
    /** Full URI of the notebook. */
    href?: string;
  }

  /** Definition part of a notebook entity. */
  export interface NotebookEntityDefinition {
    /** A notebook kernel. */
    kernel?: NotebookKernel;
    /** The notebook origin. */
    originates_from?: NotebookOrigin;
  }

  /** Definition part of a notebook entity copied from a source. */
  export interface NotebookEntityDefinitionForCopy {
    /** A notebook kernel. */
    kernel?: NotebookKernel;
    /** The origin of a notebook from a source. */
    originates_from?: NotebookOriginFromSource;
  }

  /** Entity of a notebook copied from a source. */
  export interface NotebookEntityForCopy {
    /** Definition part of a notebook entity copied from a source. */
    notebook?: NotebookEntityDefinitionForCopy;
    /** A notebook runtime. */
    runtime?: NotebookRuntime;
    /** Full URI of the notebook. */
    href?: string;
  }

  /** A notebook kernel. */
  export interface NotebookKernel {
    /** The display name of the environment kernel. */
    display_name?: string;
    /** The name of the environment kernel. */
    name?: string;
    /** The language of the environment kernel. */
    language?: string;
  }

  /** Metadata of a notebook. */
  export interface NotebookMetadata {
    /** The name of the notebook. */
    name?: string;
    /** A more verbose description. */
    description?: string;
    /** Asset type, always 'notebook'. */
    asset_type?: string;
    /** Creation date, ms since epoch. */
    created?: number;
    /** Creation date, ISO format. */
    created_at?: string;
    /** IAM ID of the asset's owner. */
    owner_id?: string;
    /** UUID of the asset's catalog. */
    catalog_id?: string;
    /** UUID of the asset. */
    asset_id?: string;
  }

  /** Metadata of a notebook in a project. */
  export interface NotebookMetadataInProject {
    /** The name of the notebook. */
    name?: string;
    /** A more verbose description. */
    description?: string;
    /** Asset type, always "notebook". */
    asset_type?: string;
    /** Creation date, ms since epoch. */
    created?: number;
    /** Creation date, ISO format. */
    created_at?: string;
    /** IAM ID of the asset's owner. */
    owner_id?: string;
    /** UUID of the asset's catalog. */
    catalog_id?: string;
    /** UUID of the asset. */
    asset_id?: string;
    /** UUID of the asset's project. */
    project_id: string;
  }

  /** The notebook origin. */
  export interface NotebookOrigin {
    /** The orgin type of the notebook, either blank, file or url. */
    type?: string;
  }

  /** The origin of a notebook from a source. */
  export interface NotebookOriginFromSource {
    /** The orgin type of the notebook, either blank, file or url. */
    type?: string;
    /** The guid of the source file. */
    guid?: string;
  }

  /** Notebook info returned in a listing. */
  export interface NotebookResource {
    /** Metadata of notebook info returned in a listing. */
    metadata?: NotebookResourceMetadata;
    /** Entity of notebook info returned in a listing. */
    entity?: NotebookResourceEntity;
  }

  /** Entity of notebook info returned in a listing. */
  export interface NotebookResourceEntity {
    /** Asset API asset description returned with a notebook listing. */
    asset?: NotebookResourceEntityAsset;
    /** Runtime info returned with a notebook listing. */
    runtime?: NotebookResourceEntityRuntime;
  }

  /** Asset API asset description returned with a notebook listing. */
  export interface NotebookResourceEntityAsset {
    /** The UUID of the asset. */
    asset_id?: string;
    /** The asset type. Always 'notebook'. */
    asset_type?: string;
    /** Timestamp of the creation date, ms since epoch. */
    created?: number;
    /** Date the asset was created, ISO format. */
    created_at?: string;
    /** The asset catalog ID. */
    catalog_id?: string;
    /** The project the notebook belongs to. */
    project_id?: string;
    /** Version of the asset. */
    version?: number;
    /** The asset URL. */
    href?: string;
  }

  /** Runtime info returned with a notebook listing. */
  export interface NotebookResourceEntityRuntime {
    /** If Spark monitoring is enabled. */
    spark_monitoring_enabled?: boolean;
    /** UUID of the environment of the notebook. */
    environment?: string;
  }

  /** Metadata of notebook info returned in a listing. */
  export interface NotebookResourceMetadata {
    /** UUID of the notebook. */
    guid?: string;
    /** URL of the notebook. */
    url?: string;
  }

  /** A notebook runtime. */
  export interface NotebookRuntime {
    /** The guid of the environment on which the notebook runs. */
    environment: string;
    /** Spark monitoring enabled or not. */
    spark_monitoring_enabled?: boolean;
  }

  /** A notebook version entity in a project. */
  export interface NotebookVersionEntityInProject {
    /** The guid of the versioned notebook. */
    master_notebook_guid?: string;
    /** The IUI of the user that has created the version. */
    created_by_iui?: string;
    /** The file reference in the corresponding COS. */
    file_reference?: string;
    /** The revision id of the notebook. */
    rev_id?: number;
    /** The guid of the project. */
    project_id: string;
  }

  /** A notebook version in a project. */
  export interface NotebookVersionInProject {
    /** Notebook version metadata. */
    metadata?: NotebookVersionMetadata;
    /** A notebook version entity in a project. */
    entity?: NotebookVersionEntityInProject;
  }

  /** Notebook version metadata. */
  export interface NotebookVersionMetadata {
    /** The guid of the version. */
    guid?: string;
    /** The URL of the version. */
    url?: string;
    /** The creation timestamp in UTC millisecond since UNIX Epoch time. */
    created_at?: number;
  }

  /** NotebooksCreateRequest. */
  export interface NotebooksCreateRequest {}

  /** NotebooksCreateResponse. */
  export interface NotebooksCreateResponse {}

  /** A list of notebook info as returned by a list query. */
  export interface NotebooksResourceList {
    /** The number of items in the resources list. */
    total_results: number;
    /** An array of notebooks. */
    resources: NotebookResource[];
  }

  /** NotebooksRevertResponse. */
  export interface NotebooksRevertResponse {}

  /** A reference to data. */
  export interface ObjectLocation {
    /** Item identification inside a collection. */
    id?: string;
    /** The data source type like `connection_asset` or `data_asset`. */
    type: ObjectLocation.Constants.Type | string;
    /** Contains a set of fields specific to each connection.
     *  See here for [details about specifying connections](#datareferences).
     */
    connection?: DataConnection;
    /** Contains a set of fields that describe the location of the data with respect to the `connection`. */
    location: JsonObject;
  }
  export namespace ObjectLocation {
    export namespace Constants {
      /** The data source type like `connection_asset` or `data_asset`. */
      export enum Type {
        CONNECTION_ASSET = 'connection_asset',
        DATA_ASSET = 'data_asset',
        CONTAINER = 'container',
        URL = 'url',
      }
    }
  }

  /** Indicates that this is an online deployment. An object has to be specified but can be empty. The `serving_name` can be provided in the `online.parameters`. */
  export interface OnlineDeployment {
    /** A set of key-value pairs that are used to configure the deployment. */
    parameters?: OnlineDeploymentParameters;
  }

  /** A set of key-value pairs that are used to configure the deployment. */
  export interface OnlineDeploymentParameters {
    /** The `serving_name` can be used in the inference URL in place of the `deployment_id`. */
    serving_name?: string;
    /** OnlineDeploymentParameters accepts additional properties. */
    [propName: string]: any;
  }

  /** The reference to the first item in the current page. */
  export interface PaginationFirst {
    /** The uri of the first resource returned. */
    href: string;
  }

  /** A reference to the first item of the next page, if any. */
  export interface PaginationNext {
    /** The uri of the next set of resources. */
    href: string;
  }

  /** PromptModelParameters. */
  export interface PromptModelParameters {
    decoding_method?: string;
    max_new_tokens?: number;
    min_new_tokens?: number;
    random_seed?: number;
    stop_sequences?: string[];
    temperature?: number;
    top_k?: number;
    top_p?: number;
    repetition_penalty?: number;
  }

  /** Properties to control the prompt tuning. */
  export interface PromptTuning {
    /** The model id of the base model for this prompt tuning. */
    base_model?: BaseModel;
    /** The task that is targeted for this model. */
    task_id: string;
    /** Type of Peft (Parameter-Efficient Fine-Tuning) config to build. */
    tuning_type?: PromptTuning.Constants.TuningType | string;
    /** Number of epochs to tune the prompt vectors, this affects the quality of the trained model. */
    num_epochs?: number;
    /** Learning rate to be used while tuning prompt vectors. */
    learning_rate?: number;
    /** Number of steps to be used for gradient accumulation. Gradient accumulation refers to a method of collecting
     *  gradient for configured number of steps instead of updating the model variables at every step and then applying
     *  the update to model variables. This can be used as a tool to overcome smaller batch size limitation. Often also
     *  referred in conjunction with 'effective batch size'.
     */
    accumulate_steps?: number;
    /** Verbalizer template to be used for formatting data at train and inference time. This template may use
     *  brackets to indicate where fields from the data model must be rendered.
     */
    verbalizer?: string;
    /** The batch size is a number of samples processed before the model is updated. */
    batch_size?: number;
    /** Maximum length of input tokens being considered. */
    max_input_tokens?: number;
    /** Maximum length of output tokens being predicted. */
    max_output_tokens?: number;
    /** The `text` method requires `init_text` to be set. */
    init_method?: PromptTuning.Constants.InitMethod | string;
    /** Initialization text to be used if `init_method` is set to `text` otherwise this will be ignored. */
    init_text?: string;
  }
  export namespace PromptTuning {
    export namespace Constants {
      /** Type of Peft (Parameter-Efficient Fine-Tuning) config to build. */
      export enum TuningType {
        PROMPT_TUNING = 'prompt_tuning',
      }
      /** The `text` method requires `init_text` to be set. */
      export enum InitMethod {
        RANDOM = 'random',
        TEXT = 'text',
      }
    }
  }

  /** The context for prompt tuning metrics. */
  export interface PromptTuningMetricsContext {
    /** The location where the prompt tuning metrics are stored. */
    metrics_location?: string;
  }

  /** PromptWithExternalModelParameters. */
  export interface PromptWithExternalModelParameters {
    decoding_method?: string;
    max_new_tokens?: number;
    min_new_tokens?: number;
    random_seed?: number;
    stop_sequences?: string[];
    temperature?: number;
    top_k?: number;
    top_p?: number;
    repetition_penalty?: number;
  }

  /** A reference to a resource. */
  export interface Rel {
    /** The id of the referenced resource. */
    id: string;
    /** The revision of the referenced resource. */
    rev?: string;
  }

  /** Information related to the revision. */
  export interface ResourceCommitInfo {
    /** The time when the revision was committed. */
    committed_at: string;
    /** The message that was provided when the revision was created. */
    commit_message?: string;
  }

  /** Common metadata for a resource where `project_id` or `space_id` must be present. */
  export interface ResourceMeta {
    /** The id of the resource. */
    id: string;
    /** The time when the resource was created. */
    created_at: string;
    /** The revision of the resource. */
    rev?: string;
    /** The user id which created this resource. */
    owner?: string;
    /** The time when the resource was last modified. */
    modified_at?: string;
    /** The id of the parent resource where applicable. */
    parent_id?: string;
    /** The name of the resource. */
    name?: string;
    /** A description of the resource. */
    description?: string;
    /** A list of tags for this resource. */
    tags?: string[];
    /** Information related to the revision. */
    commit_info?: ResourceCommitInfo;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    space_id?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    project_id?: string;
  }

  /** Properties that control what is returned. */
  export interface ReturnOptionProperties {
    /** Include input text in the `generated_text` field. */
    input_text?: boolean;
    /** Include the list of individual generated tokens. Extra token information is included based on the other
     *  flags below.
     */
    generated_tokens?: boolean;
    /** Include the list of input tokens. Extra token information is included based on the other flags here, but
     *  only for decoder-only models.
     */
    input_tokens?: boolean;
    /** Include logprob (natural log of probability) for each returned token. Applicable only if generated_tokens ==
     *  true and/or input_tokens == true.
     */
    token_logprobs?: boolean;
    /** Include rank of each returned token. Applicable only if generated_tokens == true and/or input_tokens ==
     *  true.
     */
    token_ranks?: boolean;
    /** Include top n candidate tokens at the position of each returned token. The maximum value permitted is 5, but
     *  more may be returned if there is a tie for nth place. Applicable only if generated_tokens == true and/or
     *  input_tokens == true.
     */
    top_n_tokens?: number;
  }

  /** A reference to a resource. */
  export interface SimpleRel {
    /** The id of the referenced resource. */
    id: string;
  }

  /** The stats about deployments for a space. */
  export interface Stats {
    /** An `id` associated with the space. */
    space_id?: string;
    /** The total number of deployments created in a space including `online` and `batch`. */
    total_count?: number;
    /** The number of online deployments created in a space. */
    online_count?: number;
    /** The number of batch deployments created in a space. */
    batch_count?: number;
  }

  /** Optional details coming from the service and related to the API call or the associated resource. */
  export interface SystemDetails {
    /** Any warnings coming from the system. */
    warnings?: Warning[];
  }

  /** The attributes of the task for this model. */
  export interface TaskDescription {
    /** The `id` of the task. */
    id: string;
    /** The ratings for this task for this model. */
    ratings?: TaskRating;
    /** The tags for a given task. */
    tags?: string[];
  }

  /** The ratings for this task for this model. */
  export interface TaskRating {
    /** A metric that indicates the cost expected to be incurred by the model's support of an inference task, in
     *  terms of resource consumption and processing time, on a scale of 1 to 5, where 5 is the least cost and 1 is the
     *  most cost. A missing value means that the cost is not known.
     */
    cost?: number;
    /** A metric that indicates the quality of the model's support of an inference task, on a scale of 1 to 5, where
     *  5 is the best support and 1 is poor support. A missing value means that the quality is not known.
     */
    quality?: number;
  }

  /** It can be used to exponentially increase the likelihood of the text generation terminating once a specified number of tokens have been generated. */
  export interface TextGenLengthPenalty {
    /** Represents the factor of exponential decay. Larger values correspond to more aggressive decay. */
    decay_factor?: number;
    /** A number of generated tokens after which this should take effect. */
    start_index?: number;
  }

  /** Properties that control the model and response. */
  export interface TextGenParameters {
    /** Represents the strategy used for picking the tokens during generation of the output text.
     *
     *  During text generation when parameter value is set to greedy, each successive token corresponds to the highest
     *  probability token given the text that has already been generated. This strategy can lead to repetitive results
     *  especially for longer output sequences. The alternative sample strategy generates text by picking subsequent
     *  tokens based on the probability distribution of possible next tokens defined by (i.e., conditioned on) the
     *  already-generated text and the top_k and top_p parameters described below. See this
     *  [url](https://huggingface.co/blog/how-to-generate) for an informative article about text generation.
     */
    decoding_method?: TextGenParameters.Constants.DecodingMethod | string;
    /** It can be used to exponentially increase the likelihood of the text generation terminating once a specified
     *  number of tokens have been generated.
     */
    length_penalty?: TextGenLengthPenalty;
    /** The maximum number of new tokens to be generated. The maximum supported value for this field depends on the
     *  model being used.
     *
     *  How the "token" is defined depends on the tokenizer and vocabulary size, which in turn depends on the model.
     *  Often the tokens are a mix of full words and sub-words. To learn more about tokenization, [see
     *  here](https://huggingface.co/course/chapter2/4).
     *
     *  Depending on the users plan, and on the model being used, there may be an enforced maximum number of new tokens.
     */
    max_new_tokens?: number;
    /** If stop sequences are given, they are ignored until minimum tokens are generated. */
    min_new_tokens?: number;
    /** Random number generator seed to use in sampling mode for experimental repeatability. */
    random_seed?: number;
    /** Stop sequences are one or more strings which will cause the text generation to stop if/when they are
     *  produced as part of the output. Stop sequences encountered prior to the minimum number of tokens being generated
     *  will be ignored.
     */
    stop_sequences?: string[];
    /** A value used to modify the next-token probabilities in sampling mode. Values less than 1.0 sharpen the
     *  probability distribution, resulting in "less random" output. Values greater than 1.0 flatten the probability
     *  distribution, resulting in "more random" output. A value of 1.0 has no effect.
     */
    temperature?: number;
    /** Time limit in milliseconds - if not completed within this time, generation will stop. The text generated so
     *  far will be returned along with the TIME_LIMIT stop reason.
     *
     *  Depending on the users plan, and on the model being used, there may be an enforced maximum time limit.
     */
    time_limit?: number;
    /** The number of highest probability vocabulary tokens to keep for top-k-filtering. Only applies for sampling
     *  mode. When decoding_strategy is set to sample, only the top_k most likely tokens are considered as candidates
     *  for the next generated token.
     */
    top_k?: number;
    /** Similar to top_k except the candidates to generate the next token are the most likely tokens with
     *  probabilities that add up to at least top_p. Also known as nucleus sampling. A value of 1.0 is equivalent to
     *  disabled.
     */
    top_p?: number;
    /** Represents the penalty for penalizing tokens that have already been generated or belong to the context. The
     *  value 1.0 means that there is no penalty.
     */
    repetition_penalty?: number;
    /** Represents the maximum number of input tokens accepted. This can be used to avoid requests failing due to
     *  input being longer than configured limits. If the text is truncated, then it truncates the start of the input
     *  (on the left), so the end of the input will remain the same. If this value exceeds the `maximum sequence length`
     *  (refer to the documentation to find this value for the model) then the call will fail if the total number of
     *  tokens exceeds the `maximum sequence length`. Zero means don't truncate.
     */
    truncate_input_tokens?: number;
    /** Properties that control what is returned. */
    return_options?: ReturnOptionProperties;
    /** Pass `false` to omit matched stop sequences from the end of the output text. The default is `true`, meaning
     *  that the output will end with the stop sequence text when matched.
     */
    include_stop_sequence?: boolean;
  }
  export namespace TextGenParameters {
    export namespace Constants {
      /** Represents the strategy used for picking the tokens during generation of the output text. During text generation when parameter value is set to greedy, each successive token corresponds to the highest probability token given the text that has already been generated. This strategy can lead to repetitive results especially for longer output sequences. The alternative sample strategy generates text by picking subsequent tokens based on the probability distribution of possible next tokens defined by (i.e., conditioned on) the already-generated text and the top_k and top_p parameters described below. See this [url](https://huggingface.co/blog/how-to-generate) for an informative article about text generation. */
      export enum DecodingMethod {
        SAMPLE = 'sample',
        GREEDY = 'greedy',
      }
    }
  }

  /** System details. */
  export interface TextGenResponse {
    /** The `id` of the model for inference. */
    model_id: string;
    /** The model version (using semantic versioning) if set. */
    model_version?: string;
    /** The time when the response was created. */
    created_at: string;
    /** The generated tokens. */
    results: TextGenResponseFieldsResultsItem[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** TextGenResponseFieldsResultsItem. */
  export interface TextGenResponseFieldsResultsItem {
    /** The text that was generated by the model. */
    generated_text: string;
    /** The reason why the call stopped, can be one of:
     *  - not_finished - Possibly more tokens to be streamed.
     *  - max_tokens - Maximum requested tokens reached.
     *  - eos_token - End of sequence token encountered.
     *  - cancelled - Request canceled by the client.
     *  - time_limit - Time limit reached.
     *  - stop_sequence - Stop sequence encountered.
     *  - token_limit - Token limit reached.
     *  - error - Error encountered.
     *
     *  Note that these values will be lower-cased so test for values case insensitive.
     */
    stop_reason: TextGenResponseFieldsResultsItem.Constants.StopReason | string;
    /** The number of generated tokens. */
    generated_token_count?: number;
    /** The number of input tokens consumed. */
    input_token_count?: number;
    /** The seed used, if it exists. */
    seed?: number;
    /** The list of individual generated tokens. Extra token information is included based on the other flags in the
     *  `return_options` of the request.
     */
    generated_tokens?: TextGenTokenInfo[];
    /** The list of input tokens. Extra token information is included based on the other flags in the
     *  `return_options` of the request, but for decoder-only models.
     */
    input_tokens?: TextGenTokenInfo[];
    /** The result of any detected moderations. */
    moderations?: ModerationResults;
  }
  export namespace TextGenResponseFieldsResultsItem {
    export namespace Constants {
      /** The reason why the call stopped, can be one of: - not_finished - Possibly more tokens to be streamed. - max_tokens - Maximum requested tokens reached. - eos_token - End of sequence token encountered. - cancelled - Request canceled by the client. - time_limit - Time limit reached. - stop_sequence - Stop sequence encountered. - token_limit - Token limit reached. - error - Error encountered. Note that these values will be lower-cased so test for values case insensitive. */
      export enum StopReason {
        NOT_FINISHED = 'not_finished',
        MAX_TOKENS = 'max_tokens',
        EOS_TOKEN = 'eos_token',
        CANCELLED = 'cancelled',
        TIME_LIMIT = 'time_limit',
        STOP_SEQUENCE = 'stop_sequence',
        TOKEN_LIMIT = 'token_limit',
        ERROR = 'error',
      }
    }
  }

  /** The generated token. */
  export interface TextGenTokenInfo {
    /** The token text. */
    text?: string;
    /** The natural log of probability for the token. */
    logprob?: number;
    /** The rank of the token relative to the other tokens. */
    rank?: number;
    /** The top tokens. */
    top_tokens?: TextGenTopTokenInfo[];
  }

  /** The top tokens. */
  export interface TextGenTopTokenInfo {
    /** The token text. */
    text?: string;
    /** The natural log of probability for the token. */
    logprob?: number;
  }

  /** Properties that control the moderation on the text. */
  export interface TextModeration {
    /** Should this moderation be enabled on the text.
     *
     *
     *  The default value is `true` which means that if the parent object exists but the `enabled` field does not exist
     *  then this is considered to be enabled.
     */
    enabled?: boolean;
    /** The threshold probability that this is a real match. */
    threshold?: number;
    /** TextModeration accepts additional properties. */
    [propName: string]: any;
  }

  /** The parameters for text tokenization. */
  export interface TextTokenizeParameters {
    /** If this is `true` then the actual tokens will also be returned in the response. */
    return_tokens?: boolean;
  }

  /** The tokenization result. */
  export interface TextTokenizeResponse {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     */
    model_id: string;
    /** The result of tokenizing the input string. */
    result: TextTokenizeResult;
  }

  /** The result of tokenizing the input string. */
  export interface TextTokenizeResult {
    /** The number of tokens in the input string. */
    token_count: number;
    /** The input string broken up into the tokens, if requested. */
    tokens?: string[];
  }

  /** Number of steps to be used for gradient accumulation. Gradient accumulation refers to a method of collecting gradient for configured number of steps instead of updating the model variables at every step and then applying the update to model variables. This can be used as a tool to overcome smaller batch size limitation. Often also referred in conjunction with "effective batch size". */
  export interface TrainingAccumulatedSteps {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** The batch size is a number of samples processed before the model is updated. */
  export interface TrainingBatchSize {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** Initialization methods for a training. */
  export interface TrainingInitMethod {
    /** The supported initialization methods. */
    supported?: string[];
    /** The default value, which will be one of the values from the `supported` field. */
    default?: string;
  }

  /** Initialization text to be used if init_method is set to `text`, otherwise this will be ignored. */
  export interface TrainingInitText {
    /** Initialization text. */
    default?: string;
  }

  /** Learning rate to be used for training. */
  export interface TrainingLearningRate {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** Maximum length of input tokens being considered. */
  export interface TrainingMaxInputTokens {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** Maximum length of output tokens being predicted. */
  export interface TrainingMaxOutputTokens {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** A metric. */
  export interface TrainingMetric {
    /** A timestamp for the metrics. */
    timestamp?: string;
    /** The iteration number. */
    iteration?: number;
    /** The metrics. */
    ml_metrics?: JsonObject;
    /** Provides extra information for this training stage in the context of auto-ml. */
    context?: MetricsContext;
  }

  /** The number of epochs is the number of complete passes through the training dataset. The quality depends on the number of epochs. */
  export interface TrainingNumEpochs {
    /** The default value. */
    default?: number;
    /** The minimum value. */
    min?: number;
    /** The maximum value. */
    max?: number;
  }

  /** Number of virtual tokens to be used for training. In prompt tuning we are essentially learning the embedded representations for soft prompts, which are known as virtual tokens, via back propagation for a specific task(s) while keeping the rest of the model fixed. `num_virtual_tokens` is the number of dimensions for these virtual tokens. */
  export interface TrainingNumVirtualTokens {
    /** The possible values for the number of virtual tokens. */
    supported?: number[];
    /** The default number of virtual tokens. */
    default?: number;
  }

  /** Training parameters for a given model. */
  export interface TrainingParameters {
    /** Initialization methods for a training. */
    init_method?: TrainingInitMethod;
    /** Initialization text to be used if init_method is set to `text`, otherwise this will be ignored. */
    init_text?: TrainingInitText;
    /** Number of virtual tokens to be used for training.
     *  In prompt tuning we are essentially learning the embedded representations for soft prompts,
     *  which are known as virtual tokens, via back propagation for a specific task(s) while keeping
     *  the rest of the model fixed. `num_virtual_tokens` is the number of dimensions for these virtual tokens.
     */
    num_virtual_tokens?: TrainingNumVirtualTokens;
    /** The number of epochs is the number of complete passes through the training dataset.
     *  The quality depends on the number of epochs.
     */
    num_epochs?: TrainingNumEpochs;
    /** Verbalizer template to be used for formatting data at train and inference time.
     *  This template may use brackets to indicate where fields from the data model
     *  TrainGenerationRecord must be rendered.
     */
    verbalizer?: TrainingVerbalizer;
    /** The batch size is a number of samples processed before the model is updated. */
    batch_size?: TrainingBatchSize;
    /** Maximum length of input tokens being considered. */
    max_input_tokens?: TrainingMaxInputTokens;
    /** Maximum length of output tokens being predicted. */
    max_output_tokens?: TrainingMaxOutputTokens;
    /** Datatype to use for training of the underlying text generation model.
     *  If no value is provided, we pull from torch_dtype in config.
     *  If an in memory resource is provided which does not match the specified data type,
     *  the model underpinning the resource will be converted in place to the correct torch dtype.
     */
    torch_dtype?: TrainingTorchDtype;
    /** Number of steps to be used for gradient accumulation.
     *  Gradient accumulation refers to a method of collecting gradient for configured number of steps
     *  instead of updating the model variables at every step and then applying the update to model variables.
     *  This can be used as a tool to overcome smaller batch size limitation.
     *  Often also referred in conjunction with "effective batch size".
     */
    accumulate_steps?: TrainingAccumulatedSteps;
    /** Learning rate to be used for training. */
    learning_rate?: TrainingLearningRate;
  }

  /** Training resource. */
  export interface TrainingResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** Status of the training job. */
    entity?: TrainingResourceEntity;
  }

  /** Information for paging when querying resources. */
  export interface TrainingResourceCollection {
    /** The total number of resources. Computed explicitly only when 'total_count=true' query parameter is present.
     *  This is in order to avoid performance penalties.
     */
    total_count?: number;
    /** The number of items to return in each page. */
    limit: number;
    /** The reference to the first item in the current page. */
    first: PaginationFirst;
    /** A reference to the first item of the next page, if any. */
    next?: PaginationNext;
    /** The training resources. */
    resources?: TrainingResource[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: TrainingResourceCollectionSystem;
  }

  /** Optional details coming from the service and related to the API call or the associated resource. */
  export interface TrainingResourceCollectionSystem {
    /** Any warnings coming from the system. */
    warnings?: Warning[];
  }

  /** Status of the training job. */
  export interface TrainingResourceEntity {
    /** Properties to control the prompt tuning. */
    prompt_tuning?: PromptTuning;
    /** Training datasets. */
    training_data_references?: DataConnectionReference[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** If set to `true` then the result of the training, if successful, will be uploaded to the repository as a
     *  model.
     */
    auto_update_model?: boolean;
    /** The training results. Normally this is specified as `type=container` which means that it is stored in the
     *  space or project. Note that the training will add some fields that point to the training status, the model
     *  request and the assets.
     *
     *  The `model_request_path` is the request body that should be used when creating the trained model in the API, if
     *  this model is to be deployed. If `auto_update_model` was set to `true` then this file is not needed.
     */
    results_reference: ObjectLocation;
    /** Status of the training job. */
    status: TrainingStatus;
  }

  /** Status of the training job. */
  export interface TrainingStatus {
    /** Date and Time in which current training state has started. */
    running_at?: string;
    /** Date and Time in which training had completed. */
    completed_at?: string;
    /** Current state of training. */
    state: TrainingStatus.Constants.State | string;
    /** Optional messages related to the deployment. */
    message?: Message;
    /** Metrics that can be returned by an operation. */
    metrics?: TrainingMetric[];
    /** The data returned when an error is encountered. */
    failure?: ApiErrorResponse;
  }
  export namespace TrainingStatus {
    export namespace Constants {
      /** Current state of training. */
      export enum State {
        QUEUED = 'queued',
        PENDING = 'pending',
        RUNNING = 'running',
        STORING = 'storing',
        COMPLETED = 'completed',
        FAILED = 'failed',
        CANCELED = 'canceled',
      }
    }
  }

  /** Datatype to use for training of the underlying text generation model. If no value is provided, we pull from torch_dtype in config. If an in memory resource is provided which does not match the specified data type, the model underpinning the resource will be converted in place to the correct torch dtype. */
  export interface TrainingTorchDtype {
    /** The datatype. */
    default?: string;
  }

  /** Verbalizer template to be used for formatting data at train and inference time. This template may use brackets to indicate where fields from the data model TrainGenerationRecord must be rendered. */
  export interface TrainingVerbalizer {
    /** The default verbalizer. */
    default?: string;
  }

  /** VersionsCreateResponse. */
  export interface VersionsCreateResponse {}

  /** VersionsGetResponse. */
  export interface VersionsGetResponse {}

  /** VersionsListResponse. */
  export interface VersionsListResponse {}

  /** A warning message. */
  export interface Warning {
    /** The message. */
    message: string;
    /** An `id` associated with the message. */
    id?: string;
    /** A reference to a more detailed explanation when available. */
    more_info?: string;
    /** Additional key-value pairs that depend on the specific warning. */
    additional_properties?: JsonObject;
  }

  /** WxPromptPatchModelVersion. */
  export interface WxPromptPatchModelVersion {
    /** User provided semvar version for tracking in IBM AI Factsheets. */
    number?: string;
    /** User provived tag. */
    tag?: string;
    /** Description of the version. */
    description?: string;
  }

  /** WxPromptPostModelVersion. */
  export interface WxPromptPostModelVersion {
    /** User provided semvar version for tracking in IBM AI Factsheets. */
    number?: string;
    /** User provived tag. */
    tag?: string;
    /** Description of the version. */
    description?: string;
  }

  /** WxPromptResponseModelVersion. */
  export interface WxPromptResponseModelVersion {
    /** User provided semvar version for tracking in IBM AI Factsheets. */
    number?: string;
    /** User provived tag. */
    tag?: string;
    /** Description of the version. */
    description?: string;
  }

  /** WxPromptSessionEntryListResultsItem. */
  export interface WxPromptSessionEntryListResultsItem {
    /** The prompt entry's ID. */
    id?: string;
    /** The prompt entry's name. */
    name?: string;
    /** The prompt entry's description. */
    description?: string;
    /** The prompt entry's create time in millis. */
    created_at?: number;
  }

  /** ChatItem. */
  export interface ChatItem {
    type?: ChatItem.Constants.Type | string;
    content?: string;
    status?: ChatItem.Constants.Status | string;
    timestamp?: number;
  }
  export namespace ChatItem {
    export namespace Constants {
      /** Type */
      export enum Type {
        QUESTION = 'question',
        ANSWER = 'answer',
      }
      /** Status */
      export enum Status {
        READY = 'ready',
        ERROR = 'error',
      }
    }
  }

  /** ExternalInformation. */
  export interface ExternalInformation {
    external_prompt_id: string;
    external_model_id: string;
    external_model_provider: string;
    external_prompt?: ExternalInformationExternalPrompt;
    external_model?: ExternalInformationExternalModel;
  }

  /** Prompt. */
  export interface Prompt {
    input?: string[][];
    model_id: string;
    model_parameters?: PromptModelParameters;
    data: PromptData;
    system_prompt?: string;
    chat_items?: ChatItem[];
  }

  /** PromptData. */
  export interface PromptData {
    instruction?: string;
    input_prefix?: string;
    output_prefix?: string;
    examples?: string[][];
  }

  /** PromptLock. */
  export interface PromptLock {
    /** True if the prompt is currently locked. */
    locked: boolean;
    /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock
     *  requests.
     */
    lock_type?: PromptLock.Constants.LockType | string;
    /** Locked by is computed by the server and shouldn't be passed. */
    locked_by?: string;
  }
  export namespace PromptLock {
    export namespace Constants {
      /** Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be supplied in PUT /lock requests. */
      export enum LockType {
        EDIT = 'edit',
        GOVERNANCE = 'governance',
      }
    }
  }

  /** PromptWithExternal. */
  export interface PromptWithExternal {
    input?: string[][];
    model_id: string;
    model_parameters?: PromptWithExternalModelParameters;
    data: PromptData;
    system_prompt?: string;
    chat_items?: ChatItem[];
    external_information?: ExternalInformation;
  }

  /** WxPromptResponse. */
  export interface WxPromptResponse {
    /** The prompt's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** Name used to display the prompt. */
    name: string;
    /** An optional description for the prompt. */
    description?: string;
    /** Time the prompt was created. */
    created_at?: number;
    /** The ID of the original prompt creator. */
    created_by?: string;
    /** Time the prompt was updated. */
    last_updated_at?: number;
    /** The ID of the last user that modifed the prompt. */
    last_updated_by?: string;
    task_ids?: string[];
    governance_tracked?: boolean;
    lock?: PromptLock;
    /** Input mode in use for the prompt. */
    input_mode?: WxPromptResponse.Constants.InputMode | string;
    model_version?: WxPromptResponseModelVersion;
    prompt_variables?: JsonObject;
    is_template?: boolean;
    resource_key?: string;
    prompt: PromptWithExternal;
  }
  export namespace WxPromptResponse {
    export namespace Constants {
      /** Input mode in use for the prompt. */
      export enum InputMode {
        STRUCTURED = 'structured',
        FREEFORM = 'freeform',
        CHAT = 'chat',
        DETACHED = 'detached',
      }
    }
  }

  /** WxPromptSession. */
  export interface WxPromptSession {
    /** The prompt session's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** Name used to display the prompt session. */
    name: string;
    /** An optional description for the prompt session. */
    description?: string;
    /** Time the session was created. */
    created_at?: number;
    /** The ID of the original session creator. */
    created_by?: string;
    /** Time the session was updated. */
    last_updated_at?: number;
    /** The ID of the last user that modifed the session. */
    last_updated_by?: string;
    lock?: PromptLock;
    prompts?: WxPromptSessionEntry[];
  }

  /** WxPromptSessionEntry. */
  export interface WxPromptSessionEntry {
    /** The prompt's id. This value cannot be set. It is returned in responses only. */
    id?: string;
    /** Name used to display the prompt. */
    name: string;
    /** An optional description for the prompt. */
    description?: string;
    prompt_variables?: JsonObject;
    is_template?: boolean;
    /** Time the prompt was created. */
    created_at: number;
    /** Input mode in use for the prompt. */
    input_mode?: WxPromptSessionEntry.Constants.InputMode | string;
    prompt: Prompt;
  }
  export namespace WxPromptSessionEntry {
    export namespace Constants {
      /** Input mode in use for the prompt. */
      export enum InputMode {
        STRUCTURED = 'structured',
        FREEFORM = 'freeform',
        CHAT = 'chat',
      }
    }
  }

  /** WxPromptSessionEntryList. */
  export interface WxPromptSessionEntryList {
    results?: WxPromptSessionEntryListResultsItem[];
    bookmark?: string;
  }

  /** Payload for copying a notebook. */
  export interface NotebooksCreateRequestNotebookCopyBody extends NotebooksCreateRequest {
    /** The name of the new notebook. */
    name: string;
    /** The guid of the notebook to be copied. */
    source_guid: string;
  }

  /** Payload for creating a notebook in a project. */
  export interface NotebooksCreateRequestNotebookCreateBodyInProject
    extends NotebooksCreateRequest {
    /** The name of the new notebook. */
    name: string;
    /** A more verbose description of the notebook. */
    description?: string;
    /** The reference to the file in the object storage. */
    file_reference: string;
    /** The notebook origin. */
    originates_from?: NotebookOrigin;
    /** A notebook runtime. */
    runtime: NotebookRuntime;
    /** A notebook kernel. */
    kernel?: NotebookKernel;
    /** The guid of the project in which to create the notebook. */
    project: string;
  }

  /** Information of a copied notebook as returned by a GET request. */
  export interface NotebooksCreateResponseNotebookForCopy extends NotebooksCreateResponse {
    /** Metadata of a notebook in a project. */
    metadata?: NotebookMetadataInProject;
    /** Entity of a notebook copied from a source. */
    entity?: NotebookEntityForCopy;
  }

  /** Notebook information in a project as returned by a GET request. */
  export interface NotebooksCreateResponseNotebookInProject extends NotebooksCreateResponse {
    /** Metadata of a notebook in a project. */
    metadata?: NotebookMetadataInProject;
    /** Entity of a notebook. */
    entity?: NotebookEntity;
  }

  /** Notebook information in a project as returned by a GET request. */
  export interface NotebooksRevertResponseNotebookInProject extends NotebooksRevertResponse {
    /** Metadata of a notebook in a project. */
    metadata?: NotebookMetadataInProject;
    /** Entity of a notebook. */
    entity?: NotebookEntity;
  }

  /** A notebook version in a project. */
  export interface VersionsCreateResponseNotebookVersionInProject extends VersionsCreateResponse {
    /** Notebook version metadata. */
    metadata?: NotebookVersionMetadata;
    /** A notebook version entity in a project. */
    entity?: NotebookVersionEntityInProject;
  }

  /** A notebook version in a project. */
  export interface VersionsGetResponseNotebookVersionInProject extends VersionsGetResponse {
    /** Notebook version metadata. */
    metadata?: NotebookVersionMetadata;
    /** A notebook version entity in a project. */
    entity?: NotebookVersionEntityInProject;
  }

  /** A list of notebook versions in a project. */
  export interface VersionsListResponseNotebookVersionsListInProject extends VersionsListResponse {
    /** The number of items in the resources array. */
    total_results: number;
    /** An array of notebook versions. */
    resources: NotebookVersionInProject[];
  }

  /*************************
   * pager classes
   ************************/

  /**
   * FoundationModelSpecsPager can be used to simplify the use of listFoundationModelSpecs().
   */
  export class FoundationModelSpecsPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.ListFoundationModelSpecsParams;

    /**
     * Construct a FoundationModelSpecsPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listFoundationModelSpecs()
     * @param {Object} [params] - The parameters to be passed to listFoundationModelSpecs()
     * @constructor
     * @returns {FoundationModelSpecsPager}
     */
    constructor(
      client: WatsonxAiMlVml_v1,
      params?: WatsonxAiMlVml_v1.ListFoundationModelSpecsParams
    ) {
      if (params && params.start) {
        throw new Error(`the params.start field should not be set`);
      }

      this._hasNext = true;
      this.pageContext = { next: undefined };
      this.client = client;
      this.params = JSON.parse(JSON.stringify(params || {}));
    }

    /**
     * Returns true if there are potentially more results to be retrieved by invoking getNext().
     * @returns {boolean}
     */
    public hasNext(): boolean {
      return this._hasNext;
    }

    /**
     * Returns the next page of results by invoking listFoundationModelSpecs().
     * @returns {Promise<WatsonxAiMlVml_v1.FoundationModel[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.FoundationModel[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listFoundationModelSpecs(this.params);
      const { result } = response;

      let next;
      if (result && result.next) {
        if (result.next.href) {
          next = getQueryParam(result.next.href, 'start');
        }
      }
      this.pageContext.next = next;
      if (!this.pageContext.next) {
        this._hasNext = false;
      }
      return result.resources;
    }

    /**
     * Returns all results by invoking listFoundationModelSpecs() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.FoundationModel[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.FoundationModel[]> {
      const results: FoundationModel[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /**
   * FoundationModelTasksPager can be used to simplify the use of listFoundationModelTasks().
   */
  export class FoundationModelTasksPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.ListFoundationModelTasksParams;

    /**
     * Construct a FoundationModelTasksPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listFoundationModelTasks()
     * @param {Object} [params] - The parameters to be passed to listFoundationModelTasks()
     * @constructor
     * @returns {FoundationModelTasksPager}
     */
    constructor(
      client: WatsonxAiMlVml_v1,
      params?: WatsonxAiMlVml_v1.ListFoundationModelTasksParams
    ) {
      if (params && params.start) {
        throw new Error(`the params.start field should not be set`);
      }

      this._hasNext = true;
      this.pageContext = { next: undefined };
      this.client = client;
      this.params = JSON.parse(JSON.stringify(params || {}));
    }

    /**
     * Returns true if there are potentially more results to be retrieved by invoking getNext().
     * @returns {boolean}
     */
    public hasNext(): boolean {
      return this._hasNext;
    }

    /**
     * Returns the next page of results by invoking listFoundationModelTasks().
     * @returns {Promise<WatsonxAiMlVml_v1.FoundationModelTask[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.FoundationModelTask[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listFoundationModelTasks(this.params);
      const { result } = response;

      let next;
      if (result && result.next) {
        if (result.next.href) {
          next = getQueryParam(result.next.href, 'start');
        }
      }
      this.pageContext.next = next;
      if (!this.pageContext.next) {
        this._hasNext = false;
      }
      return result.resources;
    }

    /**
     * Returns all results by invoking listFoundationModelTasks() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.FoundationModelTask[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.FoundationModelTask[]> {
      const results: FoundationModelTask[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /**
   * TrainingsListPager can be used to simplify the use of listTrainings().
   */
  export class TrainingsListPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.TrainingsListParams;

    /**
     * Construct a TrainingsListPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listTrainings()
     * @param {Object} [params] - The parameters to be passed to listTrainings()
     * @constructor
     * @returns {TrainingsListPager}
     */
    constructor(client: WatsonxAiMlVml_v1, params?: WatsonxAiMlVml_v1.TrainingsListParams) {
      if (params && params.start) {
        throw new Error(`the params.start field should not be set`);
      }

      this._hasNext = true;
      this.pageContext = { next: undefined };
      this.client = client;
      this.params = JSON.parse(JSON.stringify(params || {}));
    }

    /**
     * Returns true if there are potentially more results to be retrieved by invoking getNext().
     * @returns {boolean}
     */
    public hasNext(): boolean {
      return this._hasNext;
    }

    /**
     * Returns the next page of results by invoking listTrainings().
     * @returns {Promise<WatsonxAiMlVml_v1.TrainingResource[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.TrainingResource[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listTrainings(this.params);
      const { result } = response;

      let next;
      if (result && result.next) {
        if (result.next.href) {
          next = getQueryParam(result.next.href, 'start');
        }
      }
      this.pageContext.next = next;
      if (!this.pageContext.next) {
        this._hasNext = false;
      }
      return result.resources;
    }

    /**
     * Returns all results by invoking listTrainings() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.TrainingResource[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.TrainingResource[]> {
      const results: TrainingResource[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }
}

export = WatsonxAiMlVml_v1;
