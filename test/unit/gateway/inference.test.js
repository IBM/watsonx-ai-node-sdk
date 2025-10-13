const sdkCorePackage = require('ibm-cloud-sdk-core');
const { APIBaseService } = require('../../../dist/base/base');
const { Chat, Embeddings } = require('../../../dist/gateway/gateway');
const { checkRequest } = require('../utils/checks');
const {
  ChatCompletions,
  EmbeddingCompletions,
  GenerateTextCompletions,
} = require('../../../dist/gateway/completions');
const { MockingRequest } = require('../../utils/utils');
const { convertKeysToSnakeCase } = require('../utils/helpers');

const { NoAuthAuthenticator } = sdkCorePackage;

const chatCompletions = {
  messages: [
    {
      content: [
        {
          text: 'This is some text part of a message.',
          type: 'refusal',
        },
      ],
      name: 'my-username',
      role: 'developer',
    },
  ],
  model: 'gpt-4o',
  audio: { 'key1': 'testString' },
  cache: {
    enabled: true,
    filter: { 'key1': 'testString' },
    threshold: 0.5,
  },
  functionCall: {
    arguments: '{"location":"Paris, France"}',
    name: 'my-function',
  },
  functions: { 'key1': 'testString' },
  logitBias: { 'key1': 50 },
  logprobs: true,
  maxCompletionTokens: 1000,
  maxTokens: 1000,
  metadata: { 'key1': 'testString' },
  modalities: ['text', 'audio'],
  n: 3,
  parallelToolCalls: true,
  prediction: {
    content: [
      {
        text: 'This is some text part of a message.',
        type: 'content',
      },
    ],
    type: 'content',
  },
  presencePenalty: 0.4,
  reasoningEffort: 'high',
  responseFormat: {
    type: 'json_schema',
  },
  router: { 'key1': 'testString' },
  seed: 239847829,
  serviceTier: 'auto',
  stop: ['testString'],
  store: true,
  temperature: 0.8,
  toolChoice: {
    function: {
      name: 'myToolFunction',
    },
    type: 'function',
  },
  tools: [
    {
      function: {
        name: 'myToolFunction',
      },
      type: 'function',
    },
  ],
  topLogprobs: 10,
  topP: 0.1,
  user: 'my-username',
};

const embeddingsCompletions = {
  input: 'This is some text to embed.',
  model: 'gpt-4o',
  dimensions: 10,
  encodingFormat: 'base64',
  user: 'my-username',
};

const generateTextCompletions = {
  model: 'gpt-4o',
  prompt: 'What is the capital of France?',
  bestOf: 2,
  cache: {
    enabled: true,
    filter: { 'key1': 'testString' },
    threshold: 0.8,
  },
  echo: true,
  frequencyPenalty: 1.4,
  logitBias: { 'key1': 10 },
  logprobs: 4,
  maxTokens: 1000,
  metadata: { 'key1': 'testString' },
  n: 3,
  presencePenalty: 0.4,
  router: {
    family_model: ['gpt', 'claude'],
    max_cost: 0.1,
    models: ['gpt-4o'],
    optimization: 'cost',
    quality_tradeoff: 0.5,
    region: 'us-south',
  },
  seed: 239847829,
  stop: ['testString'],
  suffix: 'some text',
  temperature: 1.3,
  topP: 0.8,
  user: 'my-username',
};

const customHeaders = {
  Accept: 'fake/accept',
  'Content-Type': 'fake/contentType',
};

const streamChatCompletion = { ...chatCompletions, stream: true };

const streamGenerateTextCompletions = { ...generateTextCompletions, stream: true };

const serviceUrl = 'https://us-south.ml.cloud.ibm.com';
const version = '2023-07-07';

describe('Completions instances', () => {
  describe('Init instance', () => {
    let client;

    beforeAll(() => {
      client = new APIBaseService({
        url: serviceUrl,
        version,
        authenticator: new NoAuthAuthenticator(),
      });
    });

    test('Init Chat instance', () => {
      const chat = new Chat(client);
      expect(chat).toBeInstanceOf(Chat);
      expect(chat.completion).toBeInstanceOf(ChatCompletions);
      expect(chat.completion.create).toBeDefined();
    });

    test('Init Embeddings instance', () => {
      const embeddings = new Embeddings(client);
      expect(embeddings).toBeInstanceOf(Embeddings);
      expect(embeddings.completion).toBeInstanceOf(EmbeddingCompletions);
      expect(embeddings.completion.create).toBeDefined();
    });

    test('Init GenerateTextCompletions instance', () => {
      const generateText = new GenerateTextCompletions(client);
      expect(generateText).toBeInstanceOf(GenerateTextCompletions);
      expect(generateText.create).toBeDefined();
    });
  });

  describe('Inference instance', () => {
    const client = new APIBaseService({
      version,
      serviceUrl,
      authenticator: new NoAuthAuthenticator(),
    });
    const chat = new Chat(client);
    const embeddings = new Embeddings(client);
    const generateText = new GenerateTextCompletions(client);

    const createRequestMocker = new MockingRequest(client, 'createRequest');
    let createRequestMock;

    describe('Sync methods', () => {
      const methods = [
        {
          name: 'Test chat completions create request',
          req: {
            url: '/ml/gateway/v1/chat/completions',
            params: { ...chatCompletions },
          },
          callableMethod: (params) => chat.completion.create(params),
        },
        {
          name: 'Test text generation completions create request',
          req: {
            url: '/ml/gateway/v1/completions',
            params: { ...generateTextCompletions },
          },
          callableMethod: (params) => generateText.create(params),
        },
        {
          name: 'Test embeddings generation completions create request',
          req: {
            url: '/ml/gateway/v1/embeddings',
            params: { ...embeddingsCompletions },
          },
          callableMethod: (params) => embeddings.completion.create(params),
        },
      ];

      beforeEach(async () => {
        createRequestMocker.mock(Promise.resolve());
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock({});
      });

      afterAll(async () => {
        createRequestMocker.unmock();
      });

      test.each(methods)('$name', async ({ req, callableMethod }) => {
        const { params, url } = req;
        const { signal } = new AbortController();
        const response = callableMethod({ signal, ...params });
        const {
          headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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
          method: 'POST',
          version,
        });
        expect(response).toBeInstanceOf(Promise);
      });

      test.each(methods)('$name with custom headers', async ({ req, callableMethod }) => {
        const { params, url } = req;
        const { signal } = new AbortController();
        const response = callableMethod({ signal, ...params, headers: customHeaders });

        checkRequest({
          request: {
            signal,
            headers: customHeaders,
            url,
            params: convertKeysToSnakeCase(params),
          },
          requestMock: createRequestMock,
          method: 'POST',
          version,
        });
        expect(response).toBeInstanceOf(Promise);
      });

      test.each(methods)('$name without payload', async ({ callableMethod }) => {
        await expect(callableMethod()).rejects.toThrow(/Missing required parameters/);
        await expect(callableMethod({})).rejects.toThrow(/Missing required parameters/);
      });
    });

    describe('Stream methods', () => {
      const methods = [
        {
          name: 'Test chat completions create request with streaming',
          req: {
            url: '/ml/gateway/v1/chat/completions',
            params: { ...streamChatCompletion },
          },
          callableMethod: (params) => chat.completion.create(params),
        },
        {
          name: 'Test completions create request with streaming',
          req: {
            url: '/ml/gateway/v1/completions',
            params: {
              ...streamGenerateTextCompletions,
            },
          },
          callableMethod: (params) => generateText.create(params),
        },
        {
          name: 'Test chat completions create request with streaming',
          req: {
            url: '/ml/gateway/v1/chat/completions',
            params: { ...streamChatCompletion, returnObject: false },
          },
          callableMethod: (params) => chat.completion.create(params),
        },
        {
          name: 'Test completions create request with streaming',
          req: {
            url: '/ml/gateway/v1/completions',
            params: {
              ...streamGenerateTextCompletions,
              returnObject: false,
            },
          },
          callableMethod: (params) => generateText.create(params),
        },
      ];

      beforeEach(async () => {
        createRequestMocker.mock(
          Promise.resolve({
            result: [
              'id: 1\nevent: message\ndata: {}\n\n',
              'id: 2\nevent: message\ndata: {}\n\n',
              'id: 3\nevent: message\ndata: {}\n\n',
            ][Symbol.iterator](),
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

      test.each(methods)('$name', async ({ req, callableMethod }) => {
        const { params, url } = req;
        const { signal } = new AbortController();
        const response = callableMethod({ signal, ...params });
        const {
          headers = {
            'Accept': 'text/event-stream',
            'Content-Type': 'application/json',
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
          method: 'POST',
          version,
        });
        expect(response).toBeInstanceOf(Promise);
      });

      test.each(methods)('$name with custom headers', async ({ req, callableMethod }) => {
        const { params, url } = req;
        const { signal } = new AbortController();
        const response = callableMethod({ signal, ...params, headers: customHeaders });
        const { ...restParams } = params;

        checkRequest({
          request: {
            signal,
            headers: customHeaders,
            url,
            params: convertKeysToSnakeCase(restParams),
          },
          requestMock: createRequestMock,
          method: 'POST',
          version,
        });
        expect(response).toBeInstanceOf(Promise);
      });
    });
  });
});
