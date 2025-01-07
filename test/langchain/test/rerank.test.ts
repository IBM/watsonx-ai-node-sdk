import { WatsonxRerank } from '@langchain/community/document_compressors/ibm';
import { Document } from '@langchain/core/documents';
import { config } from 'dotenv';

config({ path: '../../credentials/watsonx_ai_ml_vml_v1.env' });
const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = process.env.WATSONX_AI_SPACE_ID;
const version = '2024-05-31';
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const model = 'cross-encoder/ms-marco-minilm-l-12-v2';
const query = 'What is the capital of the United States?';
const docs = [
  new Document({
    pageContent:
      'Carson City is the capital city of the American state of Nevada. At the 2010 United States Census, Carson City had a population of 55,274.',
  }),
  new Document({
    pageContent:
      'The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean that are a political division controlled by the United States. Its capital is Saipan.',
  }),
  new Document({
    pageContent:
      'Charlotte Amalie is the capital and largest city of the United States Virgin Islands. It has about 20,000 people. The city is on the island of Saint Thomas.',
  }),
  new Document({
    pageContent:
      'Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district. The President of the USA and many major national government offices are in the territory. This makes it the political center of the United States of America.',
  }),
  new Document({
    pageContent:
      'Capital punishment (the death penalty) has existed in the United States since before the United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states. The federal government (including the United States military) also uses capital punishment.',
  }),
];
describe('Regression tests regarding langchain llms', () => {
  describe('Positive tests', () => {
    describe('Basic call', () => {
      describe('with projectId', () => {
        test('compressDocuments', async () => {
          const watsonxRerank = new WatsonxRerank({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const results = await watsonxRerank.compressDocuments(docs, query);
          console.log(results);
          results.forEach((result) => {
            expect(typeof result.metadata.relevanceScore).toBe('number');
            expect(typeof result.pageContent).toBe('string');
          });
        });
        test('rerank', async () => {
          const watsonxRerank = new WatsonxRerank({
            projectId,
            version,
            serviceUrl,
            model,
          });
          const results = await watsonxRerank.rerank(docs, query);
          console.log(results);
          results.forEach((result) => {
            expect(typeof result.relevanceScore).toBe('number');
            expect(typeof result.index).toBe('number');
          });
        });
      });
      describe('with spaceId', () => {
        test('compressDocuments', async () => {
          const watsonxRerank = new WatsonxRerank({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const results = await watsonxRerank.compressDocuments(docs, query);
          console.log(results);
          results.forEach((result) => {
            expect(typeof result.metadata.relevanceScore).toBe('number');
            expect(typeof result.pageContent).toBe('string');
          });
        });
        test('rerank', async () => {
          const watsonxRerank = new WatsonxRerank({
            spaceId,
            version,
            serviceUrl,
            model,
          });
          const results = await watsonxRerank.rerank(docs, query);
          console.log(results);
          results.forEach((result) => {
            expect(typeof result.relevanceScore).toBe('number');
            expect(typeof result.index).toBe('number');
          });
        });
      });
    });
    describe('Advanced call', () => {
      describe('with projectId', () => {
        test('rerank truncated tokens', async () => {
          const watsonxRerank = new WatsonxRerank({
            projectId,
            version,
            serviceUrl,
            model,
            truncateInputTokens: 512,
          });
          const longerDocs = docs.map((item) => ({
            ...item,
            pageContent: item.pageContent.repeat(20),
          }));
          const results = await watsonxRerank.rerank(longerDocs, query);
          results.forEach((result) => {
            expect(typeof result.relevanceScore).toBe('number');
            expect(typeof result.index).toBe('number');
          });
        });
        test('rerank return options', async () => {
          const watsonxRerank = new WatsonxRerank({
            projectId,
            version,
            serviceUrl,
            model,
            returnOptions: {
              inputs: true,
              topN: 2,
            },
          });

          const results = await watsonxRerank.rerank(docs, query);
          expect(results).toHaveLength(2);
          results.forEach((result) => {
            expect(typeof result.relevanceScore).toBe('number');
            expect(typeof result.index).toBe('number');
            expect(typeof result.input).toBeDefined();
          });
        });
      });
    });
  });
  describe('Negative tests', () => {
    test('Input content too long and not truncated with rerank', async () => {
      const watsonxRerank = new WatsonxRerank({
        projectId,
        version,
        serviceUrl,
        model,
      });
      const longerDocs = docs.map((item) => ({
        ...item,
        pageContent: item.pageContent.repeat(20),
      }));
      await expect(watsonxRerank.rerank(longerDocs, query)).rejects.toThrow();
    });
    test('Input content too long and not truncated with compressDocuments', async () => {
      const watsonxRerank = new WatsonxRerank({
        projectId,
        version,
        serviceUrl,
        model,
      });
      const longerDocs = docs.map((item) => ({
        ...item,
        pageContent: item.pageContent.repeat(20),
      }));
      await expect(watsonxRerank.compressDocuments(longerDocs, query)).rejects.toThrow();
    });
  });
});
