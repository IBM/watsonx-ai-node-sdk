const { NoAuthAuthenticator } = require('ibm-cloud-sdk-core');
const { Gateway, Chat, Embeddings } = require('../../../dist/gateway/gateway');
const { GenerateTextCompletions } = require('../../../dist/gateway/completions');
const { Models } = require('../../../dist/gateway/models');
const { Providers } = require('../../../dist/gateway/providers');
const { Policies } = require('../../../dist/gateway/policies');

const url = 'https://us-south.ml.cloud.ibm.com';
const version = '2023-07-07';

describe('Gateway', () => {
  describe('Init instance', () => {
    test('Init gateway', async () => {
      const gateway = new Gateway({
        version,
        serviceUrl: url,
        authenticator: new NoAuthAuthenticator(),
      });

      expect(gateway).toBeInstanceOf(Gateway);
      expect(gateway.completion).toBeInstanceOf(GenerateTextCompletions);
      expect(gateway.chat).toBeInstanceOf(Chat);
      expect(gateway.embeddings).toBeInstanceOf(Embeddings);
      expect(gateway.models).toBeInstanceOf(Models);
      expect(gateway.providers).toBeInstanceOf(Providers);
      expect(gateway.policies).toBeInstanceOf(Policies);
    });
  });
});
