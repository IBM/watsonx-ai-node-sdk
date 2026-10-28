/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Create messages for chat conversation with history
 * - Request with messages and retrive a response
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
const modelParameters = {
  maxTokens: 200,
};
const messages = [
  {
    role: 'user',
    content: 'Hi! My name is Filip!',
  },
  {
    role: 'assistant',
    content: 'Hi Filip! How may I assist you?',
  },
  {
    role: 'user',
    content: 'What is my name?',
  },
];

const chatResponse = await watsonxAIService.textChat({
  modelId: modelName,
  messages,
  ...modelParameters,
});
console.log('\n\n***** EXAMPLE CHAT 1 - BASIC CHAT WITH HISTORY *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(messages);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL *****');
console.log(chatResponse.result.choices?.[0].message);
