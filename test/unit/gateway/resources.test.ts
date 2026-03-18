import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import { Models } from '../../../src/gateway';
import { Providers } from '../../../src/gateway';
import { Policies } from '../../../src/gateway';
import { APIBaseService } from '../../../src/base';
import { checkRequest } from '../utils/checks';
import { convertKeysToSnakeCase } from '../utils/helpers';
import { MockingRequest } from '../../utils/utils';
import { RateLimits } from '../../../src/gateway';
import type { MethodsInvalidParams, MethodsParams } from './types';

const serviceUrl = 'https://us-south.ml.cloud.ibm.com';
const version = '2023-07-07';
const requestHeaders = {
  'DELETE': {},
  'GET': { 'Accept': 'application/json' },
  'POST': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  'PUT': { 'Accept': 'application/json', 'Content-Type': 'application/json' },
} as const;

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

    test('RateLimits', async () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
        authenticator: new NoAuthAuthenticator(),
      });
      const rateLimit = new RateLimits(client);

      expect(rateLimit).toBeInstanceOf(RateLimits);
    });
  });

  describe('Data manipulation methods', () => {
    const client = new APIBaseService({
      version,
      serviceUrl,
      authenticator: new NoAuthAuthenticator(),
    });
    const createRequestMocker = new MockingRequest(client, 'createRequest' as any);
    const models = new Models(client);
    const providers = new Providers(client);
    const policies = new Policies(client);
    const rateLimit = new RateLimits(client);

    describe('Basic methods', () => {
      const methods: MethodsParams<keyof typeof requestHeaders>[] = [
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
          name: 'Create provider',
          req: {
            url: '/ml/gateway/v1/providers/{provider_name}',
            params: {
              providerName: 'watsonx-ai',
              data: {
                'project_id': '550e8400-e29b-41d4-a716-446655440000',
                'space_id': '550e8400-e29b-41d4-a716-446655440000',
                'api_version': '2023-07-07',
                'apikey': 'api_key',
                'auth_url': 'https://iam.cloud.ibm.com/identity/token',
                'base_url': 'https://us-south.ml.cloud.ibm.com',
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
        {
          name: 'Create RateLimits',
          req: {
            url: '/ml/gateway/v1/rate-limits',
            params: {
              token: { duration: '1m', amount: 10, capacity: 100 },
              type: 'tenant',
              request: { duration: '1m', amount: 10, capacity: 100 },
            },
          },
          callableMethod: (params) => rateLimit.create(params),
          method: 'POST',
          exceptions: {
            'model_uuid': 'model_id',
            'provider_uuid': 'provider_id',
          },
        },
        {
          name: 'Get rate limit by id',
          req: {
            url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
            params: {
              rateLimitId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
            },
          },
          callableMethod: (params) => rateLimit.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Get rate limits',
          req: {
            url: '/ml/gateway/v1/rate-limits',
            params: {},
          },
          callableMethod: (params) => rateLimit.getDetails(params),
          method: 'GET',
        },
        {
          name: 'Update exisitng rate limit',
          req: {
            url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
            params: {
              token: { duration: '1m', amount: 10, capacity: 100 },
              type: 'model',
              request: { duration: '1m', amount: 10, capacity: 100 },
              modelId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
              providerId: '12312312312',
            },
          },
          callableMethod: (params) => rateLimit.update(params),
          method: 'PUT',
          exceptions: {
            'model_uuid': 'model_id',
            'provider_uuid': 'provider_id',
          },
        },
        {
          name: 'Delete existing rate limit',
          req: {
            url: '/ml/gateway/v1/rate-limits/{rate_limit_id}',
            params: {
              rateLimitId: 'q9b2d701-4592-4386-85cf-326c6b3c94c7',
            },
          },
          callableMethod: (params) => rateLimit.delete(params),
          method: 'DELETE',
        },
      ];
      const negativeMethods: MethodsInvalidParams[] = [
        // @ts-expect-error invalid params
        { name: 'Create model without data', callableMethod: () => models.create() },
        // @ts-expect-error invalid params
        { name: 'Delete model without data', callableMethod: () => models.delete() },
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
        // @ts-expect-error invalid params
        { name: 'Create provider without data', callableMethod: () => providers.create() },
        {
          name: 'Create provider with data and dataReference',
          callableMethod: (params) => providers.create(params),
          params: {
            data: {
              'project_id': '550e8400-e29b-41d4-a716-446655440000',
              'space_id': '550e8400-e29b-41d4-a716-446655440000',
              'api_version': '2023-07-07',
              'apikey': 'api_key',
              'auth_url': 'https://iam.cloud.ibm.com/identity/token',
              'base_url': 'https://us-south.ml.cloud.ibm.com',
            },
            dataReference: {
              resource: 'crn:v1:staging:public:secrets-manager...',
            },
          },
        },
        // @ts-expect-error invalid params
        { name: 'Delete provider without data', callableMethod: () => providers.delete() },
        // @ts-expect-error invalid params
        { name: 'Update provider without data', callableMethod: () => providers.update() },
        {
          name: 'List providers with invalidId',
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
          // @ts-expect-error invalid params
          callableMethod: () => providers.listAvailableModels(),
        },
        // @ts-expect-error invalid params
        { name: 'Create policy without data', callableMethod: () => policies.create() },
        // @ts-expect-error invalid params
        { name: 'Delete policy without data', callableMethod: () => policies.delete() },
        {
          name: 'List policies without data',
          params: { invalidId: '' },
          callableMethod: (params) => policies.list(params),
        },
        // @ts-expect-error invalid params
        { name: 'Update policy without data', callableMethod: () => policies.getDetails() },
        {
          name: 'Create rate limit for type model without modelId',
          callableMethod: (params) => rateLimit.create(params),
          params: {
            type: 'model',
          },
        },
        {
          name: 'Create rate limit for type model without providerId',
          callableMethod: (params) => rateLimit.create(params),
          params: {
            type: 'provider',
          },
        },
        {
          name: 'Update rate limit for type model without modelId',
          callableMethod: (params) => rateLimit.update(params),
          params: {
            type: 'model',
          },
        },
        {
          name: 'Update rate limit for type model without providerId',
          callableMethod: (params) => rateLimit.update(params),
          params: {
            type: 'provider',
          },
        },
        {
          name: 'Create rate limit for type model without type',
          callableMethod: (params) => rateLimit.create(params),
          params: {
            modelId: 'model_id',
          },
        },
        {
          name: 'Update rate limit for type model without type',
          callableMethod: (params) => rateLimit.update(params),
          params: {
            modelId: 'model_id',
          },
        },
        {
          name: 'Get details of rate limit with invalid id',
          callableMethod: (params) => rateLimit.getDetails(params),
          params: {
            invalidId: 'model_id',
          },
        },
        {
          name: 'List rate limits with invalid data',
          callableMethod: (params) => rateLimit.list(params),
          params: {
            invalidId: 'model_id',
          },
        },
        {
          name: 'Delete rate limit without valid id',
          callableMethod: (params) => rateLimit.delete(params),
          params: {
            invalidId: 'model_id',
          },
        },
      ];
      let createRequestMock: jest.SpyInstance;

      beforeEach(async () => {
        createRequestMocker.mock(() => Promise.resolve({}));
        if (createRequestMocker.functionMock) createRequestMock = createRequestMocker.functionMock;
        else throw new Error('Unable to mock request. Please check your implementation');
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      test.each(methods)(
        '$name',
        async ({
          req,
          callableMethod,
          method,
          exceptions,
        }: {
          req: any;
          callableMethod: (params: any) => any;
          method: keyof typeof requestHeaders;
          exceptions?: Record<string, any> | undefined;
        }) => {
          const { signal } = new AbortController();
          const { params, url } = req;
          const response = callableMethod({ signal, ...params });
          const { headers = requestHeaders[method], ...restParams } = params;

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
        }
      );

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
      beforeEach(async () => {
        createRequestMocker.mock(() => Promise.resolve({ result: { data: [{}, {}] } }));
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      interface MethodsListParams {
        name: string;
        params?: Record<string, any>;
        callableMethod: (params?: any) => Promise<any>;
      }

      const methods: MethodsListParams[] = [
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
        {
          name: 'List rate limits',
          callableMethod: () => rateLimit.list(),
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
      beforeEach(async () => {
        createRequestMocker.mock(() =>
          Promise.resolve({
            result: {
              data: [
                { id: 1, uuid: '1' },
                { id: 2, uuid: '2' },
              ],
            },
          })
        );
      });

      afterEach(async () => {
        createRequestMocker.clearMock();
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      test('Get policies details', async () => {
        const params = { policyId: '1' };
        const response = await policies.getDetails(params);

        expect(typeof response.uuid).toBe('string');
      });

      test('Get policies details with not existing id', async () => {
        const params = { policyId: '3' };
        const response = policies.getDetails(params);

        await expect(response).rejects.toThrow(
          `Policy with provided id: ${params.policyId} does not exist`
        );
      });

      test('Get rate limits list', async () => {
        const response = await rateLimit.list();

        expect(response).toBeInstanceOf(Array);
      });
    });
  });
});
