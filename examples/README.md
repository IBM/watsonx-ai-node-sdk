## Examples

In this directory, you can find examples how to use IBM watsonx.ai Node.js SDK in different scenarios.

### Run examples

To try examples locally, clone the repository. Once done please follow these steps.
1. ```cd ./examples```
2. ```npm install```
3. Modify ```../credentials/watsonx_ai_ml_vml_v1.env.template``` file content with your variables and run ```git mv ../credentials/watsonx_ai_ml_vml_v1.env.template ../credentials/watsonx_ai_ml_vml_v1.env``` to rename the file (Depending on the authentication method you may use another file in that location)
4. You can run the examples now with ```npm run run-ts src/<file_path>/<file_name>.js```
5. Also we have provided combined examples that can be run with additional commands:

| Examples | Command |
|---|---|
| Text generation | ```npm run text_generation``` |
| Embeddings | ```npm run embeddings``` |
| Prompt tuning | ```npm run prompt_tuning``` |
| Chat | ```npm run chat``` |
| Rerank| ```npm run rerank``` |
| All short running | ```npm run all``` |
| All long running | ```npm run all-ext``` |
| Chat conversations | ```npm run langchain-chat``` |
| Chat with image input | ```npm run langchain-chat-image``` |
| Chat with tools | ```npm run langgraph-tools``` |
| Chat with langgraph | ```npm run langchain-langgraph-tools``` |
| Embedding storage with Chroma and questions (RAG) | ```npm run langgraph-rag":``` |
| Rerank with langchain | ```npm run langchain-rerank``` |
| All langgraph short running | ```npm run all-langchain``` |
| All langgraph long running | ```npm run all-langchain-ext``` |


### List of examples
#### SDK
| Name | Description | Link |
|---|---|---|
| Model querying & inference | This example shows how to list&filter models available in IBM watsonx.ai service and shows how to perform simple model inference. | [link](./src/sdk/example_list_models_and_generate_text.ts) |
| Prompts & model inference | This example shows how to store&deploy a prompt template and then use it for model inference. | [link](./src/sdk/example_prompt_generate_text.ts) |
| Prompts & text streaming | This example shows how to store&deploy a prompt template and then use it for streaming text. | [link](./src/sdk/example_prompt_generate_stream_text.ts) |
| Prompt tuning & model inference | This example shows how to tune model via prompt tuning technique in IBM watsonx.ai service and shows are to deploy&infer deployed tuned model. | [link](./src/sdk/example_prompt_tuning.ts) |
| Text tokenization  | This example shows how to convert your input text to list of tokens and how different models performs tokenization in a different way. | [link](./src/sdk/example_tokenize_input.ts) |
| Text embeddings  | This example shows how to list all available embedding models in IBM watsonx.ai service and convert your input text into embedding vector using different models. | [link](./src/sdk/example_generate_embeddings.ts) |
| Chat with history | This example shows how to perform a simple inference with chat, including chat history. | [link](./src/sdk/example_chat.ts) |
| Chat streaming with history  | This example shows how to perform a simple inference with chat, including chat history and model output is recived as a stream of strings and a stream of objects. | [link](./src/sdk/example_chat_stream.ts) |
| Chat with tools  | This example shows usage of chat with tools applied. In this case two tools are passed to a model and choice can be made between these two. | [link](./src/sdk/example_chat_tools.ts) |
| Chat with image as input  | This example shows a use case of non-string input to chat model. An image from a url is passed to a model with question about the image. | [link](./src/sdk/example_chat_image.ts) |
| Rerank | This example shows a use case of rerank method that allows user to input some data chunks that will be reranked and will recieve individual score regarding on how well they meet the provided query | [link](./src/sdk/example_rerank.ts) |

#### Langchain

| Name | Description | Link |
|---|---|---|
| Chat conversation | This example presents 4 usages of chat such as simple invoke or chat with conversation | [link](./src/external/langchain/chat_conversation.ts) |
| Chat with image input | This example shows a chat invoke with image as an input | [link](./src/external/langchain/chat_image.ts) |
| Chat with tools | This example presents usage of chat with simple, own created tools.| [link](./src/external//langchain/chat_tools.ts) |
| Chat with langgraph | This example shows usage of langchain tool function with langgraph and agents. Also external tools are presented in the last steps such as TavilySearch. | [link](./src/external/langchain/chat_langgraph.ts) |
| Embedding storage with Chroma and questions (RAG) | This example shows how to build a RAG application with usage of Chroma, some data and questions regarding the data. | [link](./src/sdk/example_tokenize_input.ts) |
| Rerank | This example presents a rerank solution with usage of vectorStorage and inbuild langchain splitters and loaders | [link](./src/external/langchain/rerank.ts) |
