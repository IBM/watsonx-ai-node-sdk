import { rag } from '../rag_memory_vector_store';
import { milvusRag } from '../rag_milvus';

(async () => {
  await rag();
  await milvusRag();
})();
