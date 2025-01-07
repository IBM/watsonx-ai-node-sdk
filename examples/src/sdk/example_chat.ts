/**
 * The following example flow:
 * - initialize SDK
 * - create messages for chat conversation with history
 * - request with messages and retrive a response
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

export const basicChat = async () => {
  // Service instance
  const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl,
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
    modelId: 'mistralai/mistral-large',
    projectId,
    spaceId,
    messages,
    ...modelParameters,
  });
  console.log('\n\n***** EXAMPLE CHAT 1 - BASIC CHAT WITH HISTORY *****');
  console.log('\n\n***** MODEL INPUT MESSAGES *****');
  console.log(messages);
  console.log('\n\n***** RESPONSE MESSAGE FROM MODEL *****');
  console.log(chatResponse.result.choices?.[0].message);
};
