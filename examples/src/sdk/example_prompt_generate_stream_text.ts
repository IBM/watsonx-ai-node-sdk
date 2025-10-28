/**
 * The following example flow:
 * - initialize SDK
 * - store prompt in project
 * - get stored prompt
 * - deploy stored prompt
 * - generate text stream based on deployed prompt
 */
/* eslint-disable no-restricted-syntax */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const modelName = 'ibm/granite-3-2-8b-instruct';
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});

// Define parameters for text generation
const textGenRequestParametersModel = {
  max_new_tokens: 50,
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
  model_id: modelName,
  model_parameters: textGenRequestParametersModel,
};

// Define parameters for prompt creation request
const promptParameters = {
  name: 'WXAI Node.js SDK Example Prompt',
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
let createdPromptId: string | undefined;
let createdDeployId: string | undefined;
try {
  console.log('\n\n***** EXAMPLE TEXT GENERATION 3 - PROMPT CREATION AND TEXT STREAMING *****');
  // Store prompt
  const savePrompt = await watsonxAIService.createPrompt(promptParameters);
  createdPromptId = savePrompt.result.id;
  if (!createdPromptId) throw new Error('There was an error creating a prompt');

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
    name: 'WXAI Node.js SDK Example Prompt Deployment',
    baseModelId: promptContentParams.model_id,
    promptTemplate: { id: createdPromptId },
    projectId,
    spaceId,
    online: {},
  });
  console.log(JSON.stringify(createDeploy.result, null, 2));

  createdDeployId = createDeploy.result.metadata?.id;
  if (!createdDeployId) throw new Error('There was an error creating a deploument');

  console.log('\n\n ***** PROMPT DEPLOYED *****');
  console.log('Prompt ID: %s', createdDeployId);

  // Infer deployed prompt
  const modelInput = "It's sunny outside.";
  const streamInferDeployedPrompt = await watsonxAIService.deploymentGenerateTextStream({
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
  for await (const line of streamInferDeployedPrompt) {
    console.log(line);
  }
} catch (e) {
  throw e;
} finally {
  // All resources will be deleted after this example. If you want to use them afterward, please comment out the lines below.
  if (createdDeployId)
    await watsonxAIService.deleteDeployment({
      deploymentId: createdDeployId,
      projectId,
      spaceId,
    });
  if (createdPromptId)
    await watsonxAIService.deletePrompt({ promptId: createdPromptId, projectId, spaceId });
}
