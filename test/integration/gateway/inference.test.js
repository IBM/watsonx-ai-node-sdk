const path = require('path');
const { Gateway, Chat, Embeddings } = require('../../../dist/gateway/gateway.js');
const { APIBaseService } = require('../../../dist/base/base.js');
const authHelper = require('../../resources/auth-helper.js');
const {
  GenerateTextCompletions,
  ChatCompletions,
} = require('../../../dist/gateway/completions.js');
const { modelCleanup, providerCleanup } = require('./utils.js');

// testcase timeout value (20s).
const timeout = 20000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../../credentials/watsonx_ai_ml_vml_v1.env');
const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();

const version = '2024-03-14';

const client = new APIBaseService({
  version,
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
});

describe('Completions', () => {
  jest.setTimeout(timeout);

  describe('Init instances', () => {
    test('GenerateText init', async () => {
      const providers = new GenerateTextCompletions(client);
      expect(providers).toBeInstanceOf(GenerateTextCompletions);
    });

    test('Chat init', async () => {
      const chat = new Chat(client);
      expect(chat).toBeInstanceOf(Chat);
      expect(chat.completion).toBeInstanceOf(ChatCompletions);
    });
  });

  describe('Inference', () => {
    let providerId;
    let modelId;

    const textCompletions = new GenerateTextCompletions(client);
    const chat = new Chat(client);
    const modelAlias = 'mistral-medium';
    const modelName = 'mistralai/mistral-medium-2505';

    beforeAll(async () => {
      const timestamp = Date.now();
      const gateway = new Gateway({
        version,
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      });

      const provider = await gateway.providers.create({
        providerName: 'watsonxai',
        name: `wx-nodejs-test-${timestamp}`,
        dataReference: {
          resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID,
        },
      });
      providerId = provider.result.uuid;
      if (!providerId) throw new Error('Provider could not be properly created');

      const params = {
        providerId,
        modelId: modelName,
        alias: modelAlias,
      };
      const res = await gateway.models.create(params);
      modelId = res.result.uuid;
    });

    afterAll(async () => {
      const gateway = new Gateway({
        version,
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      });

      await modelCleanup(gateway.models, modelId);
      await providerCleanup(gateway.providers, providerId);
    });

    test('Create chat completions', async () => {
      const chatsMessageModel = {
        content: 'Hello. What is AI?',
        role: 'user',
      };

      const params = {
        messages: [chatsMessageModel],
        model: modelAlias,
        maxTokens: 5,
      };

      const res = await chat.completion.create(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('Create chat completions with stream object', async () => {
      const chatsMessageModel = {
        content: 'Hello. What is AI?',
        role: 'user',
      };

      const res = await chat.completion.create({
        messages: [chatsMessageModel],
        model: modelAlias,
        stream: true,
        maxTokens: 5,
      });
      for await (const chunk of res) {
        expect(chunk.data).toBeDefined();
      }
    });

    test('Create chat completions with stream string', async () => {
      const chatsMessageModel = {
        content: 'Hello. What is AI?',
        role: 'user',
      };

      const res = await chat.completion.create({
        messages: [chatsMessageModel],
        model: modelAlias,
        stream: true,
        returnObject: false,
      });
      for await (const chunk of res) {
        expect(typeof chunk).toBe('string');
      }
    });

    test('Generate text completions', async () => {
      const params = {
        prompt: 'Hello. What is AI?',
        model: modelAlias,
      };
      const res = await textCompletions.create(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('Generate text completions with stream stirng', async () => {
      const res = await textCompletions.create({
        prompt: 'Hello. What is AI?',
        model: modelAlias,
        stream: true,
        returnObject: false,
      });

      expect(res).toBeDefined();
      for await (const chunk of res) {
        expect(typeof chunk).toBe('string');
      }
    });

    test('Generate text completions with stream object', async () => {
      const res = await textCompletions.create({
        prompt: 'Hello. What is AI?',
        model: modelAlias,
        stream: true,
      });

      expect(res).toBeDefined();
      for await (const chunk of res) {
        expect(chunk.data).toBeDefined();
      }
    });
  });
});

describe('Embeddings', () => {
  const model = 'ibm/granite-embedding-107m-multilingual';
  jest.setTimeout(timeout);

  describe('Init embeddings instances', () => {
    test('Embeddings init', async () => {
      const embeddings = new Embeddings(client);
      expect(embeddings).toBeInstanceOf(Embeddings);
      expect(embeddings.completion).toBeDefined();
    });
  });

  describe('Inference embeddings', () => {
    let providerId;
    let modelId;
    let embeddings;

    beforeAll(async () => {
      const timestamp = Date.now();
      const gateway = new Gateway({
        version,
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      });

      const provider = await gateway.providers.create({
        providerName: 'watsonxai',
        name: `wx-nodejs-test-${timestamp}`,
        dataReference: {
          resource: process.env.WATSONX_AI_SECRETS_MANAGER_CRN_ID,
        },
      });
      providerId = provider.result.uuid;
      if (!providerId) throw new Error('Provider could not be properly created');

      const params = {
        providerId,
        modelId: model,
        alias: model,
      };
      const res = await gateway.models.create(params);
      modelId = res.result.uuid;

      embeddings = new Embeddings(client);
    });

    afterAll(async () => {
      const gateway = new Gateway({
        version,
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      });

      await modelCleanup(gateway.models, modelId);
      await providerCleanup(gateway.providers, providerId);
    });

    test('Inference embeddings with simple input', async () => {
      const res = await embeddings.completion.create({
        model,
        input: 'This is text for the embeddings',
      });

      expect(res.status).toBe(200);
      expect(res.result.data).toBeInstanceOf(Array);
    });

    test('Inference embeddings with array input', async () => {
      const res = await embeddings.completion.create({
        model,
        input: ['This is text for the embeddings', 'This is another text for embeddings'],
      });

      expect(res.status).toBe(200);
      expect(res.result.data).toBeInstanceOf(Array);
    });
  });
});
