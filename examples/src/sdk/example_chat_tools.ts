/**
 * The following example flow:
 * - initialize SDK
 * - create messages for chat conversation
 * - create tools for chat
 * - request with tools and question to a model
 * - retrive response from a model
 */
/* eslint-disable no-restricted-syntax */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const modelName = 'ibm/granite-3-3-8b-instruct';
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});
const modelParameters = {
  maxTokens: 200,
};
// Define tools passed to a request
const tools = [
  {
    'type': 'function',
    'function': {
      'name': 'sum',
      'description': 'Add two numbers',
      'parameters': {
        'type': 'object',
        'properties': {
          'number1': {
            'description': 'First number',
            'type': 'number',
          },
          'number2': {
            'description': 'Second number',
            'type': 'number',
          },
          'result': {
            'description': 'Sum of two numbers',
            'type': 'number',
          },
        },
        'required': ['number1', 'number2', 'result'],
      },
    },
  },
  {
    'type': 'function',
    'function': {
      'name': 'multiply',
      'description': 'Multiply two numbers',
      'parameters': {
        'type': 'object',
        'properties': {
          'number1': {
            'description': 'First number',
            'type': 'number',
          },
          'number2': {
            'description': 'Second number',
            'type': 'number',
          },
          'result': {
            'description': 'Multiplication of two numbers',
            'type': 'number',
          },
        },
        'required': ['number1', 'number2', 'result'],
      },
    },
  },
];
// Define a questiomn asked by user
const question = {
  role: 'user',
  content: 'What is 12 + 34? Also, what is 3 * 7?',
};

const chatResponse = await watsonxAIService.textChat({
  modelId: modelName,
  projectId,
  spaceId,
  messages: [question],
  tools,
  ...modelParameters,
});
console.log('\n\n***** EXAMPLE CHAT 5 - CALL CHAT WITH TOOLS *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(question);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL *****');
console.log(chatResponse.result.choices[0]?.message?.tool_calls);
