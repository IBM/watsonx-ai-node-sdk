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

const { readExternalSources } = require('ibm-cloud-sdk-core');
const WatsonxAiMlVmlv1 = require('../../dist/watsonx-ai-ml/vml-v1');
const authHelper = require('../resources/auth-helper.js');

// testcase timeout value (200s).
const timeout = 200000;
const projectId = '<PROJECT_ID>';

// Location of our config file.
const configFile = '<ABS_PATH>/watsonx_ai_ml_vml_v1.env';

const describe = authHelper.prepareTests(configFile);

describe('WatsonxAiMlVmlv1_integration', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAiMlService;

  test('Initialize service', async () => {
    watsonxAiMlService = WatsonxAiMlVmlv1.newInstance({
      serviceUrl: '<SERVICE_URL>',
      version: '2024-03-14',
    });

    expect(watsonxAiMlService).not.toBeNull();

    const config = readExternalSources(WatsonxAiMlVmlv1.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAiMlService.enableRetries();
  });

  test('listFoundationModelSpecs()', async () => {
    const params = {
      limit: 50,
      filters: 'modelid_ibm/granite-13b-instruct-v2',
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
    };

    const allResults = [];

    // Test getNext().
    let pager = new WatsonxAiMlVmlv1.FoundationModelSpecsPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVmlv1.FoundationModelSpecsPager(watsonxAiMlService, params);
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
    let pager = new WatsonxAiMlVmlv1.FoundationModelTasksPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVmlv1.FoundationModelTasksPager(watsonxAiMlService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('textGeneration()', async () => {
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
      truncate_input_tokens: 0,
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
      end: 0,
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
      modelId: 'google/flan-ul2',
      projectId,
      parameters: textGenRequestParametersModel,
      moderations: moderationsModel,
    };

    const res = await watsonxAiMlService.textGeneration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('textGenerationStream()', async () => {
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
      random_seed: 1,
      stop_sequences: ['fail'],
      temperature: 0.8,
      time_limit: 600000,
      top_k: 50,
      top_p: 0.5,
      repetition_penalty: 1.5,
      truncate_input_tokens: 0,
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
      end: 0,
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

    const params = {
      input:
        'Generate a marketing email advertising a new sale with the following characteristics:\n\nCompany: Swimwear Unlimited\n\nOffer Keywords: {Select customers only, mid-summer fun, swimwear sale}\n\nOffer End Date: July 15\n\nAdvertisement Tone: Exciting!\n\nInclude no URLs.\n\nInclude no telephone numbers.\n',
      modelId: 'google/flan-ul2',
      projectId,
      parameters: textGenRequestParametersModel,
      moderations: moderationsModel,
      accept: 'application/json',
    };

    const res = await watsonxAiMlService.textGenerationStream(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('textTokenization()', async () => {
    // Request models needed by this operation.

    // TextTokenizeParameters
    const textTokenizeParametersModel = {
      return_tokens: true,
    };

    const params = {
      modelId: 'google/flan-ul2',
      input: 'Write a tagline for an alumni association: Together we',
      projectId,
      parameters: textTokenizeParametersModel,
    };

    const res = await watsonxAiMlService.textTokenization(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });
  test('textEmbeddings()', async () => {
    // Request models needed by this operation.

    // EmbeddingReturnOptions
    const embeddingReturnOptionsModel = {
      input_text: true,
    };

    // EmbeddingParameters
    const embeddingParametersModel = {
      truncate_input_tokens: 0,
      return_options: embeddingReturnOptionsModel,
    };

    const params = {
      modelId: 'ibm/slate-125m-english-rtrvr',
      inputs: ['Youth craves thrills while adulthood cherishes wisdom.'],
      projectId,
      parameters: embeddingParametersModel,
    };

    const res = await watsonxAiMlService.textEmbeddings(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });
});
