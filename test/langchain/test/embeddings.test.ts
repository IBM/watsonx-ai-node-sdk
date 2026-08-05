import { WatsonxEmbeddings } from '@langchain/ibm';
import { config } from 'dotenv';
import { EMBEDDING_MODEL_IBM } from './config.ts';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL as string;
const model = EMBEDDING_MODEL_IBM;

describe('LangChain Embeddings', () => {
  describe('Positive', () => {
    describe('Basic', () => {
      test('single embedding with project id', async () => {
        const embeddings = new WatsonxEmbeddings({
          version,
          projectId,
          serviceUrl,
          model,
        });
        const result = await embeddings.embedQuery('Hello world');

        expect(result).toBeInstanceOf(Array);
        expect(typeof result[0]).toBe('number');
      });

      test('multiple embeddings with project id', async () => {
        const embeddings = new WatsonxEmbeddings({
          version,
          projectId,
          serviceUrl,
          model,
        });
        const result = await embeddings.embedDocuments(['Hello', 'world']);

        expect(result).toBeInstanceOf(Array);
        expect(typeof result[0][0]).toBe('number');
      });

      test('single embedding with space id', async () => {
        const embeddings = new WatsonxEmbeddings({
          version,
          spaceId,
          serviceUrl,
          model,
        });
        const result = await embeddings.embedQuery('Hello world');

        expect(result).toBeInstanceOf(Array);
        expect(typeof result[0]).toBe('number');
      });

      test('multiple embeddings with space id', async () => {
        const embeddings = new WatsonxEmbeddings({
          version,
          spaceId,
          serviceUrl,
          model,
        });
        const result = await embeddings.embedDocuments(['Hello', 'world']);

        expect(result).toBeInstanceOf(Array);
        expect(typeof result[0][0]).toBe('number');
      });
    });

    describe('Advanced', () => {
      test('embedding with all options', async () => {
        const embeddings = new WatsonxEmbeddings({
          version,
          projectId,
          serviceUrl,
          truncateInputTokens: 1,
          model,
        });
        const result = await embeddings.embedDocuments(['Hello', 'world']);

        expect(result).toBeInstanceOf(Array);
        expect(typeof result[0][0]).toBe('number');
      });
    });
  });

  describe('Negative', () => {
    test('passing wrong model', async () => {
      const embeddings = new WatsonxEmbeddings({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
      });

      await expect(embeddings.embedQuery('Hello world')).rejects.toThrow();
    });

    test('passing not existing props', async () => {
      expect(
        () =>
          new WatsonxEmbeddings({
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
