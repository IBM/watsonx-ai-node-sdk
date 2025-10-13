const path = require('path');
const { Models } = require('../../../dist/gateway/models.js');
const { Gateway } = require('../../../dist/gateway/gateway.js');
const { APIBaseService } = require('../../../dist/base/base.js');
const authHelper = require('../../resources/auth-helper.js');
const { Providers } = require('../../../dist/gateway/providers.js');
const { modelCleanup, providerCleanup } = require('./utils.js');
const { Policies } = require('../../../dist/gateway/policies.js');

// testcase timeout value (20s).
const timeout = 20000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../../credentials/watsonx_ai_ml_vml_v1.env');
const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();

const version = '2024-03-14';
const modelName = 'mistralai/mistral-medium-2505';
const modelAlias = 'mistral-medium';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

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
        let providerId;

        afterAll(async () => {
          await providerCleanup(providers, providerId);
        });

        test('Create provider', async () => {
          const provider = await providers.create({
            providerName: 'watsonxai',
            name: `wx-nodejs-test-${timestamp}`,
            dataReference: {
              resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID,
            },
          });
          providerId = provider.result.uuid;
          expect(providerId).toBeDefined();

          const providerResponse = await providers.getDetails({ providerId });
          expect(providerResponse.result.data_reference.resource).toBe(
            process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID
          );
        });
      });

      describe('Providers manipulation methods', () => {
        let providerId;
        const name = `wx-nodejs-test-${timestamp}`;

        beforeAll(async () => {
          const provider = await providers.create({
            providerName: 'watsonxai',
            name,
            dataReference: {
              resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID,
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
            const res = await providers.getDetails({ providerId });

            expect(res.status).toBe(200);
            expect(res.result.name).toBe(name);
          });

          test('Get details of all providers', async () => {
            const res = await providers.getDetails();

            expect(res.status).toBe(200);
            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });

          test('Get available model details', async () => {
            const res = await providers.getAvailableModelsDetails({ providerId });

            expect(res.status).toBe(200);
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
            const res = await providers.listAvailableModels({ providerId });

            expect(res).toBeInstanceOf(Array);
            expect(res.length).toBeGreaterThanOrEqual(1);
          });
        });

        describe('Delete provider', () => {
          test('Delete', async () => {
            const res = await providers.delete({
              providerId,
            });

            expect(res.status).toBe(204);
            providerId = null;
          });
        });
      });
    });
  });

  describe('Models', () => {
    describe('Models init', () => {
      test('Init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });
        expect(client).toBeInstanceOf(APIBaseService);

        const providers = new Models(client);
        expect(providers).toBeInstanceOf(Models);
      });
    });

    describe('Models methods', () => {
      let providerId;
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
            resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID,
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
        let modelId;
        afterAll(async () => {
          await modelCleanup(models, modelId);
        });

        test('Create model', async () => {
          const params = {
            providerId,
            modelId: modelName,
            alias: modelAlias,
            'metadata': {
              'cost': 0.002,
              'model_family': 'mistralai',
            },
          };
          const res = await models.create(params);

          expect(res.status).toBe(201);
          expect(res.result).toBeDefined();
          modelId = res.result.uuid;
        });
      });

      describe('Model manipulation methods', () => {
        let modelId;

        beforeAll(async () => {
          const params = {
            providerId,
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
          modelId = null;
        });

        describe('Get details', () => {
          test('Get model details by modelId', async () => {
            const res = await models.getDetails({ modelId });

            expect(res.status).toBe(200);
            expect(res.result).toBeDefined();
          });

          test('Get models details by providerId', async () => {
            const res = await models.getDetails({ providerId });

            expect(res.status).toBe(200);
            expect(res.result.data).toBeInstanceOf(Array);
            expect(res.result.data.length).toBeGreaterThanOrEqual(1);
          });

          test('Get all model details', async () => {
            const res = await models.getDetails();

            expect(res.status).toBe(200);
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

        describe('delete', () => {
          test('Delete model', async () => {
            const res = await models.delete({ modelId });

            expect(res.status).toBe(204);
            modelId = null;
          });
        });
      });
    });
  });

  describe('Policies', () => {
    describe('Policies init', () => {
      test('Init', async () => {
        const client = new APIBaseService({
          version,
          serviceUrl,
        });
        expect(client).toBeInstanceOf(APIBaseService);

        const providers = new Policies(client);
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
        let policyId;
        afterAll(async () => {
          try {
            await policies.delete({ policyId });
          } catch (e) {
            console.error(`Unable to delete policy with id: ${policyId}.`, e);
          }
        });

        test('Create policy', async () => {
          const policy = await policies.create(data);

          policyId = policy.result.uuid;
          expect(policy.status).toBe(201);
        });
      });
      describe('Manipulation methods', () => {
        let policyId;
        beforeAll(async () => {
          const { result } = await policies.create(data);
          policyId = result.uuid;
        });

        test('List', async () => {
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

          expect(res.status).toBe(204);
        });
      });
    });
  });
});
