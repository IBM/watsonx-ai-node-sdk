/**
 * (C) Copyright IBM Corp. 2025-2026.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { writeFile } from 'fs/promises';

/**
 * Generates a JSONL file for batch inference testing.
 *
 * Creates a file containing multiple batch inference requests in JSONL format, where each line is a
 * valid JSON object representing a chat completion request. The function cycles through the
 * provided models and generates simple math prompts.
 *
 * @example
 *   ```typescript
 *   await generateBatchInferenceFile(
 *     10,
 *     ['meta-llama/llama-3-8b-instruct', 'ibm/granite-13b-chat-v2'],
 *     './test/batch.jsonl'
 *   );
 *   ```;
 *
 * @param numBatches - The number of batch requests to generate
 * @param models - Array of model identifiers to use (cycles through if numBatches > models.length)
 * @param file - The file path where the JSONL content will be written
 */
export const generateBatchInferenceFile = async (
  numBatches: number,
  models: string[],
  file: string
) => {
  if (models.length === 0) throw new Error('models array cannot be empty');
  const lines: string[] = [];

  for (let i = 0; i < numBatches; i++) {
    const model = models[i % models.length];
    const prompt = `What is ${i + 1} + ${i + 1}?`;
    lines.push(
      `{"custom_id": "node.js-${i}", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "${model}", "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "${prompt}"}]}}`
    );
  }

  await writeFile(file, lines.join('\n'));
};
