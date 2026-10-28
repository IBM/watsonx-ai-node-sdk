/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Create messages for chat conversation
 * - Create tools for chat
 * - Request with tools and question to a model
 * - Retrive response from a model
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
  messages: [question],
  tools,
  ...modelParameters,
});
console.log('\n\n***** EXAMPLE CHAT 5 - CALL CHAT WITH TOOLS *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(question);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL *****');
console.log(chatResponse.result.choices[0]?.message?.tool_calls);
