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
const path = require('path');
const { Agent } = require('https');
const WatsonxAIMLv1 = require('../../dist/watsonx-ai-ml/vml_v1.js');
const { MockingRequest } = require('../utils/utils.js');
const auth = require('../utils/auth.js');

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

const textChatMessagesModel = {
  role: 'user',
  content: 'You are a helpful assistant.',
};
const version = '2024-05-31';
const modelId = 'meta-llama/llama-3-8b-instruct';
const messages = [textChatMessagesModel];
const projectId = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
const textChatParams = {
  modelId,
  messages,
  projectId,
};
const sendRequestCalledWith = {
  'body': {
    'apikey': undefined,
  },
  'headers': {
    'Content-Type': 'application/json',
  },
  'method': 'POST',
  'url': 'service.url/api/2.0/apikeys/token',
};

describe('Authentication with cert', () => {
  describe('Zen authentication', () => {
    const serviceUrl = 'service.url';
    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'aws';
      process.env.WATSONX_AI_SERVICE_URL = serviceUrl;
      process.env.WATSONX_AI_AUTH_URL = serviceUrl;
    });
    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_SERVICE_URL;
    });

    describe('Positive tests', () => {
      test('AWS authentication without cert', async () => {
        const instance = WatsonxAIMLv1.newInstance({
          version,
          serviceUrl,
        });
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        const sendRequestMocker = new MockingRequest(
          instance.authenticator.tokenManager.requestWrapperInstance,
          'sendRequest'
        );
        sendRequestMocker.mock(tokenResponse);
        const sendRequestMock = sendRequestMocker.functionMock;

        await instance.textChat(textChatParams);
        expect(instance).toBeDefined();
        expect(sendRequestMock).toHaveBeenCalledWith({
          options: {
            'axiosOptions': {
              'httpsAgent': undefined,
            },
            'rejectUnauthorized': true,
            ...sendRequestCalledWith,
          },
        });
        sendRequestMocker.clearMock();
      });

      test('AWS authentication with cert', async () => {
        const instance = WatsonxAIMLv1.newInstance({
          version,
          serviceUrl,
          caCert: path.join(__dirname, './cert/FakeCert.pem'),
        });
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        const sendRequestMocker = new MockingRequest(
          instance.authenticator.tokenManager.requestWrapperInstance,
          'sendRequest'
        );
        sendRequestMocker.mock(tokenResponse);
        const sendRequestMock = sendRequestMocker.functionMock;

        await instance.textChat(textChatParams);
        expect(instance).toBeDefined();
        expect(sendRequestMock).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              axiosOptions: expect.objectContaining({
                httpsAgent: expect.any(Agent),
              }),
              rejectUnauthorized: true,
              ...sendRequestCalledWith,
            }),
          })
        );
        sendRequestMocker.clearMock();
      });
    });
  });
});
