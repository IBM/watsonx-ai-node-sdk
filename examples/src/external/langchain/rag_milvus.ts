import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { pull } from 'langchain/hub';
import path from 'path';
import { config } from 'dotenv';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Milvus, MilvusLibArgs } from '@langchain/community/vectorstores/milvus';
import { DataType } from '@zilliz/milvus2-sdk-node';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

const myPath = path.join(__dirname, '/../../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const milvusRag = async () => {
  const embeddings = new WatsonxEmbeddings({
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
    watsonxAIApikey: process.env.WATSONX_AI_APIKEY,
    watsonxAIAuthType: 'iam',
    version: '2024-05-31',
    maxRetries: 0,
    model: 'ibm/slate-30m-english-rtrvr-v2',
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
      address: process.env.MILVUS_URL,
      username: process.env.MILVUS_USERNAME,
      password: process.env.MILVUS_PASSWORD,
    },
  };
  const schema = [
    { name: 'id', data_type: DataType.Int64, is_primary_key: true, autoID: true },
    { name: 'loc', data_type: DataType.VarChar, max_length: 200 },
    { name: 'source', data_type: DataType.VarChar, max_length: 200 },
    { name: 'langchain_text', data_type: DataType.VarChar, max_length: 1000 },
    { name: 'langchain_vector', data_type: DataType.FloatVector, dim: 384 },
  ];

  const milvus = new Milvus(embeddings, authParams);
  const res = await milvus.client.createCollection({
    collection_name: collectionName,
    fields: schema,
    auto_id: true,
  });

  const documentsArray = chunkArray(chunkArray(split, 500), 10);
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
    model: 'mistralai/mistral-large',
    maxRetries: 0,
  });
  const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');

  const retriever = milvus.asRetriever();
  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });
  const questions: [number, string, string][] = [
    [
      0,
      'What did the president say about Ketanji Brown Jackson?',
      'That he nominated her to serve United States Supreme Court ',
    ],
  ];
  for (const [index, [_qid, question, answer]] of questions.entries()) {
    const retrievedDocs = await retriever.invoke(question);
    const result = await ragChain.invoke({
      question,
      context: retrievedDocs,
    });
    console.log(
      `============================= Question #${index + 1} =============================`
    );
    console.log('\t' + question + '\n');
    console.log('Model answer: ' + result + '\n');
    console.log('Expected answer: ' + answer + '\n');
  }
  await milvus.client.dropCollection({ collection_name: collectionName });
};
