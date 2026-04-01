/**
 * (C) Copyright IBM Corp. 2026.
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

import type { ReadableStream } from 'stream/web';
import type { DefaultParams } from '../../types/common';

/** Parameters for the `uploadBatchFile` operation. */
export interface UploadBatchFileParams extends DefaultParams {
  /** JSONL file containing batch requests. */
  file: string | ReadableStream;
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
}

/** Parameters for the `listFiles` operation. */
export interface ListFilesParams extends DefaultParams {
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
  /**
   * A cursor for pagination. Use the last file ID from the previous response to retrieve the next
   * page.
   */
  after?: string;
  /** Maximum number of files to return. Must be between 1 and 10,000. */
  limit?: number;
  /** Filter files by purpose. */
  purpose?: 'batch';
  /** Order of results. Options are "asc" or "desc". */
  order?: 'desc' | 'asc';
}

/** Parameters for the `getFileContent` operation. */
export interface GetFileContentParams extends DefaultParams {
  /** The ID of the file to retrieve. */
  fileId: string;
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
}

export interface DeleteFileParams extends GetFileContentParams {}

export interface DownloadFileContentParams extends GetFileContentParams {
  path?: string;
  filename: string;
}

/** Parameters for the `createBatch` operation. */
export interface CreateBatchParams extends DefaultParams {
  /** ID of the uploaded input file for the batch job. */
  inputFileId: string;
  /** API endpoint to use for processing each batch item. */
  endpoint: string;
  /** Time window for completion of the batch job. */
  completionWindow: string;
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
  /** Additional metadata for the batch job. */
  metadata?: Record<string, string>;
}

/** Parameters for the `listAllBatches` operation. */
export interface ListAllBatchesParams extends DefaultParams {
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
  /** Maximum number of batch jobs to return. */
  limit?: number;
}

/** Parameters for the `getBatchById` operation. */
export interface GetBatchParams extends DefaultParams {
  /** The ID of the batch job to retrieve. */
  batchId: string;
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
}

/** Parameters for the `cancelBatchById` operation. */
export interface CancelBatchParams extends DefaultParams {
  /** The ID of the batch job to cancel. */
  batchId: string;
  /** Watsonx project identifier. */
  projectId?: string;
  /** Watsonx space identifier. */
  spaceId?: string;
}

export interface Identifiers {
  /** Watsonx project identifier. */
  projectId: string | undefined;
  /** Watsonx space identifier. */
  spaceId: string | undefined;
}
