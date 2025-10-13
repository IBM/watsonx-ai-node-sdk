/* eslint-disable no-await-in-loop */

import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { ToolCall } from '@langchain/core/messages/tool';
import { tool } from '@langchain/core/tools';
import { concat } from '@langchain/core/utils/stream';
import { HumanMessage, AIMessageChunk, AIMessage } from '@langchain/core/messages';
import { config } from 'dotenv';
import { z } from 'zod';
import { models } from './config.ts';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

describe.each(models)('Regression tests regarding langchain chat for model: %s', (model) => {
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
          test('with maxNewTokens', async () => {
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
        });
        describe('Generate', () => {
          test('with maxNewTokens', async () => {
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
          test('with maxNewTokens', async () => {
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
          test('Passing tool to chat model and invoking the tools with stream', async () => {
            const service = new ChatWatsonx({
              model,
              version: '2024-05-31',
              serviceUrl: process.env.WATSONX_AI_SERVICE_URL ?? 'testString',
              projectId: process.env.WATSONX_AI_PROJECT_ID ?? 'testString',
            });
            const addTool = tool(async (input) => Number(input.a) + Number(input.b), {
              name: 'add',
              description: 'Adds a and b.',
              schema: z.object({
                a: z.string(),
                b: z.string(),
              }),
            });

            const multiplyTool = tool(async (input) => Number(input.a) * Number(input.b), {
              name: 'multiply',
              description: 'Multiplies a and b.',
              schema: z.object({
                a: z.string(),
                b: z.string(),
              }),
            });
            const tools = [addTool, multiplyTool];
            const toolsByName = {
              add: addTool,
              multiply: multiplyTool,
            };
            const modelWithTools = service.bindTools(tools);
            const messages = [
              new HumanMessage(
                'You are bad at calculations and need to use calculator at all times. What is 3 * 12? Also, what is 11 + 49?'
              ),
            ];
            const res = await modelWithTools.stream(messages);
            let toolMessage: AIMessageChunk | undefined;
            for await (const chunk of res) {
              toolMessage = toolMessage !== undefined ? concat(toolMessage, chunk) : chunk;
            }
            expect(toolMessage).toBeInstanceOf(AIMessageChunk);
            expect(toolMessage?.tool_calls).toBeDefined();
            toolMessage = toolMessage as AIMessageChunk;
            messages.push(new AIMessage(toolMessage));

            for (const tool_call of toolMessage?.tool_calls as ToolCall[]) {
              const toolCallMessage = await toolsByName[
                tool_call.name as keyof typeof toolsByName
              ].invoke(tool_call);
              messages.push(toolCallMessage);
            }
            const result = await modelWithTools.invoke(messages);
            expect(result).toBeInstanceOf(AIMessage);
          });
        });
      });
    });
  });
  describe('Negative tests', () => {
    test('Passing wrong model', async () => {
      const embeddings = new ChatWatsonx({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
      });
      await expect(embeddings.invoke('Hello world')).rejects.toThrow();
    });
    test('Passing not existing props', async () => {
      const embeddings = new ChatWatsonx({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
        // @ts-ignore
        notExisting: 'notExisting',
      });
      await expect(embeddings.invoke('Hello world')).rejects.toThrow();
    });
  });
});
