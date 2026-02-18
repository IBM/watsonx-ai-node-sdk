/**
 * The following example flow:
 *
 * - Initialize SDK
 * - Tokenize input on two chosen models
 * - Compare how input is split into tokens between two models
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentialsPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: credentialsPath });

/**
 * This is another option of authentication. For this to work please remove following properties
 * from Watsonx instance initialization watsonxAIApikey, watsonxAIAuthType
 */
// process.env.IBM_CREDENTIALS_FILE = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env')

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const _spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});

// Request models needed by this operation.

// CosDataConnection
const cosDataConnectionModel = {
  id: process.env.WATSONX_AI_COS_ID as string,
};

// CosDataLocation
const cosDataLocationModel = {
  file_name: 'experienced.pdf',
  bucket: 'wx-nodejs-test-text-extraction',
};

const cosResultLocationModel = {
  file_name: 'experienced.md',
  bucket: 'wx-nodejs-test-text-extraction',
};

// TextExtractionDataReference
const textExtractionDataReferenceModel = {
  type: 'connection_asset',
  connection: cosDataConnectionModel,
  location: cosDataLocationModel,
};
// TextExtractionDataReference
const textExtractionResultReferenceModel = {
  type: 'connection_asset',
  connection: cosDataConnectionModel,
  location: cosResultLocationModel,
};

// TextExtractionStepOcr
const textExtractionStepOcrModel = {
  languages_list: ['en'],
};

// TextExtractionStepTablesProcessing
const textExtractionStepTablesProcessingModel = {
  enabled: true,
};

// TextExtractionSteps
const textExtractionStepsModel = {
  ocr: textExtractionStepOcrModel,
  tables_processing: textExtractionStepTablesProcessingModel,
};

const params = {
  documentReference: textExtractionDataReferenceModel,
  resultsReference: textExtractionResultReferenceModel,
  steps: textExtractionStepsModel,
  projectId,
  assemblyMd: {},
};

const res = await watsonxAIService.createTextExtraction(params);
const textExtId = res.result.metadata?.id;

const checkIfJobFinshed = async <T>(getter: () => Promise<any>, retries = 5, delay = 10000) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await getter();
    console.log(result.result);
    if (result.result.entity?.results?.status === 'completed') {
      return result.result as T;
    }
    if (result.result.entity?.results?.status === 'failed') {
      throw new Error(
        `${getter.name} failed. Code: ${result.result.entity?.results?.error.code} Reason: ${result.result.entity?.results?.error.message}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};
if (!textExtId) throw new Error('No textExtId provided');
const retrieveTextExtraction = () =>
  watsonxAIService.getTextExtraction({ projectId, id: textExtId });
const result = await checkIfJobFinshed(retrieveTextExtraction);
console.log(result);
// cleanup
await watsonxAIService.deleteTextExtraction({ projectId, id: textExtId });
