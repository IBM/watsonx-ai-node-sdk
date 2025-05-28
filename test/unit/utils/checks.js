function checkAxiosOptions(createRequestMock, signal) {
  const { axiosOptions } = createRequestMock.mock.calls[0][0].defaultOptions;
  expect(axiosOptions.signal).toEqual(signal);
}

module.exports = { checkAxiosOptions };
