import { WatsonxRerank } from '@langchain/community/document_compressors/ibm';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import '../../utils/config.ts';

const embeddings = new WatsonxEmbeddings({
  version: '2023-05-31',
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  model: 'ibm/slate-125m-english-rtrvr',
});

const query = 'What did the president say about Ketanji Brown Jackson';
const loader = new CheerioWebBaseLoader(
  `https://raw.github.com/IBM/watson-machine-learning-samples/master/cloud/data/foundation_models/state_of_the_union.txt`
);
const loadedDocument = await loader.load();
const textSplitter = new CharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 0,
});
const docs = await textSplitter.splitDocuments(loadedDocument);
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
const vectorStoreRetriever = vectorStore.asRetriever();

const result = await vectorStoreRetriever.invoke(query);
console.log(result);

const reranker = new WatsonxRerank({
  version: '2024-05-31',
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  model: 'cross-encoder/ms-marco-minilm-l-12-v2',
});
const compressed = await reranker.rerank(result, query);
console.log(compressed);

const compressedWithResults = await reranker.compressDocuments(result, query);
console.log(compressedWithResults);
