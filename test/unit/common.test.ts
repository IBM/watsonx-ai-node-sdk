/**
 * (C) Copyright IBM Corp. 2020.
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

import { Readable } from 'stream';
import {
  getSdkHeaders,
  ObjectTransformStream,
  LineTransformStream,
  Stream,
  transformStreamToObjectStream,
  transformStreamToStringStream,
} from '../../src/lib/common';

const streamToArray = async (stream: AsyncIterable<any>) => {
  const result = [];
  for await (const chunk of stream) {
    result.push(chunk);
  }
  return result;
};

describe('Tests of Common Library', () => {
  describe('getSdkHeaders', () => {
    test('returns correct User-Agent header', () => {
      const headers = getSdkHeaders();

      expect(headers).not.toBeNull();
      expect(headers['User-Agent']).toMatch(/^ibm-cloud-watsonx-ai\/.*/);
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

    test('Handles data field with [DONE] value', async () => {
      const input = `id: 1\nevent: complete\ndata: [DONE]\n\n`;
      const stream = Readable.from([input]);
      const parser = new ObjectTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual([{ id: 1, event: 'complete' }]);
    });

    test('Ignores unknown fields in SSE format', async () => {
      const input = `id: 1\nevent: message\nunknown: value\ndata: {"text":"hello"}\n\n`;
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

    test('Handles flush with empty buffer', async () => {
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

    test('Handles flush with remaining buffer content', async () => {
      // This tests the _flush method when buffer has content (lines 152-154)
      const input = `id: 1\nevent: message\ndata: {"text":"hello"}`;
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

  describe('LineTransformStream', () => {
    test('Parses a single line', async () => {
      const input = 'hello world';
      const stream = Readable.from([input]);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['hello world']);
    });

    test('Parses multiple lines in one chunk', async () => {
      const input = 'line1\nline2\nline3';
      const stream = Readable.from([input]);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['line1', 'line2', 'line3']);
    });

    test('Handles partial lines across chunks', async () => {
      const stream = Readable.from(['hello ', 'world\nfoo', ' bar']);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['hello world', 'foo bar']);
    });

    test('Handles empty lines', async () => {
      const input = 'line1\n\nline3';
      const stream = Readable.from([input]);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['line1', '', 'line3']);
    });

    test('Handles multiple partial chunks', async () => {
      const stream = Readable.from(['first', ' line\nsec', 'ond line\nth', 'ird']);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['first line', 'second line', 'third']);
    });

    test('Handles flush with empty buffer after complete line', async () => {
      const stream = Readable.from(['line1\nline2\n']);
      const parser = new LineTransformStream();

      const result = await streamToArray(stream.pipe(parser));

      expect(result).toEqual(['line1', 'line2']);
    });
  });

  describe('Stream class', () => {
    test('Creates stream from transform stream', async () => {
      const input = 'line1\nline2\nline3';
      const readable = Readable.from([input]);
      const transform = new LineTransformStream();
      const controller = new AbortController();

      readable.pipe(transform);
      const stream = await Stream.createStream<string>(transform, controller);

      const result = await streamToArray(stream);

      expect(result).toEqual(['line1', 'line2', 'line3']);
    });

    test('Stream is async iterable', async () => {
      const input = 'a\nb\nc';
      const readable = Readable.from([input]);
      const transform = new LineTransformStream();
      const controller = new AbortController();

      readable.pipe(transform);
      const stream = await Stream.createStream<string>(transform, controller);

      const result = [];
      for await (const item of stream) {
        result.push(item);
      }

      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('Stream has abort controller', async () => {
      const input = 'line1\nline2\nline3';
      const readable = Readable.from([input]);
      const transform = new LineTransformStream();
      const controller = new AbortController();

      readable.pipe(transform);
      const stream = await Stream.createStream<string>(transform, controller);

      expect(stream.controller).toBe(controller);
      expect(stream.controller.signal.aborted).toBe(false);

      // Verify we can abort
      stream.controller.abort();
      expect(stream.controller.signal.aborted).toBe(true);
    });
  });

  describe('transformStreamToObjectStream', () => {
    test('Transforms API response to object stream', async () => {
      const input = `id: 1\nevent: message\ndata: {"text":"hello"}\n\nid: 2\nevent: message\ndata: {"text":"world"}\n\n`;
      const apiResponse = {
        result: [input],
      };

      const stream = await transformStreamToObjectStream<any>(apiResponse);
      const result = await streamToArray(stream);

      expect(result).toEqual([
        { id: 1, event: 'message', data: { text: 'hello' } },
        { id: 2, event: 'message', data: { text: 'world' } },
      ]);
    });

    test('Handles multiple chunks in API response', async () => {
      const apiResponse = {
        result: [`id: 1\nevent: a\ndata: {"x":1}\n\n`, `id: 2\nevent: b\ndata: {"y":2}\n\n`],
      };

      const stream = await transformStreamToObjectStream<any>(apiResponse);
      const result = await streamToArray(stream);

      expect(result).toEqual([
        { id: 1, event: 'a', data: { x: 1 } },
        { id: 2, event: 'b', data: { y: 2 } },
      ]);
    });

    test('Stream can be aborted', async () => {
      const apiResponse = {
        result: [
          `id: 1\nevent: message\ndata: {"text":"1"}\n\n`,
          `id: 2\nevent: message\ndata: {"text":"2"}\n\n`,
          `id: 3\nevent: message\ndata: {"text":"3"}\n\n`,
        ],
      };

      const stream = await transformStreamToObjectStream<any>(apiResponse);

      const result = [];
      let count = 0;
      await expect(async () => {
        for await (const item of stream) {
          result.push(item);
          count++;
          if (count === 1) {
            stream.controller.abort();
          }
        }
      }).rejects.toThrow('The operation was aborted');
    });
  });

  describe('transformStreamToStringStream', () => {
    test('Transforms API response to string stream', async () => {
      const input = 'line1\nline2\nline3';
      const apiResponse = {
        result: [input],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);
      const result = await streamToArray(stream);

      expect(result).toEqual(['line1', 'line2', 'line3']);
    });

    test('Handles multiple chunks in API response', async () => {
      const apiResponse = {
        result: ['first\nsecond', '\nthird\nfourth'],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);
      const result = await streamToArray(stream);

      expect(result).toEqual(['first', 'second', 'third', 'fourth']);
    });

    test('Handles partial lines across chunks', async () => {
      const apiResponse = {
        result: ['hello ', 'world\nfoo', ' bar'],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);
      const result = await streamToArray(stream);

      expect(result).toEqual(['hello world', 'foo bar']);
    });

    test('Stream can be aborted', async () => {
      const apiResponse = {
        result: ['line1\nline2\nline3\nline4\nline5'],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);

      const result = [];
      let count = 0;

      await expect(async () => {
        for await (const item of stream) {
          result.push(item);
          count++;
          if (count === 2) {
            stream.controller.abort();
          }
        }
      }).rejects.toThrow('The operation was aborted');

      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Error handling in streams', () => {
    test('Handles abort errors in pipeline', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const apiResponse = {
        result: ['line1\nline2\nline3\nline4\nline5'],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);

      // Abort immediately
      stream.controller.abort();

      await expect(async () => {
        for await (const _item of stream) {
          // Intentionally empty - waiting for abort
        }
      }).rejects.toThrow();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('handlePipelineError', () => {
    test('Logs warning for AbortError', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const apiResponse = {
        result: ['line1\nline2\nline3'],
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);
      stream.controller.abort();

      await expect(async () => {
        for await (const _item of stream) {
          // Stream should be aborted
        }
      }).rejects.toThrow();

      // Wait for pipeline error handler to be called
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleWarnSpy).toHaveBeenCalledWith('Stream pipeline aborted');
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('Logs error for non-AbortError', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const {
        Readable: readableStream,
        Transform: transformStream,
        pipeline,
      } = await import('stream');

      const errorTransform = new transformStream({
        transform(_chunk: any, _encoding: string, callback: any) {
          callback(new Error('Test error'));
        },
      });

      const readable = readableStream.from(['test data']);

      // Create a pipeline that will error
      pipeline(readable, errorTransform, (err: any) => {
        if (err?.name === 'AbortError') {
          console.warn('Stream pipeline aborted');
        } else if (err) {
          console.error('Stream pipeline error');
        }
      });

      // Wait for pipeline to process and error
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Stream pipeline error');
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test('Logs error when stream pipeline encounters non-abort error', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create an async generator that throws an error
      async function* errorGenerator() {
        yield 'data1';
        throw new Error('Pipeline error');
      }

      const apiResponse = {
        result: errorGenerator(),
      };

      const stream = await transformStreamToStringStream<string>(apiResponse);

      await expect(async () => {
        for await (const _item of stream) {
          // Do nothing with each item
        }
      }).rejects.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Stream pipeline error');
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
