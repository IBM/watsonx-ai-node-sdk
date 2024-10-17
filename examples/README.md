## Examples

In this directory, you can find examples how to use IBM watsonx.ai Node.js SDK in different scenarios.

### Run examples

To try examples locally, clone the repository. Once done please follow these steps.
1. ```cd ./examples```
2. ```npm install```
3. Modify ```.env.template``` file content with your variables and rename to ```.env```
4. Open auth folder and modify ```*.env.template``` file content according to your authentication method.
5. You can run the examples now with ```node <file_name>.js```
6. Also we have provided combined examples that can be run with additional commands:

| Examples | Command | 
|---|---|
| Text generation | ```npm run text_generation``` |
| Embeddings | ```npm run embeddings``` |
| Prompt tuning | ```npm run prompt_tuning``` |
| Chat | ```npm run chat``` |
| All short running | ```npm run all``` |
| All long running | ```npm run all-ext``` |

### List of examples

| Name | Description | Link |
|---|---|---|
| Model querying & inference | This example shows how to list&filter models available in IBM watsonx.ai service and shows how to perform simple model inference. | [link](./example_list_models_and_generate_text.js) |
| Prompts & model inference | This example shows how to store&deploy a prompt template and then use it for model inference. | [link](./example_prompt_generate_text.js) |
| Prompts & text streaming | This example shows how to store&deploy a prompt template and then use it for streaming text. | [link](./example_prompt_generate_stream_text.js) |
| Prompt tuning & model inference | This example shows how to tune model via prompt tuning technique in IBM watsonx.ai service and shows are to deploy&infer deployed tuned model. | [link](./example_prompt_tuning.js) |
| Text tokenization  | This example shows how to convert your input text to list of tokens and how different models performs tokenization in a different way. | [link](./example_tokenize_input.js) |
| Text embeddings  | This example shows how to list all available embedding models in IBM watsonx.ai service and convert your input text into embedding vector using different models. | [link](./example_generate_embeddings.js) |
| Chat with history | This example shows how to perform a simple inference with chat, including chat history. | [link](./example_chat.js) |
| Chat streaming with history  | This example shows how to perform a simple inference with chat, including chat history and model output is recived as a stream of strings and a stream of objects. | [link](./example_chat_stream.js) |
| Chat with tools  | This example shows usage of chat with tools applied. In this case two tools are passed to a model and choice can be made between these two. | [link](./example_chat_tools.js) |
| Chat with image as input  | This example shows a use case of non-string input to chat model. An image from a url is passed to a model with question about the image. | [link](./example_chat_image.js) |
