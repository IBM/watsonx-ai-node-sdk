/**
 * The following example flow:
 * - initialize SDK
 * - tune model
 * - deploy model
 * - infer tuned model
 * This example may have extended duration (~5 minutes) because of the training time and initialization of the deployment.
 */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import path from 'path';
import { config } from 'dotenv';

const myPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: myPath });

// process.env.IBM_CREDENTIALS_FILE = '<ABSOLUTE_PATH>/auth/watsonx_ai_ml_vml_v1.env';

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
const trainingAssetId = process.env.TRAINING_ASSET_ID;
export const promptTuning = async () => {
  // Service instance
  const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl,
  });

  const getModelId = async (args, retries = 5, delay = 120000) => {
    for (let i = 0; i < retries; i++) {
      const result = await watsonxAIService.getTraining(args);
      if (result.result.entity?.model_id) {
        return result.result.entity?.model_id;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error('Failed to get a valid response after maximum retries');
  };

  const waitForDeployment = async (args, retries = 5, delay = 120000) => {
    for (let i = 0; i < retries; i++) {
      const result = await watsonxAIService.getDeployment(args);
      if (result.result.entity.status.state === 'ready') {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error('Failed to get a valid response after maximum retries');
  };

  // ObjectLocation
  const objectLocationModel = {
    type: 'container',
    location: { path: 'tune1/results' },
  };

  // BaseModel
  const baseModelModel = {
    model_id: 'google/flan-t5-xl',
  };
  // DataConnectionReference
  const dataConnectionReferenceModel = {
    type: 'data_asset',
    location: {
      href: `/v2/assets/${trainingAssetId}?project_id=${projectId}`,
    },
  };

  // PromptTuning
  const promptTuningModel = {
    base_model: baseModelModel,
    task_id: 'classification',
    tuning_type: 'prompt_tuning',
    num_epochs: 1,
    learning_rate: 0.4,
    accumulate_steps: 3,
    verbalizer: 'rte { 0 : entailment, 1 : not entailment } {{input}}',
    batch_size: 10,
    max_input_tokens: 100,
    max_output_tokens: 100,
    init_method: 'text',
    init_text: 'testString',
  };
  // Training parameters
  const trainingParams = {
    name: 'prompt-tune-training',
    resultsReference: objectLocationModel,
    projectId,
    description: 'First prompt tuning training',
    tags: ['testString'],
    promptTuning: promptTuningModel,
    trainingDataReferences: [dataConnectionReferenceModel],
    custom: { anyKey: 'anyValue' },
    autoUpdateModel: true,
  };

  // TextGenLengthPenalty
  const textGenLengthPenaltyModel = {
    decay_factor: 2.5,
    start_index: 5,
  };

  // ReturnOptionProperties
  const returnOptionPropertiesModel = {
    input_text: true,
    generated_tokens: true,
    input_tokens: true,
    token_logprobs: true,
    token_ranks: true,
    top_n_tokens: 2,
  };

  const deploymentTextGenPropertiesModel = {
    decoding_method: 'greedy',
    length_penalty: textGenLengthPenaltyModel,
    max_new_tokens: 100,
    min_new_tokens: 5,
    stop_sequences: ['fail'],
    time_limit: 600000,
    repetition_penalty: 1.5,
    truncate_input_tokens: 0,
    return_options: returnOptionPropertiesModel,
    include_stop_sequence: true,
    prompt_variables: {
      doc_type: 'emails',
      entity_name: 'Golden Retail',
      country_name: 'London',
    },
  };

  // OnlineDeploymentParameters
  const onlineDeploymentParametersModel = {
    serving_name: `nodejs_sdk_example_id_${Date.now().toString()}`,
  };

  // OnlineDeployment
  const onlineDeploymentModel = {
    parameters: onlineDeploymentParametersModel,
  };

  let trainingId: string;
  let deploymentId: string;

  try {
    console.log(
      '\n\n***** EXAMPLE PROMPT TUNNING - TUNE, DEPLOY, INFER (LONG RUNNING ~5mins) *****'
    );

    const trainingDetails = await watsonxAIService.createTraining(trainingParams);
    console.log(trainingDetails);
    trainingId = trainingDetails.result.metadata.id;

    // Wait until training has been finished, then save id of the model and use it for deployment
    // This step should take ~3 minutes
    const modelId = await getModelId({ trainingId, projectId });

    // Rel
    const relModel = {
      id: modelId,
    };
    // Deployment parameters
    const deploymentParams = {
      name: 'text_classification',
      online: onlineDeploymentModel,
      projectId,
      spaceId,
      description: 'First deployment',
      tags: ['testString'],
      custom: { anyKey: 'anyValue' },
      asset: relModel,
    };

    const deploymentDetails = await watsonxAIService.createDeployment(deploymentParams);
    deploymentId = deploymentDetails.result.metadata.id;
    // Wait for deployment to be ready inference
    // This step should take ~2-3 minutes
    await waitForDeployment({ deploymentId, projectId });

    const genParams = {
      idOrName: deploymentId,
      input: 'Narrative: hi company reported debt paid\nProduct:\n',
      parameters: deploymentTextGenPropertiesModel,
    };

    const textGeneration = await watsonxAIService.deploymentGenerateText(genParams);
    console.log('\n\n***** TEXT RESPONSE FROM MODEL *****');
    console.log(textGeneration.result.results[0].generated_text);
  } catch (e) {
    throw e;
  } finally {
    if (trainingId)
      await watsonxAIService.deleteTraining({ projectId, trainingId, hardDelete: true });
    if (deploymentId) await watsonxAIService.deleteDeployment({ projectId, deploymentId });
  }
};
