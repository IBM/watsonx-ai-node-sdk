import { Gateway, Chat, Embeddings } from '../../../src/gateway';
import { GenerateTextCompletions } from '../../../src/gateway/completions';
import { Models } from '../../../src/gateway/models';
import { Providers } from '../../../src/gateway';
import { Policies } from '../../../src/gateway';
import { createTestServiceConfig, createRequestMockSetup } from '../utils';
import { describeInstanceLevelContainerIds } from './helpers';

// ─── Mock Setup ───────────────────────────────────────────────────────────────

const mockSetup = createRequestMockSetup();

// ─── Shared Test Fixtures ─────────────────────────────────────────────────────

describe('Gateway', () => {
  beforeAll(() => {
    mockSetup.setup();
  });

  beforeEach(() => {
    mockSetup.getMock().mockImplementation(() => Promise.resolve({ result: {} }));
  });

  afterEach(() => {
    mockSetup.reset();
  });

  describe('Init instance', () => {
    test('Init gateway', async () => {
      const gateway = new Gateway({
        ...createTestServiceConfig(),
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

  describe('Container ID Headers', () => {
    const httpMethods: Array<{
      name: string;
      method: (svc: Gateway) => Promise<any>;
    }> = [
      {
        name: '_get',
        method: (svc) => svc._get({ url: '/test' }),
      },
      {
        name: '_post',
        method: (svc) => svc._post({ url: '/test', body: {} }),
      },
      {
        name: '_put',
        method: (svc) => svc._put({ url: '/test', body: {} }),
      },
      {
        name: '_delete',
        method: (svc) => svc._delete({ url: '/test' }),
      },
    ];

    describeInstanceLevelContainerIds({
      describeName: 'Gateway api methods',
      getRequestMock: mockSetup.getMock,
      methods: httpMethods,
    });
  });
});
