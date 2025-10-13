/* This test suit is not executed on the Tekton pipeline. Anytime changes are made regarding InstructLab */
/* These tests should be run on your local machine. Especially the main flow test. Command: `npm run test-ilab` */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const https = require('https');
const { readExternalSources } = require('ibm-cloud-sdk-core');
const path = require('path');
const { WatsonXAI } = require('../../dist/vml_v1');
const authHelper = require('../resources/auth-helper.js');

// testcase timeout value (200s).
const timeout = 200000;
const model = 'meta-llama/llama-3-1-8b';
// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');

const describe = authHelper.prepareTests(configFile);

authHelper.loadEnv();

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const dataAsset = process.env.WATSONX_AI_DATA_ASSET;
let fineTuningId;
let storedModelId;
let deployedId;
let assetId;
let loraAdapterId;

const checkIfJobFinshed = async (getter, state = 'completed', retries = 60, delay = 10000) => {
  for (let i = 0; i < retries; i += 1) {
    const result = await getter();
    console.log(result.result);
    if (result.result.entity.status.state === state) {
      return result.result;
    }
    if (result.result.entity.status.state === 'failed') {
      return result.result.entity.status.failure || result.result.entity.status;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

const deleteAllFineTunings = async (instance) => {
  const res = await instance.listFineTunings({ projectId });
  await Promise.all(
    res.result.resources.map((item) => {
      console.log('Deleting fine tuning: ', item.metadata.id);
      return instance.deleteFineTuning({
        projectId,
        id: item.metadata.id,
        hardDelete: true,
      });
    })
  );
  console.log('Deleted all fine tunings');
};

const deleteAllDeployments = async (instance) => {
  const res = await instance.listDeployments({ projectId });
  await Promise.all(
    res.result.resources.map((item) => {
      console.log('Deleting fine tuning: ', item.metadata.id);
      return instance.deleteDeployment({
        projectId,
        deploymentId: item.metadata.id,
      });
    })
  );
  console.log('Deleted all fine tunings');
};

describe('Ilab tests', () => {
  jest.setTimeout(timeout);

  // Service instance
  let watsonxAIService;
  beforeAll(async () => {
    watsonxAIService = WatsonXAI.newInstance({
      serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
      platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
      version: '2023-07-07',
    });

    expect(watsonxAIService).not.toBeNull();

    const config = readExternalSources(WatsonXAI.DEFAULT_SERVICE_NAME);
    expect(config).not.toBeNull();
    watsonxAIService.enableRetries();
  });

  test('Delete all fine tunings', async () => {
    await deleteAllFineTunings(watsonxAIService);
  });

  test('Delete all deployments', async () => {
    await deleteAllDeployments(watsonxAIService);
  });

  test('createFineTuning()', async () => {
    const objectLocationModel = {
      'location': {
        'path': 'default_tuning_output',
      },
      'type': 'container',
    };

    const trainingDataReferences = {
      'location': {
        'href': `/v2/assets/${dataAsset}`,
        'id': dataAsset,
      },
      'type': 'data_asset',
    };

    // BaseModel
    const baseModelModel = {
      model_id: model,
    };

    // GPU
    const gpuModel = {
      num: 1,
    };

    // FineTuningPeftParameters
    const fineTuningPeftParametersModel = {
      type: 'lora',
      rank: 8,
      lora_alpha: 32,
      lora_dropout: 0.05,
    };

    // FineTuningParameters
    const fineTuningParametersModel = {
      task_id: 'classification',
      tokenizer: model,
      accumulate_steps: 1,
      base_model: baseModelModel,
      num_epochs: 3,
      learning_rate: 0.2,
      batch_size: 5,
      max_seq_length: 1024,
      gpu: gpuModel,
      peft_parameters: fineTuningPeftParametersModel,
    };

    const params = {
      name: 'testString',
      trainingDataReferences: [trainingDataReferences],
      resultsReference: objectLocationModel,
      projectId,
      autoUpdateModel: true,
      parameters: fineTuningParametersModel,
    };

    const res = await watsonxAIService.createFineTuning(params);
    fineTuningId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.result).toBeDefined();
  });

  test('Check fine tuning', async () => {
    const getter = () =>
      watsonxAIService.getFineTuning({
        id: fineTuningId,
        projectId,
      });
    const result = await checkIfJobFinshed(getter);
    console.log(result);
    assetId = result.entity.tuned_model.id;
  }, 6000000);

  test('Store model', async () => {
    const data = {
      'name': 'base foundation model asset',
      projectId,
      'foundationModel': {
        'model_id': model,
      },
      'type': 'base_foundation_model_1.0',
      'softwareSpec': {
        'name': 'watsonx-cfm-caikit-1.1',
      },
    };

    const response = await watsonxAIService.createModel(data);

    console.log(response.result);
    storedModelId = response.result.metadata.id;
  });

  test('Deploy base foundation model for LoRA', async () => {
    const params = {
      projectId,
      name: 'Node_sdk_fm',
      asset: {
        id: storedModelId,
      },
      online: {
        parameters: {
          foundation_model: {
            enable_lora: true,
            // max_batch_weight: 10000,
            // max_sequence_length: 8192,
            // max_gpu_loras: 8,
            // max_cpu_loras: 16,
            // max_lora_rank: 32,
          },
        },
      },
      hardwareSpec: {
        id: '72cdc321-7421-5bc2-a8bf-3e8e9a32efc7',
        'num_nodes': 1,
      },
    };
    const res = await watsonxAIService.createDeployment(params);
    deployedId = res.result.metadata.id;
  });

  test('Check deployment', async () => {
    const getter = () =>
      watsonxAIService.getDeployment({
        projectId,
        deploymentId: deployedId,
      });
    const res = await checkIfJobFinshed(getter, 'ready');
    console.log(res);
  }, 6000000);

  test('Deploy LORA adapter', async () => {
    const onlineDeploymentParametersModel = {
      serving_name: (Math.random() + 1).toString(36).substring(10),
    };

    const onlineDeploymentModel = {
      parameters: onlineDeploymentParametersModel,
    };

    const relModel = {
      id: assetId,
    };

    const params = {
      name: 'NODE_SDK_MODEL',
      online: onlineDeploymentModel,
      projectId,
      asset: relModel,
      baseDeploymentId: deployedId,
    };

    const res = await watsonxAIService.createDeployment(params);
    console.log(res);
    loraAdapterId = res.result.metadata.id;
    expect(res).toBeDefined();
    expect(res.status).toBe(202);
    expect(res.result).toBeDefined();
  });

  test('Check LORA deployment', async () => {
    const getter = () =>
      watsonxAIService.getDeployment({
        projectId,
        deploymentId: loraAdapterId,
      });
    const res = await checkIfJobFinshed(getter, 'ready');
    console.log(res);
  }, 6000000);

  test('Infere adapter', async () => {
    const res = await watsonxAIService.deploymentGenerateText({
      idOrName: loraAdapterId,
      input: "Can't find my code",
    });
    console.log(res.result);
  });
});
