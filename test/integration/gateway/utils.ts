import type { Models, Providers } from '../../../src/gateway';
import type { RateLimits } from '../../../src/gateway/ratelimit';

const providerCleanup = async (providers: Providers, providerId: string | undefined) => {
  if (!providerId) return;
  try {
    await providers.delete({
      providerId,
    });
  } catch (e) {
    console.error(`Unable to delete provider with id: ${providerId}\n`, e);
  }
};

const modelCleanup = async (models: Models, modelId: string | undefined) => {
  if (!modelId) return;
  try {
    await models.delete({ modelId });
  } catch (e) {
    console.error(`Unable to delete model with id: ${modelId}\n`, e);
  }
};
const rateLimitCleanup = async (rateLimits: RateLimits, rateLimitId: string | undefined) => {
  if (!rateLimitId) return;
  try {
    await rateLimits.delete({ rateLimitId });
  } catch (e) {
    console.error(`Unable to delete rateLimit with id: ${rateLimitId}\n`, e);
  }
};
export { providerCleanup, modelCleanup, rateLimitCleanup };
