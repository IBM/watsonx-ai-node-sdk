/* This test suit is not executed on the Travis pipeline. Anytime changes are made regarding InstructLab */
/* These tests should be run on your local machine. Especially the main flow test. Command: `npm run test-ilab` */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const { readExternalSources } = require('ibm-cloud-sdk-core');
const WatsonxAiMlVml_v1 = require('../../dist/watsonx-ai-ml/vml_v1');
const authHelper = require('../resources/auth-helper.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = 'credentials/watsonx_ai_ml_vml_v1.env';
const describe = authHelper.prepareTests(configFile);

authHelper.loadEnv();
const projectId = process.env.WATSONX_AI_PROJECT_ID;

const checkIfJobFinshed = async (getter, retries = 5, delay = 120000) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await getter();
    console.log(result.result);
    if (result.result.entity.status.state === 'completed') {
      return result.result;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

describe('Ilab tests', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAiMlService;
  let taxonomyId;
  let syntheticDataId;
  let documentExtractionId;
  let fineTuningId;

  test('Initialize service', async () => {
    watsonxAiMlService = WatsonxAiMlVml_v1.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
      version: '2023-07-07',
    });

    expect(watsonxAiMlService).not.toBeNull();

    const config = readExternalSources(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();

    watsonxAiMlService.enableRetries();
  });

  test.skip('createTaxonomy()', async () => {
    // ObjectLocation
    const objectLocationModel = {
      location: {
        path: '.',
        secret_id: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_ID,
        secret_manager_url: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_URL,
      },
      type: 'github',
    };

    const params = {
      name: 'teststring',
      description: 'teststring',
      projectId,
      resultsReference: { location: { path: '.' }, 'type': 'container' },
      dataReference: objectLocationModel,
    };

    const res = await watsonxAiMlService.createTaxonomy(params);
    taxonomyId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('listTaxonomies()', async () => {
    const params = {
      projectId,
    };

    const res = await watsonxAiMlService.listTaxonomies(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('getTaxonomy()', async () => {
    const params = {
      id: taxonomyId,
      projectId,
    };

    const res = await watsonxAiMlService.getTaxonomy(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('deleteTaxonomy()', async () => {
    const params = {
      id: taxonomyId,
      projectId,
      hardDelete: true,
    };

    const res = await watsonxAiMlService.deleteTaxonomy(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test.skip('createSyntheticDataGeneration()', async () => {
    // Request models needed by this operation.
    // ObjectLocationGithub
    const objectLocationModel = {
      location: {
        path: '.',
        secret_id: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_ID,
        secret_manager_url: process.env.WATSONX_AI_INSTRUCTLAB_SECRET_URL,
      },
      type: 'github',
    };
    const dataAsset = 'XXXXXXXXXXXXXXXXXX';
    const dataProjectId = 'XXXXXXXXXXXXXXXXXX';
    const taxId = 'XXXXXXXXXXXXXXXXXX';
    // SyntheticDataGenerationDataReference
    const syntheticDataGenerationDataReferenceModel = {
      location: {
        href: `/v2/data_assets/${dataAsset}?project_id=${dataProjectId}`,
        id: taxId,
      },
      type: 'taxonomy_asset',
    };

    const params = {
      name: 'name_01',
      projectId: process.env.WATSONX_AI_PROJECT_ID,
      dataReference: syntheticDataGenerationDataReferenceModel,
      resultsReference: objectLocationModel,
    };

    const res = await watsonxAiMlService.createSyntheticDataGeneration(params);
    syntheticDataId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('listSyntheticDataGenerations()', async () => {
    const params = {
      projectId,
    };

    const res = await watsonxAiMlService.listSyntheticDataGenerations(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('getSyntheticDataGeneration()', async () => {
    const params = {
      projectId: process.env.WATSONX_AI_PROJECT_ID,
      id: sdgId,
    };

    const res = await watsonxAiMlService.getSyntheticDataGeneration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('cancelSyntheticDataGeneration()', async () => {
    const params = {
      id: syntheticDataId,
      projectId: process.env.WATSONX_AI_PROJECT_ID,
      hardDelete: true,
    };

    const res = await watsonxAiMlService.cancelSyntheticDataGeneration(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test.skip('createDocumentExtraction()', async () => {
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

    const params = {
      name: 'testString',
      documentReferences: [dataConnectionReferenceModel],
      resultsReference: objectLocationModel,
      tags: ['t1', 't2'],
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };

    const res = await watsonxAiMlService.createDocumentExtraction(params);
    documentExtractionId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('listDocumentExtractions()', async () => {
    const params = {
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };

    const res = await watsonxAiMlService.listDocumentExtractions(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('getDocumentExtraction()', async () => {
    const params = {
      id: documentExtractionId,
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };
    const res = await watsonxAiMlService.getDocumentExtraction(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('cancelDocumentExtractions()', async () => {
    const params = {
      id: documentExtractionId,
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };

    const res = await watsonxAiMlService.cancelDocumentExtractions(params);
    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  test.skip('createFineTuning()', async () => {
    // Request models needed by this operation.
    const dataAsset = 'XXXXXXXXXXXXXXXXXX';
    const dataProjectId = 'XXXXXXXXXXXXXXXXXX';
    const sdgId = 'XXXXXXXXXXXXXXXXXX';
    // ObjectLocation
    const trainingDataReferences = {
      location: {
        href: `/v2/data_assets/${dataAsset}?project_id=${dataProjectId}`,
        id: sdgId,
      },
      type: 'data_asset',
    };

    // ObjectLocationGithub
    const objectLocationModel = { 'type': 'container', 'location': { 'path': '.' } };

    const params = {
      name: 'test-string',
      trainingDataReferences: [trainingDataReferences],
      resultsReference: objectLocationModel,
      description: 'testString',
      tags: ['t1', 't2'],
      projectId: process.env.WATSONX_AI_PROJECT_ID,
      type: 'ilab',
      custom: { name: 'model', size: 2 },
    };

    const res = await watsonxAiMlService.createFineTuning(params);
    fineTuningId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('listFineTunings()', async () => {
    const params = {
      limit: 10,
      type: 'ilab',
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };
    const res = await watsonxAiMlService.listFineTunings(params);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test('fineTuningList() via FineTuningListPager', async () => {
    const params = {
      limit: 10,
      totalCount: true,
      tagValue: 'testString',
      state: 'testString',
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };

    const allResults = [];

    // Test getNext().
    let pager = new WatsonxAiMlVml_v1.FineTuningListPager(watsonxAiMlService, params);
    while (pager.hasNext()) {
      const nextPage = await pager.getNext();
      expect(nextPage).not.toBeNull();
      allResults.push(...nextPage);
    }

    // Test getAll().
    pager = new WatsonxAiMlVml_v1.FineTuningListPager(watsonxAiMlService, params);
    const allItems = await pager.getAll();
    expect(allItems).not.toBeNull();
    expect(allItems).toHaveLength(allResults.length);
    console.log(`Retrieved a total of ${allResults.length} items(s) with pagination.`);
  });

  test.skip('getFineTuning()', async () => {
    const params = {
      id: fineTuningId,
      projectId: process.env.WATSONX_AI_PROJECT_ID,
    };
    const res = await watsonxAiMlService.getFineTuning(params);

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.result).toBeDefined();
  });

  test.skip('deleteFineTuning()', async () => {
    const params = {
      id: fineTuningId,
      projectId: process.env.WATSONX_AI_PROJECT_ID,
      hardDelete: true,
    };

    const res = await watsonxAiMlService.deleteFineTuning(params);

    expect(res).toBeDefined();
    expect(res.status).toBe(204);
    expect(res.result).toBeDefined();
  });

  describe('Ilab long running flow tests', () => {
    let taxId;
    let sdgId;
    let docExtId;
    let fineTunId;
    test('Ilab flow', async () => {
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
      docExtId = documentExtractionRes.result.metadata.id;
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
      taxId = taxonomyRes.result.metadata.id;

      const taxonomyGetter = () =>
        watsonxAiMlService.getTaxonomy({
          id: taxId,
          projectId,
        });

      const taxonomyResult = await checkIfJobFinshed(taxonomyGetter, 100, 30000);
      const taxonomyResultReference = taxonomyResult.entity.results_reference;
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
      sdgId = sdgRes.result.metadata.id;

      const sdgGetter = () =>
        watsonxAiMlService.getSyntheticDataGeneration({
          id: sdgId,
          projectId,
        });

      const sdgResult = await checkIfJobFinshed(sdgGetter, 20);
      console.log(sdgResult);

      const trainingDataReferences = sdgResult.entity.results_reference;
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
      fineTunId = res.result.metadata.id;
      console.log(fineTunId);
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.result).toBeDefined();
    }, 3000000);

    afterAll(async () => {
      try {
        await watsonxAiMlService.deleteTaxonomy({
          id: taxId,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
          hardDelete: true,
        });
      } catch (e) {
        console.log(e);
      }
      try {
        await watsonxAiMlService.cancelDocumentExtractions({
          id: docExtId,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
        });
      } catch (e) {
        console.log(e);
      }
      try {
        await watsonxAiMlService.deleteFineTuning({
          id: fineTunId,
          projectId,
          hardDelete: true,
        });
      } catch (e) {
        console.log(e);
      }
      try {
        await watsonxAiMlService.cancelSyntheticDataGeneration({
          id: sdgId,
          projectId: process.env.WATSONX_AI_PROJECT_ID,
          hardDelete: true,
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
});
