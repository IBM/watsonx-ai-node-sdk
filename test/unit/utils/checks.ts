import unitTestUtils from '@ibm-cloud/sdk-test-utilities';

const { getOptions, checkUrlAndMethod, checkMediaHeaders } = unitTestUtils as any;

interface RequestOptions {
  url: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  expectedBody?: Record<string, any>;
  expectedPath?: Record<string, any>;
  expectedQs?: Record<string, any>;
}

interface CheckRequestParams {
  request: RequestOptions;
  method: string;
  version?: string;
  requestMock: jest.Mock | jest.SpyInstance;
}

interface CheckRequestPartsParams {
  request: {
    url: string;
    signal: AbortSignal;
    headers?: Record<string, string>;
    skipBodyCheck?: boolean;
    expectedBody?: Record<string, any>;
    expectedQs?: Record<string, any>;
    expectedPath?: Record<string, any>;
  };
  method: string;
  requestMock: jest.Mock | jest.SpyInstance;
}

function checkAxiosOptions(
  createRequestMock: jest.Mock | jest.SpyInstance | null,
  signal?: AbortSignal | null
): void {
  if (!createRequestMock) throw new Error('createRequestMock is not defined');
  const { axiosOptions } = createRequestMock.mock.calls[0][0].defaultOptions;

  expect(axiosOptions.signal).toEqual(signal);
}

function checkRequestBase({
  request,
  method,
  requestMock,
}: {
  request: Pick<RequestOptions, 'url' | 'signal' | 'headers'> & { skipBodyCheck?: boolean };
  method: string;
  requestMock: jest.Mock | jest.SpyInstance;
}): ReturnType<typeof getOptions> {
  const { url, signal = null, headers = {}, skipBodyCheck = false } = request;
  const { 'Accept': expectedAccept, 'Content-Type': expectedContentType } = headers;

  const mockRequestOptions = getOptions(requestMock);

  checkUrlAndMethod(mockRequestOptions, url, method);

  if (!skipBodyCheck && (expectedAccept !== undefined || expectedContentType !== undefined)) {
    checkMediaHeaders(requestMock, expectedAccept, expectedContentType);
  }

  checkAxiosOptions(requestMock, signal);

  return mockRequestOptions;
}

/**
 * Validates HTTP request parameters against expected values by checking body, path, and query
 * string parameters independently.
 *
 * @example
 *   checkRequest({
 *   request: {
 *   url: '/v1/text/chat',
 *   expectedBody: { model_id: 'meta-llama/llama-3-70b-instruct', messages: [...] },
 *   signal,
 *   headers
 *   },
 *   method: 'POST',
 *   requestMock: createRequestMock
 *   });
 *
 * @param request - Request options containing expectedBody, expectedPath, and/or expectedQs
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param version - Optional API version to be added to query string
 * @param requestMock - Jest mock or spy for the request
 */
const checkRequest = ({ request, method, version, requestMock }: CheckRequestParams): void => {
  const { expectedBody, expectedPath, expectedQs } = request;
  const mockRequestOptions = checkRequestBase({ request, method, requestMock });

  const { qs, path, body } = mockRequestOptions;

  // Body validation
  if (expectedBody !== undefined) {
    if (Array.isArray(body)) expect(body).toEqual(expectedBody);
    else {
      const filteredBody = body
        ? Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined))
        : {};
      expect(filteredBody).toEqual(expectedBody);
    }
  }

  // Path validation
  if (expectedPath !== undefined) {
    const filteredPath = path
      ? Object.fromEntries(Object.entries(path).filter(([_, value]) => value !== undefined))
      : {};
    expect(filteredPath).toEqual(expectedPath);
  }

  // Query String validation
  if (expectedQs !== undefined) {
    const filteredQs = qs
      ? Object.fromEntries(Object.entries(qs).filter(([_, value]) => value !== undefined))
      : {};
    const expectedQsWithVersion = version !== undefined ? { ...expectedQs, version } : expectedQs;
    expect(filteredQs).toEqual(expectedQsWithVersion);
  }
};
const checkRequestParts = ({ request, method, requestMock }: CheckRequestPartsParams): void => {
  const { expectedBody, expectedQs, expectedPath } = request;
  const mockRequestOptions = checkRequestBase({ request, method, requestMock });

  if (expectedBody !== undefined) {
    Object.entries(expectedBody).forEach(([key, value]) => {
      expect(mockRequestOptions.body[key]).toEqual(value);
    });
  }

  if (expectedQs !== undefined) {
    Object.entries(expectedQs).forEach(([key, value]) => {
      expect(mockRequestOptions.qs[key]).toEqual(value);
    });
  }

  if (expectedPath !== undefined) {
    Object.entries(expectedPath).forEach(([key, value]) => {
      expect(mockRequestOptions.path[key]).toEqual(value);
    });
  }
};

export { checkAxiosOptions, checkRequest, checkRequestParts };
