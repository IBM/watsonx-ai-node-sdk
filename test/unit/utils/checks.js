const unitTestUtils = require('@ibm-cloud/sdk-test-utilities');
const { convertExceptions } = require('./helpers');

const { getOptions, checkUrlAndMethod, checkMediaHeaders } = unitTestUtils;

function checkAxiosOptions(createRequestMock, signal) {
  const { axiosOptions } = createRequestMock.mock.calls[0][0].defaultOptions;
  expect(axiosOptions.signal).toEqual(signal);
}
const checkRequest = ({ request, method, version, requestMock, exceptions }) => {
  const { url, params, signal, headers = {} } = request;
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

module.exports = { checkAxiosOptions, checkRequest };
