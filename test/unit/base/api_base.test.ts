import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import { APIBaseService, WatsonxBaseService } from '../../../src/base';
import { MockingRequest } from '../../utils/utils';
import { checkRequest } from '../utils/checks';
import { WatsonXAI } from '../../../src';

const methodsMap = {
  '_post': {
    method: 'POST',
    defaultHeaders: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  },
  '_get': { method: 'GET', defaultHeaders: { 'Accept': 'application/json' } },
  '_put': {
    method: 'PUT',
    defaultHeaders: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  },
  '_delete': {
    method: 'DELETE',
    defaultHeaders: { 'Content-Type': 'application/json' },
  },
  '_postStream': {
    method: 'POST',
    defaultHeaders: {
      'Accept': 'text/event-stream',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
    },
  },
};
const serviceUrl = 'https://us-south.ml.cloud.ibm.com';
const version = '2023-07-07';

describe('APIBaseService', () => {
  const service = new APIBaseService({
    url: serviceUrl,
    version,
    authenticator: new NoAuthAuthenticator(),
  });

  describe('constructor', () => {
    describe('positive tests', () => {
      test('APIBaseService to extend WatsonxBaseService', () => {
        expect(service).toBeInstanceOf(WatsonxBaseService);
      });

      test('Platform url passed in options instead of env variables', async () => {
        const platformUrl = 'https://platform.url.ibm.com';
        const testService = new APIBaseService({
          version: '1',
          platformUrl,
          authenticator: new NoAuthAuthenticator(),
        });
        expect(testService['baseOptions'].platformUrl).toBe(platformUrl);
        expect(testService.serviceUrl).toBe(platformUrl);
        expect(testService.wxServiceUrl).toBe(platformUrl + '/wx');
      });
    });

    describe('negative tests', () => {
      test('Service url is not specified', async () => {
        expect(async () => WatsonXAI.newInstance({})).rejects.toThrow(
          /Missing required parameters: version/
        );
      });
    });
  });

  describe('methods', () => {
    const createRequestMocker = new MockingRequest(service, 'createRequest' as any); // private method
    let createRequestMock: jest.SpyInstance;
    describe('positive tests', () => {
      describe('Sync methods', () => {
        beforeEach(async () => {
          createRequestMocker.mock(async () => ({}));
          if (createRequestMocker.functionMock)
            createRequestMock = createRequestMocker.functionMock;
          else throw new Error('Unable to mock request. Please check your implementation');
        });

        afterEach(async () => {
          createRequestMocker.clearMock();
        });

        afterAll(async () => {
          createRequestMocker.unmock();
        });

        const methods = [
          {
            name: 'Test for _get method',
            params: {
              url: 'http://example.com/{test}',
              path: { testPath: 'testString' },
              query: { testQuery: 'testString' },
            },
            callableMethod: service._get.bind(service),
          },
          {
            name: 'Test for _put method',
            params: {
              url: 'http://example.com/{test}',
              body: { testBody: 'testString' },
              path: { testPath: 'testString' },
              query: { testQuery: 'testString' },
            },
            callableMethod: service._put.bind(service),
          },
          {
            name: 'Test for _delete method',
            params: {
              url: 'http://example.com/{test}',
              body: { testBody: 'testString' },
              path: { testPath: 'testString' },
              query: { testQuery: 'testString' },
            },
            callableMethod: service._delete.bind(service),
          },
          {
            name: 'Test for _post method',
            params: {
              url: 'http://example.com/{test}',
              body: { testBody: 'testString' },
              path: { testPath: 'testString' },
              query: { testQuery: 'testString' },
            },
            callableMethod: service._post.bind(service),
          },
        ];

        test.each(methods)('$name', async ({ params, callableMethod }) => {
          const { signal } = new AbortController();
          callableMethod({ signal, ...params });
          const methodsMapsKeys = Object.keys(methodsMap);
          const [, callableMethodName] = callableMethod.name.split(' ');
          if (!methodsMapsKeys.includes(callableMethodName))
            throw new Error('methodName is not a key of methodsMap');
          const methodName = callableMethodName as keyof typeof methodsMap;
          const { method, defaultHeaders: headers } = methodsMap[methodName];
          const { url, ...restParams } = params;
          const { query, path, body } = restParams;
          // include all props
          checkRequest({
            request: { params: { ...query, ...path, ...body }, headers, signal, url },
            requestMock: createRequestMock,
            method,
            version,
          });

          createRequestMock.mockClear();

          const responseNoSignal = callableMethod({ url, headers });
          /** Do not include optional props */
          checkRequest({
            request: { params: {}, headers, url },
            requestMock: createRequestMock,
            method,
            version,
          });

          expect(responseNoSignal).toBeInstanceOf(Promise);
        });

        test.each(methods)('$name without payload', async ({ callableMethod }) => {
          // @ts-expect-error required input
          await expect(callableMethod()).rejects.toThrow(/Input is required/);
        });
      });

      describe('Async methods', () => {
        beforeEach(async () => {
          createRequestMocker.mock(async () => ({
            result: [
              'id: 1\nevent: message\ndata: {}\n\n',
              'id: 2\nevent: message\ndata: {}\n\n',
              'id: 3\nevent: message\ndata: {}\n\n',
            ][Symbol.iterator](),
          }));
          if (createRequestMocker.functionMock)
            createRequestMock = createRequestMocker.functionMock;
          else throw new Error('Unable to mock request. Please check your implementation');
        });

        afterEach(async () => {
          createRequestMocker.clearMock();
        });

        afterAll(() => {
          createRequestMocker.unmock();
        });

        test('_postStream as object', async () => {
          const params = {
            url: 'http://example.com/{test}',
            query: { test: 'testString' },
            body: { test: 'testString' },
            signal: new AbortController().signal,
            returnObject: true,
          };
          const response = service._postStream(params);
          const methodName = '_postStream';

          const { method, defaultHeaders: headers } = methodsMap[methodName];
          const { signal, url, ...restParams } = params;
          const { query = {}, body = {} } = restParams;

          checkRequest({
            request: { params: { ...query, ...body }, headers, signal, url },
            requestMock: createRequestMock,
            method,
            version,
          });

          expect(response).toBeInstanceOf(Promise);

          const stream = await response;
          for await (const chunk of stream) {
            expect(chunk).toBeInstanceOf(Object);
          }
        });

        test('_postStream without optional props ', async () => {
          const params = {
            url: 'http://example.com/{test}',
          };
          const response = service._postStream(params);
          const methodName = '_postStream';

          const { method, defaultHeaders: headers } = methodsMap[methodName];
          const { url } = params;

          checkRequest({
            request: { headers, url },
            requestMock: createRequestMock,
            method,
            version,
          });

          expect(response).toBeInstanceOf(Promise);

          const stream = await response;
          for await (const chunk of stream) {
            expect(chunk).toBeInstanceOf(Object);
          }
        });

        test('_postStream as string', async () => {
          const params = {
            url: 'http://example.com/{test}',
            query: { test: 'testString' },
            body: { test: 'testString' },
            signal: new AbortController().signal,
            returnObject: false,
          };
          const response = service._postStream(params);
          const methodName = '_postStream';

          const { method, defaultHeaders: headers } = methodsMap[methodName];
          const { signal, url, ...restParams } = params;
          const { query = {}, body = {} } = restParams;

          checkRequest({
            request: { params: { ...query, ...body }, headers, signal, url },
            requestMock: createRequestMock,
            method,
            version,
          });

          expect(response).toBeInstanceOf(Promise);

          const stream = await response;
          for await (const chunk of stream) {
            expect(typeof chunk).toBe('string');
          }
        });

        test('_postStream name without payload', async () => {
          // @ts-expect-error required input
          await expect(service._postStream()).rejects.toThrow(/Input is required/);
        });
      });
    });
  });
});
