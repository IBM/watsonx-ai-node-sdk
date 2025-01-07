import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { pull } from 'langchain/hub';
import path from 'path';
import { config } from 'dotenv';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
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

export const rag = async () => {
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

  const loadedDocument = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const split = await textSplitter.splitDocuments(loadedDocument);
  const vectorStore = new MemoryVectorStore(embeddings);
  const documentsArray = chunkArray(chunkArray(split, 1000), 5);
  let i = 1;
  for (const documents of documentsArray) {
    console.log('Start loading batch ' + i);
    await Promise.all(documents.map((document) => vectorStore.addDocuments(document)));
    console.log('Finish loading batch ' + i);
    i += 1;
  }

  const retriever = vectorStore.asRetriever();
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
};
