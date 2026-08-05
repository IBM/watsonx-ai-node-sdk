import { WatsonxLLM } from '@langchain/ibm';
import { config } from 'dotenv';
import { CHAT_MODELS } from './config.ts';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL as string;
const model = CHAT_MODELS.IBM;

describe('LangChain LLMs', () => {
  describe('Positive', () => {
    describe('Basic', () => {
      describe('with projectId', () => {
        test('invoke with project id', async () => {
          const llms = new WatsonxLLM({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.invoke('Hello. How are you?');

          expect(typeof result).toBe('string');
        });

        test('generate with project id', async () => {
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

        test('stream with project id', async () => {
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
        test('invoke with space id', async () => {
          const llms = new WatsonxLLM({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const result = await llms.invoke('Hello. How are you?');

          expect(typeof result).toBe('string');
        });

        test('generate with space id', async () => {
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

        test('stream with space id', async () => {
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

    describe('Advanced', () => {
      describe('with projectId', () => {
        describe('Invoke', () => {
          test('invoke with min new tokens', async () => {
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

          test('invoke with max new tokens', async () => {
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

          test('invoke with stop sequence', async () => {
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

          test('invoke with remaining options', async () => {
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
          test('generate with min new tokens', async () => {
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

          test('generate with max new tokens', async () => {
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

          test('generate with stop sequence', async () => {
            const llms = new WatsonxLLM({
              projectId,
              version,
              serviceUrl,
              model,
              temperature: 0,
              stopSequence: ['hello'],
              maxNewTokens: 100,
            });
            const result = await llms.generate(['Console log "hello world" in javascript']);

            expect(result.generations[0][0].text.endsWith('hello')).toBe(true);
          });

          test('generate with remaining options', async () => {
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
          test('stream with min new tokens', async () => {
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

          test('stream with max new tokens', async () => {
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

          test('stream with stop sequence', async () => {
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

          test('stream with remaining options', async () => {
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

  describe('Negative', () => {
    test('passing wrong model', async () => {
      const embeddings = new WatsonxLLM({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
      });

      await expect(embeddings.invoke('Hello world')).rejects.toThrow();
    });

    test('passing not existing props', async () => {
      expect(
        () =>
          new WatsonxLLM({
            version,
            projectId,
            serviceUrl,
            model: 'NotExistings',
            // @ts-expect-error intentionally passing not existing props
            notExisting: 'notExisting',
          })
      ).toThrow();
    });
  });
});
