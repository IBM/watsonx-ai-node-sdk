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

/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
import os = require('os');
import { addAbortSignal, Readable as Rdb, Transform, TransformCallback } from 'stream';

const pkg = require('../package.json');

export type SdkHeaders = {
  'User-Agent': string;
};

/**
 * Get the request headers to be sent in requests by the SDK.
 *
 * If you plan to gather metrics for your SDK, the User-Agent header value must
 * be a string similar to the following:
 * autogen-node-sdk/0.0.1 (lang=node.js; os.name=Linux; os.version=19.3.0; node.version=v10.15.3)
 *
 * In the example above, the analytics tool will parse the user-agent header and
 * use the following properties:
 * "autogen-node-sdk" - the name of your sdk
 * "0.0.1"- the version of your sdk
 * "lang=node.js" - the language of the current sdk
 * "os.name=Linux; os.version=19.3.0; node.version=v10.15.3" - system information
 *
 * Note: It is very important that the sdk name ends with the string `-sdk`,
 * as the analytics data collector uses this to gather usage data.
 */
export function getSdkHeaders(
  serviceName: string,
  serviceVersion: string,
  operationId: string
): SdkHeaders | {} {
  const sdkName = 'autogen-node-sdk';
  const sdkVersion = pkg.version;
  const osName = os.platform();
  const osVersion = os.release();
  const nodeVersion = process.version;

  const headers = {
    'User-Agent': `${sdkName}/${sdkVersion} (lang=node.js; os.name=${osName} os.version=${osVersion} node.version=${nodeVersion})`,
  };

  return headers;
}

export interface ObjectStreamed<T> {
  id: number;
  event: string;
  data: T;
}

const stringToObj = (chunk: string[]) => {
  const obj = {};
  chunk.forEach((line) => {
    const index = line.indexOf(': ');
    const key = line.substring(0, index);
    const value = line.substring(index + 2);
    if (key === 'id') {
      obj[key] = Number(value);
    } else if (key === 'event') {
      obj[key] = String(value);
    } else if (key === 'data') {
      obj[key] = JSON.parse(`${value}`);
    }
  });

  return Object.keys(obj).length > 0 ? obj : null;
};

export class StreamTransform extends Transform {
  buffer: string;

  constructor() {
    super({ readableObjectMode: true, writableObjectMode: false });
    this.buffer = '';
  }
}
export class ObjectTransformStream extends StreamTransform {
  _transform(chunk: any, _encoding: string, callback: TransformCallback): void {
    this.buffer += chunk.toString();
    const parts = this.buffer.split('\n');
    if (parts.indexOf('') !== parts.length - 2 && parts.indexOf('') !== -1) {
      while (parts.length > 0 && parts.indexOf('') !== -1 && parts.length > 3) {
        const newObj = parts.splice(0, parts.indexOf('') + 1);
        const obj = stringToObj(newObj);
        if (obj) this.push(obj);
      }
      if (parts.indexOf('') === -1) this.buffer = parts.join('\n');
      else this.buffer = '';
    } else if (parts[parts.length - 1] !== '') {
      this.buffer = parts.join('\n');
    } else {
      const obj = stringToObj(parts);
      this.buffer = '';
      if (obj) this.push(obj);
    }
    callback();
  }

  _flush(callback: TransformCallback): void {
    if (this.buffer) {
      const parts = this.buffer.split('\n');
      const obj = stringToObj(parts);
      this.push(obj);
    }
    callback();
  }
}

export class Stream<T> implements AsyncIterable<T> {
  controller: AbortController;

  constructor(private iterator: () => AsyncIterator<T>, controller: AbortController) {
    this.controller = controller;
  }

  static async createStream<T>(stream: Transform, controller: AbortController) {
    async function* iterator() {
      addAbortSignal(controller.signal, stream);
      for await (const chunk of stream) {
        yield chunk;
      }
    }
    return new Stream<T>(iterator, controller);
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this.iterator();
  }
}

export async function transformStreamToObjectStream<T>(apiResponse: any) {
  const readableStream = Rdb.from(apiResponse.result).pipe(new ObjectTransformStream());
  const controller = new AbortController();
  const res = Stream.createStream<T>(readableStream, controller);
  return res;
}

export class LineTransformStream extends StreamTransform {
  _transform(chunk: any, _encoding: string, callback: TransformCallback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    lines.forEach((line) => this.push(line));
    callback();
  }

  _flush(callback: TransformCallback) {
    if (this.buffer) {
      this.push(this.buffer);
    }
    callback();
  }
}

export async function transformStreamToStringStream<T>(apiResponse: any) {
  const readableStream = Rdb.from(apiResponse.result).pipe(new LineTransformStream());
  const controller = new AbortController();
  const res = Stream.createStream<T>(readableStream, controller);
  return res;
}
