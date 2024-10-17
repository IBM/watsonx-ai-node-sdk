/**
 * The following example flow:
 * - initialize SDK
 * - store prompt in space
 * - get stored prompt
 * - deploy stored prompt
 * - generate text based on deployed prompt
 */


import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import 'dotenv/config';

process.env.IBM_CREDENTIALS_FILE = './auth/watsonx_ai_ml_vml_v1.env';
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});

// Define parameters for text generation
const textGenRequestParametersModel = {
  max_new_tokens: 100,
};

// Define parameters for created prompt structure
const promptData = {
  instruction: 'Translate text from English to Spanish.',
  input_prefix: 'ENGLISH',
  output_prefix: 'SPANISH',
};

// Define parameters for created prompt content
const promptContentParams = {
  data: promptData,
  input: [['{input}', '']],
  model_id: 'ibm/granite-20b-multilingual',
  model_parameters: textGenRequestParametersModel,
};

// Define parameters for prompt creation request
const promptParameters = {
  name: 'WXAI SDK Example Prompt',
  description: 'Example prompt created from watsonx-ai-node-sdk library',
  projectId,
  spaceId,
  prompt: promptContentParams,
  promptVariables: {
    'input': {
      'defaultValue': 'This is my computer.',
    },
  },
};
console.log('\n\n***** EXAMPLE TEXT GENERATION 2 - PROMPT CREATION AND TEXT GENERATION *****');

// Store prompt
const savePrompt = await watsonxAIService.createPrompt(promptParameters);
const createdPromptId = savePrompt.result.id;
console.log('\n\n ***** PROMPT SAVED *****');
console.log('Prompt ID: %s', createdPromptId);

// Get stored prompt
const getPrompt = await watsonxAIService.getPrompt({
  promptId: createdPromptId,
  projectId,
  spaceId,
});
console.log('\n\n***** PROMPT CONTENT *****');
console.log(JSON.stringify(getPrompt.result, null, 2));

// Deploy stored prompt
const createDeploy = await watsonxAIService.createDeployment({
  name: 'Prompt deployment from WXAI SDK',
  baseModelId: promptContentParams.model_id,
  promptTemplate: { id: createdPromptId },
  projectId,
  spaceId,
  online: {},
});
console.log(JSON.stringify(createDeploy.result, null, 2));
const createdDeployId = createDeploy.result.metadata.id;
console.log('\n\n ***** PROMPT DEPLOYED *****');
console.log('Prompt ID: %s', createdDeployId);

// Infer deployed prompt
let modelInput = "It's sunny outside.";
const inferDeployedPrompt = await watsonxAIService.deploymentGenerateText({
  idOrName: createdDeployId,
  parameters: {
    prompt_variables: {
      'input': modelInput,
    },
  },
});
console.log('\n\n***** TEXT INPUT INTO MODEL *****');
console.log(modelInput);
console.log('\n\n***** TEXT RESPONSE FROM MODEL *****');
console.log(inferDeployedPrompt.result.results[0].generated_text);
