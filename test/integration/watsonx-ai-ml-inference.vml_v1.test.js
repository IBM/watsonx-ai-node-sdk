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

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const { Readable, addAbortSignal } = require('node:stream');
const { readExternalSources } = require('ibm-cloud-sdk-core');
const path = require('path');
const { WatsonXAI } = require('../../dist/vml_v1.js');
const authHelper = require('../resources/auth-helper.js');
const testHelper = require('../resources/test-helper.js');
const { Stream } = require('../../dist/lib/common.js');
const { chatModel } = require('./config.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');

const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;

const checkAborting = async (requestFnc, params) =>
  test(`Aborting function: ${requestFnc}`, async () => {
    const controller = new AbortController();
    const { signal } = controller;
    try {
      const promise = requestFnc({ ...params, signal });
      await new Promise((resolve) => setTimeout(resolve, 10));
      controller.abort();
      await promise;
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('canceled');
    }
  });

describe('WatsonxAiMlVml_v1_integration', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAIService;
  // Generate and log the time series data
  const timeSeriesData = testHelper.generateTimeSeries();
  const timeSeriesModelId = 'ibm/granite-ttm-512-96-r2';
  const tsForecastInputSchemaModel = {
    timestamp_column: 'date',
    freq: '1h',
    target_columns: ['target'],
  };

  beforeAll(async () => {
    watsonxAIService = WatsonXAI.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      version: '2024-03-14',
    });

    expect(watsonxAIService).not.toBeNull();

    const config = readExternalSources(WatsonXAI.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAIService.enableRetries();
  });

  describe('List resources', () => {
    test('listFoundationModelSpecs()', async () => {
      const params = {
        limit: 50,
        filters: 'modelid_ibm/granite-13b-instruct-v2',
        techPreview: false,
      };

      const res = await watsonxAIService.listFoundationModelSpecs(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('listFoundationModelSpecs() via FoundationModelSpecsPager', async () => {
      const params = {
        limit: 50,
        filters: 'modelid_ibm/granite-13b-instruct-v2',
        techPreview: false,
      };

      const allResults = [];

      // Test getNext().
      let pager = new WatsonXAI.FoundationModelSpecsPager(watsonxAIService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonXAI.FoundationModelSpecsPager(watsonxAIService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
    });

    test('listFoundationModelTasks()', async () => {
      const params = {
        limit: 50,
      };

      const res = await watsonxAIService.listFoundationModelTasks(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('listFoundationModelTasks() via FoundationModelTasksPager', async () => {
      const params = {
        limit: 50,
      };

      const allResults = [];

      // Test getNext().
      let pager = new WatsonXAI.FoundationModelTasksPager(watsonxAIService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonXAI.FoundationModelTasksPager(watsonxAIService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
    });
  });

  describe('Text generation', () => {
    test('generateText', async () => {
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
        stop_sequences: ['fail'],
        time_limit: 600000,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        chat: chatTextGenPropertiesModel,
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
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
        end: 10,
      };

      // ModerationProperties
      const moderationPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
      };

      // Moderations
      const moderationsModel = {
        hap: moderationHapPropertiesModel,
        pii: moderationPiiPropertiesModel,
        input_ranges: [moderationTextRangeModel],
        foo: moderationPropertiesModel,
      };

      const params = {
        input:
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n',
        modelId: chatModel,
        projectId,
        parameters: textGenRequestParametersModel,
        moderations: moderationsModel,
      };

      const res = await watsonxAIService.generateText(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('generateTextStream', async () => {
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
        max_new_tokens: 300,
        min_new_tokens: 5,
        stop_sequences: ['fail'],
        time_limit: 600000,
        repetition_penalty: 1.5,
        truncate_input_tokens: 1,
        return_options: returnOptionPropertiesModel,
        include_stop_sequence: true,
        chat: chatTextGenPropertiesModel,
      };

      // TextModeration
      const textModerationModel = {
        enabled: true,
        threshold: 0,
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
      };

      // ModerationPiiProperties
      const moderationPiiPropertiesModel = {
        input: textModerationModel,
        output: textModerationModel,
        mask: maskPropertiesModel,
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

      const res = await watsonxAIService.generateTextStream({
        input:
          'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n',
        modelId: chatModel,
        projectId,
        parameters: textGenRequestParametersModel,
      });

      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(Stream);
    });

    test('tokenizeText', async () => {
      // Request models needed by this operation.

      // TextTokenizeParameters
      const textTokenizeParametersModel = {
        return_tokens: true,
      };

      const params = {
        modelId: chatModel,
        input: 'Write a tagline for an alumni association: Together we',
        projectId,
        parameters: textTokenizeParametersModel,
      };

      const res = await watsonxAIService.tokenizeText(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });
  });

  describe('Embeddings', () => {
    test('embedText', async () => {
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

      const params = {
        modelId: 'ibm/slate-125m-english-rtrvr',
        inputs: ['Youth craves thrills while adulthood cherishes wisdom.'],
        projectId,
        parameters: embeddingParametersModel,
      };

      const res = await watsonxAIService.embedText(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });
  });

  describe('Chat', () => {
    test('textChat', async () => {
      const res = await watsonxAIService.textChat({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
        ],
        modelId: chatModel,
        projectId,
      });

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('textChat favor maxCompletionTokens', async () => {
      const res = await watsonxAIService.textChat({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'Tell me about AI, please!',
          },
        ],
        modelId: chatModel,
        projectId,
        maxTokens: 5,
        maxCompletionTokens: 10,
      });

      expect(res.status).toBe(200);
      expect(res.result.usage.completion_tokens).toBe(10);
    });

    test('textChatStream', async () => {
      const res = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
        ],
        modelId: chatModel,
        projectId,
      });

      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(Stream);
    });

    test('textChatStream favor maxCompletionTokens', async () => {
      const res = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'Tell me about AI, please!',
          },
        ],
        modelId: chatModel,
        projectId,
        maxTokens: 10,
        maxCompletionTokens: 5,
        returnObject: true,
      });

      expect(res).toBeInstanceOf(Stream);
      let lastChunk;
      for await (const chunk of res) {
        lastChunk = chunk;
      }
      expect(lastChunk.data.usage.completion_tokens).toBe(5);
    });

    test('textChatStream as string', async () => {
      const stream = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'What is your name?',
          },
        ],
        modelId: chatModel,
        projectId,
      });
      for await (const chunk of stream) {
        expect(typeof chunk === 'string').toBe(true);
        break;
      }
    });

    test('textChatStream as object', async () => {
      const stream = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'user',
            content: 'What is your name?',
          },
        ],
        modelId: chatModel,
        projectId,
        returnObject: true,
      });
      for await (const chunk of stream) {
        expect(typeof chunk.id === 'number').toBe(true);
        break;
      }
    });

    test('textChatStream aborting', async () => {
      const abortStreaming = async () => {
        const stream = await watsonxAIService.textChatStream({
          messages: [
            {
              role: 'user',
              content: 'What is your name?',
            },
          ],
          modelId: chatModel,
          projectId,
        });
        const controller = new AbortController();
        const readable = Readable.from(stream);
        addAbortSignal(controller.signal, readable);
        for await (const chunk of readable) {
          controller.abort();
        }
      };
      await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
    });

    test('textChatStream build in aborting', async () => {
      const abortStreaming = async () => {
        const stream = await watsonxAIService.textChatStream({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: 'What is your name?',
            },
          ],
          modelId: chatModel,
          projectId,
        });
        for await (const chunk of stream) {
          stream.controller.abort();
        }
      };
      await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
    });

    test('textChatStream aborting chunk count', async () => {
      const stream = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'user',
            content: 'What is your name?',
          },
        ],
        modelId: chatModel,
        projectId,
      });
      let i = 0;
      const n = 10;
      const chunks = [];
      const controller = new AbortController();
      const readable = Readable.from(stream);
      const rdb = addAbortSignal(controller.signal, readable);
      try {
        for await (const chunk of rdb) {
          chunks.push(chunk);
          i += 1;
          if (i === n) controller.abort();
        }
      } catch (e) {
        expect(e.message).toBe('The operation was aborted');
      }
      expect(chunks).toHaveLength(n);
    });
    test('textChatStream build-in aborting chunk count', async () => {
      const stream = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'user',
            content: 'What is your name?',
          },
        ],
        modelId: chatModel,
        projectId,
      });
      let i = 0;
      const n = 10;
      const chunks = [];
      try {
        for await (const chunk of stream) {
          chunks.push(chunk);
          i += 1;
          if (i === n) stream.controller.abort();
        }
      } catch (e) {
        expect(e.message).toBe('The operation was aborted');
      }
      expect(chunks).toHaveLength(n);
    });
    const modelName = 'mistralai/mistral-medium-2505';
    const models = [modelName, 'ibm/granite-3-8b-instruct', chatModel];
    test.each(models)(
      'textChatStream with returnObject returning correct object with %s',
      async (model) => {
        const stream = await watsonxAIService.textChatStream({
          messages: [
            {
              role: 'user',
              content: 'Hello. How are you?',
            },
          ],
          modelId: model,
          projectId,
          returnObject: true,
        });
        for await (const chunk of stream) {
          expect(chunk.id).toBeDefined();
          expect(chunk.event).toBeDefined();
          expect(chunk.data).toBeDefined();
        }
      }
    );
  });

  describe('Time series', () => {
    test('timeSeriesForecast with prediction_length', async () => {
      // TSForecastParameters
      const tsForecastParametersModel = {
        prediction_length: 38,
      };

      const params = {
        modelId: timeSeriesModelId,
        data: timeSeriesData,
        schema: tsForecastInputSchemaModel,
        projectId,
        parameters: tsForecastParametersModel,
      };

      const res = await watsonxAIService.timeSeriesForecast(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
      expect(res.result.results[0].target).toHaveLength(38);
    });

    test('timeSeriesForecast without prediction_length', async () => {
      const params = {
        modelId: timeSeriesModelId,
        data: timeSeriesData,
        schema: tsForecastInputSchemaModel,
        projectId,
      };

      const res = await watsonxAIService.timeSeriesForecast(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
      expect(res.result.results[0].target).toHaveLength(96);
    });
  });

  describe('Callback tests', () => {
    const requestCallback = (req) => {
      expect(req).toBeDefined();
      expect(req.options).toBeDefined();
      expect(req.defaultOptions).toBeDefined();
      expect(req.defaultOptions.headers).toBeUndefined();
    };
    const responseCallback = (res) => {
      expect(res).toBeDefined();
      expect(res.result).toBeDefined();
      expect(res.status).toBeDefined();
      expect(res.statusText).toBeDefined();
      expect(res.headers).toBeDefined();
    };
    test('textChat with callbacks', async () => {
      const res = await watsonxAIService.textChat(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('textChatSteam with callbacks', async () => {
      const res = await watsonxAIService.textChatStream(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('generateText with callbacks', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('generateTextStream with callbacks', async () => {
      const res = await watsonxAIService.generateTextStream(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('embedText with callbacks', async () => {
      const res = await watsonxAIService.embedText(
        {
          inputs: ['Hello. How are you?', 'Hello world'],
          modelId: 'ibm/slate-125m-english-rtrvr',
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('generateText with single requestCallback callback', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('generateText with single responseCallback callback', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
  });

  describe('Aborting', () => {
    const testArray = [
      {
        params: {
          input: 'Hi. I will abort this request anyway',
          modelId: chatModel,
          projectId,
        },
        res: (args) => watsonxAIService.generateText(args),
      },
      {
        params: {
          input: 'Hi. I will abort this request anyway',
          modelId: chatModel,
          projectId,
        },
        res: (args) => watsonxAIService.generateTextStream(args),
      },
      {
        params: {
          limit: 50,
          filters: 'modelid_ibm/granite-13b-instruct-v2',
          techPreview: false,
        },
        res: (args) => watsonxAIService.listFoundationModelSpecs(args),
      },
      {
        params: {
          limit: 50,
        },
        res: (args) => watsonxAIService.listFoundationModelTasks(args),
      },
      {
        params: {
          modelId: chatModel,
          input: 'Hi. I will abort this request anyway',
          projectId,
        },
        res: (args) => watsonxAIService.tokenizeText(args),
      },
      {
        params: {
          modelId: 'ibm/slate-125m-english-rtrvr',
          inputs: ['Hi. I will abort this request anyway'],
          projectId,
        },
        res: (args) => watsonxAIService.embedText(args),
      },
      {
        params: {
          modelId: timeSeriesModelId,
          data: timeSeriesData,
          schema: tsForecastInputSchemaModel,
          projectId,
          parameters: {
            prediction_length: 38,
          },
        },
        res: (args) => watsonxAIService.timeSeriesForecast(args),
      },
      {
        params: {
          messages: [
            {
              role: 'user',
              content: 'Hi. I will abort this request anyway',
            },
          ],
          modelId: chatModel,
          projectId,
        },
        res: (args) => watsonxAIService.textChat(args),
      },
      {
        params: {
          messages: [
            {
              role: 'user',
              content: 'Hi. I will abort this request anyway',
            },
          ],
          modelId: chatModel,
          projectId,
        },
        res: (args) => watsonxAIService.textChatStream(args),
      },
    ];
    for (const { res, params } of testArray) {
      checkAborting(res, params);
    }
  });
});
