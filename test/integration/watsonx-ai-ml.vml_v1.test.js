/**
 * (C) Copyright IBM Corp. 2025.
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

const { Readable, addAbortSignal } = require('node:stream');
const { readExternalSources } = require('ibm-cloud-sdk-core');
const path = require('path');
const { WatsonXAI } = require('../../dist/vml_v1');
const authHelper = require('../resources/auth-helper.js');
const { Stream } = require('../../dist/lib/common.js');
const { CHAT_MODEL_IBM: chatModel } = require('./config.js');
const {
  expectSuccessResponse,
  pollUntilCondition,
  testPagerPattern,
  createCosReference,
} = require('../utils/utils.js');

const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');
const describe = authHelper.prepareTests(configFile);

const TIMEOUT = 200000;

authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const cosId = process.env.WATSONX_AI_COS_ID;

const checkIfDeploymentIsReady = async (service, args = [], maxAttempts = 5, delay = 150000) =>
  pollUntilCondition(
    () => service.getDeployment(args),
    (result) => result.result.entity.status.state === 'ready',
    null,
    maxAttempts,
    delay,
    `Deployment ${args.deploymentId || 'unknown'}`
  );

describe('WatsonXAI_integration', () => {
  jest.setTimeout(TIMEOUT);

  // Service instance
  let watsonxAIService;
  let promptId;
  let sessionId;
  let entryId;
  let modelId;
  let promptDeploymentId;
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
        const promptDataModel = {
          instruction: 'testString',
          input_prefix: 'testString',
          output_prefix: 'testString',
        };

        const promptWithExternalModel = {
          input: [['testString', '']],
          model_id: chatModel,
          data: promptDataModel,
        };

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

        expectSuccessResponse(res, 201);
      });

      test('getPrompt', async () => {
        const params = {
          promptId,
          projectId,
          restrictModelParameters: 'true',
        };

        const res = await watsonxAIService.getPrompt(params);

        expectSuccessResponse(res, 200);
      });

      test('updatePrompt', async () => {
        // PromptData
        const promptDataModel = {
          instruction: 'testString',
          input_prefix: 'testString',
          output_prefix: 'testString',
        };

        // Prompt
        const promptModel = {
          input: [['testString', '']],
          model_id: chatModel,
          data: promptDataModel,
        };

        const params = {
          promptId,
          name: 'WXAI Node.js SDK Example Prompt',
          prompt: promptModel,
          description: 'My Updated First Prompt',
          projectId,
        };

        const res = await watsonxAIService.updatePrompt(params);

        expectSuccessResponse(res, 200);
      });

      test('listPrompts', async () => {
        const params = {
          'projectId': projectId,
          'limit': 1,
        };

        const res = await watsonxAIService.listPrompts(params);

        expectSuccessResponse(res, 200);
      });

      test('listPrompts via ListPromptsPager', async () => {
        const params = {
          'projectId': projectId,
          'limit': 20,
        };

        await testPagerPattern(WatsonXAI.ListPromptsPager, watsonxAIService, params, 1);
      });

      test('updatePromptLock', async () => {
        const params = {
          promptId,
          locked: false,
          projectId,
          force: true,
        };

        const res = await watsonxAIService.updatePromptLock(params);

        expectSuccessResponse(res, 200);
      });

      test('getPromptLock', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.getPromptLock(params);

        expectSuccessResponse(res, 200);
      });

      test('getPromptInput', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.getPromptInput(params);

        expectSuccessResponse(res, 200);
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

        expectSuccessResponse(res, 201);
      });

      test('createPromptDeployment', async () => {
        const hardwareRequestModel = {
          size: 'gpu_s',
          num_nodes: 5,
        };

        const onlineDeploymentParametersModel = {
          serving_name: (Math.random() + 1).toString(36).substring(4),
        };

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

        expectSuccessResponse(res, 202);
        promptDeploymentId = res.result.metadata.id;
      }, 800000);

      test('getPromptDeployment', async () => {
        const params = {
          deploymentId: promptDeploymentId,
          projectId,
        };
        const res = await checkIfDeploymentIsReady(watsonxAIService, params);

        expectSuccessResponse(res, 200);
      });
    });

    describe('Prompt deployment chat inference', () => {
      let chatMessage;
      let deploymentsTextChatParams;

      beforeEach(() => {
        chatMessage = {
          role: 'user',
          content: 'Who won the world series in 2020?',
        };
        deploymentsTextChatParams = {
          idOrName: promptDeploymentId,
          messages: [chatMessage],
        };
      });

      test('deploymentsTextChat()', async () => {
        const res = await watsonxAIService.deploymentsTextChat(deploymentsTextChatParams);

        expectSuccessResponse(res, 200);
      });

      test('deploymentsTextChatStream() as string', async () => {
        const stream = await watsonxAIService.deploymentsTextChatStream(deploymentsTextChatParams);

        expect(stream).toBeInstanceOf(Stream);

        for await (const chunk of stream) {
          expect(typeof chunk === 'string').toBe(true);

          break;
        }
      });

      test('deploymentsTextChatStream() as object', async () => {
        const stream = await watsonxAIService.deploymentsTextChatStream({
          ...deploymentsTextChatParams,
          returnObject: true,
        });

        expect(stream).toBeInstanceOf(Stream);

        for await (const chunk of stream) {
          expect(typeof chunk.id === 'number').toBe(true);

          break;
        }
      });

      test('textChatStream aborting', async () => {
        const abortStreaming = async () => {
          const stream =
            await watsonxAIService.deploymentsTextChatStream(deploymentsTextChatParams);
          const controller = new AbortController();
          const readable = Readable.from(stream);

          addAbortSignal(controller.signal, readable);
          for await (const _chunk of stream) {
            stream.controller.abort();
          }
        };

        await expect(abortStreaming()).rejects.toThrow('The operation was aborted');
      });

      test('deploymentTextChatStream build in aborting', async () => {
        const abortStreaming = async () => {
          const stream =
            await watsonxAIService.deploymentsTextChatStream(deploymentsTextChatParams);
          for await (const _chunk of stream) {
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

        expectSuccessResponse(res, 204);
        promptDeploymentId = null;
      });

      test('deletePrompt', async () => {
        const params = {
          promptId,
          projectId,
        };

        const res = await watsonxAIService.deletePrompt(params);

        expectSuccessResponse(res, 204);
        promptId = null;
      });
    });
  });

  describe('Prompt session', () => {
    test('createPromptSession', async () => {
      const promptLockModel = {
        locked: true,
      };

      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
      };

      const promptModel = {
        model_id: 'ibm/granite-13b-chat-v2',
        data: promptDataModel,
      };

      // WxPromptSessionEntry
      const wxPromptSessionEntryModel = {
        name: 'WXAI Node.js SDK Example Prompt',
        description: 'My First Prompt',
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

      expectSuccessResponse(res, 201);
    });

    test('getPromptSession', async () => {
      const params = {
        sessionId,
        projectId,
        prefetch: true,
      };

      const res = await watsonxAIService.getPromptSession(params);

      expectSuccessResponse(res, 200);
    });

    test('updatePromptSession', async () => {
      const params = {
        sessionId,
        name: 'WXAI Node.js SDK Example Prompt Session Update',
        description: 'My First Prompt Session',
        projectId,
      };

      const res = await watsonxAIService.updatePromptSession(params);

      expectSuccessResponse(res, 200);
    });

    test('createPromptSessionEntry', async () => {
      const promptDataModel = {
        instruction: 'testString',
        input_prefix: 'testString',
        output_prefix: 'testString',
      };

      const promptModel = {
        model_id: 'ibm/granite-13b-chat-v2',
        data: promptDataModel,
      };

      const params = {
        sessionId,
        name: 'WXAI Node.js SDK Example Prompt Session Entry',
        createdAt: 1711504485261,
        prompt: promptModel,
        description: 'My Session Entry',
        projectId,
      };

      const res = await watsonxAIService.createPromptSessionEntry(params);
      entryId = res.result.id;

      expectSuccessResponse(res, 201);
    });

    test('getPromptSessionEntry', async () => {
      const params = {
        entryId,
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.getPromptSessionEntry(params);

      expectSuccessResponse(res, 200);
    });

    test('listPromptSessionEntries', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.listPromptSessionEntries(params);

      expectSuccessResponse(res, 200);
    });
    // eslint-disable-next-line
    test.skip('postPromptSessionEntryChatItem', async () => {
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

      expectSuccessResponse(res, 201);
    });

    test('updatePromptSessionLock', async () => {
      const params = {
        sessionId,
        locked: false,
        projectId,
        force: true,
      };

      const res = await watsonxAIService.updatePromptSessionLock(params);

      expectSuccessResponse(res, 200);
    });

    test('getPromptSessionLock', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.getPromptSessionLock(params);

      expectSuccessResponse(res, 200);
    });

    test('deletePromptSession', async () => {
      const params = {
        sessionId,
        projectId,
      };

      const res = await watsonxAIService.deletePromptSession(params);

      expectSuccessResponse(res, 204);
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

      expectSuccessResponse(res, 201);
    });

    test('listModels()', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const res = await watsonxAIService.listModels(params);

      expectSuccessResponse(res, 200);
    });

    test('modelsList() via ModelsListPager', async () => {
      const params = {
        projectId,
        limit: 50,
        tagValue: 'tf2.0 or tf2.1',
        search: '',
      };

      await testPagerPattern(WatsonXAI.ModelsListPager, watsonxAIService, params, 0);
    });

    test('getModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAIService.getModel(params);

      expectSuccessResponse(res, 200);
    });

    test('deleteModel()', async () => {
      const params = {
        modelId,
        projectId,
      };

      const res = await watsonxAIService.deleteModel(params);

      expectSuccessResponse(res, 204);
    });
  });

  describe('Text extraction', () => {
    const checkIfExtractionIsReady = async (parameters, maxAttempts = 5, delay = 10000) =>
      pollUntilCondition(
        () => watsonxAIService.getTextExtraction(parameters),
        (res) => res.result.entity.results.status === 'completed',
        (res) => res.result.entity.results.status === 'failed',
        maxAttempts,
        delay,
        `Text extraction ${parameters.id || 'unknown'}`
      );

    test('createTextExtraction()', async () => {
      const textExtractionDataReferenceModel = createCosReference(
        'experienced.pdf',
        'wx-nodejs-test-text-extraction',
        cosId
      );

      const textExtractionResultReferenceModel = createCosReference(
        'experienced.md',
        'wx-nodejs-test-text-extraction',
        cosId
      );

      const textExtractionStepOcrModel = {
        languages_list: ['en'],
      };

      const textExtractionStepTablesProcessingModel = {
        enabled: true,
      };

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

      expectSuccessResponse(res, 201);
    });

    test('listTextExtractions()', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const res = await watsonxAIService.listTextExtractions(params);

      expectSuccessResponse(res, 200);
    });

    test('listTextExtractions() via TextExtractionsPager', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      await testPagerPattern(WatsonXAI.TextExtractionsPager, watsonxAIService, params, 0);
    });

    test('getTextExtraction()', async () => {
      const params = {
        id: textExtId,
        projectId,
      };

      const res = await checkIfExtractionIsReady(params);

      expectSuccessResponse(res, 200);
    });

    test('deleteTextExtraction()', async () => {
      const params = {
        id: textExtId,
        projectId,
        hardDelete: true,
      };
      const res = await watsonxAIService.deleteTextExtraction(params);

      expectSuccessResponse(res, 204);
    });
  });

  describe('Toolkits', () => {
    test('listUtilityAgentTools()', async () => {
      const res = await watsonxAIService.listUtilityAgentTools();

      expectSuccessResponse(res, 200);
    });

    test('getUtilityAgentTool()', async () => {
      const params = {
        toolId: 'WebCrawler',
      };

      const res = await watsonxAIService.getUtilityAgentTool(params);

      expectSuccessResponse(res, 200);
    });

    test('runUtilityAgentTool()', async () => {
      const wxUtilityAgentToolsRunRequestModel = {
        tool_name: 'GoogleSearch',
        input: { q: 'What was the weather in Toronto on January 13th 2025?' },
        config: { maxResults: 3 },
      };

      const params = {
        wxUtilityAgentToolsRunRequest: wxUtilityAgentToolsRunRequestModel,
      };

      const res = await watsonxAIService.runUtilityAgentTool(params);

      expectSuccessResponse(res, 200);
    });

    test('runUtilityAgentToolByName()', async () => {
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

      expectSuccessResponse(res, 200);
    });
  });

  describe('Text classification (WDU)', () => {
    let textClassificationID;

    test('createTextClassification()', async () => {
      const textExtractionDataReferenceModel = createCosReference(
        'experienced.pdf',
        'wx-nodejs-test-text-extraction',
        cosId
      );

      const textClassificationParametersModel = {
        ocr_mode: 'disabled',
        classification_mode: 'exact',
        auto_rotation_correction: false,
      };

      const params = {
        documentReference: textExtractionDataReferenceModel,
        parameters: textClassificationParametersModel,
        projectId,
      };

      const res = await watsonxAIService.createTextClassification(params);
      expectSuccessResponse(res, 201);
      textClassificationID = res.result.metadata.id;
    });

    test('listTextClassifications()', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      const res = await watsonxAIService.listTextClassifications(params);
      expectSuccessResponse(res, 200);
    });

    test('listTextClassifications() via TextClassificationsPager', async () => {
      const params = {
        projectId,
        limit: 50,
      };

      await testPagerPattern(WatsonXAI.TextClassificationsPager, watsonxAIService, params, 1);
    });

    test('getTextClassification()', async () => {
      const params = {
        id: textClassificationID,
        projectId,
      };

      const res = await watsonxAIService.getTextClassification(params);
      expectSuccessResponse(res, 200);
    });

    test('deleteTextClassification()', async () => {
      const params = {
        id: textClassificationID,
        projectId,
        hardDelete: true,
      };

      const res = await watsonxAIService.deleteTextClassification(params);
      expectSuccessResponse(res, 204);
    });
  });
});
