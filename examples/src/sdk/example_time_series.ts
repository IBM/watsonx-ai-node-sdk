/**
 * The following example flow:
 * - initialize SDK
 * - retrieve data for the example
 * - change data to expected format
 * - perform time series calculations and print result
 */

import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
import path from 'path';
import Papa from 'papaparse';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const credentialsPath = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env');
config({ path: credentialsPath });

/**
 * This is another option of authentication. For this to work please remove following properties from Watsonx instance initialization
 * watsonxAIApikey, watsonxAIAuthType
 * */
// process.env.IBM_CREDENTIALS_FILE = path.join(__dirname, '/../../../credentials/watsonx_ai_ml_vml_v1.env')

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const spaceId = projectId ? undefined : process.env.WATSONX_AI_SPACE_ID;

const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;

const response = await fetch(
  'https://raw.githubusercontent.com/IBM/watsonx-ai-samples/refs/heads/master/cloud/data/energy/energy_dataset.csv',
  {
    headers: {
      'Content-type': 'text/event-stream',
    },
  }
);
if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
const data = await response.text();

const parsed = Papa.parse<Array<any>>(data, {
  header: true,
  skipEmptyLines: true,
});
const jsonArray = parsed.data;

const arrayToObject = (array: any[]) => {
  const jsonData: Record<string, any[]> = {};
  array.forEach((row) => {
    const values = Object.entries(row);
    values.forEach(([key, value]) => {
      jsonData[key] ??= [];
      if (key === 'time') {
        jsonData[key].push(value);
      } else {
        jsonData[key].push(Number(value));
      }
    });
  });
  return jsonData;
};
// Skipping last 96 datapoints to have them compared to the forecast
const jsonData = arrayToObject(jsonArray.slice(-608, -96));

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl,
});

const res = await watsonxAIService.timeSeriesForecast({
  modelId: 'ibm/granite-ttm-512-96-r2',
  projectId,
  data: jsonData,
  schema: {
    timestamp_column: 'time',
    target_columns: ['total load actual'],
  },
});

const calcRMSE = (actual: number[], predicted: number[]) => {
  if (actual.length !== predicted.length)
    throw new Error(
      'Cannot calculate root mean square error. Both datasets must be the same length!'
    );
  let sum = 0;
  for (let i = 0; i < actual.length; i++) {
    sum += (predicted[i] - actual[i]) ** 2;
  }
  return Math.sqrt(sum / actual.length);
};

console.log(
  'RMSE:',
  calcRMSE(
    arrayToObject(jsonArray.slice(-96))['total load actual'],
    res.result.results?.[0]['total load actual']
  )
);
