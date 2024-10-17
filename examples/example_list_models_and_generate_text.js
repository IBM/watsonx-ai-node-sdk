/**
 * The following example flow:
 * - initialize SDK
 * - list available models
 * - infer one of available models
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

// Define model list filter
const listModelParams = {
  filters: 'lifecycle_available',
};
console.log('\n\n***** EXAMPLE TEXT GENERATION 1 - LIST MODELS AND GENERATE TEXT *****');

// Get available models
const listModels = await watsonxAIService.listFoundationModelSpecs(listModelParams);
const modelList = listModels.result.resources.map((model) => model.model_id);
console.log('\n\n***** LIST OF AVAILABLE MODELS *****');
console.log(modelList);

// Infer one of available models
let genParams = {
  input: 'Generate a short greeting for project kick-off meeting.',
  modelId: 'google/flan-ul2',
  projectId,
  spaceId,
  parameters: textGenRequestParametersModel,
};
const textGeneration = await watsonxAIService.generateText(genParams);
console.log('\n\n***** TEXT INPUT INTO MODEL *****');
console.log(genParams.input);
console.log('\n\n***** TEXT RESPONSE FROM MODEL *****');
console.log(textGeneration.result.results[0].generated_text);


