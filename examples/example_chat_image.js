/**
 * The following example flow:
 * - initialize SDK
 * - create messages with image as content for chat conversation
 * - infere with chat with messages
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import axios from 'axios';
import 'dotenv/config';
process.env.IBM_CREDENTIALS_FILE = './auth/watsonx_ai_ml_vml_v1.env';
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});
const modelParameters = {
  maxTokens: 200,
};
const url =
  'https://raw.githubusercontent.com/IBM/watson-machine-learning-samples/master/cloud/data/logo/ibm_logo.jpg';

const response = await axios.get(url, {
  responseType: 'arraybuffer',
});
const img = Buffer.from(response.data, 'binary').toString('base64');

const question = 'What is on the picture';
const messages = [
  {
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: {
          url: 'data:image/jpeg;base64,' + img,
        },
      },
      {
        type: 'text',
        text: question,
      },
    ],
  },
];

const chatResponse = await watsonxAIService.textChat({
  modelId: 'meta-llama/llama-3-2-11b-vision-instruct',
  projectId,
  spaceId,
  messages,
  ...modelParameters,
});
console.log('\n\n***** EXAMPLE CHAT 4 - IMAGE INPUT TO MODEL *****');
console.log('\n\n***** MODEL INPUT MESSAGES *****');
console.log(question);
console.log('\n\n***** RESPONSE MESSAGE FROM MODEL *****');
console.log(chatResponse.result.choices[0]);
