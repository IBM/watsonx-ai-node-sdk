const { NoAuthAuthenticator } = require('ibm-cloud-sdk-core');
const { Models } = require('../../../dist/gateway/models');
const { Providers } = require('../../../dist/gateway/providers');
const { checkRequest } = require('../utils/checks');
const { convertKeysToSnakeCase, convertModelToId } = require('../utils/helpers');
const { MockingRequest } = require('../../utils/utils');
const { APIBaseService } = require('../../../dist/base');
const { Policies } = require('../../../dist/gateway/policies');

const serviceUrl = 'https://us-south.ml.cloud.ibm.com';
const version = '2023-07-07';
const requestHeaders = {
  'DELETE': {},
  'GET': { 'Accept': 'application/json' },
  'POST': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  'PUT': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
};

describe('Resources', () => {
  describe('Init instance', () => {
    test('Models', async () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
        authenticator: new NoAuthAuthenticator(),
      });
      const models = new Models(client);

      expect(models).toBeInstanceOf(Models);
    });

    test('Providers', async () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
        authenticator: new NoAuthAuthenticator(),
      });
      const providers = new Providers(client);

      expect(providers).toBeInstanceOf(Providers);
    });

    test('Policies', async () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
        authenticator: new NoAuthAuthenticator(),
      });
      const providers = new Policies(client);

      expect(providers).toBeInstanceOf(Policies);
    });
  });

  describe('Data manipulation methods', () => {
    const client = new APIBaseService({
      version,
      serviceUrl,
      authenticator: new NoAuthAuthenticator(),
    });
    const createRequestMocker = new MockingRequest(client, 'createRequest');
    const models = new Models(client);
    const providers = new Providers(client);
    const policies = new Policies(client);

    describe('Basic methods', () => {
      const methods = [
        {
          name: 'Create model',
          req: {
            url: '/ml/gateway/v1/providers/{provider_id}/models',
            params: {
              providerId: '550e8400-e29b-41d4-a716-446655440000',
              modelId: 'gpt-3.5-turbo-456723',
              alias: 'gpt-3.5-turbo',
              metadata: {
                cost: 0.02,
                model_family: 'gpt-3.5',
                recommender_label: 'openai-gpt-4o-mini',
                region: 'us-east-1',
              },
            },
          },
          callableMethod: (params) => models.create(params),
          method: 'POST',
          exceptions: {
            'id': 'model_id',
          },
        },
        {
          name: 'Get model details with modelId',
          req: {
            url: '/ml/gateway/v1/models/{model_id}',
            params: {
              modelId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
          callableMethod: (params) => models.getDetails(params),
          method: 'GET',
          exceptions: {
            'id': 'model_id',
          },
        },
        {
          name: 'Get model details with providerId',
          req: {
            url: '/ml/gateway/v1/providers/{provider_id}/models',
            params: {
              providerId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
          callableMethod: (params) => models.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Get models details',
          req: {
            url: '/ml/gateway/v1/models',
            params: {},
          },
          callableMethod: (params) => models.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Delete model',
          req: {
            url: '/ml/gateway/v1/models/{model_id}',
            params: { modelId: '550e8400-e29b-41d4-a716-446655440000' },
          },
          callableMethod: (params) => models.delete(params),
          method: 'DELETE',
        },
        {
          name: 'Create provider',
          req: {
            url: '/ml/gateway/v1/providers/{provider_name}',
            params: {
              providerName: 'watsonx-ai',
              dataReference: {
                resource: 'crn:v1:staging:public:secrets-manager...',
              },
              name: 'fast-llm',
            },
          },
          callableMethod: (params) => providers.create(params),
          method: 'POST',
        },
        {
          name: 'Get provider by id',
          req: {
            url: '/ml/gateway/v1/providers/{provider_id}',
            params: {
              providerId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
            },
          },
          callableMethod: (params) => providers.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Get all providers',
          req: {
            url: '/ml/gateway/v1/providers',
            params: {},
          },
          callableMethod: (params) => providers.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Update exisitng provider',
          req: {
            url: '/ml/gateway/v1/providers/{provider_id}/{provider_name}',
            params: {
              name: 'fast-llm',
              providerName: 'watsonx-ai',
              providerId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
              dataReference: {
                resource: 'test-test_test',
              },
            },
          },
          callableMethod: (params) => providers.update(params),
          method: 'PUT',
        },
        {
          name: 'Delete existing provider',
          req: {
            url: '/ml/gateway/v1/providers/{provider_id}',
            params: {
              providerId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
            },
          },
          callableMethod: (params) => providers.delete(params),
          method: 'DELETE',
        },
        {
          name: 'Create policy',
          req: {
            url: '/ml/gateway/v1/policies',
            params: {
              'action': 'read',
              'effect': 'allow',
              'resource': 'model:62a04a11-07bf-5309-a78e-95323dbbc333',
              'subject': 'AccessGroupId-56c5e703-80d4-4f06-a7e6-844618ec39b3',
            },
          },
          callableMethod: (params) => policies.create(params),
          method: 'POST',
        },
        {
          name: 'Delete existing policy',
          req: {
            url: '/ml/gateway/v1/policies/{policy_id}',
            params: {
              policyId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
            },
          },
          callableMethod: (params) => policies.delete(params),
          method: 'DELETE',
        },
      ];
      const negativeMethods = [
        { name: 'Create model', callableMethod: () => models.create() },
        { name: 'Delete model', callableMethod: () => models.delete() },
        {
          name: 'Get model details with invalidId',
          params: { invalidId: '' },
          callableMethod: (params) => models.getDetails(params),
        },
        {
          name: 'Get model details with invalidId by modelId',
          params: { invalidId: '', modelId: '1' },
          callableMethod: (params) => models.getDetails(params),
        },
        {
          name: 'Get model details with invalidId by providerId',
          params: { invalidId: '', providerId: '1' },
          callableMethod: (params) => models.getDetails(params),
        },

        { name: 'Create provider', callableMethod: () => providers.create() },
        { name: 'Delete provider', callableMethod: () => providers.delete() },
        { name: 'Update provider', callableMethod: () => providers.update() },
        {
          name: 'List providers',
          params: { invalidId: '' },
          callableMethod: (params) => providers.list(params),
        },

        {
          name: 'Get providers details with invalidId',
          params: { invalidId: '' },
          callableMethod: (params) => providers.getDetails(params),
        },
        {
          name: 'Get provider details with invalidId by providerId',
          params: { invalidId: '', providerId: '1' },
          callableMethod: (params) => providers.getDetails(params),
        },

        {
          name: 'List available models for provider',
          callableMethod: () => providers.listAvailableModels(),
        },
        { name: 'Create policy', callableMethod: () => policies.create() },
        { name: 'Delete policy', callableMethod: () => policies.delete() },
        {
          name: 'List policies',
          params: { invalidId: '' },
          callableMethod: (params) => policies.list(params),
        },
        { name: 'Update policy', callableMethod: () => policies.getDetails() },
      ];
      let createRequestMock;

      beforeEach(async () => {
        createRequestMocker.mock(Promise.resolve({}));
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      test.each(methods)('$name', async ({ req, callableMethod, method, exceptions }) => {
        const { signal } = new AbortController();
        const { params, url } = req;
        const response = callableMethod({ signal, ...params });
        const {
          headers = {
            'Accept': requestHeaders[method].Accept,
            'Content-Type': requestHeaders[method]['Content-Type'],
          },
          ...restParams
        } = params;

        checkRequest({
          request: {
            signal,
            headers,
            url,
            params: convertKeysToSnakeCase(restParams),
          },
          requestMock: createRequestMock,
          method,
          version,
          exceptions,
        });
        expect(response).toBeInstanceOf(Promise);
      });

      test.each(negativeMethods)('$name without payload', async ({ callableMethod, params }) => {
        if (params) {
          await expect(callableMethod(params)).rejects.toThrow(/Parameter validation errors:/);
        } else {
          await expect(callableMethod()).rejects.toThrow(/Missing required parameters/);
          await expect(callableMethod({})).rejects.toThrow(/Missing required parameters/);
        }
      });
    });

    describe('List methods', () => {
      let createRequestMock;
      beforeEach(async () => {
        createRequestMocker.mock(Promise.resolve({ result: { data: [{}, {}] } }));
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      const methods = [
        {
          name: 'List models',
          callableMethod: () => models.list(),
        },
        {
          name: 'List models by providerId',
          params: { providerId: '550e8400-e29b-41d4-a716-446655440000' },
          callableMethod: (params) => models.list(params),
        },
        {
          name: 'List providers',
          callableMethod: () => providers.list(),
        },
        {
          name: 'List providers by providerId',
          params: { providerId: '550e8400-e29b-41d4-a716-446655440000' },
          callableMethod: (params) => providers.list(params),
        },
        {
          name: 'List available models for provider',
          params: { providerId: '550e8400-e29b-41d4-a716-446655440000' },
          callableMethod: (params) => providers.listAvailableModels(params),
        },
        {
          name: 'List policies',
          callableMethod: () => policies.list(),
        },
      ];

      test.each(methods)('$name', async ({ callableMethod, params }) => {
        const response = callableMethod(params);
        expect(response).toBeInstanceOf(Promise);

        const data = await response;
        expect(data).toBeInstanceOf(Array);
      });
    });

    describe('Get details via list methods', () => {
      let createRequestMock;
      beforeEach(async () => {
        createRequestMocker.mock(
          Promise.resolve({
            result: {
              data: [
                { id: 1, uuid: 1 },
                { id: 2, uuid: 2 },
              ],
            },
          })
        );
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      test('Get policies details', async () => {
        const params = { policyId: 1 };
        const response = await policies.getDetails(params);

        expect(typeof response.id).toBe('number');
      });

      test('Get policies details with not existing id', async () => {
        const params = { policyId: 3 };
        const response = policies.getDetails(params);

        await expect(response).rejects.toThrow(
          `Policy with provided id: ${params.policyId} does not exist`
        );
      });
    });
  });
});
