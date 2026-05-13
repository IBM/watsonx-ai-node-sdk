/**
 * (C) Copyright IBM Corp. 2025-2026.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import * as path from 'path';
import { Agent } from 'https';
import { WatsonXAI } from '../../src/vml_v1';
import * as authenticators from '../../src/authentication';
import { getAuthenticatorFromEnvironment as getAuthenticatorFromEnvironmenCore } from '../../src/authentication';
import {
  JWTRequestBaseAuthenticator,
  AWSAuthenticator,
} from '../../src/authentication/utils/authenticators';
import type { RequestTokenResponse } from '../../src/authentication/utils/authenticators';
import { getAuthenticatorFromEnvironment } from '../../src/authentication/utils/get-authenticator-from-environment';
import { wait } from '../utils/utils';
import * as auth from '../utils/auth';
import * as sdkCore from 'ibm-cloud-sdk-core';
import { createMockSetup } from './utils';

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
const CERT_PATH = './cert/FakeCert.pem';
const INVALID_CERT_PATH = './cert/NonExistentCert.pem';
const IAM_AUTH_TYPE = 'iam';
const ZEN_AUTH_TYPE = 'zen';
const CPD_AUTH_TYPE = 'cp4d';
const AWS_AUTH_TYPE = 'aws';
const TEST_API_KEY = 'testApiKey';
const TEST_USERNAME = 'testUsername';
const TEST_PASSWORD = 'testPassword';
const TEST_BEARER_TOKEN = 'testBearerToken';

const createBaseServiceMock = () => {
  return createMockSetup({
    target: sdkCore.BaseService.prototype as any,
    method: 'createRequest' as any,
    returnValue: async function (this: any, parameters: any) {
      // Allow authentication to proceed by calling the authenticator
      if (this.authenticator && this.authenticator.authenticate) {
        await this.authenticator.authenticate(parameters.defaultOptions);
      }
      // Return mocked response instead of making actual HTTP call
      return Promise.resolve({ result: {} });
    },
  });
};

describe('Authentication unit tests', () => {
  describe('Zen authentication', () => {
    const serviceUrl = 'https://cpd.cp.fyre.ibm.com';
    const authMockSetup = createMockSetup({
      target: auth,
      method: 'requestAdminToken',
      returnValue: auth.requestAdminToken(),
    });

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = ZEN_AUTH_TYPE;
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        await authMockSetup.setup();
      });

      afterEach(() => {
        authMockSetup.clear();
      });

      test('Multiple requests with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: () => auth.requestAdminToken() as Promise<RequestTokenResponse>,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance).toBeDefined();
        expect(instance.getAuthenticator()).toBeInstanceOf(JWTRequestBaseAuthenticator);

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(authMockSetup.getMock()).toHaveBeenCalledTimes(1);

        const chatSecondCall = instance.textChat(textChatParams);

        expect(chatSecondCall).toBeInstanceOf(Promise);
        expect(authMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
      });

      test('Multiple requests each after token has expired', async () => {
        const tokenValidationTime = 10; // in miliseconds
        // Clear the shared mock and set up a new one for this test
        authMockSetup.unmock();

        const expiringTokenMockSetup = createMockSetup({
          target: auth,
          method: 'requestAdminToken',
          returnValue: auth.requestAdminToken({ time: `${tokenValidationTime}ms` }),
        });
        await expiringTokenMockSetup.setup();

        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: () =>
            auth.requestAdminToken({
              time: `${tokenValidationTime}ms`,
            }) as Promise<RequestTokenResponse>,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance).toBeDefined();

        for (let i = 1; i <= 3; i += 1) {
          const chatFirstCall = instance.textChat(textChatParams);

          expect(chatFirstCall).toBeInstanceOf(Promise);
          expect(expiringTokenMockSetup.getMock()).toHaveBeenCalledTimes(i);

          await wait(tokenValidationTime + 10); // adding extra 10ms to catch token expiration
        }

        createRequestMock.unmock();
        expiringTokenMockSetup.unmock();
      });
    });

    describe('Negative tests', () => {
      test('Request with invalid token', async () => {
        const invalidAuthMockSetup = createMockSetup({
          target: auth,
          method: 'requestAdminToken',
          returnValue: Promise.resolve({
            result: {
              access_token: 'NotAJWT.not_a_token.def_not_a_token',
            },
          }),
        });
        await invalidAuthMockSetup.setup();

        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          requestToken: () => auth.requestAdminToken() as Promise<RequestTokenResponse>,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);

        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(invalidAuthMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
        invalidAuthMockSetup.unmock();
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
        process.env.WATSONX_AI_AUTH_TYPE = IAM_AUTH_TYPE;
        const initInstance = () =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            requestToken: () => auth.requestAdminToken() as Promise<RequestTokenResponse>,
          });

        expect(initInstance).toThrow('requestToken function is only valid for zen authentication');

        process.env.WATSONX_AI_AUTH_TYPE = oldAuthType;
      });
    });
  });

  describe('IAM cloud authentication', () => {
    const serviceUrl = 'https://us-south.ml.cloud.ibm.com';
    const authMockSetup = createMockSetup({
      target: authenticators.IamTokenManager.prototype,
      method: 'requestToken' as any,
      returnValue: auth.requestAdminToken(),
    });

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = IAM_AUTH_TYPE;
      process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_APIKEY;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        await authMockSetup.setup();
      });

      afterEach(() => {
        authMockSetup.clear();
      });

      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.IamAuthenticator);

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(authMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
      });
    });

    describe('Negative tests', () => {
      afterEach(() => {
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
      });

      test('Request with invalid token', async () => {
        const invalidAuthMockSetup = createMockSetup({
          target: authenticators.IamTokenManager.prototype,
          method: 'requestToken' as any,
          returnValue: Promise.resolve({
            result: {
              access_token: 'NotAJWT.not_a_token.def_not_a_token',
            },
          }),
        });
        await invalidAuthMockSetup.setup();

        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);

        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(invalidAuthMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
        invalidAuthMockSetup.unmock();
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
      test('Instance creation with no apikey and authType', async () => {
        delete process.env.WATSONX_AI_APIKEY;
        delete process.env.WATSONX_AI_AUTH_TYPE;
        process.env.WATSONX_AI_TEST = 'username';

        expect(() =>
          WatsonXAI.newInstance({
            version,
            serviceUrl,
          })
        ).toThrow(
          'authType and apiKey cannot be undefined! Please specify an authType or an apikey'
        );
        delete process.env.WATSONX_AI_TEST;
        process.env.WATSONX_AI_AUTH_TYPE = IAM_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
      });
    });
  });

  describe('IBM watsonx.ai software authentication', () => {
    const serviceUrl = 'https://cpd.cp.fyre.ibm.com';
    const authMockSetup = createMockSetup({
      target: authenticators.Cp4dTokenManager.prototype,
      method: 'requestToken' as any,
      returnValue: auth.requestAdminToken({ tokenName: 'token' }),
    });

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = CPD_AUTH_TYPE;
      process.env.WATSONX_AI_USERNAME = TEST_USERNAME;
      process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;
      process.env.WATSONX_AI_URL = serviceUrl;
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_USERNAME;
      delete process.env.WATSONX_AI_PASSWORD;
      delete process.env.WATSONX_AI_URL;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        await authMockSetup.setup();
      });

      afterEach(() => {
        authMockSetup.clear();
      });

      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance.getAuthenticator()).toBeInstanceOf(
          authenticators.CloudPakForDataAuthenticator
        );

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(authMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
      });

      test('Instance creation and request with apikey instead of password', async () => {
        delete process.env.WATSONX_AI_PASSWORD;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(authMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
        delete process.env.WATSONX_AI_APIKEY;
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;
      });

      test('Accept `authDisableSsl` and set `disableSslVerification` as its state', () => {
        process.env.WATSONX_AI_AUTH_DISABLE_SSL = 'true';

        const originalConstructor = sdkCore.CloudPakForDataAuthenticator;
        const cp4dAuthenticatorSpy = jest
          .spyOn(sdkCore, 'CloudPakForDataAuthenticator')
          .mockImplementation((options: any) => {
            return new originalConstructor(options);
          });

        WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        expect(cp4dAuthenticatorSpy).toHaveBeenCalledTimes(1);
        expect(cp4dAuthenticatorSpy).toHaveBeenCalledWith({
          authType: CPD_AUTH_TYPE,
          username: TEST_USERNAME,
          password: TEST_PASSWORD,
          url: 'https://cpd.cp.fyre.ibm.com/icp4d-api/v1/authorize',
          disableSslVerification: true,
        });

        cp4dAuthenticatorSpy.mockRestore();
        delete process.env.WATSONX_AI_AUTH_DISABLE_SSL;
      });
    });

    describe('Negative tests', () => {
      test('Request with invalid token', async () => {
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;

        const invalidAuthMockSetup = createMockSetup({
          target: authenticators.Cp4dTokenManager.prototype,
          method: 'requestToken' as any,
          returnValue: Promise.resolve({
            result: {
              token: 'NotAJWT.not_a_token.def_not_a_token',
            },
          }),
        });
        await invalidAuthMockSetup.setup();

        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        expect(instance).toBeDefined();

        const chatCall = instance.textChat(textChatParams);

        expect(chatCall).toBeInstanceOf(Promise);
        await expect(chatCall).rejects.toThrow('Access token received is not a valid JWT');
        expect(invalidAuthMockSetup.getMock()).toHaveBeenCalledTimes(1);

        createRequestMock.unmock();
        invalidAuthMockSetup.unmock();
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
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;

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
      process.env.WATSONX_AI_BEARER_TOKEN = TEST_BEARER_TOKEN;
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

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.BearerTokenAuthenticator);

        createRequestMock.unmock();
      });
    });
  });

  describe('AWS authentication', () => {
    const serviceUrl = 'https://ap-south-1.aws.wxai.ibm.com';
    const authMockSetup = createMockSetup({
      target: authenticators.AWSTokenManager.prototype,
      method: 'requestToken' as any,
      returnValue: auth.requestAdminToken({ tokenName: 'token' }),
    });

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
      process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
    });

    afterAll(() => {
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_APIKEY;
    });

    describe('Positive tests', () => {
      beforeEach(async () => {
        await authMockSetup.setup();
      });

      afterEach(() => {
        authMockSetup.unmock();
      });

      test('Request with valid token', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        const chatFirstCall = instance.textChat(textChatParams);

        expect(chatFirstCall).toBeInstanceOf(Promise);
        expect(instance.getAuthenticator()).toBeInstanceOf(authenticators.AWSAuthenticator);

        createRequestMock.unmock();
      });
    });
  });
});

describe('Authentication with cert', () => {
  describe('AWS cert authentication', () => {
    const serviceUrl = 'https://wxai.prep.ibmforusgov.com';

    beforeAll(() => {
      process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
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
        const sendRequestMockSetup = createMockSetup({
          target: instance['authenticator'].tokenManager.requestWrapperInstance,
          method: 'sendRequest',
          returnValue: Promise.resolve(tokenResponse),
        });
        await sendRequestMockSetup.setup();

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        await instance.textChat(textChatParams);

        expect(instance).toBeDefined();
        expect(sendRequestMockSetup.getMock()).toHaveBeenCalledWith({
          options: {
            'axiosOptions': {
              'httpsAgent': undefined,
            },
            'rejectUnauthorized': true,
            ...sendRequestCalledWith,
          },
        });

        createRequestMock.unmock();
        sendRequestMockSetup.unmock();
      });

      test('AWS authentication with cert', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          caCert: path.join(__dirname, CERT_PATH),
        });
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        const sendRequestMockSetup = createMockSetup({
          target: instance['authenticator'].tokenManager.requestWrapperInstance,
          method: 'sendRequest',
          returnValue: Promise.resolve(tokenResponse),
        });
        await sendRequestMockSetup.setup();

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        await instance.textChat(textChatParams);

        expect(instance).toBeDefined();
        expect(sendRequestMockSetup.getMock()).toHaveBeenCalledWith(
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

        createRequestMock.unmock();
        sendRequestMockSetup.unmock();
      });

      test('AWS authentication with cert object for auth', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          caCert: {
            auth: { path: path.join(__dirname, CERT_PATH) },
          },
        });
        const sendRequestMockSetup = createMockSetup({
          target: instance['authenticator'].tokenManager.requestWrapperInstance,
          method: 'sendRequest',
          returnValue: auth.requestAdminToken({ tokenName: 'token' }),
        });
        await sendRequestMockSetup.setup();

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        await instance.textChat(textChatParams);

        expect(instance).toBeDefined();
        expect(sendRequestMockSetup.getMock()).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              axiosOptions: expect.objectContaining({
                httpsAgent: expect.any(Agent),
              }),
              rejectUnauthorized: true,
            }),
          })
        );

        createRequestMock.unmock();
        sendRequestMockSetup.unmock();
      });

      test('AWS authentication with auth, service, and dataplatform certs', async () => {
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
          caCert: {
            auth: { path: path.join(__dirname, CERT_PATH) },
            service: { path: path.join(__dirname, CERT_PATH) },
            dataplatform: { path: path.join(__dirname, CERT_PATH) },
          },
        });
        const sendRequestMockSetup = createMockSetup({
          target: instance['authenticator'].tokenManager.requestWrapperInstance,
          method: 'sendRequest',
          returnValue: auth.requestAdminToken({ tokenName: 'token' }),
        });
        await sendRequestMockSetup.setup();

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        await instance.textChat(textChatParams);

        expect(instance).toBeDefined();
        expect(instance.httpsAgentMap.service).toBeInstanceOf(Agent);
        expect(instance.httpsAgentMap.dataplatform).toBeInstanceOf(Agent);
        expect(sendRequestMockSetup.getMock()).toHaveBeenCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              axiosOptions: expect.objectContaining({
                httpsAgent: expect.any(Agent),
              }),
            }),
          })
        );

        createRequestMock.unmock();
        sendRequestMockSetup.unmock();
      });

      test('Pass auth url as env variable', async () => {
        process.env.WATSONX_AI_AUTH_URL = 'https://test.ibm.com/test/authentication/url';
        const instance = WatsonXAI.newInstance({
          version,
          serviceUrl,
        });
        const tokenResponse = await auth.requestAdminToken({ tokenName: 'token' });
        const sendRequestMockSetup = createMockSetup({
          target: instance['authenticator'].tokenManager.requestWrapperInstance,
          method: 'sendRequest',
          returnValue: Promise.resolve(tokenResponse),
        });
        await sendRequestMockSetup.setup();

        const createRequestMock = createBaseServiceMock();
        await createRequestMock.setup();

        await instance.textChat(textChatParams);

        expect(instance).toBeDefined();
        expect(sendRequestMockSetup.getMock()).toHaveBeenCalledWith({
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
        createRequestMock.unmock();
        sendRequestMockSetup.unmock();
      });
    });

    describe('Negative tests', () => {
      test('AWS authentication with invalid cert path throws error', async () => {
        expect(() => {
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            caCert: path.join(__dirname, INVALID_CERT_PATH),
          });
        }).toThrow();
      });

      test('AWS authentication with invalid service cert path throws error', async () => {
        expect(() => {
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            caCert: {
              service: { path: path.join(__dirname, INVALID_CERT_PATH) },
            },
          });
        }).toThrow();
      });

      test('AWS authentication with invalid dataplatform cert path throws error', async () => {
        expect(() => {
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            caCert: {
              dataplatform: { path: path.join(__dirname, INVALID_CERT_PATH) },
            },
          });
        }).toThrow();
      });

      test('AWS authentication with invalid auth cert path throws error', async () => {
        expect(() => {
          WatsonXAI.newInstance({
            version,
            serviceUrl,
            caCert: {
              auth: { path: path.join(__dirname, INVALID_CERT_PATH) },
            },
          });
        }).toThrow();
      });
    });
  });

  describe('getAuthenticatorFromEnvironment unit tests', () => {
    const serviceName = 'WATSONX_AI';

    afterEach(() => {
      // Clean up environment variables after each test
      delete process.env.WATSONX_AI_AUTH_TYPE;
      delete process.env.WATSONX_AI_APIKEY;
      delete process.env.WATSONX_AI_USERNAME;
      delete process.env.WATSONX_AI_PASSWORD;
      delete process.env.WATSONX_AI_URL;
      delete process.env.WATSONX_AI_BEARER_TOKEN;
      delete process.env.WATSONX_AI_AUTH_URL;
      delete process.env.WATSONX_AI_AUTH_DISABLE_SSL;
    });

    describe('Error handling', () => {
      test('throws error when serviceName is not provided', () => {
        expect(() => getAuthenticatorFromEnvironment({ serviceName: '' })).toThrow(
          'Service name is required.'
        );
      });

      test('throws error when no credentials found in environment', () => {
        // When no credentials are found, readExternalSources returns null
        // Note: This test may behave differently depending on environment setup
        expect(() =>
          getAuthenticatorFromEnvironment({ serviceName: 'NONEXISTENT_SERVICE' })
        ).toThrow();
      });

      test('throws error for invalid auth type', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'invalid_auth_type';
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        expect(() => getAuthenticatorFromEnvironment({ serviceName })).toThrow(
          'Invalid value for AUTH_TYPE: invalid_auth_type'
        );
      });

      test('throws error for AWS auth without serviceUrl when url not in credentials', () => {
        process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        expect(() =>
          getAuthenticatorFromEnvironment({ serviceName, serviceUrl: 'https://invalid-url.com' })
        ).toThrow('No token URL is found for serviceUrl: https://invalid-url.com');
      });

      test('throws an error when no credentials found', () => {
        expect(() => getAuthenticatorFromEnvironment({ serviceName })).toThrow(
          'Unable to create an authenticator from the environment.'
        );
      });
    });

    // Note: NoAuth authenticator test is skipped due to a known issue in the implementation
    // where authType is lowercased but compared against non-lowercase constants

    describe('Basic authenticator', () => {
      test('creates BasicAuthenticator with username and password', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'basic';
        process.env.WATSONX_AI_USERNAME = TEST_USERNAME;
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.BasicAuthenticator);
      });
    });

    describe('NoAuth authenticator', () => {
      test('creates NoAuthAuthenticator', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'noAuth';

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.NoAuthAuthenticator);
      });

      test('handles case-insensitive auth type', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'NoAuth';

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.NoAuthAuthenticator);
      });
    });
    describe('BearerToken authenticator', () => {
      test('creates Authenticator', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'bearertoken';
        process.env.WATSONX_AI_BEARER_TOKEN = TEST_BEARER_TOKEN;

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.BearerTokenAuthenticator);
      });

      test('handles case-insensitive auth type', () => {
        process.env.WATSONX_AI_AUTH_TYPE = 'BearerToken';
        process.env.WATSONX_AI_BEARER_TOKEN = TEST_BEARER_TOKEN;

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.BearerTokenAuthenticator);
      });
    });

    describe('CloudPakForData authenticator', () => {
      test('creates CloudPakForDataAuthenticator with username and password', () => {
        process.env.WATSONX_AI_AUTH_TYPE = CPD_AUTH_TYPE;
        process.env.WATSONX_AI_USERNAME = TEST_USERNAME;
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;
        process.env.WATSONX_AI_URL = 'https://cpd.example.com';

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.CloudPakForDataAuthenticator);
      });

      test('appends /icp4d-api/v1/authorize to URL', () => {
        process.env.WATSONX_AI_AUTH_TYPE = CPD_AUTH_TYPE;
        process.env.WATSONX_AI_USERNAME = TEST_USERNAME;
        process.env.WATSONX_AI_PASSWORD = TEST_PASSWORD;
        process.env.WATSONX_AI_URL = 'https://cpd.example.com';

        const authenticator = getAuthenticatorFromEnvironment({
          serviceName,
        }) as authenticators.CloudPakForDataAuthenticator;

        expect(authenticator['url']).toBe('https://cpd.example.com/icp4d-api/v1/authorize');
      });
    });

    describe('IAM authenticator', () => {
      test('creates IamAuthenticator with apikey', () => {
        process.env.WATSONX_AI_AUTH_TYPE = IAM_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.IamAuthenticator);
      });

      test('defaults to IAM when apikey provided without auth type', () => {
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(authenticators.IamAuthenticator);
      });
    });

    describe('Zen authenticator', () => {
      test('creates JWTRequestBaseAuthenticator with requestToken function', () => {
        process.env.WATSONX_AI_AUTH_TYPE = ZEN_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        const requestToken = jest.fn().mockResolvedValue({
          access_token: 'test-token',
        });

        const authenticator = getAuthenticatorFromEnvironment({ serviceName, requestToken });

        expect(authenticator).toBeInstanceOf(JWTRequestBaseAuthenticator);
      });
    });

    describe('AWS authenticator', () => {
      test('creates AWSAuthenticator with apikey', () => {
        process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
        process.env.WATSONX_AI_AUTH_URL = 'https://auth.aws.example.com';

        const authenticator = getAuthenticatorFromEnvironment({ serviceName });

        expect(authenticator).toBeInstanceOf(AWSAuthenticator);
      });

      test('uses serviceUrl to determine token URL', () => {
        process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;

        const serviceUrl = 'https://ap-south-1.aws.wxai.ibm.com';
        const authenticator = getAuthenticatorFromEnvironment({ serviceName, serviceUrl });

        expect(authenticator).toBeInstanceOf(AWSAuthenticator);
      });

      test('passes httpsAgent to AWS authenticator', () => {
        process.env.WATSONX_AI_AUTH_TYPE = AWS_AUTH_TYPE;
        process.env.WATSONX_AI_APIKEY = TEST_API_KEY;
        process.env.WATSONX_AI_AUTH_URL = 'https://auth.aws.example.com';

        const httpsAgent = new Agent();
        const authenticator = getAuthenticatorFromEnvironment({
          serviceName,
          httpsAgent,
        });

        expect(authenticator).toBeInstanceOf(AWSAuthenticator);
        // httpsAgent is passed to the internal tokenManager
      });
    });

    describe('getAuthenticatorFromEnvironment from ibm-cloud-sdk-core', () => {
      test('imports from auth module', async () => {
        expect(getAuthenticatorFromEnvironmenCore).toBeDefined();
      });
    });
  });
});
