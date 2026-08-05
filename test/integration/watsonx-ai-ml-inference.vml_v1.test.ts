/**
 * (C) Copyright IBM Corp. 2024.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { Readable, addAbortSignal } from 'node:stream';
import { readExternalSources } from 'ibm-cloud-sdk-core';
import path from 'path';
import type { RequestParametersWithoutHeaders, Response } from '../../src/vml_v1';
import { WatsonXAI } from '../../src/vml_v1';
import * as authHelper from '../resources/auth-helper';
import * as testHelper from '../resources/test-helper';
import { Stream } from '../../src/lib/common';
import { expectSuccessResponse, testPagerPattern } from '../utils/utils';
import {
  CHAT_MODEL_IBM as chatModel,
  CHAT_MODEL_MISTRAL,
  CHAT_MODEL_META,
  EMBEDDING_MODEL_IBM as embeddingModel,
  TIME_SERIES_MODEL_IBM_512_96 as timeSeriesModelId,
  CHAT_MODEL_GPT_OOS,
} from './config';

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');

const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;

const checkAborting = async (
  requestFnc: (params: Record<string, any>) => Promise<any>,
  params: Record<string, any>
) =>
  test(`Aborting function: ${requestFnc}`, async () => {
    const controller = new AbortController();
    const { signal } = controller;
    const promise = requestFnc({ ...params, signal });
    await new Promise((resolve) => setTimeout(resolve, 10));
    controller.abort();
    expect(promise).rejects.toThrow('canceled');
  });

describe('Foundation Models', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAIService: WatsonXAI;
  // Generate and log the time series data
  const timeSeriesData = testHelper.generateTimeSeries();
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

  describe('Model Specs', () => {
    test('list foundation model specs', async () => {
      const params = {
        limit: 50,
        filters: 'modelid_ibm/granite-13b-instruct-v2',
        techPreview: false,
      };

      const res = await watsonxAIService.listFoundationModelSpecs(params);
      expectSuccessResponse(res, 200);
    });

    test('list foundation model specs via pager', async () => {
      const params = {
        limit: 50,
        filters: 'modelid_ibm/granite-13b-instruct-v2',
        techPreview: false,
      };

      await testPagerPattern(WatsonXAI.FoundationModelSpecsPager, watsonxAIService, params, 0);
    });

    test('list foundation model tasks', async () => {
      const params = {
        limit: 50,
      };

      const res = await watsonxAIService.listFoundationModelTasks(params);
      expectSuccessResponse(res, 200);
    });

    test('list foundation model tasks via pager', async () => {
      const params = {
        limit: 50,
      };

      await testPagerPattern(WatsonXAI.FoundationModelTasksPager, watsonxAIService, params, 0);
    });
  });

  describe('Text Generation', () => {
    test('generate text', async () => {
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
      expectSuccessResponse(res, 200);
    });

    test('generate text stream', async () => {
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

    test('tokenize text', async () => {
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
      expectSuccessResponse(res, 200);
    });
  });

  describe('Embeddings', () => {
    test('embed text', async () => {
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
        modelId: embeddingModel,
        inputs: ['Youth craves thrills while adulthood cherishes wisdom.'],
        projectId,
        parameters: embeddingParametersModel,
      };

      const res = await watsonxAIService.embedText(params);
      expectSuccessResponse(res, 200);
    });
  });

  describe('Chat', () => {
    test('text chat', async () => {
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

      expectSuccessResponse(res, 200);
    });

    test('text chat favor max completion tokens', async () => {
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
      expect(res.result.usage?.completion_tokens).toBe(10);
    });

    test('text chat with reasoning', async () => {
      const res = await watsonxAIService.textChat({
        messages: [
          {
            role: 'system',
            content: 'Do math 2+2',
          },
        ],
        modelId: CHAT_MODEL_GPT_OOS,
        projectId,
        includeReasoning: true,
      });

      expect(res.status).toBe(200);
      expect(res.result.choices[0].message?.reasoning_content).toBeDefined();
    });

    test('text chat stream', async () => {
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

      expect(res).toBeInstanceOf(Stream);
    });

    test('text chat stream favor max completion tokens', async () => {
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

      expect(lastChunk?.data.usage?.completion_tokens).toBe(5);
    });

    test('text chat stream as string', async () => {
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

    test('text chat stream as object', async () => {
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

    test('text chat stream aborting', async () => {
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
        for await (const _chunk of readable) {
          controller.abort();
        }
      };

      await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
    });

    test('text chat stream build in aborting', async () => {
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
        for await (const _chunk of stream) {
          stream.controller.abort();
        }
      };

      await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
    });

    test('text chat stream aborting chunk count', async () => {
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
      const chunks: string[] = [];
      const controller = new AbortController();
      const readable = Readable.from(stream);
      const rdb = addAbortSignal(controller.signal, readable);

      await expect(async () => {
        for await (const chunk of rdb) {
          chunks.push(chunk);
          i += 1;
          if (i === n) controller.abort();
        }
      }).rejects.toThrow('The operation was aborted');

      expect(chunks).toHaveLength(n);
    });

    test('text chat stream build in aborting chunk count', async () => {
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
      const chunks: string[] = [];

      await expect(async () => {
        for await (const chunk of stream) {
          chunks.push(chunk);
          i += 1;
          if (i === n) stream.controller.abort();
        }
      }).rejects.toThrow('The operation was aborted');
      expect(chunks).toHaveLength(n);
    });

    test('text chat stream with reasoning', async () => {
      const stream = await watsonxAIService.textChatStream({
        messages: [
          {
            role: 'system',
            content: 'Do math 2+2',
          },
        ],
        modelId: CHAT_MODEL_GPT_OOS,
        projectId,
        includeReasoning: true,
        returnObject: true,
      });

      const result: Record<string, any> = {};
      for await (const chunk of stream) {
        const message = chunk.data.choices[0];
        if (message && message.delta) {
          for (const [key, value] of Object.entries(message.delta)) {
            result[key] ??= '';
            result[key] += value;
          }
        }
      }

      expect(result.reasoning_content.length).toBeGreaterThan(0);
    });

    const chatModels = [chatModel, CHAT_MODEL_META, CHAT_MODEL_MISTRAL];

    test.each(chatModels)('test text chat stream with return object[%s]', async (model) => {
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
    });
  });

  describe('Time Series', () => {
    test('time series forecast with prediction length', async () => {
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
      expectSuccessResponse(res, 200);

      expect(res.result.results?.[0].target).toHaveLength(38);
    });

    test('time series forecast without prediction length', async () => {
      const params = {
        modelId: timeSeriesModelId,
        data: timeSeriesData,
        schema: tsForecastInputSchemaModel,
        projectId,
      };

      const res = await watsonxAIService.timeSeriesForecast(params);
      expectSuccessResponse(res, 200);

      expect(res.result.results?.[0].target).toHaveLength(96);
    });
  });

  describe('Callbacks', () => {
    const assertRequestCallback = (req: RequestParametersWithoutHeaders) => {
      expect(req).toBeDefined();
      expect(req.options).toBeDefined();
      expect(req.defaultOptions).toBeDefined();
      expect(req.defaultOptions.headers).toBeUndefined();
    };
    const assertResponseCallback = (res: Response<any>) => {
      expect(res.result).toBeDefined();
      expect(res.status).toBeDefined();
      expect(res.statusText).toBeDefined();
      expect(res.headers).toBeDefined();
    };

    test('text chat with callbacks', async () => {
      const res = await watsonxAIService.textChat(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('text chat stream with callbacks', async () => {
      const res = await watsonxAIService.textChatStream(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('generate text with callbacks', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('generate text stream with callbacks', async () => {
      const res = await watsonxAIService.generateTextStream(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('embed text with callbacks', async () => {
      const res = await watsonxAIService.embedText(
        {
          inputs: ['Hello. How are you?', 'Hello world'],
          modelId: embeddingModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('generate text with single request callback', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback: assertRequestCallback,
        }
      );

      expect(res).toBeDefined();
    });

    test('generate text with single response callback', async () => {
      const res = await watsonxAIService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: chatModel,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          responseCallback: assertResponseCallback,
        }
      );

      expect(res).toBeDefined();
    });
  });

  describe.skip('Crypto', () => {
    const YP_QA_URL = 'https://yp-qa.ml.cloud.ibm.com';
    const cryptoConfig = {
      key_ref: process.env.WATSONX_AI_CRYPTO_KEY_REF as string,
    };

    const watsonxAIServiceYPQA = WatsonXAI.newInstance({
      serviceUrl: YP_QA_URL,
      version: '2024-03-14',
    });

    test('text chat with crypto parameter', async () => {
      const textChatMessagesModel = {
        role: 'user',
        content: 'Hello, how are you?',
      };

      const params = {
        modelId: chatModel,
        messages: [textChatMessagesModel],
        projectId,
        maxTokens: 50,
        crypto: cryptoConfig,
      };

      const res = await watsonxAIServiceYPQA.textChat(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('embed text with crypto parameter', async () => {
      const embeddingParametersModel = {
        truncate_input_tokens: 1,
      };

      const params = {
        modelId: 'ibm/slate-125m-english-rtrvr-v2',
        inputs: ['Test embedding with encryption'],
        projectId,
        parameters: embeddingParametersModel,
        crypto: cryptoConfig,
      };

      const res = await watsonxAIServiceYPQA.embedText(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('generate text with crypto parameter', async () => {
      const textGenParametersModel = {
        max_new_tokens: 50,
        min_new_tokens: 5,
      };

      const params = {
        input: 'What is the capital of France?',
        modelId: chatModel,
        projectId,
        parameters: textGenParametersModel,
        crypto: cryptoConfig,
      };

      const res = await watsonxAIServiceYPQA.generateText(params);

      expect(res?.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('tokenize text with crypto parameter', async () => {
      const textTokenizeParametersModel = {
        return_tokens: true,
      };

      const params = {
        modelId: chatModel,
        input: 'Tokenize this text with encryption',
        projectId,
        parameters: textTokenizeParametersModel,
        crypto: cryptoConfig,
      };

      const res = await watsonxAIServiceYPQA.tokenizeText(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('text rerank with crypto parameter', async () => {
      const result = await fetch(
        'https://raw.github.com/IBM/watson-machine-learning-samples/master/cloud/data/foundation_models/state_of_the_union.txt'
      );
      const text = await result.text();

      const data = [];
      const chunkSize = 500;
      const chunkOverlap = 100;
      for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
        const chunk = text.slice(i, i + chunkSize);
        data.push({ text: chunk });
      }
      const params = {
        modelId: 'cross-encoder/ms-marco-minilm-l-12-v2',
        inputs: data,
        query: 'What did the president say about Ketanji Brown Jackson',
        projectId: process.env.WATSONX_AI_PROJECT_ID,
        parameters: {
          return_options: {
            top_n: 3,
            inputs: true,
          },
        },
        crypto: cryptoConfig,
      };

      const res = await watsonxAIServiceYPQA.textRerank(params);

      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });
  });

  describe('Abort Signal', () => {
    interface AbortingParams {
      params: any;
      res: (params: any) => Promise<any>;
    }
    const testArray: AbortingParams[] = [
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
          modelId: embeddingModel,
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
