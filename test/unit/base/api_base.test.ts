import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import { APIBaseService, WatsonxBaseService } from '../../../src/base';
import {
  checkRequest,
  createDescribeMethod,
  createRequestMockSetup,
  createTestServiceConfig,
} from '../utils';
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
const version = '2023-07-07';

describe('APIBaseService', () => {
  const service = new APIBaseService({
    ...createTestServiceConfig(),
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
          /Unable to create an authenticator from the environment/
        );
      });
    });
  });

  describe('methods', () => {
    const mockSetup = createRequestMockSetup();

    const describeMethod = createDescribeMethod(service, mockSetup.getMock, '', {
      version,
      assertAuthHeader: false,
    });

    describe('positive tests', () => {
      describe('Sync methods', () => {
        beforeEach(async () => {
          mockSetup.setup();
          mockSetup.mockReturnValue();
        });

        afterEach(async () => {
          mockSetup.clear();
        });

        afterAll(async () => {
          mockSetup.unmock();
        });

        describeMethod('_get', {
          method: (params: any) => service._get(params),
          callParams: {
            url: 'http://example.com/{test}',
            path: { testPath: 'testString' },
            query: { testQuery: 'testString' },
          },
          minParams: {
            url: 'http://example.com/{test}',
          },
          url: 'http://example.com/{test}',
          httpMethod: 'GET',
          headers: methodsMap._get.defaultHeaders,
          expectedPath: { testPath: 'testString' },
          expectedQs: { testQuery: 'testString' },
          noRequiredParams: true,
          skipInvalidParamsTest: true,
        });

        describeMethod('_post', {
          method: (params: any) => service._post(params),
          callParams: {
            url: 'http://example.com/{test}',
            body: { testBody: 'testString' },
            path: { testPath: 'testString' },
            query: { testQuery: 'testString' },
          },
          minParams: {
            url: 'http://example.com/{test}',
          },
          url: 'http://example.com/{test}',
          httpMethod: 'POST',
          headers: methodsMap._post.defaultHeaders,
          expectedBody: { testBody: 'testString' },
          expectedPath: { testPath: 'testString' },
          expectedQs: { testQuery: 'testString' },
          noRequiredParams: true,
          skipInvalidParamsTest: true,
        });

        describeMethod('_put', {
          method: (params: any) => service._put(params),
          callParams: {
            url: 'http://example.com/{test}',
            body: { testBody: 'testString' },
            path: { testPath: 'testString' },
            query: { testQuery: 'testString' },
          },
          minParams: {
            url: 'http://example.com/{test}',
          },
          url: 'http://example.com/{test}',
          httpMethod: 'PUT',
          headers: methodsMap._put.defaultHeaders,
          expectedBody: { testBody: 'testString' },
          expectedPath: { testPath: 'testString' },
          expectedQs: { testQuery: 'testString' },
          noRequiredParams: true,
          skipInvalidParamsTest: true,
        });

        describeMethod('_delete', {
          method: (params: any) => service._delete(params),
          callParams: {
            url: 'http://example.com/{test}',
            body: { testBody: 'testString' },
            path: { testPath: 'testString' },
            query: { testQuery: 'testString' },
          },
          minParams: {
            url: 'http://example.com/{test}',
          },
          url: 'http://example.com/{test}',
          httpMethod: 'DELETE',
          headers: methodsMap._delete.defaultHeaders,
          expectedBody: { testBody: 'testString' },
          expectedPath: { testPath: 'testString' },
          expectedQs: { testQuery: 'testString' },
          noRequiredParams: true,
          skipInvalidParamsTest: true,
        });
      });

      describe('Async methods', () => {
        beforeEach(() => {
          mockSetup.setup();
          mockSetup.mockReturnValue({
            result: [
              'id: 1\nevent: message\ndata: {}\n\n',
              'id: 2\nevent: message\ndata: {}\n\n',
              'id: 3\nevent: message\ndata: {}\n\n',
            ],
          });
        });

        afterEach(() => {
          mockSetup.clear();
        });

        afterAll(() => {
          mockSetup.unmock();
        });

        describeMethod(
          '_postStream',
          {
            method: (params: any) => service._postStream(params),
            callParams: {
              url: 'http://example.com/{test}',
              query: { test: 'testString' },
              body: { test: 'testString' },
              returnObject: true,
            },
            minParams: {
              url: 'http://example.com/{test}',
            },
            url: 'http://example.com/{test}',
            httpMethod: 'POST',
            headers: methodsMap._postStream.defaultHeaders,
            expectedBody: { test: 'testString' },
            expectedQs: { test: 'testString' },
            isStream: true,
            noRequiredParams: true,
            skipInvalidParamsTest: true,
          },
          {
            streamResult: [
              'id: 1\nevent: message\ndata: {}\n\n',
              'id: 2\nevent: message\ndata: {}\n\n',
              'id: 3\nevent: message\ndata: {}\n\n',
            ],
          }
        );

        // Additional test for string stream output (returnObject: false)
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
            request: {
              expectedBody: body,
              expectedQs: query,
              headers,
              signal,
              url,
            },
            requestMock: mockSetup.getMock(),
            method,
            version,
          });

          expect(response).toBeInstanceOf(Promise);

          const stream = await response;
          for await (const chunk of stream) {
            expect(typeof chunk).toBe('string');
          }
        });
      });
    });
  });
});
