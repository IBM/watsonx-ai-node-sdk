const { NoAuthAuthenticator } = require('ibm-cloud-sdk-core');
const { WatsonxBaseService } = require('../../../dist/base/base');
const get_authenticator_from_environment = require('../../../dist/authentication/utils/get-authenticator-from-environment');

describe('WatsonxBaseService', () => {
  let service;
  let options;

  beforeEach(() => {
    options = {
      version: '2023-01-01',
      serviceName: 'watsonx_ai',
      authenticator: new NoAuthAuthenticator(),
    };
    service = new WatsonxBaseService(options);
  });

  test('Set default service URL if not provided', () => {
    expect(service.serviceUrl).toBe(
      WatsonxBaseService.PLATFORM_URLS_MAP[WatsonxBaseService.DEFAULT_SERVICE_URL].split('/wx')[0]
    );
  });

  test('Set provided service URL', () => {
    options.serviceUrl = 'https://custom.url.com';
    const customService = new WatsonxBaseService(options);
    expect(customService.serviceUrl).toBe('https://custom.url.com');
  });

  test('Throw an error if required parameters are missing', () => {
    delete options.version;
    expect(() => new WatsonxBaseService(options)).toThrow('Missing required parameters');
  });

  test('Use authenticator from options if provided, otherwise from environment', () => {
    const mockAuthenticator = new NoAuthAuthenticator();
    options.authenticator = mockAuthenticator;
    const serviceWithMockAuth = new WatsonxBaseService(options);
    expect(serviceWithMockAuth.authenticator).toBe(mockAuthenticator);

    options.authenticator = undefined;
    const getAuthenticatorMock = jest.spyOn(
      get_authenticator_from_environment,
      'getAuthenticatorFromEnvironment'
    );
    getAuthenticatorMock.mockImplementation(() => new NoAuthAuthenticator());
    const serviceFromEnv = new WatsonxBaseService(options);

    expect(serviceWithMockAuth.authenticator).toBeDefined();
  });

  test('Set wxServiceUrl and serviceUrl correctly based on options and defaults', () => {
    options.platformUrl = 'https://custom.platform.url';
    const customPlatformService = new WatsonxBaseService(options);
    expect(customPlatformService.wxServiceUrl).toBe('https://custom.platform.url/wx');
    expect(customPlatformService.serviceUrl).toBe('https://custom.platform.url');

    delete options.platformUrl;
    const defaultPlatformService = new WatsonxBaseService(options);
    const defaultUrl = 'https://us-south.ml.cloud.ibm.com';
    expect(defaultPlatformService.wxServiceUrl).toBe(
      WatsonxBaseService.PLATFORM_URLS_MAP[defaultUrl]
    );
    expect(defaultPlatformService.serviceUrl).toBe(
      WatsonxBaseService.PLATFORM_URLS_MAP[defaultUrl].split('/wx')[0]
    );
  });
});
