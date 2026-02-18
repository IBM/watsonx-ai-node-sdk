import type { BaseMessage } from '@langchain/core/messages';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';

const printNested = (obj: { [key: string]: any }, indent = 1) => {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      console.log(`${' '.repeat(indent)}${key}: {`);
      printNested(obj[key], indent + 2);
      console.log(`${' '.repeat(indent)}}`);
    } else {
      console.log(' '.repeat(indent) + key + ': ' + obj[key]);
    }
  }
};

export const conversationPrinter = (
  conversation: (AIMessage | HumanMessage | ToolMessage | SystemMessage | BaseMessage)[]
) => {
  conversation.forEach((message) => {
    if (message instanceof AIMessage) {
      console.log('==================== AI Message ====================\n');
      if (message.content !== '') console.log(message.content);
      else if (message?.tool_calls && message?.tool_calls?.length > 0) {
        message?.tool_calls.forEach((toolCall) => {
          console.log('Tool name: ' + toolCall.name);
          console.log('Args: ');
          printNested(toolCall.args);
        });
      }
    } else if (message instanceof HumanMessage) {
      console.log('=================== Human Message ===================\n');
      if (message.content.length > 1) {
        if (typeof message.content === 'string') {
          console.log(message.content);
        } else {
          message.content.forEach((item) => {
            if ('text' in item) console.log(item.text);
            else if ('image_url' in item) console.log('[Image]');
          });
        }
      } else console.log(message.content);
    } else if (message instanceof ToolMessage) {
      console.log('=================== Tool Message ===================\n');
      console.log('Tool name: ' + message.name);
      console.log('Result: ' + message.content);
    } else if (message instanceof SystemMessage) {
      console.log('=================== System Message ===================\n');
      console.log('Result: ' + message.content);
    }
    console.log('');
  });
};
