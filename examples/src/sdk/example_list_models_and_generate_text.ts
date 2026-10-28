/**
 * The following example flow:
 *
 * - Initialize SDK
 * - List available models
 * - Infer one of available models
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const modelName = 'ibm/granite-4-h-small';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance — version defaults to the latest supported API date.
// projectId and spaceId are passed here so they do not need to be repeated on every request.
const watsonxAIService = WatsonXAI.newInstance({
  serviceUrl,
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  spaceId: process.env.WATSONX_AI_PROJECT_ID ? undefined : process.env.WATSONX_AI_SPACE_ID,
});

// Define parameters for text generation
const textGenRequestParametersModel = {
  max_new_tokens: 100,
};

// Define model list filter
const listModelParams = {
  filters: 'lifecycle_available',
};
console.log('\n\n***** EXAMPLE TEXT GENERATION 1 - LIST MODELS AND GENERATE TEXT *****');

// Get available models
const listModels = await watsonxAIService.listFoundationModelSpecs(listModelParams);
const modelList = listModels.result.resources?.map((model) => model.model_id);
console.log('\n\n***** LIST OF AVAILABLE MODELS *****');
console.log(modelList);

// Infer one of available models
const genParams = {
  input: 'Generate a short greeting for project kick-off meeting.',
  modelId: modelName,
  parameters: textGenRequestParametersModel,
};
const textGenerationResult = await watsonxAIService.generateText(genParams);
console.log('\n\n***** TEXT INPUT INTO MODEL *****');
console.log(genParams.input);
console.log('\n\n***** TEXT RESPONSE FROM MODEL *****');
console.log(textGenerationResult.result.results[0].generated_text);
