import WatsonxAiMlVml_v1 from '@ibm-cloud/watsonx-ai/dist/watsonx-ai-ml/vml_v1';
import { config } from 'dotenv';
import path from 'path';

const myPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

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
  getter: () => Promise<WatsonxAiMlVml_v1.Response<IInstructLabJobStatus>> & T,
  retries = 5,
  delay = 120000
) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await getter();
    console.log(result.result);
    if (result.result.entity.status.state === 'completed') {
      return result as T;
    } else if (result.result.entity.status.state === 'failed') {
      console.log(result.result.entity.status.failure.errors[0].message);
      throw new Error(
        `${getter.name} failed. Reason: ${result.result.entity.status.failure.errors[0].message}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

export const instructLabFlow = async () => {
  const watsonxAiMlService = WatsonxAiMlVml_v1.newInstance({
    serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
    platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
    version: '2023-07-07',
  });

  const path = 'experienced.pdf';
  const dataConnectionReferenceModel = {
    type: 'container',
    location: {
      path,
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
    name: 'testString',
    documentReferences: [dataConnectionReferenceModel],
    resultsReference: objectLocationModel,
    tags: ['t1', 't2'],
    projectId: process.env.WATSONX_AI_PROJECT_ID,
  };

  const documentExtractionRes = await watsonxAiMlService.createDocumentExtraction(
    documentExtractionParams
  );
  const docExtId = documentExtractionRes.result.metadata.id;
  const docExtGetter = () =>
    watsonxAiMlService.getDocumentExtraction({
      id: docExtId,
      projectId,
    });

  const documentExtractionResult = await checkIfJobFinshed(docExtGetter, 20);
  console.log(documentExtractionResult);

  const params = {
    name: 'teststring',
    description: 'teststring',
    projectId,
    resultsReference: { location: { path: '.' }, 'type': 'container' },
    dataReference: objectLocationModel,
  };

  const taxonomyRes = await watsonxAiMlService.createTaxonomy(params);
  const taxId = taxonomyRes.result.metadata.id;

  const taxonomyGetter = () =>
    watsonxAiMlService.getTaxonomy({
      id: taxId,
      projectId,
    });

  const taxonomyResult = await checkIfJobFinshed(taxonomyGetter, 100, 30000);
  const taxonomyResultReference = taxonomyResult.result.entity.results_reference;
  console.log(taxonomyResultReference);

  // SyntheticDataGenerationDataReference
  const syntheticDataGenerationDataReferenceModel = taxonomyResultReference;

  const sdgParams = {
    name: 'name_01',
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    dataReference: syntheticDataGenerationDataReferenceModel,
    resultsReference: objectLocationModel,
  };

  const sdgRes = await watsonxAiMlService.createSyntheticDataGeneration(sdgParams);
  const sdgId = sdgRes.result.metadata.id;

  const sdgGetter = () =>
    watsonxAiMlService.getSyntheticDataGeneration({
      id: sdgId,
      projectId,
    });

  const sdgResult = await checkIfJobFinshed(sdgGetter, 20);
  console.log(sdgResult);

  const trainingDataReferences = sdgResult.result.entity.results_reference;
  console.log(trainingDataReferences);
  const fineTuningResultReference = { 'type': 'container', 'location': { 'path': '.' } };

  const fineTuningParams = {
    name: 'test-string',
    trainingDataReferences: [trainingDataReferences],
    resultsReference: fineTuningResultReference,
    description: 'testString',
    tags: ['t1', 't2'],
    projectId: process.env.WATSONX_AI_PROJECT_ID,
    type: 'ilab',
    custom: { name: 'model', size: 2 },
  };

  const res = await watsonxAiMlService.createFineTuning(fineTuningParams);
  const fineTunId = res.result.metadata.id;
  console.log(fineTunId);
};
