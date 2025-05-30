/**
 * (C) Copyright IBM Corp. 2025.
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
const WatsonxAiMlVml_v1 = require('../../dist/watsonx-ai-ml/vml_v1');
const authHelper = require('../resources/auth-helper.js');
const { Stream } = require('../../dist/lib/common.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = 'credentials/watsonx_ai_ml_vml_v1.env';
const describe = authHelper.prepareTests(configFile);
// Limit for all listing methods to avoid too heavy memory and time consumption
const limit = 5;
authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const trainingAssetId = process.env.TRAINING_ASSET_ID;

const checkIfDeploymentIsReady = async (service, args = [], retries = 5, delay = 150000) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await service.getDeployment(args);
    if (result.result.entity.status.state === 'ready') {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

describe('WatsonxAiMlVml_v1_integration', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAiMlService;
  let trainingId;
  let deploymentId;
  let promptId;
  let sessionId;
  let entryId;
  let modelId;
  let promptDeploymentId;
  let deployedModelId;
  let textExtId;

  beforeAll(async () => {
    watsonxAiMlService = WatsonxAiMlVml_v1.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
      version: '2023-07-07',
    });

    expect(watsonxAiMlService).not.toBeNull();

    const config = readExternalSources(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAiMlService.enableRetries();
  });

  describe('Prompt tuning flow. (Training -> Training deployment -> Inference on deployed model', () => {
    describe('Training', () => {
      test('createTraining()', async () => {
        // Request models needed by this operation.

        // ObjectLocation
        const objectLocationModel = {
          location: { path: 'tune1/results' },
          type: 'container',
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

        const href = `/v2/assets/${trainingAssetId}?project_id=${projectId}`;

        // DataConnectionReference
        const dataConnectionReferenceModel = {
          id: 'watson_emotion.jsonl',
          type: 'data_asset',
          location: {
            href,
          },
        };

        const params = {
          name: 'WXAI Node.js SDK Example Prompt Tune Training',
          resultsReference: objectLocationModel,
          projectId, // or spaceId
          description: 'testString',
          tags: ['testString'],
          promptTuning: promptTuningModel,
          trainingDataReferences: [dataConnectionReferenceModel],
          custom: { anyKey: 'anyValue' },
          autoUpdateModel: true,
        };

        const res = await watsonxAiMlService.createTraining(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(201);
        expect(res.result).toBeDefined();
        trainingId = res.result.metadata.id;
      });

      test('listTrainings', async () => {
        const params = {
          limit,
          totalCount: true,
          tagValue: 'testString',
          state: 'queued',
          projectId,
        };

        const res = await watsonxAiMlService.listTrainings(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('trainingsList() via TrainingsListPager', async () => {
        const params = {
          limit,
          totalCount: true,
          state: 'queued',
          projectId,
        };

        const allResults = [];

        // Test getNext().
        let pager = new WatsonxAiMlVml_v1.TrainingsListPager(watsonxAiMlService, params);
        while (pager.hasNext()) {
          const nextPage = await pager.getNext();
          expect(nextPage).not.toBeNull();
          allResults.push(...nextPage);
        }

        // Test getAll().
        pager = new WatsonxAiMlVml_v1.TrainingsListPager(watsonxAiMlService, params);
        const allItems = await pager.getAll();
        expect(allItems).not.toBeNull();
        expect(allItems).toHaveLength(allResults.length);
        console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
      });

      test('getTraining', async () => {
        const params = {
          trainingId,
          projectId,
        };

        const res = await watsonxAiMlService.getTraining(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });
    });

    describe('Deployment', () => {
      test('createDeployment', async () => {
        const trainingParams = {
          trainingId,
          projectId,
        };

        const retryAsyncCall = async (args = [], retries = 5, delay = 150000) => {
          for (let i = 0; i < retries; i += 1) {
            const result = await watsonxAiMlService.getTraining(args);
            if (result.result.entity.model_id !== undefined) {
              return result.result.entity.model_id;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          throw new Error('Failed to get a valid response after maximum retries');
        };

        deployedModelId = await retryAsyncCall(trainingParams);

        // Request models needed by this operation.
        // OnlineDeploymentParameters
        const onlineDeploymentParametersModel = {
          serving_name: (Math.random() + 1).toString(36).substring(4),
        };

        // OnlineDeployment
        const onlineDeploymentModel = {
          parameters: onlineDeploymentParametersModel,
        };

        // SimpleRel
        const simpleRelModel = {
          id: '4cedab6d-e8e4-4214-b81a-2ddb122db2ab',
        };

        // HardwareRequest
        const hardwareRequestModel = {
          size: 'gpu_s',
          num_nodes: 5,
        };

        // Rel
        const relModel = {
          id: deployedModelId,
        };

        const params = {
          name: 'WXAI Node.js SDK Example Deployment',
          online: onlineDeploymentModel,
          projectId,
          description: 'testString',
          tags: ['testString'],
          custom: { anyKey: 'anyValue' },
          hardwareRequest: hardwareRequestModel,
          asset: relModel,
        };

        const res = await watsonxAiMlService.createDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(202);
        expect(res.result).toBeDefined();
        deploymentId = res.result.metadata.id;
      }, 800000);

      test('listDeployments', async () => {
        const params = {
          projectId,
          conflict: false,
        };

        const res = await watsonxAiMlService.listDeployments(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('getDeployment', async () => {
        const params = {
          deploymentId,
          projectId,
        };

        const res = await watsonxAiMlService.getDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('updateDeployment', async () => {
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

        const res = await watsonxAiMlService.updateDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });
    });

    describe('Deployment inference', () => {
      test('deploymentGenerateText', async () => {
        // Request models needed by this operation.
        const getParams = {
          deploymentId,
          projectId,
        };
        await checkIfDeploymentIsReady(watsonxAiMlService, getParams);
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
          truncate_input_tokens: 1,
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

        // TextModerationWithoutThreshold
        const textModerationWithoutThresholdModel = {
          enabled: true,
          foo: 'testString',
        };

        // ModerationPiiProperties
        const moderationPiiPropertiesModel = {
          input: textModerationWithoutThresholdModel,
          output: textModerationWithoutThresholdModel,
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

        const res = await watsonxAiMlService.deploymentGenerateText(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      }, 800000);

      test('deploymentGenerateTextStream', async () => {
        // Request models needed by this operation.
        const getParams = {
          deploymentId,
          projectId,
        };
        await checkIfDeploymentIsReady(watsonxAiMlService, getParams);

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
          stop_sequences: ['fail'],
          time_limit: 600000,
          repetition_penalty: 1.5,
          truncate_input_tokens: 1,
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

        // TextModerationWithoutThreshold
        const textModerationWithoutThresholdModel = {
          enabled: true,
          foo: 'testString',
        };

        // ModerationPiiProperties
        const moderationPiiPropertiesModel = {
          input: textModerationWithoutThresholdModel,
          output: textModerationWithoutThresholdModel,
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
          foo: 'testString',
        };

        // Moderations
        const moderationsModel = {
          hap: moderationHapPropertiesModel,
          pii: moderationPiiPropertiesModel,
          input_ranges: [moderationTextRangeModel],
        };

        const params = {
          idOrName: deploymentId,
          input: 'testString',
          parameters: deploymentTextGenPropertiesModel,
          moderations: moderationsModel,
        };

        const res = await watsonxAiMlService.deploymentGenerateTextStream(params);
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(Stream);
      });
    });

    describe('Delete resources', () => {
      test('deleteTraining', async () => {
        const params = {
          trainingId,
          projectId,
          hardDelete: true,
        };

        const res = await watsonxAiMlService.deleteTraining(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
      });

      test('deleteTrainedModel', async () => {
        const params = {
          modelId: deployedModelId,
          projectId,
        };

        const res = await watsonxAiMlService.deleteModel(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
      });

      test('deleteDeployment', async () => {
        const params = {
          deploymentId,
          projectId,
        };

        const res = await watsonxAiMlService.deleteDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
      });
    });
  });

  describe('Prompt deployment flow. (Creating prompt template -> Deploying prompt template -> Inference on deployed prompt teplate (chat)', () => {
    describe('Prompt', () => {
      test('postPrompt', async () => {
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
          model_id: 'meta-llama/llama-3-1-70b-instruct',
          data: promptDataModel,
        };

        // PromptLock
        const promptLockModel = {
          locked: true,
        };

        const params = {
          name: 'WXAI Node.js SDK Example Prompt',
          prompt: promptWithExternalModel,
          description: 'My First Prompt',
          taskIds: ['testString'],
          lock: promptLockModel,
          inputMode: 'chat',
          projectId,
        };

        const res = await watsonxAiMlService.createPrompt(params);
        console.log(res);
        promptId = res.result.id;
        expect(res).toBeDefined();
        expect(res.status).toBe(201);
        expect(res.result).toBeDefined();
      });

      test('getPrompt', async () => {
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

      test('updatePrompt', async () => {
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
          model_id: 'meta-llama/llama-3-1-70b-instruct',
          // model_parameters: promptModelParametersModel,
          data: promptDataModel,
          // system_prompt: 'testString',
          // chat_items: [chatItemModel],
        };

        const params = {
          promptId,
          name: 'WXAI Node.js SDK Example Prompt',
          prompt: promptModel,
          description: 'My Updated First Prompt',
          projectId,
        };

        const res = await watsonxAiMlService.updatePrompt(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('listPrompts', async () => {
        const params = {
          'projectId': projectId,
          'limit': 1,
        };

        const { result } = await watsonxAiMlService.listPrompts(params);

        expect(result.results).toBeInstanceOf(Array);
        expect(result.results).toHaveLength(1);
      });

      test('listPrompts via ListPromptsPager.getNext()', async () => {
        const params = {
          'projectId': projectId,
          'limit': 20,
        };

        const allResults = [];

        // Test getNext()
        const pager = new WatsonxAiMlVml_v1.ListPromptsPager(watsonxAiMlService, params);
        while (pager.hasNext()) {
          const nextPage = await pager.getNext();
          expect(nextPage).not.toBeNull();
          allResults.push(...nextPage);
        }
        expect(allResults.length).toBeGreaterThanOrEqual(1);
      });

      test('listPrompts via ListPromptsPager.getAll()', async () => {
        const params = {
          'projectId': projectId,
          'limit': 20,
        };

        // Test getAll()
        const pager = new WatsonxAiMlVml_v1.ListPromptsPager(watsonxAiMlService, params);
        const allResults = await pager.getAll();
        expect(allResults.length).toBeGreaterThanOrEqual(1);
      });

      test('updatePromptLock', async () => {
        const params = {
          promptId,
          locked: false,
          projectId,
          force: true,
        };

        const res = await watsonxAiMlService.updatePromptLock(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('getPromptLock', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAiMlService.getPromptLock(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('getPromptInput', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAiMlService.getPromptInput(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('createPromptChatItem', async () => {
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

        const res = await watsonxAiMlService.createPromptChatItem(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(201);
        expect(res.result).toBeDefined();
      });
      test('createPromptDeployment', async () => {
        const promptParams = {
          promptId,
          projectId,
        };

        // HardwareRequest
        const hardwareRequestModel = {
          size: 'gpu_s',
          num_nodes: 5,
        };

        // OnlineDeploymentParameters
        const onlineDeploymentParametersModel = {
          serving_name: (Math.random() + 1).toString(36).substring(4),
        };

        // OnlineDeployment
        const onlineDeploymentModel = {
          parameters: onlineDeploymentParametersModel,
        };

        const promptTemplate = {
          id: promptId,
        };

        const params = {
          name: 'text_classification',
          online: onlineDeploymentModel,
          baseModelId: 'meta-llama/llama-3-1-70b-instruct',
          promptTemplate,
          projectId,
          description: 'testString',
          tags: ['testString'],
          custom: { anyKey: 'anyValue' },
          hardwareRequest: hardwareRequestModel,
        };

        const res = await watsonxAiMlService.createDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(202);
        expect(res.result).toBeDefined();
        promptDeploymentId = res.result.metadata.id;
      }, 800000);

      test('getPromptDeployment', async () => {
        const params = {
          deploymentId: promptDeploymentId,
          projectId,
        };
        const res = await checkIfDeploymentIsReady(watsonxAiMlService, params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });
    });

    describe('Prompt deployment chat inference', () => {
      test('deploymentsTextChat()', async () => {
        // DeploymentTextChatMessagesTextChatMessageAssistant
        const deploymentTextChatMessagesModel = {
          role: 'user',
          content: 'Who won the world series in 2020?',
        };

        const params = {
          idOrName: promptDeploymentId,
          messages: [deploymentTextChatMessagesModel],
        };

        const res = await watsonxAiMlService.deploymentsTextChat(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('deploymentsTextChatStream()', async () => {
        // DeploymentTextChatMessagesTextChatMessageAssistant
        const deploymentTextChatMessagesModel = {
          role: 'user',
          content: 'Who won the world series in 2020?',
        };

        const params = {
          idOrName: promptDeploymentId,
          messages: [deploymentTextChatMessagesModel],
        };

        const res = await watsonxAiMlService.deploymentsTextChatStream(params);
        console.log(res);
        expect(res).toBeInstanceOf(Stream);
        expect(res).toBeDefined();
      });

      test('deploymentsTextChatStream() as string', async () => {
        // DeploymentTextChatMessagesTextChatMessageAssistant
        const deploymentTextChatMessagesModel = {
          role: 'user',
          content: 'Who won the world series in 2020?',
        };

        const params = {
          idOrName: promptDeploymentId,
          messages: [deploymentTextChatMessagesModel],
        };

        const stream = await watsonxAiMlService.deploymentsTextChatStream(params);
        for await (const chunk of stream) {
          expect(typeof chunk === 'string').toBe(true);
          break;
        }
      });

      test('deploymentsTextChatStream() as object', async () => {
        // DeploymentTextChatMessagesTextChatMessageAssistant
        const deploymentTextChatMessagesModel = {
          role: 'user',
          content: 'Who won the world series in 2020?',
        };

        const params = {
          idOrName: promptDeploymentId,
          messages: [deploymentTextChatMessagesModel],
          returnObject: true,
        };

        const stream = await watsonxAiMlService.deploymentsTextChatStream(params);
        for await (const chunk of stream) {
          expect(typeof chunk.id === 'number').toBe(true);
          break;
        }
      });

      test('textChatStream aborting', async () => {
        const abortStreaming = async () => {
          const stream = await watsonxAiMlService.deploymentsTextChatStream({
            messages: [
              {
                role: 'user',
                content: 'What is your name?',
              },
            ],
            idOrName: promptDeploymentId,
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

      test('deploymentTextChatStream build in aborting', async () => {
        const abortStreaming = async () => {
          const stream = await watsonxAiMlService.deploymentsTextChatStream({
            messages: [
              {
                role: 'user',
                content: 'What is your name?',
              },
            ],
            idOrName: promptDeploymentId,
          });
          for await (const chunk of stream) {
            console.log(chunk);
            stream.controller.abort();
          }
        };
        await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
      });
    });

    describe('Delete resources', () => {
      test('deletePromptDeployment', async () => {
        const params = {
          deploymentId: promptDeploymentId,
          projectId,
        };

        const res = await watsonxAiMlService.deleteDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
      });

      test('deletePrompt', async () => {
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
  });

  describe('Prompt session', () => {
    test('createPromptSession', async () => {
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

      // Prompt
      const promptModel = {
        model_id: 'ibm/granite-13b-chat-v2',
        // model_parameters: promptModelParametersModel,
        data: promptDataModel,
        // system_prompt: 'testString',
      };

      // WxPromptSessionEntry
      const wxPromptSessionEntryModel = {
        name: 'WXAI Node.js SDK Example Prompt',
        description: 'My First Prompt',
        // prompt_variables: { 'key1': { anyKey: 'anyValue' } },
        // is_template: true,
        created_at: 1711504485261,
        prompt: promptModel,
      };

      const params = {
        name: 'WXAI Node.js SDK Example Prompt Session',
        description: 'My First Prompt Session',
        lock: promptLockModel,
        prompts: [wxPromptSessionEntryModel],
        projectId,
      };

      const res = await watsonxAiMlService.createPromptSession(params);
      sessionId = res.result.id;
      console.log(res.result);
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    });

    test('getPromptSession', async () => {
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

    test('updatePromptSession', async () => {
      const params = {
        sessionId,
        name: 'WXAI Node.js SDK Example Prompt Session Update',
        description: 'My First Prompt Session',
        projectId,
      };

      const res = await watsonxAiMlService.updatePromptSession(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('createPromptSessionEntry', async () => {
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
        model_id: 'ibm/granite-13b-chat-v2',
        // model_parameters: promptModelParametersModel,
        data: promptDataModel,
        // system_prompt: 'testString',
        // chat_items: [chatItemModel],
      };

      const params = {
        sessionId,
        name: 'WXAI Node.js SDK Example Prompt Session Entry',
        createdAt: 1711504485261,
        prompt: promptModel,
        description: 'My Session Entry',
        // promptVariables: { 'key1': { anyKey: 'anyValue' } },
        // isTemplate: true,
        // inputMode: 'structured',
        projectId,
      };

      const res = await watsonxAiMlService.createPromptSessionEntry(params);
      entryId = res.result.id;
      console.log(res);
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    });

    test.skip('getPromptSessionEntry', async () => {
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

    test('listPromptSessionEntries', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAiMlService.listPromptSessionEntries(params);
      console.log(res);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test.skip('postPromptSessionEntryChatItem', async () => {
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
      const params = {
        sessionId,
        entryId,
        chatItem: [chatItemModelQuestion, chatItemModelAnswer],
        projectId,
      };

      const res = await watsonxAiMlService.createPromptSessionEntryChatItem(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    });

    test('updatePromptSessionLock', async () => {
      const params = {
        sessionId,
        locked: false,
        projectId,
        force: true,
      };

      const res = await watsonxAiMlService.updatePromptSessionLock(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('getPromptSessionLock', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAiMlService.getPromptSessionLock(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('deletePromptSession', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAiMlService.deletePromptSession(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(204);
      expect(res.result).toBeDefined();
    });
  });

  describe('Model', () => {
    test('createModel()', async () => {
      const params = {
        name: 'my-flan-t5-xl',
        type: 'curated_foundation_model_1.0',
        projectId,
        softwareSpec: { name: 'watsonx-cfm-caikit-1.1' },
        foundationModel: {
          model_id: 'meta-llama/llama-3-1-8b',
        },
      };

      const res = await watsonxAiMlService.createModel(params);
      modelId = res.result.metadata.id;
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    });

    test('listModels()', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const res = await watsonxAiMlService.listModels(params);
      console.log(res.result.resources);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('modelsList() via ModelsListPager', async () => {
      const params = {
        projectId,
        limit: 50,
        tagValue: 'tf2.0 or tf2.1',
        search: '',
      };

      const allResults = [];

      // Test getNext().
      let pager = new WatsonxAiMlVml_v1.ModelsListPager(watsonxAiMlService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonxAiMlVml_v1.ModelsListPager(watsonxAiMlService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
      console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
    });

    test('getModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAiMlService.getModel(params);
      console.log(res);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('deleteModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAiMlService.deleteModel(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(204);
      expect(res.result).toBeDefined();
    });
  });

  describe('Text extraction', () => {
    test('createTextExtraction()', async () => {
      // Request models needed by this operation.

      // CosDataConnection
      const cosDataConnectionModel = {
        id: process.env.WATSONX_AI_COS_ID,
      };

      // CosDataLocation
      const cosDataLocationModel = {
        file_name: 'experienced.pdf',
        bucket: 'wx-nodejs-test-text-extraction',
      };

      const cosResultLocationModel = {
        file_name: 'experienced.md',
        bucket: 'wx-nodejs-test-text-extraction',
      };

      // TextExtractionDataReference
      const textExtractionDataReferenceModel = {
        type: 'connection_asset',
        connection: cosDataConnectionModel,
        location: cosDataLocationModel,
      };
      // TextExtractionDataReference
      const textExtractionResultReferenceModel = {
        type: 'connection_asset',
        connection: cosDataConnectionModel,
        location: cosResultLocationModel,
      };

      // TextExtractionStepOcr
      const textExtractionStepOcrModel = {
        languages_list: ['en'],
      };

      // TextExtractionStepTablesProcessing
      const textExtractionStepTablesProcessingModel = {
        enabled: true,
      };

      // TextExtractionSteps
      const textExtractionStepsModel = {
        ocr: textExtractionStepOcrModel,
        tables_processing: textExtractionStepTablesProcessingModel,
      };

      const params = {
        documentReference: textExtractionDataReferenceModel,
        resultsReference: textExtractionResultReferenceModel,
        steps: textExtractionStepsModel,
        projectId,
        assemblyMd: {},
      };

      const res = await watsonxAiMlService.createTextExtraction(params);
      textExtId = res.result.metadata.id;
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    });

    test('listTextExtractions()', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const res = await watsonxAiMlService.listTextExtractions(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('listTextExtractions() via TextExtractionsPager', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const allResults = [];

      // Test getNext().
      let pager = new WatsonxAiMlVml_v1.TextExtractionsPager(watsonxAiMlService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonxAiMlVml_v1.TextExtractionsPager(watsonxAiMlService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
      console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
    });

    test('getTextExtraction()', async () => {
      const params = {
        id: textExtId,
        projectId,
      };

      const checkIfExtractionIsReady = async (parameters, n = 5, delay = 10000) => {
        for (let i = 0; i <= n; i += 1) {
          const res = await watsonxAiMlService.getTextExtraction(parameters);
          if (res.result.entity.results.status === 'completed') return res;
          if (res.result.entity.results.status === 'failed')
            throw new Error(res.result.entity.results.error.message);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        throw new Error('Unable to finish extraction after maximum retries');
      };
      const res = await checkIfExtractionIsReady(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('deleteTextExtraction()', async () => {
      const params = {
        id: textExtId,
        projectId,
        hardDelete: true,
      };
      const res = await watsonxAiMlService.deleteTextExtraction(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(204);
      expect(res.result).toBeDefined();
    });
  });

  describe('Toolkits', () => {
    test('listUtilityAgentTools()', async () => {
      const res = await watsonxAiMlService.listUtilityAgentTools();
      console.log(res.result.resources[0].input_schema);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('getUtilityAgentTool()', async () => {
      const params = {
        toolId: 'WebCrawler',
      };

      const res = await watsonxAiMlService.getUtilityAgentTool(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('runUtilityAgentTool()', async () => {
      // Request models needed by this operation.

      // WxUtilityAgentToolsRunRequestUtilityAgentToolUnstructuredInput
      const wxUtilityAgentToolsRunRequestModel = {
        tool_name: 'GoogleSearch',
        input: { q: 'What was the weather in Toronto on January 13th 2025?' },
        config: { maxResults: 3 },
      };

      const params = {
        wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequestModel,
      };

      const res = await watsonxAiMlService.runUtilityAgentTool(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('runUtilityAgentToolByName()', async () => {
      // Request models needed by this operation.

      // WxUtilityAgentToolsRunRequestUtilityAgentToolUnstructuredInput
      const wxUtilityAgentToolsRunRequestModel = {
        tool_name: 'GoogleSearch',
        input: { q: 'What is a project?' },
        config: {
          projectId,
        },
      };

      const params = {
        toolId: 'GoogleSearch',
        wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequestModel,
      };

      const res = await watsonxAiMlService.runUtilityAgentToolByName(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });
  });
});
