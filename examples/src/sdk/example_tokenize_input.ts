/**
 * The following example flow:
 * - initialize SDK
 * - tokenize input on two chosen models
 * - compare how input is split into tokens between two models
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

// Specify two models
const modelName = 'ibm/granite-3-3-8b-instruct';
const modelName2 = 'meta-llama/llama-3-3-70b-instruct';

// Specify input data
const input =
  'You should be able to notice a difference between how the models are splitting the input into tokens.';

// Tokenize input data on 1st model
const textTokenzationParameters1 = {
  input,
  modelId: modelName,
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
  modelId: modelName2,
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
