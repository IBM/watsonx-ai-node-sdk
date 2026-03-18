import path from 'path';
import { Models } from '../../../src/gateway/models';
import { Gateway } from '../../../src/gateway/gateway';
import { APIBaseService } from '../../../src/base/base';
import { Policies } from '../../../src/gateway/policies';
import { RateLimits } from '../../../src/gateway/ratelimit';
import { Providers } from '../../../src/gateway/providers';
import * as authHelper from '../../resources/auth-helper';
import { modelCleanup, providerCleanup, rateLimitCleanup } from './utils';
import { expectSuccessResponse } from '../../utils/utils';

// testcase timeout value (20s).
const timeout = 20000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../../credentials/watsonx_ai_ml_vml_v1.env');

const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();

const version = '2024-03-14';
const modelName = 'ibm/granite-3-8b-instruct-intel';
const modelAlias = 'ibm/granite-3-8b-instruct-intel';
const serviceUrl = process.env.WATSONX_AI_GATEWAY_URL;

describe('Resources', () => {
  jest.setTimeout(timeout);

  describe('Providers', () => {
    describe('Providers init', () => {
      test('Init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });

        expect(client).toBeInstanceOf(APIBaseService);

        const providers = new Providers(client);

        expect(providers).toBeInstanceOf(Providers);
      });
    });

    describe('Providers methods', () => {
      const timestamp = Date.now();

      const client = new APIBaseService({
        version,
        serviceUrl,
      });
      const providers = new Providers(client);

      describe('Creation of provider', () => {
        let providerId: string | undefined;

        afterAll(async () => {
          await providerCleanup(providers, providerId);
        });

        test('Create provider', async () => {
          const provider = await providers.create({
            providerName: 'watsonxai',
            name: `wx-nodejs-test-${timestamp}`,
            dataReference: {
              resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID as string,
            },
          });
          providerId = provider.result.uuid;

          expect(typeof providerId).toBe('string');

          const providerResponse = await providers.getDetails({ providerId: providerId as string });

          expect(providerResponse.result.data_reference.resource).toBe(
            process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID
          );
        });
      });

      describe('Providers manipulation methods', () => {
        let providerId: string | undefined | null;
        const name = `wx-nodejs-test-${timestamp}`;

        beforeAll(async () => {
          const provider = await providers.create({
            providerName: 'watsonxai',
            name,
            dataReference: {
              resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID as string,
            },
          });
          providerId = provider.result.uuid;
        });

        afterAll(async () => {
          if (providerId) {
            try {
              await providers.delete({
                providerId,
              });
            } catch (e) {
              console.error(`Unable to delete provider with id: ${providerId} - ${e}`);
            }
          }
        });

        describe('Get details', () => {
          test('Get details with providerId', async () => {
            expect(typeof providerId).toBe('string');
            const res = await providers.getDetails({ providerId: providerId as string });

            expectSuccessResponse(res, 200);

            expect(res.result.name).toBe(name);
          });

          test('Get details of all providers', async () => {
            const res = await providers.getDetails();

            expectSuccessResponse(res, 200);

            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });

          test('Get available model details', async () => {
            expect(typeof providerId).toBe('string');

            const res = await providers.getAvailableModelsDetails({
              providerId: providerId as string,
            });

            expectSuccessResponse(res, 200);

            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });
        });

        describe('List provider resources', () => {
          test('List providers', async () => {
            const res = await providers.list();

            expect(res).toBeInstanceOf(Array);
            expect(res.length).toBeGreaterThanOrEqual(1);
          });

          test('List available provider`s models', async () => {
            expect(typeof providerId).toBe('string');

            const res = await providers.listAvailableModels({ providerId: providerId as string });

            expect(res).toBeInstanceOf(Array);
            expect(res.length).toBeGreaterThanOrEqual(1);
          });
        });

        describe('Delete provider', () => {
          test('Delete', async () => {
            expect(typeof providerId).toBe('string');

            const res = await providers.delete({
              providerId: providerId as string,
            });

            expectSuccessResponse(res, 204);
            providerId = null;
          });
        });
      });
    });
  });

  describe('Models', () => {
    describe('Models init', () => {
      test('Models instance init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });
        const providers = new Models(client);

        expect(client).toBeInstanceOf(APIBaseService);
        expect(providers).toBeInstanceOf(Models);
      });
    });

    describe('Models methods', () => {
      let providerId: string | undefined;
      const timestamp = Date.now();

      const client = new APIBaseService({
        version,
        serviceUrl,
      });
      const models = new Models(client);

      beforeAll(async () => {
        const gateway = new Gateway({
          version,
          serviceUrl,
        });

        const provider = await gateway.providers.create({
          providerName: 'watsonxai',
          name: `wx-nodejs-test-${timestamp}`,
          dataReference: {
            resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID as string,
          },
        });
        providerId = provider.result.uuid;
      });

      afterAll(async () => {
        const gateway = new Gateway({
          version,
          serviceUrl,
        });
        providerCleanup(gateway.providers, providerId);
      });

      describe('Model creation', () => {
        let modelId: string | undefined;

        afterAll(async () => {
          await modelCleanup(models, modelId);
        });

        test('Create model', async () => {
          expect(typeof providerId).toBe('string');

          const params = {
            providerId: providerId as string,
            modelId: modelName,
            alias: modelAlias,
            'metadata': {
              'cost': 0.002,
              'model_family': 'mistralai',
            },
          };
          const res = await models.create(params);

          expectSuccessResponse(res, 201);
          modelId = res.result.uuid;
        });
      });

      describe('Model manipulation methods', () => {
        let modelId: string | undefined;

        beforeAll(async () => {
          expect(typeof providerId).toBe('string');

          const params = {
            providerId: providerId as string,
            modelId: modelName,
            alias: modelAlias,
            'metadata': {
              'cost': 0.002,
              'model_family': 'mistralai',
            },
          };
          const res = await models.create(params);
          modelId = res.result.uuid;
        });

        afterAll(async () => {
          await modelCleanup(models, modelId);
          modelId = undefined;
        });

        describe('Get details', () => {
          test('Get model details by modelId', async () => {
            expect(typeof modelId).toBe('string');

            const res = await models.getDetails({ modelId: modelId as string });

            expectSuccessResponse(res, 200);
          });

          test('Get models details by providerId', async () => {
            const res = await models.getDetails({ providerId });

            expectSuccessResponse(res, 200);

            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });

          test('Get all model details', async () => {
            const res = await models.getDetails();

            expectSuccessResponse(res, 200);

            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });
        });

        describe('List models', () => {
          test('List all models', async () => {
            const res = await models.list();

            expect(res).toBeInstanceOf(Array);
            expect(res.length).toBeGreaterThanOrEqual(1);
          });

          test('List all models by providerId', async () => {
            const res = await models.list({ providerId });

            expect(res).toBeInstanceOf(Array);
            expect(res).toHaveLength(1);
          });
        });

        test('Delete model', async () => {
          expect(typeof modelId).toBe('string');

          const res = await models.delete({ modelId: modelId as string });

          expectSuccessResponse(res, 204);
          modelId = undefined;
        });
      });
    });
  });

  describe('Policies', () => {
    describe('Policies init', () => {
      test('Policies instance init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });
        const providers = new Policies(client);

        expect(client).toBeInstanceOf(APIBaseService);
        expect(providers).toBeInstanceOf(Policies);
      });
    });

    describe('Policies methods', () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
      });
      const policies = new Policies(client);
      const data = {
        'action': 'read',
        'effect': 'allow',
        'resource': 'model:62a04a11-07bf-5309-a78e-95323dbbc333',
        'subject': 'AccessGroupId-56c5e703-80d4-4f06-a7e6-844618ec39b3',
      };

      describe('Creation', () => {
        let policyId: string;

        afterAll(async () => {
          try {
            await policies.delete({ policyId });
          } catch (e) {
            console.error('Unable to delete policy with id:', policyId, e);
          }
        });

        test('Create policy', async () => {
          const policy = await policies.create(data);
          policyId = policy.result.uuid;

          expect(policy.status).toBe(201);
        });
      });

      describe('Manipulation methods', () => {
        let policyId: string;

        beforeAll(async () => {
          const { result } = await policies.create(data);
          policyId = result.uuid;
        });

        test('List policies', async () => {
          const res = await policies.list();

          expect(res).toBeInstanceOf(Array);
          expect(res.length).toBeGreaterThanOrEqual(1);
        });

        test('getDetails', async () => {
          const res = await policies.getDetails({ policyId });

          expect(res.uuid).toBe(policyId);
        });

        test('delete', async () => {
          const res = await policies.delete({ policyId });

          expectSuccessResponse(res, 204);
        });
      });
    });
  });

  describe('RateLimits', () => {
    describe('RateLimits init', () => {
      test('RateLimits instance init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });
        const rateLimit = new RateLimits(client);

        expect(client).toBeInstanceOf(APIBaseService);
        expect(rateLimit).toBeInstanceOf(RateLimits);
      });
    });

    describe('RateLimits methods', () => {
      const client = new APIBaseService({
        version,
        serviceUrl,
      });
      const gateway = new Gateway({
        version,
        serviceUrl,
      });
      const rateLimit = new RateLimits(client);

      describe('Creation', () => {
        let rateLimitId: string | undefined;
        let providerId: string | undefined;
        let modelId: string | undefined;
        const timestamp = Date.now();

        beforeAll(async () => {
          const provider = await gateway.providers.create({
            providerName: 'watsonxai',
            name: `wx-nodejs-test-${timestamp}`,
            dataReference: {
              resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID as string,
            },
          });

          providerId = provider.result.uuid;
          expect(typeof providerId).toBe('string');

          const params = {
            providerId: providerId as string,
            modelId: modelName,
            alias: modelAlias,
          };
          const res = await gateway.models.create(params);
          modelId = res.result.uuid;
        });

        afterAll(async () => {
          await modelCleanup(gateway.models, modelId);
          await providerCleanup(gateway.providers, providerId);
        });

        afterEach(async () => {
          await rateLimitCleanup(rateLimit, rateLimitId);
        });

        test('Create rate limit with tenant', async () => {
          const res = await rateLimit.create({
            token: { duration: '1m', amount: 10, capacity: 100 },
            type: 'tenant',
            request: { duration: '1m', amount: 10, capacity: 100 },
          });
          expectSuccessResponse(res, 201);
          rateLimitId = res.result.uuid;
        });

        test('Create rate limit with model', async () => {
          const res = await rateLimit.create({
            modelId,
            token: { duration: '1m', amount: 10, capacity: 100 },
            type: 'tenant',
            request: { duration: '1m', amount: 10, capacity: 100 },
          });
          expectSuccessResponse(res, 201);
          rateLimitId = res.result.uuid;
        });

        test('Create rate limit with provider', async () => {
          const res = await rateLimit.create({
            providerId,
            token: { duration: '1m', amount: 10, capacity: 100 },
            type: 'tenant',
            request: { duration: '1m', amount: 10, capacity: 100 },
          });
          expectSuccessResponse(res, 201);
          rateLimitId = res.result.uuid;
        });
      });

      describe('Manipulation methods', () => {
        let rateLimitId: string | undefined;

        beforeAll(async () => {
          const res = await rateLimit.create({
            token: { duration: '1m', amount: 10, capacity: 100 },
            type: 'tenant',
            request: { duration: '1m', amount: 10, capacity: 100 },
          });
          rateLimitId = res.result.uuid;
        });

        afterAll(async () => {
          await rateLimitCleanup(rateLimit, rateLimitId);
        });

        test('List ratelimits', async () => {
          const res = await rateLimit.list();

          expect(res).toBeInstanceOf(Array);
        });

        test('getDetails with rateLimit ID', async () => {
          const res = await rateLimit.getDetails({
            rateLimitId,
          });

          expectSuccessResponse(res, 200);
        });

        test('getDetails of multiple items', async () => {
          const res = await rateLimit.getDetails();

          expectSuccessResponse(res, 200);

          expect(res.result.data).toBeInstanceOf(Array);
        });

        test('delete ratelimit', async () => {
          expect(typeof rateLimitId).toBe('string');
          const res = await rateLimit.delete({
            rateLimitId: rateLimitId as string,
          });

          expectSuccessResponse(res, 204);
          rateLimitId = undefined;
        });
      });
    });
  });
});
