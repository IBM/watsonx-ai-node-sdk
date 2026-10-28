/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Tokenize input on two chosen models
 * - Compare how input is split into tokens between two models
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
// Service instance — version defaults to the latest supported API date.
// projectId and spaceId are passed here so they do not need to be repeated on every request.
const watsonxAIService = WatsonXAI.newInstance({
  serviceUrl,
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  spaceId: process.env.WATSONX_AI_PROJECT_ID ? undefined : process.env.WATSONX_AI_SPACE_ID,
});

// Specify two models
const modelName = 'ibm/granite-4-h-small';
const modelName2 = 'mistralai/mistral-small-3-1-24b-instruct-2503';

// Specify input data
const input =
  'You should be able to notice a difference between how the models are splitting the input into tokens.';

// Tokenize input data on 1st model
const textTokenzationParameters1 = {
  input,
  modelId: modelName,
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
  parameters: {
    return_tokens: true,
  },
};
const tokenize2 = await watsonxAIService.tokenizeText(textTokenzationParameters2);
const tokens2 = tokenize2.result.result.tokens;
console.log('\n\n***** TOKENS FROM 2ND MODEL *****');
console.log(tokens2);
