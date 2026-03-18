import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import { Gateway, Chat, Embeddings } from '../../../src/gateway';
import { GenerateTextCompletions } from '../../../src/gateway/completions';
import { Models } from '../../../src/gateway/models';
import { Providers } from '../../../src/gateway';
import { Policies } from '../../../src/gateway';

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
