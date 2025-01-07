import { basicChat } from '../example_chat';
import { chatWithImage } from '../example_chat_image';
import { streamChat } from '../example_chat_stream';
import { chatWithTools } from '../example_chat_tools';

(async () => {
  await basicChat();
  await chatWithImage();
  await streamChat();
  await chatWithTools();
})();
