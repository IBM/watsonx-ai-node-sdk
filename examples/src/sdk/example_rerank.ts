/**
 * The following example flow:
 * - initialize SDK
 * - imports and splits some document
 * - reranks documents and retrievs result
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import path from 'path';

const myPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

// process.env.IBM_CREDENTIALS_FILE = '<ABSOLUTE_PATH>/auth/watsonx_ai_ml_vml_v1.env';

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

export const rerankDocuments = async () => {
  console.log('\n\n***** EXAMPLE RERANK 1 - RERANK DOCUMENTS BASED ON A SIMPLE QUERY *****');

  const result: AxiosResponse<string> = await axios.get(
    'https://raw.github.com/IBM/watson-machine-learning-samples/master/cloud/data/foundation_models/state_of_the_union.txt'
  );

  const data = [];
  const chunkSize = 500;
  const chunkOverlap = 100;
  for (let i = 0; i < result.data.length; i += chunkSize - chunkOverlap) {
    const chunk = result.data.slice(i, i + chunkSize);
    data.push({ text: chunk });
  }
  // Service instance
  const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl,
  });

  const rerankedDocs = await watsonxAIService.textRerank({
    modelId: 'cross-encoder/ms-marco-minilm-l-12-v2',
    inputs: data,
    query: 'What did the president say about Ketanji Brown Jackson',
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    parameters: {
      return_options: {
        top_n: 3,
        inputs: true,
      },
    },
  });

  console.log(rerankedDocs.result.results);
};
