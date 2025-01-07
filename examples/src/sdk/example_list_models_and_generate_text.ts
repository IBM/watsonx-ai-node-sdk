/**
 * The following example flow:
 * - initialize SDK
 * - list available models
 * - infer one of available models
 */
/* eslint-disable import/prefer-default-export */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import { config } from 'dotenv';
import path from 'path';

const myPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

export const textGeneration = async () => {
  // process.env.IBM_CREDENTIALS_FILE = '<ABSOLUTE_PATH>/auth/watsonx_ai_ml_vml_v1.env';

  const projectId = process.env.WATSONX_AI_PROJECT_ID;
  const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

  const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
  console.log(projectId, serviceUrl);

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
  const genParams = {
    input: 'Generate a short greeting for project kick-off meeting.',
    modelId: 'google/flan-ul2',
    projectId,
    spaceId,
    parameters: textGenRequestParametersModel,
  };
  const textGenerationResult = await watsonxAIService.generateText(genParams);
  console.log('\n\n***** TEXT INPUT INTO MODEL *****');
  console.log(genParams.input);
  console.log('\n\n***** TEXT RESPONSE FROM MODEL *****');
  console.log(textGenerationResult.result.results[0].generated_text);
};
