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

const { NoAuthAuthenticator } = sdkCorePackage;
const { WatsonXAI } = require('../../dist/vml_v1');
const { checkAxiosOptions } = require('./utils/checks');
const { MockingRequest } = require('../utils/utils');

const {
  getOptions,
  checkUrlAndMethod,
  checkMediaHeaders,
  expectToBePromise,
  checkForSuccessfulExecution,
} = unitTestUtils;

const watsonxAIServiceOptions = {
  authenticator: new NoAuthAuthenticator(),
  url: 'https://api.dataplatform.cloud.ibm.com',
  version: '2023-07-07',
};

const watsonxAIService = new WatsonXAI(watsonxAIServiceOptions);
const createRequestMocker = new MockingRequest(watsonxAIService, 'createRequest');

describe('Data & AI Common Core methods', () => {
  let createRequestMock;
  beforeEach(() => {
    createRequestMocker.mock(() => Promise.resolve());
    createRequestMock = createRequestMocker.functionMock;
  });

  afterEach(() => {
    createRequestMocker.clearMock();
  });

  describe('createSpace', () => {
    const { signal } = new AbortController();

    const createSpaceParams = {
      name: 'mySpaceName',
      description: 'This is a description of my space',
      storage: {
        resource_crn: 'myStorageCRN',
        delegated: true,
        plan_id: 'myPlanID',
      },
      compute: [
        {
          name: 'myComputeName1',
          crn: 'myComputeCRN1',
        },
        {
          name: 'myComputeName2',
          crn: 'myComputeCRN2',
        },
      ],
      tags: ['tag1', 'tag2'],
      generator: 'myGenerator',
      stage: {
        production: true,
        name: 'myStageName',
      },
      type: 'mySpaceType',
      settings: {
        folders: {
          enabled: true,
        },
        access_restrictions: {
          reporting: {
            authorized: true,
          },
        },
      },
      signal,
    };

    describe('positive tests', () => {
      function createSpaceTest() {
        const createSpaceResult = watsonxAIService.createSpace(createSpaceParams);

        // all methods should return a Promise
        expectToBePromise(createSpaceResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/spaces', 'POST');
        const expectedAccept = 'application/json';
        const expectedContentType = 'application/json';
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        checkAxiosOptions(createRequestMock, signal);
        expect(mockRequestOptions.body.name).toEqual(createSpaceParams.name);
        expect(mockRequestOptions.body.type).toEqual(createSpaceParams.type);
        expect(mockRequestOptions.body.project_id).toEqual(createSpaceParams.project_id);
        expect(mockRequestOptions.body.space_id).toEqual(createSpaceParams.space_id);
        expect(mockRequestOptions.body.description).toEqual(createSpaceParams.description);
        expect(mockRequestOptions.body.tags).toEqual(createSpaceParams.tags);
        expect(mockRequestOptions.body.software_spec).toEqual(createSpaceParams.software_spec);
        expect(mockRequestOptions.body.pipeline).toEqual(createSpaceParams.pipeline);
        expect(mockRequestOptions.body.model_definition).toEqual(
          createSpaceParams.model_definition
        );
        expect(mockRequestOptions.body.hyper_parameters).toEqual(
          createSpaceParams.hyper_parameters
        );
        expect(mockRequestOptions.body.domain).toEqual(createSpaceParams.domain);
        expect(mockRequestOptions.body.training_data_references).toEqual(
          createSpaceParams.training_data_references
        );
        expect(mockRequestOptions.body.test_data_references).toEqual(
          createSpaceParams.test_data_references
        );
        expect(mockRequestOptions.body.schemas).toEqual(createSpaceParams.schemas);
        expect(mockRequestOptions.body.label_column).toEqual(createSpaceParams.label_column);
        expect(mockRequestOptions.body.transformed_label_column).toEqual(
          createSpaceParams.transformed_label_column
        );
        expect(mockRequestOptions.body.size).toEqual(createSpaceParams.size);
        expect(mockRequestOptions.body.metrics).toEqual(createSpaceParams.metrics);
        expect(mockRequestOptions.body.custom).toEqual(createSpaceParams.custom);
        expect(mockRequestOptions.body.user_defined_objects).toEqual(
          createSpaceParams.user_defined_objects
        );
        expect(mockRequestOptions.body.hybrid_pipeline_software_specs).toEqual(
          createSpaceParams.hybrid_pipeline_software_specs
        );
        expect(mockRequestOptions.body.model_version).toEqual(createSpaceParams.model_version);
        expect(mockRequestOptions.body.training_id).toEqual(createSpaceParams.training_id);
        expect(mockRequestOptions.body.data_preprocessing).toEqual(
          createSpaceParams.data_preprocessing
        );
        expect(mockRequestOptions.body.training).toEqual(createSpaceParams.training);
        expect(mockRequestOptions.body.content_location).toEqual(
          createSpaceParams.content_location
        );
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        createSpaceTest();

        // enable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.enableRetries();
        createSpaceTest();

        // disable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.disableRetries();
        createSpaceTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters

        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const createSpacePriorParams = {
          name: 'MyEditedSpaceParam',
          type: 'MyEditedTypeParam',
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
          storage: {
            resource_crn: 'myStorageCRN',
            delegated: true,
            plan_id: 'myPlanID',
          },
        };

        watsonxAIService.createSpace(createSpacePriorParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        await expect(watsonxAIService.createSpace({})).rejects.toThrow(
          /Missing required parameters/
        );
      });

      test('should reject promise when required params are not given', async () => {
        await expect(watsonxAIService.createSpace()).rejects.toThrow(/Missing required parameters/);
      });
    });
  });

  describe('listSpaces', () => {
    describe('positive tests', () => {
      function listSpaceTest() {
        const { signal } = new AbortController();

        const listSpacesParams = {
          start: '',
          limit: 10,
          totalCount: true,
          id: 'mySpaceId',
          tags: ['tag1', 'tag2'],
          include: 'members',
          member: 'myMemberId',
          roles: 'owner,contributor',
          bssAccountId: 'myBssAccountId',
          name: 'mySpaceName',
          subName: 'mySubName',
          computeCrn: 'myComputeCrn',
          type: 'mySpaceType',
          signal,
        };

        const listSpaceResult = watsonxAIService.listSpaces(listSpacesParams);

        // all methods should return a Promise
        expectToBePromise(listSpaceResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/spaces', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        checkAxiosOptions(createRequestMock, signal);
        expect(mockRequestOptions.qs.start).toEqual(listSpacesParams.start);
        expect(mockRequestOptions.qs.limit).toEqual(listSpacesParams.limit);
        expect(mockRequestOptions.qs.tags.join(',')).toEqual(listSpacesParams.tags.join(','));
        expect(mockRequestOptions.qs.search).toEqual(listSpacesParams.search);

        // Additional checks for other properties
        expect(mockRequestOptions.qs.total_count).toEqual(listSpacesParams.totalCount);
        expect(mockRequestOptions.qs.include).toEqual(listSpacesParams.include);
        expect(mockRequestOptions.qs.member).toEqual(listSpacesParams.member);
        expect(mockRequestOptions.qs.roles).toEqual(listSpacesParams.roles);
        expect(mockRequestOptions.qs.bss_account_id).toEqual(listSpacesParams.bssAccountId);
        expect(mockRequestOptions.qs.name).toEqual(listSpacesParams.name);
        expect(mockRequestOptions.qs.sub_name).toEqual(listSpacesParams.subName);
        expect(mockRequestOptions.qs['compute.crn']).toEqual(listSpacesParams.computeCrn);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        listSpaceTest();

        // enable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.enableRetries();
        listSpaceTest();

        // disable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.disableRetries();
        listSpaceTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const listSpacesParams = {
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAIService.listSpaces(listSpacesParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });

      test('should not have any problems when no parameters are passed in', () => {
        // invoke the method with no parameters
        watsonxAIService.listSpaces();
        checkForSuccessfulExecution(createRequestMock);
      });
    });

    describe('ListSpacesPager tests', () => {
      const serviceUrl = watsonxAIServiceOptions.url;
      const path = '/v2/spaces';
      const spaceInfo = {
        metadata: {
          id: '1234567890',
          url: 'https://api.us-south.ml.cloud.ibm.com/v4/spaces/1234567890',
          creator_id: 'creatorId123',
          created_at: '2022-01-01T00:00:00.000Z',
          updated_at: '2022-01-02T00:00:00.000Z',
        },
        entity: {
          name: 'My Space',
          scope: {
            bss_account_id: 'bssAccountId123',
          },
          status: {
            state: 'active',
            failure: undefined,
          },
          stage: {
            production: true,
            name: 'production',
          },
          type: 'standard',
          settings: {
            folders: {
              enabled: true,
            },
            access_restrictions: {
              reporting: {
                authorized: true,
              },
            },
          },
          description: 'This is a description of my space',
          storage: {
            resource_crn: 'crn:v1:bluemix:public:wisb:us-south:a/1234567890::storage:1234567890',
            delegated: false,
            plan_id: 'planId123',
          },
          compute: [
            {
              name: 'compute1',
              crn: 'crn:v1:bluemix:public:wisb:us-south:a/1234567890::compute:compute1',
            },
            {
              name: 'compute2',
              crn: 'crn:v1:bluemix:public:wisb:us-south:a/1234567890::compute:compute2',
            },
          ],
          members: [
            {
              role: 'owner',
              id: 'memberId123',
              state: 'active',
              type: 'user',
            },
            {
              role: 'contributor',
              id: 'memberId456',
              state: 'active',
              type: 'user',
            },
          ],
          tags: ['tag1', 'tag2'],
          generator: 'generator123',
        },
      };

      const mockPagerResponse1 = {
        'first': {
          href: `${watsonxAIServiceOptions.url}/v2/spaces`,
        },
        'next': {
          href: `${watsonxAIServiceOptions.url}/v2/spaces?start=00e5cdaa-8c76-4b0b-af34-a502921a56d0`,
        },
        'total_count': 2,
        'limit': 1,
        'resources': [spaceInfo],
      };
      const mockPagerResponse2 = {
        'first': {
          href: 'https://us-south.ml.cloud.ibm.com/v2/spaces',
        },
        'total_count': 2,
        'limit': 1,
        'resources': [spaceInfo],
      };

      beforeEach(() => {
        createRequestMocker.unmock();
        const scope = nock(serviceUrl)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse1)
          .get((uri) => uri.includes(path))
          .reply(200, mockPagerResponse2);
      });

      afterEach(() => {
        nock.cleanAll();
        createRequestMocker.mock();
      });

      test('getNext()', async () => {
        const params = {
          limit: 2,
        };
        const allResults = [];
        const pager = new WatsonXAI.ListSpacesPager(watsonxAIService, params);
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
          limit: 1,
        };
        const pager = new WatsonXAI.ListSpacesPager(watsonxAIService, params);
        const allResults = await pager.getAll();
        expect(allResults).not.toBeNull();
        expect(allResults).toHaveLength(2);
      });
    });
  });

  describe('getSpace', () => {
    describe('positive tests', () => {
      function getSpaceTest() {
        const { signal } = new AbortController();
        const getSpaceParams = {
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          signal,
        };

        const getSpaceResult = watsonxAIService.getSpace(getSpaceParams);

        // all methods should return a Promise
        expectToBePromise(getSpaceResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/spaces/{space_id}', 'GET');
        const expectedAccept = 'application/json';
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        checkAxiosOptions(createRequestMock, signal);
        expect(mockRequestOptions.path.space_id).toEqual(getSpaceParams.spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        getSpaceTest();

        // enable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.enableRetries();
        getSpaceTest();

        // disable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.disableRetries();
        getSpaceTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const getSpaceParams = {
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAIService.getSpace(getSpaceParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        await expect(watsonxAIService.getSpace({})).rejects.toThrow(/Missing required parameters/);
      });

      test('should reject promise when required params are not given', async () => {
        await expect(watsonxAIService.getSpace()).rejects.toThrow(/Missing required parameters/);
      });
    });
  });

  describe('deleteSpace', () => {
    describe('positive tests', () => {
      function deleteSpaceTest() {
        // Construct the params object for operation deleteSpace
        const { signal } = new AbortController();
        const deleteSpaceParams = {
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          signal,
        };

        const deleteSpaceResult = watsonxAIService.deleteSpace(deleteSpaceParams);

        // all methods should return a Promise
        expectToBePromise(deleteSpaceResult);

        // assert that create request was called
        expect(createRequestMock).toHaveBeenCalledTimes(1);

        const mockRequestOptions = getOptions(createRequestMock);

        checkUrlAndMethod(mockRequestOptions, '/v2/spaces/{space_id}', 'DELETE');
        const expectedAccept = undefined;
        const expectedContentType = undefined;
        checkMediaHeaders(createRequestMock, expectedAccept, expectedContentType);
        checkAxiosOptions(createRequestMock, signal);
        expect(mockRequestOptions.path.space_id).toEqual(deleteSpaceParams.spaceId);
      }

      test('should pass the right params to createRequest with enable and disable retries', () => {
        // baseline test
        deleteSpaceTest();

        // enable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.enableRetries();
        deleteSpaceTest();

        // disable retries and test again
        createRequestMocker.clearMock();
        watsonxAIService.disableRetries();
        deleteSpaceTest();
      });

      test('should prioritize user-given headers', () => {
        // parameters
        const userAccept = 'fake/accept';
        const userContentType = 'fake/contentType';
        const deleteSpaceParams = {
          spaceId: '63dc4cf1-252f-424b-b52d-5cdd9814987f',
          headers: {
            Accept: userAccept,
            'Content-Type': userContentType,
          },
        };

        watsonxAIService.deleteSpace(deleteSpaceParams);
        checkMediaHeaders(createRequestMock, userAccept, userContentType);
      });
    });

    describe('negative tests', () => {
      test('should enforce required parameters', async () => {
        await expect(watsonxAIService.deleteSpace({})).rejects.toThrow(
          /Missing required parameters/
        );
      });

      test('should reject promise when required params are not given', async () => {
        await expect(watsonxAIService.deleteSpace()).rejects.toThrow(/Missing required parameters/);
      });
    });
  });
});
