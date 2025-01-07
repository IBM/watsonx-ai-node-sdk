import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import axios from 'axios';
import path from 'path';
import { config } from 'dotenv';

import { HumanMessage } from '@langchain/core/messages';
import { conversationPrinter } from './utils';

const myPath = path.join(__dirname, '/../../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

export const chatWithImage = async () => {
  const model = new ChatWatsonx({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    model: 'meta-llama/llama-3-2-11b-vision-instruct',
    maxTokens: 250,
  });

  const { data } = await axios.get(
    'https://raw.github.com/IBM/watson-machine-learning-samples/master/cloud/data/logo/ibm_logo.jpg',
    {
      responseType: 'arraybuffer',
    }
  );

  const base64 = Buffer.from(data, 'binary').toString('base64');
  const query = 'Describe the image';
  const messages = [
    new HumanMessage({
      content: [
        {
          type: 'text',
          text: query,
        },
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/jpeg;base64,' + base64,
          },
        },
      ],
    }),
  ];
  const res = await model.invoke(messages);
  conversationPrinter([...messages, res]);
};
