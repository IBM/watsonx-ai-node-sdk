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
/* eslint-disable no-restricted-syntax */

const { Readable, addAbortSignal } = require('node:stream');
const { readExternalSources } = require('ibm-cloud-sdk-core');
const WatsonxAiMlVml_v1 = require('../../dist/watsonx-ai-ml/vml_v1.js');
const authHelper = require('../resources/auth-helper.js');
const testHelper = require('../resources/test-helper.js');
const { Stream } = require('../../dist/lib/common.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = 'credentials/watsonx_ai_ml_vml_v1.env';

const describe = authHelper.prepareTests(configFile);
authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;

describe('WatsonxAiMlVml_v1_integration', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAiMlService;
  // Generate and log the time series data
  const timeSeriesData = testHelper.generateTimeSeries();
  const timeSeriesModelId = 'ibm/granite-ttm-512-96-r2';
  const tsForecastInputSchemaModel = {
    timestamp_column: 'date',
    freq: '1h',
    target_columns: ['target'],
  };

  test('Initialize service', async () => {
    watsonxAiMlService = WatsonxAiMlVml_v1.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      version: '2024-03-14',
    });

    expect(watsonxAiMlService).not.toBeNull();

    const config = readExternalSources(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAiMlService.enableRetries();
  });

  test('listFoundationModelSpecs()', async () => {
    const params = {
      limit: 50,
      filters: 'modelid_ibm/granite-13b-instruct-v2',
      techPreview: false,
    };

    const res = await watsonxAiMlService.listFoundationModelSpecs(params);
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
    let pager = new WatsonxAiMlVml_v1.FoundationModelSpecsPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVml_v1.FoundationModelSpecsPager(watsonxAiMlService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('listFoundationModelTasks()', async () => {
    const params = {
      limit: 50,
    };

    const res = await watsonxAiMlService.listFoundationModelTasks(params);
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
    let pager = new WatsonxAiMlVml_v1.FoundationModelTasksPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVml_v1.FoundationModelTasksPager(watsonxAiMlService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

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
      modelId: 'google/flan-t5-xl',
      projectId,
      parameters: textGenRequestParametersModel,
      moderations: moderationsModel,
    };

    const res = await watsonxAiMlService.generateText(params);
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

    const res = await watsonxAiMlService.generateTextStream({
      input:
        'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n',
      modelId: 'google/flan-t5-xl',
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
      modelId: 'google/flan-t5-xl',
      input: 'Write a tagline for an alumni association: Together we',
      projectId,
      parameters: textTokenizeParametersModel,
    };

    const res = await watsonxAiMlService.tokenizeText(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });
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

    const res = await watsonxAiMlService.embedText(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('textChat', async () => {
    const res = await watsonxAiMlService.textChat({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
      ],
      modelId: 'mistralai/mistral-large',
      projectId,
    });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('textChatStream', async () => {
    const res = await watsonxAiMlService.textChatStream({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
      ],
      modelId: 'mistralai/mistral-large',
      projectId,
    });

    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(Stream);
  });

  test('textChatStream as string', async () => {
    const stream = await watsonxAiMlService.textChatStream({
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
      modelId: 'mistralai/mistral-large',
      projectId,
    });
    for await (const chunk of stream) {
      expect(typeof chunk === 'string').toBe(true);
      break;
    }
  });

  test('textChatStream as object', async () => {
    const stream = await watsonxAiMlService.textChatStream({
      messages: [
        {
          role: 'user',
          content: 'What is your name?',
        },
      ],
      modelId: 'mistralai/mistral-large',
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
      const stream = await watsonxAiMlService.textChatStream({
        messages: [
          {
            role: 'user',
            content: 'What is your name?',
          },
        ],
        modelId: 'mistralai/mistral-large',
        projectId,
      });
      const controller = new AbortController();
      const readable = Readable.from(stream);
      addAbortSignal(controller.signal, readable);
      for await (const chunk of readable) {
        console.log(chunk);
        controller.abort();
      }
    };
    await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
  });

  test('textChatStream build in aborting', async () => {
    const abortStreaming = async () => {
      const stream = await watsonxAiMlService.textChatStream({
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
        modelId: 'mistralai/mistral-large',
        projectId,
      });
      for await (const chunk of stream) {
        console.log(chunk);
        stream.controller.abort();
      }
    };
    await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
  });

  test('textChatStream aborting chunk count', async () => {
    const stream = await watsonxAiMlService.textChatStream({
      messages: [
        {
          role: 'user',
          content: 'What is your name?',
        },
      ],
      modelId: 'mistralai/mistral-large',
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
        console.log(chunk);
        chunks.push(chunk);
        i += 1;
        if (i === n) controller.abort();
      }
    } catch (e) {
      console.log(e);
    }
    expect(chunks).toHaveLength(n);
  });
  test('textChatStream build-in aborting chunk count', async () => {
    const stream = await watsonxAiMlService.textChatStream({
      messages: [
        {
          role: 'user',
          content: 'What is your name?',
        },
      ],
      modelId: 'mistralai/mistral-large',
      projectId,
    });
    let i = 0;
    const n = 10;
    const chunks = [];
    try {
      for await (const chunk of stream) {
        console.log(chunk);
        chunks.push(chunk);
        i += 1;
        if (i === n) stream.controller.abort();
      }
    } catch (e) {
      console.log(e);
    }
    expect(chunks).toHaveLength(n);
  });

  test('textChatStream with returnObject returning correct object with different models', async () => {
    const models = [
      'mistralai/mistral-large',
      'ibm/granite-3-8b-instruct',
      'meta-llama/llama-3-1-70b-instruct',
    ];
    const streamObject = async (model) => {
      const stream = await watsonxAiMlService.textChatStream({
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
    };
    await Promise.all(models.map((model) => streamObject(model)));
  });

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

    const res = await watsonxAiMlService.timeSeriesForecast(params);
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

    const res = await watsonxAiMlService.timeSeriesForecast(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
    expect(res.result.results[0].target).toHaveLength(96);
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
      const res = await watsonxAiMlService.textChat(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: 'meta-llama/llama-3-1-70b-instruct',
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
      const res = await watsonxAiMlService.textChatStream(
        {
          messages: [{ role: 'user', content: 'Hello. How are you?' }],
          modelId: 'meta-llama/llama-3-1-70b-instruct',
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
      const res = await watsonxAiMlService.generateText(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: 'meta-llama/llama-3-1-70b-instruct',
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
      const res = await watsonxAiMlService.generateTextStream(
        {
          input: 'Hello. How are you? Tell me a lot',
          modelId: 'meta-llama/llama-3-1-70b-instruct',
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
      const res = await watsonxAiMlService.embedText(
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
      const res = await watsonxAiMlService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: 'meta-llama/llama-3-1-70b-instruct',
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          requestCallback,
        }
      );
      expect(res).toBeDefined();
    });
    test('generateText with single responseCallback callback', async () => {
      const res = await watsonxAiMlService.generateText(
        {
          input: 'Hello. How are you?',
          modelId: 'meta-llama/llama-3-1-70b-instruct',
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        },
        {
          responseCallback,
        }
      );
      expect(res).toBeDefined();
    });
  });
});
