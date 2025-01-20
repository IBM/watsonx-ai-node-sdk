import path from 'path';
import { readdir } from 'fs/promises';
import { chatConversation } from '../external/langchain/chat_conversation';
import { chatWithImage } from '../external/langchain/chat_image';
import { chatWithLanggraph } from '../external/langchain/chat_langgraph';
import { chatWithTools } from '../external/langchain/chat_tools';
import { rag } from '../external/langchain/rag_memory_vector_store';
import { milvusRag } from '../external/langchain/rag_milvus';
import { rerankDocuments } from '../external/langchain/rerank';

describe('Langchain example tests', () => {
  test('Chat conversations', async () => {
    await chatConversation();
  });
  test('Chat with image', async () => {
    await chatWithImage();
  });
  test('Chat with langgraph', async () => {
    await chatWithLanggraph();
  });
  test('Chat with tools', async () => {
    await chatWithTools();
  });
  test('RAG memory vector storage', async () => {
    await rag();
  });
  test('RAG remote vector storage', async () => {
    await milvusRag();
  });
  test('Rerank', async () => {
    await rerankDocuments();
  });
});
