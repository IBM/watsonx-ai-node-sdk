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

/* eslint-disable no-await-in-loop */

const nock = require('nock');
const sdkCorePackage = require('ibm-cloud-sdk-core');
const unitTestUtils = require('@ibm-cloud/sdk-test-utilities');
const { StreamTransform } = require('../../dist/lib/common');
// need to import the whole package to mock getAuthenticatorFromEnvironment
const get_authenticator_from_environment = require('../../dist/auth/utils/get-authenticator-from-environment');

const { NoAuthAuthenticator } = sdkCorePackage;
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

  describe('createTextExtraction', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // CosDataConnection
      const cosDataConnectionModel = {
        id: '6f5688fd-f3bf-42c2-a18b-49c0d8a1920d',
      };

      // CosDataLocation
      const cosDataLocationModel = {
        file_name: 'files/document.pdf',
        bucket: 'testString',
      };

      // TextExtractionDataReference
      const textExtractionDataReferenceModel = {
        type: 'connection_asset',
        connection: cosDataConnectionModel,
        location: cosDataLocationModel,
      };

      // TextExtractionStepOcr
      const textExtractionStepOcrModel = {
        languages_list: ['en'],
      };

      // TextExtractionStepTablesProcessing
      const textExtractionStepTablesProcessingModel = {
        enabled: true,
      };

      // TextExtractionSteps
      const textExtractionStepsModel = {
        ocr: textExtractionStepOcrModel,
        tables_processing: textExtractionStepTablesProcessingModel,
      };

      function __textExtractionTest() {
        // Construct the params object for operation textExtraction
        const documentReference = textExtractionDataReferenceModel;
        const resultsReference = textExtractionDataReferenceModel;
        const steps = textExtractionStepsModel;
        const assemblyJson = {};
        const assemblyMd = { anyKey: 'anyValue' };
        const custom = { anyKey: 'anyValue' };
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = 'testString';
        const textExtractionParams = {
          documentReference,
          resultsReference,
          steps,
          assemblyJson,
          assemblyMd,
          custom,
          projectId,
          spaceId,
        };

        const textExtractionResult = watsonxAiMlService.createTextExtraction(textExtractionParams);

        // all methods should return a Promise
        expectToBePromise(textExtractionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/extractions', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.document_reference).toEqual(documentReference);
        expect(mockRequestOptions.body.results_reference).toEqual(resultsReference);
        expect(mockRequestOptions.body.steps).toEqual(steps);
        expect(mockRequestOptions.body.assembly_json).toEqual(assemblyJson);
        expect(mockRequestOptions.body.assembly_md).toEqual(assemblyMd);
        expect(mockRequestOptions.body.custom).toEqual(custom);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __textExtractionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textExtractionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textExtractionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const documentReference = textExtractionDataReferenceModel;
        const resultsReference = textExtractionDataReferenceModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textExtractionParams = {
          documentReference,
          resultsReference,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createTextExtraction(textExtractionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createTextExtraction({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createTextExtraction();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listTextExtractions', () => {
    describe('positive tests', () => {
      function __listTextExtractionsTest() {
        // Construct the params object for operation listTextExtractions
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const start = 'testString';
        const limit = 50;
        const listTextExtractionsParams = {
          spaceId,
          projectId,
          start,
          limit,
        };

        const listTextExtractionsResult =
          watsonxAiMlService.listTextExtractions(listTextExtractionsParams);

        // all methods should return a Promise
        expectToBePromise(listTextExtractionsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/extractions', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listTextExtractionsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listTextExtractionsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listTextExtractionsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listTextExtractionsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listTextExtractions(listTextExtractionsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listTextExtractions({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('TextExtractionsPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v1/text/extractions';
      const mockPagerResponse1 =
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"document_reference":{"type":"connection_asset","connection":{"id":"id"},"location":{"file_name":"file_name","bucket":"bucket"}},"results_reference":{"type":"connection_asset","connection":{"id":"id"},"location":{"file_name":"file_name","bucket":"bucket"}},"steps":{"ocr":{"languages_list":["languages_list"]},"tables_processing":{"enabled":true}},"assembly_json":{"anyKey":"anyValue"},"assembly_md":{"anyKey":"anyValue"},"custom":{"anyKey":"anyValue"},"results":{"status":"submitted","running_at":"2019-01-01T12:00:00.000Z","completed_at":"2019-01-01T12:00:00.000Z","number_pages_processed":22,"total_pages":11,"error":{"code":"code","message":"message","more_info":"more_info"}}}}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"document_reference":{"type":"connection_asset","connection":{"id":"id"},"location":{"file_name":"file_name","bucket":"bucket"}},"results_reference":{"type":"connection_asset","connection":{"id":"id"},"location":{"file_name":"file_name","bucket":"bucket"}},"steps":{"ocr":{"languages_list":["languages_list"]},"tables_processing":{"enabled":true}},"assembly_json":{"anyKey":"anyValue"},"assembly_md":{"anyKey":"anyValue"},"custom":{"anyKey":"anyValue"},"results":{"status":"submitted","running_at":"2019-01-01T12:00:00.000Z","completed_at":"2019-01-01T12:00:00.000Z","number_pages_processed":22,"total_pages":11,"error":{"code":"code","message":"message","more_info":"more_info"}}}}]}';

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
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
          limit: 50,
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.TextExtractionsPager(watsonxAiMlService, params);
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
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
          limit: 50,
        };
        const pager = new WatsonxAiMlVml_v1.TextExtractionsPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('getTextExtraction', () => {
    describe('positive tests', () => {
      function __textExtractionGetTest() {
        // Construct the params object for operation getTextExtraction
        const id = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const textExtractionGetParams = {
          id,
          spaceId,
          projectId,
        };

        const textExtractionGetResult =
          watsonxAiMlService.getTextExtraction(textExtractionGetParams);

        // all methods should return a Promise
        expectToBePromise(textExtractionGetResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/extractions/{id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __textExtractionGetTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textExtractionGetTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textExtractionGetTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textExtractionGetParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getTextExtraction(textExtractionGetParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getTextExtraction({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getTextExtraction();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteTextExtraction', () => {
    describe('positive tests', () => {
      function __textExtractionDeleteTest() {
        // Construct the params object for operation deleteTextExtraction
        const id = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const hardDelete = true;
        const textExtractionDeleteParams = {
          id,
          spaceId,
          projectId,
          hardDelete,
        };

        const textExtractionDeleteResult = watsonxAiMlService.deleteTextExtraction(
          textExtractionDeleteParams
        );

        // all methods should return a Promise
        expectToBePromise(textExtractionDeleteResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/text/extractions/{id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __textExtractionDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __textExtractionDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __textExtractionDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const textExtractionDeleteParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteTextExtraction(textExtractionDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTextExtraction({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTextExtraction();
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
        end: 10,
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
        end: 10,
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

  describe('deploymentsTextChat', () => {
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

      // DeploymentTextChatMessagesTextChatMessageAssistant
      const deploymentTextChatMessagesModel = {
        role: 'TextChatMessageAssistant',
        content: 'Who won the world series in 2020?',
        name: 'testString',
        refusal: 'testString',
        tool_calls: [textChatToolCallModel],
      };

      function __deploymentsTextChatTest() {
        // Construct the params object for operation deploymentsTextChat
        const idOrName = 'testString';
        const messages = [deploymentTextChatMessagesModel];
        const context = 'testString';
        const deploymentsTextChatParams = {
          idOrName,
          messages,
          context,
        };
        const deploymentsTextChatResult =
          watsonxAiMlService.deploymentsTextChat(deploymentsTextChatParams);

        // all methods should return a Promise
        expectToBePromise(deploymentsTextChatResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/deployments/{id_or_name}/text/chat', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.messages).toEqual(messages);
        expect(mockRequestOptions.body.context).toEqual(context);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.path.id_or_name).toEqual(idOrName);
      }
      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deploymentsTextChatTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsTextChatTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsTextChatTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'testString';
        const messages = [deploymentTextChatMessagesModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsTextChatParams = {
          idOrName,
          messages,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsTextChat(deploymentsTextChatParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });
    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextChat({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextChat();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });
  describe('deploymentsTextChatStream', () => {
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

      // DeploymentTextChatMessagesTextChatMessageAssistant
      const deploymentTextChatMessagesModel = {
        role: 'TextChatMessageAssistant',
        content: 'Who won the world series in 2020?',
        name: 'testString',
        refusal: 'testString',
        tool_calls: [textChatToolCallModel],
      };

      function __deploymentsTextChatStreamTest() {
        // Construct the params object for operation deploymentsTextChatStream
        const idOrName = 'testString';
        const messages = [deploymentTextChatMessagesModel];
        const context = 'testString';
        const deploymentsTextChatStreamParams = {
          idOrName,
          messages,
          context,
        };

        const deploymentsTextChatStreamResult = watsonxAiMlService.deploymentsTextChatStream(
          deploymentsTextChatStreamParams
        );

        // all methods should return a Promise
        expectToBePromise(deploymentsTextChatStreamResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(
          mockRequestOptions,
          '/ml/v1/deployments/{id_or_name}/text/chat_stream',
          'POST'
        );
        const expectedAccept = 'text/event-stream';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.messages).toEqual(messages);
        expect(mockRequestOptions.body.context).toEqual(context);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.path.id_or_name).toEqual(idOrName);
      }
      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deploymentsTextChatStreamTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deploymentsTextChatStreamTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deploymentsTextChatStreamTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const idOrName = 'testString';
        const messages = [deploymentTextChatMessagesModel];
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deploymentsTextChatStreamParams = {
          idOrName,
          messages,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deploymentsTextChatStream(deploymentsTextChatStreamParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextChatStream({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deploymentsTextChatStream();
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
        const logitBias = { anyKey: 'anyValue' };
        const logprobs = false;
        const topLogprobs = 0;
        const maxTokens = 100;
        const n = 1;
        const presencePenalty = 0;
        const responseFormat = textChatResponseFormatModel;
        const seed = 38;
        const stop = ['testString'];
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
          logitBias,
          logprobs,
          topLogprobs,
          maxTokens,
          n,
          presencePenalty,
          responseFormat,
          seed,
          stop,
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
        expect(mockRequestOptions.body.logit_bias).toEqual(logitBias);
        expect(mockRequestOptions.body.logprobs).toEqual(logprobs);
        expect(mockRequestOptions.body.top_logprobs).toEqual(topLogprobs);
        expect(mockRequestOptions.body.max_tokens).toEqual(maxTokens);
        expect(mockRequestOptions.body.n).toEqual(n);
        expect(mockRequestOptions.body.presence_penalty).toEqual(presencePenalty);
        expect(mockRequestOptions.body.response_format).toEqual(responseFormat);
        expect(mockRequestOptions.body.seed).toEqual(seed);
        expect(mockRequestOptions.body.stop).toEqual(stop);
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
        const logitBias = { '1003': -100, '1004': -100 };
        const logprobs = false;
        const topLogprobs = 0;
        const maxTokens = 1024;
        const n = 1;
        const presencePenalty = 0;
        const responseFormat = textChatResponseFormatModel;
        const seed = 41;
        const stop = ['this', 'the'];
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
          logitBias,
          logprobs,
          topLogprobs,
          maxTokens,
          n,
          presencePenalty,
          responseFormat,
          seed,
          stop,
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
        expect(mockRequestOptions.body.logit_bias).toEqual(logitBias);
        expect(mockRequestOptions.body.logprobs).toEqual(logprobs);
        expect(mockRequestOptions.body.top_logprobs).toEqual(topLogprobs);
        expect(mockRequestOptions.body.max_tokens).toEqual(maxTokens);
        expect(mockRequestOptions.body.n).toEqual(n);
        expect(mockRequestOptions.body.presence_penalty).toEqual(presencePenalty);
        expect(mockRequestOptions.body.response_format).toEqual(responseFormat);
        expect(mockRequestOptions.body.seed).toEqual(seed);
        expect(mockRequestOptions.body.stop).toEqual(stop);
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
        end: 10,
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
        end: 10,
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
  describe('timeSeriesForecast', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // TSForecastInputSchema
      const tsForecastInputSchemaModel = {
        timestamp_column: 'date',
        id_columns: ['ID1'],
        freq: '1h',
        target_columns: ['testString'],
      };

      // TSForecastParameters
      const tsForecastParametersModel = {
        prediction_length: 38,
      };

      function __timeSeriesForecastTest() {
        // Construct the params object for operation timeSeriesForecast
        const modelId = 'ibm/ttm-1024-96-r2';
        const data = {
          date: ['2020-01-01T00:00:00', '2020-01-01T01:00:00', '2020-01-05T01:00:00'],
          ID1: ['D1', 'D1', 'D1'],
          TARGET1: [1.46, 2.34, 4.55],
        };
        const schema = tsForecastInputSchemaModel;
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = 'testString';
        const parameters = tsForecastParametersModel;
        const timeSeriesForecastParams = {
          modelId,
          data,
          schema,
          projectId,
          spaceId,
          parameters,
        };

        const timeSeriesForecastResult =
          watsonxAiMlService.timeSeriesForecast(timeSeriesForecastParams);

        // all methods should return a Promise
        expectToBePromise(timeSeriesForecastResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/time_series/forecast', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.model_id).toEqual(modelId);
        expect(mockRequestOptions.body.data).toEqual(data);
        expect(mockRequestOptions.body.schema).toEqual(schema);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __timeSeriesForecastTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __timeSeriesForecastTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __timeSeriesForecastTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = 'ibm/ttm-1024-96-r2';
        const data = {
          date: ['2020-01-01T00:00:00', '2020-01-01T01:00:00', '2020-01-05T01:00:00'],
          ID1: ['D1', 'D1', 'D1'],
          TARGET1: [1.46, 2.34, 4.55],
        };
        const schema = tsForecastInputSchemaModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const timeSeriesForecastParams = {
          modelId,
          data,
          schema,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.timeSeriesForecast(timeSeriesForecastParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.timeSeriesForecast({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.timeSeriesForecast();
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

  describe('createFineTuning', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // DataConnection
      const dataConnectionModel = {
        foo: 'testString',
      };

      // ObjectLocation
      const objectLocationModel = {
        id: 'testString',
        type: 'connection_asset',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
      };

      // BaseModel
      const baseModelModel = {
        model_id: 'google/flan-t5-xl',
      };

      // GPU
      const gpuModel = {
        num: 4,
        name: 'NVIDIA-A100-80GB-PCIe',
      };

      // FineTuningPeftParameters
      const fineTuningPeftParametersModel = {
        type: 'lora',
        rank: 8,
        target_modules: [],
        lora_alpha: 32,
        lora_dropout: 0.05,
      };

      // FineTuningParameters
      const fineTuningParametersModel = {
        task_id: 'testString',
        accumulate_steps: 1,
        base_model: baseModelModel,
        num_epochs: 5,
        learning_rate: 0.2,
        batch_size: 5,
        max_seq_length: 1024,
        response_template: '\\n\\n### Response:',
        verbalizer: '### Input: {{input}} \\n\\n### Response: {{output}}',
        gpu: gpuModel,
        peft_parameters: fineTuningPeftParametersModel,
      };

      function __createFineTuningTest() {
        // Construct the params object for operation createFineTuning
        const name = 'testString';
        const trainingDataReferences = [objectLocationModel];
        const resultsReference = objectLocationModel;
        const description = 'testString';
        const tags = ['t1', 't2'];
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = '3fc54cf1-252f-424b-b52d-5cdd9814987f';
        const autoUpdateModel = false;
        const parameters = fineTuningParametersModel;
        const type = 'ilab';
        const testDataReferences = [objectLocationModel];
        const custom = { name: 'model', size: 2 };
        const createFineTuningParams = {
          name,
          trainingDataReferences,
          resultsReference,
          description,
          tags,
          projectId,
          spaceId,
          autoUpdateModel,
          parameters,
          type,
          testDataReferences,
          custom,
        };

        const createFineTuningResult = watsonxAiMlService.createFineTuning(createFineTuningParams);

        // all methods should return a Promise
        expectToBePromise(createFineTuningResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/fine_tunings', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.training_data_references).toEqual(trainingDataReferences);
        expect(mockRequestOptions.body.results_reference).toEqual(resultsReference);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.tags).toEqual(tags);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.auto_update_model).toEqual(autoUpdateModel);
        expect(mockRequestOptions.body.parameters).toEqual(parameters);
        expect(mockRequestOptions.body.type).toEqual(type);
        expect(mockRequestOptions.body.test_data_references).toEqual(testDataReferences);
        expect(mockRequestOptions.body.custom).toEqual(custom);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createFineTuningTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createFineTuningTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createFineTuningTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'testString';
        const trainingDataReferences = [objectLocationModel];
        const resultsReference = objectLocationModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createFineTuningParams = {
          name,
          trainingDataReferences,
          resultsReference,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createFineTuning(createFineTuningParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });
    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createFineTuning({});
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createFineTuning();
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listFineTunings', () => {
    describe('positive tests', () => {
      function __fineTuningListTest() {
        // Construct the params object for operation listFineTunings
        const start = 'testString';
        const limit = 100;
        const totalCount = true;
        const tagValue = 'testString';
        const state = 'testString';
        const type = 'ilab';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const fineTuningListParams = {
          start,
          limit,
          totalCount,
          tagValue,
          state,
          type,
          spaceId,
          projectId,
        };

        const fineTuningListResult = watsonxAiMlService.listFineTunings(fineTuningListParams);

        // all methods should return a Promise
        expectToBePromise(fineTuningListResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/fine_tunings', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
        expect(mockRequestOptions.qs.total_count).toEqual(totalCount);
        expect(mockRequestOptions.qs['tag.value']).toEqual(tagValue);
        expect(mockRequestOptions.qs.state).toEqual(state);
        expect(mockRequestOptions.qs.type).toEqual(type);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __fineTuningListTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __fineTuningListTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __fineTuningListTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const fineTuningListParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listFineTunings(fineTuningListParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listFineTunings({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('FineTuningListPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v1/fine_tunings';
      const mockPagerResponse1 = {
        'next': { 'href': 'https://myhost.com/somePath?start=1' },
        'total_count': 2,
        'limit': 1,
        'resources': [
          {
            'metadata': {
              'id': 'id',
              'created_at': '2019-01-01T12:00:00.000Z',
              'rev': 'rev',
              'owner': 'owner',
              'modified_at': '2019-01-01T12:00:00.000Z',
              'parent_id': 'parent_id',
              'name': 'name',
              'description': 'description',
              'tags': ['tags'],
              'commit_info': {
                'committed_at': '2019-01-01T12:00:00.000Z',
                'commit_message': 'commit_message',
              },
              'space_id': '3fc54cf1-252f-424b-b52d-5cdd9814987f',
              'project_id': '12ac4cf1-252f-424b-b52d-5cdd9814987f',
            },
            'entity': {
              'auto_update_model': false,
              'parameters': {
                'task_id': 'task_id',
                'accumulate_steps': 1,
                'base_model': { 'model_id': 'google/flan-t5-xl' },
                'num_epochs': 5,
                'learning_rate': 0.2,
                'batch_size': 5,
                'max_seq_length': 1024,
                'response_template': '\n\n### Response:',
                'verbalizer': '### Input: {{input}} \n\n### Response: {{output}}',
                'gpu': { 'num': 4, 'name': 'NVIDIA-A100-80GB-PCIe' },
                'peft_parameters': {
                  'type': 'lora',
                  'rank': 8,
                  'target_modules': ['target_modules'],
                  'lora_alpha': 32,
                  'lora_dropout': 0.05,
                },
              },
              'type': 'ilab',
              'training_data_references': [
                {
                  'id': 'id',
                  'type': 'connection_asset',
                  'connection': {},
                  'location': { 'mapKey': 'inner' },
                },
              ],
              'test_data_references': [
                {
                  'id': 'id',
                  'type': 'connection_asset',
                  'connection': {},
                  'location': { 'mapKey': 'inner' },
                },
              ],
              'results_reference': {
                'id': 'id',
                'type': 'connection_asset',
                'connection': {},
                'location': { 'mapKey': 'inner' },
              },
              'custom': { 'anyKey': 'anyValue' },
              'status': {
                'running_at': '2017-01-30T10:11:12.000Z',
                'completed_at': '2017-01-30T10:11:12.000Z',
                'state': 'queued',
                'message': { 'level': 'info', 'text': 'The deployment is successful' },
                'metrics': [
                  {
                    'timestamp': '2023-09-22T02:52:03.324Z',
                    'iteration': 0,
                    'ml_metrics': { 'mapKey': 5 },
                    'fine_tuning_metrics': { 'anyKey': 'anyValue' },
                    'context': {
                      'deployment_id': 'deployment_id',
                      'prompt_tuning': { 'metrics_location': 'metrics_location' },
                      'locations': ['locations'],
                    },
                  },
                ],
                'failure': {
                  'trace': '3fd543d2-36e0-4f83-9be3-5c6dd498af4f',
                  'errors': [
                    {
                      'code': 'missing_field',
                      'message': "The 'name' field is required.",
                      'more_info': 'https://cloud.ibm.com/apidocs/machine-learning#models-get',
                      'target': { 'type': 'field', 'name': 'name' },
                    },
                  ],
                },
              },
            },
            'system': {
              'warnings': [
                {
                  'message': 'The framework TF 1.1 is deprecated.',
                  'id': '2fc54cf1-252f-424b-b52d-5cdd98149871',
                  'more_info': 'more_info',
                  'additional_properties': { 'anyKey': 'anyValue' },
                },
              ],
            },
          },
        ],
      };
      const mockPagerResponse2 = {
        'total_count': 2,
        'limit': 1,
        'resources': [
          {
            'metadata': {
              'id': 'id',
              'created_at': '2019-01-01T12:00:00.000Z',
              'rev': 'rev',
              'owner': 'owner',
              'modified_at': '2019-01-01T12:00:00.000Z',
              'parent_id': 'parent_id',
              'name': 'name',
              'description': 'description',
              'tags': ['tags'],
              'commit_info': {
                'committed_at': '2019-01-01T12:00:00.000Z',
                'commit_message': 'commit_message',
              },
              'space_id': '3fc54cf1-252f-424b-b52d-5cdd9814987f',
              'project_id': '12ac4cf1-252f-424b-b52d-5cdd9814987f',
            },
            'entity': {
              'auto_update_model': false,
              'parameters': {
                'task_id': 'task_id',
                'accumulate_steps': 1,
                'base_model': { 'model_id': 'google/flan-t5-xl' },
                'num_epochs': 5,
                'learning_rate': 0.2,
                'batch_size': 5,
                'max_seq_length': 1024,
                'response_template': '\n\n### Response:',
                'verbalizer': '### Input: {{input}} \n\n### Response: {{output}}',
                'gpu': { 'num': 4, 'name': 'NVIDIA-A100-80GB-PCIe' },
                'peft_parameters': {
                  'type': 'lora',
                  'rank': 8,
                  'target_modules': ['target_modules'],
                  'lora_alpha': 32,
                  'lora_dropout': 0.05,
                },
              },
              'type': 'ilab',
              'training_data_references': [
                {
                  'id': 'id',
                  'type': 'connection_asset',
                  'connection': {},
                  'location': { 'mapKey': 'inner' },
                },
              ],
              'test_data_references': [
                {
                  'id': 'id',
                  'type': 'connection_asset',
                  'connection': {},
                  'location': { 'mapKey': 'inner' },
                },
              ],
              'results_reference': {
                'id': 'id',
                'type': 'connection_asset',
                'connection': {},
                'location': { 'mapKey': 'inner' },
              },
              'custom': { 'anyKey': 'anyValue' },
              'status': {
                'running_at': '2017-01-30T10:11:12.000Z',
                'completed_at': '2017-01-30T10:11:12.000Z',
                'state': 'queued',
                'message': { 'level': 'info', 'text': 'The deployment is successful' },
                'metrics': [
                  {
                    'timestamp': '2023-09-22T02:52:03.324Z',
                    'iteration': 0,
                    'ml_metrics': { 'mapKey': 5 },
                    'fine_tuning_metrics': { 'anyKey': 'anyValue' },
                    'context': {
                      'deployment_id': 'deployment_id',
                      'prompt_tuning': { 'metrics_location': 'metrics_location' },
                      'locations': ['locations'],
                    },
                  },
                ],
                'failure': {
                  'trace': '3fd543d2-36e0-4f83-9be3-5c6dd498af4f',
                  'errors': [
                    {
                      'code': 'missing_field',
                      'message': "The 'name' field is required.",
                      'more_info': 'https://cloud.ibm.com/apidocs/machine-learning#models-get',
                      'target': { 'type': 'field', 'name': 'name' },
                    },
                  ],
                },
              },
            },
            'system': {
              'warnings': [
                {
                  'message': 'The framework TF 1.1 is deprecated.',
                  'id': '2fc54cf1-252f-424b-b52d-5cdd98149871',
                  'more_info': 'more_info',
                  'additional_properties': { 'anyKey': 'anyValue' },
                },
              ],
            },
          },
        ],
      };

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
          limit: 10,
          totalCount: true,
          tagValue: 'testString',
          state: 'testString',
          type: 'ilab',
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.FineTuningListPager(watsonxAiMlService, params);
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
          limit: 10,
          totalCount: true,
          tagValue: 'testString',
          state: 'testString',
          type: 'ilab',
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
        };
        const pager = new WatsonxAiMlVml_v1.FineTuningListPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('getFineTuning', () => {
    describe('positive tests', () => {
      function __getFineTuningTest() {
        // Construct the params object for operation getFineTuning
        const id = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const getFineTuningParams = {
          id,
          spaceId,
          projectId,
        };

        const getFineTuningResult = watsonxAiMlService.getFineTuning(getFineTuningParams);

        // all methods should return a Promise
        expectToBePromise(getFineTuningResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/fine_tunings/{id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getFineTuningTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getFineTuningTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getFineTuningTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getFineTuningParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getFineTuning(getFineTuningParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });
    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getFineTuning({});
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getFineTuning();
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteFineTuning', () => {
    describe('positive tests', () => {
      function __deleteFineTuningTest() {
        // Construct the params object for operation deleteFineTuning
        const id = 'testString';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const hardDelete = true;
        const deleteFineTuningParams = {
          id,
          spaceId,
          projectId,
          hardDelete,
        };

        const deleteFineTuningResult = watsonxAiMlService.deleteFineTuning(deleteFineTuningParams);

        // all methods should return a Promise
        expectToBePromise(deleteFineTuningResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/fine_tunings/{id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deleteFineTuningTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deleteFineTuningTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deleteFineTuningTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deleteFineTuningParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteFineTuning(deleteFineTuningParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });
    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteFineTuning({});
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteFineTuning();
        } catch (e) {
          err = e;
        }
        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createDocumentExtraction', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // DocumentExtractionObjectLocation
      const documentExtractionObjectLocationModel = {
        type: 'container',
        location: { 'key1': 'testString' },
      };

      // ObjectLocationGithub
      const objectLocationGithubModel = {
        type: 'github',
        location: { 'key1': 'testString' },
      };

      function __createDocumentExtractionTest() {
        // Construct the params object for operation createDocumentExtraction
        const name = 'testString';
        const documentReferences = [documentExtractionObjectLocationModel];
        const resultsReference = objectLocationGithubModel;
        const tags = ['t1', 't2'];
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = '3fc54cf1-252f-424b-b52d-5cdd9814987f';
        const createDocumentExtractionParams = {
          name,
          documentReferences,
          resultsReference,
          tags,
          projectId,
          spaceId,
        };

        const createDocumentExtractionResult = watsonxAiMlService.createDocumentExtraction(
          createDocumentExtractionParams
        );

        // all methods should return a Promise
        expectToBePromise(createDocumentExtractionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/documents', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.document_references).toEqual(documentReferences);
        expect(mockRequestOptions.body.results_reference).toEqual(resultsReference);
        expect(mockRequestOptions.body.tags).toEqual(tags);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createDocumentExtractionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createDocumentExtractionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createDocumentExtractionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'testString';
        const documentReferences = [documentExtractionObjectLocationModel];
        const resultsReference = objectLocationGithubModel;
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createDocumentExtractionParams = {
          name,
          documentReferences,
          resultsReference,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createDocumentExtraction(createDocumentExtractionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createDocumentExtraction({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createDocumentExtraction();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listDocumentExtractions', () => {
    describe('positive tests', () => {
      function __listDocumentExtractionsTest() {
        // Construct the params object for operation listDocumentExtractions
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const listDocumentExtractionsParams = {
          projectId,
          spaceId,
        };

        const listDocumentExtractionsResult = watsonxAiMlService.listDocumentExtractions(
          listDocumentExtractionsParams
        );

        // all methods should return a Promise
        expectToBePromise(listDocumentExtractionsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/documents', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listDocumentExtractionsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listDocumentExtractionsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listDocumentExtractionsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listDocumentExtractionsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listDocumentExtractions(listDocumentExtractionsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listDocumentExtractions({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });
  });

  describe('getDocumentExtraction', () => {
    describe('positive tests', () => {
      function __getDocumentExtractionTest() {
        // Construct the params object for operation getDocumentExtraction
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const getDocumentExtractionParams = {
          id,
          projectId,
          spaceId,
        };

        const getDocumentExtractionResult = watsonxAiMlService.getDocumentExtraction(
          getDocumentExtractionParams
        );

        // all methods should return a Promise
        expectToBePromise(getDocumentExtractionResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);
        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/documents/{id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getDocumentExtractionTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getDocumentExtractionTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getDocumentExtractionTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getDocumentExtractionParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getDocumentExtraction(getDocumentExtractionParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getDocumentExtraction({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getDocumentExtraction();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('cancelDocumentExtractions', () => {
    describe('positive tests', () => {
      function __cancelDocumentExtractionsTest() {
        // Construct the params object for operation cancelDocumentExtractions
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const hardDelete = true;
        const cancelDocumentExtractionsParams = {
          id,
          projectId,
          spaceId,
          hardDelete,
        };

        const cancelDocumentExtractionsResult = watsonxAiMlService.cancelDocumentExtractions(
          cancelDocumentExtractionsParams
        );

        // all methods should return a Promise
        expectToBePromise(cancelDocumentExtractionsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/documents/{id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __cancelDocumentExtractionsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __cancelDocumentExtractionsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __cancelDocumentExtractionsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const cancelDocumentExtractionsParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.cancelDocumentExtractions(cancelDocumentExtractionsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.cancelDocumentExtractions({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.cancelDocumentExtractions();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createSyntheticDataGeneration', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // DataConnection
      const dataConnectionModel = {
        foo: 'testString',
      };

      // SyntheticDataGenerationDataReference
      const syntheticDataGenerationDataReferenceModel = {
        type: 'connection_asset',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
      };

      // ObjectLocation
      const objectLocationModel = {
        id: 'testString',
        type: 'connection_asset',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
      };

      function __createSyntheticDataGenerationTest() {
        // Construct the params object for operation createSyntheticDataGeneration
        const name = 'example name';
        const spaceId = '3fc54cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const dataReference = syntheticDataGenerationDataReferenceModel;
        const resultsReference = objectLocationModel;
        const createSyntheticDataGenerationParams = {
          name,
          spaceId,
          projectId,
          dataReference,
          resultsReference,
        };

        const createSyntheticDataGenerationResult =
          watsonxAiMlService.createSyntheticDataGeneration(createSyntheticDataGenerationParams);

        // all methods should return a Promise
        expectToBePromise(createSyntheticDataGenerationResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/synthetic_data', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.data_reference).toEqual(dataReference);
        expect(mockRequestOptions.body.results_reference).toEqual(resultsReference);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createSyntheticDataGenerationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createSyntheticDataGenerationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createSyntheticDataGenerationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'example name';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createSyntheticDataGenerationParams = {
          name,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createSyntheticDataGeneration(createSyntheticDataGenerationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createSyntheticDataGeneration({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createSyntheticDataGeneration();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listSyntheticDataGenerations', () => {
    describe('positive tests', () => {
      function __listSyntheticDataGenerationsTest() {
        // Construct the params object for operation listSyntheticDataGenerations
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const listSyntheticDataGenerationsParams = {
          projectId,
          spaceId,
        };

        const listSyntheticDataGenerationsResult = watsonxAiMlService.listSyntheticDataGenerations(
          listSyntheticDataGenerationsParams
        );

        // all methods should return a Promise
        expectToBePromise(listSyntheticDataGenerationsResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/synthetic_data', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listSyntheticDataGenerationsTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listSyntheticDataGenerationsTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listSyntheticDataGenerationsTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listSyntheticDataGenerationsParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listSyntheticDataGenerations(listSyntheticDataGenerationsParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listSyntheticDataGenerations({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });
  });

  describe('getSyntheticDataGeneration', () => {
    describe('positive tests', () => {
      function __getSyntheticDataGenerationTest() {
        // Construct the params object for operation getSyntheticDataGeneration
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const getSyntheticDataGenerationParams = {
          id,
          projectId,
          spaceId,
        };

        const getSyntheticDataGenerationResult = watsonxAiMlService.getSyntheticDataGeneration(
          getSyntheticDataGenerationParams
        );

        // all methods should return a Promise
        expectToBePromise(getSyntheticDataGenerationResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/synthetic_data/{id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getSyntheticDataGenerationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getSyntheticDataGenerationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getSyntheticDataGenerationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getSyntheticDataGenerationParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getSyntheticDataGeneration(getSyntheticDataGenerationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getSyntheticDataGeneration({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getSyntheticDataGeneration();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('cancelSyntheticDataGeneration', () => {
    describe('positive tests', () => {
      function __cancelSyntheticDataGenerationTest() {
        // Construct the params object for operation cancelSyntheticDataGeneration
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const hardDelete = true;
        const cancelSyntheticDataGenerationParams = {
          id,
          projectId,
          spaceId,
          hardDelete,
        };

        const cancelSyntheticDataGenerationResult =
          watsonxAiMlService.cancelSyntheticDataGeneration(cancelSyntheticDataGenerationParams);

        // all methods should return a Promise
        expectToBePromise(cancelSyntheticDataGenerationResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/synthetic_data/{id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __cancelSyntheticDataGenerationTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __cancelSyntheticDataGenerationTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __cancelSyntheticDataGenerationTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const cancelSyntheticDataGenerationParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.cancelSyntheticDataGeneration(cancelSyntheticDataGenerationParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.cancelSyntheticDataGeneration({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.cancelSyntheticDataGeneration();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('createTaxonomy', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // DataConnection
      const dataConnectionModel = {
        foo: 'testString',
      };

      // ObjectLocation
      const objectLocationModel = {
        id: 'testString',
        type: 'connection_asset',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
      };

      function __createTaxonomyTest() {
        // Construct the params object for operation createTaxonomy
        const name = 'testString';
        const description = 'testString';
        const spaceId = '3fc54cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = '12ac4cf1-252f-424b-b52d-5cdd9814987f';
        const dataReference = objectLocationModel;
        const createTaxonomyParams = {
          name,
          description,
          spaceId,
          projectId,
          dataReference,
        };

        const createTaxonomyResult = watsonxAiMlService.createTaxonomy(createTaxonomyParams);

        // all methods should return a Promise
        expectToBePromise(createTaxonomyResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/taxonomies_imports', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.data_reference).toEqual(dataReference);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __createTaxonomyTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __createTaxonomyTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __createTaxonomyTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createTaxonomyParams = {
          name,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createTaxonomy(createTaxonomyParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createTaxonomy({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createTaxonomy();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listTaxonomies', () => {
    describe('positive tests', () => {
      function __listTaxonomiesTest() {
        // Construct the params object for operation listTaxonomies
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const listTaxonomiesParams = {
          projectId,
          spaceId,
        };

        const listTaxonomiesResult = watsonxAiMlService.listTaxonomies(listTaxonomiesParams);

        // all methods should return a Promise
        expectToBePromise(listTaxonomiesResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/taxonomies_imports', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __listTaxonomiesTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __listTaxonomiesTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __listTaxonomiesTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listTaxonomiesParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listTaxonomies(listTaxonomiesParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listTaxonomies({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });
  });

  describe('getTaxonomy', () => {
    describe('positive tests', () => {
      function __getTaxonomyTest() {
        // Construct the params object for operation getTaxonomy
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const getTaxonomyParams = {
          id,
          projectId,
          spaceId,
        };

        const getTaxonomyResult = watsonxAiMlService.getTaxonomy(getTaxonomyParams);

        // all methods should return a Promise
        expectToBePromise(getTaxonomyResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/taxonomies_imports/{id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __getTaxonomyTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __getTaxonomyTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __getTaxonomyTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getTaxonomyParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getTaxonomy(getTaxonomyParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getTaxonomy({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getTaxonomy();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteTaxonomy', () => {
    describe('positive tests', () => {
      function __deleteTaxonomyTest() {
        // Construct the params object for operation deleteTaxonomy
        const id = 'testString';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const hardDelete = true;
        const deleteTaxonomyParams = {
          id,
          projectId,
          spaceId,
          hardDelete,
        };

        const deleteTaxonomyResult = watsonxAiMlService.deleteTaxonomy(deleteTaxonomyParams);

        // all methods should return a Promise
        expectToBePromise(deleteTaxonomyResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v1/tuning/taxonomies_imports/{id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.hard_delete).toEqual(hardDelete);
        expect(mockRequestOptions.path.id).toEqual(id);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __deleteTaxonomyTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __deleteTaxonomyTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __deleteTaxonomyTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const id = 'testString';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deleteTaxonomyParams = {
          id,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteTaxonomy(deleteTaxonomyParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTaxonomy({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteTaxonomy();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });
  describe('createModel', () => {
    describe('positive tests', () => {
      // Request models needed by this operation.

      // SoftwareSpecRel
      const softwareSpecRelModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        rev: '2',
        name: 'testString',
      };

      // Rel
      const relModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        rev: '2',
      };

      // ModelDefinitionId
      const modelDefinitionIdModel = {
        id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
      };

      // DataConnection
      const dataConnectionModel = {
        foo: 'testString',
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
        id: '8d3682dd-2858-43c9-bfd7-12a79abcfb0c',
        type: 'connection_asset',
        connection: dataConnectionModel,
        location: { 'key1': 'testString' },
        schema: dataSchemaModel,
      };

      // ModelEntitySchemas
      const modelEntitySchemasModel = {
        input: [dataSchemaModel],
        output: [dataSchemaModel],
      };

      // ModelEntitySize
      const modelEntitySizeModel = {
        in_memory: 72.5,
        content: 72.5,
      };

      // TsTrainingTraining
      const tsTrainingTrainingModel = {
        neg_symmetric_mean_absolute_percentage_error: -38.35790647931252,
      };

      // MetricTsMetricsTsTraining
      const metricTsMetricsModel = {
        training: tsTrainingTrainingModel,
      };

      // TsadHoldoutIterationsItemAveragePrecision
      const tsadHoldoutIterationsItemAveragePrecisionModel = {
        localized_extreme: 0.5294117647058824,
        level_shift: 1,
        variance: 0.5471792823589406,
        trend: 0.8183221870721871,
      };

      // TsadHoldoutIterationsItem
      const tsadHoldoutIterationsItemModel = {
        average_precision: tsadHoldoutIterationsItemAveragePrecisionModel,
        roc_auc: {
          localized_extreme: 0.13559322033898305,
          level_shift: 0,
          variance: 0.2501797268152408,
          trend: 0.009259259259259259,
        },
        f1: {
          localized_extreme: 0.16666666666666669,
          level_shift: 0.8,
          variance: 0.41666666666666663,
          trend: 0.7741935483870968,
        },
        precision: {
          localized_extreme: 0.1,
          level_shift: 0.6666666666666666,
          variance: 0.45454545454545453,
          trend: 0.631578947368421,
        },
        recall: { localized_extreme: 0.5, level_shift: 1, variance: 0.38461538461538464, trend: 1 },
      };

      // TsadHoldoutAggAveragePrecisionLevelShift
      const tsadHoldoutAggAveragePrecisionLevelShiftModel = {
        mean: 1,
        range: [-1, 1],
      };

      // TsadHoldoutAggAveragePrecisionLocalizedExtreme
      const tsadHoldoutAggAveragePrecisionLocalizedExtremeModel = {
        mean: 1,
        range: [-1, 1],
      };

      // TsadHoldoutAggAveragePrecisionTrend
      const tsadHoldoutAggAveragePrecisionTrendModel = {
        mean: 1,
        range: [-1, 1],
      };

      // Variance
      const varianceModel = {
        mean: 1,
        range: [-1, 1],
      };

      // TsadHoldoutAggAveragePrecision
      const tsadHoldoutAggAveragePrecisionModel = {
        level_shift: tsadHoldoutAggAveragePrecisionLevelShiftModel,
        localized_extreme: tsadHoldoutAggAveragePrecisionLocalizedExtremeModel,
        trend: tsadHoldoutAggAveragePrecisionTrendModel,
        variance: varianceModel,
      };

      // TsadHoldoutAggF1
      const tsadHoldoutAggF1Model = {
        level_shift: { mean: '0.7798245614035088,', range: [0.7499999999999999, 0.8] },
        localized_extreme: {
          mean: 0.17676767676767677,
          range: [0.16666666666666669, 0.1818181818181818],
        },
        trend: { mean: 0.7585532746823068, range: [0.7272727272727273, 0.7741935483870968] },
        variance: varianceModel,
      };

      // TsadHoldoutAggPrecision
      const tsadHoldoutAggPrecisionModel = {
        level_shift: { mean: 0.7798245614035088, range: [0.7499999999999999, 0.8] },
        localized_extreme: {
          mean: 0.17676767676767677,
          range: [0.16666666666666669, 0.1818181818181818],
        },
        trend: { mean: 0.7585532746823068, range: [0.7272727272727273, 0.7741935483870968] },
        variance: varianceModel,
      };

      // TsadHoldoutAggRecall
      const tsadHoldoutAggRecallModel = {
        level_shift: { mean: 0.7798245614035088, range: [0.7499999999999999, 0.8] },
        localized_extreme: {
          mean: 0.17676767676767677,
          range: [0.16666666666666669, 0.1818181818181818],
        },
        trend: { mean: 0.7585532746823068, range: [0.7272727272727273, 0.7741935483870968] },
        variance: varianceModel,
      };

      // TsadHoldoutAggRocAuc
      const tsadHoldoutAggRocAucModel = {
        level_shift: { mean: 0.7798245614035088, range: [0.7499999999999999, 0.8] },
        localized_extreme: {
          mean: 0.17676767676767677,
          range: [0.16666666666666669, 0.1818181818181818],
        },
        trend: { mean: 0.7585532746823068, range: [0.7272727272727273, 0.7741935483870968] },
        variance: varianceModel,
      };

      // TsadHoldoutAgg
      const tsadHoldoutAggModel = {
        average_precision: tsadHoldoutAggAveragePrecisionModel,
        f1: tsadHoldoutAggF1Model,
        precision: tsadHoldoutAggPrecisionModel,
        recall: tsadHoldoutAggRecallModel,
        roc_auc: tsadHoldoutAggRocAucModel,
      };

      // TsadHoldoutSupportingRankAveragePrecisionLevelShift
      const tsadHoldoutSupportingRankAveragePrecisionLevelShiftModel = {
        p1: 2,
        p2: 2,
        p3: 2,
        p4: 5,
        p5: 5,
        p6: 6,
      };

      // TsadHoldoutSupportingRankAveragePrecision
      const tsadHoldoutSupportingRankAveragePrecisionModel = {
        level_shift: tsadHoldoutSupportingRankAveragePrecisionLevelShiftModel,
        localized_extreme: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
        trend: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
        variance: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
      };

      // TsadHoldoutSupportingRank
      const tsadHoldoutSupportingRankModel = {
        average_precision: tsadHoldoutSupportingRankAveragePrecisionModel,
        f1: {
          level_shift: { p1: 2, p2: 2, p5: 2, p4: 4, p6: 5, p3: 6 },
          localized_extreme: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
          trend: { p1: 1.5, p2: 1.5, p5: 3, p6: 4, p4: 5, p3: 6 },
          variance: { p4: 1, p5: 2, p6: 3, p3: 4, p1: 5, p2: 6 },
        },
        roc_auc: {
          level_shift: { p1: 2, p2: 2, p5: 2, p4: 4, p6: 5, p3: 6 },
          localized_extreme: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
          trend: { p1: 1.5, p2: 1.5, p5: 3, p6: 4, p4: 5, p3: 6 },
          variance: { p4: 1, p5: 2, p6: 3, p3: 4, p1: 5, p2: 6 },
        },
        precision: {
          level_shift: { p1: 2, p2: 2, p5: 2, p4: 4, p6: 5, p3: 6 },
          localized_extreme: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
          trend: { p1: 1.5, p2: 1.5, p5: 3, p6: 4, p4: 5, p3: 6 },
          variance: { p4: 1, p5: 2, p6: 3, p3: 4, p1: 5, p2: 6 },
        },
        recall: {
          level_shift: { p1: 2, p2: 2, p5: 2, p4: 4, p6: 5, p3: 6 },
          localized_extreme: { p1: 1, p2: 2, p3: 3, p4: 4, p5: 5, p6: 6 },
          trend: { p1: 1.5, p2: 1.5, p5: 3, p6: 4, p4: 5, p3: 6 },
          variance: { p4: 1, p5: 2, p6: 3, p3: 4, p1: 5, p2: 6 },
        },
      };

      // TsadHoldoutAggregatedScoreItem
      const tsadHoldoutAggregatedScoreItemModel = {
        p1: 14.5,
        p2: 12,
        p3: 12,
        p4: 10,
        p5: 6,
        p6: 5,
      };

      // MetricTsadMetricsTsadHoldout
      const metricTsadMetricsModel = {
        iterations: [tsadHoldoutIterationsItemModel],
        agg: tsadHoldoutAggModel,
        supporting_rank: tsadHoldoutSupportingRankModel,
        aggregated_score: [tsadHoldoutAggregatedScoreItemModel],
      };

      // RemoteTrainingSystemMetric
      const remoteTrainingSystemMetricModel = {
        id: 'testString',
        local: 72.5,
        fused: 72.5,
      };

      // MlFederatedMetric
      const mlFederatedMetricModel = {
        remote_training_systems: [remoteTrainingSystemMetricModel],
        global: 72.5,
      };

      // ModelLocation
      const modelLocationModel = {
        pipeline: 'testString',
        pipeline_model: 'testString',
        model: 'testString',
      };

      // IntermediateModel
      const intermediateModelModel = {
        name: 'my_pipeline',
        process: 'testString',
        location: modelLocationModel,
        notebook_location: 'testString',
        sdk_notebook_location: 'testString',
        pipeline_nodes: ['testString'],
        composition_steps: ['testString'],
        duration: 38,
        model_asset: 'testString',
      };

      // StepInfo
      const stepInfoModel = {
        id: 'testString',
        name: 'testString',
        started_at: '2019-01-01T12:00:00.000Z',
        completed_at: '2019-01-01T12:00:00.000Z',
        hyper_parameters: { anyKey: 'anyValue' },
        data_allocation: 38,
        estimator: 'testString',
        transformer: 'testString',
        score: 72.5,
      };

      // ConfusionMatrix
      const confusionMatrixModel = {
        true_class: 'testString',
        tp: 38,
        tn: 38,
        fp: 38,
        fn: 38,
      };

      // RocCurve
      const rocCurveModel = {
        true_class: 'testString',
        tpr: [72.5],
        fpr: [72.5],
        thresholds: [72.5],
      };

      // BinaryClassification
      const binaryClassificationModel = {
        confusion_matrices: [confusionMatrixModel],
        roc_curves: [rocCurveModel],
      };

      // MultiClassClassification
      const multiClassClassificationModel = {
        class: 'testString',
        confusion_matrix_location:
          'data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/confusion_matrix.json',
        confusion_matrix: confusionMatrixModel,
        roc_curve_location:
          'data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/roc_curve.json',
        roc_curve: rocCurveModel,
      };

      // MultiClassClassifications
      const multiClassClassificationsModel = {
        one_vs_all: [multiClassClassificationModel],
        one_vs_all_location:
          'data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/one_vs_all.json',
      };

      // FeatureImportance
      const featureImportanceModel = {
        computation_type: 'testString',
        features: { 'key1': 72.5 },
        min_max_normalization: true,
      };

      // IncrementalTraining
      const incrementalTrainingModel = {
        iteration: 10,
        total_iterations: 30,
        measures_location: '/path_to_csv',
        train_batch_samples_count: 10786,
        holdout_samples_count: 6784,
        early_stop_triggered: true,
      };

      // MetricsContext
      const metricsContextModel = {
        deployment_id: 'testString',
        intermediate_model: intermediateModelModel,
        phase: 'testString',
        step: stepInfoModel,
        classes: ['positive', 'negative', 'neutral'],
        binary_classification: binaryClassificationModel,
        multi_class_classification: multiClassClassificationsModel,
        features_importance: [featureImportanceModel],
        schema: 'testString',
        estimators: ['testString'],
        incremental_training: incrementalTrainingModel,
        prediction_type: 'regression',
      };

      // Metric
      const metricModel = {
        timestamp: '2018-12-01T10:11:12.000Z',
        iteration: 2,
        ml_metrics: { 'key1': 72.5 },
        ts_metrics: metricTsMetricsModel,
        tsad_metrics: metricTsadMetricsModel,
        ml_federated_metrics: { 'key1': mlFederatedMetricModel },
        context: metricsContextModel,
      };

      // ModelEntityModelVersion
      const modelEntityModelVersionModel = {
        number: '1.0.0',
        tag: 'xgb classifier',
        description: 'Providing an update to the version.',
      };

      // DataInput
      const dataInputModel = {
        rows: 50000,
        columns: 81,
      };

      // DataOutput
      const dataOutputModel = {
        rows: 1463,
        columns: 81,
      };

      // DataPreprocessingTransformation
      const dataPreprocessingTransformationModel = {
        stage: 'sampling',
        input: dataInputModel,
        output: dataOutputModel,
        props: { outliers_count: 1, duplicated_rows_count: 2 },
      };

      // BaseModel
      const baseModelModel = {
        model_id: 'google/flan-t5-xl',
      };

      // TrainingDetails
      const trainingDetailsModel = {
        id: 'b8e64f4b-ead1-47f3-abf6-8247b2826763',
        base_model: baseModelModel,
        task_id: 'summarization',
        verbalizer: '{{input}}',
      };

      // ContentInfo
      const contentInfoModel = {
        content_format: 'testString',
        location: 'testString',
        file_name: 'testString',
        pipeline_node_id: 'testString',
        deployment_id: 'testString',
      };

      // ContentLocation
      const contentLocationModel = {
        contents: [contentInfoModel],
        type: 'connection_asset',
        connection: { 'key1': 'testString' },
        location: { 'key1': 'testString' },
      };

      function __modelsCreateTest() {
        // Construct the params object for operation modelsCreate
        const name = 'my-flan-t5-xl';
        const type = 'curated_foundation_model_1.0';
        const projectId = 'testString';
        const spaceId = '37c69d0e-a2c2-413b-bd27-a03c15967b2f';
        const description = 'testString';
        const tags = ['testString'];
        const softwareSpec = softwareSpecRelModel;
        const pipeline = relModel;
        const modelDefinition = modelDefinitionIdModel;
        const hyperParameters = { anyKey: 'anyValue' };
        const domain = 'testString';
        const trainingDataReferences = [dataConnectionReferenceModel];
        const testDataReferences = [dataConnectionReferenceModel];
        const schemas = modelEntitySchemasModel;
        const labelColumn = 'testString';
        const transformedLabelColumn = 'testString';
        const size = modelEntitySizeModel;
        const metrics = [metricModel];
        const custom = { anyKey: 'anyValue' };
        const userDefinedObjects = { 'key1': 'testString' };
        const hybridPipelineSoftwareSpecs = [softwareSpecRelModel];
        const modelVersion = modelEntityModelVersionModel;
        const trainingId = 'testString';
        const dataPreprocessing = [dataPreprocessingTransformationModel];
        const training = trainingDetailsModel;
        const contentLocation = contentLocationModel;
        const modelsCreateParams = {
          name,
          type,
          projectId,
          spaceId,
          description,
          tags,
          softwareSpec,
          pipeline,
          modelDefinition,
          hyperParameters,
          domain,
          trainingDataReferences,
          testDataReferences,
          schemas,
          labelColumn,
          transformedLabelColumn,
          size,
          metrics,
          custom,
          userDefinedObjects,
          hybridPipelineSoftwareSpecs,
          modelVersion,
          trainingId,
          dataPreprocessing,
          training,
          contentLocation,
        };

        const modelsCreateResult = watsonxAiMlService.createModel(modelsCreateParams);

        // all methods should return a Promise
        expectToBePromise(modelsCreateResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/models', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.body.name).toEqual(name);
        expect(mockRequestOptions.body.type).toEqual(type);
        expect(mockRequestOptions.body.project_id).toEqual(projectId);
        expect(mockRequestOptions.body.space_id).toEqual(spaceId);
        expect(mockRequestOptions.body.description).toEqual(description);
        expect(mockRequestOptions.body.tags).toEqual(tags);
        expect(mockRequestOptions.body.software_spec).toEqual(softwareSpec);
        expect(mockRequestOptions.body.pipeline).toEqual(pipeline);
        expect(mockRequestOptions.body.model_definition).toEqual(modelDefinition);
        expect(mockRequestOptions.body.hyper_parameters).toEqual(hyperParameters);
        expect(mockRequestOptions.body.domain).toEqual(domain);
        expect(mockRequestOptions.body.training_data_references).toEqual(trainingDataReferences);
        expect(mockRequestOptions.body.test_data_references).toEqual(testDataReferences);
        expect(mockRequestOptions.body.schemas).toEqual(schemas);
        expect(mockRequestOptions.body.label_column).toEqual(labelColumn);
        expect(mockRequestOptions.body.transformed_label_column).toEqual(transformedLabelColumn);
        expect(mockRequestOptions.body.size).toEqual(size);
        expect(mockRequestOptions.body.metrics).toEqual(metrics);
        expect(mockRequestOptions.body.custom).toEqual(custom);
        expect(mockRequestOptions.body.user_defined_objects).toEqual(userDefinedObjects);
        expect(mockRequestOptions.body.hybrid_pipeline_software_specs).toEqual(
          hybridPipelineSoftwareSpecs
        );
        expect(mockRequestOptions.body.model_version).toEqual(modelVersion);
        expect(mockRequestOptions.body.training_id).toEqual(trainingId);
        expect(mockRequestOptions.body.data_preprocessing).toEqual(dataPreprocessing);
        expect(mockRequestOptions.body.training).toEqual(training);
        expect(mockRequestOptions.body.content_location).toEqual(contentLocation);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __modelsCreateTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __modelsCreateTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __modelsCreateTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const name = 'my-flan-t5-xl';
        const type = 'curated_foundation_model_1.0';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const modelsCreateParams = {
          name,
          type,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.createModel(modelsCreateParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.createModel({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.createModel();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('listModels', () => {
    describe('positive tests', () => {
      function __modelsListTest() {
        // Construct the params object for operation modelsList
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const start = 'testString';
        const limit = 50;
        const tagValue = 'tf2.0 or tf2.1';
        const search = 'testString';
        const modelsListParams = {
          spaceId,
          projectId,
          start,
          limit,
          tagValue,
          search,
        };

        const modelsListResult = watsonxAiMlService.listModels(modelsListParams);

        // all methods should return a Promise
        expectToBePromise(modelsListResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/models', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.start).toEqual(start);
        expect(mockRequestOptions.qs.limit).toEqual(limit);
        expect(mockRequestOptions.qs['tag.value']).toEqual(tagValue);
        expect(mockRequestOptions.qs.search).toEqual(search);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __modelsListTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __modelsListTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __modelsListTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const modelsListParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.listModels(modelsListParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAiMlService.listModels({});
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('ModelsListPager tests', () => {
      const serviceUrl = watsonxAiMlServiceOptions.url;
      const path = '/ml/v4/models';
      const mockPagerResponse1 =
        '{"next":{"href":"https://myhost.com/somePath?start=1"},"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","rev":"rev","owner":"owner","modified_at":"2019-01-01T12:00:00.000Z","parent_id":"parent_id","name":"name","description":"description","tags":["tags"],"commit_info":{"committed_at":"2019-01-01T12:00:00.000Z","commit_message":"commit_message"},"space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"type":"tensorflow_1.5","software_spec":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2","name":"name"},"pipeline":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2"},"model_definition":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab"},"hyper_parameters":{"anyKey":"anyValue"},"domain":"domain","training_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"test_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"schemas":{"input":[{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}],"output":[{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}]},"label_column":"label_column","transformed_label_column":"transformed_label_column","size":{"in_memory":9,"content":7},"metrics":[{"timestamp":"2018-12-01T10:11:12.000Z","iteration":2,"ml_metrics":{"mapKey":5},"ts_metrics":{"training":{"neg_symmetric_mean_absolute_percentage_error":-38.35790647931252}},"tsad_metrics":{"iterations":[{"average_precision":{"localized_extreme":0.5294117647058824,"level_shift":1,"variance":0.5471792823589406,"trend":0.8183221870721871},"roc_auc":{"anyKey":"anyValue"},"f1":{"anyKey":"anyValue"},"precision":{"anyKey":"anyValue"},"recall":{"anyKey":"anyValue"}}],"agg":{"average_precision":{"level_shift":{"mean":1,"range":[5]},"localized_extreme":{"mean":1,"range":[5]},"trend":{"mean":1,"range":[5]},"variance":{"mean":1,"range":[5]}},"f1":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"precision":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"recall":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"roc_auc":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}}},"supporting_rank":{"average_precision":{"level_shift":{"p1":2,"p2":2,"p3":2,"p4":5,"p5":5,"p6":6},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"anyKey":"anyValue"}},"f1":{"anyKey":"anyValue"},"roc_auc":{"anyKey":"anyValue"},"precision":{"anyKey":"anyValue"},"recall":{"anyKey":"anyValue"}},"aggregated_score":[{"p1":14.5,"p2":12,"p3":12,"p4":10,"p5":6,"p6":5}]},"ml_federated_metrics":{"mapKey":{"remote_training_systems":[{"id":"id","local":5,"fused":5}],"global":6}},"context":{"deployment_id":"deployment_id","intermediate_model":{"name":"my_pipeline","process":"process","location":{"pipeline":"pipeline","pipeline_model":"pipeline_model","model":"model"},"notebook_location":"notebook_location","sdk_notebook_location":"sdk_notebook_location","pipeline_nodes":["pipeline_nodes"],"composition_steps":["composition_steps"],"duration":8,"model_asset":"model_asset"},"phase":"phase","step":{"id":"id","name":"name","started_at":"2019-01-01T12:00:00.000Z","completed_at":"2019-01-01T12:00:00.000Z","hyper_parameters":{"anyKey":"anyValue"},"data_allocation":15,"estimator":"estimator","transformer":"transformer","score":5},"classes":["anyValue"],"binary_classification":{"confusion_matrices":[{"true_class":"true_class","tp":2,"tn":2,"fp":2,"fn":2}],"roc_curves":[{"true_class":"true_class","tpr":[3],"fpr":[3],"thresholds":[10]}]},"multi_class_classification":{"one_vs_all":[{"class":"class","confusion_matrix_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/confusion_matrix.json","confusion_matrix":{"true_class":"true_class","tp":2,"tn":2,"fp":2,"fn":2},"roc_curve_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/roc_curve.json","roc_curve":{"true_class":"true_class","tpr":[3],"fpr":[3],"thresholds":[10]}}],"one_vs_all_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/one_vs_all.json"},"features_importance":[{"computation_type":"computation_type","features":{"mapKey":5},"min_max_normalization":true}],"schema":"schema","estimators":["estimators"],"incremental_training":{"iteration":10,"total_iterations":30,"measures_location":"/path_to_csv","train_batch_samples_count":10786,"holdout_samples_count":6784,"early_stop_triggered":true},"prediction_type":"regression"}}],"custom":{"anyKey":"anyValue"},"user_defined_objects":{"mapKey":"inner"},"hybrid_pipeline_software_specs":[{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2","name":"name"}],"model_version":{"number":"1.0.0","tag":"xgb classifier","description":"Providing an update to the version."},"training_id":"b8e64f4b-ead1-47f3-abf6-8247b2826763","data_preprocessing":[{"stage":"sampling","input":{"rows":50000,"columns":81},"output":{"rows":1463,"columns":81},"props":{"anyKey":"anyValue"}}],"training":{"id":"b8e64f4b-ead1-47f3-abf6-8247b2826763","base_model":{"model_id":"google/flan-t5-xl"},"task_id":"summarization","verbalizer":"{{input}}"},"content_import_state":"completed"},"system":{"warnings":[{"message":"The framework TF 1.1 is deprecated.","id":"2fc54cf1-252f-424b-b52d-5cdd98149871","more_info":"more_info","additional_properties":{"anyKey":"anyValue"}}]}}]}';
      const mockPagerResponse2 =
        '{"total_count":2,"limit":1,"resources":[{"metadata":{"id":"id","created_at":"2019-01-01T12:00:00.000Z","rev":"rev","owner":"owner","modified_at":"2019-01-01T12:00:00.000Z","parent_id":"parent_id","name":"name","description":"description","tags":["tags"],"commit_info":{"committed_at":"2019-01-01T12:00:00.000Z","commit_message":"commit_message"},"space_id":"3fc54cf1-252f-424b-b52d-5cdd9814987f","project_id":"12ac4cf1-252f-424b-b52d-5cdd9814987f"},"entity":{"type":"tensorflow_1.5","software_spec":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2","name":"name"},"pipeline":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2"},"model_definition":{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab"},"hyper_parameters":{"anyKey":"anyValue"},"domain":"domain","training_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"test_data_references":[{"id":"8d3682dd-2858-43c9-bfd7-12a79abcfb0c","type":"connection_asset","connection":{},"location":{"mapKey":"inner"},"schema":{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}}],"schemas":{"input":[{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}],"output":[{"id":"t1","name":"Tasks","fields":[{"anyKey":"anyValue"}],"type":"struct"}]},"label_column":"label_column","transformed_label_column":"transformed_label_column","size":{"in_memory":9,"content":7},"metrics":[{"timestamp":"2018-12-01T10:11:12.000Z","iteration":2,"ml_metrics":{"mapKey":5},"ts_metrics":{"training":{"neg_symmetric_mean_absolute_percentage_error":-38.35790647931252}},"tsad_metrics":{"iterations":[{"average_precision":{"localized_extreme":0.5294117647058824,"level_shift":1,"variance":0.5471792823589406,"trend":0.8183221870721871},"roc_auc":{"anyKey":"anyValue"},"f1":{"anyKey":"anyValue"},"precision":{"anyKey":"anyValue"},"recall":{"anyKey":"anyValue"}}],"agg":{"average_precision":{"level_shift":{"mean":1,"range":[5]},"localized_extreme":{"mean":1,"range":[5]},"trend":{"mean":1,"range":[5]},"variance":{"mean":1,"range":[5]}},"f1":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"precision":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"recall":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}},"roc_auc":{"level_shift":{"anyKey":"anyValue"},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"mean":1,"range":[5]}}},"supporting_rank":{"average_precision":{"level_shift":{"p1":2,"p2":2,"p3":2,"p4":5,"p5":5,"p6":6},"localized_extreme":{"anyKey":"anyValue"},"trend":{"anyKey":"anyValue"},"variance":{"anyKey":"anyValue"}},"f1":{"anyKey":"anyValue"},"roc_auc":{"anyKey":"anyValue"},"precision":{"anyKey":"anyValue"},"recall":{"anyKey":"anyValue"}},"aggregated_score":[{"p1":14.5,"p2":12,"p3":12,"p4":10,"p5":6,"p6":5}]},"ml_federated_metrics":{"mapKey":{"remote_training_systems":[{"id":"id","local":5,"fused":5}],"global":6}},"context":{"deployment_id":"deployment_id","intermediate_model":{"name":"my_pipeline","process":"process","location":{"pipeline":"pipeline","pipeline_model":"pipeline_model","model":"model"},"notebook_location":"notebook_location","sdk_notebook_location":"sdk_notebook_location","pipeline_nodes":["pipeline_nodes"],"composition_steps":["composition_steps"],"duration":8,"model_asset":"model_asset"},"phase":"phase","step":{"id":"id","name":"name","started_at":"2019-01-01T12:00:00.000Z","completed_at":"2019-01-01T12:00:00.000Z","hyper_parameters":{"anyKey":"anyValue"},"data_allocation":15,"estimator":"estimator","transformer":"transformer","score":5},"classes":["anyValue"],"binary_classification":{"confusion_matrices":[{"true_class":"true_class","tp":2,"tn":2,"fp":2,"fn":2}],"roc_curves":[{"true_class":"true_class","tpr":[3],"fpr":[3],"thresholds":[10]}]},"multi_class_classification":{"one_vs_all":[{"class":"class","confusion_matrix_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/confusion_matrix.json","confusion_matrix":{"true_class":"true_class","tp":2,"tn":2,"fp":2,"fn":2},"roc_curve_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/roc_curve.json","roc_curve":{"true_class":"true_class","tpr":[3],"fpr":[3],"thresholds":[10]}}],"one_vs_all_location":"data/7d9ac934-9073-4ffd-846c-7b1f912b1ab2/data/autoai/pre_hpo_d_output/Pipeline1/one_vs_all.json"},"features_importance":[{"computation_type":"computation_type","features":{"mapKey":5},"min_max_normalization":true}],"schema":"schema","estimators":["estimators"],"incremental_training":{"iteration":10,"total_iterations":30,"measures_location":"/path_to_csv","train_batch_samples_count":10786,"holdout_samples_count":6784,"early_stop_triggered":true},"prediction_type":"regression"}}],"custom":{"anyKey":"anyValue"},"user_defined_objects":{"mapKey":"inner"},"hybrid_pipeline_software_specs":[{"id":"4cedab6d-e8e4-4214-b81a-2ddb122db2ab","rev":"2","name":"name"}],"model_version":{"number":"1.0.0","tag":"xgb classifier","description":"Providing an update to the version."},"training_id":"b8e64f4b-ead1-47f3-abf6-8247b2826763","data_preprocessing":[{"stage":"sampling","input":{"rows":50000,"columns":81},"output":{"rows":1463,"columns":81},"props":{"anyKey":"anyValue"}}],"training":{"id":"b8e64f4b-ead1-47f3-abf6-8247b2826763","base_model":{"model_id":"google/flan-t5-xl"},"task_id":"summarization","verbalizer":"{{input}}"},"content_import_state":"completed"},"system":{"warnings":[{"message":"The framework TF 1.1 is deprecated.","id":"2fc54cf1-252f-424b-b52d-5cdd98149871","more_info":"more_info","additional_properties":{"anyKey":"anyValue"}}]}}]}';

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
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
          limit: 50,
          tagValue: 'tf2.0 or tf2.1',
          search: 'testString',
        };
        const allResults = [];
        const pager = new WatsonxAiMlVml_v1.ModelsListPager(watsonxAiMlService, params);
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
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          projectId: 'a77190a2-f52d-4f2a-be3d-7867b5f46edc',
          limit: 50,
          tagValue: 'tf2.0 or tf2.1',
          search: 'testString',
        };
        const pager = new WatsonxAiMlVml_v1.ModelsListPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('getModel', () => {
    describe('positive tests', () => {
      function __modelsGetTest() {
        // Construct the params object for operation modelsGet
        const modelId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const rev = '2';
        const modelsGetParams = {
          modelId,
          spaceId,
          projectId,
          rev,
        };

        const modelsGetResult = watsonxAiMlService.getModel(modelsGetParams);

        // all methods should return a Promise
        expectToBePromise(modelsGetResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/models/{model_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.qs.rev).toEqual(rev);
        expect(mockRequestOptions.path.model_id).toEqual(modelId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __modelsGetTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __modelsGetTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __modelsGetTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const modelsGetParams = {
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.getModel(modelsGetParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.getModel({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.getModel();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });

  describe('deleteModel', () => {
    describe('positive tests', () => {
      function __modelsDeleteTest() {
        // Construct the params object for operation modelsDelete
        const modelId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const spaceId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const projectId = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';
        const modelsDeleteParams = {
          modelId,
          spaceId,
          projectId,
        };

        const modelsDeleteResult = watsonxAiMlService.deleteModel(modelsDeleteParams);

        // all methods should return a Promise
        expectToBePromise(modelsDeleteResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/ml/v4/models/{model_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        expect(mockRequestOptions.qs.version).toEqual(watsonxAiMlServiceOptions.version);
        expect(mockRequestOptions.qs.space_id).toEqual(spaceId);
        expect(mockRequestOptions.qs.project_id).toEqual(projectId);
        expect(mockRequestOptions.path.model_id).toEqual(modelId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        __modelsDeleteTest();

        // enable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.enableRetries();
        __modelsDeleteTest();

        // disable retries and test again
        createRequestMock.mockClear();
        watsonxAiMlService.disableRetries();
        __modelsDeleteTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const modelId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const modelsDeleteParams = {
          modelId,
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAiMlService.deleteModel(modelsDeleteParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteModel({});
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        let err;
        try {
          await watsonxAiMlService.deleteModel();
        } catch (e) {
          err = e;
        }

        expect(err.message).toMatch(/Missing required parameters/);
      });
    });
  });
});
