/**
 * The following example flow:
 * - initialize SDK
 * - list all available embedding models
 * - generate embedding vectors for input using two different models
 * - compare generated embedding vectors
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { config } from 'dotenv';
import path from 'path';

const myPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

// process.env.IBM_CREDENTIALS_FILE = '<ABSOLUTE_PATH>/auth/watsonx_ai_ml_vml_v1.env';

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

export const basicEmbeddings = async () => {
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
  const modelList = listModels.result.resources.map((model) => model.model_id);
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
  const embedding_vector1 = embedding1.result.results;
  console.log('\n\n***** EMBEDDING VECTOR FROM 1ST MODEL *****');
  console.log(embedding_vector1);

  // Tokenize input data on 2nd model
  const textEmbeddingParameters2 = {
    inputs: [input],
    modelId: model2,
    projectId,
    spaceId,
  };
  const embedding2 = await watsonxAIService.embedText(textEmbeddingParameters2);
  const embedding_vector2 = embedding2.result.results;
  console.log('\n\n***** EMBEDDING VECTOR FROM 2ND MODEL *****');
  console.log(embedding_vector2);
};
