/**
 * The following example flow:
 * - initialize SDK
 * - create messages for chat conversation
 * - request with messages and response type as string
 * - read stream passed as response
 * - request with messages and response type as object
 * - read stream passed as response
 */
/* eslint-disable no-restricted-syntax */

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
  modelId: 'mistralai/mistral-large',
  projectId,
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
  modelId: 'mistralai/mistral-large',
  projectId,
  spaceId,
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
