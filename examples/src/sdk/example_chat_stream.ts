/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Create messages for chat conversation
 * - Request with messages and response type as string
 * - Read stream passed as response
 * - Request with messages and response type as object
 * - Read stream passed as response
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

// Define parameters passed to a request
const modelParameters = {
  maxTokens: 200,
};

// Define mesages passed to a request
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
const chatStream = await watsonxAIService.textChatStream({
  modelId: modelName,
  messages,
  ...modelParameters,
});

console.log('\n\n***** EXAMPLE CHAT 2 - STREAM AS STRING WITH HISTORY *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(messages);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL AS STRING *****');

// Read the stream
for await (const chunk of chatStream) {
  console.log(chunk);
}

const chatStreamObjects = await watsonxAIService.textChatStream({
  modelId: modelName,
  messages,
  returnObject: true,
  ...modelParameters,
});

console.log('\n\n***** EXAMPLE CHAT 3 - STREAM AS OBJECT WITH HISTORY *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(messages);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL AS OBJECT*****');

// Read the stream
for await (const chunk of chatStreamObjects) {
  console.log(chunk);
}
