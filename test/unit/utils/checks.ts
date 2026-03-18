import unitTestUtils from '@ibm-cloud/sdk-test-utilities';
import { convertExceptions } from './helpers';

const { getOptions, checkUrlAndMethod, checkMediaHeaders } = unitTestUtils as any;

interface RequestOptions {
  url: string;
  params?: Record<string, any>;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

interface CheckRequestParams {
  request: RequestOptions;
  method: string;
  version: string;
  requestMock: jest.Mock | jest.SpyInstance;
  exceptions?: Record<string, string>;
}

function checkAxiosOptions(
  createRequestMock: jest.Mock | jest.SpyInstance | null,
  signal?: AbortSignal | null
): void {
  if (!createRequestMock) throw new Error('createRequestMock is not defined');
  const { axiosOptions } = createRequestMock.mock.calls[0][0].defaultOptions;

  expect(axiosOptions.signal).toEqual(signal);
}

const checkRequest = ({
  request,
  method,
  version,
  requestMock,
  exceptions,
}: CheckRequestParams): void => {
  const { url, params, signal = null, headers = {} } = request;
  const { 'Accept': expectedAccept, 'Content-Type': expectedContentType } = headers;

  const mockRequestOptions = getOptions(requestMock);

  const { qs, path, body } = mockRequestOptions;
  const actualParams = { ...qs, ...path, ...body };

  checkUrlAndMethod(mockRequestOptions, url, method);
  checkMediaHeaders(requestMock, expectedAccept, expectedContentType);
  checkAxiosOptions(requestMock, signal);

  if (exceptions) {
    convertExceptions(actualParams, exceptions);
  }

  expect({ ...params, version }).toEqual(actualParams);
};

export { checkAxiosOptions, checkRequest };
