/* eslint-disable no-await-in-loop */
import { WatsonxLLM } from '@langchain/community/llms/ibm';
import { config } from 'dotenv';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const model = 'mistralai/mistral-medium-2505';

describe('Regression tests regarding langchain llms', () => {
  describe('Positive tests', () => {
    describe('Basic call', () => {
      describe('with projectId', () => {
        test('Invoke', async () => {
          const llms = new WatsonxLLM({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.invoke('Hello. How are you?');
          expect(typeof result).toBe('string');
        });
        test('Generate', async () => {
          const llms = new WatsonxLLM({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.generate([
            'Hello. How are you?',
            'Bye bye, it was nice to meet you!',
          ]);
          expect(result.generations).toBeInstanceOf(Array);
          expect(result.generations.length).toBe(2);
        });
        test('Stream', async () => {
          const llms = new WatsonxLLM({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.stream('Hello. How are you?');
          for await (const chunk of result) {
            expect(typeof chunk).toBe('string');
          }
        });
      });
      describe('with spaceId', () => {
        test('Invoke', async () => {
          const llms = new WatsonxLLM({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.invoke('Hello. How are you?');
          expect(typeof result).toBe('string');
        });
        test('Generate', async () => {
          const llms = new WatsonxLLM({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.generate([
            'Hello. How are you?',
            'Bye bye, it was nice to meet you!',
          ]);
          expect(result.generations).toBeInstanceOf(Array);
          expect(result.generations.length).toBe(2);
        });
        test('Stream', async () => {
          const llms = new WatsonxLLM({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.stream('Hello. How are you?');
          for await (const chunk of result) {
            expect(typeof chunk).toBe('string');
          }
        });
      });
    });
    describe('Advanced call', () => {
      describe('with projectId', () => {
        describe('Invoke', () => {
          test('with minNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              minNewTokens: 50,
            });
            const result = await llms.invoke('Hello. How are you?');
            expect(result.length).toBeGreaterThan(50);
          });
          test('with maxNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              maxNewTokens: 10,
            });
            const result = await llms.invoke('Hello. How are you?');
            expect(result.length).toBeLessThan(70);
          });
          test('with stop sequence', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              stopSequence: ['Hello'],
              model,
              temperature: 0,
              maxNewTokens: 100,
            });
            const result = await llms.invoke('Print Hello World!');
            expect(result.endsWith('Hello')).toBe(true);
          });
          test('with remaining options', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0.7,
              topK: 1,
              topP: 1,
              repetitionPenalty: 1.1,
              randomSeed: 12345,
              decodingMethod: 'sample',
            });
            const result = await llms.invoke('Hello. How are you?');
            expect(typeof result).toBe('string');
          });
        });
        describe('Generate', () => {
          test('with minNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              minNewTokens: 50,
            });
            const result = await llms.generate(['Hello. How are you?']);
            expect(result.generations[0][0].text.length).toBeGreaterThan(50);
          });
          test('with maxNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              maxNewTokens: 10,
            });
            const result = await llms.generate(['Hello. How are you?']);
            expect(result.generations[0][0].text.length).toBeLessThan(70);
          });
          test('with stop sequence', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0,
              stopSequence: ['Hello'],
              maxNewTokens: 100,
            });
            const result = await llms.generate(['Print hello world!']);
            expect(result.generations[0][0].text.endsWith('Hello')).toBe(true);
          });
          test('with remaining options', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0.7,
              topK: 1,
              topP: 1,
              repetitionPenalty: 1.1,
              randomSeed: 12345,
              decodingMethod: 'sample',
            });
            const result = await llms.generate(['Hello. How are you?']);
            expect(typeof result.generations[0][0].text).toBe('string');
          });
        });
        describe('Stream', () => {
          test('with minNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              minNewTokens: 50,
            });
            const result = await llms.stream('Hello. How are you?');
            let res = '';
            for await (const chunk of result) {
              res += chunk;
            }
            expect(res.length).toBeGreaterThan(50);
          });
          test('with maxNewTokens', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              maxNewTokens: 10,
            });
            const result = await llms.stream('Hello. How are you?');
            let res = '';
            for await (const chunk of result) {
              res += chunk;
            }
            expect(res.length).toBeLessThan(70);
          });
          test('with stop sequence', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0,
              stopSequence: ['Hello'],
              maxNewTokens: 100,
            });
            const result = await llms.stream('Print Hello World!');
            let res = '';
            for await (const chunk of result) {
              res += chunk;
            }
            expect(res.endsWith('Hello')).toBe(true);
          });
          test('with remaining options', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0.7,
              topK: 1,
              topP: 1,
              repetitionPenalty: 1.1,
              randomSeed: 12345,
              decodingMethod: 'sample',
            });
            const result = await llms.stream('Hello. How are you?');
            for await (const chunk of result) {
              expect(typeof chunk).toBe('string');
            }
          });
        });
      });
    });
  });
  describe('Negative tests', () => {
    test('Passing wrong model', async () => {
      const embeddings = new WatsonxLLM({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
      });
      await expect(embeddings.invoke('Hello world')).rejects.toThrow();
    });
    test('Passing not existing props', async () => {
      const embeddings = new WatsonxLLM({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
        // @ts-expect-error
        notExisting: 'notExisting',
      });
      await expect(embeddings.invoke('Hello world')).rejects.toThrow();
    });
  });
});
