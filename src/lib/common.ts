/**
 * (C) Copyright IBM Corp. 2024-2026.
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

import os from 'os';
import type { TransformCallback } from 'stream';
import { addAbortSignal, pipeline, Readable as Rdb, Transform } from 'stream';

import { VERSION } from '../version';

/* SDK headers type definition containing User-Agent information. */
export interface SdkHeaders {
  'User-Agent': string;
}

/**
 * Generates SDK headers with User-Agent information including package name, version, operating
 * system details, and Node.js version.
 *
 * @returns {SdkHeaders} Headers object containing User-Agent string
 */
export function getSdkHeaders(): SdkHeaders {
  const packageName = 'ibm-cloud-watsonx-ai';
  const sdkVersion = VERSION;
  const osName = os.platform();
  const osVersion = os.release();
  const nodeVersion = process.version;

  const headers = {
    'User-Agent': `${packageName}/${sdkVersion} (lang=node.js; os.name=${osName} os.version=${osVersion} node.version=${nodeVersion})`,
  };

  return headers;
}

/**
 * Converts an array of Server-Sent Events (SSE) formatted strings into a JavaScript object. Parses
 * lines with 'key: value' format and handles special fields like 'id', 'event', and 'data'.
 *
 * @example
 *   ```typescript
 *   const lines = ['id: 1', 'event: message', 'data: {"text":"hello"}'];
 *   const obj = stringToObj(lines);
 *   // Returns: { id: 1, event: 'message', data: { text: 'hello' } }
 *   ```;
 *
 * @param {string[]} chunk - Array of SSE formatted strings to parse
 * @returns {Record<string, any> | null} Parsed object or null if no valid data found
 */
const stringToObj = (chunk: string[]): Record<string, any> | null => {
  const obj: Record<string, any> = {};
  chunk.forEach((line) => {
    const index = line.indexOf(': ');
    if (index === -1) return;
    const key = line.substring(0, index);
    const value = line.substring(index + 2);
    switch (key) {
      case 'id':
        obj[key] = Number(value);
        break;
      case 'event':
        obj[key] = String(value);
        break;
      case 'data':
        if (value === '[DONE]') return;
        try {
          obj[key] = JSON.parse(value);
        } catch (e) {
          console.error(
            "There is invalid JSON in your stream under 'data' field and it was not parsed into an object.",
            `${key}: ${value}`
          );
          console.error(e);
        }
        break;
      default:
        break;
    }
  });

  return Object.keys(obj).length > 0 ? obj : null;
};

/**
 * Base transform stream class that maintains a buffer for processing streaming data. Extends
 * Node.js Transform stream with object mode for readable output.
 */
export class StreamTransform extends Transform {
  buffer: string;

  constructor() {
    super({ readableObjectMode: true, writableObjectMode: false });
    this.buffer = '';
  }
}

/**
 * Transform stream that converts Server-Sent Events (SSE) formatted text into JavaScript objects.
 * Buffers incoming chunks, splits by double newlines, and parses each event into an object.
 *
 * @example
 *   ```typescript
 *   const transformStream = new ObjectTransformStream();
 *   stream.pipe(transformStream).on('data', (obj) => {
 *     console.log(obj); // Parsed SSE object
 *   });
 *   ```;
 *
 * @extends StreamTransform
 */
export class ObjectTransformStream extends StreamTransform {
  /**
   * Transforms incoming chunks by buffering and parsing SSE formatted data. Splits events by double
   * newlines and converts each to an object.
   *
   * @param {any} chunk - Incoming data chunk
   * @param {string} _encoding - Character encoding (unused)
   * @param {TransformCallback} callback - Callback to signal completion
   */
  _transform(chunk: any, _encoding: string, callback: TransformCallback): void {
    this.buffer += chunk.toString();

    const events = this.buffer.split('\n\n');
    this.buffer = events.pop() ?? '';

    for (const event of events) {
      const lines = event.split('\n');
      const obj = stringToObj(lines);
      if (obj) this.push(obj);
    }

    callback();
  }

  /**
   * Flushes any remaining buffered data when the stream ends.
   *
   * @param {TransformCallback} callback - Callback to signal completion
   */
  _flush(callback: TransformCallback): void {
    if (this.buffer) {
      const parts = this.buffer.split('\n');
      const obj = stringToObj(parts);
      this.push(obj);
    }
    callback();
  }
}

/**
 * Generic async iterable stream wrapper that provides abort control functionality. Allows for
 * cancellation of streaming operations via AbortController.
 *
 * @example
 *   ```typescript
 *   const controller = new AbortController();
 *   const stream = await Stream.createStream<MyType>(transformStream, controller);
 *   for await (const item of stream) {
 *     console.log(item);
 *   }
 *   // Later: controller.abort() to cancel
 *   ```;
 *
 * @template T - Type of items in the stream
 */
export class Stream<T> implements AsyncIterable<T> {
  controller: AbortController;

  /**
   * Creates a new Stream instance.
   *
   * @param {() => AsyncIterator<T>} iterator - Function that returns an async iterator
   * @param {AbortController} controller - Controller for aborting the stream
   */
  constructor(
    private iterator: () => AsyncIterator<T>,
    controller: AbortController
  ) {
    this.controller = controller;
  }

  /**
   * Creates a Stream instance from a Transform stream.
   *
   * @template T - Type of items in the stream
   * @param {Transform} stream - Node.js Transform stream to wrap
   * @param {AbortController} controller - Controller for aborting the stream
   * @returns {Promise<Stream<T>>} Promise resolving to a Stream instance
   */
  static async createStream<T>(stream: Transform, controller: AbortController): Promise<Stream<T>> {
    async function* iterator() {
      for await (const chunk of stream) {
        yield chunk;
      }
    }
    return new Stream<T>(iterator, controller);
  }

  /**
   * Implements the async iterator protocol for the stream.
   *
   * @returns {AsyncIterator<T>} Async iterator for the stream
   */
  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this.iterator();
  }
}

/**
 * Handles errors that occur in stream pipelines. Logs warnings for abort errors and errors for
 * other pipeline failures.
 *
 * @param {any} e - Error object from the pipeline
 */
const handlePipelineError = (e: any) => {
  if (e?.name === 'AbortError') {
    console.warn('Stream pipeline aborted');
  } else if (e) {
    console.error('Stream pipeline error');
  }
};

/**
 * Creates a pipeline that transforms an API response stream using a custom transform stream. Sets
 * up abort control and error handling for the pipeline.
 *
 * @template T - Type of items in the resulting stream
 * @param {Record<'result', Iterable<any> | AsyncIterable<any>>} apiResponse - API response
 *   containing iterable result
 * @param {StreamTransform} transformStream - Transform stream to process the data
 * @returns {Promise<Stream<T>>} Promise resolving to an abortable Stream instance
 */
function transformStreamWithPipeline<T>(
  apiResponse: Record<'result', Iterable<any> | AsyncIterable<any>>,
  transformStream: StreamTransform
): Promise<Stream<T>> {
  const readableStream = Rdb.from(apiResponse.result);
  const controller = new AbortController();
  const combinedStream = pipeline(readableStream, transformStream, handlePipelineError);
  const abortableStream = addAbortSignal(controller.signal, combinedStream);
  const res = Stream.createStream<T>(abortableStream, controller);
  return res;
}

/**
 * Transforms an API response stream into a stream of parsed JavaScript objects. Uses
 * ObjectTransformStream to parse Server-Sent Events (SSE) formatted data.
 *
 * @example
 *   ```typescript
 *   const objectStream = await transformStreamToObjectStream<MyType>(apiResponse);
 *   for await (const obj of objectStream) {
 *     console.log(obj); // Parsed object from SSE stream
 *   }
 *   ```;
 *
 * @template T - Type of objects in the resulting stream
 * @param {any} apiResponse - API response containing a stream result
 * @returns {Promise<Stream<T>>} Promise resolving to a Stream of parsed objects
 */
export async function transformStreamToObjectStream<T>(apiResponse: any): Promise<Stream<T>> {
  const transformStream = new ObjectTransformStream();

  return transformStreamWithPipeline<T>(apiResponse, transformStream);
}

/**
 * Transform stream that splits incoming data into individual lines. Buffers partial lines and emits
 * complete lines as they arrive.
 *
 * @example
 *   ```typescript
 *   const lineStream = new LineTransformStream();
 *   stream.pipe(lineStream).on('data', (line) => {
 *     console.log(line); // Individual line of text
 *   });
 *   ```;
 *
 * @extends StreamTransform
 */
export class LineTransformStream extends StreamTransform {
  /**
   * Transforms incoming chunks by splitting on newlines and emitting complete lines.
   *
   * @param {any} chunk - Incoming data chunk
   * @param {string} _encoding - Character encoding (unused)
   * @param {TransformCallback} callback - Callback to signal completion
   */
  _transform(chunk: any, _encoding: string, callback: TransformCallback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';
    lines.forEach((line) => this.push(line));
    callback();
  }

  /**
   * Flushes any remaining buffered line when the stream ends.
   *
   * @param {TransformCallback} callback - Callback to signal completion
   */
  _flush(callback: TransformCallback) {
    if (this.buffer) {
      this.push(this.buffer);
    }
    callback();
  }
}

/**
 * Transforms an API response stream into a stream of text lines. Uses LineTransformStream to split
 * data by newlines.
 *
 * @example
 *   ```typescript
 *   const lineStream = await transformStreamToStringStream<string>(apiResponse);
 *   for await (const line of lineStream) {
 *     console.log(line); // Individual line of text
 *   }
 *   ```;
 *
 * @template T - Type of items in the resulting stream (typically string)
 * @param {any} apiResponse - API response containing a stream result
 * @returns {Promise<Stream<T>>} Promise resolving to a Stream of text lines
 */
export async function transformStreamToStringStream<T>(apiResponse: any): Promise<Stream<T>> {
  const transformStream = new LineTransformStream();

  return transformStreamWithPipeline<T>(apiResponse, transformStream);
}
