/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Store prompt in space
 * - Get stored prompt
 * - Deploy stored prompt
 * - Generate text based on deployed prompt
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const modelName = 'ibm/granite-3-3-8b-instruct';
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
  console.log('\n\n***** EXAMPLE TEXT GENERATION 2 - PROMPT CREATION AND TEXT GENERATION *****');
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
  if (!createdDeployId) throw new Error('There was an error creating a deployment');

  console.log('\n\n ***** PROMPT DEPLOYED *****');
  console.log('Prompt ID: %s', createdDeployId);

  // Infer deployed prompt
  const modelInput = "It's sunny outside.";
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
} catch (e) {
  throw new Error(
    `Failed to run example: ${(e as Error).message}. Proceeding to clean up the environemnt.`
  );
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
