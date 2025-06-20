import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import '../utils/config.ts';

interface IInstructLabJobStatus {
  entity?: {
    status?: {
      state?: string;
      failure?: {
        errors?: Record<'message', string>[];
      };
    };
  };
}
const projectId = process.env.WATSONX_AI_PROJECT_ID;

const checkIfJobFinshed = async <T>(
  getter: () => Promise<WatsonXAI.Response<IInstructLabJobStatus>> & T,
  retries = 5,
  delay = 120000
) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await getter();
    console.log(result.result);
    if (result.result.entity?.status?.state === 'completed') {
      return result as T;
    }
    if (result.result.entity?.status?.state === 'failed') {
      console.log(result.result.entity?.status?.failure?.errors?.[0].message);
      throw new Error(
        `${getter.name} failed. Reason: ${result.result.entity?.status?.failure?.errors?.[0].message}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

const watsonxAIService = WatsonXAI.newInstance({
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
  platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
  version: '2023-07-07',
});

const dataConnectionReferenceModel = {
  type: 'container',
  location: {
    path: 'experienced.pdf',
  },
};
// ObjectLocationGithub
const objectLocationModel = {
  location: {
    path: 'experienced',
    secret_id: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_ID,
    secret_manager_url: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_URL,
  },
  type: 'github',
};

const documentExtractionParams = {
  name: 'docext-nodejs-sdk',
  documentReferences: [dataConnectionReferenceModel],
  resultsReference: objectLocationModel,
  tags: ['t1', 't2'],
  projectId: process.env.WATSONX_AI_PROJECT_ID,
};

const documentExtractionRes = await watsonxAIService.createDocumentExtraction(
  documentExtractionParams
);
const docExtId = documentExtractionRes.result.metadata?.id;
if (!docExtId) throw new Error('No docExtId provided');

const docExtGetter = () =>
  watsonxAIService.getDocumentExtraction({
    id: docExtId,
    projectId,
  });

const documentExtractionResult = await checkIfJobFinshed(docExtGetter, 20);
console.log(documentExtractionResult);

const params = {
  name: 'taxonomy-nodejs-sdk',
  description: 'teststring',
  projectId,
  resultsReference: { location: { path: '.' }, 'type': 'container' },
  dataReference: objectLocationModel,
};

const taxonomyRes = await watsonxAIService.createTaxonomy(params);
const taxId = taxonomyRes.result.metadata?.id;
if (!taxId) throw new Error('No taxId provided');

const taxonomyGetter = () =>
  watsonxAIService.getTaxonomy({
    id: taxId,
    projectId,
  });

const taxonomyResult = await checkIfJobFinshed(taxonomyGetter, 100, 30000);
const taxonomyResultReference = taxonomyResult.result.entity?.results_reference;
console.log(taxonomyResultReference);

// SyntheticDataGenerationDataReference
const syntheticDataGenerationDataReferenceModel = taxonomyResultReference;

const sdgParams = {
  name: 'sdg-nodejs-sdk',
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  dataReference: syntheticDataGenerationDataReferenceModel,
  resultsReference: objectLocationModel,
};

const sdgRes = await watsonxAIService.createSyntheticDataGeneration(sdgParams);
const sdgId = sdgRes.result.metadata?.id;
if (!sdgId) throw new Error('No sdgId provided');

const sdgGetter = () =>
  watsonxAIService.getSyntheticDataGeneration({
    id: sdgId,
    projectId,
  });

const sdgResult = await checkIfJobFinshed(sdgGetter, 20);
console.log(sdgResult);

const trainingDataReferences = sdgResult.result.entity?.results_reference;

if (!trainingDataReferences) throw new Error('No trainingDataReferences provided');

console.log(trainingDataReferences);
const fineTuningResultReference = { 'type': 'container', 'location': { 'path': '.' } };

const fineTuningParams = {
  name: 'finetuning-nodejs-sdk',
  trainingDataReferences: [trainingDataReferences],
  resultsReference: fineTuningResultReference,
  description: 'testString',
  tags: ['t1', 't2'],
  projectId: process.env.WATSONX_AI_PROJECT_ID,
  type: 'ilab',
  custom: { name: 'model', size: 2 },
};

const res = await watsonxAIService.createFineTuning(fineTuningParams);
const fineTunId = res.result.metadata?.id;
console.log(fineTunId);
