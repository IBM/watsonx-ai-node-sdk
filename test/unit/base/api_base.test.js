const sdkCorePackage = require('ibm-cloud-sdk-core');
const { APIBaseService, WatsonxBaseService } = require('../../../dist/base/base');
const { MockingRequest } = require('../../utils/utils');
const { checkRequest } = require('../utils/checks');

const { NoAuthAuthenticator } = sdkCorePackage;

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
    test('APIBaseService to extend WatsonxBaseService', () => {
      expect(service).toBeInstanceOf(WatsonxBaseService);
    });
  });

  describe('methods', () => {
    const createRequestMocker = new MockingRequest(service, 'createRequest');
    let createRequestMock;

    describe('Sync methods', () => {
      beforeEach(async () => {
        createRequestMocker.mock(Promise.resolve({}));
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock({});
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
        const response = callableMethod({ signal, ...params });
        const [, methodName] = callableMethod.name.split(' ');
        const { method, defaultHeaders: headers } = methodsMap[methodName];
        const { url, ...restParams } = params;
        const { query = {}, path = {}, body = {} } = restParams;

        checkRequest({
          request: { params: { ...query, ...path, ...body }, headers, signal, url },
          requestMock: createRequestMock,
          method,
          version,
        });

        expect(response).toBeInstanceOf(Promise);
      });

      test.each(methods)('$name without payload', async ({ callableMethod }) => {
        await expect(callableMethod()).rejects.toThrow(/Input is required/);
      });
    });

    describe('Async methods', () => {
      beforeEach(async () => {
        createRequestMocker.mock(
          Promise.resolve({
            result: [
              'id: 1\nevent: message\ndata: {}\n\n',
              'id: 2\nevent: message\ndata: {}\n\n',
              'id: 3\nevent: message\ndata: {}\n\n',
            ][Symbol.iterator](),
          })
        );
        createRequestMock = createRequestMocker.functionMock;
      });

      afterEach(async () => {
        createRequestMocker.clearMock({});
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
        const { query = {}, path = {}, body = {} } = restParams;

        checkRequest({
          request: { params: { ...query, ...path, ...body }, headers, signal, url },
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
        const { query = {}, path = {}, body = {} } = restParams;

        checkRequest({
          request: { params: { ...query, ...path, ...body }, headers, signal, url },
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
        await expect(service._postStream()).rejects.toThrow(/Input is required/);
      });
    });
  });
});
