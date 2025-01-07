/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { config } from 'dotenv';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const models = ['meta-llama/llama-3-1-70b-instruct'];
models.forEach((model) => {
  describe(`Regression tests regarding langchain chat for model: ${model}`, () => {
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
});
