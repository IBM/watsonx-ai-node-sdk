export const examples: [string, string][] = [
  ['Chat conversations', 'chat_conversation.ts'],
  ['Chat with image', 'chat_image.ts'],
  ['Chat with tools', 'chat_tools.ts'],
  ['RAG memory vector storage', 'rag_memory_vector_store.ts'],
  ['RAG remote vector storage', 'rag_milvus.ts'],
  ['Rerank', 'rerank.ts'],
];
describe('Langchain example tests', () => {
  test.each(examples)('%s', async (_, path) => {
    await expect(import(`../src/external/langchain/${path}`)).resolves.not.toThrow();
  });
});
