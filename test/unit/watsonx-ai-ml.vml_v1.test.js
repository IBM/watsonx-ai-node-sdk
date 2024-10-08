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

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jest/no-focused-tests */

const nock = require('nock');
const sdkCorePackage = require('ibm-cloud-sdk-core');
const {
  StreamTransform,
  ObjectTransformStream,
  LineTransformStream,
} = require('../../dist/lib/common');
// need to import the whole package to mock getAuthenticatorFromEnvironment
const get_authenticator_from_environment = require('../../dist/auth/utils/get-authenticator-from-environment');

const { NoAuthAuthenticator, unitTestUtils } = sdkCorePackage;
const WatsonxAiMlVml_v1 = require('../../dist/watsonx-ai-ml/vml_v1');

const {
  getOptions,
  checkUrlAndMethod,
  checkMediaHeaders,
  expectToBePromise,
  checkForSuccessfulExecution,
} = unitTestUtils;

const watsonxAiMlServiceOptions = {
  authenticator: new NoAuthAuthenticator(),
  url: 'https://us-south.ml.cloud.ibm.com',
  version: '2023-07-07',
};

const stream = new StreamTransform({
  read() {
    this.push('test');
  },
});

const watsonxAiMlService = new WatsonxAiMlVml_v1(watsonxAiMlServiceOptions);

let createRequestMock = null;
function mock_createRequest() {
  if (!createRequestMock) {
    createRequestMock = jest.spyOn(watsonxAiMlService, 'createRequest');
    createRequestMock.mockImplementation(() => Promise.resolve());
  }
}
function unmock_createRequest() {
  if (createRequestMock) {
    createRequestMock.mockRestore();
    createRequestMock = null;
  }
}

// dont actually construct an authenticator
const getAuthenticatorMock = jest.spyOn(
  get_authenticator_from_environment,
  'getAuthenticatorFromEnvironment'
);
getAuthenticatorMock.mockImplementation(() => new NoAuthAuthenticator());

// used for the service construction tests
let requiredGlobals;

describe('WatsonxAiMlVml_v1', () => {
  beforeEach(() => {
    mock_createRequest();
    // these are changed when passed into the factory/constructor, so re-init
    requiredGlobals = {
      version: '2023-07-07',
    };
  });

  afterEach(() => {
    if (createRequestMock) {
      createRequestMock.mockClear();
    }
    getAuthenticatorMock.mockClear();
  });

  describe('the newInstance method', () => {
    test('should use defaults when options not provided', () => {
      const testInstance = WatsonxAiMlVml_v1.newInstance(requiredGlobals);

      expect(getAuthenticatorMock).toHaveBeenCalled();
      expect(testInstance.baseOptions.authenticator).toBeInstanceOf(NoAuthAuthenticator);
      expect(testInstance.baseOptions.serviceName).toBe(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME);
      expect(testInstance.baseOptions.serviceUrl).toBe(WatsonxAiMlVml_v1.DEFAULT_SERVICE_URL);
      expect(testInstance).toBeInstanceOf(WatsonxAiMlVml_v1);
    });

    test('should set serviceName, serviceUrl, and authenticator when provided', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
        serviceUrl: 'custom.com',
        serviceName: 'my-service',
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = WatsonxAiMlVml_v1.newInstance(options);

      expect(getAuthenticatorMock).not.toHaveBeenCalled();
      expect(testInstance.baseOptions.authenticator).toBeInstanceOf(NoAuthAuthenticator);
      expect(testInstance.baseOptions.serviceUrl).toBe('custom.com');
      expect(testInstance.baseOptions.serviceName).toBe('my-service');
      expect(testInstance).toBeInstanceOf(WatsonxAiMlVml_v1);
    });
  });

  describe('the constructor', () => {
    test('use user-given service url', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
        serviceUrl: 'custom.com',
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = new WatsonxAiMlVml_v1(options);

      expect(testInstance.baseOptions.serviceUrl).toBe('custom.com');
    });

    test('use default service url', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = new WatsonxAiMlVml_v1(options);

      expect(testInstance.baseOptions.serviceUrl).toBe(WatsonxAiMlVml_v1.DEFAULT_SERVICE_URL);
    });
  });

  describe('service-level tests', () => {
    describe('positive tests', () => {
      test('construct service with global params', () => {
        const serviceObj = new WatsonxAiMlVml_v1(watsonxAiMlServiceOptions);
        expect(serviceObj).not.toBeNull();
        expect(serviceObj.version).toEqual(watsonxAiMlServiceOptions.version);
      });
    });
  });

  describe('constructServiceUrl', () => {
    describe('positive tests', () => {
      test('should use all default variable values if null is passed', () => {
        const defaultFormattedUrl = 'https://us-south.ml.cloud.ibm.com';
        const formattedUrl = WatsonxAiMlVml_v1.constructServiceUrl(null);

        expect(formattedUrl).toStrictEqual(defaultFormattedUrl);
      });
    });

    describe('negative tests', () => {
      test('should fail if an invalid variable name is provided', () => {
        expect(() => {
          const providedUrlVariables = new Map([['invalid_variable_name', 'value']]);
          WatsonxAiMlVml_v1.constructServiceUrl(providedUrlVariables);
        }).toThrow();
      });
    });
  });

  describe('createDeployment', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // OnlineDeploymentParameters
      const onlineDeploymentParametersModel = {
        serving_name: 'churn',
        foo: 'testString',
      };

      // OnlineDeployment
      const onlineDeploymentModel = {
        parameters: onlineDeploymentParametersModel,
      };

      // SimpleRel
      const simpleRelModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
      };

      // HardwareSpec
      const hardwareSpecModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        rev: '2',
        name: 'testString',
        num_nodes: 2,
      };

      // HardwareRequest
      const hardwareRequestModel = {
        size: 'gpu_s',
        num_nodes: 72.5,
      };

      // Rel
      const relModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        rev: '2',
      };

      function __createDeploymentTest() {
        // Construct the params object for operation createDeployment
        const name = 'text_classification';
        const online = onlineDeploymentModel;
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = 'testString';
        const description = 'testString';
        const tags = ['testString'];
        const custom = { anyKey: 'anyValue' };
        const promptTemplate = simpleRelModel;
        const hardwareSpec = hardwareSpecModel;
        const hardwareRequest = hardwareRequestModel;
        const asset = relModel;
        const baseModelId = 'testString';
        const createDeploymentParams = {
          name,
          online,
          projectId,
          spaceId,
          description,
          tags,
          custom,
          promptTemplate,
          hardwareSpec,
          hardwareRequest,
          asset,
          baseModelId,
        };

        const createDeploymentResult = watsonxAiMlService.createDeployment(createDeploymentParams);

        // all methods should return a Promise
        expectToBePromise(createDeploymentResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/deployments', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.online).toEqual(online);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.tags).toEqual(tags);
        expect(mockRequestOptions.body.custom).toEqual(custom);
        expect(mockRequestOptions.body.prompt_template).toEqual(promptTemplate);
        expect(mockRequestOptions.body.hardware_spec).toEqual(hardwareSpec);
        expect(mockRequestOptions.body.hardware_request).toEqual(hardwareRequest);
        expect(mockRequestOptions.body.asset).toEqual(asset);
        expect(mockRequestOptions.body.base_model_id).toEqual(baseModelId);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createDeploymentTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createDeploymentTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createDeploymentTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'text_classification';
        const online = onlineDeploymentModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createDeploymentParams = {
          name,
          online,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createDeployment(createDeploymentParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createDeployment({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createDeployment();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listDeployments', () => {
    describe('positive tests', () => {
      function __listDeploymentsTest() {
        // Construct the params object for operation listDeployments
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const servingName = 'classification';
        const tagValue = 'testString';
        const assetId = 'testString';
        const promptTemplateId = 'testString';
        const name = 'testString';
        const type = 'testString';
        const state = 'testString';
        const conflict = false;
        const listDeploymentsParams = {
          spaceId,
          projectId,
          servingName,
          tagValue,
          assetId,
          promptTemplateId,
          name,
          type,
          state,
          conflict,
        };

        const listDeploymentsResult = watsonxAiMlService.listDeployments(listDeploymentsParams);

        // all methods should return a Promise
        expectToBePromise(listDeploymentsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/deployments', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.serving_name).toEqual(servingName);
        expect(mockRequestOptions.qs['tag.value']).toEqual(tagValue);
        expect(mockRequestOptions.qs.asset_id).toEqual(assetId);
        expect(mockRequestOptions.qs.prompt_template_id).toEqual(promptTemplateId);
        expect(mockRequestOptions.qs.name).toEqual(name);
        expect(mockRequestOptions.qs.type).toEqual(type);
        expect(mockRequestOptions.qs.state).toEqual(state);
        expect(mockRequestOptions.qs.conflict).toEqual(conflict);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listDeploymentsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listDeploymentsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listDeploymentsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listDeploymentsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listDeployments(listDeploymentsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listDeployments({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });
  });

  describe('getDeployment', () => {
    describe('positive tests', () => {
      function __getDeploymentTest() {
        // Construct the params object for operation getDeployment
        const deploymentId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const getDeploymentParams = {
          deploymentId,
          spaceId,
          projectId,
        };

        const getDeploymentResult = watsonxAiMlService.getDeployment(getDeploymentParams);

        // all methods should return a Promise
        expectToBePromise(getDeploymentResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/deployments/{deployment_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.deployment_id).toEqual(deploymentId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getDeploymentTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getDeploymentTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getDeploymentTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getDeploymentParams = {
          deploymentId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getDeployment(getDeploymentParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getDeployment({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getDeployment();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('updateDeployment', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // JsonPatchOperation
      const jsonPatchOperationModel = {
        op: 'add',
        path: 'testString',
        from: 'testString',
        value: 'testString',
      };

      function __updateDeploymentTest() {
        // Construct the params object for operation updateDeployment
        const deploymentId = 'testString';
        const jsonPatch = [jsonPatchOperationModel];
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const updateDeploymentParams = {
          deploymentId,
          jsonPatch,
          spaceId,
          projectId,
        };

        const updateDeploymentResult = watsonxAiMlService.updateDeployment(updateDeploymentParams);

        // all methods should return a Promise
        expectToBePromise(updateDeploymentResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/deployments/{deployment_id}', 'PATCH');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json-patch+json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body).toEqual(jsonPatch);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.deployment_id).toEqual(deploymentId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __updateDeploymentTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __updateDeploymentTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __updateDeploymentTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const jsonPatch = [jsonPatchOperationModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const updateDeploymentParams = {
          deploymentId,
          jsonPatch,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.updateDeployment(updateDeploymentParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.updateDeployment({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.updateDeployment();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteDeployment', () => {
    describe('positive tests', () => {
      function __deleteDeploymentTest() {
        // Construct the params object for operation deleteDeployment
        const deploymentId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const deleteDeploymentParams = {
          deploymentId,
          spaceId,
          projectId,
        };

        const deleteDeploymentResult = watsonxAiMlService.deleteDeployment(deleteDeploymentParams);

        // all methods should return a Promise
        expectToBePromise(deleteDeploymentResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/deployments/{deployment_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.deployment_id).toEqual(deploymentId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deleteDeploymentTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deleteDeploymentTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deleteDeploymentTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deleteDeploymentParams = {
          deploymentId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteDeployment(deleteDeploymentParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteDeployment({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteDeployment();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentGenerateText', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextGenLengthPenalty
      const textGenLengthPenaltyModel = {
        decay_factor: 2.5,
        start_index: 5,
      };

      // ReturnOptionProperties
      const returnOptionPropertiesModel = {
        input_text: true,
        generated_tokens: true,
        input_tokens: true,
        token_logprobs: true,
        token_ranks: true,
        top_n_tokens: 2,
      };

      // DeploymentTextGenProperties
      const deploymentTextGenPropertiesModel = {
        decoding_method: 'greedy',
        length_penalty: textGenLengthPenaltyModel,
        max_new_tokens: 100,
        min_new_tokens: 5,
        random_seed: 1,
        stop_sequences: ['fail'],
        temperature: 1.5,
        time_limit: 600000,
        top_k: 50,
        top_p: 0.5,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        typical_p: 0.5,
        prompt_variables: { 'key1': 'testString' },
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
        foo: 'testString',
      };

      // MaskProperties
      const maskPropertiesModel = {
        remove_entity_value: false,
      };

      // ModerationHapProperties
      const moderationHapPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // TextModerationWithoutThreshold
      const textModerationWithoutThresholdModel = {
        enabled: true,
        foo: 'testString',
      };

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationWithoutThresholdModel,
        output: textModerationWithoutThresholdModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // ModerationTextRange
      const moderationTextRangeModel = {
        start: 0,
        end: 0,
      };

      // ModerationProperties
      const moderationPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        foo: 'testString',
      };

      // Moderations
      const moderationsModel = {
        hap: moderationHapPropertiesModel,
        pii: moderationPiiPropertiesModel,
        input_ranges: [moderationTextRangeModel],
        foo: moderationPropertiesModel,
      };

      function __deploymentGenerateTextTest() {
        // Construct the params object for operation deploymentGenerateText
        const idOrName = 'classification';
        const input = 'how far is paris from bangalore:\n';
        const parameters = deploymentTextGenPropertiesModel;
        const moderations = moderationsModel;
        const deploymentGenerateTextParams = {
          idOrName,
          input,
          parameters,
          moderations,
        };

        const deploymentGenerateTextResult = watsonxAiMlService.deploymentGenerateText(
          deploymentGenerateTextParams
        );

        // all methods should return a Promise
        expectToBePromise(deploymentGenerateTextResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/ml/v1/deployments/{id_or_name}/text/generation',
          'POST'
        );
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.moderations).toEqual(moderations);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.path.id_or_name).toEqual(idOrName);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deploymentGenerateTextTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentGenerateTextTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentGenerateTextTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'classification';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentGenerateTextParams = {
          idOrName,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentGenerateText(deploymentGenerateTextParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentGenerateText({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentGenerateText();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentGenerateTextStream', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextGenLengthPenalty
      const textGenLengthPenaltyModel = {
        decay_factor: 2.5,
        start_index: 5,
      };

      // ReturnOptionProperties
      const returnOptionPropertiesModel = {
        input_text: true,
        generated_tokens: true,
        input_tokens: true,
        token_logprobs: true,
        token_ranks: true,
        top_n_tokens: 2,
      };

      // DeploymentTextGenProperties
      const deploymentTextGenPropertiesModel = {
        decoding_method: 'greedy',
        length_penalty: textGenLengthPenaltyModel,
        max_new_tokens: 30,
        min_new_tokens: 5,
        random_seed: 1,
        stop_sequences: ['fail'],
        temperature: 1.5,
        time_limit: 600000,
        top_k: 50,
        top_p: 0.5,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        typical_p: 0.5,
        prompt_variables: { 'key1': 'testString' },
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
        foo: 'testString',
      };

      // MaskProperties
      const maskPropertiesModel = {
        remove_entity_value: false,
      };

      // ModerationHapProperties
      const moderationHapPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // TextModerationWithoutThreshold
      const textModerationWithoutThresholdModel = {
        enabled: true,
        foo: 'testString',
      };

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationWithoutThresholdModel,
        output: textModerationWithoutThresholdModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // ModerationTextRange
      const moderationTextRangeModel = {
        start: 0,
        end: 0,
      };

      // ModerationProperties
      const moderationPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        foo: 'testString',
      };

      // Moderations
      const moderationsModel = {
        hap: moderationHapPropertiesModel,
        pii: moderationPiiPropertiesModel,
        input_ranges: [moderationTextRangeModel],
        foo: moderationPropertiesModel,
      };

      function __deploymentGenerateTextStreamTest() {
        // Construct the params object for operation deploymentGenerateTextStream
        const idOrName = 'classification';
        const input = 'testString';
        const parameters = deploymentTextGenPropertiesModel;
        const moderations = moderationsModel;
        const accept = 'text/event-stream';
        const deploymentGenerateTextStreamParams = {
          idOrName,
          input,
          parameters,
          moderations,
        };
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        const deploymentGenerateTextStreamResult = watsonxAiMlService.deploymentGenerateTextStream(
          deploymentGenerateTextStreamParams
        );

        // all methods should return a Promise
        expectToBePromise(deploymentGenerateTextStreamResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/ml/v1/deployments/{id_or_name}/text/generation_stream',
          'POST'
        );
        const expectedAccept = accept;
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.moderations).toEqual(moderations);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.path.id_or_name).toEqual(idOrName);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deploymentGenerateTextStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));

        watsonxAiMlService.enableRetries();
        __deploymentGenerateTextStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));

        watsonxAiMlService.disableRetries();
        __deploymentGenerateTextStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'classification';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentGenerateTextStreamParams = {
          idOrName,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentGenerateTextStream(deploymentGenerateTextStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentGenerateTextStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentGenerateTextStream();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listFoundationModelSpecs', () => {
    describe('positive tests', () => {
      function __listFoundationModelSpecsTest() {
        // Construct the params object for operation listFoundationModelSpecs
        const start = 'testString';
        const limit = 50;
        const filters = 'modelid_ibm/granite-13b-instruct-v2';
        const techPreview = false;
        const listFoundationModelSpecsParams = {
          start,
          limit,
          filters,
          techPreview,
        };

        const listFoundationModelSpecsResult = watsonxAiMlService.listFoundationModelSpecs(
          listFoundationModelSpecsParams
        );

        // all methods should return a Promise
        expectToBePromise(listFoundationModelSpecsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/foundation_model_specs', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
        expect(mockRequestOptions.qs.filters).toEqual(filters);
        expect(mockRequestOptions.qs.tech_preview).toEqual(techPreview);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listFoundationModelSpecsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listFoundationModelSpecsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listFoundationModelSpecsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listFoundationModelSpecsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listFoundationModelSpecs(listFoundationModelSpecsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listFoundationModelSpecs({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('FoundationModelSpecsPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v1/foundation_model_specs';
      const mockPagerResponse1 =
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"model_id":"google/flan-ul2","label":"flan-ul2 (20B)","provider":"Hugging Face","tuned_by":"tuned_by","short_description":"An encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net.","long_description":"flan-ul2 (20B) is an encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net (FLAN).","limits":{"lite":{"call_time":"3S","max_input_tokens":200,"max_output_tokens":1000}},"task_ids":["task_ids"],"tasks":[{"id":"summarization","ratings":{"cost":2,"quality":3},"benchmarks":[{"type":"academic","description":"MultiLingual Summarization dataset with 1.5M+ article/summary pairs across five languages. Evaluated using rougeL with 5 shots.","language":"German","dataset":{"name":"mlsum.de"},"prompt":{"number_of_shots":5},"metrics":[{"name":"rougeL","value":0.5197}]}],"tags":["tags"]}],"input_tier":"class_1","output_tier":"class_1","source":"Hugging Face","min_shot_size":10,"number_params":"20b","model_limits":{"max_sequence_length":4096,"training_data_max_records":1024},"lifecycle":[{"id":"available","label":"label","start_date":"2023-07-23","alternative_model_ids":["alternative_model_ids"],"url":"url"}],"training_parameters":{"init_method":{"supported":["supported"],"default":"random"},"init_text":{"default":"text"},"num_virtual_tokens":{"supported":[9],"default":100},"num_epochs":{"default":20,"min":1,"max":50},"verbalizer":{"default":"Input: {{input}} Output:"},"batch_size":{"default":16,"min":1,"max":16},"max_input_tokens":{"default":256,"min":1,"max":1024},"max_output_tokens":{"default":128,"min":1,"max":256},"torch_dtype":{"default":"bfloat16"},"accumulate_steps":{"default":128,"min":1,"max":128},"learning_rate":{"default":0.3,"min":0.01,"max":0.5}},"versions":[{"version":"1.1.0","available_date":"2023-08-23"}],"tech_preview":false}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"model_id":"google/flan-ul2","label":"flan-ul2 (20B)","provider":"Hugging Face","tuned_by":"tuned_by","short_description":"An encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net.","long_description":"flan-ul2 (20B) is an encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net (FLAN).","limits":{"lite":{"call_time":"3S","max_input_tokens":200,"max_output_tokens":1000}},"task_ids":["task_ids"],"tasks":[{"id":"summarization","ratings":{"cost":2,"quality":3},"benchmarks":[{"type":"academic","description":"MultiLingual Summarization dataset with 1.5M+ article/summary pairs across five languages. Evaluated using rougeL with 5 shots.","language":"German","dataset":{"name":"mlsum.de"},"prompt":{"number_of_shots":5},"metrics":[{"name":"rougeL","value":0.5197}]}],"tags":["tags"]}],"input_tier":"class_1","output_tier":"class_1","source":"Hugging Face","min_shot_size":10,"number_params":"20b","model_limits":{"max_sequence_length":4096,"training_data_max_records":1024},"lifecycle":[{"id":"available","label":"label","start_date":"2023-07-23","alternative_model_ids":["alternative_model_ids"],"url":"url"}],"training_parameters":{"init_method":{"supported":["supported"],"default":"random"},"init_text":{"default":"text"},"num_virtual_tokens":{"supported":[9],"default":100},"num_epochs":{"default":20,"min":1,"max":50},"verbalizer":{"default":"Input: {{input}} Output:"},"batch_size":{"default":16,"min":1,"max":16},"max_input_tokens":{"default":256,"min":1,"max":1024},"max_output_tokens":{"default":128,"min":1,"max":256},"torch_dtype":{"default":"bfloat16"},"accumulate_steps":{"default":128,"min":1,"max":128},"learning_rate":{"default":0.3,"min":0.01,"max":0.5}},"versions":[{"version":"1.1.0","available_date":"2023-08-23"}],"tech_preview":false}]}';

      beforeEach(() => {
        unmock_createRequest();
        const scope = nock(serviceUrl)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse1)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse2);
      });

      afterEach(() => {
        nock.cleanAll();
        mock_createRequest();
      });

      test('getNext()', async () => {
        const params = {
          limit: 50,
          filters: 'modelid_ibm/granite-13b-instruct-v2',
          techPreview: false,
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.FoundationModelSpecsPager(watsonxAiMlService, params);
        while (pager.hasNext()) {
          const nextPage = await pager.getNext();
          expect(nextPage).not.toBeNull();
          allResults.push(...nextPage);
        }
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });

      test('getAll()', async () => {
        const params = {
          limit: 50,
          filters: 'modelid_ibm/granite-13b-instruct-v2',
          techPreview: false,
        };
        const pager = new WatsonxAiMlVml_v1.FoundationModelSpecsPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('listFoundationModelTasks', () => {
    describe('positive tests', () => {
      function __listFoundationModelTasksTest() {
        // Construct the params object for operation listFoundationModelTasks
        const start = 'testString';
        const limit = 50;
        const listFoundationModelTasksParams = {
          start,
          limit,
        };

        const listFoundationModelTasksResult = watsonxAiMlService.listFoundationModelTasks(
          listFoundationModelTasksParams
        );

        // all methods should return a Promise
        expectToBePromise(listFoundationModelTasksResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/foundation_model_tasks', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listFoundationModelTasksTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listFoundationModelTasksTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listFoundationModelTasksTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listFoundationModelTasksParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listFoundationModelTasks(listFoundationModelTasksParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listFoundationModelTasks({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('FoundationModelTasksPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v1/foundation_model_tasks';
      const mockPagerResponse1 =
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"task_id":"summarization","label":"Summarization","description":"Models that are able to summarize documents based on some criteria.","rank":1}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"task_id":"summarization","label":"Summarization","description":"Models that are able to summarize documents based on some criteria.","rank":1}]}';

      beforeEach(() => {
        unmock_createRequest();
        const scope = nock(serviceUrl)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse1)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse2);
      });

      afterEach(() => {
        nock.cleanAll();
        mock_createRequest();
      });

      test('getNext()', async () => {
        const params = {
          limit: 50,
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.FoundationModelTasksPager(watsonxAiMlService, params);
        while (pager.hasNext()) {
          const nextPage = await pager.getNext();
          expect(nextPage).not.toBeNull();
          allResults.push(...nextPage);
        }
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });

      test('getAll()', async () => {
        const params = {
          limit: 50,
        };
        const pager = new WatsonxAiMlVml_v1.FoundationModelTasksPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('createPrompt', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // PromptWithExternalModelParameters
      const promptWithExternalModelParametersModel = {
        decoding_method: 'testString',
        max_new_tokens: 38,
        min_new_tokens: 38,
        random_seed: 38,
        stop_sequences: ['testString'],
        temperature: 72.5,
        top_k: 72.5,
        top_p: 72.5,
        repetition_penalty: 72.5,
      };

      // PromptData
      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
        examples: [],
      };

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      // ExternalPromptAdditionalInformationItem
      const externalPromptAdditionalInformationItemModel = {
        key: 'testString',
      };

      // ExternalInformationExternalPrompt
      const externalInformationExternalPromptModel = {
        url: 'testString',
        additional_information: [[externalPromptAdditionalInformationItemModel]],
      };

      // ExternalInformationExternalModel
      const externalInformationExternalModelModel = {
        name: 'testString',
        url: 'testString',
      };

      // ExternalInformation
      const externalInformationModel = {
        external_prompt_id: 'testString',
        external_model_id: 'testString',
        external_model_provider: 'testString',
        external_prompt: externalInformationExternalPromptModel,
        external_model: externalInformationExternalModelModel,
      };

      // PromptWithExternal
      const promptWithExternalModel = {
        input: [],
        model_id: 'ibm/granite-13b-chat-v2',
        model_parameters: promptWithExternalModelParametersModel,
        data: promptDataModel,
        system_prompt: 'testString',
        chat_items: [chatItemModel],
        external_information: externalInformationModel,
      };

      // PromptLock
      const promptLockModel = {
        locked: true,
        lock_type: 'edit',
        locked_by: 'IBMid-000000YYY0',
      };

      // WxPromptPostModelVersion
      const wxPromptPostModelVersionModel = {
        number: '2.0.0-rc.7',
        tag: 'tag',
        description: 'Description of the model version.',
      };

      function __createPromptTest() {
        // Construct the params object for operation createPrompt
        const name = 'My Prompt';
        const prompt = promptWithExternalModel;
        const description = 'My First Prompt';
        const createdAt = 1711504485261;
        const taskIds = ['testString'];
        const lock = promptLockModel;
        const modelVersion = wxPromptPostModelVersionModel;
        const promptVariables = { 'key1': { anyKey: 'anyValue' } };
        const inputMode = 'structured';
        const projectId = 'testString';
        const spaceId = 'testString';
        const createPromptParams = {
          name,
          prompt,
          description,
          createdAt,
          taskIds,
          lock,
          modelVersion,
          promptVariables,
          inputMode,
          projectId,
          spaceId,
        };

        const createPromptResult = watsonxAiMlService.createPrompt(createPromptParams);

        // all methods should return a Promise
        expectToBePromise(createPromptResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.prompt).toEqual(prompt);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.created_at).toEqual(createdAt);
        expect(mockRequestOptions.body.task_ids).toEqual(taskIds);
        expect(mockRequestOptions.body.lock).toEqual(lock);
        expect(mockRequestOptions.body.model_version).toEqual(modelVersion);
        expect(mockRequestOptions.body.prompt_variables).toEqual(promptVariables);
        expect(mockRequestOptions.body.input_mode).toEqual(inputMode);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createPromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createPromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createPromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'My Prompt';
        const prompt = promptWithExternalModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createPromptParams = {
          name,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createPrompt(createPromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createPrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createPrompt();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPrompt', () => {
    describe('positive tests', () => {
      function __getPromptTest() {
        // Construct the params object for operation getPrompt
        const promptId = 'testString';
        const projectId = 'testString';
        const spaceId = 'testString';
        const restrictModelParameters = 'true';
        const getPromptParams = {
          promptId,
          projectId,
          spaceId,
          restrictModelParameters,
        };

        const getPromptResult = watsonxAiMlService.getPrompt(getPromptParams);

        // all methods should return a Promise
        expectToBePromise(getPromptResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.restrict_model_parameters).toEqual(restrictModelParameters);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptParams = {
          promptId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPrompt(getPromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPrompt();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('updatePrompt', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // PromptModelParameters
      const promptModelParametersModel = {
        decoding_method: 'testString',
        max_new_tokens: 38,
        min_new_tokens: 38,
        random_seed: 38,
        stop_sequences: ['testString'],
        temperature: 72.5,
        top_k: 72.5,
        top_p: 72.5,
        repetition_penalty: 72.5,
      };

      // PromptData
      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
        examples: [],
      };

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      // Prompt
      const promptModel = {
        input: [],
        model_id: 'ibm/granite-13b-chat-v2',
        model_parameters: promptModelParametersModel,
        data: promptDataModel,
        system_prompt: 'testString',
        chat_items: [chatItemModel],
      };

      // WxPromptPatchModelVersion
      const wxPromptPatchModelVersionModel = {
        number: '2.0.0-rc.7',
        tag: 'tag',
        description: 'Description of the model version.',
      };

      function __updatePromptTest() {
        // Construct the params object for operation updatePrompt
        const promptId = 'testString';
        const name = 'My Prompt';
        const prompt = promptModel;
        const id = '1c29d9a1-9ba6-422d-aa39-517b26adc147';
        const description = 'My First Prompt';
        const taskIds = ['generation'];
        const governanceTracked = true;
        const modelVersion = wxPromptPatchModelVersionModel;
        const promptVariables = { 'key1': { anyKey: 'anyValue' } };
        const inputMode = 'structured';
        const projectId = 'testString';
        const spaceId = 'testString';
        const updatePromptParams = {
          promptId,
          name,
          prompt,
          id,
          description,
          taskIds,
          governanceTracked,
          modelVersion,
          promptVariables,
          inputMode,
          projectId,
          spaceId,
        };

        const updatePromptResult = watsonxAiMlService.updatePrompt(updatePromptParams);

        // all methods should return a Promise
        expectToBePromise(updatePromptResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}', 'PATCH');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.prompt).toEqual(prompt);
        expect(mockRequestOptions.body.id).toEqual(id);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.task_ids).toEqual(taskIds);
        expect(mockRequestOptions.body.governance_tracked).toEqual(governanceTracked);
        expect(mockRequestOptions.body.model_version).toEqual(modelVersion);
        expect(mockRequestOptions.body.prompt_variables).toEqual(promptVariables);
        expect(mockRequestOptions.body.input_mode).toEqual(inputMode);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __updatePromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __updatePromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __updatePromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const name = 'My Prompt';
        const prompt = promptModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const updatePromptParams = {
          promptId,
          name,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.updatePrompt(updatePromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePrompt();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deletePrompt', () => {
    describe('positive tests', () => {
      function __deletePromptTest() {
        // Construct the params object for operation deletePrompt
        const promptId = 'testString';
        const projectId = 'testString';
        const spaceId = 'testString';
        const deletePromptParams = {
          promptId,
          projectId,
          spaceId,
        };

        const deletePromptResult = watsonxAiMlService.deletePrompt(deletePromptParams);

        // all methods should return a Promise
        expectToBePromise(deletePromptResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deletePromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deletePromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deletePromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deletePromptParams = {
          promptId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deletePrompt(deletePromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePrompt();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('updatePromptLock', () => {
    describe('positive tests', () => {
      function __updatePromptLockTest() {
        // Construct the params object for operation updatePromptLock
        const promptId = 'testString';
        const locked = true;
        const lockType = 'edit';
        const lockedBy = 'IBMid-000000YYY0';
        const projectId = 'testString';
        const spaceId = 'testString';
        const force = true;
        const updatePromptLockParams = {
          promptId,
          locked,
          lockType,
          lockedBy,
          projectId,
          spaceId,
          force,
        };

        const updatePromptLockResult = watsonxAiMlService.updatePromptLock(updatePromptLockParams);

        // all methods should return a Promise
        expectToBePromise(updatePromptLockResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}/lock', 'PUT');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.locked).toEqual(locked);
        expect(mockRequestOptions.body.lock_type).toEqual(lockType);
        expect(mockRequestOptions.body.locked_by).toEqual(lockedBy);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.force).toEqual(force);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __updatePromptLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __updatePromptLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __updatePromptLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const locked = true;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const updatePromptLockParams = {
          promptId,
          locked,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.updatePromptLock(updatePromptLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptLock();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptLock', () => {
    describe('positive tests', () => {
      function __getPromptLockTest() {
        // Construct the params object for operation getPromptLock
        const promptId = 'testString';
        const spaceId = 'testString';
        const projectId = 'testString';
        const getPromptLockParams = {
          promptId,
          spaceId,
          projectId,
        };

        const getPromptLockResult = watsonxAiMlService.getPromptLock(getPromptLockParams);

        // all methods should return a Promise
        expectToBePromise(getPromptLockResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}/lock', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptLockParams = {
          promptId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptLock(getPromptLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptLock();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptInput', () => {
    describe('positive tests', () => {
      function __getPromptInputTest() {
        // Construct the params object for operation getPromptInput
        const promptId = 'testString';
        const input = 'Some text with variables.';
        const promptVariables = { 'key1': 'var1' };
        const spaceId = 'testString';
        const projectId = 'testString';
        const getPromptInputParams = {
          promptId,
          input,
          promptVariables,
          spaceId,
          projectId,
        };

        const getPromptInputResult = watsonxAiMlService.getPromptInput(getPromptInputParams);

        // all methods should return a Promise
        expectToBePromise(getPromptInputResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}/input', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.prompt_variables).toEqual(promptVariables);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptInputTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptInputTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptInputTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptInputParams = {
          promptId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptInput(getPromptInputParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptInput({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptInput();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createPromptChatItem', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      function __createPromptChatItemTest() {
        // Construct the params object for operation createPromptChatItem
        const promptId = 'testString';
        const chatItem = [chatItemModel];
        const spaceId = 'testString';
        const projectId = 'testString';
        const createPromptChatItemParams = {
          promptId,
          chatItem,
          spaceId,
          projectId,
        };

        const createPromptChatItemResult = watsonxAiMlService.createPromptChatItem(
          createPromptChatItemParams
        );

        // all methods should return a Promise
        expectToBePromise(createPromptChatItemResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompts/{prompt_id}/chat_items', 'POST');
        const expectedAccept = undefined;
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body).toEqual(chatItem);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createPromptChatItemTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createPromptChatItemTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createPromptChatItemTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const chatItem = [chatItemModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createPromptChatItemParams = {
          promptId,
          chatItem,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createPromptChatItem(createPromptChatItemParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptChatItem({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptChatItem();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createPromptSession', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // PromptLock
      const promptLockModel = {
        locked: true,
        lock_type: 'edit',
        locked_by: 'IBMid-000000YYY0',
      };

      // PromptModelParameters
      const promptModelParametersModel = {
        decoding_method: 'testString',
        max_new_tokens: 38,
        min_new_tokens: 38,
        random_seed: 38,
        stop_sequences: ['testString'],
        temperature: 72.5,
        top_k: 72.5,
        top_p: 72.5,
        repetition_penalty: 72.5,
      };

      // PromptData
      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
        examples: [],
      };

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      // Prompt
      const promptModel = {
        input: [],
        model_id: 'ibm/granite-13b-chat-v2',
        model_parameters: promptModelParametersModel,
        data: promptDataModel,
        system_prompt: 'testString',
        chat_items: [chatItemModel],
      };

      // WxPromptSessionEntry
      const wxPromptSessionEntryModel = {
        id: '1c29d9a1-9ba6-422d-aa39-517b26adc147',
        name: 'My Prompt',
        description: 'My First Prompt',
        prompt_variables: { 'key1': { anyKey: 'anyValue' } },
        is_template: true,
        created_at: 1711504485261,
        input_mode: 'structured',
        prompt: promptModel,
      };

      function __createPromptSessionTest() {
        // Construct the params object for operation createPromptSession
        const name = 'Session 1';
        const id = '1c29d9a1-9ba6-422d-aa39-517b26adc147';
        const description = 'My First Prompt Session';
        const createdAt = 1711504485261;
        const createdBy = 'IBMid-000000YYY0';
        const lastUpdatedAt = 1711504485261;
        const lastUpdatedBy = 'IBMid-000000YYY0';
        const lock = promptLockModel;
        const prompts = [wxPromptSessionEntryModel];
        const projectId = 'testString';
        const createPromptSessionParams = {
          name,
          id,
          description,
          createdAt,
          createdBy,
          lastUpdatedAt,
          lastUpdatedBy,
          lock,
          prompts,
          projectId,
        };

        const createPromptSessionResult =
          watsonxAiMlService.createPromptSession(createPromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(createPromptSessionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.id).toEqual(id);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.created_at).toEqual(createdAt);
        expect(mockRequestOptions.body.created_by).toEqual(createdBy);
        expect(mockRequestOptions.body.last_updated_at).toEqual(lastUpdatedAt);
        expect(mockRequestOptions.body.last_updated_by).toEqual(lastUpdatedBy);
        expect(mockRequestOptions.body.lock).toEqual(lock);
        expect(mockRequestOptions.body.prompts).toEqual(prompts);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createPromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createPromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createPromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'Session 1';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createPromptSessionParams = {
          name,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createPromptSession(createPromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSession();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptSession', () => {
    describe('positive tests', () => {
      function __getPromptSessionTest() {
        // Construct the params object for operation getPromptSession
        const sessionId = 'testString';
        const projectId = 'testString';
        const prefetch = true;
        const getPromptSessionParams = {
          sessionId,
          projectId,
          prefetch,
        };

        const getPromptSessionResult = watsonxAiMlService.getPromptSession(getPromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(getPromptSessionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.prefetch).toEqual(prefetch);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptSessionParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptSession(getPromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSession();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('updatePromptSession', () => {
    describe('positive tests', () => {
      function __updatePromptSessionTest() {
        // Construct the params object for operation updatePromptSession
        const sessionId = 'testString';
        const name = 'Session 1';
        const description = 'My First Prompt Session';
        const projectId = 'testString';
        const updatePromptSessionParams = {
          sessionId,
          name,
          description,
          projectId,
        };

        const updatePromptSessionResult =
          watsonxAiMlService.updatePromptSession(updatePromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(updatePromptSessionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}', 'PATCH');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __updatePromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __updatePromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __updatePromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const updatePromptSessionParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.updatePromptSession(updatePromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptSession();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deletePromptSession', () => {
    describe('positive tests', () => {
      function __deletePromptSessionTest() {
        // Construct the params object for operation deletePromptSession
        const sessionId = 'testString';
        const projectId = 'testString';
        const deletePromptSessionParams = {
          sessionId,
          projectId,
        };

        const deletePromptSessionResult =
          watsonxAiMlService.deletePromptSession(deletePromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(deletePromptSessionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deletePromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deletePromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deletePromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deletePromptSessionParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deletePromptSession(deletePromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePromptSession();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createPromptSessionEntry', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // PromptModelParameters
      const promptModelParametersModel = {
        decoding_method: 'testString',
        max_new_tokens: 38,
        min_new_tokens: 38,
        random_seed: 38,
        stop_sequences: ['testString'],
        temperature: 72.5,
        top_k: 72.5,
        top_p: 72.5,
        repetition_penalty: 72.5,
      };

      // PromptData
      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
        examples: [],
      };

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      // Prompt
      const promptModel = {
        input: [],
        model_id: 'ibm/granite-13b-chat-v2',
        model_parameters: promptModelParametersModel,
        data: promptDataModel,
        system_prompt: 'testString',
        chat_items: [chatItemModel],
      };

      function __createPromptSessionEntryTest() {
        // Construct the params object for operation createPromptSessionEntry
        const sessionId = 'testString';
        const name = 'My Prompt';
        const createdAt = 1711504485261;
        const prompt = promptModel;
        const id = '1c29d9a1-9ba6-422d-aa39-517b26adc147';
        const description = 'My First Prompt';
        const promptVariables = { 'key1': { anyKey: 'anyValue' } };
        const isTemplate = true;
        const inputMode = 'structured';
        const projectId = 'testString';
        const createPromptSessionEntryParams = {
          sessionId,
          name,
          createdAt,
          prompt,
          id,
          description,
          promptVariables,
          isTemplate,
          inputMode,
          projectId,
        };

        const createPromptSessionEntryResult = watsonxAiMlService.createPromptSessionEntry(
          createPromptSessionEntryParams
        );

        // all methods should return a Promise
        expectToBePromise(createPromptSessionEntryResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}/entries', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.created_at).toEqual(createdAt);
        expect(mockRequestOptions.body.prompt).toEqual(prompt);
        expect(mockRequestOptions.body.id).toEqual(id);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.prompt_variables).toEqual(promptVariables);
        expect(mockRequestOptions.body.is_template).toEqual(isTemplate);
        expect(mockRequestOptions.body.input_mode).toEqual(inputMode);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createPromptSessionEntryTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createPromptSessionEntryTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createPromptSessionEntryTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const name = 'My Prompt';
        const createdAt = 1711504485261;
        const prompt = promptModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createPromptSessionEntryParams = {
          sessionId,
          name,
          createdAt,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createPromptSessionEntry(createPromptSessionEntryParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSessionEntry({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSessionEntry();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listPromptSessionEntries', () => {
    describe('positive tests', () => {
      function __listPromptSessionEntriesTest() {
        // Construct the params object for operation listPromptSessionEntries
        const sessionId = 'testString';
        const projectId = 'testString';
        const bookmark = 'testString';
        const limit = 'testString';
        const listPromptSessionEntriesParams = {
          sessionId,
          projectId,
          bookmark,
          limit,
        };

        const listPromptSessionEntriesResult = watsonxAiMlService.listPromptSessionEntries(
          listPromptSessionEntriesParams
        );

        // all methods should return a Promise
        expectToBePromise(listPromptSessionEntriesResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}/entries', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.bookmark).toEqual(bookmark);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listPromptSessionEntriesTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listPromptSessionEntriesTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listPromptSessionEntriesTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listPromptSessionEntriesParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listPromptSessionEntries(listPromptSessionEntriesParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.listPromptSessionEntries({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.listPromptSessionEntries();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createPromptSessionEntryChatItem', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      function __createPromptSessionEntryChatItemTest() {
        // Construct the params object for operation createPromptSessionEntryChatItem
        const sessionId = 'testString';
        const entryId = 'testString';
        const chatItem = [chatItemModel];
        const projectId = 'testString';
        const createPromptSessionEntryChatItemParams = {
          sessionId,
          entryId,
          chatItem,
          projectId,
        };

        const createPromptSessionEntryChatItemResult =
          watsonxAiMlService.createPromptSessionEntryChatItem(
            createPromptSessionEntryChatItemParams
          );

        // all methods should return a Promise
        expectToBePromise(createPromptSessionEntryChatItemResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/v1/prompt_sessions/{session_id}/entries/{entry_id}/chat_items',
          'POST'
        );
        const expectedAccept = undefined;
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body).toEqual(chatItem);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
        expect(mockRequestOptions.path.entry_id).toEqual(entryId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createPromptSessionEntryChatItemTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createPromptSessionEntryChatItemTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createPromptSessionEntryChatItemTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const entryId = 'testString';
        const chatItem = [chatItemModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createPromptSessionEntryChatItemParams = {
          sessionId,
          entryId,
          chatItem,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createPromptSessionEntryChatItem(createPromptSessionEntryChatItemParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSessionEntryChatItem({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createPromptSessionEntryChatItem();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('updatePromptSessionLock', () => {
    describe('positive tests', () => {
      function __updatePromptSessionLockTest() {
        // Construct the params object for operation updatePromptSessionLock
        const sessionId = 'testString';
        const locked = true;
        const lockType = 'edit';
        const lockedBy = 'IBMid-000000YYY0';
        const projectId = 'testString';
        const force = true;
        const updatePromptSessionLockParams = {
          sessionId,
          locked,
          lockType,
          lockedBy,
          projectId,
          force,
        };

        const updatePromptSessionLockResult = watsonxAiMlService.updatePromptSessionLock(
          updatePromptSessionLockParams
        );

        // all methods should return a Promise
        expectToBePromise(updatePromptSessionLockResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}/lock', 'PUT');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.locked).toEqual(locked);
        expect(mockRequestOptions.body.lock_type).toEqual(lockType);
        expect(mockRequestOptions.body.locked_by).toEqual(lockedBy);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.force).toEqual(force);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __updatePromptSessionLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __updatePromptSessionLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __updatePromptSessionLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const locked = true;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const updatePromptSessionLockParams = {
          sessionId,
          locked,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.updatePromptSessionLock(updatePromptSessionLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptSessionLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.updatePromptSessionLock();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptSessionLock', () => {
    describe('positive tests', () => {
      function __getPromptSessionLockTest() {
        // Construct the params object for operation getPromptSessionLock
        const sessionId = 'testString';
        const projectId = 'testString';
        const getPromptSessionLockParams = {
          sessionId,
          projectId,
        };

        const getPromptSessionLockResult = watsonxAiMlService.getPromptSessionLock(
          getPromptSessionLockParams
        );

        // all methods should return a Promise
        expectToBePromise(getPromptSessionLockResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v1/prompt_sessions/{session_id}/lock', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptSessionLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptSessionLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptSessionLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptSessionLockParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptSessionLock(getPromptSessionLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionLock();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptSessionEntry', () => {
    describe('positive tests', () => {
      function __getPromptSessionEntryTest() {
        // Construct the params object for operation getPromptSessionEntry
        const sessionId = 'testString';
        const entryId = 'testString';
        const projectId = 'testString';
        const getPromptSessionEntryParams = {
          sessionId,
          entryId,
          projectId,
        };

        const getPromptSessionEntryResult = watsonxAiMlService.getPromptSessionEntry(
          getPromptSessionEntryParams
        );

        // all methods should return a Promise
        expectToBePromise(getPromptSessionEntryResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
          'GET'
        );
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
        expect(mockRequestOptions.path.entry_id).toEqual(entryId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getPromptSessionEntryTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptSessionEntryTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptSessionEntryTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const entryId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptSessionEntryParams = {
          sessionId,
          entryId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptSessionEntry(getPromptSessionEntryParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionEntry({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionEntry();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deletePromptSessionEntry', () => {
    describe('positive tests', () => {
      function __deletePromptSessionEntryTest() {
        // Construct the params object for operation deletePromptSessionEntry
        const sessionId = 'testString';
        const entryId = 'testString';
        const projectId = 'testString';
        const deletePromptSessionEntryParams = {
          sessionId,
          entryId,
          projectId,
        };

        const deletePromptSessionEntryResult = watsonxAiMlService.deletePromptSessionEntry(
          deletePromptSessionEntryParams
        );

        // all methods should return a Promise
        expectToBePromise(deletePromptSessionEntryResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/v1/prompt_sessions/{session_id}/entries/{entry_id}',
          'DELETE'
        );
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.session_id).toEqual(sessionId);
        expect(mockRequestOptions.path.entry_id).toEqual(entryId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deletePromptSessionEntryTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deletePromptSessionEntryTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deletePromptSessionEntryTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const entryId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deletePromptSessionEntryParams = {
          sessionId,
          entryId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deletePromptSessionEntry(deletePromptSessionEntryParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePromptSessionEntry({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deletePromptSessionEntry();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('textChat', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextChatFunctionCall
      const textChatFunctionCallModel = {
        name: 'testString',
        arguments: 'testString',
      };

      // TextChatToolCall
      const textChatToolCallModel = {
        id: 'testString',
        type: 'function',
        function: textChatFunctionCallModel,
      };

      // TextChatMessagesTextChatMessageAssistant
      const textChatMessagesModel = {
        role: 'TextChatMessageAssistant',
        content: 'You are a helpful assistant.',
        name: 'testString',
        refusal: 'testString',
        tool_calls: [textChatToolCallModel],
      };

      // TextChatParameterFunction
      const textChatParameterFunctionModel = {
        name: 'testString',
        description: 'testString',
        parameters: { anyKey: 'anyValue' },
      };

      // TextChatParameterTools
      const textChatParameterToolsModel = {
        type: 'function',
        function: textChatParameterFunctionModel,
      };

      // TextChatToolFunction
      const textChatToolFunctionModel = {
        name: 'testString',
      };

      // TextChatToolChoiceTool
      const textChatToolChoiceToolModel = {
        type: 'function',
        function: textChatToolFunctionModel,
      };

      // TextChatResponseFormat
      const textChatResponseFormatModel = {
        type: 'json_object',
      };

      function __textChatTest() {
        // Construct the params object for operation textChat
        const modelId = 'meta-llama/llama-3-8b-instruct';
        const messages = [textChatMessagesModel];
        const spaceId = 'testString';
        const projectId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const tools = [textChatParameterToolsModel];
        const toolChoiceOption = 'none';
        const toolChoice = textChatToolChoiceToolModel;
        const frequencyPenalty = 0;
        const logprobs = false;
        const topLogprobs = 0;
        const maxTokens = 100;
        const n = 1;
        const presencePenalty = 0;
        const responseFormat = textChatResponseFormatModel;
        const temperature = 0;
        const topP = 1;
        const timeLimit = 1000;
        const textChatParams = {
          modelId,
          messages,
          spaceId,
          projectId,
          tools,
          toolChoiceOption,
          toolChoice,
          frequencyPenalty,
          logprobs,
          topLogprobs,
          maxTokens,
          n,
          presencePenalty,
          responseFormat,
          temperature,
          topP,
          timeLimit,
        };

        const textChatResult = watsonxAiMlService.textChat(textChatParams);

        // all methods should return a Promise
        expectToBePromise(textChatResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/chat', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.messages).toEqual(messages);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.tools).toEqual(tools);
        expect(mockRequestOptions.body.tool_choice_option).toEqual(toolChoiceOption);
        expect(mockRequestOptions.body.tool_choice).toEqual(toolChoice);
        expect(mockRequestOptions.body.frequency_penalty).toEqual(frequencyPenalty);
        expect(mockRequestOptions.body.logprobs).toEqual(logprobs);
        expect(mockRequestOptions.body.top_logprobs).toEqual(topLogprobs);
        expect(mockRequestOptions.body.max_tokens).toEqual(maxTokens);
        expect(mockRequestOptions.body.n).toEqual(n);
        expect(mockRequestOptions.body.presence_penalty).toEqual(presencePenalty);
        expect(mockRequestOptions.body.response_format).toEqual(responseFormat);
        expect(mockRequestOptions.body.temperature).toEqual(temperature);
        expect(mockRequestOptions.body.top_p).toEqual(topP);
        expect(mockRequestOptions.body.time_limit).toEqual(timeLimit);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __textChatTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textChatTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textChatTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'meta-llama/llama-3-8b-instruct';
        const messages = [textChatMessagesModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textChatParams = {
          modelId,
          messages,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textChat(textChatParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textChat({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textChat();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('textChatStream', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextChatFunctionCall
      const textChatFunctionCallModel = {
        name: 'testString',
        arguments: 'testString',
      };

      // TextChatToolCall
      const textChatToolCallModel = {
        id: 'testString',
        type: 'function',
        function: textChatFunctionCallModel,
      };

      // TextChatMessagesTextChatMessageAssistant
      const textChatMessagesModel = {
        role: 'TextChatMessageAssistant',
        content: 'testString',
        name: 'testString',
        refusal: 'testString',
        tool_calls: [textChatToolCallModel],
      };

      // TextChatParameterFunction
      const textChatParameterFunctionModel = {
        name: 'testString',
        description: 'testString',
        parameters: { anyKey: 'anyValue' },
      };

      // TextChatParameterTools
      const textChatParameterToolsModel = {
        type: 'function',
        function: textChatParameterFunctionModel,
      };

      // TextChatToolFunction
      const textChatToolFunctionModel = {
        name: 'testString',
      };

      // TextChatToolChoiceTool
      const textChatToolChoiceToolModel = {
        type: 'function',
        function: textChatToolFunctionModel,
      };

      // TextChatResponseFormat
      const textChatResponseFormatModel = {
        type: 'json_object',
      };

      function __textChatStreamTest() {
        // Construct the params object for operation textChatStream
        const modelId = 'testString';
        const messages = [textChatMessagesModel];
        const spaceId = '3fc54cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const tools = [textChatParameterToolsModel];
        const toolChoiceOption = 'none';
        const toolChoice = textChatToolChoiceToolModel;
        const frequencyPenalty = 0;
        const logprobs = false;
        const topLogprobs = 0;
        const maxTokens = 1024;
        const n = 1;
        const presencePenalty = 0;
        const responseFormat = textChatResponseFormatModel;
        const temperature = 1;
        const topP = 1;
        const timeLimit = 600000;
        const textChatStreamParams = {
          modelId,
          messages,
          spaceId,
          projectId,
          tools,
          toolChoiceOption,
          toolChoice,
          frequencyPenalty,
          logprobs,
          topLogprobs,
          maxTokens,
          n,
          presencePenalty,
          responseFormat,
          temperature,
          topP,
          timeLimit,
        };
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        const textChatStreamResult = watsonxAiMlService.textChatStream(textChatStreamParams);

        // all methods should return a Promise
        expectToBePromise(textChatStreamResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/chat_stream', 'POST');
        const expectedAccept = 'text/event-stream';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.messages).toEqual(messages);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.tools).toEqual(tools);
        expect(mockRequestOptions.body.tool_choice_option).toEqual(toolChoiceOption);
        expect(mockRequestOptions.body.tool_choice).toEqual(toolChoice);
        expect(mockRequestOptions.body.frequency_penalty).toEqual(frequencyPenalty);
        expect(mockRequestOptions.body.logprobs).toEqual(logprobs);
        expect(mockRequestOptions.body.top_logprobs).toEqual(topLogprobs);
        expect(mockRequestOptions.body.max_tokens).toEqual(maxTokens);
        expect(mockRequestOptions.body.n).toEqual(n);
        expect(mockRequestOptions.body.presence_penalty).toEqual(presencePenalty);
        expect(mockRequestOptions.body.response_format).toEqual(responseFormat);
        expect(mockRequestOptions.body.temperature).toEqual(temperature);
        expect(mockRequestOptions.body.top_p).toEqual(topP);
        expect(mockRequestOptions.body.time_limit).toEqual(timeLimit);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __textChatStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textChatStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textChatStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'testString';
        const messages = [textChatMessagesModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textChatStreamParams = {
          modelId,
          messages,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textChatStream(textChatStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textChatStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textChatStream();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('embedText', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // EmbeddingReturnOptions
      const embeddingReturnOptionsModel = {
        input_text: true,
      };

      // EmbeddingParameters
      const embeddingParametersModel = {
        truncate_input_tokens: 1,
        return_options: embeddingReturnOptionsModel,
      };

      function __embedTextTest() {
        // Construct the params object for operation embedText
        const modelId = 'slate';
        const inputs = ['Youth craves thrills while adulthood cherishes wisdom.'];
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = embeddingParametersModel;
        const embedTextParams = {
          modelId,
          inputs,
          spaceId,
          projectId,
          parameters,
        };

        const embedTextResult = watsonxAiMlService.embedText(embedTextParams);

        // all methods should return a Promise
        expectToBePromise(embedTextResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/embeddings', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.inputs).toEqual(inputs);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __embedTextTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __embedTextTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __embedTextTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'slate';
        const inputs = ['Youth craves thrills while adulthood cherishes wisdom.'];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const embedTextParams = {
          modelId,
          inputs,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.embedText(embedTextParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.embedText({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.embedText();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('generateText', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextGenLengthPenalty
      const textGenLengthPenaltyModel = {
        decay_factor: 2.5,
        start_index: 5,
      };

      // ReturnOptionProperties
      const returnOptionPropertiesModel = {
        input_text: true,
        generated_tokens: true,
        input_tokens: true,
        token_logprobs: true,
        token_ranks: true,
        top_n_tokens: 2,
      };

      // TextGenParameters
      const textGenParametersModel = {
        decoding_method: 'greedy',
        length_penalty: textGenLengthPenaltyModel,
        max_new_tokens: 30,
        min_new_tokens: 5,
        random_seed: 1,
        stop_sequences: ['fail'],
        temperature: 0.8,
        time_limit: 600000,
        top_k: 50,
        top_p: 0.5,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
        foo: 'testString',
      };

      // MaskProperties
      const maskPropertiesModel = {
        remove_entity_value: false,
      };

      // ModerationHapProperties
      const moderationHapPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // TextModerationWithoutThreshold
      const textModerationWithoutThresholdModel = {
        enabled: true,
        foo: 'testString',
      };

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationWithoutThresholdModel,
        output: textModerationWithoutThresholdModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // ModerationTextRange
      const moderationTextRangeModel = {
        start: 0,
        end: 0,
      };

      // ModerationProperties
      const moderationPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        foo: 'testString',
      };

      // Moderations
      const moderationsModel = {
        hap: moderationHapPropertiesModel,
        pii: moderationPiiPropertiesModel,
        input_ranges: [moderationTextRangeModel],
        foo: moderationPropertiesModel,
      };

      function __generateTextTest() {
        // Construct the params object for operation generateText
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textGenParametersModel;
        const moderations = moderationsModel;
        const generateTextParams = {
          input,
          modelId,
          spaceId,
          projectId,
          parameters,
          moderations,
        };

        const generateTextResult = watsonxAiMlService.generateText(generateTextParams);

        // all methods should return a Promise
        expectToBePromise(generateTextResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/generation', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.moderations).toEqual(moderations);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __generateTextTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __generateTextTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __generateTextTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const generateTextParams = {
          input,
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.generateText(generateTextParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.generateText({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.generateText();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('generateTextStream', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextGenLengthPenalty
      const textGenLengthPenaltyModel = {
        decay_factor: 2.5,
        start_index: 5,
      };

      // ReturnOptionProperties
      const returnOptionPropertiesModel = {
        input_text: true,
        generated_tokens: true,
        input_tokens: true,
        token_logprobs: true,
        token_ranks: true,
        top_n_tokens: 2,
      };

      // TextGenParameters
      const textGenParametersModel = {
        decoding_method: 'greedy',
        length_penalty: textGenLengthPenaltyModel,
        max_new_tokens: 30,
        min_new_tokens: 5,
        random_seed: 1,
        stop_sequences: ['fail'],
        temperature: 0.8,
        time_limit: 600000,
        top_k: 50,
        top_p: 0.5,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
        foo: 'testString',
      };

      // MaskProperties
      const maskPropertiesModel = {
        remove_entity_value: false,
      };

      // ModerationHapProperties
      const moderationHapPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // TextModerationWithoutThreshold
      const textModerationWithoutThresholdModel = {
        enabled: true,
        foo: 'testString',
      };

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationWithoutThresholdModel,
        output: textModerationWithoutThresholdModel,
        mask: maskPropertiesModel,
        foo: 'testString',
      };

      // ModerationTextRange
      const moderationTextRangeModel = {
        start: 0,
        end: 0,
      };

      // ModerationProperties
      const moderationPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        foo: 'testString',
      };

      // Moderations
      const moderationsModel = {
        hap: moderationHapPropertiesModel,
        pii: moderationPiiPropertiesModel,
        input_ranges: [moderationTextRangeModel],
        foo: moderationPropertiesModel,
      };

      function __generateTextStreamTest() {
        // Construct the params object for operation generateTextStream
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textGenParametersModel;
        const moderations = moderationsModel;
        const generateTextStreamParams = {
          input,
          modelId,
          spaceId,
          projectId,
          parameters,
          moderations,
        };
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        const generateTextStreamResult =
          watsonxAiMlService.generateTextStream(generateTextStreamParams);

        // all methods should return a Promise
        expectToBePromise(generateTextStreamResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/generation_stream', 'POST');
        const expectedAccept = 'text/event-stream';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.moderations).toEqual(moderations);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      function __generateTextStreamFlagTest(returnObject) {
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textGenParametersModel;
        const moderations = moderationsModel;
        const generateTextStreamParams = {
          input,
          modelId,
          spaceId,
          projectId,
          parameters,
          moderations,
          returnObject,
        };
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        return watsonxAiMlService.generateTextStream(generateTextStreamParams);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __generateTextStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        __generateTextStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        __generateTextStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const userAccept = 'text/event-stream';
        const userContentType = 'fake/contentType';
        const generateTextStreamParams = {
          input,
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };
        createRequestMock.mockImplementation(() => Promise.resolve({ result: stream }));
        watsonxAiMlService.generateTextStream(generateTextStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should return correct values depending on flag', async () => {
        const textStreamString = await __generateTextStreamFlagTest(false);
        expect(textStreamString instanceof LineTransformStream).toBe(true);

        const textStreamObject = await __generateTextStreamFlagTest(true);
        expect(textStreamObject instanceof ObjectTransformStream).toBe(true);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.generateTextStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.generateTextStream();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('tokenizeText', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextTokenizeParameters
      const textTokenizeParametersModel = {
        return_tokens: true,
      };

      function __tokenizeTextTest() {
        // Construct the params object for operation tokenizeText
        const modelId = 'google/flan-ul2';
        const input = 'Write a tagline for an alumni association: Together we';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textTokenizeParametersModel;
        const tokenizeTextParams = {
          modelId,
          input,
          spaceId,
          projectId,
          parameters,
        };

        const tokenizeTextResult = watsonxAiMlService.tokenizeText(tokenizeTextParams);

        // all methods should return a Promise
        expectToBePromise(tokenizeTextResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/tokenization', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __tokenizeTextTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __tokenizeTextTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __tokenizeTextTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'google/flan-ul2';
        const input = 'Write a tagline for an alumni association: Together we';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const tokenizeTextParams = {
          modelId,
          input,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.tokenizeText(tokenizeTextParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.tokenizeText({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.tokenizeText();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createTraining', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // DataConnection
      const dataConnectionModel = {
        foo: 'testString',
      };

      // ObjectLocation
      const objectLocationModel = {
        id: 'testString',
        type: 'container',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
      };

      // BaseModel
      const baseModelModel = {
        model_id: 'google/flan-t5-xl',
      };

      // PromptTuning
      const promptTuningModel = {
        base_model: baseModelModel,
        task_id: 'classification',
        tuning_type: 'prompt_tuning',
        num_epochs: 30,
        learning_rate: 0.4,
        accumulate_steps: 3,
        verbalizer: 'rte { 0 : entailment, 1 : not entailment } {{input}}',
        batch_size: 10,
        max_input_tokens: 100,
        max_output_tokens: 100,
        init_method: 'text',
        init_text: 'testString',
      };

      // DataSchema
      const dataSchemaModel = {
        id: 't1',
        name: 'Tasks',
        fields: [{ name: 'duration', type: 'number' }],
        type: 'struct',
      };

      // DataConnectionReference
      const dataConnectionReferenceModel = {
        id: 'tune1_data.json',
        type: 'container',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
        schema: dataSchemaModel,
      };

      function __createTrainingTest() {
        // Construct the params object for operation createTraining
        const name = 'my-prompt-tune-training';
        const resultsReference = objectLocationModel;
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const description = 'testString';
        const tags = ['testString'];
        const promptTuning = promptTuningModel;
        const trainingDataReferences = [dataConnectionReferenceModel];
        const custom = { anyKey: 'anyValue' };
        const autoUpdateModel = true;
        const createTrainingParams = {
          name,
          resultsReference,
          spaceId,
          projectId,
          description,
          tags,
          promptTuning,
          trainingDataReferences,
          custom,
          autoUpdateModel,
        };

        const createTrainingResult = watsonxAiMlService.createTraining(createTrainingParams);

        // all methods should return a Promise
        expectToBePromise(createTrainingResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/trainings', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.results_reference).toEqual(resultsReference);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.tags).toEqual(tags);
        expect(mockRequestOptions.body.prompt_tuning).toEqual(promptTuning);
        expect(mockRequestOptions.body.training_data_references).toEqual(trainingDataReferences);
        expect(mockRequestOptions.body.custom).toEqual(custom);
        expect(mockRequestOptions.body.auto_update_model).toEqual(autoUpdateModel);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createTrainingTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createTrainingTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createTrainingTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'my-prompt-tune-training';
        const resultsReference = objectLocationModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createTrainingParams = {
          name,
          resultsReference,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createTraining(createTrainingParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createTraining({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createTraining();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listTrainings', () => {
    describe('positive tests', () => {
      function __listTrainingsTest() {
        // Construct the params object for operation listTrainings
        const start = 'testString';
        const limit = 50;
        const totalCount = true;
        const tagValue = 'testString';
        const state = 'queued';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const listTrainingsParams = {
          start,
          limit,
          totalCount,
          tagValue,
          state,
          spaceId,
          projectId,
        };

        const listTrainingsResult = watsonxAiMlService.listTrainings(listTrainingsParams);

        // all methods should return a Promise
        expectToBePromise(listTrainingsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/trainings', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
        expect(mockRequestOptions.qs.total_count).toEqual(totalCount);
        expect(mockRequestOptions.qs['tag.value']).toEqual(tagValue);
        expect(mockRequestOptions.qs.state).toEqual(state);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listTrainingsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listTrainingsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listTrainingsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listTrainingsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listTrainings(listTrainingsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listTrainings({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('TrainingsListPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v4/trainings';
      const mockPagerResponse1 =
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","rev":"rev","owner":"owner","modified_at":"2019-01-01T12:00:00.000Z","parent_id":"parent_id","name":"name","description":"description","tags":["tags"],"commit_info":{"committed_at":"2019-01-01T12:00:00.000Z","commit_message":"commit_message"},"space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"prompt_tuning":{"base_model":{"model_id":"google/flan-t5-xl"},"task_id":"summarization","tuning_type":"prompt_tuning","num_epochs":30,"learning_rate":0.4,"accumulate_steps":32,"verbalizer":"rte { 0 : entailment, 1 : not entailment } {{input}}","batch_size":10,"max_input_tokens":100,"max_output_tokens":100,"init_method":"text","init_text":"init_text"},"training_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"custom":{"anyKey":"anyValue"},"auto_update_model":true,"results_reference":{"id":"id","type":"connection_asset","connection":{},"location":{"mapKey":"inner"}},"status":{"running_at":"2017-01-30T10:11:12.000Z","completed_at":"2017-01-30T10:11:12.000Z","state":"queued","message":{"level":"info","text":"The deployment is successful"},"metrics":[{"timestamp":"2023-09-22T02:52:03.324Z","iteration":0,"ml_metrics":{"mapKey":5},"context":{"deployment_id":"deployment_id","prompt_tuning":{"metrics_location":"metrics_location"}}}],"failure":{"trace":"3fd543d2-36e0-4f83-9be3-5c6dd498af4f","errors":[{"code":"missing_field","message":"The \'name\' field is required.","more_info":"https://cloud.ibm.com/apidocs/machine-learning#models-get","target":{"type":"field","name":"name"}}]}}}}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","rev":"rev","owner":"owner","modified_at":"2019-01-01T12:00:00.000Z","parent_id":"parent_id","name":"name","description":"description","tags":["tags"],"commit_info":{"committed_at":"2019-01-01T12:00:00.000Z","commit_message":"commit_message"},"space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"prompt_tuning":{"base_model":{"model_id":"google/flan-t5-xl"},"task_id":"summarization","tuning_type":"prompt_tuning","num_epochs":30,"learning_rate":0.4,"accumulate_steps":32,"verbalizer":"rte { 0 : entailment, 1 : not entailment } {{input}}","batch_size":10,"max_input_tokens":100,"max_output_tokens":100,"init_method":"text","init_text":"init_text"},"training_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"custom":{"anyKey":"anyValue"},"auto_update_model":true,"results_reference":{"id":"id","type":"connection_asset","connection":{},"location":{"mapKey":"inner"}},"status":{"running_at":"2017-01-30T10:11:12.000Z","completed_at":"2017-01-30T10:11:12.000Z","state":"queued","message":{"level":"info","text":"The deployment is successful"},"metrics":[{"timestamp":"2023-09-22T02:52:03.324Z","iteration":0,"ml_metrics":{"mapKey":5},"context":{"deployment_id":"deployment_id","prompt_tuning":{"metrics_location":"metrics_location"}}}],"failure":{"trace":"3fd543d2-36e0-4f83-9be3-5c6dd498af4f","errors":[{"code":"missing_field","message":"The \'name\' field is required.","more_info":"https://cloud.ibm.com/apidocs/machine-learning#models-get","target":{"type":"field","name":"name"}}]}}}}]}';

      beforeEach(() => {
        unmock_createRequest();
        const scope = nock(serviceUrl)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse1)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse2);
      });

      afterEach(() => {
        nock.cleanAll();
        mock_createRequest();
      });

      test('getNext()', async () => {
        const params = {
          limit: 50,
          totalCount: true,
          tagValue: 'testString',
          state: 'queued',
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.TrainingsListPager(watsonxAiMlService, params);
        while (pager.hasNext()) {
          const nextPage = await pager.getNext();
          expect(nextPage).not.toBeNull();
          allResults.push(...nextPage);
        }
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });

      test('getAll()', async () => {
        const params = {
          limit: 50,
          totalCount: true,
          tagValue: 'testString',
          state: 'queued',
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
        };
        const pager = new WatsonxAiMlVml_v1.TrainingsListPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('getTraining', () => {
    describe('positive tests', () => {
      function __getTrainingTest() {
        // Construct the params object for operation getTraining
        const trainingId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const getTrainingParams = {
          trainingId,
          spaceId,
          projectId,
        };

        const getTrainingResult = watsonxAiMlService.getTraining(getTrainingParams);

        // all methods should return a Promise
        expectToBePromise(getTrainingResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/trainings/{training_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.training_id).toEqual(trainingId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getTrainingTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getTrainingTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getTrainingTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const trainingId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getTrainingParams = {
          trainingId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getTraining(getTrainingParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getTraining({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getTraining();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteTraining', () => {
    describe('positive tests', () => {
      function __deleteTrainingTest() {
        // Construct the params object for operation deleteTraining
        const trainingId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const hardDelete = true;
        const deleteTrainingParams = {
          trainingId,
          spaceId,
          projectId,
          hardDelete,
        };

        const deleteTrainingResult = watsonxAiMlService.deleteTraining(deleteTrainingParams);

        // all methods should return a Promise
        expectToBePromise(deleteTrainingResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/trainings/{training_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.training_id).toEqual(trainingId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deleteTrainingTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deleteTrainingTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deleteTrainingTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const trainingId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deleteTrainingParams = {
          trainingId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteTraining(deleteTrainingParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTraining({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTraining();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });
});
