/**
 * (C) Copyright IBM Corp. 2024.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
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
  let trainingId;
  let deploymentId;
  let promptId;
  let sessionId;
  let entryId;

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

  test('trainingsCreate()', async () => {
    // Request models needed by this operation.

    // DataConnection
    // const dataConnectionModel = {
    //  foo: 'testString',
    // };

    // ObjectLocation
    const objectLocationModel = {
      location: { path: 'tune1/results' },
      type: 'container',
      // id: 'testString',
      // connection: dataConnectionModel,
    };

    // BaseModel
    const baseModelModel = {
      model_id: 'google/flan-t5-xl',
    };

    // PromptTuning
    const promptTuningModel = {
      base_model: baseModelModel,
      task_id: 'classification',
      tuning_type: 'prompt_tuning',
      num_epochs: 1,
      learning_rate: 0.4,
      accumulate_steps: 3,
      verbalizer: 'rte { 0 : entailment, 1 : not entailment } {{input}}',
      batch_size: 10,
      max_input_tokens: 100,
      max_output_tokens: 100,
      init_method: 'text',
      init_text: 'testString',
    };

    // DataSchema
    // const dataSchemaModel = {
    // id: 't1',
    // name: 'Tasks',
    // fields: [{ name: 'duration', type: 'number' }],
    // type: 'struct',
    // };
    const href = '<LOCALIZATION OF ASSET>';
    // DataConnectionReference
    const dataConnectionReferenceModel = {
      // id: 'tune1_data.json',
      // connection: dataConnectionModel,
      // schema: dataSchemaModel,
      type: 'data_asset',
      location: {
        href,
      },
    };

    const params = {
      name: 'my-prompt-tune-training',
      resultsReference: objectLocationModel,
      projectId, // or spaceId
      description: 'testString',
      tags: ['testString'],
      promptTuning: promptTuningModel,
      trainingDataReferences: [dataConnectionReferenceModel],
      custom: { anyKey: 'anyValue' },
      autoUpdateModel: true,
    };

    const res = await watsonxAiMlService.trainingsCreate(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
    trainingId = res.result.metadata.id;
  });

  test('trainingsList()', async () => {
    const params = {
      limit: 50,
      totalCount: true,
      tagValue: 'testString',
      state: 'queued',
      projectId,
    };

    const res = await watsonxAiMlService.trainingsList(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('trainingsList() via TrainingsListPager', async () => {
    const params = {
      limit: 50,
      totalCount: true,
      state: 'queued',
      projectId,
    };

    const allResults = [];

    // Test getNext().
    let pager = new WatsonxAiMlVmlv1.TrainingsListPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVmlv1.TrainingsListPager(watsonxAiMlService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test('trainingsGet()', async () => {
    const params = {
      trainingId,
      projectId,
    };

    const res = await watsonxAiMlService.trainingsGet(params);
    console.log(res.result);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('createDeployment()', async () => {
    const trainingparams = {
      trainingId,
      projectId,
    };

    const retryAsyncCall = async (asyncFn, args = [], retries = 5, delay = 120000) => {
      for (let i = 0; i < retries; i += 1) {
        const result = await watsonxAiMlService.trainingsGet(args);
        console.log(result);
        if (result.result.entity.model_id !== undefined) {
          return result.result.entity.model_id;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw new Error('Failed to get a valid response after maximum retries');
    };

    const modelId = await retryAsyncCall(watsonxAiMlService.trainingsGet, trainingparams);

    // Request models needed by this operation.
    console.log(modelId);
    // OnlineDeploymentParameters
    const onlineDeploymentParametersModel = {
      serving_name: 'test_deployment',
    };

    // OnlineDeployment
    const onlineDeploymentModel = {
      parameters: onlineDeploymentParametersModel,
    };

    // Rel
    const relModel = {
      id: modelId,
    };

    // SimpleRel
    // const simpleRelModel = {
    //  id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
    // };

    const params = {
      name: 'text_classification',
      online: onlineDeploymentModel,
      projectId,
      description: 'testString',
      tags: ['testString'],
      custom: { anyKey: 'anyValue' },
      asset: relModel,
      // promptTemplate: simpleRelModel,
      // baseModelId: 'testString',
    };

    const res = await watsonxAiMlService.createDeployment(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(202);
    expect(res.result).toBeDefined();
    deploymentId = res.result.metadata.id;
  }, 650000);

  test('listDeployments()', async () => {
    const params = {
      projectId,
      // servingName: 'classification',
      // tagValue: 'testString',
      // assetId: 'testString',
      // promptTemplateId: 'testString',
      // state: 'ready',
      conflict: false,
    };

    const res = await watsonxAiMlService.listDeployments(params);
    console.log(res.result.resources);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('deploymentsGet()', async () => {
    const params = {
      deploymentId,
      projectId,
    };

    const res = await watsonxAiMlService.deploymentsGet(params);
    console.log(res.result);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('deploymentsUpdate()', async () => {
    // Request models needed by this operation.

    // JsonPatchOperation
    const jsonPatchOperationModel = {
      op: 'add',
      path: '/name',
      value: 'update',
      from: 'test_deployment',
    };

    const params = {
      deploymentId,
      jsonPatch: [jsonPatchOperationModel],
      projectId,
    };

    const res = await watsonxAiMlService.deploymentsUpdate(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('deploymentsTextGeneration()', async () => {
    // Request models needed by this operation.
    const getParams = {
      deploymentId,
      projectId,
    };

    const retryAsyncCall = async (asyncFn, args = [], retries = 5, delay = 120000) => {
      for (let i = 0; i < retries; i += 1) {
        const result = await watsonxAiMlService.deploymentsGet(args);
        console.log(result);
        console.log(result.result.entity.status);
        if (result.result.entity.status.state === 'ready') {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw new Error('Failed to get a valid response after maximum retries');
    };
    await retryAsyncCall(watsonxAiMlService.deploymentsGet, getParams);
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

    // DeploymentTextGenProperties
    const deploymentTextGenPropertiesModel = {
      decoding_method: 'greedy',
      length_penalty: textGenLengthPenaltyModel,
      max_new_tokens: 100,
      min_new_tokens: 5,
      stop_sequences: ['fail'],
      time_limit: 600000,
      repetition_penalty: 1.5,
      truncate_input_tokens: 0,
      return_options: returnOptionPropertiesModel,
      include_stop_sequence: true,
      prompt_variables: {
        doc_type: 'emails',
        entity_name: 'Golden Retail',
        country_name: 'London',
      },
    };

    // TextModeration
    const textModerationModel = {
      enabled: true,
      threshold: 0,
      foo: 'testString',
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
      idOrName: deploymentId,
      input: 'how far is paris from bangalore:\n',
      parameters: deploymentTextGenPropertiesModel,
      moderations: moderationsModel,
    };

    const res = await watsonxAiMlService.deploymentsTextGeneration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  }, 600000);

  test('deploymentsTextGenerationStream()', async () => {
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

    // DeploymentTextGenProperties
    const deploymentTextGenPropertiesModel = {
      decoding_method: 'greedy',
      length_penalty: textGenLengthPenaltyModel,
      max_new_tokens: 30,
      min_new_tokens: 5,
      random_seed: 1,
      stop_sequences: ['fail'],
      temperature: 1.5,
      time_limit: 600000,
      top_k: 50,
      top_p: 0.5,
      repetition_penalty: 1.5,
      truncate_input_tokens: 0,
      return_options: returnOptionPropertiesModel,
      include_stop_sequence: true,
      typical_p: 0.5,
      prompt_variables: {
        doc_type: 'emails',
        entity_name: 'Golden Retail',
        country_name: 'London',
      },
    };

    // TextModeration
    const textModerationModel = {
      enabled: true,
      threshold: 0,
      foo: 'testString',
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
      idOrName: deploymentId,
      input: 'testString',
      parameters: deploymentTextGenPropertiesModel,
      moderations: moderationsModel,
      accept: 'application/json',
    };

    const res = await watsonxAiMlService.deploymentsTextGenerationStream(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('postPrompt()', async () => {
    // Request models needed by this operation.

    // PromptWithExternalModelParameters
    const promptWithExternalModelParametersModel = {
      decoding_method: 'testString',
      max_new_tokens: 38,
      min_new_tokens: 38,
      random_seed: 38,
      stop_sequences: ['testString'],
      temperature: 72.5,
      top_k: 72.5,
      top_p: 72.5,
      repetition_penalty: 72.5,
    };

    // PromptData
    const promptDataModel = {
      instruction: 'testString',
      input_prefix: 'testString',
      output_prefix: 'testString',
    };

    // ChatItem
    const chatItemModel = {
      type: 'question',
      content: 'Some text',
      status: 'ready',
      timestamp: 1711504485261,
    };

    // ExternalPromptAdditionalInformationItem
    const externalPromptAdditionalInformationItemModel = {
      key: 'testString',
    };

    // ExternalInformationExternalPrompt
    const externalInformationExternalPromptModel = {
      url: 'testString',
      additional_information: [[externalPromptAdditionalInformationItemModel]],
    };

    // ExternalInformationExternalModel
    const externalInformationExternalModelModel = {
      name: 'testString',
      url: 'testString',
    };

    // ExternalInformation
    const externalInformationModel = {
      external_prompt_id: 'testString',
      external_model_id: 'testString',
      external_model_provider: 'testString',
      external_prompt: externalInformationExternalPromptModel,
      external_model: externalInformationExternalModelModel,
    };

    // PromptWithExternal
    const promptWithExternalModel = {
      input: [['testString', '']],
      model_id: 'ibm/granite-13b-chat-v2',
      // model_parameters: promptWithExternalModelParametersModel,
      data: promptDataModel,
      // system_prompt: 'testString',
      // chat_items: [chatItemModel],
      // external_information: externalInformationModel,
    };

    // PromptLock
    const promptLockModel = {
      locked: true,
    };

    // WxPromptPostModelVersion
    // const wxPromptPostModelVersionModel = {
    //  number: '2.0.0-rc.7',
    //  tag: 'tag',
    //  description: 'Description of the model version.',
    // };

    const params = {
      name: 'My Prompt',
      prompt: promptWithExternalModel,
      description: 'My First Prompt',
      // createdAt: 1711504485261,
      taskIds: ['testString'],
      lock: promptLockModel,
      // modelVersion: wxPromptPostModelVersionModel,
      // promptVariables: { 'key1': { anyKey: 'anyValue' } },
      inputMode: 'structured',
      projectId,
    };

    const res = await watsonxAiMlService.postPrompt(params);
    console.log(res);
    promptId = res.result.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('getPrompt()', async () => {
    const params = {
      promptId,
      projectId,
      restrictModelParameters: 'true',
    };

    const res = await watsonxAiMlService.getPrompt(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('patchPrompt()', async () => {
    // Request models needed by this operation.

    // PromptModelParameters
    const promptModelParametersModel = {
      decoding_method: 'testString',
      max_new_tokens: 38,
      min_new_tokens: 38,
      random_seed: 38,
      stop_sequences: ['testString'],
      temperature: 72.5,
      top_k: 72.5,
      top_p: 72.5,
      repetition_penalty: 72.5,
    };

    // PromptData
    const promptDataModel = {
      instruction: 'testString',
      input_prefix: 'testString',
      output_prefix: 'testString',
      // examples: [],
    };

    // ChatItem
    const chatItemModel = {
      type: 'question',
      content: 'Some text',
      status: 'ready',
      timestamp: 1711504485261,
    };

    // Prompt
    const promptModel = {
      input: [['testString', '']],
      model_id: 'ibm/granite-13b-chat-v2',
      // model_parameters: promptModelParametersModel,
      data: promptDataModel,
      // system_prompt: 'testString',
      // chat_items: [chatItemModel],
    };

    // WxPromptPatchModelVersion
    // const wxPromptPatchModelVersionModel = {
    //  number: '2.0.0-rc.7',
    //  tag: 'tag',
    //  description: 'Description of the model version.',
    // };

    const params = {
      promptId,
      name: 'My Prompt',
      prompt: promptModel,
      description: 'My Updated First Prompt',
      // taskIds: ['generation'],
      // governanceTracked: true,
      // modelVersion: wxPromptPatchModelVersionModel,
      // promptVariable: { 'key1': { anyKey: 'anyValue' } },
      // inputMode: 'structured',
      projectId,
    };

    const res = await watsonxAiMlService.patchPrompt(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('putPromptLock()', async () => {
    const params = {
      promptId,
      locked: false,
      projectId,
      force: true,
    };

    const res = await watsonxAiMlService.putPromptLock(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getPromptLock()', async () => {
    const params = {
      promptId,
      projectId,
    };

    const res = await watsonxAiMlService.getPromptLock(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getPromptInput()', async () => {
    const params = {
      promptId,
      // input: 'Some text with variables.',
      // promptVariable: { 'key1': 'var1' },
      projectId,
    };

    const res = await watsonxAiMlService.getPromptInput(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('postPromptChatItem()', async () => {
    // Request models needed by this operation.

    // ChatItem
    const chatItemModelQuestion = {
      type: 'question',
      content: 'Hi! How are you? ',
      status: 'ready',
      timestamp: 1711504485261,
      token_count: 6,
    };

    const chatItemModelAnswer = {
      type: 'answer',
      content: 'teststring',
      status: 'ready',
      timestamp: 1711504485261,
      token_count: 6,
    };

    const params = {
      promptId,
      chatItem: [chatItemModelQuestion, chatItemModelAnswer],
      projectId,
    };

    const res = await watsonxAiMlService.postPromptChatItem(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('postPromptSession()', async () => {
    // Request models needed by this operation.

    // PromptLock
    const promptLockModel = {
      locked: true,
    };

    // PromptModelParameters
    const promptModelParametersModel = {
      decoding_method: 'testString',
      max_new_tokens: 38,
      min_new_tokens: 38,
      random_seed: 38,
      stop_sequences: ['testString'],
      temperature: 72.5,
      top_k: 72.5,
      top_p: 72.5,
      repetition_penalty: 72.5,
    };

    // PromptData
    const promptDataModel = {
      instruction: 'testString',
      input_prefix: 'testString',
      output_prefix: 'testString',
    };

    // ChatItem
    // const chatItemModel = {
    //  type: 'question',
    //  content: 'Some text',
    //  status: 'ready',
    //  timestamp: 1711504485261,
    // };

    // Prompt
    const promptModel = {
      model_id: 'ibm/granite-13b-chat-v2',
      // model_parameters: promptModelParametersModel,
      data: promptDataModel,
      // system_prompt: 'testString',
      // chat_items: [chatItemModel],
    };

    // WxPromptSessionEntry
    const wxPromptSessionEntryModel = {
      name: 'My Prompt',
      description: 'My First Prompt',
      // prompt_variables: { 'key1': { anyKey: 'anyValue' } },
      // is_template: true,
      created_at: 1711504485261,
      // input_mode: 'structured',
      prompt: promptModel,
    };

    const params = {
      name: 'Session 1',
      description: 'My First Prompt Session',
      lock: promptLockModel,
      prompts: [wxPromptSessionEntryModel],
      projectId,
    };

    const res = await watsonxAiMlService.postPromptSession(params);
    sessionId = res.result.id;
    console.log(res.result);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('getPromptSession()', async () => {
    const params = {
      sessionId,
      projectId,
      prefetch: true,
    };

    const res = await watsonxAiMlService.getPromptSession(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('patchPromptSession()', async () => {
    const params = {
      sessionId,
      name: 'Session 1 update',
      description: 'My First Prompt Session',
      projectId,
    };

    const res = await watsonxAiMlService.patchPromptSession(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('postPromptSessionEntry()', async () => {
    // Request models needed by this operation.

    // PromptModelParameters
    const promptModelParametersModel = {
      decoding_method: 'testString',
      max_new_tokens: 38,
      min_new_tokens: 38,
      random_seed: 38,
      stop_sequences: ['testString'],
      temperature: 72.5,
      top_k: 72.5,
      top_p: 72.5,
      repetition_penalty: 72.5,
    };

    // PromptData
    const promptDataModel = {
      instruction: 'testString',
      input_prefix: 'testString',
      output_prefix: 'testString',
      // examples: [],
    };

    // ChatItem
    const chatItemModel = {
      type: 'question',
      content: 'Some text',
      status: 'ready',
      timestamp: 1711504485261,
    };

    // Prompt
    const promptModel = {
      // input: [],
      model_id: 'ibm/granite-13b-chat-v2',
      // model_parameters: promptModelParametersModel,
      data: promptDataModel,
      // system_prompt: 'testString',
      // chat_items: [chatItemModel],
    };

    const params = {
      sessionId,
      name: 'My Session Entry',
      createdAt: 1711504485261,
      prompt: promptModel,
      description: 'My Session Entry',
      // promptVariables: { 'key1': { anyKey: 'anyValue' } },
      // isTemplate: true,
      // inputMode: 'structured',
      projectId,
    };

    const res = await watsonxAiMlService.postPromptSessionEntry(params);
    entryId = res.result.id;
    console.log(res);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('getPromptSessionEntry()', async () => {
    const params = {
      entryId,
      sessionId,
      projectId,
    };

    const res = await watsonxAiMlService.getPromptSessionEntry(params);
    console.log(res);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getPromptSessionEntries()', async () => {
    const params = {
      sessionId,
      projectId,
      // bookmark: 'testString',
      // limit: 'testString',
    };

    const res = await watsonxAiMlService.getPromptSessionEntries(params);
    console.log(res);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('postPromptSessionEntryChatItem()', async () => {
    // Request models needed by this operation.

    // ChatItem
    const chatItemModelQuestion = {
      type: 'question',
      content: 'Some question',
      status: 'ready',
      timestamp: 1711504485261,
      token_count: 6,
    };
    const chatItemModelAnswer = {
      type: 'answer',
      content: 'Some text',
      status: 'ready',
      timestamp: 1711504485261,
      token_count: 6,
    };
    console.log(sessionId);
    console.log(entryId);
    const params = {
      sessionId,
      entryId,
      chatItem: [chatItemModelQuestion, chatItemModelAnswer],
      projectId,
    };

    const res = await watsonxAiMlService.postPromptSessionEntryChatItem(params);
    console.log(res);
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('putPromptSessionLock()', async () => {
    const params = {
      sessionId,
      locked: false,
      projectId,
      force: true,
    };

    const res = await watsonxAiMlService.putPromptSessionLock(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('getPromptSessionLock()', async () => {
    const params = {
      sessionId,
      projectId,
    };

    const res = await watsonxAiMlService.getPromptSessionLock(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('trainingsDelete()', async () => {
    const params = {
      trainingId,
      projectId,
      hardDelete: true,
    };

    const res = await watsonxAiMlService.trainingsDelete(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test('deploymentsDelete()', async () => {
    const params = {
      deploymentId,
      projectId,
    };

    const res = await watsonxAiMlService.deploymentsDelete(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test('deletePromptSession()', async () => {
    const params = {
      sessionId,
      projectId,
    };

    const res = await watsonxAiMlService.deletePromptSession(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test('deletePrompt()', async () => {
    const params = {
      promptId,
      projectId,
    };

    const res = await watsonxAiMlService.deletePrompt(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });
});
