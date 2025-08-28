/**
 * (C) Copyright IBM Corp. 2024.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

const path = require('path');
const { createReadStream } = require('fs');
const authHelper = require('../resources/auth-helper.js');
const { WatsonXAI } = require('../../dist/index');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');
authHelper.prepareTests(configFile);
authHelper.loadEnv();
const describe = authHelper.checkCPD();

const projectId = process.env.WATSONX_AI_PROJECT_ID;
const serviceUrl = process.env.WATSONX_AI_SERVICE_URL;
describe('WatsonxAiMlVml_v1_integration on cpd environment', () => {
  const service = WatsonXAI.newInstance({
    serviceUrl,
    version: '2024-03-14',
  });

  describe('Audio transcription', () => {
    const audioFile = path.resolve(__dirname, '../data/sample_audio_file.mp3');
    const model = 'openai/whisper-tiny';
    const testParams = [
      {
        name: 'Passing file path',
        params: {
          projectId,
          file: audioFile,
          model,
        },
      },
      {
        name: 'Passing file path with language',
        params: {
          projectId,
          file: audioFile,
          model,
          language: 'fr',
        },
      },
      {
        name: 'Passing file itself as ReadStream',
        params: {
          projectId,
          file: createReadStream(audioFile),
          model,
        },
        isNegative: true,
      },
    ];
    test.each(testParams)(`$name`, async ({ params, isNegative }) => {
      const res = await service.transcribeAudio(params);
      expect(res.status).toBe(200);
      expect(res.result.model).toBe(model);
      if (isNegative) {
        expect(res.result.text.toLowerCase()).not.toMatch(/the ending was terrific/);
      } else {
        expect(res.result.text.toLowerCase()).toMatch(/the ending was terrific/);
      }
    });
  });
});
