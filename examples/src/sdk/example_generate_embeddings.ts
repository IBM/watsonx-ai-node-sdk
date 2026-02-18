/**
 * The following example flow:
 *
 * - Initialize SDK
 * - List all available embedding models
 * - Generate embedding vectors for input using two different models
 * - Compare generated embedding vectors
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});

// Get available embedding models
const listModelParams = {
  'filters': 'function_embedding',
};
console.log('\n\n***** EXAMPLE EMBEDDINGS 1 - LIST MODELS AND DISPLAY VECTORS *****');

const listModels = await watsonxAIService.listFoundationModelSpecs(listModelParams);
if (listModels.result.resources && listModels.result.resources.length < 2)
  throw new Error('There is less than 2 available models');

const modelList = listModels.result.resources?.map((model) => model.model_id) as string[];
console.log('\n\n***** LIST OF AVAILABLE EMBEDDING MODELS *****');
console.log(modelList);

// Get two first available embedding models
const model1 = modelList[0];
const model2 = modelList[1];

// Specify input data
const input =
  'You should be able to notice a difference between how the models are generating embedding vector for the same input.';

// Tokenize input data on 1st model
const textEmbeddingParameters1 = {
  inputs: [input],
  modelId: model1,
  projectId,
  spaceId,
};
const embedding1 = await watsonxAIService.embedText(textEmbeddingParameters1);

console.log('\n\n***** EMBEDDING VECTOR FROM 1ST MODEL *****');
console.log(embedding1.result.results);

// Tokenize input data on 2nd model
const textEmbeddingParameters2 = {
  inputs: [input],
  modelId: model2,
  projectId,
  spaceId,
};
const embedding2 = await watsonxAIService.embedText(textEmbeddingParameters2);

console.log('\n\n***** EMBEDDING VECTOR FROM 2ND MODEL *****');
console.log(embedding2.result.results);
