import { APIBaseService } from '../../../src/base/base';
import { Chat, Embeddings } from '../../../src/gateway';
import {
  ChatCompletions,
  EmbeddingCompletions,
  GenerateTextCompletions,
} from '../../../src/gateway';
import { createTestServiceConfig, createRequestMockSetup } from '../utils';
import type { MethodsParams, MethodsSimpleParams } from './types';
import {
  convertKeysToSnakeCase,
  describeGatewayContractSuite,
  describeInstanceLevelContainerIds,
} from './helpers';

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

const streamChatCompletion = { ...chatCompletions, stream: true };

const streamGenerateTextCompletions = { ...generateTextCompletions, stream: true };

const serviceOptions = {
  ...createTestServiceConfig(),
};

describe('Completions instances', () => {
  describe('Init instance', () => {
    let client: APIBaseService;

    beforeAll(() => {
      client = new APIBaseService(serviceOptions);
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
    const client = new APIBaseService(serviceOptions);
    const chat = new Chat(client);
    const embeddings = new Embeddings(client);
    const generateText = new GenerateTextCompletions(client);

    const mockSetup = createRequestMockSetup();

    beforeAll(() => {
      mockSetup.setup();
    });

    afterAll(() => {
      mockSetup.unmock();
    });

    const syncMethodDefinitions: MethodsSimpleParams[] = [
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

    const syncMethods: MethodsParams[] = syncMethodDefinitions.map((method) => ({
      ...method,
      method: 'POST',
      expectedBody: convertKeysToSnakeCase(method.req.params),
    }));

    const syncNegativeMethods = syncMethods.map(({ name, callableMethod }) => ({
      name,
      callableMethod,
    }));

    describeGatewayContractSuite({
      describeName: 'Sync methods',
      getRequestMock: mockSetup.getMock,
      methods: syncMethods,
      version: serviceOptions.version,
      mockResponseFactory: async () => Promise.resolve(),
      negativeMethods: syncNegativeMethods,
      withCustomHeaders: true,
    });

    const streamMethodDefinitions: MethodsSimpleParams[] = [
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

    const streamMethods: MethodsParams[] = streamMethodDefinitions.map((method) => ({
      ...method,
      expectedBody: convertKeysToSnakeCase(method.req.params),
      method: 'POST' as const,
      customHeaders: {
        'Content-type': 'text/event-stream',
      },
    }));

    describeGatewayContractSuite({
      describeName: 'Stream methods',
      getRequestMock: mockSetup.getMock,
      methods: streamMethods,
      version: serviceOptions.version,
      mockResponseFactory: async () => ({
        result: [
          'id: 1\nevent: message\ndata: {}\n\n',
          'id: 2\nevent: message\ndata: {}\n\n',
          'id: 3\nevent: message\ndata: {}\n\n',
        ],
      }),
      withCustomHeaders: true,
    });
  });

  describe('Instance-level Container IDs', () => {
    const mockSetup = createRequestMockSetup();

    beforeAll(() => {
      mockSetup.setup();
    });

    beforeEach(() => {
      mockSetup.getMock().mockImplementation(() => Promise.resolve({ result: {} }));
    });

    afterEach(() => {
      mockSetup.reset();
    });

    describeInstanceLevelContainerIds({
      describeName: 'Chat completion methods',
      getRequestMock: mockSetup.getMock,
      methods: [
        {
          name: 'create',
          method: (gateway) =>
            gateway.chat.completion.create({
              messages: [{ role: 'user', content: 'Hello' }],
              model: 'gpt-4o',
            }),
        },
      ],
    });

    describeInstanceLevelContainerIds({
      describeName: 'Embeddings completion methods',
      getRequestMock: mockSetup.getMock,
      methods: [
        {
          name: 'create',
          method: (gateway) =>
            gateway.embeddings.completion.create({
              input: 'Test input',
              model: 'text-embedding-ada-002',
            }),
        },
      ],
    });

    describeInstanceLevelContainerIds({
      describeName: 'Text completion methods',
      getRequestMock: mockSetup.getMock,
      methods: [
        {
          name: 'create',
          method: (gateway) =>
            gateway.completion.create({
              prompt: 'Test prompt',
              model: 'gpt-4o',
            }),
        },
      ],
    });
  });
});
