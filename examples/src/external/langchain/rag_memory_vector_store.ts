import { WatsonxEmbeddings } from '@langchain/community/embeddings/ibm';
import { ChatWatsonx } from '@langchain/community/chat_models/ibm';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { createAgent, tool } from 'langchain';
import z from 'zod/v3';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import '../../utils/config.ts';

const modelName = 'ibm/granite-3-2-8b-instruct';
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
    const retrievedDocs = await vectorStore.similaritySearch(query, searchResult);
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
const systemPrompt =
  'You have access to a tool that retrieves context from a blog post. ' +
  'Use the tool to help answer user queries.';

const agent = createAgent({
  model: llm,
  tools: [retrieve],
  systemPrompt,
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
  console.log(`============================= Question #${index + 1} =============================`);
  console.log('\t' + question + '\n');
  console.log('Model answer: ' + result.messages.at(-1)?.content + '\n');
  console.log('Expected answer: ' + answer + '\n');
}
