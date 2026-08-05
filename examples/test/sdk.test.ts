export const examples: [string, string][] = [
  ['test text generation', 'example_list_models_and_generate_text.ts'],
  ['test generate text with prompt', 'example_prompt_generate_text.ts'],
  ['test stream generated text', 'example_prompt_generate_stream_text.ts'],
  ['test tokenize input', 'example_tokenize_input.ts'],
  ['test basic chat generation', 'example_chat.ts'],
  ['test chat with image', 'example_chat_image.ts'],
  ['test chat stream', 'example_chat_stream.ts'],
  ['test chat with tools', 'example_chat_tools.ts'],
  ['test basic embeddings generation', 'example_generate_embeddings.ts'],
  ['test basic rerank', 'example_rerank.ts'],
  ['test timeseries', 'example_time_series.ts'],
  ['test text extraction', 'example_text_extraction.ts'],
  ['test toolkit', 'example_toolkit.ts'],
];

const longRunningExamples: [string, string][] = [
  ['test prompt and infer', 'example_prompt_tuning.ts'],
  ['test instruct lab flow', 'example_instruct_lab.ts'],
];

describe('SDK Examples', () => {
  test.each(examples)('%s', async (_, file) => {
    await expect(import(`../src/sdk/${file}`)).resolves.not.toThrow();
  });
  describe.skip('Long Running', () => {
    // These are long running tests. Run only on local machine in specific cases
    test.each(longRunningExamples)(
      '%s',
      async (_, file) => {
        await expect(import(`../src/sdk/${file}`)).resolves.not.toThrow();
      },
      40 * 60 * 1000
    );
  });
});
