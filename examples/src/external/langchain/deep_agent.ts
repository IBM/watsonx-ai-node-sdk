import { ChatWatsonx } from '@langchain/ibm';
import { createDeepAgent, StateBackend } from 'deepagents';
import '../../utils/config.ts';
import { conversationPrinter } from './utils.ts';

const model = new ChatWatsonx({
  model: 'openai/gpt-oss-120b',
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL as string,
  projectId: process.env.WATSONX_AI_PROJECT_ID as string,
  version: '2024-05-31',
});

const agent = createDeepAgent({
  model,
  systemPrompt: `You are a coding assistant that helps to maintain and perform everyday developer's tasks.
    Act as an actual developer, create files, install common and safe packages if these are needed for the project to work correctly.`,
  // Enable this for local development to have files saved locally,
  // see: https://docs.langchain.com/oss/javascript/deepagents/backends#filesystembackend-local-disk for safety guidelines and other implementation posibilities
  // backend: new FilesystemBackend({
  //   rootDir: 'your_absolute_path',
  //   virtualMode: true,
  // }),
  backend: new StateBackend(),
});

const messages = [
  {
    role: 'user',
    content: `Create simple, ready to start server in express.js`,
  },
];

const result = await agent.stream({
  messages,
});

const files = [];

for await (const chunk of result) {
  if ('tools' in chunk) {
    const message = chunk.tools?.messages;
    conversationPrinter(message);
    files.push(chunk.tools.files);
  } else if ('model_request' in chunk) {
    const message = chunk.model_request?.messages;
    conversationPrinter(message);
  }
}

console.log('Created files:');
console.log(files);
