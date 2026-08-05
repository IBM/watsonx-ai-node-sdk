export const examples: [string, string][] = [
  ['test chat conversations', 'chat_conversation.ts'],
  ['test chat with image', 'chat_image.ts'],
  ['test chat with langgraph', 'chat_langgraph.ts'],
  ['test chat with tools', 'chat_tools.ts'],
  ['test rag memory vector storage', 'rag_memory_vector_store.ts'],
  ['test rag remote vector storage', 'rag_milvus.ts'],
  ['test rerank', 'rerank.ts'],
  ['test deep agent', 'deep_agent.ts'],
];
describe('LangChain Examples', () => {
  test.each(examples)('%s', async (_, path) => {
    await expect(import(`../src/external/langchain/${path}`)).resolves.not.toThrow();
  });
});
