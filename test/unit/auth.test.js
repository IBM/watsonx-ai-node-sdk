/**
 * (C) Copyright IBM Corp. 2025.
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

/* eslint-disable no-await-in-loop */
const WatsonxAIMLv1 = require('../../dist/watsonx-ai-ml/vml_v1.js');
const authHelper = require('../resources/auth-helper.js');
const { MockingRequest } = require('../utils/auth.js');
const auth = require('../utils/auth.js');
const { wait } = require('../utils/utils.js');

process.env.WATSONX_AI_AUTH_TYPE = 'zen';
jest.mock('axios', () => {
  const axios = jest.createMockFromModule('axios');
  const mockAxiosInstance = jest.fn();
  mockAxiosInstance.mockImplementation(() => Promise.resolve());
  mockAxiosInstance.defaults = {
    headers: {
      post: {},
      put: {},
      patch: {},
    },
  };
  axios.create = jest.fn(() => mockAxiosInstance);
  return axios;
});

authHelper.loadEnv();

const textChatMessagesModel = {
  role: 'user',
  content: 'You are a helpful assistant.',
};

const modelId = 'meta-llama/llama-3-8b-instruct';
const messages = [textChatMessagesModel];
const projectId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
const textChatParams = {
  modelId,
  messages,
  projectId,
};

const requestTokenMocker = new MockingRequest(auth, 'requestAdminToken');

describe('Zen authentication', () => {
  describe('Positive tests', () => {
    test('Multiple calls with valid token', async () => {
      requestTokenMocker.mock();

      const instance = WatsonxAIMLv1.newInstance({
        version: '2024-05-31',
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
        requestToken: auth.requestAdminToken,
      });

      expect(instance).toBeDefined();
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(0);

      const chatFirstCall = instance.textChat(textChatParams);
      expect(chatFirstCall).toBeInstanceOf(Promise);
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(1);

      const chatSecondCall = instance.textChat(textChatParams);
      expect(chatSecondCall).toBeInstanceOf(Promise);
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(1);

      requestTokenMocker.unmock();
    });

    test('Multiple calls each after token has expired', async () => {
      const tokenValidationTime = 10; // in miliseconds
      requestTokenMocker.mock();
      const instance = WatsonxAIMLv1.newInstance({
        version: '2024-05-31',
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
        requestToken: () => auth.requestAdminToken(`${tokenValidationTime}ms`),
      });

      expect(instance).toBeDefined();
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(0);

      for (let i = 1; i <= 3; i += 1) {
        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(auth.requestAdminToken).toHaveBeenCalledTimes(i);
        await wait(tokenValidationTime + 10);
      }

      requestTokenMocker.unmock();
    });
  });
  describe('Negative tests', () => {
    test('Invalid token', async () => {
      requestTokenMocker.mock({
        result: {
          access_token: 'NotAJWT.not_a_token.def_not_a_token',
        },
      });

      const instance = WatsonxAIMLv1.newInstance({
        version: '2024-05-31',
        serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
        requestToken: auth.requestAdminToken,
      });

      expect(instance).toBeDefined();
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(0);

      const chatCall = instance.textChat(textChatParams);
      expect(chatCall).toBeInstanceOf(Promise);
      await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
      expect(auth.requestAdminToken).toHaveBeenCalledTimes(1);

      requestTokenMocker.unmock();
    });

    test('No requestToken function', async () => {
      const initInstance = () =>
        WatsonxAIMLv1.newInstance({
          version: '2024-05-31',
          serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
        });
      expect(initInstance).toThrow(
        'requestToken function not provided. This function is necessary for zen authentication.'
      );
    });

    test('Wrong auth type', async () => {
      process.env.WATSONX_AI_AUTH_TYPE = 'iam';
      const initInstance = () =>
        WatsonxAIMLv1.newInstance({
          version: '2024-05-31',
          serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
          requestToken: auth.requestAdminToken,
        });
      expect(initInstance).toThrow('requestToken function is only valid for zen authentication');
      process.env.WATSONX_AI_AUTH_TYPE = 'zen';
    });
  });
});
