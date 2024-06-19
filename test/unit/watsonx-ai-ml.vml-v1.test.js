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

const nock = require('nock');

// need to import the whole package to mock getAuthenticatorFromEnvironment
const sdkCorePackage = require('ibm-cloud-sdk-core');
const get_authenticator_from_environment = require('../../dist/auth/utils/get-authenticator-from-environment');

const { NoAuthAuthenticator, unitTestUtils } = sdkCorePackage;
const WatsonxAiMlVmlv1 = require('../../dist/watsonx-ai-ml/vml-v1');

const {
  getOptions,
  checkUrlAndMethod,
  checkMediaHeaders,
  expectToBePromise,
  checkUserHeader,
  checkForSuccessfulExecution,
} = unitTestUtils;

const watsonxAiMlServiceOptions = {
  authenticator: new NoAuthAuthenticator(),
  url: 'https://us-south.ml.cloud.ibm.com',
  version: '2023-07-07',
};

const watsonxAiMlService = new WatsonxAiMlVmlv1(watsonxAiMlServiceOptions);

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

describe('WatsonxAiMlVmlv1', () => {
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
      const testInstance = WatsonxAiMlVmlv1.newInstance(requiredGlobals);

      expect(getAuthenticatorMock).toHaveBeenCalled();
      expect(testInstance.baseOptions.authenticator).toBeInstanceOf(NoAuthAuthenticator);
      expect(testInstance.baseOptions.serviceName).toBe(WatsonxAiMlVmlv1.DEFAULT_SERVICE_NAME);
      expect(testInstance.baseOptions.serviceUrl).toBe(WatsonxAiMlVmlv1.DEFAULT_SERVICE_URL);
      expect(testInstance).toBeInstanceOf(WatsonxAiMlVmlv1);
    });

    test('should set serviceName, serviceUrl, and authenticator when provided', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
        serviceUrl: 'custom.com',
        serviceName: 'my-service',
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = WatsonxAiMlVmlv1.newInstance(options);

      expect(getAuthenticatorMock).not.toHaveBeenCalled();
      expect(testInstance.baseOptions.authenticator).toBeInstanceOf(NoAuthAuthenticator);
      expect(testInstance.baseOptions.serviceUrl).toBe('custom.com');
      expect(testInstance.baseOptions.serviceName).toBe('my-service');
      expect(testInstance).toBeInstanceOf(WatsonxAiMlVmlv1);
    });
  });

  describe('the constructor', () => {
    test('use user-given service url', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
        serviceUrl: 'custom.com',
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = new WatsonxAiMlVmlv1(options);

      expect(testInstance.baseOptions.serviceUrl).toBe('custom.com');
    });

    test('use default service url', () => {
      let options = {
        authenticator: new NoAuthAuthenticator(),
      };

      options = Object.assign(options, requiredGlobals);

      const testInstance = new WatsonxAiMlVmlv1(options);

      expect(testInstance.baseOptions.serviceUrl).toBe(WatsonxAiMlVmlv1.DEFAULT_SERVICE_URL);
    });
  });

  describe('service-level tests', () => {
    describe('positive tests', () => {
      test('construct service with global params', () => {
        const serviceObj = new WatsonxAiMlVmlv1(watsonxAiMlServiceOptions);
        expect(serviceObj).not.toBeNull();
        expect(serviceObj.version).toEqual(watsonxAiMlServiceOptions.version);
      });
    });
  });

  describe('constructServiceUrl', () => {
    describe('positive tests', () => {
      test('should use all default variable values if null is passed', () => {
        const defaultFormattedUrl = 'https://us-south.ml.cloud.ibm.com';
        const formattedUrl = WatsonxAiMlVmlv1.constructServiceUrl(null);

        expect(formattedUrl).toStrictEqual(defaultFormattedUrl);
      });
    });

    describe('negative tests', () => {
      test('should fail if an invalid variable name is provided', () => {
        expect(() => {
          const providedUrlVariables = new Map([['invalid_variable_name', 'value']]);
          WatsonxAiMlVmlv1.constructServiceUrl(providedUrlVariables);
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

      // Rel
      const relModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        rev: '2',
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

      function __createDeploymentTest() {
        // Construct the params object for operation createDeployment
        const name = 'text_classification';
        const online = onlineDeploymentModel;
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = 'testString';
        const description = 'testString';
        const tags = ['testString'];
        const custom = { anyKey: 'anyValue' };
        const asset = relModel;
        const promptTemplate = simpleRelModel;
        const hardwareSpec = hardwareSpecModel;
        const baseModelId = 'testString';
        const createDeploymentParams = {
          name,
          online,
          projectId,
          spaceId,
          description,
          tags,
          custom,
          asset,
          promptTemplate,
          hardwareSpec,
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
        expect(mockRequestOptions.body.asset).toEqual(asset);
        expect(mockRequestOptions.body.prompt_template).toEqual(promptTemplate);
        expect(mockRequestOptions.body.hardware_spec).toEqual(hardwareSpec);
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

  describe('deploymentsGet', () => {
    describe('positive tests', () => {
      function __deploymentsGetTest() {
        // Construct the params object for operation deploymentsGet
        const deploymentId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const deploymentsGetParams = {
          deploymentId,
          spaceId,
          projectId,
        };

        const deploymentsGetResult = watsonxAiMlService.deploymentsGet(deploymentsGetParams);

        // all methods should return a Promise
        expectToBePromise(deploymentsGetResult);

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
        __deploymentsGetTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsGetTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsGetTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsGetParams = {
          deploymentId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsGet(deploymentsGetParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsGet({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsGet();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentsUpdate', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // JsonPatchOperation
      const jsonPatchOperationModel = {
        op: 'add',
        path: 'testString',
        from: 'testString',
        value: 'testString',
      };

      function __deploymentsUpdateTest() {
        // Construct the params object for operation deploymentsUpdate
        const deploymentId = 'testString';
        const jsonPatch = [jsonPatchOperationModel];
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const deploymentsUpdateParams = {
          deploymentId,
          jsonPatch,
          spaceId,
          projectId,
        };

        const deploymentsUpdateResult =
          watsonxAiMlService.deploymentsUpdate(deploymentsUpdateParams);

        // all methods should return a Promise
        expectToBePromise(deploymentsUpdateResult);

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
        __deploymentsUpdateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsUpdateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsUpdateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const jsonPatch = [jsonPatchOperationModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsUpdateParams = {
          deploymentId,
          jsonPatch,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsUpdate(deploymentsUpdateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsUpdate({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsUpdate();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentsDelete', () => {
    describe('positive tests', () => {
      function __deploymentsDeleteTest() {
        // Construct the params object for operation deploymentsDelete
        const deploymentId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const deploymentsDeleteParams = {
          deploymentId,
          spaceId,
          projectId,
        };

        const deploymentsDeleteResult =
          watsonxAiMlService.deploymentsDelete(deploymentsDeleteParams);

        // all methods should return a Promise
        expectToBePromise(deploymentsDeleteResult);

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
        __deploymentsDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const deploymentId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsDeleteParams = {
          deploymentId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsDelete(deploymentsDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsDelete({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsDelete();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentsTextGeneration', () => {
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
        truncate_input_tokens: 0,
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

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
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

      function __deploymentsTextGenerationTest() {
        // Construct the params object for operation deploymentsTextGeneration
        const idOrName = 'classification';
        const input = 'how far is paris from bangalore:\n';
        const parameters = deploymentTextGenPropertiesModel;
        const moderations = moderationsModel;
        const deploymentsTextGenerationParams = {
          idOrName,
          input,
          parameters,
          moderations,
        };

        const deploymentsTextGenerationResult = watsonxAiMlService.deploymentsTextGeneration(
          deploymentsTextGenerationParams
        );

        // all methods should return a Promise
        expectToBePromise(deploymentsTextGenerationResult);

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
        __deploymentsTextGenerationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsTextGenerationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsTextGenerationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'classification';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsTextGenerationParams = {
          idOrName,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsTextGeneration(deploymentsTextGenerationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextGeneration({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextGeneration();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deploymentsTextGenerationStream', () => {
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
        truncate_input_tokens: 0,
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

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
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

      function __deploymentsTextGenerationStreamTest() {
        // Construct the params object for operation deploymentsTextGenerationStream
        const idOrName = 'classification';
        const input = 'testString';
        const parameters = deploymentTextGenPropertiesModel;
        const moderations = moderationsModel;
        const accept = 'application/json';
        const deploymentsTextGenerationStreamParams = {
          idOrName,
          input,
          parameters,
          moderations,
          accept,
        };

        const deploymentsTextGenerationStreamResult =
          watsonxAiMlService.deploymentsTextGenerationStream(deploymentsTextGenerationStreamParams);

        // all methods should return a Promise
        expectToBePromise(deploymentsTextGenerationStreamResult);

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
        checkUserHeader(createRequestMock, 'Accept', accept);
        expect(mockRequestOptions.body.input).toEqual(input);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.moderations).toEqual(moderations);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.path.id_or_name).toEqual(idOrName);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deploymentsTextGenerationStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsTextGenerationStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsTextGenerationStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'classification';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsTextGenerationStreamParams = {
          idOrName,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsTextGenerationStream(deploymentsTextGenerationStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextGenerationStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextGenerationStream();
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
        const listFoundationModelSpecsParams = {
          start,
          limit,
          filters,
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
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"model_id":"google/flan-ul2","label":"flan-ul2 (20B)","provider":"Hugging Face","tuned_by":"tuned_by","short_description":"An encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net.","long_description":"flan-ul2 (20B) is an encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net (FLAN).","limits":{"lite":{"call_time":"3S","max_input_tokens":200,"max_output_tokens":1000}},"task_ids":["task_ids"],"tasks":[{"id":"summarization","ratings":{"cost":2,"quality":3},"tags":["tags"]}],"tier":"class_1","source":"Hugging Face","min_shot_size":10,"number_params":"20b","model_limits":{"max_sequence_length":4096,"training_data_max_records":1024},"lifecycle":[{"id":"available","label":"label","start_date":"2023-07-23","alternative_model_ids":["alternative_model_ids"],"url":"url"}],"training_parameters":{"init_method":{"supported":["supported"],"default":"random"},"init_text":{"default":"text"},"num_virtual_tokens":{"supported":[9],"default":100},"num_epochs":{"default":20,"min":1,"max":50},"verbalizer":{"default":"Input: {{input}} Output:"},"batch_size":{"default":16,"min":1,"max":16},"max_input_tokens":{"default":256,"min":1,"max":1024},"max_output_tokens":{"default":128,"min":1,"max":256},"torch_dtype":{"default":"bfloat16"},"accumulate_steps":{"default":128,"min":1,"max":128},"learning_rate":{"default":0.3,"min":0.01,"max":0.5}},"versions":[{"version":"1.1.0","available_date":"2023-08-23"}]}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"model_id":"google/flan-ul2","label":"flan-ul2 (20B)","provider":"Hugging Face","tuned_by":"tuned_by","short_description":"An encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net.","long_description":"flan-ul2 (20B) is an encoder decoder model based on the T5 architecture and instruction-tuned using the Fine-tuned LAnguage Net (FLAN).","limits":{"lite":{"call_time":"3S","max_input_tokens":200,"max_output_tokens":1000}},"task_ids":["task_ids"],"tasks":[{"id":"summarization","ratings":{"cost":2,"quality":3},"tags":["tags"]}],"tier":"class_1","source":"Hugging Face","min_shot_size":10,"number_params":"20b","model_limits":{"max_sequence_length":4096,"training_data_max_records":1024},"lifecycle":[{"id":"available","label":"label","start_date":"2023-07-23","alternative_model_ids":["alternative_model_ids"],"url":"url"}],"training_parameters":{"init_method":{"supported":["supported"],"default":"random"},"init_text":{"default":"text"},"num_virtual_tokens":{"supported":[9],"default":100},"num_epochs":{"default":20,"min":1,"max":50},"verbalizer":{"default":"Input: {{input}} Output:"},"batch_size":{"default":16,"min":1,"max":16},"max_input_tokens":{"default":256,"min":1,"max":1024},"max_output_tokens":{"default":128,"min":1,"max":256},"torch_dtype":{"default":"bfloat16"},"accumulate_steps":{"default":128,"min":1,"max":128},"learning_rate":{"default":0.3,"min":0.01,"max":0.5}},"versions":[{"version":"1.1.0","available_date":"2023-08-23"}]}]}';

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
        };
        const allResults = [];
        const pager = new WatsonxAiMlVmlv1.FoundationModelSpecsPager(watsonxAiMlService, params);
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
        };
        const pager = new WatsonxAiMlVmlv1.FoundationModelSpecsPager(watsonxAiMlService, params);
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
        const pager = new WatsonxAiMlVmlv1.FoundationModelTasksPager(watsonxAiMlService, params);
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
        const pager = new WatsonxAiMlVmlv1.FoundationModelTasksPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('notebooksCreate', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // NotebookOrigin
      const notebookOriginModel = {
        type: 'blank',
      };

      // NotebookRuntime
      const notebookRuntimeModel = {
        environment: 'spark33py39-b275be5f-10ff-47ee-bfc9-63f1ce5addbf',
        spark_monitoring_enabled: true,
      };

      // NotebookKernel
      const notebookKernelModel = {
        display_name: 'Python 3.9 with Spark',
        name: 'python3',
        language: 'python3',
      };

      // NotebooksCreateRequestNotebookCreateBodyInProject
      const notebooksCreateRequestModel = {
        name: 'my notebook',
        description: 'this is my notebook',
        file_reference: 'notebook/my_notebook.ipynb',
        originates_from: notebookOriginModel,
        runtime: notebookRuntimeModel,
        kernel: notebookKernelModel,
        project: 'b275be5f-10ff-47ee-bfc9-63f1ce5addbf',
      };

      function __notebooksCreateTest() {
        // Construct the params object for operation notebooksCreate
        const notebooksCreateRequest = notebooksCreateRequestModel;
        const notebooksCreateParams = {
          notebooksCreateRequest,
        };

        const notebooksCreateResult = watsonxAiMlService.notebooksCreate(notebooksCreateParams);

        // all methods should return a Promise
        expectToBePromise(notebooksCreateResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body).toEqual(notebooksCreateRequest);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __notebooksCreateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __notebooksCreateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __notebooksCreateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebooksCreateRequest = notebooksCreateRequestModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const notebooksCreateParams = {
          notebooksCreateRequest,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.notebooksCreate(notebooksCreateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksCreate({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksCreate();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('notebooksList', () => {
    describe('positive tests', () => {
      function __notebooksListTest() {
        // Construct the params object for operation notebooksList
        const projectId = 'testString';
        const include = 'testString';
        const notebooks = ['ca3c0e27-46ca-83d4-a646-d49b11c14de9'];
        const notebooksListParams = {
          projectId,
          include,
          notebooks,
        };

        const notebooksListResult = watsonxAiMlService.notebooksList(notebooksListParams);

        // all methods should return a Promise
        expectToBePromise(notebooksListResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/list', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.notebooks).toEqual(notebooks);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.include).toEqual(include);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __notebooksListTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __notebooksListTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __notebooksListTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const projectId = 'testString';
        const include = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const notebooksListParams = {
          projectId,
          include,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.notebooksList(notebooksListParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksList({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksList();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('notebooksDelete', () => {
    describe('positive tests', () => {
      function __notebooksDeleteTest() {
        // Construct the params object for operation notebooksDelete
        const notebookGuid = 'testString';
        const notebooksDeleteParams = {
          notebookGuid,
        };

        const notebooksDeleteResult = watsonxAiMlService.notebooksDelete(notebooksDeleteParams);

        // all methods should return a Promise
        expectToBePromise(notebooksDeleteResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/{notebook_guid}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __notebooksDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __notebooksDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __notebooksDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const notebooksDeleteParams = {
          notebookGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.notebooksDelete(notebooksDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksDelete({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksDelete();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('notebooksRevert', () => {
    describe('positive tests', () => {
      function __notebooksRevertTest() {
        // Construct the params object for operation notebooksRevert
        const notebookGuid = 'testString';
        const source = 'ca3c0e27-46ca-83d4-a646-d49b11c14de9';
        const notebooksRevertParams = {
          notebookGuid,
          source,
        };

        const notebooksRevertResult = watsonxAiMlService.notebooksRevert(notebooksRevertParams);

        // all methods should return a Promise
        expectToBePromise(notebooksRevertResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/{notebook_guid}', 'PUT');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.source).toEqual(source);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __notebooksRevertTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __notebooksRevertTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __notebooksRevertTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const source = 'ca3c0e27-46ca-83d4-a646-d49b11c14de9';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const notebooksRevertParams = {
          notebookGuid,
          source,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.notebooksRevert(notebooksRevertParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksRevert({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksRevert();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('notebooksUpdate', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // NotebookKernel
      const notebookKernelModel = {
        display_name: 'Python 3.9 with Spark',
        name: 'python39',
        language: 'python3',
      };

      function __notebooksUpdateTest() {
        // Construct the params object for operation notebooksUpdate
        const notebookGuid = 'testString';
        const environment = 'd46ca0e27-a646-4de9-a646-9b113c183d4';
        const sparkMonitoringEnabled = false;
        const kernel = notebookKernelModel;
        const notebooksUpdateParams = {
          notebookGuid,
          environment,
          sparkMonitoringEnabled,
          kernel,
        };

        const notebooksUpdateResult = watsonxAiMlService.notebooksUpdate(notebooksUpdateParams);

        // all methods should return a Promise
        expectToBePromise(notebooksUpdateResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/{notebook_guid}', 'PATCH');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.environment).toEqual(environment);
        expect(mockRequestOptions.body.spark_monitoring_enabled).toEqual(sparkMonitoringEnabled);
        expect(mockRequestOptions.body.kernel).toEqual(kernel);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __notebooksUpdateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __notebooksUpdateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __notebooksUpdateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const notebooksUpdateParams = {
          notebookGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.notebooksUpdate(notebooksUpdateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksUpdate({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.notebooksUpdate();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('versionsCreate', () => {
    describe('positive tests', () => {
      function __versionsCreateTest() {
        // Construct the params object for operation versionsCreate
        const notebookGuid = 'testString';
        const versionsCreateParams = {
          notebookGuid,
        };

        const versionsCreateResult = watsonxAiMlService.versionsCreate(versionsCreateParams);

        // all methods should return a Promise
        expectToBePromise(versionsCreateResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/{notebook_guid}/versions', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __versionsCreateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __versionsCreateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __versionsCreateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const versionsCreateParams = {
          notebookGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.versionsCreate(versionsCreateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsCreate({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsCreate();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('versionsList', () => {
    describe('positive tests', () => {
      function __versionsListTest() {
        // Construct the params object for operation versionsList
        const notebookGuid = 'testString';
        const versionsListParams = {
          notebookGuid,
        };

        const versionsListResult = watsonxAiMlService.versionsList(versionsListParams);

        // all methods should return a Promise
        expectToBePromise(versionsListResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/notebooks/{notebook_guid}/versions', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __versionsListTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __versionsListTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __versionsListTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const versionsListParams = {
          notebookGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.versionsList(versionsListParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsList({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsList();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('versionsGet', () => {
    describe('positive tests', () => {
      function __versionsGetTest() {
        // Construct the params object for operation versionsGet
        const notebookGuid = 'testString';
        const versionGuid = 'testString';
        const versionsGetParams = {
          notebookGuid,
          versionGuid,
        };

        const versionsGetResult = watsonxAiMlService.versionsGet(versionsGetParams);

        // all methods should return a Promise
        expectToBePromise(versionsGetResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/v2/notebooks/{notebook_guid}/versions/{version_guid}',
          'GET'
        );
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
        expect(mockRequestOptions.path.version_guid).toEqual(versionGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __versionsGetTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __versionsGetTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __versionsGetTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const versionGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const versionsGetParams = {
          notebookGuid,
          versionGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.versionsGet(versionsGetParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsGet({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsGet();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('versionsDelete', () => {
    describe('positive tests', () => {
      function __versionsDeleteTest() {
        // Construct the params object for operation versionsDelete
        const notebookGuid = 'testString';
        const versionGuid = 'testString';
        const versionsDeleteParams = {
          notebookGuid,
          versionGuid,
        };

        const versionsDeleteResult = watsonxAiMlService.versionsDelete(versionsDeleteParams);

        // all methods should return a Promise
        expectToBePromise(versionsDeleteResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/v2/notebooks/{notebook_guid}/versions/{version_guid}',
          'DELETE'
        );
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.path.notebook_guid).toEqual(notebookGuid);
        expect(mockRequestOptions.path.version_guid).toEqual(versionGuid);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __versionsDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __versionsDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __versionsDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const notebookGuid = 'testString';
        const versionGuid = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const versionsDeleteParams = {
          notebookGuid,
          versionGuid,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.versionsDelete(versionsDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsDelete({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.versionsDelete();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('postPrompt', () => {
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

      function __postPromptTest() {
        // Construct the params object for operation postPrompt
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
        const postPromptParams = {
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

        const postPromptResult = watsonxAiMlService.postPrompt(postPromptParams);

        // all methods should return a Promise
        expectToBePromise(postPromptResult);

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
        __postPromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __postPromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __postPromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'My Prompt';
        const prompt = promptWithExternalModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const postPromptParams = {
          name,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.postPrompt(postPromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.postPrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.postPrompt();
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

  describe('patchPrompt', () => {
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

      function __patchPromptTest() {
        // Construct the params object for operation patchPrompt
        const promptId = 'testString';
        const name = 'My Prompt';
        const prompt = promptModel;
        const id = '1c29d9a1-9ba6-422d-aa39-517b26adc147';
        const description = 'My First Prompt';
        const taskIds = ['generation'];
        const governanceTracked = true;
        const modelVersion = wxPromptPatchModelVersionModel;
        const promptVariable = { 'key1': { anyKey: 'anyValue' } };
        const inputMode = 'structured';
        const projectId = 'testString';
        const spaceId = 'testString';
        const patchPromptParams = {
          promptId,
          name,
          prompt,
          id,
          description,
          taskIds,
          governanceTracked,
          modelVersion,
          promptVariable,
          inputMode,
          projectId,
          spaceId,
        };

        const patchPromptResult = watsonxAiMlService.patchPrompt(patchPromptParams);

        // all methods should return a Promise
        expectToBePromise(patchPromptResult);

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
        expect(mockRequestOptions.body.prompt_variable).toEqual(promptVariable);
        expect(mockRequestOptions.body.input_mode).toEqual(inputMode);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.prompt_id).toEqual(promptId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __patchPromptTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __patchPromptTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __patchPromptTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const name = 'My Prompt';
        const prompt = promptModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const patchPromptParams = {
          promptId,
          name,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.patchPrompt(patchPromptParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.patchPrompt({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.patchPrompt();
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

  describe('putPromptLock', () => {
    describe('positive tests', () => {
      function __putPromptLockTest() {
        // Construct the params object for operation putPromptLock
        const promptId = 'testString';
        const locked = true;
        const lockType = 'edit';
        const lockedBy = 'IBMid-000000YYY0';
        const projectId = 'testString';
        const spaceId = 'testString';
        const force = true;
        const putPromptLockParams = {
          promptId,
          locked,
          lockType,
          lockedBy,
          projectId,
          spaceId,
          force,
        };

        const putPromptLockResult = watsonxAiMlService.putPromptLock(putPromptLockParams);

        // all methods should return a Promise
        expectToBePromise(putPromptLockResult);

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
        __putPromptLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __putPromptLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __putPromptLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const locked = true;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const putPromptLockParams = {
          promptId,
          locked,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.putPromptLock(putPromptLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.putPromptLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.putPromptLock();
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
        const promptVariable = { 'key1': 'var1' };
        const spaceId = 'testString';
        const projectId = 'testString';
        const getPromptInputParams = {
          promptId,
          input,
          promptVariable,
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
        expect(mockRequestOptions.body.prompt_variable).toEqual(promptVariable);
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

  describe('postPromptChatItem', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      function __postPromptChatItemTest() {
        // Construct the params object for operation postPromptChatItem
        const promptId = 'testString';
        const chatItem = [chatItemModel];
        const spaceId = 'testString';
        const projectId = 'testString';
        const postPromptChatItemParams = {
          promptId,
          chatItem,
          spaceId,
          projectId,
        };

        const postPromptChatItemResult =
          watsonxAiMlService.postPromptChatItem(postPromptChatItemParams);

        // all methods should return a Promise
        expectToBePromise(postPromptChatItemResult);

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
        __postPromptChatItemTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __postPromptChatItemTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __postPromptChatItemTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const promptId = 'testString';
        const chatItem = [chatItemModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const postPromptChatItemParams = {
          promptId,
          chatItem,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.postPromptChatItem(postPromptChatItemParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptChatItem({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptChatItem();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('postPromptSession', () => {
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

      function __postPromptSessionTest() {
        // Construct the params object for operation postPromptSession
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
        const postPromptSessionParams = {
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

        const postPromptSessionResult =
          watsonxAiMlService.postPromptSession(postPromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(postPromptSessionResult);

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
        __postPromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __postPromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __postPromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'Session 1';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const postPromptSessionParams = {
          name,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.postPromptSession(postPromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSession();
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

  describe('patchPromptSession', () => {
    describe('positive tests', () => {
      function __patchPromptSessionTest() {
        // Construct the params object for operation patchPromptSession
        const sessionId = 'testString';
        const name = 'Session 1';
        const description = 'My First Prompt Session';
        const projectId = 'testString';
        const patchPromptSessionParams = {
          sessionId,
          name,
          description,
          projectId,
        };

        const patchPromptSessionResult =
          watsonxAiMlService.patchPromptSession(patchPromptSessionParams);

        // all methods should return a Promise
        expectToBePromise(patchPromptSessionResult);

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
        __patchPromptSessionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __patchPromptSessionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __patchPromptSessionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const patchPromptSessionParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.patchPromptSession(patchPromptSessionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.patchPromptSession({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.patchPromptSession();
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

  describe('postPromptSessionEntry', () => {
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

      function __postPromptSessionEntryTest() {
        // Construct the params object for operation postPromptSessionEntry
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
        const postPromptSessionEntryParams = {
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

        const postPromptSessionEntryResult = watsonxAiMlService.postPromptSessionEntry(
          postPromptSessionEntryParams
        );

        // all methods should return a Promise
        expectToBePromise(postPromptSessionEntryResult);

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
        __postPromptSessionEntryTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __postPromptSessionEntryTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __postPromptSessionEntryTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const name = 'My Prompt';
        const createdAt = 1711504485261;
        const prompt = promptModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const postPromptSessionEntryParams = {
          sessionId,
          name,
          createdAt,
          prompt,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.postPromptSessionEntry(postPromptSessionEntryParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSessionEntry({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSessionEntry();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('getPromptSessionEntries', () => {
    describe('positive tests', () => {
      function __getPromptSessionEntriesTest() {
        // Construct the params object for operation getPromptSessionEntries
        const sessionId = 'testString';
        const projectId = 'testString';
        const bookmark = 'testString';
        const limit = 'testString';
        const getPromptSessionEntriesParams = {
          sessionId,
          projectId,
          bookmark,
          limit,
        };

        const getPromptSessionEntriesResult = watsonxAiMlService.getPromptSessionEntries(
          getPromptSessionEntriesParams
        );

        // all methods should return a Promise
        expectToBePromise(getPromptSessionEntriesResult);

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
        __getPromptSessionEntriesTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getPromptSessionEntriesTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getPromptSessionEntriesTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getPromptSessionEntriesParams = {
          sessionId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getPromptSessionEntries(getPromptSessionEntriesParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionEntries({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getPromptSessionEntries();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('postPromptSessionEntryChatItem', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // ChatItem
      const chatItemModel = {
        type: 'question',
        content: 'Some text',
        status: 'ready',
        timestamp: 1711504485261,
      };

      function __postPromptSessionEntryChatItemTest() {
        // Construct the params object for operation postPromptSessionEntryChatItem
        const sessionId = 'testString';
        const entryId = 'testString';
        const chatItem = [chatItemModel];
        const projectId = 'testString';
        const postPromptSessionEntryChatItemParams = {
          sessionId,
          entryId,
          chatItem,
          projectId,
        };

        const postPromptSessionEntryChatItemResult =
          watsonxAiMlService.postPromptSessionEntryChatItem(postPromptSessionEntryChatItemParams);

        // all methods should return a Promise
        expectToBePromise(postPromptSessionEntryChatItemResult);

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
        __postPromptSessionEntryChatItemTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __postPromptSessionEntryChatItemTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __postPromptSessionEntryChatItemTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const entryId = 'testString';
        const chatItem = [chatItemModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const postPromptSessionEntryChatItemParams = {
          sessionId,
          entryId,
          chatItem,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.postPromptSessionEntryChatItem(postPromptSessionEntryChatItemParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSessionEntryChatItem({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.postPromptSessionEntryChatItem();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('putPromptSessionLock', () => {
    describe('positive tests', () => {
      function __putPromptSessionLockTest() {
        // Construct the params object for operation putPromptSessionLock
        const sessionId = 'testString';
        const locked = true;
        const lockType = 'edit';
        const lockedBy = 'IBMid-000000YYY0';
        const projectId = 'testString';
        const force = true;
        const putPromptSessionLockParams = {
          sessionId,
          locked,
          lockType,
          lockedBy,
          projectId,
          force,
        };

        const putPromptSessionLockResult = watsonxAiMlService.putPromptSessionLock(
          putPromptSessionLockParams
        );

        // all methods should return a Promise
        expectToBePromise(putPromptSessionLockResult);

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
        __putPromptSessionLockTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __putPromptSessionLockTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __putPromptSessionLockTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const sessionId = 'testString';
        const locked = true;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const putPromptSessionLockParams = {
          sessionId,
          locked,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.putPromptSessionLock(putPromptSessionLockParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.putPromptSessionLock({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.putPromptSessionLock();
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

  describe('textEmbeddings', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // EmbeddingReturnOptions
      const embeddingReturnOptionsModel = {
        input_text: true,
      };

      // EmbeddingParameters
      const embeddingParametersModel = {
        truncate_input_tokens: 0,
        return_options: embeddingReturnOptionsModel,
      };

      function __textEmbeddingsTest() {
        // Construct the params object for operation textEmbeddings
        const modelId = 'slate';
        const inputs = ['Youth craves thrills while adulthood cherishes wisdom.'];
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = embeddingParametersModel;
        const textEmbeddingsParams = {
          modelId,
          inputs,
          spaceId,
          projectId,
          parameters,
        };

        const textEmbeddingsResult = watsonxAiMlService.textEmbeddings(textEmbeddingsParams);

        // all methods should return a Promise
        expectToBePromise(textEmbeddingsResult);

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
        __textEmbeddingsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textEmbeddingsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textEmbeddingsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'slate';
        const inputs = ['Youth craves thrills while adulthood cherishes wisdom.'];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textEmbeddingsParams = {
          modelId,
          inputs,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textEmbeddings(textEmbeddingsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textEmbeddings({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textEmbeddings();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('textGeneration', () => {
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

      // ChatHistoryTextGenProperties
      const chatHistoryTextGenPropertiesModel = {
        is_question: true,
        content: 'testString',
      };

      // ChatTextGenProperties
      const chatTextGenPropertiesModel = {
        history: [chatHistoryTextGenPropertiesModel],
        context: 'testString',
      };

      // TextGenRequestParameters
      const textGenRequestParametersModel = {
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
        truncate_input_tokens: 0,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        chat: chatTextGenPropertiesModel,
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

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
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

      function __textGenerationTest() {
        // Construct the params object for operation textGeneration
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textGenRequestParametersModel;
        const moderations = moderationsModel;
        const textGenerationParams = {
          input,
          modelId,
          spaceId,
          projectId,
          parameters,
          moderations,
        };

        const textGenerationResult = watsonxAiMlService.textGeneration(textGenerationParams);

        // all methods should return a Promise
        expectToBePromise(textGenerationResult);

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
        __textGenerationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textGenerationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textGenerationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textGenerationParams = {
          input,
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textGeneration(textGenerationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textGeneration({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textGeneration();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('textGenerationStream', () => {
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

      // ChatHistoryTextGenProperties
      const chatHistoryTextGenPropertiesModel = {
        is_question: true,
        content: 'testString',
      };

      // ChatTextGenProperties
      const chatTextGenPropertiesModel = {
        history: [chatHistoryTextGenPropertiesModel],
        context: 'testString',
      };

      // TextGenRequestParameters
      const textGenRequestParametersModel = {
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
        truncate_input_tokens: 0,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        chat: chatTextGenPropertiesModel,
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

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
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

      function __textGenerationStreamTest() {
        // Construct the params object for operation textGenerationStream
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textGenRequestParametersModel;
        const moderations = moderationsModel;
        const accept = 'application/json';
        const textGenerationStreamParams = {
          input,
          modelId,
          spaceId,
          projectId,
          parameters,
          moderations,
          accept,
        };

        const textGenerationStreamResult = watsonxAiMlService.textGenerationStream(
          textGenerationStreamParams
        );

        // all methods should return a Promise
        expectToBePromise(textGenerationStreamResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/generation_stream', 'POST');
        const expectedAccept = accept;
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        checkUserHeader(createRequestMock, 'Accept', accept);
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
        __textGenerationStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textGenerationStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textGenerationStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const input =
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n';
        const modelId = 'google/flan-ul2';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textGenerationStreamParams = {
          input,
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textGenerationStream(textGenerationStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textGenerationStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textGenerationStream();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('textTokenization', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TextTokenizeParameters
      const textTokenizeParametersModel = {
        return_tokens: true,
      };

      function __textTokenizationTest() {
        // Construct the params object for operation textTokenization
        const modelId = 'google/flan-ul2';
        const input = 'Write a tagline for an alumni association: Together we';
        const spaceId = 'testString';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const parameters = textTokenizeParametersModel;
        const textTokenizationParams = {
          modelId,
          input,
          spaceId,
          projectId,
          parameters,
        };

        const textTokenizationResult = watsonxAiMlService.textTokenization(textTokenizationParams);

        // all methods should return a Promise
        expectToBePromise(textTokenizationResult);

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
        __textTokenizationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textTokenizationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textTokenizationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'google/flan-ul2';
        const input = 'Write a tagline for an alumni association: Together we';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textTokenizationParams = {
          modelId,
          input,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.textTokenization(textTokenizationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.textTokenization({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.textTokenization();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('trainingsCreate', () => {
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

      function __trainingsCreateTest() {
        // Construct the params object for operation trainingsCreate
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
        const trainingsCreateParams = {
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

        const trainingsCreateResult = watsonxAiMlService.trainingsCreate(trainingsCreateParams);

        // all methods should return a Promise
        expectToBePromise(trainingsCreateResult);

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
        __trainingsCreateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __trainingsCreateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __trainingsCreateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'my-prompt-tune-training';
        const resultsReference = objectLocationModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const trainingsCreateParams = {
          name,
          resultsReference,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.trainingsCreate(trainingsCreateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsCreate({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsCreate();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('trainingsList', () => {
    describe('positive tests', () => {
      function __trainingsListTest() {
        // Construct the params object for operation trainingsList
        const start = 'testString';
        const limit = 50;
        const totalCount = true;
        const tagValue = 'testString';
        const state = 'queued';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const trainingsListParams = {
          start,
          limit,
          totalCount,
          tagValue,
          state,
          spaceId,
          projectId,
        };

        const trainingsListResult = watsonxAiMlService.trainingsList(trainingsListParams);

        // all methods should return a Promise
        expectToBePromise(trainingsListResult);

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
        __trainingsListTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __trainingsListTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __trainingsListTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const trainingsListParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.trainingsList(trainingsListParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.trainingsList({});
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
        const pager = new WatsonxAiMlVmlv1.TrainingsListPager(watsonxAiMlService, params);
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
        const pager = new WatsonxAiMlVmlv1.TrainingsListPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('trainingsGet', () => {
    describe('positive tests', () => {
      function __trainingsGetTest() {
        // Construct the params object for operation trainingsGet
        const trainingId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const trainingsGetParams = {
          trainingId,
          spaceId,
          projectId,
        };

        const trainingsGetResult = watsonxAiMlService.trainingsGet(trainingsGetParams);

        // all methods should return a Promise
        expectToBePromise(trainingsGetResult);

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
        __trainingsGetTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __trainingsGetTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __trainingsGetTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const trainingId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const trainingsGetParams = {
          trainingId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.trainingsGet(trainingsGetParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsGet({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsGet();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('trainingsDelete', () => {
    describe('positive tests', () => {
      function __trainingsDeleteTest() {
        // Construct the params object for operation trainingsDelete
        const trainingId = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const hardDelete = true;
        const trainingsDeleteParams = {
          trainingId,
          spaceId,
          projectId,
          hardDelete,
        };

        const trainingsDeleteResult = watsonxAiMlService.trainingsDelete(trainingsDeleteParams);

        // all methods should return a Promise
        expectToBePromise(trainingsDeleteResult);

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
        __trainingsDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __trainingsDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __trainingsDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const trainingId = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const trainingsDeleteParams = {
          trainingId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.trainingsDelete(trainingsDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsDelete({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.trainingsDelete();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });
});
