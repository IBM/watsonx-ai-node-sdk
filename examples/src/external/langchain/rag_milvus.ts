import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import type { Document } from '@langchain/core/documents';
import { createAgent } from 'langchain';
import * as z from 'zod/v3';
import { tool } from '@langchain/core/tools';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import type { MilvusLibArgs } from '@langchain/community/vectorstores/milvus';
import { Milvus } from '@langchain/community/vectorstores/milvus';
import { DataType } from '@zilliz/milvus2-sdk-node';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import '../../utils/config.ts';

const modelName = 'ibm/granite-3-3-8b-instruct';
const embeddingsModelName = 'ibm/slate-125m-english-rtrvr-v2';
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const embeddings = new WatsonxEmbeddings({
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
  watsonxAIAuthType: 'iam',
  version: '2024-05-31',
  maxRetries: 0,
  model: embeddingsModelName,
});

const loader = new CheerioWebBaseLoader(
  `https://raw.github.com/IBM/watson-machine-learning-samples/master/cloud/data/foundation_models/state_of_the_union.txt`
);
const chunkSize = 500;
const loadedDocument = await loader.load();
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize,
  chunkOverlap: 100,
});
const split = await textSplitter.splitDocuments(loadedDocument);

const collectionName = 'Milvus_nodejs_langchain_RAG';

const authParams: MilvusLibArgs = {
  collectionName,
  textFieldMaxLength: 1024,
  autoId: true,
  clientConfig: {
    ssl: true,
    address: process.env.MILVUS_URL as string,
    username: process.env.MILVUS_USERNAME,
    password: process.env.MILVUS_PASSWORD,
  },
};
const schema = [
  { name: 'id', data_type: DataType.Int64, is_primary_key: true, autoID: true },
  { name: 'loc', data_type: DataType.VarChar, max_length: 200 },
  { name: 'source', data_type: DataType.VarChar, max_length: 200 },
  { name: 'langchain_text', data_type: DataType.VarChar, max_length: 1000 },
  { name: 'langchain_vector', data_type: DataType.FloatVector, dim: 768 },
];

const milvus = new Milvus(embeddings, authParams);

try {
  await milvus.client.createCollection({
    collection_name: collectionName,
    fields: schema,
    auto_id: true,
  });
  const documentsArray = chunkArray(chunkArray<Document>(split, 500), 10);
  let i = 1;
  for (const documents of documentsArray) {
    console.log('Start loading batch ' + i);
    await Promise.all(documents.map((document) => milvus.addDocuments(document)));
    console.log('Finish loading batch ' + i);
    i += 1;
  }
  await milvus.client.createIndex({
    collection_name: collectionName,
    field_name: 'langchain_vector',
    index_name: 'myindex',
    index_type: 'HNSW',
    params: { efConstruction: 10, M: 4 },
    metric_type: 'L2',
  });

  const llm = new ChatWatsonx({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    model: modelName,
    maxRetries: 0,
  });

  const retrieveSchema = z.object({ query: z.string() });

  const retrieve = tool(
    async ({ query }) => {
      const searchResult = 2;
      const retrievedDocs = await milvus.similaritySearch(query, searchResult);
      const serialized = retrievedDocs
        .map((doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`)
        .join('\n');
      return [serialized, retrievedDocs];
    },
    {
      name: 'retrieve',
      description: 'Retrieve information related to a query.',
      schema: retrieveSchema,
      responseFormat: 'content_and_artifact',
    }
  );

  const agent = createAgent({
    model: llm,
    tools: [retrieve],
  });

  const questions: [number, string, string][] = [
    [
      0,
      'What did the president say about Ketanji Brown Jackson?',
      'That he nominated her to serve United States Supreme Court ',
    ],
  ];
  for (const [index, [_qid, question, answer]] of questions.entries()) {
    const result = await agent.invoke({ messages: [{ role: 'user', content: question }] });
    console.log(
      `============================= Question #${index + 1} =============================`
    );
    console.log('\t' + question + '\n');
    console.log('Model answer: ' + result.messages.at(-1)?.content + '\n');
    console.log('Expected answer: ' + answer + '\n');
  }
} catch (e) {
  throw new Error(
    `Failed to run example: ${(e as Error).message}. Proceeding to clean up the environemnt.`
  );
} finally {
  await milvus.client.dropCollection({ collection_name: collectionName });
}
