describe('Langchain example tests', () => {
  test('Chat conversations', async () => {
    try {
      await import('../external/langchain/chat_conversation');
    } catch (e) {
      console.log(e);
    }
  });
  test('Chat with image', async () => {
    await expect(import('../external/langchain/chat_image')).resolves.not.toThrow();
  });
  test('Chat with langgraph', async () => {
    await expect(import('../external/langchain/chat_langgraph')).resolves.not.toThrow();
  });
  test('Chat with tools', async () => {
    await expect(import('../external/langchain/chat_tools')).resolves.not.toThrow();
  });
  test('RAG memory vector storage', async () => {
    await expect(import('../external/langchain/rag_memory_vector_store')).resolves.not.toThrow();
  });
  test('RAG remote vector storage', async () => {
    await expect(import('../external/langchain/rag_milvus')).resolves.not.toThrow();
  });
  test('Rerank', async () => {
    await expect(import('../external/langchain/rerank')).resolves.not.toThrow();
  });
});
