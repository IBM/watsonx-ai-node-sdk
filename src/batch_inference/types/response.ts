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

import type { Collection } from '../../types/common';

/** File object representing an uploaded file. */
export interface UploadedFile {
  /** The unique identifier for the file. */
  id?: string;
  /** The object type, which is always "file". */
  object?: string;
  /** Size of the file in bytes. */
  bytes?: number;
  /** Unix timestamp when the file was created. */
  created_at?: number;
  /** Unix timestamp when the file expires (0 if no expiration). */
  expires_at?: number;
  /** The name of the file. */
  filename?: string;
  /** Purpose of the file. */
  purpose?: string;
}

export interface DeletedFile {
  id: string;
  deleted: boolean;
  object: 'file';
}

/** A list of files. */
export interface UploadedFileCollection extends Collection<UploadedFile> {
  /** The ID of the first file in the list. */
  first_id?: string | null;
  /** The ID of the last file in the list. */
  last_id?: string | null;
  /** Whether there are more files available. */
  has_more?: boolean;
}

/** Request counts for a batch job. */
export interface RequestCounts {
  /** Total number of requests in the batch. */
  total?: number;
  /** Number of completed requests. */
  completed?: number;
  /** Number of failed requests. */
  failed?: number;
}

/** Batch job object. */
export interface Batch {
  /** The unique identifier for the batch job. */
  id?: string;
  /** The object type, which is always "batch". */
  object?: string;
  /** API endpoint used for processing each batch item. */
  endpoint?: string;
  /** Array of error messages, if any. */
  errors?: string[] | null;
  /** ID of the uploaded input file for the batch job. */
  input_file_id?: string;
  /** Time window for completion of the batch job. */
  completion_window?: string;
  /** Current status of the batch job. */
  status?: string;
  /** ID of the output file, if available. */
  output_file_id?: string | null;
  /** ID of the error file, if available. */
  error_file_id?: string | null;
  /** Unix timestamp when the batch job was created. */
  created_at?: number;
  /** Unix timestamp when the batch job started processing. */
  in_progress_at?: number | null;
  /** Unix timestamp when the batch job expires. */
  expires_at?: number | null;
  /** Unix timestamp when the batch job started finalizing. */
  finalizing_at?: number | null;
  /** Unix timestamp when the batch job completed. */
  completed_at?: number | null;
  /** Unix timestamp when the batch job failed. */
  failed_at?: number | null;
  /** Unix timestamp when the batch job expired. */
  expired_at?: number | null;
  /** Unix timestamp when the batch job started cancelling. */
  cancelling_at?: number | null;
  /** Unix timestamp when the batch job was cancelled. */
  cancelled_at?: number | null;
  /** Request counts for the batch job. */
  request_counts?: RequestCounts;
  /** Additional metadata for the batch job. */
  metadata?: Record<string, string>;
}

/** A list of batch jobs. */
export interface BatchCollection extends Collection<Batch> {
  /** The ID of the first batch in the list. */
  first_id?: string;
  /** The ID of the last batch in the list. */
  last_id?: string;
  /** Whether there are more batches available. */
  has_more?: boolean;
}
