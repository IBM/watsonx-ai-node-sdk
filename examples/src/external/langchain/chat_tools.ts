import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { HumanMessage } from '@langchain/core/messages';
import { conversationPrinter } from './utils.ts';
import '../../utils/config.ts';

const tools = [
  {
    type: 'function',
    function: {
      name: 'joke',
      description: 'Joke to tell user.',
      parameters: {
        title: 'Joke',
        type: 'object',
        properties: {
          setup: { type: 'string', description: 'The setup for the joke' },
          punchline: { type: 'string', description: "The joke's punchline" },
        },
        required: ['setup', 'punchline'],
      },
    },
  },
];
const modelWithTools = new ChatWatsonx({
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
  watsonxAIAuthType: 'iam',
  version: '2024-05-31',
  model: 'mistralai/mistral-large',
}).bindTools(tools);

console.log(
  '\n------------------------------ CHAT TOOLS #1 - single tool ------------------------------\n'
);
const message = [new HumanMessage('Tell me a joke about dogs')];
const joke = await modelWithTools.invoke(message);
conversationPrinter([...message, joke]);

const toolsCalc = [
  {
    function: {
      description: 'Adds a and b.',
      name: 'add',
      parameters: {
        properties: {
          a: { type: 'float' },
          b: { type: 'float' },
        },
        required: ['a', 'b'],
        type: 'object',
      },
    },
    type: 'function',
  },
  {
    function: {
      description: 'Multiplies a and b.',
      name: 'multiply',
      parameters: {
        properties: {
          a: { type: 'float' },
          b: { type: 'float' },
        },
        required: ['a', 'b'],
        type: 'object',
      },
    },
    type: 'function',
  },
];
const modelWithCalcTools = new ChatWatsonx({
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
  watsonxAIAuthType: 'iam',
  version: '2024-05-31',
  model: 'mistralai/mistral-large',
}).bindTools([...toolsCalc, ...tools]);
console.log(
  '\n------------------------------ CHAT TOOLS #2 - multiple tool ------------------------------\n'
);
const advancedMessage = [
  new HumanMessage('What is 23+6? Also, what is 45*4? Tell me a joke about cats!'),
];
const calc = await modelWithCalcTools.invoke(advancedMessage);
conversationPrinter([...advancedMessage, calc]);
