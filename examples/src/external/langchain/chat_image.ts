import { ChatWatsonx } from '@langchain/ibm';
import axios from 'axios';
import { HumanMessage } from '@langchain/core/messages';
import { conversationPrinter } from './utils.ts';
import '../../utils/config.ts';

const model = new ChatWatsonx({
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
  watsonxAIAuthType: 'iam',
  version: '2024-05-31',
  model: 'mistralai/mistral-small-3-1-24b-instruct-2503',
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
