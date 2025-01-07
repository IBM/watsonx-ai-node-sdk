import { textGeneration } from '../example_list_models_and_generate_text';
import { textGenerationStream } from '../example_prompt_generate_stream_text';
import { promptTextGeneration } from '../example_prompt_generate_text';
import { tokenizeInput } from '../example_tokenize_input';

(async () => {
  await textGeneration();
  await promptTextGeneration();
  await textGenerationStream();
  await tokenizeInput();
})();
