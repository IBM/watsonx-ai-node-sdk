import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import path from 'path';
import { config } from 'dotenv';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { conversationPrinter } from './utils';

const myPath = path.join(__dirname, '/../../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

export const chatConversation = async () => {
  const model = new ChatWatsonx({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    model: 'mistralai/mistral-large',
    maxTokens: 1000,
  });
  console.log(
    '\n------------------------------ CHAT CONVERSATION #1 - basic message ------------------------------\n'
  );
  const messageIbm = new HumanMessage('Tell me about IBM');
  const ibm = await model.invoke([messageIbm]);
  conversationPrinter([messageIbm, ibm]);
  console.log(
    '\n------------------------------ CHAT CONVERSATION #2 - basic message ------------------------------\n'
  );
  const messageCalc = new HumanMessage('What is 24+31?');
  const calc = await model.invoke([messageCalc]);
  conversationPrinter([messageCalc, calc]);

  console.log(
    '\n------------------------------ CHAT CONVERSATION #3 - with history ------------------------------\n'
  );
  const messages = [
    new SystemMessage('You are a helpful assistant.'),
    new HumanMessage('Who won the world series in 2020?'),
    new AIMessage('The Los Angeles Dodgers won the World Series in 2020.'),
    new HumanMessage('Where was it played?'),
  ];
  const chatWithHistory = await model.invoke(messages);
  console.log(chatWithHistory.content);

  console.log(
    '\n------------------------------ CHAT CONVERSATION #4 - streaming with history ------------------------------\n'
  );
  const messagesStream = [
    new SystemMessage('You are a helpful assistant.'),
    new HumanMessage('Who won the world series in 2020?'),
    new AIMessage('The Los Angeles Dodgers won the World Series in 2020.'),
    new HumanMessage('Where was it played?'),
  ];
  const streamChatWithHistory = await model.stream(messagesStream);
  let result = '';
  conversationPrinter([...messagesStream]);

  for await (const chunk of streamChatWithHistory) {
    result += chunk.content;
    conversationPrinter([new AIMessage(result)]);
  }
};
