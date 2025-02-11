/**
 * The following example flow:
 * - initialize SDK
 * - tokenize input on two chosen models
 * - compare how input is split into tokens between two models
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
export const tokenizeInput = async () => {
  // Service instance
  const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl,
  });

  // Specify two models
  const model1 = 'google/flan-ul2';
  const model2 = 'meta-llama/llama-3-1-70b-instruct';

  // Specify input data
  const input =
    'You should be able to notice a difference between how the models are splitting the input into tokens.';

  // Tokenize input data on 1st model
  const textTokenzationParameters1 = {
    input,
    modelId: model1,
    projectId,
    spaceId,
    parameters: {
      return_tokens: true,
    },
  };
  console.log('\n\n***** EXAMPLE TEXT GENERATION 4 - TOKENIZATION *****');

  const tokenize1 = await watsonxAIService.tokenizeText(textTokenzationParameters1);
  const tokens1 = tokenize1.result.result.tokens;
  console.log('\n\n***** TOKENS FROM 1ST MODEL *****');
  console.log(tokens1);

  // Tokenize input data on 2nd model
  const textTokenzationParameters2 = {
    input,
    modelId: model2,
    projectId,
    spaceId,
    parameters: {
      return_tokens: true,
    },
  };
  const tokenize2 = await watsonxAIService.tokenizeText(textTokenzationParameters2);
  const tokens2 = tokenize2.result.result.tokens;
  console.log('\n\n***** TOKENS FROM 2ND MODEL *****');
  console.log(tokens2);
};
