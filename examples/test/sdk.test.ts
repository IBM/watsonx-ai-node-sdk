const examples: [string, string][] = [
  ['Text generation', 'example_list_models_and_generate_text.ts'],
  ['Generate text with prompt', 'example_prompt_generate_text.ts'],
  ['Stream generated text', 'example_prompt_generate_stream_text.ts'],
  ['Tokenize input', 'example_tokenize_input.ts'],
  ['Basic chat generation', 'example_chat.ts'],
  ['Chat with image', 'example_chat_image.ts'],
  ['Chat stream', 'example_chat_stream.ts'],
  ['Chat with tools', 'example_chat_tools.ts'],
  ['Basic embeddings generation', 'example_generate_embeddings.ts'],
  ['Basic rerank', 'example_rerank.ts'],
  ['Timeseries', 'example_time_series.ts'],
  ['Text extraction', 'example_text_extraction.ts'],
  ['Tookit', 'example_toolkit.ts'],
];

const longRunningExamples: [string, string][] = [
  ['Prompt and infere', 'example_prompt_tuning.ts'],
  ['Instruct Lab flow', 'example_instruct_lab.ts'],
];

describe('Test examples', () => {
  test.each(examples)('%s', async (_, file) => {
    await expect(import(`../src/sdk/${file}`)).resolves.not.toThrow();
  });
  describe.skip('Long running tests', () => {
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
