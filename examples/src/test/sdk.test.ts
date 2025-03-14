describe('Test examples', () => {
  test('Text generation', async () => {
    await expect(import('../sdk/example_list_models_and_generate_text')).resolves.not.toThrow();
  });
  test('Generate text with prompt', async () => {
    await expect(import('../sdk/example_prompt_generate_text')).resolves.not.toThrow();
  });
  test('Stream generated text', async () => {
    await expect(import('../sdk/example_prompt_generate_stream_text')).resolves.not.toThrow();
  });
  test('Tokenize input', async () => {
    await expect(import('../sdk/example_tokenize_input')).resolves.not.toThrow();
  });
  test.skip(
    'Prompt and infere',
    async () => {
      await expect(import('../sdk/example_prompt_tuning')).resolves.not.toThrow();
    },
    60000 * 10
  );
  test('Basic chat generation', async () => {
    await expect(import('../sdk/example_chat')).resolves.not.toThrow();
  });
  test('Chat with image', async () => {
    await expect(import('../sdk/example_chat_image')).resolves.not.toThrow();
  });
  test('Chat stream', async () => {
    await expect(import('../sdk/example_chat_stream')).resolves.not.toThrow();
  });
  test('Chat with tools', async () => {
    await expect(import('../sdk/example_chat_tools')).resolves.not.toThrow();
  });
  test('Basic embeddings generation', async () => {
    await expect(import('../sdk/example_generate_embeddings')).resolves.not.toThrow();
  });
  test('Basic rerank usage', async () => {
    await expect(import('../sdk/example_rerank')).resolves.not.toThrow();
  });
  // This test takes around 40min. Only to be run on local machine
  test.skip(
    'Instruct Lab flow',
    async () => {
      await expect(import('../sdk/example_instruct_lab')).resolves.not.toThrow();
    },
    60000 * 40
  );
  test('Time series', async () => {
    await expect(import('../sdk/example_time_series')).resolves.not.toThrow();
  });
  test(
    'Text extraction',
    async () => {
      await expect(import('../sdk/example_text_extraction')).resolves.not.toThrow();
    },
    60000 * 4
  );
});
