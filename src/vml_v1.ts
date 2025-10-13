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
 * IBM OpenAPI SDK Code Generator Version: 3.90.0-5aad763d-20240506-203857
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/first */

import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { Agent } from 'https';
import fs from 'fs';
import {
  BaseService,
  UserOptions,
  constructServiceUrl,
  getQueryParam,
  readExternalSources,
  validateParams,
} from 'ibm-cloud-sdk-core';
import { BaseServiceOptions } from 'ibm-cloud-sdk-core/es/lib/base-service';
import FormData from 'form-data';
import { getAuthenticatorFromEnvironment } from './authentication/utils/get-authenticator-from-environment';
import {
  getSdkHeaders,
  Stream,
  transformStreamToObjectStream,
  transformStreamToStringStream,
} from './lib/common';
import { RequestTokenResponse } from './authentication/utils/authenticators';

/**
 * SDK entrypoint for IBM watsonx.ai product
 *
 * API Version: v1
 */

const PLATFORM_URLS_MAP = {
  'https://ca-tor.ml.cloud.ibm.com': 'https://api.ca-tor.dai.cloud.ibm.com/wx',
  'https://jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
  'https://eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
  'https://eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
  'https://us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
  'https://private.ca-tor.ml.cloud.ibm.com': 'https://private.api.ca-tor.dai.cloud.ibm.com',
  'https://private.jp-tok.ml.cloud.ibm.com': 'https://api.jp-tok.dataplatform.cloud.ibm.com/wx',
  'https://private.eu-gb.ml.cloud.ibm.com': 'https://api.eu-gb.dataplatform.cloud.ibm.com/wx',
  'https://private.eu-de.ml.cloud.ibm.com': 'https://api.eu-de.dataplatform.cloud.ibm.com/wx',
  'https://private.us-south.ml.cloud.ibm.com': 'https://api.dataplatform.cloud.ibm.com/wx',
  'https://ap-south-1.aws.wxai.ibm.com': 'https://api.ap-south-1.aws.data.ibm.com/wx',
  'https://wxai.prep.ibmforusgov.com': 'https://api.dai.prep.ibmforusgov.com/wx',
  'https://private.wxai.prep.ibmforusgov.com': 'https://api.dai.prep.ibmforusgov.com/wx',
  'https://wxai.ibmforusgov.com': 'https://api.dai.ibmforusgov.com/wx',
  'https://private.wxai.ibmforusgov.com': 'https://api.dai.ibmforusgov.com/wx',
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

  static serviceUrl: string;

  httpsAgentMap: WatsonxAiMlVml_v1.HttpsAgentMap = { service: undefined, dataplatform: undefined };

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

  public static newInstance(
    options: UserOptions &
      WatsonxAiMlVml_v1.TokenAuthenticationOptions &
      WatsonxAiMlVml_v1.Certificates
  ): WatsonxAiMlVml_v1 {
    options = options || {};

    if (!options.serviceName) {
      options.serviceName = this.DEFAULT_SERVICE_NAME;
    }
    let httpsAgentAuth: Agent | undefined;

    if (typeof options.caCert === 'string') {
      const certFile = fs.readFileSync(options.caCert);

      httpsAgentAuth = new Agent({
        ca: certFile,
      });

      options.httpsAgent = httpsAgentAuth;
    } else if (options.caCert?.auth?.path) {
      const certFile = fs.readFileSync(options.caCert.auth.path);

      httpsAgentAuth = new Agent({
        ca: certFile,
      });
    }

    if (!options.authenticator) {
      const { serviceName, requestToken, serviceUrl } = options;
      options.authenticator = getAuthenticatorFromEnvironment({
        serviceName,
        requestToken,
        serviceUrl,
        httpsAgent: httpsAgentAuth,
      });
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

  protected createRequest(parameters: Record<string, any>) {
    const apiType = parameters.defaultOptions.serviceUrl.includes('api')
      ? 'dataplatform'
      : 'service';
    parameters.defaultOptions.axiosOptions.httpsAgent = this.httpsAgentMap[apiType];
    return super.createRequest(parameters);
  }

  /** The version date for the API of the form `YYYY-MM-DD`. */
  version: string;

  wxServiceUrl: string;

  serviceUrl: string;

  /**
   * Construct a WatsonxAiMlVml_v1 object.
   *
   * @param {Object} options - Options for the service.
   * @param {string} options.version - The version date for the API of the form `YYYY-MM-DD`.
   * @param {string} [options.serviceUrl] - The base URL for the service
   * @param {OutgoingHttpHeaders} [options.headers] - Default headers that shall be included with every request to the service.
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
   * @param {string | Certificates} [options.caCert] - Path to a SSL certificate that should be used in each request or an object of mapped paths that should be used for different endpoints
   * @constructor
   * @returns {WatsonxAiMlVml_v1}
   */
  constructor(options: UserOptions) {
    options = options || {};

    const _requiredParams = ['version'];
    // @ts-expect-error
    const _validationErrors = validateParams(options, _requiredParams, null);
    if (_validationErrors) {
      throw _validationErrors;
    } else {
      options.version = options.version as string;
    }
    super(options);
    if (options.serviceUrl) {
      this.setServiceUrl(options.serviceUrl);
    } else {
      this.setServiceUrl(WatsonxAiMlVml_v1.DEFAULT_SERVICE_URL);
    }

    if (options.caCert?.service?.path) {
      const certFile = fs.readFileSync(options.caCert.service.path);

      this.httpsAgentMap.service = new Agent({
        ca: certFile,
      });
    }
    if (options.caCert?.dataplatform?.path) {
      const certFile = fs.readFileSync(options.caCert.dataplatform.path);

      this.httpsAgentMap.dataplatform = new Agent({
        ca: certFile,
      });
    }

    if (!this.baseOptions.serviceUrl)
      throw new Error('Something went wrong with setting up serviceUrl');
    type PlatformUrlKeys = keyof typeof PLATFORM_URLS_MAP;

    if (options.platformUrl) {
      this.wxServiceUrl = options.platformUrl.concat('/wx');
      this.serviceUrl = options.platformUrl;
    } else if (Object.keys(PLATFORM_URLS_MAP).includes(this.baseOptions.serviceUrl)) {
      this.wxServiceUrl = PLATFORM_URLS_MAP[this.baseOptions.serviceUrl as PlatformUrlKeys];
      [this.serviceUrl] =
        PLATFORM_URLS_MAP[this.baseOptions.serviceUrl as PlatformUrlKeys].split('/wx');
    } else {
      this.wxServiceUrl = this.baseOptions.serviceUrl.concat('/wx');
      this.serviceUrl = this.baseOptions.serviceUrl;
    }

    this.version = options.version;
  }

  /*************************
   * deployments
   ************************/

  /**
   * Create a new watsonx.ai deployment.
   *
   * Create a new deployment, currently the only supported type is `online`.
   *
   * If this is a deployment for a prompt tune then the `asset` object must exist and the `id` must be the `id` of the
   * `model` that was created after the prompt training.
   *
   * If this is a deployment for a prompt template then the `prompt_template` object should exist and the `id` must be
   * the `id` of the prompt template to be deployed.
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
   * @param {HardwareRequest} [params.hardwareRequest] - The requested hardware for deployment.
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
      'promptTemplate',
      'hardwareSpec',
      'hardwareRequest',
      'asset',
      'baseModelId',
      'headers',
      'signal',
      'baseDeploymentId',
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
      'hardware_request': _params.hardwareRequest,
      'asset': _params.asset,
      'base_model_id': _params.baseModelId,
      'base_deployment_id': _params.baseDeploymentId,
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
   * a pre-deployed IBM provided model. 3. `custom_foundation_model` - when a custom foundation model is deployed.
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
    const _requiredParams: string[] = [];
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
   * - `/asset` - `replace` only
   * - `/prompt_template` - `replace` only
   * - `/hardware_spec`
   * - `/hardware_request`
   * - `/base_model_id` - `replace` only (applicable only to prompt template deployments referring to IBM base
   * foundation models)
   *
   * The PATCH operation with path specified as `/online/parameters` can be used to update the `serving_name`.
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
    const _validParams = ['deploymentId', 'jsonPatch', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json-patch+json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Infer text.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. If a `serving_name` is used then it must
   * match the `serving_name` that is returned in the `inference` section when the deployment was created.
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
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
   *
   * @category Deployments
   */
  public deploymentGenerateText(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>> {
    const _params = { ...params };
    const _requiredParams = ['idOrName'];
    const _validParams = ['idOrName', 'input', 'parameters', 'moderations', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
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
   * Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> represents a source of streaming data. If request performed successfully Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> returns
   * either stream line by line. Output will stream as follow:
   * - id: 1
   * - event: message
   * - data: {data}
   * - empty line which separates the next Event Message
   *
   * or stream of objects. Output will stream as follow:
   * {
   *  id: 2,
   *  event: 'message',
   *  data: {data}
   * }
   * Here is one of the possibilities to read streaming output:
   *
   * const stream = await watsonxAIServiceenerateTextStream(parameters);
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
   * @param {boolean} [params.returnObject] - Flag that indicates return type. Set 'true' to return objects.
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatResponse[]>>>} return - Promise resolving to Stream object. Stream object is AsyncIterable based class. Stream object contains an additional property holding an AbortController, read more below.
   * @returns {AbortController} return.controller - Abort controller. Allows user to abort when reading from stream without transition to Readable
   *
   * @category Deployments
   */

  public async deploymentGenerateTextStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationStreamParams & { returnObject?: false },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<string>>;

  public async deploymentGenerateTextStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationStreamParams & { returnObject: true },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>>>;

  public async deploymentGenerateTextStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextGenerationStreamParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<
    AsyncIterable<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>>
  > {
    const _params = { ...params };
    const _requiredParams = ['idOrName'];
    const _validParams = [
      'idOrName',
      'input',
      'parameters',
      'moderations',
      'headers',
      'signal',
      'returnObject',
    ];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'text/event-stream',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const apiResponse = await this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      apiResponse
    );
    const stream = _params.returnObject
      ? transformStreamToObjectStream<
          WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>
        >(apiResponse)
      : transformStreamToStringStream<string>(apiResponse);
    return stream;
  }

  /**
   * Infer text chat.
   *
   * Infer the next chat message for a given deployment. The deployment must reference a prompt template which has
   * `input_mode` set to `chat`. The model to the chat request will be from the deployment `base_model_id`. Parameters
   * to the chat request will be from the prompt template `model_parameters`. Related guides:
   * [Deployment](https://cloud.ibm.com/apidocs/watsonx-ai#create-deployment), [Prompt
   * template](https://cloud.ibm.com/apidocs/watsonx-ai#post-prompt), [Text
   * chat](https://cloud.ibm.com/apidocs/watsonx-ai#text-chat).
   *
   * If a `serving_name` is used then it must match the `serving_name` that is returned in the `inference` section when
   * the deployment was created.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
   * or a `serving_name` that allows a predefined URL to be used to post a prediction. The deployment must reference a
   * prompt template with `input_mode` `chat`.
   *
   * The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
   * @param {DeploymentTextChatMessages[]} params.messages - The messages for this chat session. You cannot specify
   * `system` `role` in the messages. Depending on the model, the `content` of `system` `role` may be from
   * `system_prompt` of the prompt template, and will be automatically inserted into `messages`.
   *
   * As an example, depending on the model, if `system_prompt` of a prompt template is "You are Granite Chat, an AI
   * language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful
   * and harmless and you follow ethical guidelines and promote positive behavior.", a message with `system` `role`
   * having `content` the same as `system_prompt` is inserted.
   * @param {string} [params.context] - If specified, `context` will be inserted into `messages`. Depending on the
   * model, `context` may be inserted into the `content` with `system` `role`; or into the `content` of the last message
   * of `user` `role`.
   *
   *
   * In the example, `context` "Today is Wednesday" is inserted as such
   * `content` of `user` becomes "Today is Wednesday. Who are you and which day is tomorrow?".
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>}
   *
   * @category Deployments
   */
  public deploymentsTextChat(
    params: WatsonxAiMlVml_v1.DeploymentsTextChatParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>> {
    const _params = { ...params };
    const _requiredParams = ['idOrName', 'messages'];
    const _validParams = ['idOrName', 'messages', 'context', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'messages': _params.messages,
      'context': _params.context,
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
      'deploymentsTextChat'
    );

    const parameters = {
      options: {
        url: '/ml/v1/deployments/{id_or_name}/text/chat',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
  }

  /**
   * Infer text chat event stream.
   *
   * Infer the next chat message for a given deployment. This operation will return the output tokens as a stream of
   * events. The deployment must reference a prompt template which has `input_mode` set to `chat`. The model to the chat
   * request will be from the deployment `base_model_id`. Parameters to the chat request will be from the prompt
   * template `model_parameters`. Related guides:
   * [Deployment](https://cloud.ibm.com/apidocs/watsonx-ai#create-deployment), [Prompt
   * template](https://cloud.ibm.com/apidocs/watsonx-ai#post-prompt), [Text
   * chat](https://cloud.ibm.com/apidocs/watsonx-ai#text-chat).
   *
   * If a `serving_name` is used then it must match the `serving_name` that is returned in the `inference` section when
   * the deployment was created.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
   * or a `serving_name` that allows a predefined URL to be used to post a prediction. The deployment must reference a
   * prompt template with `input_mode` `chat`.
   *
   * The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
   * @param {DeploymentTextChatMessages[]} params.messages - The messages for this chat session. You cannot specify
   * `system` `role` in the messages. Depending on the model, the `content` of `system` `role` may be from
   * `system_prompt` of the prompt template, and will be automatically inserted into `messages`.
   *
   * As an example, depending on the model, if `system_prompt` of a prompt template is "You are Granite Chat, an AI
   * language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful
   * and harmless and you follow ethical guidelines and promote positive behavior.", a message with `system` `role`
   * having `content` the same as `system_prompt` is inserted.
   * @param {string} [params.context] - If specified, `context` will be inserted into `messages`. Depending on the
   * model, `context` may be inserted into the `content` with `system` `role`; or into the `content` of the last message
   * of `user` `role`.
   *
   *
   * In the example, `context` "Today is Wednesday" is inserted as such
   * `content` of `user` becomes "Today is Wednesday. Who are you and which day is tomorrow?".
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatResponse[]>>>} return - Promise resolving to Stream object. Stream object is AsyncIterable based class. Stream object contains an additional property holding an AbortController, read more below.
   * @returns {AbortController} return.controller - Abort controller. Allows user to abort when reading from stream without transition to Readable
   * @category Deployments
   */
  public async deploymentsTextChatStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextChatStreamParams & { returnObject?: false },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<string>>;

  public async deploymentsTextChatStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextChatStreamParams & { returnObject: true },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>>>;

  public async deploymentsTextChatStream(
    params: WatsonxAiMlVml_v1.DeploymentsTextChatStreamParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<
    Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>>
  > {
    const _params = { ...params };
    const _requiredParams = ['idOrName', 'messages'];
    const _validParams = ['idOrName', 'messages', 'context', 'headers', 'signal', 'returnObject'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'messages': _params.messages,
      'context': _params.context,
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
      'deploymentsTextChatStream'
    );

    const parameters = {
      options: {
        url: '/ml/v1/deployments/{id_or_name}/text/chat_stream',
        method: 'POST',
        body,
        qs: query,
        path,
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
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const apiResponse = await this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      apiResponse
    );
    const stream = _params.returnObject
      ? transformStreamToObjectStream<
          WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>
        >(apiResponse)
      : transformStreamToStringStream<string>(apiResponse);
    return stream;
  }

  /**
   * Time series forecast.
   *
   * Generate forecasts, or predictions for future time points, given historical time series data.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
   * or a `serving_name` that allows a predefined URL to be used to post a prediction.
   *
   * The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
   * @param {JsonObject} params.data - A payload of data matching `schema`. We assume the following about your data:
   *   * All timeseries are of equal length and are uniform in nature (the time difference between two successive rows
   * is constant). This implies that there are no missing rows of data;
   *   * The data meet the minimum model-dependent historical context length which
   *   can be any number of rows per timeseries;
   *
   * Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be much
   * larger to meet minimum model-specific context lengths.
   * @param {TSForecastInputSchema} params.schema - Contains metadata about your timeseries data input.
   * @param {DeploymentTSForecastParameters} [params.parameters] - The parameters for the forecast request.
   * @param {JsonObject} [params.futureData] - Exogenous or supporting features that extend into the forecasting horizon
   * (e.g., a weather forecast or calendar of special promotions) which are known in advance. `future_data` would be in
   * the same format as `data` except  that all timestamps would be in the forecast horizon and it would not include
   * previously specified
   * `target_columns`.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>>}
   */
  public deploymentsTimeSeriesForecast(
    params: WatsonxAiMlVml_v1.DeploymentsTimeSeriesForecastParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>> {
    const _params = { ...params };
    const _requiredParams = ['idOrName', 'data', 'schema'];
    const _validParams = [
      'idOrName',
      'data',
      'schema',
      'parameters',
      'futureData',
      'signal',
      'headers',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'data': _params.data,
      'schema': _params.schema,
      'parameters': _params.parameters,
      'future_data': _params.futureData,
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
      'deploymentsTimeSeriesForecast'
    );

    const parameters = {
      options: {
        url: '/ml/v1/deployments/{id_or_name}/time_series/forecast',
        method: 'POST',
        body,
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
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
    const _requiredParams: string[] = [];
    const _validParams = ['start', 'limit', 'filters', 'techPreview', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _requiredParams: string[] = [];
    const _validParams = ['start', 'limit', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = [
      'promptId',
      'projectId',
      'spaceId',
      'restrictModelParameters',
      'headers',
      'signal',
    ];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * List all prompts.
   *
   * This retrieves all prompts within the given project/space.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
   * per request.
   * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
   * request.
   * @param {string} [params.limit] - The limit request body field can be specified to limit the number of assets in the search results. The default limit is 200. The maximum limit value is 200, and any greater value is ignored.
   * @param {string} [params.counts] - Returns the number of query results for each unique value of each named field.
   * @param {string} [params.drilldown] - Restrict results to documents with a dimension equal to the specified label. Note that, multiple values for a single key in a drilldown means an OR relation between them and there is an AND relation between multiple keys.
   * @param {string} [params.bookmark] - Bookmark of the query result
   * @param {string} [params.sort] - Sort order for the query
   * @param {string} [params.include] - Entity
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ListPromptsResponse>>}
   *
   * @category Prompts / Prompt Templates
   */
  public listPrompts(
    params: WatsonxAiMlVml_v1.PromptListParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ListPromptsResponse>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = [
      'projectId',
      'spaceId',
      'query',
      'limit',
      'counts',
      'drilldown',
      'bookmark',
      'sort',
      'include',
      'skip',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const body = {
      'query': 'asset.asset_type:wx_prompt',
      'limit': _params.limit,
      'counts': _params.counts,
      'drilldown': _params.drilldown,
      'bookmark': _params.bookmark,
      'sort': _params.sort,
      'include': _params.include,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listPrompts'
    );

    const parameters = {
      options: {
        url: '/v2/asset_types/wx_prompt/search',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'promptVariables',
      'inputMode',
      'projectId',
      'spaceId',
      'headers',
      'signal',
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
      'prompt_variables': _params.promptVariables,
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['promptId', 'projectId', 'spaceId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['promptId', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
   * @param {JsonObject} [params.promptVariables] - Supply only to replace placeholders. Object content must be
   * key:value pairs where the 'key' is the parameter to replace and 'value' is the value to use.
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
    const _validParams = [
      'promptId',
      'input',
      'promptVariables',
      'spaceId',
      'projectId',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'input': _params.input,
      'prompt_variables': _params.promptVariables,
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['promptId', 'chatItem', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'projectId', 'prefetch', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'name', 'description', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'projectId', 'bookmark', 'limit', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'entryId', 'chatItem', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'entryId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['sessionId', 'entryId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /*************************
   * textChat
   ************************/

  /**
   * Infer text.
   *
   * Infer the next tokens for a given deployed model with a set of parameters.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The model to use for the chat completion.
   *
   * Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
   * @param {TextChatMessages[]} params.messages - The messages for this chat session.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {TextChatParameterTools[]} [params.tools] - Tool functions that can be called with the response.
   * @param {string} [params.toolChoiceOption] - Using `none` means the model will not call any tool and instead
   * generates a message.
   *
   * **The following options (`auto` and `required`) are not yet supported.**
   *
   * Using `auto` means the model can pick between generating a message or calling one or more tools. Using `required`
   * means the model must call one or more tools.
   *
   * Only one of `tool_choice_option` or `tool_choice` must be present.
   * @param {TextChatToolChoiceTool} [params.toolChoice] - Specifying a particular tool via `{"type": "function",
   * "function": {"name": "my_function"}}` forces the model to call that tool.
   *
   * Only one of `tool_choice_option` or `tool_choice` must be present.
   * @param {number} [params.frequencyPenalty] - Positive values penalize new tokens based on their existing frequency
   * in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   * @param {boolean} [params.logprobs] - Whether to return log probabilities of the output tokens or not. If true,
   * returns the log probabilities of each output token returned in the content of message.
   * @param {number} [params.topLogprobs] - An integer specifying the number of most likely tokens to return at each
   * token position, each with an associated log probability. The option `logprobs` must be set to `true` if this
   * parameter is used.
   * @param {number} [params.maxTokens] - The maximum number of tokens that can be generated in the chat completion. The
   * total length of input tokens and generated tokens is limited by the model's context length.
   * @param {number} [params.n] - How many chat completion choices to generate for each input message. Note that you
   * will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.
   * @param {number} [params.presencePenalty] - Positive values penalize new tokens based on whether they appear in the
   * text so far, increasing the model's likelihood to talk about new topics.
   * @param {TextChatResponseFormat} [params.responseFormat] - The chat response format parameters.
   * @param {number} [params.temperature] - What sampling temperature to use,. Higher values like 0.8 will make the
   * output more random, while lower values like 0.2 will make it more focused and deterministic.
   *
   * We generally recommend altering this or `top_p` but not both.
   * @param {number} [params.topP] - An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the
   * top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   * @param {number} [params.timeLimit] - Time limit in milliseconds - if not completed within this time, generation
   * will stop. The text generated so far will be returned along with the `TIME_LIMIT`` stop reason. Depending on the
   * users plan, and on the model being used, there may be an enforced maximum time limit.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>}
   *
   * @category Text Chat
   */
  public textChat(
    params: WatsonxAiMlVml_v1.TextChatParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'messages'];
    const _validParams = [
      'modelId',
      'messages',
      'spaceId',
      'projectId',
      'tools',
      'toolChoiceOption',
      'toolChoice',
      'frequencyPenalty',
      'logitBias',
      'logprobs',
      'topLogprobs',
      'maxTokens',
      'maxCompletionTokens',
      'n',
      'presencePenalty',
      'responseFormat',
      'seed',
      'stop',
      'temperature',
      'topP',
      'timeLimit',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }
    const body = {
      'model_id': _params.modelId,
      'messages': _params.messages,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'tools': _params.tools,
      'tool_choice_option': _params.toolChoiceOption,
      'tool_choice': _params.toolChoice,
      'frequency_penalty': _params.frequencyPenalty,
      'logit_bias': _params.logitBias,
      'logprobs': _params.logprobs,
      'top_logprobs': _params.topLogprobs,
      'max_tokens': _params.maxTokens,
      'max_completion_tokens': _params.maxCompletionTokens,
      'n': _params.n,
      'presence_penalty': _params.presencePenalty,
      'response_format': _params.responseFormat,
      'seed': _params.seed,
      'stop': _params.stop,
      'temperature': _params.temperature,
      'top_p': _params.topP,
      'time_limit': _params.timeLimit,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textChat');

    const parameters = {
      options: {
        url: '/ml/v1/text/chat',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };
    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
  }

  /**
   * Infer text event stream.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. This operation will return the output
   * tokens as a stream of events
   *
   * ### Response
   * Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> represents a source of streaming data. If request performed successfully Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> returns
   * either stream line by line. Output will stream as follow:
   * - id: 1
   * - event: message
   * - data: {data}
   * - empty line which separates the next Event Message
   *
   * or stream of objects. Output will stream as follow:
   * {
   *  id: 2,
   *  event: 'message',
   *  data: {data}
   * }
   * Here is one of the possibilities to read streaming output:
   *
   * const stream = await watsonxAIServiceenerateTextStream(parameters);
   * for await (const line of stream) {
   *   console.log(line);
   * }.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The model to use for the chat completion.
   *
   * Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
   * @param {TextChatMessages[]} params.messages - The messages for this chat session.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {TextChatParameterTools[]} [params.tools] - Tool functions that can be called with the response.
   * @param {string} [params.toolChoiceOption] - Using `none` means the model will not call any tool and instead
   * generates a message.
   *
   * **The following options (`auto` and `required`) are not yet supported.**
   *
   * Using `auto` means the model can pick between generating a message or calling one or more tools. Using `required`
   * means the model must call one or more tools.
   *
   * Only one of `tool_choice_option` or `tool_choice` must be present.
   * @param {TextChatToolChoiceTool} [params.toolChoice] - Specifying a particular tool via `{"type": "function",
   * "function": {"name": "my_function"}}` forces the model to call that tool.
   *
   * Only one of `tool_choice_option` or `tool_choice` must be present.
   * @param {number} [params.frequencyPenalty] - Positive values penalize new tokens based on their existing frequency
   * in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   * @param {boolean} [params.logprobs] - Whether to return log probabilities of the output tokens or not. If true,
   * returns the log probabilities of each output token returned in the content of message.
   * @param {number} [params.topLogprobs] - An integer specifying the number of most likely tokens to return at each
   * token position, each with an associated log probability. The option `logprobs` must be set to `true` if this
   * parameter is used.
   * @param {number} [params.maxTokens] - The maximum number of tokens that can be generated in the chat completion. The
   * total length of input tokens and generated tokens is limited by the model's context length.
   * @param {number} [params.n] - How many chat completion choices to generate for each input message. Note that you
   * will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.
   * @param {number} [params.presencePenalty] - Positive values penalize new tokens based on whether they appear in the
   * text so far, increasing the model's likelihood to talk about new topics.
   * @param {TextChatResponseFormat} [params.responseFormat] - The chat response format parameters.
   * @param {number} [params.temperature] - What sampling temperature to use,. Higher values like 0.8 will make the
   * output more random, while lower values like 0.2 will make it more focused and deterministic.
   *
   * We generally recommend altering this or `top_p` but not both.
   * @param {number} [params.topP] - An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the
   * top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   * @param {number} [params.timeLimit] - Time limit in milliseconds - if not completed within this time, generation
   * will stop. The text generated so far will be returned along with the `TIME_LIMIT`` stop reason. Depending on the
   * users plan, and on the model being used, there may be an enforced maximum time limit.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @param {boolean} [params.returnObject] - Flag that indicates return type. Set 'true' to return objects.
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatResponse[]>>>} return - Promise resolving to Stream object. Stream object is AsyncIterable based class. Stream object contains an additional property holding an AbortController, read more below.
   * @returns {AbortController} return.controller - Abort controller. Allows user to abort when reading from stream without transition to Readable
   *
   * @category Text Chat
   */

  public async textChatStream(
    params: WatsonxAiMlVml_v1.TextChatStreamParams & { returnObject?: false },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<string>>;

  public async textChatStream(
    params: WatsonxAiMlVml_v1.TextChatStreamParams & { returnObject: true },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>>>;

  public async textChatStream(
    params: WatsonxAiMlVml_v1.TextChatStreamParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<
    Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>>
  > {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'messages'];
    const _validParams = [
      'modelId',
      'messages',
      'spaceId',
      'projectId',
      'tools',
      'toolChoiceOption',
      'toolChoice',
      'frequencyPenalty',
      'logitBias',
      'logprobs',
      'topLogprobs',
      'maxTokens',
      'maxCompletionTokens',
      'n',
      'presencePenalty',
      'responseFormat',
      'seed',
      'stop',
      'temperature',
      'topP',
      'timeLimit',
      'headers',
      'signal',
      'returnObject',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'model_id': _params.modelId,
      'messages': _params.messages,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'tools': _params.tools,
      'tool_choice_option': _params.toolChoiceOption,
      'tool_choice': _params.toolChoice,
      'frequency_penalty': _params.frequencyPenalty,
      'logit_bias': _params.logitBias,
      'logprobs': _params.logprobs,
      'top_logprobs': _params.topLogprobs,
      'max_tokens': _params.maxTokens,
      'max_completion_tokens': _params.maxCompletionTokens,
      'n': _params.n,
      'presence_penalty': _params.presencePenalty,
      'response_format': _params.responseFormat,
      'seed': _params.seed,
      'stop': _params.stop,
      'temperature': _params.temperature,
      'top_p': _params.topP,
      'time_limit': _params.timeLimit,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textChatStream'
    );
    const parameters = {
      options: {
        url: '/ml/v1/text/chat_stream',
        method: 'POST',
        body,
        qs: query,
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
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };
    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const apiResponse = await this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      apiResponse
    );
    const stream = _params.returnObject
      ? transformStreamToObjectStream<
          WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatStreamResponse>
        >(apiResponse)
      : transformStreamToStringStream<string>(apiResponse);
    return stream;
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
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmbeddingsResponse>>}
   *
   * @category Embeddings
   */
  public embedText(
    params: WatsonxAiMlVml_v1.TextEmbeddingsParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmbeddingsResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'inputs'];
    const _validParams = [
      'modelId',
      'inputs',
      'spaceId',
      'projectId',
      'parameters',
      'headers',
      'signal',
    ];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
  }

  /*************************
   * createTextExtraction
   ************************/

  /**
   * Start a text extraction request.
   *
   * Start a request to extract text and metadata from documents.
   *
   * See the
   * [documentation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-text-extraction.html?context=wx&audience=wdp)
   * for a description of text extraction.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {TextExtractionDataReference} params.documentReference - A reference to data.
   * @param {TextExtractionDataReference} params.resultsReference - A reference to data.
   * @param {TextExtractionSteps} [params.steps] - The steps for the text extraction pipeline.
   * @param {JsonObject} [params.assemblyJson] - Set this as an empty object to specify `json` output.
   *
   * Note that this is not strictly required because if an
   * `assembly_md` object is not found then the default will be `json`.
   * @param {JsonObject} [params.assemblyMd] - Set this as an empty object to specify `markdown` output.
   * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>>}
   */
  public createTextExtraction(
    params: WatsonxAiMlVml_v1.TextExtractionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>> {
    const _params = { ...params };
    const _requiredParams = ['documentReference', 'resultsReference'];
    const _validParams = [
      'documentReference',
      'resultsReference',
      'steps',
      'assemblyJson',
      'assemblyMd',
      'custom',
      'projectId',
      'spaceId',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'document_reference': _params.documentReference,
      'results_reference': _params.resultsReference,
      'steps': _params.steps,
      'assembly_json': _params.assemblyJson,
      'assembly_md': _params.assemblyMd,
      'custom': _params.custom,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textExtraction'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/extractions',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the text extraction requests.
   *
   * Retrieve the list of text extraction requests for the specified space or project.
   *
   * This operation does not save the history, any requests that were deleted or purged will not appear in this list.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
   * is 200.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResources>>}
   */
  public listTextExtractions(
    params?: WatsonxAiMlVml_v1.ListTextExtractionsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = ['spaceId', 'projectId', 'start', 'limit', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'start': _params.start,
      'limit': _params.limit,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listTextExtractions'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/extractions',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get the results of the request.
   *
   * Retrieve the text extraction request with the specified identifier.
   *
   * Note that there is a retention period of 2 days. If this retention period is exceeded then the request will be
   * deleted and the results no longer available. In this case this operation will return `404`.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The identifier of the extraction request.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>>}
   */
  public getTextExtraction(
    params: WatsonxAiMlVml_v1.TextExtractionGetParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'spaceId', 'projectId', 'headers', 'signal'];
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
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textExtractionGet'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/extractions/{id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete the request.
   *
   * Cancel the specified text extraction request and delete any associated results.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The identifier of the extraction request.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public deleteTextExtraction(
    params: WatsonxAiMlVml_v1.TextExtractionDeleteParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
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
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'textExtractionDelete'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/extractions/{id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,

          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
   *
   * @category Text Generation
   */
  public generateText(
    params: WatsonxAiMlVml_v1.TextGenerationParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
  }

  /**
   * Infer text event stream.
   *
   * Infer the next tokens for a given deployed model with a set of parameters. This operation will return the output
   * tokens as a stream of events.
   *
   * ### Response
   * Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> represents a source of streaming data. If request performed successfully Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>> returns
   * either stream line by line. Output will stream as follow:
   * - id: 1
   * - event: message
   * - data: {data}
   * - empty line which separates the next Event Message
   *
   * or stream of objects. Output will stream as follow:
   * {
   *  id: ,
   *  event: 'message',
   *  data: {data}
   * }
   *
   * Here is one of the possibilities to read streaming output:
   *
   * const stream = await watsonxAIServiceenerateTextStream(parameters);
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
   * @param {boolean} [params.returnObject] - Flag that indicates return type. Set 'true' to return objects.
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<Stream<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextChatResponse[]>>>} return - Promise resolving to Stream object. Stream object is AsyncIterable based class. Stream object contains an additional property holding an AbortController, read more below.
   * @returns {AbortController} return.controller - Abort controller. Allows user to abort when reading from stream without transition to Readable
   *
   * @category Text Generation
   */

  public async generateTextStream(
    params: WatsonxAiMlVml_v1.TextGenerationStreamParams & { returnObject?: false },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<string>>;

  public async generateTextStream(
    params: WatsonxAiMlVml_v1.TextGenerationStreamParams & { returnObject: true },
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<Stream<WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>>>;

  public async generateTextStream(
    params: WatsonxAiMlVml_v1.TextGenerationStreamParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<
    AsyncIterable<string | WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>>
  > {
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
      'signal',
      'returnObject',
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

      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'text/event-stream',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const apiResponse = await this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      apiResponse
    );
    const stream = _params.returnObject
      ? transformStreamToObjectStream<
          WatsonxAiMlVml_v1.ObjectStreamed<WatsonxAiMlVml_v1.TextGenResponse>
        >(apiResponse)
      : transformStreamToStringStream<string>(apiResponse);
    return stream;
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
    const _validParams = [
      'modelId',
      'input',
      'spaceId',
      'projectId',
      'parameters',
      'headers',
      'signal',
    ];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }
  /*************************
   * timeSeriesTechPreview
   ************************/

  /**
   * Time series forecast.
   *
   * Generate forecasts, or predictions for future time points, given historical time series data.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The model to be used for generating a forecast.
   * @param {JsonObject} params.data - A payload of data matching `schema`. We assume the following about your data:
   *   * All timeseries are of equal length and are uniform in nature (the time difference between two successive rows
   * is constant). This implies that there are no missing rows of data;
   *   * The data meet the minimum model-dependent historical context length which
   *   can be 512 or more rows per timeseries;
   *
   * Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be much
   * larger to meet minimum model-specific context lengths.
   * @param {TSForecastInputSchema} params.schema - Contains metadata about your timeseries data input.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {TSForecastParameters} [params.parameters] - The parameters for the forecast request.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>>}
   */
  public timeSeriesForecast(
    params: WatsonxAiMlVml_v1.TimeSeriesForecastParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'data', 'schema'];
    const _validParams = [
      'modelId',
      'data',
      'schema',
      'projectId',
      'spaceId',
      'parameters',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'model_id': _params.modelId,
      'data': _params.data,
      'schema': _params.schema,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'parameters': _params.parameters,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'timeSeriesForecast'
    );

    const parameters = {
      options: {
        url: '/ml/v1/time_series/forecast',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
   *        curl -X POST "https://{cpd_cluster}/ml/v4/models?version=2024-01-29" \
   *          -H "Authorization: Bearer <replace with your token>" \
   *          -H "content-type: application/json" \
   *          --data '{
   *             "name": "replace_with_a_meaningful_name",
   *             "space_id": "replace_with_your_space_id",
   *             "type": "prompt_tune_1.0",
   *             "software_spec": {
   *               "name": "watsonx-textgen-fm-1.0"
   *             },
   *             "metrics": [ from the training job ],
   *             "training": {
   *               "id": "05859469-b25b-420e-aefe-4a5cb6b595eb",
   *               "base_model": {
   *                 "model_id": "google/flan-t5-xl"
   *               },
   *               "task_id": "generation",
   *               "verbalizer": "Input: {{input}} Output:"
   *             },
   *             "training_data_references": [
   *               {
   *                 "connection": {
   *                   "id": "20933468-7e8a-4706-bc90-f0a09332b263"
   *                 },
   *                 "id": "file_to_tune1.json",
   *                 "location": {
   *                   "bucket": "wxproject-donotdelete-pr-xeyivy0rx3vrbl",
   *                   "path": "file_to_tune1.json"
   *                 },
   *                 "type": "connection_asset"
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
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _requiredParams: string[] = [];
    const _validParams = [
      'start',
      'limit',
      'totalCount',
      'tagValue',
      'state',
      'spaceId',
      'projectId',
      'headers',
      'signal',
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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
    const _validParams = ['trainingId', 'spaceId', 'projectId', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel or delete the training.
   *
   * Cancel the specified training and remove it.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.trainingId - The training identifier.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
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
    const _validParams = ['trainingId', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
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
      defaultOptions: {
        ...this.baseOptions,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }
  /*************************
   * textRerank
   ************************/

  /**
   * Generate rerank.
   *
   * Rerank texts based on some queries.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
   * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
   * @param {RerankInput[]} params.inputs - The rank input strings.
   * @param {string} params.query - The rank query.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {RerankParameters} [params.parameters] - The properties used for reranking.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request header
   * @param {Object} callbacks - The parameters to send to the service.
   * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
   * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.RerankResponse>>}
   *
   * @category Text Rerank
   */
  public textRerank(
    params: WatsonxAiMlVml_v1.TextRerankParams,
    callbacks?: WatsonxAiMlVml_v1.RequestCallbacks<
      WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>
    >
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.RerankResponse>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'inputs', 'query'];
    const _validParams = [
      'modelId',
      'inputs',
      'query',
      'spaceId',
      'projectId',
      'parameters',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'model_id': _params.modelId,
      'inputs': _params.inputs,
      'query': _params.query,
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
      'textRerank'
    );

    const parameters = {
      options: {
        url: '/ml/v1/text/rerank',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    const callbackHandler = callbacks
      ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
      : undefined;
    callbackHandler?.handleRequest(parameters);
    const response = this.createRequest(parameters);
    callbackHandler?.handleResponse<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>(
      response
    );
    return response;
  }
  /*************************
   * fineTunings
   ************************/

  /**
   * Create a fine tuning job.
   *
   * Create a fine tuning job that will fine tune an LLM.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the job.
   * @param {ObjectLocation[]} params.trainingDataReferences - The training datasets.
   * @param {ObjectLocation} params.resultsReference - The training results. Normally this is specified as
   * `type=container` which
   * means that it is stored in the space or project.
   * @param {string} [params.description] - The description of the job.
   * @param {string[]} [params.tags] - A list of tags for this resource.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {boolean} [params.autoUpdateModel] - This field must not be set while creating a fine tuning job with
   * InstructLab.
   *
   * If set to `true` then the result of the training, if successful, will be uploaded to the repository as a model.
   * @param {FineTuningParameters} [params.parameters] - This field must not be set while creating a fine tuning job
   * with InstructLab.
   *
   * The parameters for the job. Note that if `verbalizer` is provided
   * then `response_template` must also be provided (and vice versa).
   * @param {string} [params.type] - The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab
   * training.
   * @param {ObjectLocation[]} [params.testDataReferences] - This field must not be set while creating a fine tuning job
   * with InstructLab.
   *
   * The holdout/test datasets.
   * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>>}
   */
  public createFineTuning(
    params: WatsonxAiMlVml_v1.CreateFineTuningParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'trainingDataReferences', 'resultsReference'];
    const _validParams = [
      'name',
      'trainingDataReferences',
      'resultsReference',
      'description',
      'tags',
      'projectId',
      'spaceId',
      'autoUpdateModel',
      'parameters',
      'type',
      'testDataReferences',
      'custom',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'training_data_references': _params.trainingDataReferences,
      'results_reference': _params.resultsReference,
      'description': _params.description,
      'tags': _params.tags,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'auto_update_model': _params.autoUpdateModel,
      'parameters': _params.parameters,
      'type': _params.type,
      'test_data_references': _params.testDataReferences,
      'custom': _params.custom,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'createFineTuning'
    );

    const parameters = {
      options: {
        url: '/ml/v1/fine_tunings',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the list of fine tuning jobs.
   *
   * Retrieve the list of fine tuning jobs for the specified space or project.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned.
   * @param {boolean} [params.totalCount] - Compute the total count. May have performance impact.
   * @param {string} [params.tagValue] - Return only the resources with the given tag value.
   * @param {string} [params.state] - Filter based on on the job state: queued, running, completed, failed etc.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResources>>}
   */
  public listFineTunings(
    params?: WatsonxAiMlVml_v1.FineTuningListParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = [
      'start',
      'limit',
      'totalCount',
      'tagValue',
      'state',
      'spaceId',
      'projectId',
      'headers',
      'signal',
      'type',
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
      'type': _params.type,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'fineTuningList'
    );

    const parameters = {
      options: {
        url: '/ml/v1/fine_tunings',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get a fine tuning job.
   *
   * Get the results of a fine tuning job, or details if the job failed.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>>}
   */
  public getFineTuning(
    params: WatsonxAiMlVml_v1.GetFineTuningParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'spaceId', 'projectId', 'headers', 'signal'];
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
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getFineTuning'
    );

    const parameters = {
      options: {
        url: '/ml/v1/fine_tunings/{id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel or delete a fine tuning job.
   *
   * Delete a fine tuning job if it exists, once deleted all trace of the job is gone.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public deleteFineTuning(
    params: WatsonxAiMlVml_v1.DeleteFineTuningParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
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
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deleteFineTuning'
    );

    const parameters = {
      options: {
        url: '/ml/v1/fine_tunings/{id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: { ...sdkHeaders, ..._params.headers },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }
  /*************************
   * documentExtractionTechPreview
   ************************/

  /**
   * Create a document extraction.
   *
   * Create a document extraction.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the document.
   * @param {DocumentExtractionObjectLocation[]} params.documentReferences - The documents for text extraction.
   * @param {ObjectLocationGithub} params.resultsReference - A reference to data.
   * @param {string[]} [params.tags] - A list of tags for this resource.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>>}
   */
  public createDocumentExtraction(
    params: WatsonxAiMlVml_v1.CreateDocumentExtractionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'documentReferences'];
    const _validParams = [
      'name',
      'documentReferences',
      'resultsReference',
      'tags',
      'projectId',
      'spaceId',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'document_references': _params.documentReferences,
      'results_reference': _params.resultsReference,
      'tags': _params.tags,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'createDocumentExtraction'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/documents',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get document extractions.
   *
   * Get document extractions.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResources>>}
   */
  public listDocumentExtractions(
    params?: WatsonxAiMlVml_v1.ListDocumentExtractionsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listDocumentExtractions'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/documents',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get document extraction.
   *
   * Get document extraction.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>>}
   */
  public getDocumentExtraction(
    params: WatsonxAiMlVml_v1.GetDocumentExtractionParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getDocumentExtraction'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/documents/{id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel the document extraction.
   *
   * Cancel the specified document extraction and remove it.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job metadata information.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public cancelDocumentExtractions(
    params: WatsonxAiMlVml_v1.CancelDocumentExtractionsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'hard_delete': _params.hardDelete,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'cancelDocumentExtractions'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/documents/{id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }
  /*************************
   * syntheticDataGenerationTechPreview
   ************************/

  /**
   * Create a synthetic data generation job.
   *
   * Create a synthetic data generation job.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the data.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {SyntheticDataGenerationDataReference} [params.dataReference] - A reference to data.
   * @param {ObjectLocation} [params.resultsReference] - A reference to data.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>>}
   */
  public createSyntheticDataGeneration(
    params: WatsonxAiMlVml_v1.CreateSyntheticDataGenerationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>> {
    const _params = { ...params };
    const _requiredParams = ['name'];
    const _validParams = [
      'name',
      'spaceId',
      'projectId',
      'dataReference',
      'resultsReference',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'data_reference': _params.dataReference,
      'results_reference': _params.resultsReference,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'createSyntheticDataGeneration'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/synthetic_data',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get synthetic data generation jobs.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResources>>}
   */
  public listSyntheticDataGenerations(
    params?: WatsonxAiMlVml_v1.ListSyntheticDataGenerationsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listSyntheticDataGenerations'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/synthetic_data',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get synthetic data generation job.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>>}
   */
  public getSyntheticDataGeneration(
    params: WatsonxAiMlVml_v1.GetSyntheticDataGenerationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getSyntheticDataGeneration'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/synthetic_data/{id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel the synthetic data generation.
   *
   * Cancel the synthetic data generation and remove it.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job metadata information.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public cancelSyntheticDataGeneration(
    params: WatsonxAiMlVml_v1.CancelSyntheticDataGenerationParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'hard_delete': _params.hardDelete,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'cancelSyntheticDataGeneration'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/synthetic_data/{id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }
  /*************************
   * taxonomyTechPreview
   ************************/

  /**
   * Create a taxonomy job.
   *
   * Create a taxonomy job.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the document.
   * @param {string} [params.description] - The description of the Taxonomy job.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {ObjectLocation} [params.dataReference] - A reference to data.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>>}
   */
  public createTaxonomy(
    params: WatsonxAiMlVml_v1.CreateTaxonomyParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>> {
    const _params = { ...params };
    const _requiredParams = ['name'];
    const _validParams = [
      'name',
      'description',
      'spaceId',
      'projectId',
      'dataReference',
      'headers',
      'signal',
      'resultsReference',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'description': _params.description,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'data_reference': _params.dataReference,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'createTaxonomy'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/taxonomies_imports',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get taxonomy jobs.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResources>>}
   */
  public listTaxonomies(
    params?: WatsonxAiMlVml_v1.ListTaxonomiesParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listTaxonomies'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/taxonomies_imports',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get taxonomy job.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>>}
   */
  public getTaxonomy(
    params: WatsonxAiMlVml_v1.GetTaxonomyParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getTaxonomy'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/taxonomies_imports/{id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Cancel or delete the taxonomy job.
   *
   * Cancel or delete the taxonomy job.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {boolean} [params.hardDelete] - Set to `true` in order to also delete the job metadata information.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public deleteTaxonomy(
    params: WatsonxAiMlVml_v1.DeleteTaxonomyParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['id'];
    const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'hard_delete': _params.hardDelete,
    };

    const path = {
      'id': _params.id,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'deleteTaxonomy'
    );

    const parameters = {
      options: {
        url: '/ml/v1/tuning/taxonomies_imports/{id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /*************************
   * models
   ************************/

  /**
   * Create a new model.
   *
   * Create a new model with the given payload. A model represents a machine learning model asset. If a `202` status is
   * returned then the model will be ready when the
   * `content_import_state` in the model status (/ml/v4/models/{model_id}) is `completed`. If `content_import_state` is
   * not used then a `201` status is returned.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.name - The name of the resource.
   * @param {string} params.type - The model type. The supported model types can be found in the documentation
   * [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/wmls/wmls-deploy-python-types.html?context=analytics).
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.description] - A description of the resource.
   * @param {string[]} [params.tags] - A list of tags for this resource.
   * @param {SoftwareSpecRel} [params.softwareSpec] - A software specification.
   * @param {Rel} [params.pipeline] - A reference to a resource.
   * @param {ModelDefinitionId} [params.modelDefinition] - The model definition.
   * @param {JsonObject} [params.hyperParameters] - Hyper parameters used for training this model.
   * @param {string} [params.domain] - User provided domain name for this model. For example: sentiment, entity,
   * visual-recognition, finance, retail, real estate etc.
   * @param {DataConnectionReference[]} [params.trainingDataReferences] - The training data that was used to create this
   * model.
   * @param {DataConnectionReference[]} [params.testDataReferences] - The holdout/test datasets.
   * @param {ModelEntitySchemas} [params.schemas] - If the prediction schemas are provided here then they take precedent
   * over any schemas
   * provided in the data references. Note that data references contain the schema for the
   * associated data and this object contains the schema(s) for the associated prediction, if any.
   * In the case that the prediction input data matches exactly the schema of the training data
   * references then the prediction schema can be omitted. However it is highly recommended to
   * always specify the prediction schemas using this field.
   * @param {string} [params.labelColumn] - The name of the label column.
   * @param {string} [params.transformedLabelColumn] - The name of the  label column seen by the estimator, which may
   * have been transformed by the previous transformers in the pipeline. This is not necessarily the same column as the
   * `label_column` in the initial data set.
   * @param {ModelEntitySize} [params.size] - This will be used by scoring to record the size of the model.
   * @param {Metric[]} [params.metrics] - Metrics that can be returned by an operation.
   * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
   * @param {JsonObject} [params.userDefinedObjects] - User defined objects referenced by the model. For any user
   * defined class or function used in the model, its name, as referenced in the model, must be specified as the `key`
   * and its fully qualified class or function name must be specified as the `value`. This is applicable for `Tensorflow
   * 2.X` models serialized in `H5` format using the `tf.keras` API.
   * @param {SoftwareSpecRel[]} [params.hybridPipelineSoftwareSpecs] - The list of the software specifications that are
   * used by the pipeline that generated this model, if the model was generated by a pipeline.
   * @param {ModelEntityModelVersion} [params.modelVersion] - Optional metadata that can be used to provide information
   * about this model that can be tracked with IBM AI Factsheets.
   * See [Using AI
   * Factsheets](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/factsheets-model-inventory.html) for
   * more details.
   * @param {string} [params.trainingId] - Deprecated: this is replaced by `training.id`. This field can be used to
   * store the `id` of the training job that was used to produce this model.
   * @param {DataPreprocessingTransformation[]} [params.dataPreprocessing] - An optional array which contains the data
   * preprocessing transformations that were executed by the training job that created this model.
   * @param {TrainingDetails} [params.training] - Information about the training job that created this model.
   * @param {ContentLocation} [params.contentLocation] - Details about the attachments that should be uploaded with this
   * model.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
   */
  public createModel(
    params: WatsonxAiMlVml_v1.ModelsCreateParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>> {
    const _params = { ...params };
    const _requiredParams = ['name', 'type'];
    const _validParams = [
      'name',
      'type',
      'projectId',
      'spaceId',
      'description',
      'tags',
      'softwareSpec',
      'pipeline',
      'modelDefinition',
      'hyperParameters',
      'domain',
      'trainingDataReferences',
      'testDataReferences',
      'schemas',
      'labelColumn',
      'transformedLabelColumn',
      'size',
      'metrics',
      'custom',
      'userDefinedObjects',
      'hybridPipelineSoftwareSpecs',
      'modelVersion',
      'trainingId',
      'dataPreprocessing',
      'training',
      'contentLocation',
      'foundationModel',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = {
      'name': _params.name,
      'type': _params.type,
      'project_id': _params.projectId,
      'space_id': _params.spaceId,
      'description': _params.description,
      'tags': _params.tags,
      'software_spec': _params.softwareSpec,
      'pipeline': _params.pipeline,
      'model_definition': _params.modelDefinition,
      'hyper_parameters': _params.hyperParameters,
      'domain': _params.domain,
      'training_data_references': _params.trainingDataReferences,
      'test_data_references': _params.testDataReferences,
      'schemas': _params.schemas,
      'label_column': _params.labelColumn,
      'transformed_label_column': _params.transformedLabelColumn,
      'size': _params.size,
      'metrics': _params.metrics,
      'custom': _params.custom,
      'user_defined_objects': _params.userDefinedObjects,
      'hybrid_pipeline_software_specs': _params.hybridPipelineSoftwareSpecs,
      'model_version': _params.modelVersion,
      'training_id': _params.trainingId,
      'data_preprocessing': _params.dataPreprocessing,
      'training': _params.training,
      'content_location': _params.contentLocation,
      'foundation_model': _params.foundationModel,
    };

    const query = {
      'version': this.version,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsCreate');

    const parameters = {
      options: {
        url: '/ml/v4/models',
        method: 'POST',
        body,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the models.
   *
   * Retrieve the models for the specified space or project.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
   * user. It is generated by the service and it is set in the href available in the `next` field.
   * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
   * is 200.
   * @param {string} [params.tagValue] - Return only the resources with the given tag values, separated by `or` or `and`
   * to support multiple tags.
   * @param {string} [params.search] - Returns only resources that match this search string. The path to the field must
   * be the complete path to the field, and this field must be one of the indexed fields for this resource type. Note
   * that the search string must be URL encoded.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResources>>}
   */
  public listModels(
    params?: WatsonxAiMlVml_v1.ModelsListParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = [
      'spaceId',
      'projectId',
      'start',
      'limit',
      'tagValue',
      'search',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'start': _params.start,
      'limit': _params.limit,
      'tag.value': _params.tagValue,
      'search': _params.search,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsList');

    const parameters = {
      options: {
        url: '/ml/v4/models',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the model.
   *
   * Retrieve the model with the specified identifier. If `rev` query parameter is provided,
   * `rev=latest` will fetch the latest revision. A call with `rev={revision_number}` will fetch the given
   * revision_number record. Either `space_id` or `project_id` has to be provided and is mandatory.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - Model identifier.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {string} [params.rev] - The revision number of the resource.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
   */
  public getModel(
    params: WatsonxAiMlVml_v1.ModelsGetParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>> {
    const _params = { ...params };
    const _requiredParams = ['modelId'];
    const _validParams = ['modelId', 'spaceId', 'projectId', 'rev', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'version': this.version,
      'space_id': _params.spaceId,
      'project_id': _params.projectId,
      'rev': _params.rev,
    };

    const path = {
      'model_id': _params.modelId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsGet');

    const parameters = {
      options: {
        url: '/ml/v4/models/{model_id}',
        method: 'GET',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Update the model.
   *
   * Update the model with the provided patch data. The following fields can be patched:
   * - `/tags`
   * - `/name`
   * - `/description`
   * - `/custom`
   * - `/software_spec` (operation `replace` only)
   * - `/model_version` (operation `add` and `replace` only).
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - Model identifier.
   * @param {JsonPatchOperation[]} params.jsonPatch - Input For Patch. This is the patch body which corresponds to the
   * JavaScript Object Notation (JSON) Patch standard (RFC 6902).
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
   */
  public updateModel(
    params: WatsonxAiMlVml_v1.ModelsUpdateParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>> {
    const _params = { ...params };
    const _requiredParams = ['modelId', 'jsonPatch'];
    const _validParams = ['modelId', 'jsonPatch', 'spaceId', 'projectId', 'headers', 'signal'];
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
      'model_id': _params.modelId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsUpdate');

    const parameters = {
      options: {
        url: '/ml/v4/models/{model_id}',
        method: 'PATCH',
        body,
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete the model.
   *
   * Delete the model with the specified identifier. This will delete all revisions of this model as well. For each
   * revision all attachments will also be deleted.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.modelId - Model identifier.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
   * parameter has to be given.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
   * query parameter has to be given.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public deleteModel(
    params: WatsonxAiMlVml_v1.ModelsDeleteParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['modelId'];
    const _validParams = ['modelId', 'spaceId', 'projectId', 'headers', 'signal'];
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
      'model_id': _params.modelId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsDelete');

    const parameters = {
      options: {
        url: '/ml/v4/models/{model_id}',
        method: 'DELETE',
        qs: query,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /*************************
   * utilityAgentToolsBeta
   ************************/

  /**
   * Get utility agent tools.
   *
   * This retrieves the complete list of supported utility agent tools and contains information required for running
   * each tool.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsResponse>>}
   */
  public listUtilityAgentTools(
    params?: WatsonxAiMlVml_v1.GetUtilityAgentToolsParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsResponse>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = ['signal', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'listUtilityAgentTools'
    );

    const parameters = {
      options: {
        url: '/v1-beta/utility_agent_tools',
        method: 'GET',
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Get utility agent tool.
   *
   * This retrieves the details of an utility agent tool and contains information required for running the tool.
   * Providing authentication and configuration params may return additional details.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.toolId - Tool name.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.UtilityAgentTool>>}
   */
  public getUtilityAgentTool(
    params: WatsonxAiMlVml_v1.GetUtilityAgentToolParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.UtilityAgentTool>> {
    const _params = { ...params };
    const _requiredParams = ['toolId'];
    const _validParams = ['toolId', 'signal', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const path = {
      'tool_id': _params.toolId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'getUtilityAgentTool'
    );

    const parameters = {
      options: {
        url: '/v1-beta/utility_agent_tools/{tool_id}',
        method: 'GET',
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Run a utility agent tool.
   *
   * This runs a utility agent tool given an input and optional configuration parameters.
   *
   * Some tools can choose to tailor the response based on the access token identity.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {WxUtilityAgentToolsRunRequest} params.wxUtilityAgentToolsRunRequest -
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>>}
   */
  public runUtilityAgentTool(
    params: WatsonxAiMlVml_v1.PostUtilityAgentToolsRunParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>> {
    const _params = { ...params };
    const _requiredParams = ['wxUtilityAgentToolsRunRequest'];
    const _validParams = ['wxUtilityAgentToolsRunRequest', 'signal', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = _params.wxUtilityAgentToolsRunRequest;
    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'runUtilityAgentTool'
    );

    const parameters = {
      options: {
        url: '/v1-beta/utility_agent_tools/run',
        method: 'POST',
        body,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Run a utility agent tool.
   *
   * This runs a utility agent tool given an input and optional configuration parameters.
   *
   * Some tools can choose to tailor the response based on the access token identity.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.toolId - Tool name.
   * @param {WxUtilityAgentToolsRunRequest} params.wxUtilityAgentToolsRunRequest -
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>>}
   */
  public runUtilityAgentToolByName(
    params: WatsonxAiMlVml_v1.PostUtilityAgentToolsRunByNameParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>> {
    const _params = { ...params };
    const _requiredParams = ['toolId', 'wxUtilityAgentToolsRunRequest'];
    const _validParams = ['toolId', 'wxUtilityAgentToolsRunRequest', 'signal', 'headers'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const body = _params.wxUtilityAgentToolsRunRequest;
    const path = {
      'tool_id': _params.toolId,
    };

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'runUtilityAgentToolByName'
    );

    const parameters = {
      options: {
        url: '/v1-beta/utility_agent_tools/run/{tool_id}',
        method: 'POST',
        body,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.wxServiceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /*************************
   * Spaces
   ************************/

  /**
   * Create a new space.
   *
   * Creates a new space to scope other assets.
   * Authorized user must have the following roles (see https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-iams):
   * - Platform management role: Administrator
   * - Service access role: Manager
   *
   * On Public Cloud, user is required to provide Cloud Object Storage instance details in the 'storage' property.
   * On private CPD installations, the default storage is used instead.
   *
   * @param {CreateSpaceRequest} params - The parameters to send to the service.
   * @param {string} params.name - Name of space.
   * @param {string} [params.description] - Description of space.
   * @param {CreateSpaceStorage} [params.storage] - Cloud Object Storage instance is required for spaces created on Public Cloud.
   * On private CPD installations, the default storage is used instead. This flag is not supported on CPD.
   * @param {CreateSpaceCompute[]} [params.compute] - This flag is not supported on CPD.
   * @param {string[]} [params.tags] - User-defined tags associated with a space.
   * @param {string} [params.generator] - A consistent label used to identify a client that created a space.
   * A generator must be comprised of the following characters - alphanumeric, dash, underscore, space.
   * @param {CreateSpaceStage} [params.stage] - Space production and stage name.
   * @param {string} [params.type] - Space type.
   * @param {CreateSpaceSettings} [params.settings] - Space settings.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<CloudantV1.Response<WatsonxAiMlVml_v1.SpaceResource>>}
   */

  public createSpace(
    params: WatsonxAiMlVml_v1.CreateSpaceParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResource>> {
    const _params = { ...params };
    const _requiredParams = this.wxServiceUrl.includes('.cloud.ibm.com')
      ? ['name', 'storage']
      : ['name'];
    const _validParams = [
      'name',
      'description',
      'storage',
      'compute',
      'tags',
      'generator',
      'stage',
      'type',
      'settings',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const path = {
      name: _params.name,
    };

    const body = {
      'name': _params.name,
      'description': _params.description,
      'storage': _params.storage,
      'compute': _params.compute,
      'tags': _params.tags,
      'generator': _params.generator,
      'stage': _params.stage,
      'type': _params.type,
      'settings': _params.settings,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'createSpace');

    const parameters = {
      options: {
        url: '/v2/spaces',
        method: 'POST',
        body,
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the space.
   *
   * Retrieves the space with the specified identifier.
   *
   * @param {GetSpaceParams} [params] - The parameters to send to the service.
   * @param {string} params.spaceId - The space identification.
   * @param {string} [params.include] - A list of comma-separated space sections to include in the query results.
   * Example: '?include=members'.
   * Available fields:
   * * members (returns up to 100 members)
   * * nothing (does not return space entity and metadata)
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.Space>>}
   */

  public getSpace(
    params?: WatsonxAiMlVml_v1.GetSpaceParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResource>> {
    const _params = { ...params };
    const _requiredParams = ['spaceId'];
    const _validParams = ['spaceId', 'include', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      include: _params.include,
    };

    const path = {
      'space_id': _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'getSpace');

    const parameters = {
      options: {
        url: `/v2/spaces/{space_id}`,
        method: 'GET',
        path,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Delete the space.
   *
   * Deletes the space with the specified identifier.
   *
   * @param {DeleteSpaceParams} params - The parameters to send to the service.
   * @param {string} params.spaceId - The space identification.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
   */
  public deleteSpace(
    params?: WatsonxAiMlVml_v1.DeleteSpaceParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>> {
    const _params = { ...params };
    const _requiredParams = ['spaceId'];
    const _validParams = ['spaceId', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const path = {
      space_id: _params.spaceId,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'deleteSpace');

    const parameters = {
      options: {
        url: `/v2/spaces/{space_id}`,
        method: 'DELETE',
        path,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Update the space.
   *
   * Partially update this space.
   * Allowed paths are:
   *  - /name
   *  - /description
   *  - /compute
   *  - /stage/name
   *  - /type
   *  - /settings/folders/enabled
   *  - /settings/access_restrictions/reporting/authorized
   *
   * @param {WatsonxAiMlVml_v1.SpacePatchParams} params - The parameters to send to the service.
   * @param {string} [param.spaceId] - The space identification.
   * @param {WatsonxAiMlVml_v1.JsonPatchOperation} [params.jsonPatch] - The patch operation.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.Space>>}
   */

  public updateSpace(
    params: WatsonxAiMlVml_v1.SpacePatchParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResource>> {
    const _params = { ...params };
    const _requiredParams = ['spaceId', 'jsonPatch'];
    const _validParams = ['spaceId', 'jsonPatch', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const path = {
      space_id: _params.spaceId,
    };

    const body = _params.jsonPatch;

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'updateSpace');

    const parameters = {
      options: {
        url: `/v2/spaces/{space_id}`,
        method: 'PATCH',
        path,
        body,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          ...this.baseOptions.headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json-patch+json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Retrieve the spaces.
   *
   * Retrieves the space list.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} [params.start] - Token representing first resource.
   * @param {number} [params.limit] - The number of resources returned. Default value is 100. Max value is 200.
   * @param {boolean} [params.totalCount] - Include details about total number of resources. This flag is not supported on CPD 3.0.1.
   * @param {string} [params.id] - Comma-separated list of ids to be returned. This flag is not supported on CPD 3.0.1.
   * @param {string} [params.tags] - A list of comma-separated, user-defined tags to use to filter the query results.
   * @param {string} [params.include] - A list of comma-separated space sections to include in the query results. Example: '?include=members'.
   * Available fields:
   * * members (returns up to 100 members)
   * * nothing (does not return space entity and metadata)
   * @param {string} [params.member] - Filters the result list to only include spaces where the user with a matching user id is a member.
   * @param {string} [params.roles] - Must be used in conjunction with the member query parameter. Filters the result set to include only spaces where the specified member has one of the roles specified.
   * Values:
   * * admin
   * * editor
   * * viewer
   * @param {string} [params.bssAccountId] - Filtering by bss_account_id is allowed only for accredited services.
   * @param {string} [params.name] - Filters the result list to only include space with specified name.
   * @param {string} [params.subName] - Filters the result list to only include spaces which name contains specified case-insensitive substring.
   * @param {string} [params.compute.crn] - Filters the result list to only include spaces with specified compute.crn.
   * @param {string} [params.type] - Filters the result list to only include space with specified type.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResources>>}
   *
   * @category Spaces
   */

  public listSpaces(
    params?: WatsonxAiMlVml_v1.ListSpacesParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResources>> {
    const _params = { ...params };
    const _requiredParams: string[] = [];
    const _validParams = [
      'start',
      'limit',
      'totalCount',
      'id',
      'tags',
      'include',
      'member',
      'roles',
      'bssAccountId',
      'name',
      'subName',
      'computeCrn',
      'type',
      'headers',
      'signal',
    ];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);

    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }

    const query = {
      'start': _params.start,
      'limit': _params.limit,
      'total_count': _params.totalCount,
      'id': _params.id,
      'tags': _params.tags,
      'include': _params.include,
      'member': _params.member,
      'roles': _params.roles,
      'bss_account_id': _params.bssAccountId,
      'name': _params.name,
      'sub_name': _params.subName,
      'compute.crn': _params.computeCrn,
      'type': _params.type,
    };

    const sdkHeaders = getSdkHeaders(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'listSpaces');

    const parameters = {
      options: {
        url: '/v2/spaces',
        method: 'GET',
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        serviceUrl: this.serviceUrl,
        headers: {
          ...sdkHeaders,
          Accept: 'application/json',
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
    };

    return this.createRequest(parameters);
  }

  /**
   * Transcribes an audio file using the Watson AI ML VML service.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.model - The model to use for audio transcriptions.
   * @param {string | ReadStream} params.file - The path to a mp3 or wav audio file to transcribe or a ReadStream object containing a file stream: `fs.createReadStream(path)`.
   * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
   * to be given.
   * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
   * be given.
   * @param {string} [params.language] - Optional target language to which to transcribe; for example, fr for French. Default is English.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @param {string} [params.signal] - A list of comma-separated, user-defined tags to use to filter the query results.
   * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>} - A promise that resolves with the transcription response.
   * @throws {Error} Will throw an error if required or invalid parameters are provided.
   */
  public transcribeAudio(
    params: WatsonxAiMlVml_v1.TranscribeAudioParams
  ): Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.AudioTranscriptionResult>> {
    const _params = { ...params };
    const _requiredParams = ['model', 'file'];
    const _validParams = ['model', 'file', 'projectId', 'spaceId', 'language', 'headers', 'signal'];
    const _validationErrors = validateParams(_params, _requiredParams, _validParams);
    if (_validationErrors) {
      return Promise.reject(_validationErrors);
    }
    const { file } = _params;

    const form = new FormData();
    form.append('model', _params.model);

    if (_params.language) form.append('language', _params.language);

    if (typeof file === 'string') {
      const files = fs.createReadStream(file);
      form.append('file', files);
    } else form.append('file', file);

    if (_params.projectId) {
      form.append('project_id', _params.projectId);
    } else if (_params.spaceId) {
      form.append('space_id', _params.spaceId);
    } else throw new Error('Either projectId or spaceId need to be provided');

    const sdkHeaders = getSdkHeaders(
      WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME,
      'vml_v1',
      'transcribeAudio'
    );

    const query = {
      'version': this.version,
    };
    const parameters = {
      options: {
        url: '/ml/v1/audio/transcriptions',
        method: 'POST',
        body: form,
        qs: query,
      },
      defaultOptions: {
        ...this.baseOptions,
        headers: {
          ...sdkHeaders,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          ...form.getHeaders(),
          ..._params.headers,
        },
        axiosOptions: {
          signal: _params.signal,
        },
      },
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

  export interface TokenAuthenticationOptions {
    requestToken?: () => Promise<RequestTokenResponse>;
  }

  export interface Certificates {
    caCert?: { auth?: Certificate; service?: Certificate; dataplatform?: Certificate } | string;
  }

  export interface Certificate {
    path: string;
  }

  export interface HttpsAgentMap {
    service?: Agent;
    dataplatform?: Agent;
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

  export interface DefaultParams {
    signal?: AbortSignal;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `createDeployment` operation. */
  export interface CreateDeploymentParams extends DefaultParams {
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
    /** The requested hardware for deployment. */
    hardwareRequest?: HardwareRequest;
    /** A reference to a resource. */
    asset?: Rel;
    /** The base model that is required for this deployment if this is for a prompt template or a prompt tune for an
     *  IBM foundation model.
     */
    baseModelId?: string;
    /**
     * The base deployment when this is a custom foundation model with a prompt template. The id must be the id of the custom foundation model deployment.
     */
    baseDeploymentId?: string;
  }

  /** Parameters for the `listDeployments` operation. */
  export interface ListDeploymentsParams extends DefaultParams {
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
     *  on a pre-deployed IBM provided model. 3. `custom_foundation_model` - when a custom foundation model is deployed.
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
  }

  /** Parameters for the `deploymentsGet` operation. */
  export interface DeploymentsGetParams extends DefaultParams {
    /** The deployment id. */
    deploymentId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `deploymentsUpdate` operation. */
  export interface DeploymentsUpdateParams extends DefaultParams {
    /** The deployment id. */
    deploymentId: string;
    /** The json patch. */
    jsonPatch: JsonPatchOperation[];
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `deploymentsDelete` operation. */
  export interface DeploymentsDeleteParams extends DefaultParams {
    /** The deployment id. */
    deploymentId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `deploymentsTextGeneration` operation. */
  export interface DeploymentsTextGenerationParams extends DefaultParams {
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
  }

  /** Parameters for the `deploymentsTextGenerationStream` operation. */
  export interface DeploymentsTextGenerationStreamParams extends DefaultParams {
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

    /* whether to return stream of objects if true or stream of strings if false or undefined */
    returnObject?: boolean;
  }

  /** Parameters for the `deploymentsTextChat` operation. */
  export interface DeploymentsTextChatParams extends DefaultParams {
    /** The `id_or_name` can be either the `deployment_id` that identifies the deployment or a `serving_name` that
     *  allows a predefined URL to be used to post a prediction. The deployment must reference a prompt template with
     *  `input_mode` `chat`.
     *
     *  The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
     */
    idOrName: string;
    /** The messages for this chat session. You cannot specify `system` `role` in the messages. Depending on the
     *  model, the `content` of `system` `role` may be from `system_prompt` of the prompt template, and will be
     *  automatically inserted into `messages`.
     *
     *  As an example, depending on the model, if `system_prompt` of a prompt template is "You are Granite Chat, an AI
     *  language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are
     *  helpful and harmless and you follow ethical guidelines and promote positive behavior.", a message with `system`
     *  `role` having `content` the same as `system_prompt` is inserted.
     */
    messages: DeploymentTextChatMessages[];
    /** If specified, `context` will be inserted into `messages`. Depending on the model, `context` may be inserted
     *  into the `content` with `system` `role`; or into the `content` of the last message of `user` `role`.
     *
     *
     *  In the example, `context` "Today is Wednesday" is inserted as such
     *  `content` of `user` becomes "Today is Wednesday. Who are you and which day is tomorrow?".
     */
    context?: string;
  }

  /** Parameters for the `deploymentsTextChatStream` operation. */
  export interface DeploymentsTextChatStreamParams extends DefaultParams {
    /** The `id_or_name` can be either the `deployment_id` that identifies the deployment or a `serving_name` that
     *  allows a predefined URL to be used to post a prediction. The deployment must reference a prompt template with
     *  `input_mode` `chat`.
     *
     *  The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
     */
    idOrName: string;
    /** The messages for this chat session. You cannot specify `system` `role` in the messages. Depending on the
     *  model, the `content` of `system` `role` may be from `system_prompt` of the prompt template, and will be
     *  automatically inserted into `messages`.
     *
     *  As an example, depending on the model, if `system_prompt` of a prompt template is "You are Granite Chat, an AI
     *  language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are
     *  helpful and harmless and you follow ethical guidelines and promote positive behavior.", a message with `system`
     *  `role` having `content` the same as `system_prompt` is inserted.
     */
    messages: DeploymentTextChatMessages[];
    /** If specified, `context` will be inserted into `messages`. Depending on the model, `context` may be inserted
     *  into the `content` with `system` `role`; or into the `content` of the last message of `user` `role`.
     *
     *
     *  In the example, `context` "Today is Wednesday" is inserted as such
     *  `content` of `user` becomes "Today is Wednesday. Who are you and which day is tomorrow?".
     */
    context?: string;

    returnObject?: boolean;
  }

  /** Parameters for the `deploymentsTimeSeriesForecast` operation. */
  export interface DeploymentsTimeSeriesForecastParams extends DefaultParams {
    /** The `id_or_name` can be either the `deployment_id` that identifies the deployment or a `serving_name` that
     *  allows a predefined URL to be used to post a prediction.
     *
     *  The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
     */
    idOrName: string;
    /** A payload of data matching `schema`. We assume the following about your data:
     *    * All timeseries are of equal length and are uniform in nature (the time difference between two successive
     *  rows is constant). This implies that there are no missing rows of data;
     *    * The data meet the minimum model-dependent historical context length which
     *    can be any number of rows per timeseries;
     *
     *  Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be
     *  much larger to meet minimum model-specific context lengths.
     */
    data: JsonObject;
    /** Contains metadata about your timeseries data input. */
    schema: TSForecastInputSchema;
    /** The parameters for the forecast request. */
    parameters?: DeploymentTSForecastParameters;
    /** Exogenous or supporting features that extend into the forecasting horizon (e.g., a weather forecast or
     *  calendar of special promotions) which are known in advance. `future_data` would be in the same format as `data`
     *  except  that all timestamps would be in the forecast horizon and it would not include previously specified
     *  `target_columns`.
     */
    futureData?: JsonObject;
  }

  /** Parameters for the `listFoundationModelSpecs` operation. */
  export interface ListFoundationModelSpecsParams extends DefaultParams {
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
  }

  /** Parameters for the `listFoundationModelTasks` operation. */
  export interface ListFoundationModelTasksParams extends DefaultParams {
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
  }

  /** Parameters for the `postPrompt` operation. */
  export interface PostPromptParams extends DefaultParams {
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
  export interface GetPromptParams extends DefaultParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** Only return a set of model parameters compatiable with inferencing. */
    restrictModelParameters?: string;
  }

  export interface CatalogSearch {
    /** The limit request body field can be specified to limit the number of assets in the search results.
    The default limit is 200. The maximum limit value is 200, and any greater value is ignored. */
    limit?: number;
    /** Returns the number of query results for each unique value of each named field. */
    counts?: string[];
    /** Restrict results to documents with a dimension equal to the specified label. Note that, multiple values for a single key in a drilldown means an OR relation between them and there is an AND relation between multiple keys. */
    drilldown?: Record<string, any>;
    /** Bookmark of the query result */
    bookmark?: string;
    /** Sort order for the query */
    sort?: string;
    /** Entity */
    include?: string;
  }

  export interface PromptListParams extends DefaultParams, CatalogSearch {
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
  }

  /** Parameters for the `patchPrompt` operation. */
  export interface PatchPromptParams extends DefaultParams {
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
    promptVariables?: JsonObject;
    /** Input mode in use for the prompt. */
    inputMode?: PatchPromptConstants.InputMode | string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
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
  export interface DeletePromptParams extends DefaultParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
  }

  /** Parameters for the `putPromptLock` operation. */
  export interface PutPromptLockParams extends DefaultParams {
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
  export interface GetPromptLockParams extends DefaultParams {
    /** Prompt ID. */
    promptId: string;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `getPromptInput` operation. */
  export interface GetPromptInputParams extends DefaultParams {
    /** Prompt ID. */
    promptId: string;
    /** Override input string that will be used to generate the response. The string can contain template
     *  parameters.
     */
    input?: string;
    /** Supply only to replace placeholders. Object content must be key:value pairs where the 'key' is the parameter
     *  to replace and 'value' is the value to use.
     */
    promptVariables?: JsonObject;
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `postPromptChatItem` operation. */
  export interface PostPromptChatItemParams extends DefaultParams {
    /** Prompt ID. */
    promptId: string;
    chatItem: ChatItem[];
    /** [REQUIRED] Specifies the space ID as the target. One target must be supplied per request. */
    spaceId?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `postPromptSession` operation. */
  export interface PostPromptSessionParams extends DefaultParams {
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
  }

  /** Parameters for the `getPromptSession` operation. */
  export interface GetPromptSessionParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** Include the most recent entry. */
    prefetch?: boolean;
  }

  /** Parameters for the `patchPromptSession` operation. */
  export interface PatchPromptSessionParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    name?: string;
    /** An optional description for the prompt. */
    description?: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `deletePromptSession` operation. */
  export interface DeletePromptSessionParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `postPromptSessionEntry` operation. */
  export interface PostPromptSessionEntryParams extends DefaultParams {
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
  export interface GetPromptSessionEntriesParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
    /** Bookmark from a previously limited get request. */
    bookmark?: string;
    /** Limit for results to retrieve, default 20. */
    limit?: string;
  }

  /** Parameters for the `postPromptSessionEntryChatItem` operation. */
  export interface PostPromptSessionEntryChatItemParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    chatItem: ChatItem[];
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `putPromptSessionLock` operation. */
  export interface PutPromptSessionLockParams extends DefaultParams {
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
  export interface GetPromptSessionLockParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `getPromptSessionEntry` operation. */
  export interface GetPromptSessionEntryParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Parameters for the `deletePromptSessionEntry` operation. */
  export interface DeletePromptSessionEntryParams extends DefaultParams {
    /** Prompt Session ID. */
    sessionId: string;
    /** Prompt Session Entry ID. */
    entryId: string;
    /** [REQUIRED] Specifies the project ID as the target. One target must be supplied per request. */
    projectId?: string;
  }

  /** Constants for the `textChat` operation. */
  export namespace TextChatConstants {
    /** Using `none` means the model will not call any tool and instead generates a message. **The following options (`auto` and `required`) are not yet supported.** Using `auto` means the model can pick between generating a message or calling one or more tools. Using `required` means the model must call one or more tools. Only one of `tool_choice_option` or `tool_choice` must be present. */
    export enum ToolChoiceOption {
      NONE = 'none',
      AUTO = 'auto',
      REQUIRED = 'required',
    }
  }

  /** Parameters for the `textChat` operation. */
  export interface TextChatParams extends DefaultParams {
    /** The model to use for the chat completion.
     *
     *  Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     */
    modelId: string;
    /** The messages for this chat session. */
    messages: TextChatMessages[];
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** Tool functions that can be called with the response. */
    tools?: TextChatParameterTools[];
    /** Using `none` means the model will not call any tool and instead generates a message.
     *
     *  **The following options (`auto` and `required`) are not yet supported.**
     *
     *  Using `auto` means the model can pick between generating a message or calling one or more tools. Using
     *  `required` means the model must call one or more tools.
     *
     *  Only one of `tool_choice_option` or `tool_choice` must be present.
     */
    toolChoiceOption?: TextChatConstants.ToolChoiceOption | string;
    /** Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the
     *  model to call that tool.
     *
     *  Only one of `tool_choice_option` or `tool_choice` must be present.
     */
    toolChoice?: TextChatToolChoiceTool;
    /** Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the
     *  model's likelihood to repeat the same line verbatim.
     */
    frequencyPenalty?: number;
    /** Increasing or decreasing probability of tokens being selected during generation; a positive bias makes a
     *  token more likely to appear, while a negative bias makes it less likely.
     */
    logitBias?: JsonObject;
    /** Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of
     *  each output token returned in the content of message.
     */
    logprobs?: boolean;
    /** An integer specifying the number of most likely tokens to return at each token position, each with an
     *  associated log probability. The option `logprobs` must be set to `true` if this parameter is used.
     */
    topLogprobs?: number;
    /** The maximum number of tokens that can be generated in the chat completion.
     * The total length of input tokens and generated tokens is limited by the model's context length.
     * Set to 0 for the model's configured max generated tokens.
     * This value is now deprecated in favor of maxCompletionTokens.
     * If specified together with maxCompletionTokens, maxTokens will be ignored.
     */
    maxTokens?: number;
    /** The maximum number of tokens that can be generated in the chat completion. The total length of input tokens
     * and generated tokens is limited by the model's context length. Set to 0 for the model's configured max generated tokens.
     */
    maxCompletionTokens?: number;
    /** How many chat completion choices to generate for each input message. Note that you will be charged based on
     *  the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.
     */
    n?: number;
    /** Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's
     *  likelihood to talk about new topics.
     */
    presencePenalty?: number;
    /** The chat response format parameters. */
    responseFormat?: TextChatResponseFormat;
    /** Random number generator seed to use in sampling mode for experimental repeatability. */
    seed?: number;
    /** Stop sequences are one or more strings which will cause the text generation to stop if/when they are
     *  produced as part of the output. Stop sequences encountered prior to the minimum number of tokens being generated
     *  will be ignored.
     */
    stop?: string[];
    /** What sampling temperature to use,. Higher values like 0.8 will make the output more random, while lower
     *  values like 0.2 will make it more focused and deterministic.
     *
     *  We generally recommend altering this or `top_p` but not both.
     */
    temperature?: number;
    /** An alternative to sampling with temperature, called nucleus sampling, where the model considers the results
     *  of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass
     *  are considered.
     *
     *  We generally recommend altering this or `temperature` but not both.
     */
    topP?: number;
    /** Time limit in milliseconds - if not completed within this time, generation will stop. The text generated so
     *  far will be returned along with the `TIME_LIMIT`` stop reason. Depending on the users plan, and on the model
     *  being used, there may be an enforced maximum time limit.
     */
    timeLimit?: number;
  }
  /** Parameters for the `textChatStream` operation. */
  export interface TextChatStreamParams extends TextChatParams {
    /* whether to return stream of objects if true or stream of strings if false or undefined */
    returnObject?: boolean;
  }

  /** Constants for the `textChatStream` operation. */
  export namespace TextChatStreamConstants {
    /** Using `none` means the model will not call any tool and instead generates a message. **The following options (`auto` and `required`) are not yet supported.** Using `auto` means the model can pick between generating a message or calling one or more tools. Using `required` means the model must call one or more tools. Only one of `tool_choice_option` or `tool_choice` must be present. */
    export enum ToolChoiceOption {
      NONE = 'none',
      AUTO = 'auto',
      REQUIRED = 'required',
    }
  }

  /** Parameters for the `textEmbeddings` operation. */
  export interface TextEmbeddingsParams extends DefaultParams {
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
  }

  /** Parameters for the `textExtraction` operation. */
  export interface TextExtractionParams extends DefaultParams {
    /** A reference to data. */
    documentReference: TextExtractionDataReference;
    /** A reference to data. */
    resultsReference: TextExtractionDataReference;
    /** The steps for the text extraction pipeline. */
    steps?: TextExtractionSteps;
    /** Set this as an empty object to specify `json` output.
     *
     *  Note that this is not strictly required because if an
     *  `assembly_md` object is not found then the default will be `json`.
     */
    assemblyJson?: JsonObject;
    /** Set this as an empty object to specify `markdown` output. */
    assemblyMd?: JsonObject;
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `listTextExtractions` operation. */
  export interface ListTextExtractionsParams extends DefaultParams {
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
  }

  /** Parameters for the `textExtractionGet` operation. */
  export interface TextExtractionGetParams extends DefaultParams {
    /** The identifier of the extraction request. */
    id: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `textExtractionDelete` operation. */
  export interface TextExtractionDeleteParams extends DefaultParams {
    /** The identifier of the extraction request. */
    id: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Set to true in order to also delete the job or request metadata. */
    hardDelete?: boolean;
  }

  /** Parameters for the `textGeneration` operation. */
  export interface TextGenerationParams extends DefaultParams {
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
  }

  /** Parameters for the `textGenerationStream` operation. */
  export interface TextGenerationStreamParams extends DefaultParams {
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

    /* whether to return stream of objects if true or stream of strings if false or undefined */
    returnObject?: boolean;
  }

  /** Parameters for the `textTokenization` operation. */
  export interface TextTokenizationParams extends DefaultParams {
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
  }

  /** Parameters for the `trainingsCreate` operation. */
  export interface TrainingsCreateParams extends DefaultParams {
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
  }

  /** Parameters for the `trainingsList` operation. */
  export interface TrainingsListParams extends DefaultParams {
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
  export interface TrainingsGetParams extends DefaultParams {
    /** The training identifier. */
    trainingId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `trainingsDelete` operation. */
  export interface TrainingsDeleteParams extends DefaultParams {
    /** The training identifier. */
    trainingId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Set to true in order to also delete the job or request metadata. */
    hardDelete?: boolean;
  }

  /** Parameters for the `textRerank` operation. */
  export interface TextRerankParams extends DefaultParams {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     */
    modelId: string;
    /** The rank input strings. */
    inputs: RerankInput[];
    /** The rank query. */
    query: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The properties used for reranking. */
    parameters?: RerankParameters;
  }

  /** Parameters for the `timeSeriesForecast` operation. */
  export interface TimeSeriesForecastParams extends DefaultParams {
    /** The model to be used for generating a forecast. */
    modelId: string;
    /** A payload of data matching `schema`. We assume the following about your data:
     *    * All timeseries are of equal length and are uniform in nature (the time difference between two successive
     *  rows is constant). This implies that there are no missing rows of data;
     *    * The data meet the minimum model-dependent historical context length which
     *    can be 512 or more rows per timeseries;
     *
     *  Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be
     *  much larger to meet minimum model-specific context lengths.
     */
    data: JsonObject;
    /** Contains metadata about your timeseries data input. */
    schema: TSForecastInputSchema;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The parameters for the forecast request. */
    parameters?: TSForecastParameters;
  }

  /** Parameters for the `createFineTuning` operation. */
  export interface CreateFineTuningParams extends DefaultParams {
    /** The name of the job. */
    name: string;
    /** The training datasets. */
    trainingDataReferences: ObjectLocation[];
    /** The training results. Normally this is specified as `type=container` which
     *  means that it is stored in the space or project.
     */
    resultsReference: ObjectLocation;
    /** The description of the job. */
    description?: string;
    /** A list of tags for this resource. */
    tags?: string[];
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  If set to `true` then the result of the training, if successful, will be uploaded to the repository as a model.
     */
    autoUpdateModel?: boolean;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The parameters for the job. Note that if `verbalizer` is provided
     *  then `response_template` must also be provided (and vice versa).
     */
    parameters?: FineTuningParameters;
    /** The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab training. */
    type?: CreateFineTuningConstants.Type | string;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The holdout/test datasets.
     */
    testDataReferences?: ObjectLocation[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
  }

  /** Constants for the `createFineTuning` operation. */
  export namespace CreateFineTuningConstants {
    /** The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab training. */
    export enum Type {
      ILAB = 'ilab',
    }
  }

  /** Parameters for the `fineTuningList` operation. */
  export interface FineTuningListParams extends DefaultParams {
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. */
    limit?: number;
    /** Compute the total count. May have performance impact. */
    totalCount?: boolean;
    /** Return only the resources with the given tag value. */
    tagValue?: string;
    /** Filter based on on the job state: queued, running, completed, failed etc. */
    state?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The type of Fine Tuning training. The type is set to ilab for InstructLab training. */
    type: string;
  }

  /** Parameters for the `getFineTuning` operation. */
  export interface GetFineTuningParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `deleteFineTuning` operation. */
  export interface DeleteFineTuningParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Set to true in order to also delete the job or request metadata. */
    hardDelete?: boolean;
  }

  /** Parameters for the `createDocumentExtraction` operation. */
  export interface CreateDocumentExtractionParams extends DefaultParams {
    /** The name of the document. */
    name: string;
    /** The documents for text extraction. */
    documentReferences: DocumentExtractionObjectLocation[];
    /** A reference to data. */
    resultsReference: ObjectLocationGithub;
    /** A list of tags for this resource. */
    tags?: string[];
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `listDocumentExtractions` operation. */
  export interface ListDocumentExtractionsParams extends DefaultParams {
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `getDocumentExtraction` operation. */
  export interface GetDocumentExtractionParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `cancelDocumentExtractions` operation. */
  export interface CancelDocumentExtractionsParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** Set to true in order to also delete the job metadata information. */
    hardDelete?: boolean;
  }

  /** Parameters for the `createSyntheticDataGeneration` operation. */
  export interface CreateSyntheticDataGenerationParams extends DefaultParams {
    /** The name of the data. */
    name: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** A reference to data. */
    dataReference?: SyntheticDataGenerationDataReference;
    /** A reference to data. */
    resultsReference?: ObjectLocation;
  }

  /** Parameters for the `listSyntheticDataGenerations` operation. */
  export interface ListSyntheticDataGenerationsParams extends DefaultParams {
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `getSyntheticDataGeneration` operation. */
  export interface GetSyntheticDataGenerationParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `cancelSyntheticDataGeneration` operation. */
  export interface CancelSyntheticDataGenerationParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** Set to true in order to also delete the job metadata information. */
    hardDelete?: boolean;
  }

  /** Parameters for the `createTaxonomy` operation. */
  export interface CreateTaxonomyParams extends DefaultParams {
    /** The name of the document. */
    name: string;
    /** The description of the Taxonomy job. */
    description?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** A reference to data. */
    dataReference?: ObjectLocation;
    /** The training results. Normally this is specified as `type=container` which
     *  means that it is stored in the space or project.
     */
    resultsReference: ObjectLocation;
  }

  /** Parameters for the `listTaxonomies` operation. */
  export interface ListTaxonomiesParams extends DefaultParams {
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `getTaxonomy` operation. */
  export interface GetTaxonomyParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
  }

  /** Parameters for the `deleteTaxonomy` operation. */
  export interface DeleteTaxonomyParams extends DefaultParams {
    /** The `id` is the identifier that was returned in the `metadata.id` field of the request. */
    id: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** Set to `true` in order to also delete the job metadata information. */
    hardDelete?: boolean;
  }

  export interface ModelsCreateParams extends DefaultParams {
    /** The name of the resource. */
    name: string;
    /** The model type. The supported model types can be found in the documentation
     *  [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/wmls/wmls-deploy-python-types.html?context=analytics).
     */
    type: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    projectId?: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    spaceId?: string;
    /** A description of the resource. */
    description?: string;
    /** A list of tags for this resource. */
    tags?: string[];
    /** A software specification. */
    softwareSpec?: SoftwareSpecRel;
    /** A reference to a resource. */
    pipeline?: Rel;
    /** The model definition. */
    modelDefinition?: ModelDefinitionId;
    /** Hyper parameters used for training this model. */
    hyperParameters?: JsonObject;
    /** User provided domain name for this model. For example: sentiment, entity, visual-recognition, finance,
     *  retail, real estate etc.
     */
    domain?: string;
    /** The training data that was used to create this model. */
    trainingDataReferences?: DataConnectionReference[];
    /** The holdout/test datasets. */
    testDataReferences?: DataConnectionReference[];
    /** If the prediction schemas are provided here then they take precedent over any schemas
     *  provided in the data references. Note that data references contain the schema for the
     *  associated data and this object contains the schema(s) for the associated prediction, if any.
     *  In the case that the prediction input data matches exactly the schema of the training data
     *  references then the prediction schema can be omitted. However it is highly recommended to
     *  always specify the prediction schemas using this field.
     */
    schemas?: ModelEntitySchemas;
    /** The name of the label column. */
    labelColumn?: string;
    /** The name of the  label column seen by the estimator, which may have been transformed by the previous
     *  transformers in the pipeline. This is not necessarily the same column as the `label_column` in the initial data
     *  set.
     */
    transformedLabelColumn?: string;
    /** This will be used by scoring to record the size of the model. */
    size?: ModelEntitySize;
    /** Metrics that can be returned by an operation. */
    metrics?: Metric[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** User defined objects referenced by the model. For any user defined class or function used in the model, its
     *  name, as referenced in the model, must be specified as the `key` and its fully qualified class or function name
     *  must be specified as the `value`. This is applicable for `Tensorflow 2.X` models serialized in `H5` format using
     *  the `tf.keras` API.
     */
    userDefinedObjects?: JsonObject;
    /** The list of the software specifications that are used by the pipeline that generated this model, if the
     *  model was generated by a pipeline.
     */
    hybridPipelineSoftwareSpecs?: SoftwareSpecRel[];
    /** Optional metadata that can be used to provide information
     *  about this model that can be tracked with IBM AI Factsheets.
     *  See [Using AI
     *  Factsheets](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/factsheets-model-inventory.html)
     *  for more details.
     */
    modelVersion?: ModelEntityModelVersion;
    /** Deprecated: this is replaced by `training.id`. This field can be used to store the `id` of the training job
     *  that was used to produce this model.
     */
    trainingId?: string;
    /** An optional array which contains the data preprocessing transformations that were executed by the training
     *  job that created this model.
     */
    dataPreprocessing?: DataPreprocessingTransformation[];
    /** Information about the training job that created this model. */
    training?: TrainingDetails;
    /** Details about the attachments that should be uploaded with this model. */
    contentLocation?: ContentLocation;
    /** The model id of the base model for this job. */
    foundationModel?: BaseModel;
  }

  /** Parameters for the `modelsList` operation. */
  export interface ModelsListParams extends DefaultParams {
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Token required for token-based pagination. This token cannot be determined by end user. It is generated by
     *  the service and it is set in the href available in the `next` field.
     */
    start?: string;
    /** How many resources should be returned. By default limit is 100. Max limit allowed is 200. */
    limit?: number;
    /** Return only the resources with the given tag values, separated by `or` or `and` to support multiple tags. */
    tagValue?: string;
    /** Returns only resources that match this search string. The path to the field must be the complete path to the
     *  field, and this field must be one of the indexed fields for this resource type. Note that the search string must
     *  be URL encoded.
     */
    search?: string;
  }

  /** Parameters for the `modelsGet` operation. */
  export interface ModelsGetParams extends DefaultParams {
    /** Model identifier. */
    modelId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** The revision number of the resource. */
    rev?: string;
  }

  /** Parameters for the `modelsUpdate` operation. */
  export interface ModelsUpdateParams extends DefaultParams {
    /** Model identifier. */
    modelId: string;
    /** Input For Patch. This is the patch body which corresponds to the JavaScript Object Notation (JSON) Patch
     *  standard (RFC 6902).
     */
    jsonPatch: JsonPatchOperation[];
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `modelsDelete` operation. */
  export interface ModelsDeleteParams extends DefaultParams {
    /** Model identifier. */
    modelId: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
  }

  /** Parameters for the `listUtilityAgentTools` operation. */
  export interface GetUtilityAgentToolsParams extends DefaultParams {}

  /** Parameters for the `getUtilityAgentTool` operation. */
  export interface GetUtilityAgentToolParams extends DefaultParams {
    /** Tool name. */
    toolId: string;
  }

  /** Parameters for the `runUtilityAgentTool` operation. */
  export interface PostUtilityAgentToolsRunParams extends DefaultParams {
    wxUtilityAgentToolsRunRequest: WxUtilityAgentToolsRunRequest;
  }

  /** Parameters for the `runUtilityAgentToolByName` operation. */
  export interface PostUtilityAgentToolsRunByNameParams extends DefaultParams {
    /** Tool name. */
    toolId: string;
    wxUtilityAgentToolsRunRequest: WxUtilityAgentToolsRunRequest;
  }

  export interface ListSpacesParams extends DefaultParams {
    start?: string;
    limit?: number;
    totalCount?: boolean;
    id?: string;
    tags?: string;
    include?: string;
    member?: string;
    roles?: string;
    bssAccountId?: string;
    name?: string;
    subName?: string;
    computeCrn?: string;
    type?: string;
  }

  export interface CreateSpaceParams extends DefaultParams {
    name: string;
    description?: string;
    storage?: SpaceStorage;
    compute?: SpaceCompute[];
    tags?: string[];
    generator?: string;
    stage?: SpaceStage;
    type?: string;
    settings?: SpaceSettings;
  }

  export interface SpaceStorage {
    resource_crn: string;
    delegated?: boolean;
    plan_id?: string;
  }

  export interface SpaceCompute {
    name: string;
    crn: string;
  }

  export interface SpaceStage {
    production?: boolean;
    name?: string;
  }

  export interface SpaceSettings {
    folders?: {
      enabled?: boolean;
    };
    access_restrictions?: {
      reporting?: {
        authorized?: boolean;
      };
    };
  }

  export interface SpaceMember {
    role: string;
    id: string;
    state: string;
    type: string;
  }

  export interface GetSpaceParams extends DefaultParams {
    spaceId: string;
    include?: string;
  }

  export interface DeleteSpaceParams extends DefaultParams {
    spaceId: string;
  }

  export type SpacePatchOperation = 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';

  export interface SpacePatchParams extends DefaultParams {
    spaceId: string;
    jsonPatch: JsonPatchOperation;
  }

  /** Parameters for `transcribeAudio` method */
  export interface TranscribeAudioParams extends DefaultParams {
    /** The model to use for audio transcriptions. */
    model: string;
    /** The path to a mp3 or wav audio file to transcribe. */
    file: string;
    /** The space that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    spaceId?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` query parameter has to be given. */
    projectId?: string;
    /** Optional target language to which to transcribe; for example, fr for French. Default is English. */
    language?: string;
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
        PARAMETER = 'parameter',
        HEADER = 'header',
      }
    }
  }

  /** The model id of the base model for prompt tuning. */
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

  /**
   * Contains a set of location fields specific to each data source.
   */
  export interface CosDataConnection {
    /** The id of the connection asset that contains the credentials required to access the data. */
    id: string;
  }

  /**
   * Contains a set of fields specific to each connection.
   */
  export interface CosDataLocation {
    /** The name of the file. */
    file_name: string;
    /** Can be used to overide the bucket name from the connection asset. */
    bucket?: string;
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
    /** The requested hardware for deployment. */
    hardware_request?: HardwareRequest;
    /** A reference to a resource. */
    asset?: ModelRel;
    /** The base model that is required for this deployment if this is for a prompt template or a prompt tune for an
     *  IBM foundation model.
     */
    base_model_id?: string;
    /** The type of the deployed model. The possible values are the following:
     *
     *  1. `prompt_tune` - when a prompt tuned model is deployed.
     *
     *  2. `foundation_model` - when a prompt template is used on a pre-deployed IBM provided model.
     *
     *  3. `custom_foundation_model` - when a custom foundation model is deployed.
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
      /** The type of the deployed model. The possible values are the following: 1. `prompt_tune` - when a prompt tuned model is deployed. 2. `foundation_model` - when a prompt template is used on a pre-deployed IBM provided model. 3. `custom_foundation_model` - when a custom foundation model is deployed. */
      export enum DeployedAssetType {
        PROMPT_TUNE = 'prompt_tune',
        FOUNDATION_MODEL = 'foundation_model',
        CUSTOM_FOUNDATION_MODEL = 'custom_foundation_model',
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

  /**
   * DeploymentTextChatMessages.
   */
  export interface DeploymentTextChatMessages {}

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
     *  tokens exceeds the `maximum sequence length`.
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

  /**
   * The parameters for the forecast request.
   */
  export interface DeploymentTSForecastParameters {
    /** The prediction length for the forecast. The service will return this many periods beyond the last timestamp
     *  in the inference data payload. If specified, `prediction_length` must be an integer >=1 and no more than the
     *  model default prediction length. When omitted the model default prediction_length will be used.
     */
    prediction_length?: number;
    /** The batch size used during inference. When multiple time series are present, the inference will be conducted
     *  in batches. If not specified, the model default batch size will be used.
     */
    inference_batch_size?: number;
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
     *  tokens exceeds the `maximum sequence length`.
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

  /** The requested hardware for deployment. */
  export interface HardwareRequest {
    /** The size of GPU requested for the deployment. */
    size?: HardwareRequest.Constants.Size | string;
    /** The number of nodes for the GPU requested for deployment. */
    num_nodes?: number;
  }
  export namespace HardwareRequest {
    export namespace Constants {
      /** The size of GPU requested for the deployment. */
      export enum Size {
        GPU_S = 'gpu_s',
        GPU_M = 'gpu_m',
        GPU_L = 'gpu_l',
      }
    }
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

  /** Optional messages related to the resource. */
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
    input?: TextModerationWithoutThreshold;
    /** Properties that control the moderation on the text. */
    output?: TextModerationWithoutThreshold;
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
    /** The model id of the base model for this job. */
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
     *  referred in conjunction with "effective batch size".
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

  /** A text to rank. */
  export interface RerankInput {
    /** The text to rank. */
    text: string;
  }

  /** The properties used for reranking. */
  export interface RerankParameters {
    /** Represents the maximum number of input tokens accepted. This can be used to avoid requests failing due to
     *  input being longer than configured limits. If the text is truncated, then it truncates the end of the input (on
     *  the right), so the start of the input will remain the same. If this value exceeds the `maximum sequence length`
     *  (refer to the documentation to find this value for the model) then the call will fail if the total number of
     *  tokens exceeds the `maximum sequence length`.
     */
    truncate_input_tokens?: number;
    /** The return options for text reranking. */
    return_options?: RerankReturnOptions;
  }

  /** System details. */
  export interface RerankResponse {
    /** The `id` of the model to be used for this request. Please refer to the [list of
     *  models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     */
    model_id: string;
    /** The model version (using semantic versioning) if set. */
    model_version?: string;
    /** The ranked results. */
    results: RerankedResults[];
    /** The time when the response was created. */
    created_at: string;
    /** The number of input tokens that were consumed. */
    input_token_count: number;
    /** The rank query, if requested. */
    query?: string;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** The return options for text reranking. */
  export interface RerankReturnOptions {
    /** Just show the top `n` results if set. */
    top_n?: number;
    /** If `true` then the inputs will be returned in the response. */
    inputs?: boolean;
    /** If `true` then the queries will be returned in the response. */
    query?: boolean;
  }

  /** The ranking score for the input. */
  export interface RerankedResults {
    /** The index of the text from the input in the original request `inputs` array. */
    index: number;
    /** The score of the input. */
    score: number;
    /** The text that was ranked, if requested. */
    input?: {
      text: string;
    };
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

  /** The benchmarking result for this task for this model. */
  export interface TaskBenchmark {
    /** Type of benchmarks used. */
    type?: string;
    /** Description of benchmark used. */
    description?: string;
    /** Benchmarked language (multilingual benchmarks). */
    language?: string;
    /** Benchmarking dataset properties. */
    dataset?: TaskBenchmarkDataset;
    /** The benchmarking prompt properties. */
    prompt?: TaskBenchmarkPrompt;
    /** The scores for a given benchmark. */
    metrics?: TaskBenchmarkMetric[];
  }

  /** Benchmarking dataset properties. */
  export interface TaskBenchmarkDataset {
    /** The benchmarking dataset name. */
    name?: string;
  }

  /** The metric for a given property. */
  export interface TaskBenchmarkMetric {
    /** The name of the metric. */
    name?: string;
    /** The mean value calculated over all records in the dataset. */
    value?: number;
  }

  /** The benchmarking prompt properties. */
  export interface TaskBenchmarkPrompt {
    number_of_shots?: number;
  }

  /** The attributes of the task for this model. */
  export interface TaskDescription {
    /** The `id` of the task. */
    id: string;
    /** The ratings for this task for this model. */
    ratings?: TaskRating;
    /** The benchmarks for a given task. */
    benchmarks?: TaskBenchmark[];
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

  /** The function call. */
  export interface TextChatFunctionCall {
    /** The name of the function. */
    name: string;
    /** The arguments to call the function with, as generated by the model in JSON format.
     *
     *  Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your
     *  function schema. Validate the arguments in your code before calling your function.
     */
    arguments: string;
  }

  /** TextChatMessages. */
  export interface TextChatMessages {}

  /** The parameters specific to chat. */
  export interface TextChatParameterFunction {
    /** The name of the function. */
    name: string;
    /** A description of what the function does, used by the model to choose when and how to call the function. */
    description?: string;
    /** The parameters the functions accepts, described as a JSON Schema object. See the [JSON Schema
     *  reference](https://json-schema.org/learn/getting-started-step-by-step) for documentation about the format.
     *
     *  Omitting parameters defines a function with an empty parameter list.
     */
    parameters?: JsonObject;
  }

  /** The chat tool parameters. */
  export interface TextChatParameterTools {
    /** The tool type. */
    type: TextChatParameterTools.Constants.Type | string;
    /** The parameters specific to chat. */
    function?: TextChatParameterFunction;
  }
  export namespace TextChatParameterTools {
    export namespace Constants {
      /** The tool type. */
      export enum Type {
        FUNCTION = 'function',
      }
    }
  }

  /** System details. */
  export interface TextChatResponse {
    /** A unique identifier for the chat completion. */
    id: string;
    /** The model used for the chat completion. */
    model_id: string;
    /** The model version (using semantic versioning) if set. */
    model_version?: string;
    /** A list of chat completion choices. Can be more than one if `n` is greater than 1. */
    choices: TextChatResultChoice[];
    /** The Unix timestamp (in seconds) of when the chat completion was created. */
    created: number;
    /** The time when the response was created. */
    created_at?: string;
    /** Usage statistics for the completion request. */
    usage?: TextChatUsage;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** System details. */
  export interface TextChatStreamResponse {
    /** A unique identifier for the chat completion. */
    id: string;
    /** The model used for the chat completion. */
    model_id: string;
    /** The model version (using semantic versioning) if set. */
    model_version?: string;
    /** A list of chat completion choices. Can be more than one if `n` is greater than 1. */
    choices: TextChatStreamResultChoice[];
    /** The Unix timestamp (in seconds) of when the chat completion was created. */
    created: number;
    /** The time when the response was created. */
    created_at?: string;
    /** Usage statistics for the completion request. */
    usage?: TextChatUsage;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** The chat response format parameters. */
  export interface TextChatResponseFormat {
    /** Used to enable JSON mode, which guarantees the message the model generates is valid JSON.
     *
     *  **Important:** when using JSON mode, you must also instruct the model to produce JSON yourself via a system or
     *  user message. Without this, the model may generate an unending stream of whitespace until the generation reaches
     *  the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content
     *  may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or
     *  the conversation exceeded the max context length.
     */
    type: TextChatResponseFormat.Constants.Type | string;
  }
  export namespace TextChatResponseFormat {
    export namespace Constants {
      /** Used to enable JSON mode, which guarantees the message the model generates is valid JSON. **Important:** when using JSON mode, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length. */
      export enum Type {
        JSON_OBJECT = 'json_object',
      }
    }
  }

  /** A tool related result. */
  export interface TextChatResultChoice {
    /** The index of this result. */
    index?: number;
    /** A message result. */
    message?: TextChatResultMessage;
    /** The reason why the call stopped, can be one of:
     *  - `stop` - The model hit a natural stop point or a provided stop sequence.
     *  - `length` - The maximum number of tokens specified in the request was reached.
     *  - `tool_calls` - The model called a tool.
     *  - `time_limit`` - Time limit reached.
     *  - `cancelled`` - Request canceled by the client.
     *  - `error`` - Error encountered.
     *  - `null` - API response still in progress or incomplete.
     */
    finish_reason?: TextChatResultChoice.Constants.FinishReason | string;
  }

  export interface TextChatStreamResultChoice {
    /** The index of this result. */
    index?: number;
    /** A message chunk result. */
    delta?: TextChatResultMessage;
    /** The reason why the call stopped, can be one of:
     *  - `stop` - The model hit a natural stop point or a provided stop sequence.
     *  - `length` - The maximum number of tokens specified in the request was reached.
     *  - `tool_calls` - The model called a tool.
     *  - `time_limit`` - Time limit reached.
     *  - `cancelled`` - Request canceled by the client.
     *  - `error`` - Error encountered.
     *  - `null` - API response still in progress or incomplete.
     */
    finish_reason?: TextChatResultChoice.Constants.FinishReason | string;
  }
  export namespace TextChatResultChoice {
    export namespace Constants {
      /** The reason why the call stopped, can be one of: - `stop` - The model hit a natural stop point or a provided stop sequence. - `length` - The maximum number of tokens specified in the request was reached. - `tool_calls` - The model called a tool. - `time_limit`` - Time limit reached. - `cancelled`` - Request canceled by the client. - `error`` - Error encountered. - `null` - API response still in progress or incomplete. */
      export enum FinishReason {
        STOP = 'stop',
        LENGTH = 'length',
        TOOL_CALLS = 'tool_calls',
        TIME_LIMIT = 'time_limit',
        CANCELLED = 'cancelled',
        ERROR = 'error',
      }
    }
  }

  /** A message result. */
  export interface TextChatResultMessage {
    /** The role of the author of this message. */
    role: string;
    /** The contents of the message. */
    content?: string;
    /** The refusal message generated by the model. */
    refusal?: string;
    /** The tool calls generated by the model, such as function calls. */
    tool_calls?: TextChatToolCall[];
  }

  /**
   * A message result.
   */
  export interface TextChatResultDelta {
    /** The role of the author of this message. */
    role: string;
    /** The contents of the message. */
    content?: string;
    /** The refusal message generated by the model. */
    refusal?: string;
    /** The tool calls generated by the model, such as function calls. */
    tool_calls?: TextChatToolCall[];
  }

  /**
   * A tool related result.
   */
  export interface TextChatResultChoiceStream {
    /** The index of this result. */
    index?: number;
    /** A message result. */
    delta?: TextChatResultDelta;
    /** The reason why the call stopped, can be one of:
     *  - `stop` - The model hit a natural stop point or a provided stop sequence.
     *  - `length` - The maximum number of tokens specified in the request was reached.
     *  - `tool_calls` - The model called a tool.
     *  - `time_limit`` - Time limit reached.
     *  - `cancelled`` - Request canceled by the client.
     *  - `error`` - Error encountered.
     *  - `null` - API response still in progress or incomplete.
     */
    finish_reason?: TextChatResultChoiceStream.Constants.FinishReason | string;
  }

  export namespace TextChatResultChoiceStream {
    export namespace Constants {
      /** The reason why the call stopped, can be one of: - `stop` - The model hit a natural stop point or a provided stop sequence. - `length` - The maximum number of tokens specified in the request was reached. - `tool_calls` - The model called a tool. - `time_limit`` - Time limit reached. - `cancelled`` - Request canceled by the client. - `error`` - Error encountered. - `null` - API response still in progress or incomplete. */
      export enum FinishReason {
        STOP = 'stop',
        LENGTH = 'length',
        TOOL_CALLS = 'tool_calls',
        TIME_LIMIT = 'time_limit',
        CANCELLED = 'cancelled',
        ERROR = 'error',
      }
    }
  }

  /**
   * System details.
   */
  export interface TextChatStreamItem {
    /** A unique identifier for the chat completion. */
    id: string;
    /** The model used for the chat completion. */
    model_id: string;
    /** This field is a duplicate of `model_id` and is provided in order to provide better compatibility with other
     *  APIs.
     */
    model?: string;
    /** The model version (using semantic versioning) if set. */
    model_version?: string;
    /** The Unix timestamp (in seconds) of when the chat completion was created. */
    created: number;
    /** The time when the response was created in ISO 8601 format. */
    created_at?: string;
    /** Usage statistics for the completion request. */
    usage?: TextChatUsage;
    /** A list of chat completion choices. Can be more than one if `n` is greater than 1. */
    choices: TextChatResultChoiceStream[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /** The tool call. */
  export interface TextChatToolCall {
    /** The ID of the tool call. */
    id: string;
    /** The type of the tool. Currently, only `function` is supported. */
    type: TextChatToolCall.Constants.Type | string;
    /** The function call. */
    function: TextChatFunctionCall;
  }
  export namespace TextChatToolCall {
    export namespace Constants {
      /** The type of the tool. Currently, only `function` is supported. */
      export enum Type {
        FUNCTION = 'function',
      }
    }
  }

  /** Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool. Only one of `tool_choice_option` or `tool_choice` must be present. */
  export interface TextChatToolChoiceTool {
    /** The tool type. */
    type: TextChatToolChoiceTool.Constants.Type | string;
    /** The named function. */
    function: TextChatToolFunction;
  }
  export namespace TextChatToolChoiceTool {
    export namespace Constants {
      /** The tool type. */
      export enum Type {
        FUNCTION = 'function',
      }
    }
  }

  /** The named function. */
  export interface TextChatToolFunction {
    /** The name of the function. */
    name: string;
  }

  /** Usage statistics for the completion request. */
  export interface TextChatUsage {
    /** Number of tokens in the generated completion. */
    completion_tokens?: number;
    /** Number of tokens in the prompt. */
    prompt_tokens?: number;
    /** Total number of tokens used in the request (prompt + completion). */
    total_tokens?: number;
  }

  /** TextChatUserContents. */
  export interface TextChatUserContents {}

  /** The definition of a user image content. */
  export interface TextChatUserImageURL {
    /** The url of the image. This can be the url to the image or a base64 encoded image. */
    url: string;
    /** This parameter controls how the model processes the image and generates its textual understanding. The
     *  `auto` setting which will look at the image input size and decide if it should use the `low` or `high` setting.
     */
    detail?: TextChatUserImageURL.Constants.Detail | string;
  }
  export namespace TextChatUserImageURL {
    export namespace Constants {
      /** This parameter controls how the model processes the image and generates its textual understanding. The `auto` setting which will look at the image input size and decide if it should use the `low` or `high` setting. */
      export enum Detail {
        LOW = 'low',
        HIGH = 'high',
        AUTO = 'auto',
      }
    }
  }

  /**
   * A reference to data.
   */
  export interface TextExtractionDataReference {
    /** The data source type. */
    type: TextExtractionDataReference.Constants.Type | string;
    /** Contains a set of location fields specific to each data source. */
    connection?: CosDataConnection;
    /** Contains a set of fields specific to each connection. */
    location?: CosDataLocation;
  }
  export namespace TextExtractionDataReference {
    export namespace Constants {
      /** The data source type. */
      export enum Type {
        CONNECTION_ASSET = 'connection_asset',
      }
    }
  }

  /**
   * Common metadata for a resource where `project_id` or `space_id` must be present.
   */
  export interface TextExtractionMetadata {
    /** The id of the resource. */
    id: string;
    /** The time when the resource was created. */
    created_at: string;
    /** The space that contains the resource. Either `space_id` or `project_id` has to be given. */
    space_id?: string;
    /** The project that contains the resource. Either `space_id` or `project_id` has to be given. */
    project_id?: string;
  }

  /**
   * The text extraction resource.
   */
  export interface TextExtractionResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: TextExtractionMetadata;
    /** The document details for the text extraction. */
    entity?: TextExtractionResourceEntity;
  }

  /**
   * The document details for the text extraction.
   */
  export interface TextExtractionResourceEntity {
    /** A reference to data. */
    document_reference: TextExtractionDataReference;
    /** A reference to data. */
    results_reference: TextExtractionDataReference;
    /** The steps for the text extraction pipeline. */
    steps?: TextExtractionSteps;
    /** Set this as an empty object to specify `json` output.
     *
     *  Note that this is not strictly required because if an
     *  `assembly_md` object is not found then the default will be `json`.
     */
    assembly_json?: JsonObject;
    /** Set this as an empty object to specify `markdown` output. */
    assembly_md?: JsonObject;
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** The current status of the text extraction. */
    results: TextExtractionResults;
  }

  /**
   * A paginated list of resources.
   */
  export interface TextExtractionResources {
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
    /** A list of resources. */
    resources?: TextExtractionResource[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * The text extraction response.
   */
  export interface TextExtractionResponse {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: TextExtractionMetadata;
    /** The document details for the text extraction. */
    entity?: TextExtractionResourceEntity;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * The current status of the text extraction.
   */
  export interface TextExtractionResults {
    /** The status of the request. */
    status: TextExtractionResults.Constants.Status | string;
    /** The time when the request is successfully running on the processor. */
    running_at?: string;
    /** The time when the request completed or failed. */
    completed_at?: string;
    /** The number of pages that have been processed in the document. If the status is `completed` then this is the
     *  number of pages that will be billed.
     */
    number_pages_processed: number;
    /** The total number of pages to be processed. */
    total_pages?: number;
    /** A service error message. */
    error?: ServiceError;
  }

  /**
   * A service error message.
   */
  export interface ServiceError {
    /** A simple code that should convey the general sense of the error. */
    code: string;
    /** The message that describes the error. */
    message: string;
    /** A URL to a more detailed explanation when available. */
    more_info?: string;
  }
  export namespace TextExtractionResults {
    export namespace Constants {
      /** The status of the request. */
      export enum Status {
        SUBMITTED = 'submitted',
        UPLOADING = 'uploading',
        RUNNING = 'running',
        DOWNLOADING = 'downloading',
        DOWNLOADED = 'downloaded',
        COMPLETED = 'completed',
        FAILED = 'failed',
      }
    }
  }

  /**
   * The OCR text extraction step.
   */
  export interface TextExtractionStepOcr {
    /** Set of languages to be expected in the document. The language codes follow `ISO 639`. See the documentation
     *  for the currently supported languages.
     */
    languages_list?: string[];
  }

  /**
   * The tables processing text extraction step.
   */
  export interface TextExtractionStepTablesProcessing {
    /** Should tables be processed for text extraction. */
    enabled?: boolean;
  }

  /**
   * The steps for the text extraction pipeline.
   */
  export interface TextExtractionSteps {
    /** The OCR text extraction step. */
    ocr?: TextExtractionStepOcr;
    /** The tables processing text extraction step. */
    tables_processing?: TextExtractionStepTablesProcessing;
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
     *  tokens exceeds the `maximum sequence length`.
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

  /** Properties that control the moderation on the text. */
  export interface TextModerationWithoutThreshold {
    /** Should this moderation be enabled on the text.
     *
     *
     *  The default value is `true` which means that if the parent object exists but the `enabled` field does not exist
     *  then this is considered to be enabled.
     */
    enabled?: boolean;
    /** TextModerationWithoutThreshold accepts additional properties. */
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

  /**
   * Contains metadata about your timeseries data input.
   */
  export interface TSForecastInputSchema {
    /** A valid column in the data that should be treated as the timestamp. Although not absolutely necessary, if
     *  using calendar dates  (simple integer time offsets are also allowed), users should consider using a format such
     *  as ISO 8601 that includes a UTC offset (e.g.,
     *  '2024-10-18T01:09:21.454746+00:00'). This will avoid potential issues such as duplicate dates appearing due to
     *  daylight savings change overs. There are many date formats in existence and inferring the correct one can be a
     *  challenge so please do consider adhering to ISO 8601.
     */
    timestamp_column: string;
    /** Columns that define a unique key for timeseries. This is similar to a compound primary key in a database
     *  table.
     */
    id_columns?: string[];
    /** A frequency indicator for the given timestamp_column. See
     *  https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#period-aliases for a description of the
     *  allowed values. If not provided, we will attempt to infer it from the data.
     */
    freq?: string;
    /** An array of column headings which constitute the target variables in the data. These are the data that will
     *  be forecasted.
     */
    target_columns?: string[];
  }

  /**
   * The parameters for the forecast request.
   */
  export interface TSForecastParameters {
    /** The prediction length for the forecast. The service will return this many periods beyond the last timestamp
     *  in the inference data payload. If specified, `prediction_length` must be an integer >=1 and no more than the
     *  model default prediction length. When omitted the model default prediction_length will be used.
     */
    prediction_length?: number;
  }

  /**
   * The time series forecast response.
   */
  export interface TSForecastResponse {
    /** The model used to generate the forecast. */
    model_id?: string;
    /** The time when the response was created in ISO 8601 format. */
    created_at?: string;
    /** The list of prediction results. There will be a forecast for each time series in the input data. The
     *  `prediction_length` field in the request specifies the number of predictions in the results. The actual number
     *  of rows in the results will be equal to the `prediction length` multiplied by the number of unique ids in
     *  `id_columns`. The `timestamp_column` field in the request indicates the name of the timestamp column in the
     *  results.
     */
    results?: JsonObject[];
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
    /** Trained model id */
    model_id: string;
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
    /** User provided semantic version for tracking in IBM AI Factsheets. */
    number?: string;
    /** User provived tag. */
    tag?: string;
    /** Description of the version. */
    description?: string;
  }

  /** WxPromptPostModelVersion. */
  export interface WxPromptPostModelVersion {
    /** User provided semantic version for tracking in IBM AI Factsheets. */
    number?: string;
    /** User provived tag. */
    tag?: string;
    /** Description of the version. */
    description?: string;
  }

  /** WxPromptResponseModelVersion. */
  export interface WxPromptResponseModelVersion {
    /** User provided semantic version for tracking in IBM AI Factsheets. */
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

  /**
   * UtilityAgentTool.
   */
  export interface UtilityAgentTool {
    /** Name of the tool. */
    name: string;
    /** A plain text description of what the tool is used for. */
    description: string;
    /** The precise instruction to agent LLMs and should be treated as part of the system prompt. If not provided,
     *  `description` can be used in it's place.
     */
    agent_description?: string;
    /** The JSON schema of the input that is provided when running the tool if applicable. */
    input_schema?: JsonObject;
    /** The JSON schema of the config that can be provided when running the tool if applicable. */
    config_schema?: JsonObject;
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

  export interface CatalogSearchResponseAsset {
    entity: Record<string, any>;
    metadata: {
      asset_id: string;
      name: string;
      description: string;
      [key: string]: any;
    };
  }
  export interface ListPromptsResponse {
    /** Catalog Search Model */
    next?: CatalogSearch;
    total_rows?: number;
    results?: CatalogSearchResponseAsset[];
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

  /**
   * WxUtilityAgentToolsResponse.
   */
  export interface WxUtilityAgentToolsResponse {
    resources: UtilityAgentTool[];
  }

  /**
   * WxUtilityAgentToolsRunRequest.
   */
  export interface WxUtilityAgentToolsRunRequest {
    input: string | Record<string, any>;
    tool_name: string;
    config?: Record<string, any>;
  }

  /**
   * WxUtilityAgentToolsRunResponse.
   */
  export interface WxUtilityAgentToolsRunResponse {
    /** The output from running the tool. */
    output: any;
  }

  /** The definition of an assistant message. */
  export interface TextChatMessagesTextChatMessageAssistant extends TextChatMessages {
    /** The role of the messages author. */
    role: TextChatMessagesTextChatMessageAssistant.Constants.Role | string;
    /** The contents of the assistant message. Required unless `tool_calls` is specified. */
    content?: string;
    /** An optional name for the participant. Provides the model information to differentiate between participants
     *  of the same role.
     */
    name?: string;
    /** The refusal message by the assistant. */
    refusal?: string;
    /** The tool calls generated by the model, such as function calls. */
    tool_calls?: TextChatToolCall[];
  }
  export namespace TextChatMessagesTextChatMessageAssistant {
    export namespace Constants {
      /** The role of the messages author. */
      export enum Role {
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
        TOOL = 'tool',
        USER = 'system',
      }
    }
  }

  /** The definition of a system message. */
  export interface TextChatMessagesTextChatMessageSystem extends TextChatMessages {
    /** The role of the messages author. */
    role: TextChatMessagesTextChatMessageSystem.Constants.Role | string;
    /** The contents of the system message. */
    content: string;
    /** An optional name for the participant. Provides the model information to differentiate between participants
     *  of the same role.
     */
    name?: string;
  }
  export namespace TextChatMessagesTextChatMessageSystem {
    export namespace Constants {
      /** The role of the messages author. */
      export enum Role {
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
        TOOL = 'tool',
        USER = 'user',
      }
    }
  }

  /** The definition of a tool message. */
  export interface TextChatMessagesTextChatMessageTool extends TextChatMessages {
    /** The role of the messages author. */
    role: TextChatMessagesTextChatMessageTool.Constants.Role | string;
    /** The contents of the tool message. */
    content: string;
    /** Tool call that this message is responding to. */
    tool_call_id: string;
  }
  export namespace TextChatMessagesTextChatMessageTool {
    export namespace Constants {
      /** The role of the messages author. */
      export enum Role {
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
        TOOL = 'tool',
        USER = 'user',
      }
    }
  }

  /** The definition of a user message. */
  export interface TextChatMessagesTextChatMessageUser extends TextChatMessages {
    /** The role of the messages author. */
    role: TextChatMessagesTextChatMessageUser.Constants.Role | string;
    content: TextChatUserContents[];
    /** An optional name for the participant. Provides the model information to differentiate between participants
     *  of the same role.
     */
    name?: string;
  }
  export namespace TextChatMessagesTextChatMessageUser {
    export namespace Constants {
      /** The role of the messages author. */
      export enum Role {
        ASSISTANT = 'assistant',
        SYSTEM = 'system',
        TOOL = 'tool',
        USER = 'user',
      }
    }
  }

  /** The definition of a user image content. */
  export interface TextChatUserContentsTextChatUserImageURLContent extends TextChatUserContents {
    /** The type of the user content. */
    type: TextChatUserContentsTextChatUserImageURLContent.Constants.Type | string;
    /** The definition of a user image content. */
    image_url: TextChatUserImageURL;
  }
  export namespace TextChatUserContentsTextChatUserImageURLContent {
    export namespace Constants {
      /** The type of the user content. */
      export enum Type {
        TEXT = 'text',
        IMAGE_URL = 'image_url',
      }
    }
  }

  /** The definition of a user text content. */
  export interface TextChatUserContentsTextChatUserTextContent extends TextChatUserContents {
    /** The type of the user content. */
    type: TextChatUserContentsTextChatUserTextContent.Constants.Type | string;
    /** The text content. */
    text: string;
  }
  export namespace TextChatUserContentsTextChatUserTextContent {
    export namespace Constants {
      /** The type of the user content. */
      export enum Type {
        TEXT = 'text',
        IMAGE_URL = 'image_url',
      }
    }
  }

  /** Request parameters */
  export interface RequestParameters {
    options: BaseServiceOptions;
    defaultOptions: Record<string, any> & { headers: Record<string, any> };
  }

  /** Request parameters without headers */
  export interface RequestParametersWithoutHeaders {
    options: BaseServiceOptions;
    defaultOptions: Record<string, any>;
  }

  /** Invoke request callback */
  export type InvokeRequestCallback = (request: RequestParametersWithoutHeaders) => any;

  /** Receive response callback */
  export type ReceiveResponseCallback<T = any> = (response: T) => any;

  /** The definition of request callbacks */
  export interface RequestCallbacks<T = any> {
    requestCallback?: InvokeRequestCallback;
    responseCallback?: ReceiveResponseCallback<T>;
  }

  /**
   * Status of the training job.
   */
  export interface FineTuningEntity {
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  If set to `true` then the result of the training, if successful, will be uploaded to the repository as a model.
     */
    auto_update_model?: boolean;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The parameters for the job. Note that if `verbalizer` is provided
     *  then `response_template` must also be provided (and vice versa).
     */
    parameters?: FineTuningParameters;
    /** The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab training. */
    type?: FineTuningEntity.Constants.Type | string;
    /** The training datasets. */
    training_data_references: ObjectLocation[];
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The holdout/test datasets.
     */
    test_data_references?: ObjectLocation[];
    /** The training results. Normally this is specified as `type=container` which
     *  means that it is stored in the space or project.
     */
    results_reference: ObjectLocation;
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** Status of the training job. */
    status: TrainingStatus;
  }
  export namespace FineTuningEntity {
    export namespace Constants {
      /** The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab training. */
      export enum Type {
        ILAB = 'ilab',
      }
    }
  }

  /**
   * This field must not be set while creating a fine tuning job with InstructLab.
   *
   * The parameters for the job. Note that if `verbalizer` is provided then `response_template` must also be provided
   * (and vice versa).
   */
  export interface FineTuningParameters {
    /** The task that is targeted for this model. */
    task_id?: string;
    /** Number of updates steps to accumulate the gradients for, before performing a backward/update pass. */
    accumulate_steps?: number;
    /** The model id of the base model for this job. */
    base_model: BaseModel;
    /** Total number of training epochs to perform. */
    num_epochs?: number;
    /** The initial learning rate for AdamW optimizer. */
    learning_rate?: number;
    /** The batch size per GPU/XPU/TPU/MPS/NPU core/CPU for training. */
    batch_size?: number;
    /** Maximum sequence length in terms of number of tokens. Any sequence beyond this maximum length will be
     *  truncated.
     */
    max_seq_length?: number;
    /** Separator for the prediction/response in the single sequence to train on completions only. */
    response_template?: string;
    /** Verbalizer template to be used for formatting data at train and inference time.
     *
     *  This template may use brackets to indicate where fields from the data model must be rendered.
     */
    verbalizer?: string;
    /** The name and number of GPUs used for the Fine Tuning job. */
    gpu?: GPU;
    /** Parameters to be set when running a Fine Tuning job with LoRA/QLoRA. */
    peft_parameters?: FineTuningPeftParameters;
    /** Enabling gradient checkpointing reduces GPU memory required at the cost of slowing training by approx 20%. */
    gradient_checkpointing?: boolean;
  }

  /**
   * Parameters to be set when running a Fine Tuning job with LoRA/QLoRA.
   */
  export interface FineTuningPeftParameters {
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The type specification for a LoRA or QLoRA Fine Tuning job. If type is set to `none`, no other parameters in
     *  this object need to be specified.
     */
    type?: FineTuningPeftParameters.Constants.Type | string;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The Lora attention dimension (the "rank").
     */
    rank?: number;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The names of the modules to apply the adapter to. If this is specified, only the modules with the specified
     *  names will be replaced. Please specify modules as per model architecture. If the value is ["all-linear"], then
     *  LORA selects all linear and Conv1D modules as per model architecture, except for the output layer.
     */
    target_modules?: string[];
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The alpha parameter for Lora scaling.
     */
    lora_alpha?: number;
    /** This field must not be set while creating a fine tuning job with InstructLab.
     *
     *  The dropout probability for Lora layers.
     */
    lora_dropout?: number;
  }
  export namespace FineTuningPeftParameters {
    export namespace Constants {
      /** This field must not be set while creating a fine tuning job with InstructLab. The type specification for a LoRA or QLoRA Fine Tuning job. If type is set to `none`, no other parameters in this object need to be specified. */
      export enum Type {
        LORA = 'lora',
        QLORA = 'qlora',
        NONE = 'none',
      }
    }
  }

  /**
   * The response of a fine tuning job.
   */
  export interface FineTuningResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** Status of the training job. */
    entity?: FineTuningEntity;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * System details.
   */
  export interface FineTuningResources {
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
    resources?: FineTuningResource[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  export interface DocumentExtractionResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** The document extraction job properties. */
    entity?: DocumentExtractionResponse;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * The response of getting all document extraction jobs.
   */
  export interface DocumentExtractionResources {
    /** The number of items to return in each page. */
    limit: number;
    resources?: DocumentExtractionResource[];
  }

  /**
   * The document extraction job properties.
   */
  export interface DocumentExtractionResponse {
    /** The name of the document. */
    name: string;
    /** The documents for text extraction. */
    document_references: DocumentExtractionObjectLocation[];
    /** A reference to data. */
    results_reference: ObjectLocationGithub;
    /** A list of tags for this resource. */
    tags?: string[];
    /** Status of the document extraction job. */
    status?: DocumentExtractionStatus;
  }

  /**
   * Status of the document extraction job.
   */
  export interface DocumentExtractionStatus {
    /** Current state of document extraction. */
    state: DocumentExtractionStatus.Constants.State | string;
    /** The hash of the git commit when the results were saved. */
    commit?: string;
    /** The time when the job completed or failed. */
    completed_at?: string;
  }
  export namespace DocumentExtractionStatus {
    export namespace Constants {
      /** Current state of document extraction. */
      export enum State {
        QUEUED = 'queued',
        PENDING = 'pending',
        RUNNING = 'running',
        STORING = 'storing',
        COMPLETED_AT = 'completed_at',
        FAILED = 'failed',
        CANCELED = 'canceled',
      }
    }
  }

  /**
   * The Synthetic Data Generation context.
   */
  export interface SyntheticDataGenerationContext {
    /** The Synthetic Data Generation location metrics. */
    samples?: SyntheticDataGenerationLocations;
  }

  /**
   * A reference to data.
   */
  export interface SyntheticDataGenerationDataReference {
    /** The data source type like `connection_asset` or `data_asset`. */
    type: SyntheticDataGenerationDataReference.Constants.Type | string;
    /** Contains a set of fields specific to each connection.
     *  See here for [details about specifying connections](#datareferences).
     */
    connection?: DataConnection;
    /** Contains a set of fields that describe the location of the data with respect to the `connection`. */
    location: JsonObject;
  }
  export namespace SyntheticDataGenerationDataReference {
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

  /**
   * The Synthetic Data Generation location metrics.
   */
  export interface SyntheticDataGenerationLocations {
    /** The path to the created Knowledge file. */
    knowledge?: string;
    /** The path to the created Skills file. */
    skills?: string;
    /** The path to the created Logs file. */
    logs?: string;
    /** The path to the created Artifacts file. */
    artifacts?: string;
  }

  /**
   * The Synthetic Data Generation metrics.
   */
  export interface SyntheticDataGenerationMetric {
    /** The Synthetic Data Generation sample metrics. */
    samples?: SyntheticDataGenerationSample;
  }

  /**
   * All the Synthetic Data Generation metrics.
   */
  export interface SyntheticDataGenerationMetrics {
    /** The Synthetic Data Generation metrics. */
    synthetic_data_generation_metrics?: SyntheticDataGenerationMetric;
    /** The Synthetic Data Generation context. */
    context?: SyntheticDataGenerationContext;
  }

  /**
   * The response from getting a specified synthetic data generation job.
   */
  export interface SyntheticDataGenerationResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** The synthetic data generation job properties. */
    entity?: SyntheticDataGenerationResponse;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * The response of getting all synthetic data generation jobs.
   */
  export interface SyntheticDataGenerationResources {
    /** The number of items to return in each page. */
    limit: number;
    resources?: SyntheticDataGenerationResource[];
  }

  /**
   * The synthetic data generation job properties.
   */
  export interface SyntheticDataGenerationResponse {
    /** A reference to data. */
    results_reference?: ObjectLocation;
    /** The status of a Synthetic Data Generation job. */
    status?: SyntheticDataGenerationStatus;
    /** A reference to data. */
    data_reference?: ObjectLocation;
  }

  /**
   * The Synthetic Data Generation sample metrics.
   */
  export interface SyntheticDataGenerationSample {
    /** The knowledge metric value. */
    knowledge?: number;
    /** The skills metric value. */
    skills?: number;
    /** The combined value of the metric values. */
    total?: number;
  }

  /**
   * The status of a Synthetic Data Generation job.
   */
  export interface SyntheticDataGenerationStatus {
    /** The status of the job. */
    state: SyntheticDataGenerationStatus.Constants.State | string;
    /** The computed metrics. */
    metrics?: SyntheticDataGenerationMetrics[];
  }
  export namespace SyntheticDataGenerationStatus {
    export namespace Constants {
      /** The status of the job. */
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

  /**
   * The response fields from a Taxonomy request.
   */
  export interface TaxonomyResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata?: ResourceMeta;
    /** The Taxonomy entity. */
    entity?: TaxonomyResponse;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * The list of Taxonomy jobs in specified project or space.
   */
  export interface TaxonomyResources {
    /** The number of items to return in each page. */
    limit: number;
    /** The Taxonomy jobs in a project or space. */
    resources?: TaxonomyResource[];
  }

  /**
   * The Taxonomy entity.
   */
  export interface TaxonomyResponse {
    /** A reference to data. */
    results_reference?: ObjectLocation;
    /** The status of a Taxonomy job. */
    status?: TaxonomyStatus;
    /** A reference to data. */
    data_reference?: ObjectLocation;
  }

  /**
   * The status of a Taxonomy job.
   */
  export interface TaxonomyStatus {
    /** The status of the job. */
    state?: TaxonomyStatus.Constants.State | string;
    /** The timestamp when the job completed. */
    completed_at?: string;
    /** Date and Time in which current training state has started. */
    running_at?: string;
  }
  export namespace TaxonomyStatus {
    export namespace Constants {
      /** The status of the job. */
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

  /**
   * A software specification.
   */
  export interface SoftwareSpecRel {
    /** The id of the software specification. */
    id?: string;
    /** The revision of the software specification. */
    rev?: string;
    /** The name of the software specification. */
    name?: string;
  }

  export interface TrainingDetails {
    /** The `id` of the training job that produced this model. */
    id?: string;
    /** The model id of the base model for this job. */
    base_model?: BaseModel;
    /** The task that is targeted for this model. */
    task_id?: string;
    /** The optional verbalizer that was used during the training, if appropriate. */
    verbalizer?: string;
  }
  /**
   * Data shape (rows, columns) passed as input to the transformer/transformation.
   */
  export interface DataInput {
    /** The number of rows. */
    rows?: number;
    /** The number of columns. */
    columns?: number;
  }

  /**
   * Data shape after the transformation.
   */
  export interface DataOutput {
    /** The number of rows. */
    rows?: number;
    /** The number of columns. */
    columns?: number;
  }

  export interface Metric {
    /** A timestamp for the metrics. */
    timestamp: string;
    /** The iteration number. */
    iteration?: number;
    /** The metrics. */
    ml_metrics?: JsonObject;
    /** The metrics from the time series. For more information, please see the [Time Series
     *  Implementation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/autoai-timeseries-details.html?audience=wdp#ts-metrics)
     *  documentation.
     */
    ts_metrics?: MetricTsMetrics;
    /** The metrics from the time series anomaly detection. For more information, please see the [Creating a Time
     *  Series Anomaly
     *  Prediction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/autoai-ts-ad.html?audience=wdp)
     *  documentation.
     */
    tsad_metrics?: MetricTsadMetrics;
    /** The metrics from federated training. */
    ml_federated_metrics?: JsonObject;
    /** Provides extra information for this training stage in the context of auto-ml. */
    context?: MetricsContext;
  }

  export interface MetricTsMetrics {}

  /**
   * The metrics from the time series anomaly detection. For more information, please see the [Creating a Time Series
   * Anomaly
   * Prediction](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/autoai-ts-ad.html?audience=wdp)
   * documentation.
   */
  export interface MetricTsadMetrics {}

  export interface DataPreprocessingTransformation {
    /** The preprocessing stage. */
    stage?: string;
    /** Data shape (rows, columns) passed as input to the transformer/transformation. */
    input?: DataInput;
    /** Data shape after the transformation. */
    output?: DataOutput;
    /** Properties of preprocessing transformation. */
    props?: JsonObject;
  }

  /**
   * Information related to the upload of the model content.
   */
  export interface ModelResourceEntity {
    /** The model type. The supported model types can be found in the documentation
     *  [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/wmls/wmls-deploy-python-types.html?context=analytics).
     */
    type: string;
    /** A software specification. */
    software_spec?: SoftwareSpecRel;
    /** A reference to a resource. */
    pipeline?: Rel;
    /** The model definition. */
    model_definition?: ModelDefinitionId;
    /** Hyper parameters used for training this model. */
    hyper_parameters?: JsonObject;
    /** User provided domain name for this model. For example: sentiment, entity, visual-recognition, finance,
     *  retail, real estate etc.
     */
    domain?: string;
    /** The training data that was used to create this model. */
    training_data_references?: DataConnectionReference[];
    /** The holdout/test datasets. */
    test_data_references?: DataConnectionReference[];
    /** If the prediction schemas are provided here then they take precedent over any schemas
     *  provided in the data references. Note that data references contain the schema for the
     *  associated data and this object contains the schema(s) for the associated prediction, if any.
     *  In the case that the prediction input data matches exactly the schema of the training data
     *  references then the prediction schema can be omitted. However it is highly recommended to
     *  always specify the prediction schemas using this field.
     */
    schemas?: ModelEntitySchemas;
    /** The name of the label column. */
    label_column?: string;
    /** The name of the  label column seen by the estimator, which may have been transformed by the previous
     *  transformers in the pipeline. This is not necessarily the same column as the `label_column` in the initial data
     *  set.
     */
    transformed_label_column?: string;
    /** This will be used by scoring to record the size of the model. */
    size?: ModelEntitySize;
    /** Metrics that can be returned by an operation. */
    metrics?: Metric[];
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
    /** User defined objects referenced by the model. For any user defined class or function used in the model, its
     *  name, as referenced in the model, must be specified as the `key` and its fully qualified class or function name
     *  must be specified as the `value`. This is applicable for `Tensorflow 2.X` models serialized in `H5` format using
     *  the `tf.keras` API.
     */
    user_defined_objects?: JsonObject;
    /** The list of the software specifications that are used by the pipeline that generated this model, if the
     *  model was generated by a pipeline.
     */
    hybrid_pipeline_software_specs?: SoftwareSpecRel[];
    /** Optional metadata that can be used to provide information
     *  about this model that can be tracked with IBM AI Factsheets.
     *  See [Using AI
     *  Factsheets](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/factsheets-model-inventory.html)
     *  for more details.
     */
    model_version?: ModelEntityModelVersion;
    /** Deprecated: this is replaced by `training.id`. This field can be used to store the `id` of the training job
     *  that was used to produce this model.
     */
    training_id?: string;
    /** An optional array which contains the data preprocessing transformations that were executed by the training
     *  job that created this model.
     */
    data_preprocessing?: DataPreprocessingTransformation[];
    /** Information about the training job that created this model. */
    training?: TrainingDetails;
    /** The upload state. */
    content_import_state?: ModelResourceEntity.Constants.ContentImportState | string;
  }
  export namespace ModelResourceEntity {
    export namespace Constants {
      /** The upload state. */
      export enum ContentImportState {
        RUNNING = 'running',
        FAILED = 'failed',
        COMPLETED = 'completed',
      }
    }
  }

  export interface ModelResource {
    /** Common metadata for a resource where `project_id` or `space_id` must be present. */
    metadata: ResourceMeta;
    /** Information related to the upload of the model content. */
    entity?: ModelResourceEntity;
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  export interface ModelEntityModelVersion {
    /** This is the user-provided version which should follow semantic versioning. */
    number?: string;
    /** This is the user-provided tag for the model. */
    tag?: string;
    /** This is the user provided description that provides context for the change in the model version. */
    description?: string;
  }

  export interface ModelEntitySchemas {
    /** The schema of the expected prediction input data, see
     *  [datarecord-metadata-v2-schema](https://raw.githubusercontent.com/elyra-ai/pipeline-schemas/master/common-pipeline/datarecord-metadata/datarecord-metadata-v2-schema.json)
     *  for the schema definition.
     */
    input?: DataSchema[];
    /** The schema of the expected prediction output data, see
     *  [datarecord-metadata-v2-schema](https://raw.githubusercontent.com/elyra-ai/pipeline-schemas/master/common-pipeline/datarecord-metadata/datarecord-metadata-v2-schema.json)
     *  for the schema definition.
     */
    output?: DataSchema[];
  }

  export interface ModelEntitySize {
    /** The memory size of the model. */
    in_memory?: number;
    /** The size of the model on disk. */
    content?: number;
  }

  export interface ContentInfo {
    /** The content format of the attachment. This can be one of `native`, `coreML`, `pipeline-node`. */
    content_format: string;
    /** The location of the content to be uploaded. */
    location: string;
    /** The file name that will be used when downloading the content from the UI. */
    file_name: string;
    /** The `pipeline_node_id` that corresponds to this content. This is required only if the `content_format` is
     *  `pipeline-node` otherwise it is rejected or ignored.
     */
    pipeline_node_id?: string;
    /** The `deployment_id` that corresponds to this content. This is required only if the `content_format` is
     *  `coreml` otherwise it is rejected or ignored.
     */
    deployment_id?: string;
  }

  export interface ContentLocation {
    /** The content information to be uploaded. */
    contents: ContentInfo[];
    /** The data source type like `connection_asset` or `data_asset`. */
    type: ContentLocation.Constants.Type | string;
    /** Connection properties. */
    connection?: JsonObject;
    /** Location properties. */
    location?: JsonObject;
  }
  export namespace ContentLocation {
    export namespace Constants {
      /** The data source type like `connection_asset` or `data_asset`. */
      export enum Type {
        CONNECTION_ASSET = 'connection_asset',
        DATA_ASSET = 'data_asset',
        URL = 'url',
      }
    }
  }

  export interface AudioTranscriptionResult {
    /** The model used for audio transcriptions. */
    model: string;
    /** The transcribed text. */
    text: string;
    /** The time when the response was created in ISO 8601 format. Example: 2020-05-02T16:27:51Z */
    created_at: string;
    /** Number of estimated tokens from returned text. */
    token_count: number;
  }

  /**
   * A paginated list of models.
   */
  export interface ModelResources {
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
    /** A list of models. */
    resources?: ModelResource[];
    /** Optional details coming from the service and related to the API call or the associated resource. */
    system?: SystemDetails;
  }

  /**
   * ModelDefinitionEntityPlatform.
   */
  export interface ModelDefinitionEntityPlatform {
    /** The name of the platform. */
    name: string;
    /** The supported versions. */
    versions: string[];
  }

  /**
   * ModelDefinitionEntityRequestPlatform.
   */
  export interface ModelDefinitionEntityRequestPlatform {
    /** The name of the platform. */
    name: string;
    /** The supported versions. */
    versions: string[];
  }

  /**
   * The definition of a model. The `software_spec` is used only for training. Either space_id or project_id has to be
   * provided and is mandatory.
   */
  export interface ModelDefinitionEntity {
    /** The package version. */
    version: string;
    platform: ModelDefinitionEntityPlatform;
    /** The command used to run the model. */
    command?: string;
    /** A software specification. */
    software_spec?: SoftwareSpecRel;
    /** User defined properties specified as key-value pairs. */
    custom?: JsonObject;
  }

  /**
   * The model definition.
   */
  export interface ModelDefinitionId {
    /** The id of the model definition. */
    id?: string;
  }

  /**
   * A model. The `software_spec` is a reference to a software specification. The `hardware_spec` is a reference to a
   * hardware specification.
   */
  export interface ModelDefinitionRel {
    /** The id of the referenced resource. */
    id: string;
    /** The revision of the referenced resource. */
    rev?: string;
    /** The underlying model type produced by the pipeline or by the model_definition. */
    model_type?: string;
    /** A hardware specification. */
    hardware_spec?: HardwareSpec;
    /** A software specification. */
    software_spec?: SoftwareSpecRel;
    /** If present, it overrides the command specified to the library resource itself. */
    command?: string;
    /** Optional key-value pairs parameters. */
    parameters?: JsonObject;
  }

  /**
   * The name and number of GPUs used for the Fine Tuning job.
   */
  export interface GPU {
    /** The number of GPUs used for the Fine Tuning job. */
    num?: number;
    /** The name of the GPU(s) used for the Fine Tuning job. The GPU specified must be available on the cluster. */
    name?: string;
  }

  /**
   * A reference to data.
   */
  export interface DocumentExtractionObjectLocation {
    /** The data source type. This field must be set to `container`. */
    type: DocumentExtractionObjectLocation.Constants.Type | string;
    /** Contains a set of fields that describe the location of the data with respect to the `connection`. */
    location: JsonObject;
  }
  export namespace DocumentExtractionObjectLocation {
    export namespace Constants {
      /** The data source type. This field must be set to `container`. */
      export enum Type {
        CONTAINER = 'container',
      }
    }
  }

  /**
   * A reference to data.
   */
  export interface ObjectLocationGithub {
    /** The data source type, for now only `github` is supported. */
    type: ObjectLocationGithub.Constants.Type | string;
    /** Contains a set of fields that describe the location of the data with respect to the `connection`. */
    location: JsonObject;
  }
  export namespace ObjectLocationGithub {
    export namespace Constants {
      /** The data source type, for now only `github` is supported. */
      export enum Type {
        GITHUB = 'github',
      }
    }
  }

  export interface ErrorResponse {
    code: string;
    message: string;
    paramteters?: string[];
    more_info?: string;
  }

  export interface SpaceResource {
    metadata: {
      id: string;
      url: string;
      creator_id: string;
      created_at: string;
      updated_at: string;
    };
    entity: {
      name: string;
      scope: {
        bss_account_id: string;
      };
      status: {
        state: string;
        failure?: {
          trace: string;
          errors: ErrorResponse[];
        };
      };
      stage: SpaceStage;
      type: string;
      settings: SpaceSettings;
      description?: string;
      storage?: SpaceStorage;
      compute?: SpaceCompute[];
      members?: SpaceMember[];
      tags?: string[];
      generator?: string;
    };
  }
  export interface SpaceResources {
    total_count?: number;
    limit: number;
    first: {
      href: string;
    };
    next?: {
      href: string;
    };
    resources: SpaceResource[];
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
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
   * TextExtractionsPager can be used to simplify the use of listTextExtractions().
   */
  export class TextExtractionsPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.ListTextExtractionsParams;

    /**
     * Construct a TextExtractionsPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listTextExtractions()
     * @param {Object} [params] - The parameters to be passed to listTextExtractions()
     * @constructor
     * @returns {TextExtractionsPager}
     */
    constructor(client: WatsonxAiMlVml_v1, params?: WatsonxAiMlVml_v1.ListTextExtractionsParams) {
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
     * Returns the next page of results by invoking listTextExtractions().
     * @returns {Promise<WatsonxAiMlVml_v1.TextExtractionResource[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.TextExtractionResource[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listTextExtractions(this.params);
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
      return result.resources;
    }

    /**
     * Returns all results by invoking listTextExtractions() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.TextExtractionResource[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.TextExtractionResource[]> {
      const results: TextExtractionResource[] = [];
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
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

  /**
   * FineTuningListPager can be used to simplify the use of fineTuningList().
   */
  export class FineTuningListPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.FineTuningListParams;

    /**
     * Construct a FineTuningListPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke fineTuningList()
     * @param {Object} [params] - The parameters to be passed to fineTuningList()
     * @constructor
     */
    constructor(client: WatsonxAiMlVml_v1, params?: WatsonxAiMlVml_v1.FineTuningListParams) {
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
     * Returns the next page of results by invoking fineTuningList().
     * @returns {Promise<WatsonxAiMlVml_v1.FineTuningResource[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.FineTuningResource[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listFineTunings(this.params);
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
      return result.resources;
    }

    /**
     * Returns all results by invoking fineTuningList() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.FineTuningResource[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.FineTuningResource[]> {
      const results: FineTuningResource[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /**
   * ModelsListPager can be used to simplify the use of modelsList().
   */
  export class ModelsListPager {
    protected _hasNext: boolean;

    protected pageContext: any;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.ModelsListParams;

    /**
     * Construct a ModelsListPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke modelsList()
     * @param {Object} [params] - The parameters to be passed to modelsList()
     * @constructor
     * @returns {ModelsListPager}
     */
    constructor(client: WatsonxAiMlVml_v1, params?: WatsonxAiMlVml_v1.ModelsListParams) {
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
     * Returns the next page of results by invoking modelsList().
     * @returns {Promise<WatsonxAiMlVml_v1.ModelResource[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.ModelResource[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      if (this.pageContext.next) {
        this.params.start = this.pageContext.next;
      }
      const response = await this.client.listModels(this.params);
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
      if (!result.resources) throw new Error('Something went wrong when retrieving results.');
      return result.resources;
    }

    /**
     * Returns all results by invoking modelsList() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.ModelResource[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.ModelResource[]> {
      const results: ModelResource[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /**
   * ListPromptsPager can be used to simplify the use of listPrompts().
   */
  export class ListPromptsPager {
    protected _hasNext: boolean;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.PromptListParams;

    /**
     * Construct a ListPromptsPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listPrompts()
     * @param {WatsonxAiMlVml_v1.PromptListParams} [params] - The parameters to be passed to listPrompts()
     * @constructor
     */
    constructor(client: WatsonxAiMlVml_v1, params: WatsonxAiMlVml_v1.PromptListParams) {
      this._hasNext = true;
      this.client = client;
      this.params = params;
    }

    /**
     * Returns true if there are potentially more results to be retrieved by invoking getNext().
     * @returns {boolean}
     */
    public hasNext(): boolean {
      return this._hasNext;
    }

    /**
     * Returns the next page of results by invoking listPrompts().
     * @returns {Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      const response = await this.client.listPrompts(this.params);
      const { result } = response;

      const { next } = result;
      this.params = { ...this.params, ...next };
      if (!next) {
        this._hasNext = false;
      }

      return result.results || [];
    }

    /**
     * Returns all results by invoking listPrompts() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]> {
      const results: CatalogSearchResponseAsset[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /**
   * ListSpacesPager can be used to simplify the use of listSpaces().
   */
  export class ListSpacesPager {
    protected _hasNext: boolean;

    protected client: WatsonxAiMlVml_v1;

    protected params: WatsonxAiMlVml_v1.ListSpacesParams;

    /**
     * Construct a ListPromptsPager object.
     *
     * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listPrompts()
     * @param {WatsonxAiMlVml_v1.ListSpacesParams} [params] - The parameters to be passed to listPrompts()
     * @constructor
     */
    constructor(client: WatsonxAiMlVml_v1, params?: WatsonxAiMlVml_v1.PromptListParams) {
      this._hasNext = true;
      this.client = client;
      this.params = params || {};
    }

    /**
     * Returns true if there are potentially more results to be retrieved by invoking getNext().
     * @returns {boolean}
     */
    public hasNext(): boolean {
      return this._hasNext;
    }

    /**
     * Returns the next page of results by invoking listSpaces().
     * @returns {Promise<WatsonxAiMlVml_v1.SpaceResource[]>}
     */
    public async getNext(): Promise<WatsonxAiMlVml_v1.SpaceResource[]> {
      if (!this.hasNext()) {
        throw new Error('No more results available');
      }

      const response = await this.client.listSpaces(this.params);

      const {
        result: { next, resources },
      } = response;

      if (!next) {
        this._hasNext = false;
      } else {
        const urlObject = new URL(next.href);
        const searchParams = new URLSearchParams(urlObject.searchParams);
        const startParam = searchParams.get('start');
        if (startParam) this.params = { ...this.params, start: startParam };
        else throw new Error("'start' param is not present in provided url");
      }

      return resources;
    }

    /**
     * Returns all results by invoking listPrompts() repeatedly until all pages of results have been retrieved.
     * @returns {Promise<WatsonxAiMlVml_v1.SpaceResource[]>}
     */
    public async getAll(): Promise<WatsonxAiMlVml_v1.SpaceResource[]> {
      const results: SpaceResource[] = [];
      while (this.hasNext()) {
        const nextPage = await this.getNext();
        results.push(...nextPage);
      }
      return results;
    }
  }

  /** Chunk interface when returnObject=true in stream */
  export interface ObjectStreamed<T> {
    id: number;
    event: string;
    data: T;
  }

  /**
   * CallbackHandler class to be used with callbacks provided by user in requests
   */

  export class CallbackHandler {
    requestCallback: InvokeRequestCallback | undefined;

    responseCallback: ReceiveResponseCallback | undefined;

    constructor(callbacks: RequestCallbacks) {
      this.requestCallback = callbacks?.requestCallback;
      this.responseCallback = callbacks?.responseCallback;
    }

    handleRequest(parameters: RequestParameters) {
      if (!this.requestCallback) return;
      const { defaultOptions, options } = parameters;
      const { headers, ...defaultOptionsNoHeaders } = defaultOptions;
      const parametersNoHeaders = { options, defaultOptions: defaultOptionsNoHeaders };
      this.requestCallback(parametersNoHeaders);
    }

    async handleResponse<T>(response: Promise<T>) {
      if (!this.responseCallback) return;
      const res = await response;
      this.responseCallback(res);
    }
  }
}

export { WatsonxAiMlVml_v1 as WatsonXAI };
export default WatsonxAiMlVml_v1;
// Reimports to perserve backwards compatibility and importing interfaces/namespaces as single items
export import PostPromptConstants = WatsonxAiMlVml_v1.PostPromptConstants;
export import PatchPromptConstants = WatsonxAiMlVml_v1.PatchPromptConstants;
export import PutPromptLockConstants = WatsonxAiMlVml_v1.PutPromptLockConstants;
export import PostPromptSessionEntryConstants = WatsonxAiMlVml_v1.PostPromptSessionEntryConstants;
export import PutPromptSessionLockConstants = WatsonxAiMlVml_v1.PutPromptSessionLockConstants;
export import TextChatConstants = WatsonxAiMlVml_v1.TextChatConstants;
export import TextChatStreamConstants = WatsonxAiMlVml_v1.TextChatStreamConstants;
export import TrainingsListConstants = WatsonxAiMlVml_v1.TrainingsListConstants;
export import CreateFineTuningConstants = WatsonxAiMlVml_v1.CreateFineTuningConstants;
export import Options = WatsonxAiMlVml_v1.Options;
export import TokenAuthenticationOptions = WatsonxAiMlVml_v1.TokenAuthenticationOptions;
export import Certificates = WatsonxAiMlVml_v1.Certificates;
export import Certificate = WatsonxAiMlVml_v1.Certificate;
export import HttpsAgentMap = WatsonxAiMlVml_v1.HttpsAgentMap;
export import Response = WatsonxAiMlVml_v1.Response;
export import Callback = WatsonxAiMlVml_v1.Callback;
export import EmptyObject = WatsonxAiMlVml_v1.EmptyObject;
export import JsonObject = WatsonxAiMlVml_v1.JsonObject;
export import DefaultParams = WatsonxAiMlVml_v1.DefaultParams;
export import CreateDeploymentParams = WatsonxAiMlVml_v1.CreateDeploymentParams;
export import ListDeploymentsParams = WatsonxAiMlVml_v1.ListDeploymentsParams;
export import DeploymentsGetParams = WatsonxAiMlVml_v1.DeploymentsGetParams;
export import DeploymentsUpdateParams = WatsonxAiMlVml_v1.DeploymentsUpdateParams;
export import DeploymentsDeleteParams = WatsonxAiMlVml_v1.DeploymentsDeleteParams;
export import DeploymentsTextGenerationParams = WatsonxAiMlVml_v1.DeploymentsTextGenerationParams;
export import DeploymentsTextGenerationStreamParams = WatsonxAiMlVml_v1.DeploymentsTextGenerationStreamParams;
export import DeploymentsTextChatParams = WatsonxAiMlVml_v1.DeploymentsTextChatParams;
export import DeploymentsTextChatStreamParams = WatsonxAiMlVml_v1.DeploymentsTextChatStreamParams;
export import DeploymentsTimeSeriesForecastParams = WatsonxAiMlVml_v1.DeploymentsTimeSeriesForecastParams;
export import ListFoundationModelSpecsParams = WatsonxAiMlVml_v1.ListFoundationModelSpecsParams;
export import ListFoundationModelTasksParams = WatsonxAiMlVml_v1.ListFoundationModelTasksParams;
export import PostPromptParams = WatsonxAiMlVml_v1.PostPromptParams;
export import GetPromptParams = WatsonxAiMlVml_v1.GetPromptParams;
export import CatalogSearch = WatsonxAiMlVml_v1.CatalogSearch;
export import PromptListParams = WatsonxAiMlVml_v1.PromptListParams;
export import PatchPromptParams = WatsonxAiMlVml_v1.PatchPromptParams;
export import DeletePromptParams = WatsonxAiMlVml_v1.DeletePromptParams;
export import PutPromptLockParams = WatsonxAiMlVml_v1.PutPromptLockParams;
export import GetPromptLockParams = WatsonxAiMlVml_v1.GetPromptLockParams;
export import GetPromptInputParams = WatsonxAiMlVml_v1.GetPromptInputParams;
export import PostPromptChatItemParams = WatsonxAiMlVml_v1.PostPromptChatItemParams;
export import PostPromptSessionParams = WatsonxAiMlVml_v1.PostPromptSessionParams;
export import GetPromptSessionParams = WatsonxAiMlVml_v1.GetPromptSessionParams;
export import PatchPromptSessionParams = WatsonxAiMlVml_v1.PatchPromptSessionParams;
export import DeletePromptSessionParams = WatsonxAiMlVml_v1.DeletePromptSessionParams;
export import PostPromptSessionEntryParams = WatsonxAiMlVml_v1.PostPromptSessionEntryParams;
export import GetPromptSessionEntriesParams = WatsonxAiMlVml_v1.GetPromptSessionEntriesParams;
export import PostPromptSessionEntryChatItemParams = WatsonxAiMlVml_v1.PostPromptSessionEntryChatItemParams;
export import PutPromptSessionLockParams = WatsonxAiMlVml_v1.PutPromptSessionLockParams;
export import GetPromptSessionLockParams = WatsonxAiMlVml_v1.GetPromptSessionLockParams;
export import GetPromptSessionEntryParams = WatsonxAiMlVml_v1.GetPromptSessionEntryParams;
export import DeletePromptSessionEntryParams = WatsonxAiMlVml_v1.DeletePromptSessionEntryParams;
export import TextChatParams = WatsonxAiMlVml_v1.TextChatParams;
export import TextChatStreamParams = WatsonxAiMlVml_v1.TextChatStreamParams;
export import TextEmbeddingsParams = WatsonxAiMlVml_v1.TextEmbeddingsParams;
export import TextExtractionParams = WatsonxAiMlVml_v1.TextExtractionParams;
export import ListTextExtractionsParams = WatsonxAiMlVml_v1.ListTextExtractionsParams;
export import TextExtractionGetParams = WatsonxAiMlVml_v1.TextExtractionGetParams;
export import TextExtractionDeleteParams = WatsonxAiMlVml_v1.TextExtractionDeleteParams;
export import TextGenerationParams = WatsonxAiMlVml_v1.TextGenerationParams;
export import TextGenerationStreamParams = WatsonxAiMlVml_v1.TextGenerationStreamParams;
export import TextTokenizationParams = WatsonxAiMlVml_v1.TextTokenizationParams;
export import TrainingsCreateParams = WatsonxAiMlVml_v1.TrainingsCreateParams;
export import TrainingsListParams = WatsonxAiMlVml_v1.TrainingsListParams;
export import TrainingsGetParams = WatsonxAiMlVml_v1.TrainingsGetParams;
export import TrainingsDeleteParams = WatsonxAiMlVml_v1.TrainingsDeleteParams;
export import TextRerankParams = WatsonxAiMlVml_v1.TextRerankParams;
export import TimeSeriesForecastParams = WatsonxAiMlVml_v1.TimeSeriesForecastParams;
export import CreateFineTuningParams = WatsonxAiMlVml_v1.CreateFineTuningParams;
export import FineTuningListParams = WatsonxAiMlVml_v1.FineTuningListParams;
export import GetFineTuningParams = WatsonxAiMlVml_v1.GetFineTuningParams;
export import DeleteFineTuningParams = WatsonxAiMlVml_v1.DeleteFineTuningParams;
export import CreateDocumentExtractionParams = WatsonxAiMlVml_v1.CreateDocumentExtractionParams;
export import ListDocumentExtractionsParams = WatsonxAiMlVml_v1.ListDocumentExtractionsParams;
export import GetDocumentExtractionParams = WatsonxAiMlVml_v1.GetDocumentExtractionParams;
export import CancelDocumentExtractionsParams = WatsonxAiMlVml_v1.CancelDocumentExtractionsParams;
export import CreateSyntheticDataGenerationParams = WatsonxAiMlVml_v1.CreateSyntheticDataGenerationParams;
export import ListSyntheticDataGenerationsParams = WatsonxAiMlVml_v1.ListSyntheticDataGenerationsParams;
export import GetSyntheticDataGenerationParams = WatsonxAiMlVml_v1.GetSyntheticDataGenerationParams;
export import CancelSyntheticDataGenerationParams = WatsonxAiMlVml_v1.CancelSyntheticDataGenerationParams;
export import CreateTaxonomyParams = WatsonxAiMlVml_v1.CreateTaxonomyParams;
export import ListTaxonomiesParams = WatsonxAiMlVml_v1.ListTaxonomiesParams;
export import GetTaxonomyParams = WatsonxAiMlVml_v1.GetTaxonomyParams;
export import DeleteTaxonomyParams = WatsonxAiMlVml_v1.DeleteTaxonomyParams;
export import ModelsCreateParams = WatsonxAiMlVml_v1.ModelsCreateParams;
export import ModelsListParams = WatsonxAiMlVml_v1.ModelsListParams;
export import ModelsGetParams = WatsonxAiMlVml_v1.ModelsGetParams;
export import ModelsUpdateParams = WatsonxAiMlVml_v1.ModelsUpdateParams;
export import ModelsDeleteParams = WatsonxAiMlVml_v1.ModelsDeleteParams;
export import GetUtilityAgentToolsParams = WatsonxAiMlVml_v1.GetUtilityAgentToolsParams;
export import GetUtilityAgentToolParams = WatsonxAiMlVml_v1.GetUtilityAgentToolParams;
export import PostUtilityAgentToolsRunParams = WatsonxAiMlVml_v1.PostUtilityAgentToolsRunParams;
export import PostUtilityAgentToolsRunByNameParams = WatsonxAiMlVml_v1.PostUtilityAgentToolsRunByNameParams;
export import ListSpacesParams = WatsonxAiMlVml_v1.ListSpacesParams;
export import CreateSpaceParams = WatsonxAiMlVml_v1.CreateSpaceParams;
export import SpaceStorage = WatsonxAiMlVml_v1.SpaceStorage;
export import SpaceCompute = WatsonxAiMlVml_v1.SpaceCompute;
export import SpaceStage = WatsonxAiMlVml_v1.SpaceStage;
export import SpaceSettings = WatsonxAiMlVml_v1.SpaceSettings;
export import SpaceMember = WatsonxAiMlVml_v1.SpaceMember;
export import GetSpaceParams = WatsonxAiMlVml_v1.GetSpaceParams;
export import DeleteSpaceParams = WatsonxAiMlVml_v1.DeleteSpaceParams;
export import SpacePatchOperation = WatsonxAiMlVml_v1.SpacePatchOperation;
export import SpacePatchParams = WatsonxAiMlVml_v1.SpacePatchParams;
export import TranscribeAudioParams = WatsonxAiMlVml_v1.TranscribeAudioParams;
export import ApiError = WatsonxAiMlVml_v1.ApiError;
export import ApiErrorResponse = WatsonxAiMlVml_v1.ApiErrorResponse;
export import ApiErrorTarget = WatsonxAiMlVml_v1.ApiErrorTarget;
export import BaseModel = WatsonxAiMlVml_v1.BaseModel;
export import ConsumptionsLimit = WatsonxAiMlVml_v1.ConsumptionsLimit;
export import DataConnection = WatsonxAiMlVml_v1.DataConnection;
export import CosDataConnection = WatsonxAiMlVml_v1.CosDataConnection;
export import CosDataLocation = WatsonxAiMlVml_v1.CosDataLocation;
export import DataConnectionReference = WatsonxAiMlVml_v1.DataConnectionReference;
export import DataSchema = WatsonxAiMlVml_v1.DataSchema;
export import DeploymentEntity = WatsonxAiMlVml_v1.DeploymentEntity;
export import DeploymentResource = WatsonxAiMlVml_v1.DeploymentResource;
export import DeploymentResourceCollection = WatsonxAiMlVml_v1.DeploymentResourceCollection;
export import DeploymentResourcePatch = WatsonxAiMlVml_v1.DeploymentResourcePatch;
export import DeploymentStatus = WatsonxAiMlVml_v1.DeploymentStatus;
export import DeploymentSystem = WatsonxAiMlVml_v1.DeploymentSystem;
export import DeploymentSystemDetails = WatsonxAiMlVml_v1.DeploymentSystemDetails;
export import DeploymentTextChatMessages = WatsonxAiMlVml_v1.DeploymentTextChatMessages;
export import DeploymentTextGenProperties = WatsonxAiMlVml_v1.DeploymentTextGenProperties;
export import DeploymentTSForecastParameters = WatsonxAiMlVml_v1.DeploymentTSForecastParameters;
export import Embedding = WatsonxAiMlVml_v1.Embedding;
export import EmbeddingParameters = WatsonxAiMlVml_v1.EmbeddingParameters;
export import EmbeddingReturnOptions = WatsonxAiMlVml_v1.EmbeddingReturnOptions;
export import EmbeddingsResponse = WatsonxAiMlVml_v1.EmbeddingsResponse;
export import ExternalInformationExternalModel = WatsonxAiMlVml_v1.ExternalInformationExternalModel;
export import ExternalInformationExternalPrompt = WatsonxAiMlVml_v1.ExternalInformationExternalPrompt;
export import ExternalPromptAdditionalInformationItem = WatsonxAiMlVml_v1.ExternalPromptAdditionalInformationItem;
export import FoundationModel = WatsonxAiMlVml_v1.FoundationModel;
export import FoundationModelLimits = WatsonxAiMlVml_v1.FoundationModelLimits;
export import FoundationModelTask = WatsonxAiMlVml_v1.FoundationModelTask;
export import FoundationModelTasks = WatsonxAiMlVml_v1.FoundationModelTasks;
export import FoundationModelVersion = WatsonxAiMlVml_v1.FoundationModelVersion;
export import FoundationModels = WatsonxAiMlVml_v1.FoundationModels;
export import GetPromptInputResponse = WatsonxAiMlVml_v1.GetPromptInputResponse;
export import HardwareRequest = WatsonxAiMlVml_v1.HardwareRequest;
export import HardwareSpec = WatsonxAiMlVml_v1.HardwareSpec;
export import Inference = WatsonxAiMlVml_v1.Inference;
export import JsonPatchOperation = WatsonxAiMlVml_v1.JsonPatchOperation;
export import LifeCycleState = WatsonxAiMlVml_v1.LifeCycleState;
export import MaskProperties = WatsonxAiMlVml_v1.MaskProperties;
export import Message = WatsonxAiMlVml_v1.Message;
export import MetricsContext = WatsonxAiMlVml_v1.MetricsContext;
export import ModelLimits = WatsonxAiMlVml_v1.ModelLimits;
export import ModelRel = WatsonxAiMlVml_v1.ModelRel;
export import ModerationHapProperties = WatsonxAiMlVml_v1.ModerationHapProperties;
export import ModerationPiiProperties = WatsonxAiMlVml_v1.ModerationPiiProperties;
export import ModerationProperties = WatsonxAiMlVml_v1.ModerationProperties;
export import ModerationResult = WatsonxAiMlVml_v1.ModerationResult;
export import ModerationResults = WatsonxAiMlVml_v1.ModerationResults;
export import ModerationTextRange = WatsonxAiMlVml_v1.ModerationTextRange;
export import Moderations = WatsonxAiMlVml_v1.Moderations;
export import ObjectLocation = WatsonxAiMlVml_v1.ObjectLocation;
export import OnlineDeployment = WatsonxAiMlVml_v1.OnlineDeployment;
export import OnlineDeploymentParameters = WatsonxAiMlVml_v1.OnlineDeploymentParameters;
export import PaginationFirst = WatsonxAiMlVml_v1.PaginationFirst;
export import PaginationNext = WatsonxAiMlVml_v1.PaginationNext;
export import PromptModelParameters = WatsonxAiMlVml_v1.PromptModelParameters;
export import PromptTuning = WatsonxAiMlVml_v1.PromptTuning;
export import PromptTuningMetricsContext = WatsonxAiMlVml_v1.PromptTuningMetricsContext;
export import PromptWithExternalModelParameters = WatsonxAiMlVml_v1.PromptWithExternalModelParameters;
export import Rel = WatsonxAiMlVml_v1.Rel;
export import RerankInput = WatsonxAiMlVml_v1.RerankInput;
export import RerankParameters = WatsonxAiMlVml_v1.RerankParameters;
export import RerankResponse = WatsonxAiMlVml_v1.RerankResponse;
export import RerankReturnOptions = WatsonxAiMlVml_v1.RerankReturnOptions;
export import RerankedResults = WatsonxAiMlVml_v1.RerankedResults;
export import ResourceCommitInfo = WatsonxAiMlVml_v1.ResourceCommitInfo;
export import ResourceMeta = WatsonxAiMlVml_v1.ResourceMeta;
export import ReturnOptionProperties = WatsonxAiMlVml_v1.ReturnOptionProperties;
export import SimpleRel = WatsonxAiMlVml_v1.SimpleRel;
export import Stats = WatsonxAiMlVml_v1.Stats;
export import SystemDetails = WatsonxAiMlVml_v1.SystemDetails;
export import TaskBenchmark = WatsonxAiMlVml_v1.TaskBenchmark;
export import TaskBenchmarkDataset = WatsonxAiMlVml_v1.TaskBenchmarkDataset;
export import TaskBenchmarkMetric = WatsonxAiMlVml_v1.TaskBenchmarkMetric;
export import TaskBenchmarkPrompt = WatsonxAiMlVml_v1.TaskBenchmarkPrompt;
export import TaskDescription = WatsonxAiMlVml_v1.TaskDescription;
export import TaskRating = WatsonxAiMlVml_v1.TaskRating;
export import TextChatFunctionCall = WatsonxAiMlVml_v1.TextChatFunctionCall;
export import TextChatMessages = WatsonxAiMlVml_v1.TextChatMessages;
export import TextChatParameterFunction = WatsonxAiMlVml_v1.TextChatParameterFunction;
export import TextChatParameterTools = WatsonxAiMlVml_v1.TextChatParameterTools;
export import TextChatResponse = WatsonxAiMlVml_v1.TextChatResponse;
export import TextChatStreamResponse = WatsonxAiMlVml_v1.TextChatStreamResponse;
export import TextChatResponseFormat = WatsonxAiMlVml_v1.TextChatResponseFormat;
export import TextChatResultChoice = WatsonxAiMlVml_v1.TextChatResultChoice;
export import TextChatStreamResultChoice = WatsonxAiMlVml_v1.TextChatStreamResultChoice;
export import TextChatResultMessage = WatsonxAiMlVml_v1.TextChatResultMessage;
export import TextChatResultDelta = WatsonxAiMlVml_v1.TextChatResultDelta;
export import TextChatResultChoiceStream = WatsonxAiMlVml_v1.TextChatResultChoiceStream;
export import TextChatStreamItem = WatsonxAiMlVml_v1.TextChatStreamItem;
export import TextChatToolCall = WatsonxAiMlVml_v1.TextChatToolCall;
export import TextChatToolChoiceTool = WatsonxAiMlVml_v1.TextChatToolChoiceTool;
export import TextChatToolFunction = WatsonxAiMlVml_v1.TextChatToolFunction;
export import TextChatUsage = WatsonxAiMlVml_v1.TextChatUsage;
export import TextChatUserContents = WatsonxAiMlVml_v1.TextChatUserContents;
export import TextChatUserImageURL = WatsonxAiMlVml_v1.TextChatUserImageURL;
export import TextExtractionDataReference = WatsonxAiMlVml_v1.TextExtractionDataReference;
export import TextExtractionMetadata = WatsonxAiMlVml_v1.TextExtractionMetadata;
export import TextExtractionResource = WatsonxAiMlVml_v1.TextExtractionResource;
export import TextExtractionResourceEntity = WatsonxAiMlVml_v1.TextExtractionResourceEntity;
export import TextExtractionResources = WatsonxAiMlVml_v1.TextExtractionResources;
export import TextExtractionResponse = WatsonxAiMlVml_v1.TextExtractionResponse;
export import TextExtractionResults = WatsonxAiMlVml_v1.TextExtractionResults;
export import ServiceError = WatsonxAiMlVml_v1.ServiceError;
export import TextExtractionStepOcr = WatsonxAiMlVml_v1.TextExtractionStepOcr;
export import TextExtractionStepTablesProcessing = WatsonxAiMlVml_v1.TextExtractionStepTablesProcessing;
export import TextExtractionSteps = WatsonxAiMlVml_v1.TextExtractionSteps;
export import TextGenLengthPenalty = WatsonxAiMlVml_v1.TextGenLengthPenalty;
export import TextGenParameters = WatsonxAiMlVml_v1.TextGenParameters;
export import TextGenResponse = WatsonxAiMlVml_v1.TextGenResponse;
export import TextGenResponseFieldsResultsItem = WatsonxAiMlVml_v1.TextGenResponseFieldsResultsItem;
export import TextGenTokenInfo = WatsonxAiMlVml_v1.TextGenTokenInfo;
export import TextGenTopTokenInfo = WatsonxAiMlVml_v1.TextGenTopTokenInfo;
export import TextModeration = WatsonxAiMlVml_v1.TextModeration;
export import TextModerationWithoutThreshold = WatsonxAiMlVml_v1.TextModerationWithoutThreshold;
export import TextTokenizeParameters = WatsonxAiMlVml_v1.TextTokenizeParameters;
export import TextTokenizeResponse = WatsonxAiMlVml_v1.TextTokenizeResponse;
export import TextTokenizeResult = WatsonxAiMlVml_v1.TextTokenizeResult;
export import TSForecastInputSchema = WatsonxAiMlVml_v1.TSForecastInputSchema;
export import TSForecastParameters = WatsonxAiMlVml_v1.TSForecastParameters;
export import TSForecastResponse = WatsonxAiMlVml_v1.TSForecastResponse;
export import TrainingAccumulatedSteps = WatsonxAiMlVml_v1.TrainingAccumulatedSteps;
export import TrainingBatchSize = WatsonxAiMlVml_v1.TrainingBatchSize;
export import TrainingInitMethod = WatsonxAiMlVml_v1.TrainingInitMethod;
export import TrainingInitText = WatsonxAiMlVml_v1.TrainingInitText;
export import TrainingLearningRate = WatsonxAiMlVml_v1.TrainingLearningRate;
export import TrainingMaxInputTokens = WatsonxAiMlVml_v1.TrainingMaxInputTokens;
export import TrainingMaxOutputTokens = WatsonxAiMlVml_v1.TrainingMaxOutputTokens;
export import TrainingMetric = WatsonxAiMlVml_v1.TrainingMetric;
export import TrainingNumEpochs = WatsonxAiMlVml_v1.TrainingNumEpochs;
export import TrainingNumVirtualTokens = WatsonxAiMlVml_v1.TrainingNumVirtualTokens;
export import TrainingParameters = WatsonxAiMlVml_v1.TrainingParameters;
export import TrainingResource = WatsonxAiMlVml_v1.TrainingResource;
export import TrainingResourceCollection = WatsonxAiMlVml_v1.TrainingResourceCollection;
export import TrainingResourceCollectionSystem = WatsonxAiMlVml_v1.TrainingResourceCollectionSystem;
export import TrainingResourceEntity = WatsonxAiMlVml_v1.TrainingResourceEntity;
export import TrainingStatus = WatsonxAiMlVml_v1.TrainingStatus;
export import TrainingTorchDtype = WatsonxAiMlVml_v1.TrainingTorchDtype;
export import TrainingVerbalizer = WatsonxAiMlVml_v1.TrainingVerbalizer;
export import Warning = WatsonxAiMlVml_v1.Warning;
export import WxPromptPatchModelVersion = WatsonxAiMlVml_v1.WxPromptPatchModelVersion;
export import WxPromptPostModelVersion = WatsonxAiMlVml_v1.WxPromptPostModelVersion;
export import WxPromptResponseModelVersion = WatsonxAiMlVml_v1.WxPromptResponseModelVersion;
export import WxPromptSessionEntryListResultsItem = WatsonxAiMlVml_v1.WxPromptSessionEntryListResultsItem;
export import ChatItem = WatsonxAiMlVml_v1.ChatItem;
export import ExternalInformation = WatsonxAiMlVml_v1.ExternalInformation;
export import Prompt = WatsonxAiMlVml_v1.Prompt;
export import PromptData = WatsonxAiMlVml_v1.PromptData;
export import PromptLock = WatsonxAiMlVml_v1.PromptLock;
export import PromptWithExternal = WatsonxAiMlVml_v1.PromptWithExternal;
export import UtilityAgentTool = WatsonxAiMlVml_v1.UtilityAgentTool;
export import WxPromptResponse = WatsonxAiMlVml_v1.WxPromptResponse;
export import CatalogSearchResponseAsset = WatsonxAiMlVml_v1.CatalogSearchResponseAsset;
export import ListPromptsResponse = WatsonxAiMlVml_v1.ListPromptsResponse;
export import WxPromptSession = WatsonxAiMlVml_v1.WxPromptSession;
export import WxPromptSessionEntry = WatsonxAiMlVml_v1.WxPromptSessionEntry;
export import WxPromptSessionEntryList = WatsonxAiMlVml_v1.WxPromptSessionEntryList;
export import WxUtilityAgentToolsResponse = WatsonxAiMlVml_v1.WxUtilityAgentToolsResponse;
export import WxUtilityAgentToolsRunRequest = WatsonxAiMlVml_v1.WxUtilityAgentToolsRunRequest;
export import WxUtilityAgentToolsRunResponse = WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse;
export import TextChatMessagesTextChatMessageAssistant = WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageAssistant;
export import TextChatMessagesTextChatMessageSystem = WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageSystem;
export import TextChatMessagesTextChatMessageTool = WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageTool;
export import TextChatMessagesTextChatMessageUser = WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageUser;
export import TextChatUserContentsTextChatUserImageURLContent = WatsonxAiMlVml_v1.TextChatUserContentsTextChatUserImageURLContent;
export import TextChatUserContentsTextChatUserTextContent = WatsonxAiMlVml_v1.TextChatUserContentsTextChatUserTextContent;
export import RequestParameters = WatsonxAiMlVml_v1.RequestParameters;
export import RequestParametersWithoutHeaders = WatsonxAiMlVml_v1.RequestParametersWithoutHeaders;
export import InvokeRequestCallback = WatsonxAiMlVml_v1.InvokeRequestCallback;
export import ReceiveResponseCallback = WatsonxAiMlVml_v1.ReceiveResponseCallback;
export import RequestCallbacks = WatsonxAiMlVml_v1.RequestCallbacks;
export import FineTuningEntity = WatsonxAiMlVml_v1.FineTuningEntity;
export import FineTuningParameters = WatsonxAiMlVml_v1.FineTuningParameters;
export import FineTuningPeftParameters = WatsonxAiMlVml_v1.FineTuningPeftParameters;
export import FineTuningResource = WatsonxAiMlVml_v1.FineTuningResource;
export import FineTuningResources = WatsonxAiMlVml_v1.FineTuningResources;
export import DocumentExtractionResource = WatsonxAiMlVml_v1.DocumentExtractionResource;
export import DocumentExtractionResources = WatsonxAiMlVml_v1.DocumentExtractionResources;
export import DocumentExtractionResponse = WatsonxAiMlVml_v1.DocumentExtractionResponse;
export import DocumentExtractionStatus = WatsonxAiMlVml_v1.DocumentExtractionStatus;
export import SyntheticDataGenerationContext = WatsonxAiMlVml_v1.SyntheticDataGenerationContext;
export import SyntheticDataGenerationDataReference = WatsonxAiMlVml_v1.SyntheticDataGenerationDataReference;
export import SyntheticDataGenerationLocations = WatsonxAiMlVml_v1.SyntheticDataGenerationLocations;
export import SyntheticDataGenerationMetric = WatsonxAiMlVml_v1.SyntheticDataGenerationMetric;
export import SyntheticDataGenerationMetrics = WatsonxAiMlVml_v1.SyntheticDataGenerationMetrics;
export import SyntheticDataGenerationResource = WatsonxAiMlVml_v1.SyntheticDataGenerationResource;
export import SyntheticDataGenerationResources = WatsonxAiMlVml_v1.SyntheticDataGenerationResources;
export import SyntheticDataGenerationResponse = WatsonxAiMlVml_v1.SyntheticDataGenerationResponse;
export import SyntheticDataGenerationSample = WatsonxAiMlVml_v1.SyntheticDataGenerationSample;
export import SyntheticDataGenerationStatus = WatsonxAiMlVml_v1.SyntheticDataGenerationStatus;
export import TaxonomyResource = WatsonxAiMlVml_v1.TaxonomyResource;
export import TaxonomyResources = WatsonxAiMlVml_v1.TaxonomyResources;
export import TaxonomyResponse = WatsonxAiMlVml_v1.TaxonomyResponse;
export import TaxonomyStatus = WatsonxAiMlVml_v1.TaxonomyStatus;
export import SoftwareSpecRel = WatsonxAiMlVml_v1.SoftwareSpecRel;
export import TrainingDetails = WatsonxAiMlVml_v1.TrainingDetails;
export import DataInput = WatsonxAiMlVml_v1.DataInput;
export import DataOutput = WatsonxAiMlVml_v1.DataOutput;
export import Metric = WatsonxAiMlVml_v1.Metric;
export import MetricTsMetrics = WatsonxAiMlVml_v1.MetricTsMetrics;
export import MetricTsadMetrics = WatsonxAiMlVml_v1.MetricTsadMetrics;
export import DataPreprocessingTransformation = WatsonxAiMlVml_v1.DataPreprocessingTransformation;
export import ModelResourceEntity = WatsonxAiMlVml_v1.ModelResourceEntity;
export import ModelResource = WatsonxAiMlVml_v1.ModelResource;
export import ModelEntityModelVersion = WatsonxAiMlVml_v1.ModelEntityModelVersion;
export import ModelEntitySchemas = WatsonxAiMlVml_v1.ModelEntitySchemas;
export import ModelEntitySize = WatsonxAiMlVml_v1.ModelEntitySize;
export import ContentInfo = WatsonxAiMlVml_v1.ContentInfo;
export import ContentLocation = WatsonxAiMlVml_v1.ContentLocation;
export import AudioTranscriptionResult = WatsonxAiMlVml_v1.AudioTranscriptionResult;
export import ModelResources = WatsonxAiMlVml_v1.ModelResources;
export import ModelDefinitionEntityPlatform = WatsonxAiMlVml_v1.ModelDefinitionEntityPlatform;
export import ModelDefinitionEntityRequestPlatform = WatsonxAiMlVml_v1.ModelDefinitionEntityRequestPlatform;
export import ModelDefinitionEntity = WatsonxAiMlVml_v1.ModelDefinitionEntity;
export import ModelDefinitionId = WatsonxAiMlVml_v1.ModelDefinitionId;
export import ModelDefinitionRel = WatsonxAiMlVml_v1.ModelDefinitionRel;
export import GPU = WatsonxAiMlVml_v1.GPU;
export import DocumentExtractionObjectLocation = WatsonxAiMlVml_v1.DocumentExtractionObjectLocation;
export import ObjectLocationGithub = WatsonxAiMlVml_v1.ObjectLocationGithub;
export import ErrorResponse = WatsonxAiMlVml_v1.ErrorResponse;
export import SpaceResource = WatsonxAiMlVml_v1.SpaceResource;
export import SpaceResources = WatsonxAiMlVml_v1.SpaceResources;
export import FoundationModelSpecsPager = WatsonxAiMlVml_v1.FoundationModelSpecsPager;
export import FoundationModelTasksPager = WatsonxAiMlVml_v1.FoundationModelTasksPager;
export import TextExtractionsPager = WatsonxAiMlVml_v1.TextExtractionsPager;
export import TrainingsListPager = WatsonxAiMlVml_v1.TrainingsListPager;
export import FineTuningListPager = WatsonxAiMlVml_v1.FineTuningListPager;
export import ModelsListPager = WatsonxAiMlVml_v1.ModelsListPager;
export import ListPromptsPager = WatsonxAiMlVml_v1.ListPromptsPager;
export import ListSpacesPager = WatsonxAiMlVml_v1.ListSpacesPager;
export import ObjectStreamed = WatsonxAiMlVml_v1.ObjectStreamed;
export import CallbackHandler = WatsonxAiMlVml_v1.CallbackHandler;
