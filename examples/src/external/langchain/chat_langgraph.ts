import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import path from 'path';
import { config } from 'dotenv';

import { writeFile } from 'fs/promises';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { conversationPrinter } from './utils';

const myPath = path.join(__dirname, '/../../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

export const chatWithLanggraph = async () => {
  const model = new ChatWatsonx({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    model: 'meta-llama/llama-3-1-70b-instruct',
  });
  const storage = [
    { id: 1, name: 'Apple', category: 'fruit' },
    { id: 2, name: 'Carrot', category: 'vegetable' },
    { id: 3, name: 'Banana', category: 'fruit' },
    { id: 4, name: 'Broccoli', category: 'vegetable' },
    { id: 5, name: 'Egg', category: 'vegetable' },
    { id: 6, name: 'onion', category: 'vegetable' },
    { id: 7, name: 'garlic', category: 'vegetable' },
    { id: 8, name: 'minced meat', category: 'vegetable' },
    { id: 9, name: 'tomato sauce', category: 'vegetable' },
  ];
  const searchStorage = tool(() => JSON.stringify(storage.map((item) => item.name)), {
    name: 'searchStorage',
    description: 'Can retireve items that are currently stored in my home storage',
  });
  const list: string[] = [];

  const settleGroceries = tool(
    ({ items, additionalItems }: { items: string; additionalItems: string }) => {
      list.push(...(JSON.parse(additionalItems) as string[]));
      const array = JSON.parse(items).map((item) => item.toLowerCase()) as string[];

      const shoppingList = list
        .map((item) => item.toLowerCase())
        .filter((item) => {
          console.log(item, array);
          return !array.includes(item);
        });
      return shoppingList.join(', ');
    },
    {
      name: 'settleGroceries',
      description:
        'Compares recived items from home storage with existing shopping list and returns what needs to be left on the shopping list',
      schema: z.object({
        items: z.string().describe('Items in my home storage passed as array'),
        additionalItems: z
          .string()
          .describe('Additional items to be added to my shopping list passed as array'),
      }),
    }
  );

  const tools = [searchStorage, settleGroceries];

  const graph = createReactAgent({ llm: model, tools });

  const file = await graph.getGraph().drawMermaidPng();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  writeFile('graph.jpg', buffer);

  console.log(
    '\n------------------------------ CHAT TOOLS WITH LANGGRAPH #1 - created tools ------------------------------\n'
  );
  const simpleMessages = {
    messages: [
      new SystemMessage(
        'You are a helpful model with tools that calls only one tool at once. Please do not try multiple tool calls at once. Whenever asked about groceries or adding anythign to list make sure to check home storage content first. Format the list to be checklist and always tell the user how the final list looks like and also tell the users what items from the list were removed because these were found at home storage. Make sure you check home storage to make sure nothing from the list is already at home'
      ),
      new HumanMessage(
        'Taking into consideration contents of my hoem storage please tell me what my shopping list should be, my lsit has tomatoes, apple, broccoli and flour. Please specify what items should be on my final list.'
      ),
    ],
  };
  const simpleResult = await graph.invoke(simpleMessages);
  conversationPrinter(simpleResult.messages);

  console.log(
    '\n------------------------------ CHAT TOOLS WITH LANGGRAPH #2 - external tools ------------------------------\n'
  );
  const agentTools = [new DuckDuckGoSearch({ maxResults: 1 })];
  const agentModel = new ChatWatsonx({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    model: 'mistralai/mistral-large',
    maxTokens: 1000,
  });

  const agentCheckpointer = new MemorySaver();
  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  });

  const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage('Who won 2024 US election')] },
    { configurable: { thread_id: '42' } }
  );

  conversationPrinter(agentFinalState.messages);
};
