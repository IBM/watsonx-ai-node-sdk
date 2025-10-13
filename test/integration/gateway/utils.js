const setupSecretManager = async (gateway) => {
  try {
    await gateway.setSecretsManager({ secretsManager: process.env.WATSONX_AI_SECRETS_MANAGER });
  } catch (e) {
    expect(e.code).toBe(400);
    expect(e.result.error.message).toBe('tenant already exists');
  }
};

const providerCleanup = async (providers, providerId) => {
  if (!providerId) return;
  try {
    await providers.delete({
      providerId,
    });
  } catch (e) {
    console.error(`Unable to delete provider with id: ${providerId}\n`, e);
  }
};

const modelCleanup = async (models, modelId) => {
  if (!modelId) return;
  try {
    await models.delete({ modelId });
  } catch (e) {
    console.error(`Unable to delete model with id: ${modelId}\n`, e);
  }
};
module.exports = { setupSecretManager, providerCleanup, modelCleanup };
