/**
 * (C) Copyright IBM Corp. 2026.
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

import * as WatsonxAIExports from '../../src';
import * as GatewayTypes from '../../src/gateway/types';

describe('Namespace Exports', () => {
  describe('Constants Namespaces', () => {
    test('PostPromptConstants is exported', () => {
      expect(WatsonxAIExports.PostPromptConstants).toBeDefined();
      expect(typeof WatsonxAIExports.PostPromptConstants).toBe('object');
    });

    test('PatchPromptConstants is exported', () => {
      expect(WatsonxAIExports.PatchPromptConstants).toBeDefined();
      expect(typeof WatsonxAIExports.PatchPromptConstants).toBe('object');
    });

    test('PutPromptLockConstants is exported', () => {
      expect(WatsonxAIExports.PutPromptLockConstants).toBeDefined();
      expect(typeof WatsonxAIExports.PutPromptLockConstants).toBe('object');
    });

    test('PostPromptSessionEntryConstants is exported', () => {
      expect(WatsonxAIExports.PostPromptSessionEntryConstants).toBeDefined();
      expect(typeof WatsonxAIExports.PostPromptSessionEntryConstants).toBe('object');
    });

    test('PutPromptSessionLockConstants is exported', () => {
      expect(WatsonxAIExports.PutPromptSessionLockConstants).toBeDefined();
      expect(typeof WatsonxAIExports.PutPromptSessionLockConstants).toBe('object');
    });

    test('TextChatConstants is exported', () => {
      expect(WatsonxAIExports.TextChatConstants).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatConstants).toBe('object');
    });

    test('TextChatStreamConstants is exported', () => {
      expect(WatsonxAIExports.TextChatStreamConstants).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatStreamConstants).toBe('object');
    });

    test('TrainingsListConstants is exported', () => {
      expect(WatsonxAIExports.TrainingsListConstants).toBeDefined();
      expect(typeof WatsonxAIExports.TrainingsListConstants).toBe('object');
    });

    test('CreateFineTuningConstants is exported', () => {
      expect(WatsonxAIExports.CreateFineTuningConstants).toBeDefined();
      expect(typeof WatsonxAIExports.CreateFineTuningConstants).toBe('object');
    });
  });

  describe('Interface Namespaces', () => {
    test('ApiErrorTarget is exported', () => {
      expect(WatsonxAIExports.ApiErrorTarget).toBeDefined();
      expect(typeof WatsonxAIExports.ApiErrorTarget).toBe('object');
    });

    test('DataConnectionReference is exported', () => {
      expect(WatsonxAIExports.DataConnectionReference).toBeDefined();
      expect(typeof WatsonxAIExports.DataConnectionReference).toBe('object');
    });

    test('DeploymentEntity is exported', () => {
      expect(WatsonxAIExports.DeploymentEntity).toBeDefined();
      expect(typeof WatsonxAIExports.DeploymentEntity).toBe('object');
    });

    test('DeploymentStatus is exported', () => {
      expect(WatsonxAIExports.DeploymentStatus).toBeDefined();
      expect(typeof WatsonxAIExports.DeploymentStatus).toBe('object');
    });

    test('DeploymentTextGenProperties is exported', () => {
      expect(WatsonxAIExports.DeploymentTextGenProperties).toBeDefined();
      expect(typeof WatsonxAIExports.DeploymentTextGenProperties).toBe('object');
    });

    test('FoundationModel is exported', () => {
      expect(WatsonxAIExports.FoundationModel).toBeDefined();
      expect(typeof WatsonxAIExports.FoundationModel).toBe('object');
    });

    test('HardwareRequest is exported', () => {
      expect(WatsonxAIExports.HardwareRequest).toBeDefined();
      expect(typeof WatsonxAIExports.HardwareRequest).toBe('object');
    });

    test('JsonPatchOperation is exported', () => {
      expect(WatsonxAIExports.JsonPatchOperation).toBeDefined();
      expect(typeof WatsonxAIExports.JsonPatchOperation).toBe('object');
    });

    test('LifeCycleState is exported', () => {
      expect(WatsonxAIExports.LifeCycleState).toBeDefined();
      expect(typeof WatsonxAIExports.LifeCycleState).toBe('object');
    });

    test('ObjectLocation is exported', () => {
      expect(WatsonxAIExports.ObjectLocation).toBeDefined();
      expect(typeof WatsonxAIExports.ObjectLocation).toBe('object');
    });

    test('PromptTuning is exported', () => {
      expect(WatsonxAIExports.PromptTuning).toBeDefined();
      expect(typeof WatsonxAIExports.PromptTuning).toBe('object');
    });

    test('TextChatParameterTools is exported', () => {
      expect(WatsonxAIExports.TextChatParameterTools).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatParameterTools).toBe('object');
    });

    test('TextChatResponseFormat is exported', () => {
      expect(WatsonxAIExports.TextChatResponseFormat).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatResponseFormat).toBe('object');
    });

    test('TextChatResultChoice is exported', () => {
      expect(WatsonxAIExports.TextChatResultChoice).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatResultChoice).toBe('object');
    });

    test('TextChatResultChoiceStream is exported', () => {
      expect(WatsonxAIExports.TextChatResultChoiceStream).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatResultChoiceStream).toBe('object');
    });

    test('TextChatToolChoiceTool is exported', () => {
      expect(WatsonxAIExports.TextChatToolChoiceTool).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatToolChoiceTool).toBe('object');
    });

    test('TextExtractionDataReference is exported', () => {
      expect(WatsonxAIExports.TextExtractionDataReference).toBeDefined();
      expect(typeof WatsonxAIExports.TextExtractionDataReference).toBe('object');
    });

    test('TextExtractionResults is exported', () => {
      expect(WatsonxAIExports.TextExtractionResults).toBeDefined();
      expect(typeof WatsonxAIExports.TextExtractionResults).toBe('object');
    });

    test('TextGenParameters is exported', () => {
      expect(WatsonxAIExports.TextGenParameters).toBeDefined();
      expect(typeof WatsonxAIExports.TextGenParameters).toBe('object');
    });

    test('TextGenResponseFieldsResultsItem is exported', () => {
      expect(WatsonxAIExports.TextGenResponseFieldsResultsItem).toBeDefined();
      expect(typeof WatsonxAIExports.TextGenResponseFieldsResultsItem).toBe('object');
    });

    test('TrainingStatus is exported', () => {
      expect(WatsonxAIExports.TrainingStatus).toBeDefined();
      expect(typeof WatsonxAIExports.TrainingStatus).toBe('object');
    });

    test('ChatItem is exported', () => {
      expect(WatsonxAIExports.ChatItem).toBeDefined();
      expect(typeof WatsonxAIExports.ChatItem).toBe('object');
    });

    test('PromptLock is exported', () => {
      expect(WatsonxAIExports.PromptLock).toBeDefined();
      expect(typeof WatsonxAIExports.PromptLock).toBe('object');
    });

    test('WxPromptResponse is exported', () => {
      expect(WatsonxAIExports.WxPromptResponse).toBeDefined();
      expect(typeof WatsonxAIExports.WxPromptResponse).toBe('object');
    });

    test('WxPromptSessionEntry is exported', () => {
      expect(WatsonxAIExports.WxPromptSessionEntry).toBeDefined();
      expect(typeof WatsonxAIExports.WxPromptSessionEntry).toBe('object');
    });

    test('TextChatMessagesTextChatMessageAssistant is exported', () => {
      expect(WatsonxAIExports.TextChatMessagesTextChatMessageAssistant).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatMessagesTextChatMessageAssistant).toBe('object');
    });

    test('TextChatMessagesTextChatMessageSystem is exported', () => {
      expect(WatsonxAIExports.TextChatMessagesTextChatMessageSystem).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatMessagesTextChatMessageSystem).toBe('object');
    });

    test('TextChatMessagesTextChatMessageTool is exported', () => {
      expect(WatsonxAIExports.TextChatMessagesTextChatMessageTool).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatMessagesTextChatMessageTool).toBe('object');
    });

    test('TextChatMessagesTextChatMessageUser is exported', () => {
      expect(WatsonxAIExports.TextChatMessagesTextChatMessageUser).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatMessagesTextChatMessageUser).toBe('object');
    });

    test('TextChatUserContentsTextChatUserImageURLContent is exported', () => {
      expect(WatsonxAIExports.TextChatUserContentsTextChatUserImageURLContent).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatUserContentsTextChatUserImageURLContent).toBe(
        'object'
      );
    });

    test('TextChatUserContentsTextChatUserTextContent is exported', () => {
      expect(WatsonxAIExports.TextChatUserContentsTextChatUserTextContent).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatUserContentsTextChatUserTextContent).toBe('object');
    });

    test('FineTuningEntity is exported', () => {
      expect(WatsonxAIExports.FineTuningEntity).toBeDefined();
      expect(typeof WatsonxAIExports.FineTuningEntity).toBe('object');
    });

    test('FineTuningPeftParameters is exported', () => {
      expect(WatsonxAIExports.FineTuningPeftParameters).toBeDefined();
      expect(typeof WatsonxAIExports.FineTuningPeftParameters).toBe('object');
    });

    test('DocumentExtractionStatus is exported', () => {
      expect(WatsonxAIExports.DocumentExtractionStatus).toBeDefined();
      expect(typeof WatsonxAIExports.DocumentExtractionStatus).toBe('object');
    });

    test('SyntheticDataGenerationDataReference is exported', () => {
      expect(WatsonxAIExports.SyntheticDataGenerationDataReference).toBeDefined();
      expect(typeof WatsonxAIExports.SyntheticDataGenerationDataReference).toBe('object');
    });

    test('SyntheticDataGenerationStatus is exported', () => {
      expect(WatsonxAIExports.SyntheticDataGenerationStatus).toBeDefined();
      expect(typeof WatsonxAIExports.SyntheticDataGenerationStatus).toBe('object');
    });

    test('TaxonomyStatus is exported', () => {
      expect(WatsonxAIExports.TaxonomyStatus).toBeDefined();
      expect(typeof WatsonxAIExports.TaxonomyStatus).toBe('object');
    });

    test('ModelResourceEntity is exported', () => {
      expect(WatsonxAIExports.ModelResourceEntity).toBeDefined();
      expect(typeof WatsonxAIExports.ModelResourceEntity).toBe('object');
    });

    test('ContentLocation is exported', () => {
      expect(WatsonxAIExports.ContentLocation).toBeDefined();
      expect(typeof WatsonxAIExports.ContentLocation).toBe('object');
    });

    test('DocumentExtractionObjectLocation is exported', () => {
      expect(WatsonxAIExports.DocumentExtractionObjectLocation).toBeDefined();
      expect(typeof WatsonxAIExports.DocumentExtractionObjectLocation).toBe('object');
    });

    test('ObjectLocationGithub is exported', () => {
      expect(WatsonxAIExports.ObjectLocationGithub).toBeDefined();
      expect(typeof WatsonxAIExports.ObjectLocationGithub).toBe('object');
    });

    test('TextClassificationDataReference is exported', () => {
      expect(WatsonxAIExports.TextClassificationDataReference).toBeDefined();
      expect(typeof WatsonxAIExports.TextClassificationDataReference).toBe('object');
    });

    test('TextClassificationParameters is exported', () => {
      expect(WatsonxAIExports.TextClassificationParameters).toBeDefined();
      expect(typeof WatsonxAIExports.TextClassificationParameters).toBe('object');
    });

    test('TextClassificationResults is exported', () => {
      expect(WatsonxAIExports.TextClassificationResults).toBeDefined();
      expect(typeof WatsonxAIExports.TextClassificationResults).toBe('object');
    });

    test('TextClassificationSemanticConfig is exported', () => {
      expect(WatsonxAIExports.TextClassificationSemanticConfig).toBeDefined();
      expect(typeof WatsonxAIExports.TextClassificationSemanticConfig).toBe('object');
    });

    test('TextChatToolCall is exported', () => {
      expect(WatsonxAIExports.TextChatToolCall).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatToolCall).toBe('object');
    });

    test('TextChatUserImageURL is exported', () => {
      expect(WatsonxAIExports.TextChatUserImageURL).toBeDefined();
      expect(typeof WatsonxAIExports.TextChatUserImageURL).toBe('object');
    });
  });

  describe('Gateway Types Namespaces', () => {
    test('ChatsAudioInput is exported', () => {
      expect(GatewayTypes.ChatsAudioInput).toBeDefined();
      expect(typeof GatewayTypes.ChatsAudioInput).toBe('object');
    });

    test('ChatsImageURL is exported', () => {
      expect(GatewayTypes.ChatsImageURL).toBeDefined();
      expect(typeof GatewayTypes.ChatsImageURL).toBe('object');
    });

    test('ChatsTextContentPart is exported', () => {
      expect(GatewayTypes.ChatsTextContentPart).toBeDefined();
      expect(typeof GatewayTypes.ChatsTextContentPart).toBe('object');
    });

    test('CreateChatCompletionsConstants is exported', () => {
      expect(GatewayTypes.CreateChatCompletionsConstants).toBeDefined();
      expect(typeof GatewayTypes.CreateChatCompletionsConstants).toBe('object');
    });

    test('ChatsPrediction is exported', () => {
      expect(GatewayTypes.ChatsPrediction).toBeDefined();
      expect(typeof GatewayTypes.ChatsPrediction).toBe('object');
    });

    test('ChatsResponseFormatJSON is exported', () => {
      expect(GatewayTypes.ChatsResponseFormatJSON).toBeDefined();
      expect(typeof GatewayTypes.ChatsResponseFormatJSON).toBe('object');
    });

    test('ChatsResponseFormatJSONSchema is exported', () => {
      expect(GatewayTypes.ChatsResponseFormatJSONSchema).toBeDefined();
      expect(typeof GatewayTypes.ChatsResponseFormatJSONSchema).toBe('object');
    });

    test('ChatsResponseFormatText is exported', () => {
      expect(GatewayTypes.ChatsResponseFormatText).toBeDefined();
      expect(typeof GatewayTypes.ChatsResponseFormatText).toBe('object');
    });

    test('ChatsChoice is exported', () => {
      expect(GatewayTypes.ChatsChoice).toBeDefined();
      expect(typeof GatewayTypes.ChatsChoice).toBe('object');
    });

    test('ChatsRequestTool is exported', () => {
      expect(GatewayTypes.ChatsRequestTool).toBeDefined();
      expect(typeof GatewayTypes.ChatsRequestTool).toBe('object');
    });

    test('Embedding is exported', () => {
      expect(GatewayTypes.Embedding).toBeDefined();
      expect(typeof GatewayTypes.Embedding).toBe('object');
    });

    test('EmbeddingResponse is exported', () => {
      expect(GatewayTypes.EmbeddingResponse).toBeDefined();
      expect(typeof GatewayTypes.EmbeddingResponse).toBe('object');
    });

    test('ModelRouter is exported', () => {
      expect(GatewayTypes.ModelRouter).toBeDefined();
      expect(typeof GatewayTypes.ModelRouter).toBe('object');
    });

    test('CreatePolicyConstants is exported', () => {
      expect(GatewayTypes.CreatePolicyConstants).toBeDefined();
      expect(typeof GatewayTypes.CreatePolicyConstants).toBe('object');
    });

    test('TenantPolicy is exported', () => {
      expect(GatewayTypes.TenantPolicy).toBeDefined();
      expect(typeof GatewayTypes.TenantPolicy).toBe('object');
    });
  });
});

// Made with Bob
