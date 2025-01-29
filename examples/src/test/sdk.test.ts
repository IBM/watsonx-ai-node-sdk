import { config } from 'dotenv';
import { basicChat } from '../sdk/example_chat';
import { chatWithImage } from '../sdk/example_chat_image';
import { streamChat } from '../sdk/example_chat_stream';
import { chatWithTools } from '../sdk/example_chat_tools';
import { basicEmbeddings } from '../sdk/example_generate_embeddings';
import { textGeneration } from '../sdk/example_list_models_and_generate_text';
import { textGenerationStream } from '../sdk/example_prompt_generate_stream_text';
import { promptTextGeneration } from '../sdk/example_prompt_generate_text';
import { tokenizeInput } from '../sdk/example_tokenize_input';
import { promptTuning } from '../sdk/example_prompt_tuning';
import { instructLabFlow } from '../sdk/example_instruct_lab';
import { rerankDocuments } from '../sdk/example_rerank';

config({ path: '../../../credentials/watsonx_ai_ml_vml_v1.env' });
describe('Test examples', () => {
  test('Text generation', async () => {
    await textGeneration();
  });
  test('Generate text with prompt', async () => {
    await promptTextGeneration();
  });
  test('Stream generated text', async () => {
    await textGenerationStream();
  });
  test('Tokenize input', async () => {
    await tokenizeInput();
  });
  test.skip(
    'Prompt and infere',
    async () => {
      await promptTuning();
    },
    60000 * 10
  );
  test('Basic chat generation', async () => {
    await basicChat();
  });
  test('Chat with image', async () => {
    await chatWithImage();
  });
  test('Chat stream', async () => {
    await streamChat();
  });
  test('Chat with tools', async () => {
    await chatWithTools();
  });
  test('Basic embeddings generation', async () => {
    await basicEmbeddings();
  });
  test('Basic rerank usage', async () => {
    await rerankDocuments();
  });
  //This test takes around 40min. Only to be run on local machine
  test.skip(
    'Instruct Lab flow',
    async () => {
      await instructLabFlow();
    },
    60000 * 40
  );
});
