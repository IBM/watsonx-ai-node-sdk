import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { config } from 'dotenv';
import { EMBEDDING_MODEL_IBM } from './config.ts';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const model = EMBEDDING_MODEL_IBM;

describe('Regression tests regarding langchain embeddings', () => {
  describe('Positive tests', () => {
    describe('Basic call', () => {
      test('Single embedding with projectId', async () => {
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
      test('Multiple embeddings with projectId', async () => {
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
      test('Single embedding with spaceId', async () => {
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
      test('Multiple embeddings with spaceId', async () => {
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
    describe('Advanced call', () => {
      test('Embedding with all options', async () => {
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
  describe('Negative tests', () => {
    test('Passing wrong model', async () => {
      const embeddings = new WatsonxEmbeddings({
        version,
        projectId,
        serviceUrl,
        model: 'NotExistings',
      });
      await expect(embeddings.embedQuery('Hello world')).rejects.toThrow();
    });
    test('Passing not existing props', async () => {
      expect(
        () =>
          new WatsonxEmbeddings({
            version,
            projectId,
            serviceUrl,
            model: 'NotExistings',
            // @ts-expect-error
            notExisting: 'notExisting',
          })
      ).toThrow();
    });
  });
});
