/**
 * (C) Copyright IBM Corp. 2020.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { Readable } = require('stream');
const { getSdkHeaders, ObjectTransformStream } = require('../../dist/lib/common');

const streamToArray = async (stream) => {
  const result = [];
  for await (const chunk of stream) {
    result.push(chunk);
  }
  return result;
};

describe('Tests of Common Library', () => {
  describe('getSdkHeaders', () => {
    test('should return correct User-Agent header', () => {
      const headers = getSdkHeaders('service1', 'v1', 'operation1');
      expect(headers).not.toBeNull();
      expect(headers['User-Agent']).toMatch(/^autogen-node-sdk\/.*/);
    });
  });

  describe('Streaming', () => {
    test('Parses a single chunk with id, event, and data', async () => {
      const input = `id: 1\nevent: message\ndata: {"text":"hello"}\n\n`;
      const stream = Readable.from([input]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([
        {
          id: 1,
          event: 'message',
          data: { text: 'hello' },
        },
      ]);
    });

    test('Parses multiple messages in one chunk', async () => {
      const input = `id: 1\nevent: a\ndata: {"a":1}\n\nid: 2\nevent: b\ndata: {"b":2}\n\n`;
      const stream = Readable.from([input]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([
        { id: 1, event: 'a', data: { a: 1 } },
        { id: 2, event: 'b', data: { b: 2 } },
      ]);
    });

    test('Ignores malformed lines', async () => {
      const input = `id: 1\nevent: weird\nno_colon_line\ndata: {"x":1}\n\n`;
      const stream = Readable.from([input]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([{ id: 1, event: 'weird', data: { x: 1 } }]);
    });

    test('Ignores invalid JSON in data', async () => {
      const input = `id: 1\nevent: invalid\ndata: {invalidJson}\n\n`;
      const stream = Readable.from([input]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([{ id: 1, event: 'invalid' }]);
    });

    test('Handles partial chunks across writes', async () => {
      const stream = Readable.from([`id: 1\nevent: part\ndata: {`, `"foo":"bar"}\n\n`]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([{ id: 1, event: 'part', data: { foo: 'bar' } }]);
    });

    test('Handles correct chunks and then partial chunks across writes', async () => {
      const stream = Readable.from([
        `id: 1\nevent: part\ndata: {`,
        `"foo":"bar"}\n\n`,
        `id: 2\nevent: message\ndata: {"text":"hello"}\n\n`,
        `id: 3\nevent: message\ndata: {"text":"hello"}\n\n`,
        `id: 4\nevent: part\ndata: {`,
        `"foo":"bar"}\n\n`,
        `id: 5\nevent: part\ndata: {`,
        `"foo":"b`,
        `ar"}\n\n`,
        `id: 6\nevent: message\ndata: {"text":"hello"}\n\n`,
        `id: 7\nevent: message\ndata: {"text":"hello"}\n\n`,
      ]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([
        { id: 1, event: 'part', data: { foo: 'bar' } },
        { id: 2, event: 'message', data: { text: 'hello' } },
        { id: 3, event: 'message', data: { text: 'hello' } },
        { id: 4, event: 'part', data: { foo: 'bar' } },
        { id: 5, event: 'part', data: { foo: 'bar' } },
        { id: 6, event: 'message', data: { text: 'hello' } },
        { id: 7, event: 'message', data: { text: 'hello' } },
      ]);
    });

    test('Handle partial chunks combined with gull chunks', async () => {
      const stream = Readable.from([
        `id: 1\nevent: message\ndata: {"text":"hello"}\n\nid: 2\nevent: part\ndata: {`,
        `"foo":"bar"}\n\n`,
      ]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([
        { id: 1, event: 'message', data: { text: 'hello' } },
        { id: 2, event: 'part', data: { foo: 'bar' } },
      ]);
    });
  });
});
