/**
 * The following example flow:
 * - Retrievs tools with toolkit
 * - Adds tools to chat
 * - Infere chat to use tools
 */
/* eslint-disable no-restricted-syntax */

import {
  convertUtilityToolToWatsonxTool,
  convertWatsonxToolCallToUtilityToolCall,
  WatsonXAI,
} from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

const modelName = 'ibm/granite-3-2-8b-instruct';
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

const twoToolAgent = async (input: string) => {
  // Service instance
  const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl,
  });
  const googleUtilityTool = await watsonxAIService.getUtilityAgentTool({
    toolId: 'GoogleSearch',
  });

  const weatherUtilityTool = await watsonxAIService.getUtilityAgentTool({ toolId: 'Weather' });
  const tools = [googleUtilityTool.result, weatherUtilityTool.result];
  const chatTools = tools.map((item) => convertUtilityToolToWatsonxTool(item));
  console.log(chatTools.map((item) => item.function?.parameters));

  const messages: WatsonXAI.TextChatMessages[] = [{ role: 'user', content: input }];
  const textUtilityChat = await watsonxAIService.textChat({
    messages,
    tools: chatTools,
    projectId,
    modelId: modelName,
  });

  if (textUtilityChat.result.choices?.[0]?.message) {
    messages.push(textUtilityChat.result.choices?.[0]?.message);
  }

  const toolCalled = textUtilityChat.result.choices[0].message?.tool_calls?.[0];
  console.log(toolCalled);
  if (!toolCalled) {
    console.log(textUtilityChat.result.choices[0]?.message?.content);
    return;
  }
  const utilityToolCall = convertWatsonxToolCallToUtilityToolCall(toolCalled);

  const toolRun = await watsonxAIService.runUtilityAgentToolByName({
    toolId: toolCalled?.function.name as string,
    wxUtilityAgentToolsRunRequest: utilityToolCall,
  });

  const toolRunResult = toolRun.result.output;
  messages.push({
    role: 'tool',
    tool_call_id: toolCalled?.id as string,
    content: toolRunResult,
  });
  const textChat = await watsonxAIService.textChat({
    messages,
    tools: chatTools,
    projectId,
    modelId: modelName,
  });
  console.log(messages);
  console.log(textChat.result.choices?.[0].message?.content);
};

await twoToolAgent(
  'I am going to Krakow tomorrow for few days and I am not sure what jacket to pack, could you help me?'
);
await twoToolAgent('Who will organize 2026 World Cup?');
