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
const { WatsonXAI } = require('../../dist/vml_v1.js');
const authHelper = require('../resources/auth-helper.js');
const { MockingRequest } = require('../utils/utils.js');
const {
  JWTRequestBaseAuthenticator,
} = require('../../dist/authentication/utils/authenticators.js');
const auth = require('../utils/auth.js');
const authenticators = require('../../dist/authentication/index.js');
const { wait } = require('../utils/utils.js');

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
  'url':
    'https://account-iam.awsg.usge1.private.platform.prep.ibmforusgov.com/api/2.0/apikeys/token',
};

describe('Authentication unit tests', () => {
  describe('Zen authentication', () => {
    const requestTokenMocker = new MockingRequest(auth, 'requestAdminToken');
    let requestTokenMock;
    const serviceUrl = 'https://cpd.cp.fyre.ibm.com';
    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'zen';
    });
    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        requestTokenMocker.mock();
        requestTokenMock = requestTokenMocker.functionMock;
      });
      afterEach(() => {
        requestTokenMocker.clearMock();
      });
      test('Multiple requests with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: auth.requestAdminToken,
        });

        expect(instance).toBeDefined();
        expect(instance.getAuthenticator()).toBeInstanceOf(JWTRequestBaseAuthenticator);

        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(requestTokenMock).toHaveBeenCalledTimes(1);

        const chatSecondCall = instance.textChat(textChatParams);
        expect(chatSecondCall).toBeInstanceOf(Promise);
        expect(requestTokenMock).toHaveBeenCalledTimes(1);
      });

      test('Multiple requests each after token has expired', async () => {
        const tokenValidationTime = 10; // in miliseconds
        requestTokenMocker.mock();
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: () => auth.requestAdminToken({ time: `${tokenValidationTime}ms` }),
        });

        expect(instance).toBeDefined();

        for (let i = 1; i <= 3; i += 1) {
          const chatFirstCall = instance.textChat(textChatParams);
          expect(chatFirstCall).toBeInstanceOf(Promise);
          expect(requestTokenMock).toHaveBeenCalledTimes(i);
          await wait(tokenValidationTime + 10); // adding extra 10ms to catch token expiration
        }
      });
    });
    describe('Negative tests', () => {
      test('Request with invalid token', async () => {
        requestTokenMocker.mock({
          result: {
            access_token: 'NotAJWT.not_a_token.def_not_a_token',
          },
        });

        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: auth.requestAdminToken,
        });

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);
        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(requestTokenMock).toHaveBeenCalledTimes(1);

        requestTokenMocker.unmock();
      });

      test('Instance creation without requestToken function', async () => {
        const initInstance = () =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
          });
        expect(initInstance).toThrow(
          'requestToken function not provided. This function is necessary for zen authentication.'
        );
      });

      test('Instance creation with with resuestToken function and wrong auth type', async () => {
        const oldAuthType = process.env.WATSONX_AI_AUTH_TYPE;
        process.env.WATSONX_AI_AUTH_TYPE = 'iam';
        const initInstance = () =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            requestToken: auth.requestAdminToken,
          });
        expect(initInstance).toThrow('requestToken function is only valid for zen authentication');
        process.env.WATSONX_AI_AUTH_TYPE = oldAuthType;
      });
    });
  });
  describe('IAM cloud authentication', () => {
    const serviceUrl = 'https://us-south.ml.cloud.ibm.com';

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'iam';
      process.env.WATSONX_AI_APIKEY = 'testString';
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_APIKEY;
    });
    const iamRequestTokenMocker = new MockingRequest(
      authenticators.IamTokenManager.prototype,
      'requestToken'
    );

    describe('Positive tests', () => {
      let iamRequestTokenMock;

      beforeEach(async () => {
        const tokenResponse = await auth.requestAdminToken();
        iamRequestTokenMocker.mock(tokenResponse);
        iamRequestTokenMock = iamRequestTokenMocker.functionMock;
      });

      afterEach(() => {
        iamRequestTokenMocker.clearMock();
      });

      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });
        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.IamAuthenticator);
        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(iamRequestTokenMock).toHaveBeenCalledTimes(1);
      });
    });
    describe('Negative tests', () => {
      afterEach(() => {
        process.env.WATSONX_AI_APIKEY = 'testString';
      });
      test('Request with invalid token', async () => {
        iamRequestTokenMocker.mock({
          result: {
            access_token: 'NotAJWT.not_a_token.def_not_a_token',
          },
        });
        const iamRequestTokenMock = iamRequestTokenMocker.functionMock;
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);
        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(iamRequestTokenMock).toHaveBeenCalledTimes(1);

        iamRequestTokenMocker.unmock();
      });
      test('Instance creation with no apikey', async () => {
        delete process.env.WATSONX_AI_APIKEY;
        expect(() =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
          })
        ).toThrow('Missing required parameters: apikey');
      });
    });
  });
  describe('IBM watsonx.ai software authentication', () => {
    const serviceUrl = 'https://cpd.cp.fyre.ibm.com';

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'cp4d';
      process.env.WATSONX_AI_USERNAME = 'testUsername';
      process.env.WATSONX_AI_PASSWORD = 'testPassword';
      process.env.WATSONX_AI_URL = serviceUrl;
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_USERNAME;
      delete process.env.WATSONX_AI_PASSWORD;
      delete process.env.WATSONX_AI_URL;
    });

    const cp4dRequestTokenMocker = new MockingRequest(
      authenticators.Cp4dTokenManager.prototype,
      'requestToken'
    );

    describe('Positive tests', () => {
      let iamRequestTokenMock;

      beforeEach(async () => {
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        cp4dRequestTokenMocker.mock(tokenResponse);
        iamRequestTokenMock = cp4dRequestTokenMocker.functionMock;
      });

      afterEach(() => {
        cp4dRequestTokenMocker.clearMock();
      });

      test('Request with valid token', async () => {
        process.env.WATSONX_AI_PASSWORD = 'testPassword';
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });
        expect(instance.getAuthenticator()).toBeInstanceOf(
          authenticators.CloudPakForDataAuthenticator
        );
        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(iamRequestTokenMock).toHaveBeenCalledTimes(1);
        delete process.env.WATSONX_AI_PASSWORD;
      });
      test('Instance creation and request with apikey instead of password', async () => {
        process.env.WATSONX_AI_APIKEY = 'testApikey';
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(iamRequestTokenMock).toHaveBeenCalledTimes(1);
        delete process.env.WATSONX_AI_APIKEY;
      });
    });
    describe('Negative tests', () => {
      test('Request with invalid token', async () => {
        process.env.WATSONX_AI_PASSWORD = 'testPassword';

        cp4dRequestTokenMocker.mock({
          result: {
            token: 'NotAJWT.not_a_token.def_not_a_token',
          },
        });
        const cp4dRequestTokenMock = cp4dRequestTokenMocker.functionMock;
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);
        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(cp4dRequestTokenMock).toHaveBeenCalledTimes(1);

        cp4dRequestTokenMocker.unmock();
      });

      test('Instance creation with no password and no apikey', async () => {
        delete process.env.WATSONX_AI_PASSWORD;

        expect(() =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
          })
        ).toThrow('Exactly one of `apikey` or `password` must be specified.');
      });
      test('Instance creation with both apikey and password', async () => {
        process.env.WATSONX_AI_APIKEY = 'testApikey';
        process.env.WATSONX_AI_PASSWORD = 'testPassword';
        expect(() =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
          })
        ).toThrow('Exactly one of `apikey` or `password` must be specified.');
        delete process.env.WATSONX_AI_APIKEY;
        delete process.env.WATSONX_AI_PASSWORD;
      });
    });
  });
  describe('Bearer token authentication', () => {
    const serviceUrl = 'https://us-south.ml.cloud.ibm.com';

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'bearertoken';
      process.env.WATSONX_AI_BEARER_TOKEN = 'fakeToken';
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_BEARER_TOKEN;
    });

    describe('Positive tests', () => {
      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.BearerTokenAuthenticator);
      });
    });
  });
  describe('AWS authentication', () => {
    const serviceUrl = 'https://ap-south-1.aws.wxai.ibm.com';
    const requestTokenMocker = new MockingRequest(
      authenticators.AWSTokenManager.prototype,
      'requestToken'
    );
    let requestTokenMock;
    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'aws';
      process.env.WATSONX_AI_APIKEY = 'fakeAPIKey';
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_APIKEY;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        requestTokenMocker.mock(tokenResponse);
        requestTokenMock = requestTokenMocker.functionMock;
      });
      afterEach(() => {
        requestTokenMocker.unmock();
      });
      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const chatFirstCall = instance.textChat(textChatParams);
        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.AWSAuthenticator);
      });
    });
  });
});

describe('Authentication with cert', () => {
  describe('AWS cert authentication', () => {
    const serviceUrl = 'https://wxai.prep.ibmforusgov.com';
    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = 'aws';
    });
    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
    });

    describe('Positive tests', () => {
      test('AWS authentication without cert', async () => {
        const instance = WatsonXAI.newInstance({
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
        const instance = WatsonXAI.newInstance({
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

      test('Pass auth url as env variable', async () => {
        process.env.WATSONX_AI_AUTH_URL = 'https://test.ibm.com/test/authentication/url';
        const instance = WatsonXAI.newInstance({
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
          'options': {
            'axiosOptions': {
              'httpsAgent': undefined,
            },
            'body': {
              'apikey': undefined,
            },
            'headers': {
              'Content-Type': 'application/json',
            },
            'method': 'POST',
            'rejectUnauthorized': true,
            'url': 'https://test.ibm.com/test/authentication/url',
          },
        });
        delete process.env.WATSONX_AI_AUTH_URL;
        sendRequestMocker.clearMock();
      });
    });
  });
});
