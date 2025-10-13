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

const { Readable, addAbortSignal } = require('node:stream');
const { readExternalSources } = require('ibm-cloud-sdk-core');
const path = require('path');
const { WatsonXAI } = require('../../dist/vml_v1');
const authHelper = require('../resources/auth-helper.js');
const { Stream } = require('../../dist/lib/common.js');
const { chatModel } = require('./config.js');
// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');
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
  let watsonxAIService;
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
    watsonxAIService = WatsonXAI.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
      version: '2023-07-07',
    });

    expect(watsonxAIService).not.toBeNull();

    const config = readExternalSources(WatsonXAI.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAIService.enableRetries();
  });

  describe('Prompt deployment flow. (Creating prompt template -> Deploying prompt template -> Inference on deployed prompt teplate (chat)', () => {
    afterAll(async () => {
      if (promptDeploymentId)
        await watsonxAIService.deleteDeployment({
          deploymentId: promptDeploymentId,
          projectId,
        });
      if (promptId) {
        await watsonxAIService.updatePromptLock({
          promptId,
          locked: false,
          projectId,
          force: true,
        });
        await watsonxAIService.deletePrompt({
          promptId,
          projectId,
        });
      }
    });
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
          model_id: chatModel,
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

        const res = await watsonxAIService.createPrompt(params);

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

        const res = await watsonxAIService.getPrompt(params);
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
          model_id: chatModel,
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

        const res = await watsonxAIService.updatePrompt(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('listPrompts', async () => {
        const params = {
          'projectId': projectId,
          'limit': 1,
        };

        const { result } = await watsonxAIService.listPrompts(params);

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
        const pager = new WatsonXAI.ListPromptsPager(watsonxAIService, params);
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
        const pager = new WatsonXAI.ListPromptsPager(watsonxAIService, params);
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

        const res = await watsonxAIService.updatePromptLock(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('getPromptLock', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.getPromptLock(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
        expect(res.result).toBeDefined();
      });

      test('getPromptInput', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.getPromptInput(params);
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

        const res = await watsonxAIService.createPromptChatItem(params);
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
          baseModelId: chatModel,
          promptTemplate,
          projectId,
          description: 'testString',
          tags: ['testString'],
          custom: { anyKey: 'anyValue' },
          hardwareRequest: hardwareRequestModel,
        };

        const res = await watsonxAIService.createDeployment(params);
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
        const res = await checkIfDeploymentIsReady(watsonxAIService, params);
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

        const res = await watsonxAIService.deploymentsTextChat(params);
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

        const res = await watsonxAIService.deploymentsTextChatStream(params);

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

        const stream = await watsonxAIService.deploymentsTextChatStream(params);
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

        const stream = await watsonxAIService.deploymentsTextChatStream(params);
        for await (const chunk of stream) {
          expect(typeof chunk.id === 'number').toBe(true);
          break;
        }
      });

      test('textChatStream aborting', async () => {
        const abortStreaming = async () => {
          const stream = await watsonxAIService.deploymentsTextChatStream({
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
            controller.abort();
          }
        };

        await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
      });

      test('deploymentTextChatStream build in aborting', async () => {
        const abortStreaming = async () => {
          const stream = await watsonxAIService.deploymentsTextChatStream({
            messages: [
              {
                role: 'user',
                content: 'What is your name?',
              },
            ],
            idOrName: promptDeploymentId,
          });
          for await (const chunk of stream) {
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

        const res = await watsonxAIService.deleteDeployment(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
        promptDeploymentId = null;
      });

      test('deletePrompt', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.deletePrompt(params);
        expect(res).toBeDefined();
        expect(res.status).toBe(204);
        expect(res.result).toBeDefined();
        promptId = null;
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

      const res = await watsonxAIService.createPromptSession(params);
      sessionId = res.result.id;

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

      const res = await watsonxAIService.getPromptSession(params);
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

      const res = await watsonxAIService.updatePromptSession(params);
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

      const res = await watsonxAIService.createPromptSessionEntry(params);
      entryId = res.result.id;

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

      const res = await watsonxAIService.getPromptSessionEntry(params);

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('listPromptSessionEntries', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.listPromptSessionEntries(params);

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

      const res = await watsonxAIService.createPromptSessionEntryChatItem(params);
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

      const res = await watsonxAIService.updatePromptSessionLock(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('getPromptSessionLock', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.getPromptSessionLock(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('deletePromptSession', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.deletePromptSession(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(204);
      expect(res.result).toBeDefined();
    });
  });

  describe('Model', () => {
    test('createModel()', async () => {
      const params = {
        name: 'my-flan-t5-xl',
        type: 'custom_foundation_model_1.0',
        projectId,
        softwareSpec: { name: 'watsonx-cfm-caikit-1.1' },
        foundationModel: {
          model_id: 'meta-llama/llama-3-1-8b',
        },
      };

      const res = await watsonxAIService.createModel(params);
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

      const res = await watsonxAIService.listModels(params);

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
      let pager = new WatsonXAI.ModelsListPager(watsonxAIService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonXAI.ModelsListPager(watsonxAIService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
    });

    test('getModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAIService.getModel(params);

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('deleteModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAIService.deleteModel(params);
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

      const res = await watsonxAIService.createTextExtraction(params);
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

      const res = await watsonxAIService.listTextExtractions(params);
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
      let pager = new WatsonXAI.TextExtractionsPager(watsonxAIService, params);
      while (pager.hasNext()) {
        const nextPage = await pager.getNext();
        expect(nextPage).not.toBeNull();
        allResults.push(...nextPage);
      }

      // Test getAll().
      pager = new WatsonXAI.TextExtractionsPager(watsonxAIService, params);
      const allItems = await pager.getAll();
      expect(allItems).not.toBeNull();
      expect(allItems).toHaveLength(allResults.length);
    });

    test('getTextExtraction()', async () => {
      const params = {
        id: textExtId,
        projectId,
      };

      const checkIfExtractionIsReady = async (parameters, n = 5, delay = 10000) => {
        for (let i = 0; i <= n; i += 1) {
          const res = await watsonxAIService.getTextExtraction(parameters);
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
      const res = await watsonxAIService.deleteTextExtraction(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(204);
      expect(res.result).toBeDefined();
    });
  });

  describe('Toolkits', () => {
    test('listUtilityAgentTools()', async () => {
      const res = await watsonxAIService.listUtilityAgentTools();

      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });

    test('getUtilityAgentTool()', async () => {
      const params = {
        toolId: 'WebCrawler',
      };

      const res = await watsonxAIService.getUtilityAgentTool(params);
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

      const res = await watsonxAIService.runUtilityAgentTool(params);
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

      const res = await watsonxAIService.runUtilityAgentToolByName(params);
      expect(res).toBeDefined();
      expect(res.status).toBe(200);
      expect(res.result).toBeDefined();
    });
  });
});
