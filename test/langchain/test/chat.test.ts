import { ChatWatsonx } from '@langchain/ibm';
import type { ToolCall } from '@langchain/core/messages/tool';
import { ToolMessage } from '@langchain/core/messages/tool';
import type { BaseMessage } from '@langchain/core/messages';
import { HumanMessage, AIMessageChunk, AIMessage, SystemMessage } from '@langchain/core/messages';
import { config } from 'dotenv';
import { z } from 'zod';
import { CHAT_MODELS } from './config.ts';
import { tool } from '@langchain/core/tools';
import { createAgent } from 'langchain';
import { createDeepAgent, StateBackend } from 'deepagents';
import {
  createWeatherTool,
  createTimeTool,
  createGetUserTool,
  createGetOrdersTool,
  streamAndConcatenate,
  extractMessageContent,
  verifyToolCall,
  verifyToolCalls,
  weatherForecast,
} from './helpers.js';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL as string;

describe.each(Object.values(CHAT_MODELS))(
  'Regression tests regarding langchain chat for model: %s',
  (model) => {
    describe('Positive tests', () => {
      describe('Basic call', () => {
        describe('with projectId', () => {
          test('Invoke', async () => {
            const llms = new ChatWatsonx({
              projectId,
              version,
              serviceUrl,
              model,
            });

            const result = await llms.invoke('Hello. How are you?');

            expect(typeof result.content).toBe('string');
          });

          test('Generate', async () => {
            const llms = new ChatWatsonx({
              projectId,
              version,
              serviceUrl,
              model,
            });
            const result = await llms.generate([
              [{ role: 'user', content: 'Hello. How are you?' }],
              [{ role: 'user', content: 'Bye bye, it was nice to meet you!' }],
            ]);

            expect(result.generations).toBeInstanceOf(Array);
            expect(result.generations.length).toBe(2);
          });

          test('Stream', async () => {
            const llms = new ChatWatsonx({
              projectId,
              version,
              serviceUrl,
              model,
            });
            const result = await llms.stream('Hello. How are you?');
            for await (const chunk of result) {
              expect(typeof chunk.content).toBe('string');
            }
          });
        });

        describe('with spaceId', () => {
          test('Invoke', async () => {
            const llms = new ChatWatsonx({
              spaceId,
              version,
              serviceUrl,
              model,
            });
            const result = await llms.invoke('Hello. How are you?');

            expect(typeof result.content).toBe('string');
          });

          test('Generate', async () => {
            const llms = new ChatWatsonx({
              spaceId,
              version,
              serviceUrl,
              model,
            });
            const result = await llms.generate([
              [{ role: 'user', content: 'Hello. How are you?' }],
              [{ role: 'user', content: 'Bye bye, it was nice to meet you!' }],
            ]);

            expect(result.generations).toBeInstanceOf(Array);
            expect(result.generations.length).toBe(2);
          });

          test('Stream', async () => {
            const llms = new ChatWatsonx({
              spaceId,
              version,
              serviceUrl,
              model,
            });
            const result = await llms.stream('Hello. How are you?');
            for await (const chunk of result) {
              expect(typeof chunk.content).toBe('string');
            }
          });
        });
      });
      describe('Advanced call', () => {
        describe('with projectId', () => {
          describe('Invoke', () => {
            test('with maxTokens', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                maxTokens: 10,
              });
              const result = await llms.invoke('Hello. How are you?');

              expect(result.content.length).toBeLessThan(50);
            });

            test('with remaining options', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                temperature: 0.7,
                topP: 1,
              });
              const result = await llms.invoke('Hello. How are you?');

              expect(typeof result.content).toBe('string');
            });

            test('with one tool call - comprehensive verification', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              const weatherTool = createWeatherTool();

              const toolsByName = {
                weather: weatherTool,
              };
              const chatWithTools = chat.bindTools([weatherTool]);
              const messages: BaseMessage[] = [
                new HumanMessage('What will the weather be like in Cracow tomorrow?'),
              ];

              const message = await chatWithTools.invoke(messages);

              expect(message.tool_calls).toBeDefined();
              expect(Array.isArray(message.tool_calls)).toBe(true);
              expect(message.tool_calls).toHaveLength(1);

              const toolCall = message.tool_calls?.[0];

              verifyToolCall(toolCall, 'weather', { city: 'Cracow' });

              // Execute the tool and verify response
              messages.push(new AIMessage(message));
              for (const tc of message.tool_calls as ToolCall[]) {
                const toolResponse =
                  await toolsByName[tc.name as keyof typeof toolsByName].invoke(tc);

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.content).toContain('Cracow');
                expect(toolResponse.content).toContain('cloud');
                expect(toolResponse.tool_call_id).toBe(tc.id);

                messages.push(toolResponse);
              }

              // Final invocation with tool results
              const finalResult = await chatWithTools.invoke(messages);

              expect(finalResult).toBeInstanceOf(AIMessage);
              expect(finalResult.content).toBeDefined();

              const assistantContent = extractMessageContent(finalResult);

              expect(assistantContent).toMatch(/Cracow|Kraków|Krakow/);
              expect(assistantContent.toLowerCase()).toContain('cloud');
            });

            test('with multiple tool calls - comprehensive verification', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              const weatherTool = createWeatherTool((city) => `Weather for ${city}: rainy`);
              const timeTool = createTimeTool();

              const tools = [weatherTool, timeTool];
              const toolsByName = {
                weather: weatherTool,
                time: timeTool,
              };
              const chatWithTools = chat.bindTools(tools);
              const messages: BaseMessage[] = [
                new HumanMessage(
                  'Check the weather in Paris. Also, tell me what is the time in Warsaw.'
                ),
              ];

              const message = await chatWithTools.invoke(messages);

              verifyToolCalls(message.tool_calls as ToolCall[], ['weather', 'time'], 2);

              const toolCalls = message.tool_calls as ToolCall[];

              toolCalls.forEach((tc) => {
                expect(['Paris', 'Warsaw']).toContain(tc.args.city);
              });

              // Execute each tool and verify responses
              messages.push(new AIMessage(message));
              const toolResponses: ToolMessage[] = [];

              for (const toolCall of toolCalls) {
                const toolResponse =
                  await toolsByName[toolCall.name as keyof typeof toolsByName].invoke(toolCall);

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.tool_call_id).toBe(toolCall.id);
                expect(toolResponse.content).toBeDefined();

                if (toolCall.name === 'weather') {
                  expect(toolResponse.content).toContain('Weather for');
                  expect(toolResponse.content).toContain('rainy');
                } else if (toolCall.name === 'time') {
                  expect(toolResponse.content).toContain('Time for');
                  expect(toolResponse.content).toContain('10:30');
                }

                toolResponses.push(toolResponse);
                messages.push(toolResponse);
              }

              // Verify we have responses for all tool calls
              expect(toolResponses.length).toBe(toolCalls.length);

              // Final invocation with all tool results
              const finalResult = await chatWithTools.invoke(messages);

              expect(finalResult).toBeInstanceOf(AIMessage);
              expect(finalResult.content).toBeDefined();

              const assistantContent = extractMessageContent(finalResult);

              expect(assistantContent).toContain('Paris');
              expect(assistantContent).toContain('Warsaw');
            });

            test('calling tool with each response - sequential tool execution', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              // Tool to get user information
              const users: Record<string, any> = {
                john_doe: { id: '123', name: 'John Doe', email: 'john@example.com' },
                jane_smith: { id: '456', name: 'Jane Smith', email: 'jane@example.com' },
              };
              const getUserTool = createGetUserTool(users);

              // Tool to get user's orders
              const orders: Record<string, any[]> = {
                '123': [
                  { order_id: 'ORD-001', product: 'Laptop', status: 'shipped' },
                  { order_id: 'ORD-002', product: 'Mouse', status: 'delivered' },
                ],
                '456': [{ order_id: 'ORD-003', product: 'Keyboard', status: 'processing' }],
              };
              const getOrdersTool = createGetOrdersTool(orders);

              const chatWithTools = chat.bindTools([getUserTool, getOrdersTool]);
              const messages: BaseMessage[] = [
                new SystemMessage(
                  'You are a helpful assistant. Use the provided tools to answer user questions. When you need information from one tool to use another, call them sequentially.'
                ),
                new HumanMessage('Show me john_doe orders.'),
              ];

              // First tool call - should call get_user tool
              const firstResponse = await chatWithTools.invoke(messages);

              expect(firstResponse.tool_calls).toBeDefined();
              expect(firstResponse.tool_calls?.length).toBeGreaterThan(0);

              const firstToolCall = firstResponse.tool_calls?.[0] as ToolCall;

              expect(firstToolCall.name).toBe('get_user');
              expect(firstToolCall.args.username).toBe('john_doe');

              messages.push(new AIMessage(firstResponse));

              // Execute first tool call
              for (const toolCall of firstResponse.tool_calls as ToolCall[]) {
                let toolResponse: ToolMessage;
                if (toolCall.name === 'get_user') {
                  toolResponse = await getUserTool.invoke(toolCall);
                } else {
                  toolResponse = await getOrdersTool.invoke(toolCall);
                }

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.content).toBeDefined();

                messages.push(toolResponse);
              }

              // Second invocation - should call multiply tool with the result
              const secondResponse = await chatWithTools.invoke(messages);

              if (secondResponse.tool_calls && secondResponse.tool_calls.length > 0) {
                const secondToolCall = secondResponse.tool_calls[0] as ToolCall;

                expect(secondToolCall.name).toBe('get_orders');
                expect(secondToolCall.args.user_id).toBe('123');

                messages.push(new AIMessage(secondResponse));

                // Execute second tool call
                for (const toolCall of secondResponse.tool_calls as ToolCall[]) {
                  let toolResponse: ToolMessage;
                  if (toolCall.name === 'get_user') {
                    toolResponse = await getUserTool.invoke(toolCall);
                  } else {
                    toolResponse = await getOrdersTool.invoke(toolCall);
                  }

                  expect(toolResponse).toBeInstanceOf(ToolMessage);
                  expect(toolResponse.content).toBeDefined();

                  messages.push(toolResponse);
                }

                // Final response - should summarize the orders
                const finalResponse = await chatWithTools.invoke(messages);

                expect(finalResponse).toBeInstanceOf(AIMessage);
                expect(finalResponse.content).toBeDefined();

                const finalContent =
                  typeof finalResponse.content === 'string'
                    ? finalResponse.content
                    : JSON.stringify(finalResponse.content);

                expect(finalContent.toLowerCase()).toMatch(/laptop|mouse|order/);
              } else {
                // If no more tool calls, this is the final response
                expect(secondResponse).toBeInstanceOf(AIMessage);
                expect(secondResponse.content).toBeDefined();
              }
            });

            test('with structured output using zod', async () => {
              const service = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });
              const joke = z.object({
                setup: z.string().describe('The setup of the joke'),
                punchline: z.string().describe('The punchline to the joke'),
                rating: z.number().optional().describe('How funny the joke is, from 1 to 10'),
              });

              const structuredLlm = service.withStructuredOutput(joke);

              const res = await structuredLlm.invoke('Tell me a joke about cats');

              expect('setup' in res).toBe(true);
              expect('punchline' in res).toBe(true);
            });
          });

          describe('Generate', () => {
            test('with maxTokens', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                maxTokens: 10,
              });
              const result = await llms.generate([
                [{ role: 'user', content: 'Hello. How are you?' }],
                [{ role: 'user', content: 'Bye bye, it was nice to meet you!' }],
              ]);

              expect(result.generations[0][0].text.length).toBeLessThan(50);
            });

            test('with remaining options', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                temperature: 0.7,
                topP: 1,
              });
              const result = await llms.generate([
                [{ role: 'user', content: 'Hello. How are you?' }],
                [{ role: 'user', content: 'Bye bye, it was nice to meet you!' }],
              ]);

              expect(typeof result.generations[0][0].text).toBe('string');
            });
          });

          describe('Stream', () => {
            test('with maxTokens', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                maxTokens: 10,
              });
              const result = await llms.stream('Hello. How are you?');
              let res = '';
              for await (const chunk of result) {
                res += chunk.content;
              }

              expect(res.length).toBeLessThan(50);
            });

            test('with n>1', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                n: 2,
              });
              const stream = await llms.stream('Hello. How are you?');
              for await (const chunk of stream) {
                expect(typeof chunk.content).toBe('string');
              }
            });

            test('with remaining options', async () => {
              const llms = new ChatWatsonx({
                projectId,
                version,
                serviceUrl,
                model,
                temperature: 0.7,
                topP: 1,
              });
              const result = await llms.stream('Hello. How are you?');
              for await (const chunk of result) {
                expect(typeof chunk.content).toBe('string');
              }
            });

            test('with one tool call', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              const weatherTool = createWeatherTool();
              const chatWithTools = chat.bindTools([weatherTool]);
              const messages = [
                {
                  type: 'system',
                  content:
                    'You are a helpful AI weather assistant and have correct tools to forecast weather',
                },
                {
                  type: 'user',
                  content:
                    'Use the weather tool to check the weather in Cracow. Do not answer from memory.',
                },
              ];

              const result = await chatWithTools.stream(messages);
              const message = await streamAndConcatenate(result);

              expect(message?.tool_calls).toBeDefined();
              expect(message?.tool_calls).toHaveLength(1);
              verifyToolCall(message?.tool_calls?.[0], 'weather', { city: 'Cracow' });

              const assistantContent = extractMessageContent(message);

              expect(assistantContent).not.toContain('It is rainy in Cracow');
            });

            test('Passing tool to chat model and invoking the tools with stream', async () => {
              const service = new ChatWatsonx({
                model,
                version: '2024-05-31',
                serviceUrl: process.env.WATSONX_AI_SERVICE_URL ?? 'testString',
                projectId: process.env.WATSONX_AI_PROJECT_ID ?? 'testString',
              });
              const weatherTool = createWeatherTool();
              const timeTool = createTimeTool();
              const tools = [weatherTool, timeTool];
              const toolsByName = {
                weather: weatherTool,
                time: timeTool,
              };
              const modelWithTools = service.bindTools(tools);
              const messages: BaseMessage[] = [
                new HumanMessage('What is the weather in Paris? Also, what time is it in London?'),
              ];
              const res = await modelWithTools.stream(messages);
              let toolMessage = await streamAndConcatenate(res);

              expect(toolMessage).toBeInstanceOf(AIMessageChunk);
              expect(toolMessage?.tool_calls).toBeDefined();

              toolMessage = toolMessage as AIMessageChunk;
              messages.push(new AIMessage(toolMessage));

              for (const tool_call of toolMessage?.tool_calls as ToolCall[]) {
                const toolCallMessage =
                  await toolsByName[tool_call.name as keyof typeof toolsByName].invoke(tool_call);
                messages.push(toolCallMessage);
              }
              const result = await modelWithTools.invoke(messages);

              expect(result).toBeInstanceOf(AIMessage);
            });

            test('with structured output using zod and stream', async () => {
              const service = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });
              const joke = z.object({
                setup: z.string().describe('The setup of the joke'),
                punchline: z.string().describe('The punchline to the joke'),
                rating: z.number().optional().describe('How funny the joke is, from 1 to 10'),
              });

              const structuredLlm = service.withStructuredOutput(joke);
              const res = await structuredLlm.stream('Tell me a joke about cats');
              let object = {};
              for await (const chunk of res) {
                expect(typeof chunk).toBe('object');

                object = chunk;
              }

              expect('setup' in object).toBe(true);
              expect('punchline' in object).toBe(true);
            });

            test('with one tool call - comprehensive streaming verification', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              const weatherTool = createWeatherTool(weatherForecast);

              const toolsByName = {
                weather: weatherTool,
              };
              const chatWithTools = chat.bindTools([weatherTool]);
              const messages: BaseMessage[] = [
                new HumanMessage('What will the weather be like in Cracow tomorrow?'),
              ];

              // First invocation - stream and collect tool_calls
              const stream = await chatWithTools.stream(messages);
              const message = await streamAndConcatenate(stream);

              // Verify tool_calls structure from streamed response
              expect(message).toBeDefined();
              expect(message?.tool_calls).toBeDefined();
              expect(Array.isArray(message?.tool_calls)).toBe(true);
              expect(message?.tool_calls).toHaveLength(1);

              // Verify single tool_call properties
              const toolCall = message?.tool_calls?.[0];

              verifyToolCall(toolCall, 'weather', { city: 'Cracow' });

              // Execute the tool and verify response
              messages.push(new AIMessage(message as AIMessageChunk));
              for (const tc of (message?.tool_calls || []) as ToolCall[]) {
                const toolResponse =
                  await toolsByName[tc.name as keyof typeof toolsByName].invoke(tc);

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.content).toBe(weatherForecast('Cracow'));
                expect(toolResponse.tool_call_id).toBe(tc.id);

                messages.push(toolResponse);
              }

              // Final invocation with tool results - stream response
              const finalStream = await chatWithTools.stream(messages);
              const finalMessage = await streamAndConcatenate(finalStream);

              expect(finalMessage).toBeDefined();
              expect(finalMessage?.content).toBeDefined();

              const assistantContent = extractMessageContent(finalMessage);

              expect(assistantContent).toMatch(/Cracow|Kraków|Krakow/);
              expect(assistantContent.toLowerCase()).toContain('cloud');
            });

            test('with multiple tool calls - comprehensive streaming verification', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              const weatherTool = createWeatherTool(weatherForecast);
              const timeTool = createTimeTool();

              const tools = [weatherTool, timeTool];
              const toolsByName = {
                weather: weatherTool,
                time: timeTool,
              };
              const chatWithTools = chat.bindTools(tools);
              const messages: BaseMessage[] = [
                new HumanMessage(
                  'What will the weather be like in Cracow tomorrow? Also what is the time there now?'
                ),
              ];

              // First invocation - stream and collect multiple tool_calls
              const stream = await chatWithTools.stream(messages);
              const message = await streamAndConcatenate(stream);

              // Verify multiple tool_calls structure from streamed response
              expect(message).toBeDefined();
              verifyToolCalls(message?.tool_calls as ToolCall[], ['weather', 'time'], 2);

              // Verify each tool_call has proper structure
              const toolCalls = (message?.tool_calls || []) as ToolCall[];

              toolCalls.forEach((tc) => {
                expect(tc.args.city).toBe('Cracow');
              });

              // Execute each tool and verify responses
              messages.push(new AIMessage(message as AIMessageChunk));
              const toolResponses: ToolMessage[] = [];

              for (const toolCall of toolCalls) {
                const toolResponse =
                  await toolsByName[toolCall.name as keyof typeof toolsByName].invoke(toolCall);

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.tool_call_id).toBe(toolCall.id);
                expect(toolResponse.content).toBeDefined();

                if (toolCall.name === 'weather') {
                  expect(toolResponse.content).toBe(weatherForecast('Cracow'));
                } else if (toolCall.name === 'time') {
                  expect(toolResponse.content).toContain('Time for');
                  expect(toolResponse.content).toContain('10:30');
                }

                toolResponses.push(toolResponse);
                messages.push(toolResponse);
              }

              // Verify we have responses for all tool calls
              expect(toolResponses.length).toBe(toolCalls.length);

              // Final invocation with all tool results - stream response
              const finalStream = await chatWithTools.stream(messages);
              const finalMessage = await streamAndConcatenate(finalStream);

              expect(finalMessage).toBeDefined();
              expect(finalMessage?.content).toBeDefined();

              const assistantContent = extractMessageContent(finalMessage);

              expect(assistantContent).toMatch(/Cracow|Kraków|Krakow/);
            });

            test('calling tool with each response - sequential streaming execution', async () => {
              const chat = new ChatWatsonx({
                model,
                version,
                serviceUrl,
                projectId,
              });

              // Tool to get user information
              const getUserTool = tool(
                async ({ username }) => {
                  // Simulate database lookup
                  const users: Record<string, any> = {
                    john_doe: { id: '123', name: 'John Doe', email: 'john@example.com' },
                    jane_smith: { id: '456', name: 'Jane Smith', email: 'jane@example.com' },
                  };
                  const user = users[username];
                  return user ? JSON.stringify(user) : 'User not found';
                },
                {
                  name: 'get_user',
                  description: 'Retrieve user information by username',
                  schema: z.object({
                    username: z.string().describe('The username to look up'),
                  }),
                }
              );

              // Tool to get user's orders
              const getOrdersTool = tool(
                async ({ user_id }) => {
                  // Simulate order lookup
                  const orders: Record<string, any[]> = {
                    '123': [
                      { order_id: 'ORD-001', product: 'Laptop', status: 'shipped' },
                      { order_id: 'ORD-002', product: 'Mouse', status: 'delivered' },
                    ],
                    '456': [{ order_id: 'ORD-003', product: 'Keyboard', status: 'processing' }],
                  };
                  const userOrders = orders[user_id];
                  return userOrders ? JSON.stringify(userOrders) : 'No orders found';
                },
                {
                  name: 'get_orders',
                  description: 'Retrieve orders for a specific user by their user ID',
                  schema: z.object({
                    user_id: z.string().describe('The user ID to get orders for'),
                  }),
                }
              );

              const chatWithTools = chat.bindTools([getUserTool, getOrdersTool]);
              const messages: BaseMessage[] = [
                new SystemMessage(
                  'You are a helpful assistant. Use the provided tools to answer user questions. When you need information from one tool to use another, call them sequentially.'
                ),
                new HumanMessage('Find the user john_doe and then show me their orders.'),
              ];

              // First tool call - should call get_user tool
              const firstStream = await chatWithTools.stream(messages);
              let firstResponse: AIMessageChunk | undefined = undefined;

              for await (const chunk of firstStream) {
                firstResponse = firstResponse ? firstResponse.concat(chunk) : chunk;
              }

              expect(firstResponse?.tool_calls).toBeDefined();
              expect(firstResponse?.tool_calls?.length).toBeGreaterThan(0);

              const firstToolCall = firstResponse?.tool_calls?.[0] as ToolCall;

              expect(firstToolCall.name).toBe('get_user');
              expect(firstToolCall.args.username).toBe('john_doe');

              messages.push(new AIMessage(firstResponse as AIMessageChunk));

              // Execute first tool call
              for (const toolCall of firstResponse?.tool_calls as ToolCall[]) {
                let toolResponse: ToolMessage;
                if (toolCall.name === 'get_user') {
                  toolResponse = await getUserTool.invoke(toolCall);
                } else {
                  toolResponse = await getOrdersTool.invoke(toolCall);
                }

                expect(toolResponse).toBeInstanceOf(ToolMessage);
                expect(toolResponse.content).toBeDefined();

                messages.push(toolResponse);
              }

              // Second invocation - should call get_orders with the result
              const secondStream = await chatWithTools.stream(messages);
              let secondResponse: AIMessageChunk | undefined = undefined;

              for await (const chunk of secondStream) {
                secondResponse = secondResponse ? secondResponse.concat(chunk) : chunk;
              }

              expect(secondResponse).toBeDefined();

              if (secondResponse?.tool_calls && secondResponse.tool_calls.length > 0) {
                const secondToolCall = secondResponse.tool_calls[0] as ToolCall;

                expect(secondToolCall.name).toBe('get_orders');
                expect(secondToolCall.args.user_id).toBe('123');

                messages.push(new AIMessage(secondResponse));

                // Execute second tool call
                for (const toolCall of secondResponse.tool_calls as ToolCall[]) {
                  let toolResponse: ToolMessage;
                  if (toolCall.name === 'get_user') {
                    toolResponse = await getUserTool.invoke(toolCall);
                  } else {
                    toolResponse = await getOrdersTool.invoke(toolCall);
                  }

                  expect(toolResponse).toBeInstanceOf(ToolMessage);
                  expect(toolResponse.content).toBeDefined();

                  messages.push(toolResponse);
                }

                // Final response - should summarize the orders
                const finalStream = await chatWithTools.stream(messages);
                let finalResponse: AIMessageChunk | undefined = undefined;

                for await (const chunk of finalStream) {
                  finalResponse = finalResponse ? finalResponse.concat(chunk) : chunk;
                }

                expect(finalResponse).toBeDefined();
                expect(finalResponse?.content).toBeDefined();
              }
            });
          });
        });
      });

      describe('Agentic usage', () => {
        test('with single tool invocation', async () => {
          const chatModel = new ChatWatsonx({
            version,
            projectId,
            serviceUrl,
            model,
          });

          const weatherTool = createWeatherTool();

          const tools = [weatherTool];
          const agent = createAgent({
            model: chatModel,
            tools,
          });

          const messages = {
            messages: [new HumanMessage('What is the weather in Paris?')],
          };
          const result = await agent.invoke(messages);

          expect(result.messages).toBeDefined();
          expect(result.messages.length).toBeGreaterThan(0);

          const lastMessage = result.messages[result.messages.length - 1];

          expect(lastMessage.content).toBeDefined();
        });
        test('with inventory management tools (sequential tool_call invocation)', async () => {
          const chatModel = new ChatWatsonx({
            version,
            projectId,
            serviceUrl,
            model,
          });

          const storage = [
            { id: 1, name: 'Apple', category: 'fruit', quantity: 10 },
            { id: 2, name: 'Carrot', category: 'vegetable', quantity: 5 },
            { id: 3, name: 'Banana', category: 'fruit', quantity: 8 },
            { id: 4, name: 'Broccoli', category: 'vegetable', quantity: 3 },
          ];

          const searchInventory = tool(
            async () => {
              return JSON.stringify(
                storage.map((item) => ({
                  name: item.name,
                  category: item.category,
                  quantity: item.quantity,
                }))
              );
            },
            {
              name: 'searchInventory',
              description: 'Retrieves all items currently in inventory with quantities',
            }
          );

          const checkStock = tool(
            async ({ itemName }: { itemName: string }) => {
              const item = storage.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
              return item
                ? `${item.name}: ${item.quantity} units available`
                : 'Item not found in inventory';
            },
            {
              name: 'checkStock',
              description: 'Check stock level for a specific item',
              schema: z.object({
                itemName: z.string().describe('The name of the item to check'),
              }),
            }
          );

          const tools = [searchInventory, checkStock];
          const agent = createAgent({
            model: chatModel,
            tools,
          });

          const messages = {
            messages: [
              new SystemMessage(
                'You are a helpful assistant. Use the provided tools to answer user questions. When you need information from one tool to use another, call them sequentially.'
              ),
              new HumanMessage('What items are in the inventory? Show me the list.'),
            ],
          };
          const result = await agent.invoke(messages);

          expect(result.messages).toBeDefined();
          expect(result.messages.length).toBeGreaterThan(0);

          const lastMessage = result.messages[result.messages.length - 1];

          expect(lastMessage.content).toBeDefined();
        });

        test('with user profile and preferences tools (sequential tool_call invocation)', async () => {
          const chatModel = new ChatWatsonx({
            version,
            projectId,
            serviceUrl,
            model,
          });

          const userProfiles: Record<string, { name: string; preferences: string[] }> = {
            user1: { name: 'John', preferences: ['coffee', 'reading', 'hiking'] },
            user2: { name: 'Alice', preferences: ['tea', 'painting', 'yoga'] },
          };

          const getUserProfile = tool(
            async ({ userId }: { userId: string }) => {
              const profile = userProfiles[userId];
              return profile ? JSON.stringify(profile) : 'User profile not found';
            },
            {
              name: 'getUserProfile',
              description: 'Get user profile information including name and preferences',
              schema: z.object({
                userId: z.string().describe('The user ID'),
              }),
            }
          );

          const recommendActivity = tool(
            async ({ preferences }: { preferences: string }) => {
              const prefs = JSON.parse(preferences) as string[];
              const recommendations: Record<string, string> = {
                coffee: 'Visit the new café downtown',
                tea: 'Try the herbal tea collection at the tea house',
                reading: 'Check out the latest bestseller at the bookstore',
                painting: 'Join the art workshop this weekend',
                hiking: 'Explore the mountain trail',
                yoga: 'Attend the morning yoga session',
              };
              return prefs
                .map((pref) => recommendations[pref] || 'No recommendation available')
                .join(', ');
            },
            {
              name: 'recommendActivity',
              description: 'Recommend activities based on user preferences',
              schema: z.object({
                preferences: z.string().describe('User preferences as JSON array of strings'),
              }),
            }
          );

          const tools = [getUserProfile, recommendActivity];
          const agent = createAgent({
            model: chatModel,
            tools,
          });

          const messages = {
            messages: [
              new SystemMessage(
                'You are a helpful assistant. Use the provided tools to answer user questions. When you need information from one tool to use another, call them sequentially.'
              ),
              new HumanMessage('Propose acitivities for user1'),
            ],
          };
          const result = await agent.invoke(messages);

          expect(result.messages).toBeDefined();
          expect(result.messages.length).toBeGreaterThan(0);

          const lastMessage = result.messages[result.messages.length - 1];

          expect(lastMessage.content).toBeDefined();
        });

        test('with weather and location tools at once (verify usage of tools)', async () => {
          const chatModel = new ChatWatsonx({
            version,
            projectId,
            serviceUrl,
            model,
          });

          const weatherTool = createWeatherTool();
          const timeTool = createTimeTool((city: string) => {
            const timeData: Record<string, string> = {
              'New York': '10:30 AM EST',
              Cracow: '4:30 PM CET',
              London: '3:30 PM GMT',
              Paris: '4:30 PM CET',
            };
            return timeData[city] || 'Time data not available';
          });

          const tools = [weatherTool, timeTool];
          const agent = createAgent({
            model: chatModel,
            tools,
          });

          const messages = {
            messages: [
              new HumanMessage('What is the weather in Cracow and what time is it in London?'),
            ],
          };
          const result = await agent.invoke(messages);

          expect(result.messages).toBeDefined();
          expect(result.messages.length).toBeGreaterThan(0);

          // Check that two tool calls were made
          const toolMessages = result.messages.filter((msg) => msg._getType() === 'tool');
          expect(toolMessages.length).toBeGreaterThanOrEqual(2);

          const lastMessage = result.messages[result.messages.length - 1];

          expect(lastMessage.content).toBeDefined();
        });

        describe('with createDeepAgent', () => {
          test('Create deep agent with StateBackend', () => {
            const llm = new ChatWatsonx({
              model,
              serviceUrl,
              projectId,
              version,
            });

            const agent = createDeepAgent({
              model: llm,
              systemPrompt: 'You are a helpful coding assistant.',
              backend: new StateBackend(),
            });

            expect(agent).toBeDefined();
            expect(typeof agent.stream).toBe('function');
          });

          test('Deep agent can process simple message via subagents', async () => {
            const llm = new ChatWatsonx({
              model,
              serviceUrl,
              projectId,
              version,
            });

            const greetingsAgent = {
              name: 'greeting-responder',
              description: 'Respond to greetings',
              systemPrompt: 'You are a greeting responder. Respond to greetings nicely',
            };

            const agent = createDeepAgent({
              model: llm,
              systemPrompt: 'You are a multi purpose agent',
              subagents: [greetingsAgent],
              backend: new StateBackend(),
            });

            const messages = [
              {
                role: 'user',
                content: 'Say hello!',
              },
            ];

            const result = await agent.stream({ messages });
            expect(result).toBeDefined();

            let hasContent = false;

            for await (const chunk of result) {
              if ('tools' in chunk || 'model_request' in chunk) {
                hasContent = true;
              }
            }
            expect(hasContent).toBe(true);
          }, 30000);

          test('Deep agent streams with tools messages', async () => {
            const llm = new ChatWatsonx({
              model,
              serviceUrl,
              projectId,
              version,
            });

            const agent = createDeepAgent({
              model: llm,
              systemPrompt: 'You are a coding assistant.',
              backend: new StateBackend(),
            });

            const messages = [
              {
                role: 'user',
                content: 'Create a simple hello world function',
              },
            ];

            const result = await agent.stream({ messages });
            const chunks = [];

            for await (const chunk of result) {
              chunks.push(chunk);
              if ('tools' in chunk) {
                expect(chunk.tools).toBeDefined();
              } else if ('model_request' in chunk) {
                expect(chunk.model_request).toBeDefined();
              }
            }

            expect(chunks.length).toBeGreaterThan(0);
          }, 30000);
        });
      });
    });

    describe('Negative tests', () => {
      test('Passing wrong model', async () => {
        const chat = new ChatWatsonx({
          version,
          projectId,
          serviceUrl,
          model: 'NotExistings',
        });

        await expect(chat.invoke('Hello world')).rejects.toThrow();
      });

      test('Passing not existing props', async () => {
        expect(
          () =>
            new ChatWatsonx({
              version,
              projectId,
              serviceUrl,
              model: 'NotExistings',
              notExisting: 'notExisting',
            } as any)
        ).toThrow();
      });
    });
  }
);
