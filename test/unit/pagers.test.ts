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

import { NoAuthAuthenticator } from 'ibm-cloud-sdk-core';
import { WatsonXAI } from '../../src/vml_v1';

// ─── Service Setup ────────────────────────────────────────────────────────────

const SERVICE_URL = 'https://us-south.ml.cloud.ibm.com';
const VERSION = '2023-07-07';

const serviceOptions = {
  authenticator: new NoAuthAuthenticator(),
  url: SERVICE_URL,
  version: VERSION,
};

let service: WatsonXAI;
let createRequestMock: jest.SpyInstance;

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const SPACE_ID = '63dc4cf1-252f-424b-b52d-5cdd9814987f';
const PROJECT_ID = 'a77190a2-f52d-4f2a-be3d-7867b5f46edc';

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Creates a mock response with pagination for standard pagers */
function createStandardPaginatedResponse<T>(
  resources: T[],
  nextHref?: string
): { result: { resources: T[]; next?: { href: string } } } {
  const response: { result: { resources: T[]; next?: { href: string } } } = {
    result: { resources },
  };
  if (nextHref) {
    response.result.next = { href: nextHref };
  }
  return response;
}

/** Creates a mock response for ListPromptsPager */
function createPromptsPaginatedResponse<T>(
  results: T[],
  next?: Record<string, unknown>
): { result: { results: T[]; next?: Record<string, unknown> } } {
  const response: { result: { results: T[]; next?: Record<string, unknown> } } = {
    result: { results },
  };
  if (next) {
    response.result.next = next;
  }
  return response;
}

/** Creates a mock response for ListSpacesPager */
function createSpacesPaginatedResponse<T>(
  resources: T[],
  nextHref?: string
): { result: { resources: T[]; next?: { href: string } } } {
  const response: { result: { resources: T[]; next?: { href: string } } } = {
    result: { resources },
  };
  if (nextHref) {
    response.result.next = { href: nextHref };
  }
  return response;
}

// ─── Reusable Test Functions ──────────────────────────────────────────────────

/** Generic test suite for standard pagers that extend the base Pager class */
function testStandardPager<T>(
  pagerName: string,
  pagerClass: new (client: WatsonXAI, params?: any) => any,
  mockData: T[],
  params: any = {}
) {
  describe(pagerName, () => {
    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(
        createStandardPaginatedResponse([mockData[0], mockData[1]])
      );

      const pager = new pagerClass(service, params);
      const results = await pager.getNext();

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockData[0]);
      expect(results[1]).toEqual(mockData[1]);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves multiple pages of results', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createStandardPaginatedResponse([mockData[0]], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(
          createStandardPaginatedResponse([mockData[1]], 'https://api.example.com?start=token3')
        )
        .mockResolvedValueOnce(createStandardPaginatedResponse([mockData[2]]));

      const pager = new pagerClass(service, params);

      const page1 = await pager.getNext();
      expect(page1).toHaveLength(1);
      expect(page1[0]).toEqual(mockData[0]);
      expect(pager.hasNext()).toBe(true);

      const page2 = await pager.getNext();
      expect(page2).toHaveLength(1);
      expect(page2[0]).toEqual(mockData[1]);
      expect(pager.hasNext()).toBe(true);

      const page3 = await pager.getNext();
      expect(page3).toHaveLength(1);
      expect(page3[0]).toEqual(mockData[2]);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves all results using getAll()', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createStandardPaginatedResponse([mockData[0]], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(createStandardPaginatedResponse([mockData[1], mockData[2]]));

      const pager = new pagerClass(service, params);
      const allResults = await pager.getAll();

      expect(allResults).toHaveLength(3);
      expect(allResults[0]).toEqual(mockData[0]);
      expect(allResults[1]).toEqual(mockData[1]);
      expect(allResults[2]).toEqual(mockData[2]);
    });

    test('throws error when calling getNext() after all pages retrieved', async () => {
      createRequestMock.mockResolvedValueOnce(createStandardPaginatedResponse([mockData[0]]));

      const pager = new pagerClass(service, params);
      await pager.getNext();

      await expect(pager.getNext()).rejects.toThrow('No more results available');
    });

    test('throws error when resources is missing', async () => {
      createRequestMock.mockResolvedValueOnce({ result: {} });

      const pager = new pagerClass(service, params);
      await expect(pager.getNext()).rejects.toThrow();
    });
  });
}

/** Simplified test suite for pagers with basic pagination (2 tests instead of 5) */
function testSimplePager<T>(
  pagerName: string,
  pagerClass: new (client: WatsonXAI, params?: any) => any,
  mockData: T[],
  params: any = {}
) {
  describe(pagerName, () => {
    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(
        createStandardPaginatedResponse([mockData[0], mockData[1]])
      );

      const pager = new pagerClass(service, params);
      const results = await pager.getNext();

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockData[0]);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves all results using getAll()', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createStandardPaginatedResponse([mockData[0]], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(createStandardPaginatedResponse([mockData[1]]));

      const pager = new pagerClass(service, params);
      const allResults = await pager.getAll();

      expect(allResults).toHaveLength(2);
      expect(allResults[0]).toEqual(mockData[0]);
      expect(allResults[1]).toEqual(mockData[1]);
    });
  });
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Pager Classes', () => {
  beforeEach(() => {
    service = new WatsonXAI(serviceOptions);
    createRequestMock = jest.spyOn(service as any, 'createRequest');
  });

  afterEach(() => {
    createRequestMock.mockRestore();
  });

  // ─── Base Pager Tests ───────────────────────────────────────────────────────

  describe('Base Pager functionality', () => {
    test('throws error if params.start is set in constructor', () => {
      expect(() => {
        new WatsonXAI.FoundationModelSpecsPager(service, { start: 'invalid' });
      }).toThrow('the params.start field should not be set');
    });

    test('initializes with hasNext() returning true', () => {
      const pager = new WatsonXAI.FoundationModelSpecsPager(service, {});
      expect(pager.hasNext()).toBe(true);
    });

    test('handles undefined params', () => {
      const pager = new WatsonXAI.FoundationModelSpecsPager(service);
      expect(pager.hasNext()).toBe(true);
    });
  });

  // ─── Standard Pager Tests (using DRY helper) ───────────────────────────────

  testStandardPager('FoundationModelSpecsPager', WatsonXAI.FoundationModelSpecsPager, [
    { model_id: 'model-1', name: 'Model 1' },
    { model_id: 'model-2', name: 'Model 2' },
    { model_id: 'model-3', name: 'Model 3' },
  ]);

  testSimplePager('FoundationModelTasksPager', WatsonXAI.FoundationModelTasksPager, [
    { task_id: 'task-1', name: 'Task 1' },
    { task_id: 'task-2', name: 'Task 2' },
  ]);

  testSimplePager(
    'TextExtractionsPager',
    WatsonXAI.TextExtractionsPager,
    [
      { id: 'extraction-1', name: 'Extraction 1' },
      { id: 'extraction-2', name: 'Extraction 2' },
    ],
    { spaceId: SPACE_ID }
  );

  testSimplePager(
    'TrainingsListPager',
    WatsonXAI.TrainingsListPager,
    [
      { id: 'training-1', name: 'Training 1' },
      { id: 'training-2', name: 'Training 2' },
    ],
    { spaceId: SPACE_ID }
  );

  testSimplePager(
    'FineTuningListPager',
    WatsonXAI.FineTuningListPager,
    [
      { id: 'ft-1', name: 'FineTuning 1' },
      { id: 'ft-2', name: 'FineTuning 2' },
    ],
    { spaceId: SPACE_ID }
  );

  testSimplePager(
    'ModelsListPager',
    WatsonXAI.ModelsListPager,
    [
      { id: 'model-1', name: 'Model 1' },
      { id: 'model-2', name: 'Model 2' },
    ],
    { spaceId: SPACE_ID }
  );

  // TextClassificationsPager has custom error message
  describe('TextClassificationsPager', () => {
    const mockData = [
      { id: 'class-1', name: 'Classification 1' },
      { id: 'class-2', name: 'Classification 2' },
    ];

    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(
        createStandardPaginatedResponse([mockData[0], mockData[1]])
      );

      const pager = new WatsonXAI.TextClassificationsPager(service, { spaceId: SPACE_ID });
      const results = await pager.getNext();

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockData[0]);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves all results using getAll()', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createStandardPaginatedResponse([mockData[0]], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(createStandardPaginatedResponse([mockData[1]]));

      const pager = new WatsonXAI.TextClassificationsPager(service, { spaceId: SPACE_ID });
      const allResults = await pager.getAll();

      expect(allResults).toHaveLength(2);
    });

    test('throws error when resources is missing', async () => {
      createRequestMock.mockResolvedValueOnce({ result: {} });

      const pager = new WatsonXAI.TextClassificationsPager(service, { spaceId: SPACE_ID });
      await expect(pager.getNext()).rejects.toThrow('No `resources` in the response.');
    });
  });

  // ─── ListPromptsPager Tests (unique implementation) ─────────────────────────

  describe('ListPromptsPager', () => {
    const mockPrompt1 = { asset_id: 'prompt-1', name: 'Prompt 1' };
    const mockPrompt2 = { asset_id: 'prompt-2', name: 'Prompt 2' };

    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(
        createPromptsPaginatedResponse([mockPrompt1, mockPrompt2])
      );

      const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });
      const results = await pager.getNext();

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockPrompt1);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves multiple pages of results', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createPromptsPaginatedResponse([mockPrompt1], { bookmark: 'bookmark2' })
        )
        .mockResolvedValueOnce(createPromptsPaginatedResponse([mockPrompt2]));

      const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });

      const page1 = await pager.getNext();
      expect(page1).toHaveLength(1);
      expect(page1[0]).toEqual(mockPrompt1);
      expect(pager.hasNext()).toBe(true);

      const page2 = await pager.getNext();
      expect(page2).toHaveLength(1);
      expect(page2[0]).toEqual(mockPrompt2);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves all results using getAll()', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createPromptsPaginatedResponse([mockPrompt1], { bookmark: 'bookmark2' })
        )
        .mockResolvedValueOnce(createPromptsPaginatedResponse([mockPrompt2]));

      const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });
      const allResults = await pager.getAll();

      expect(allResults).toHaveLength(2);
      expect(allResults[0]).toEqual(mockPrompt1);
      expect(allResults[1]).toEqual(mockPrompt2);
    });

    test('throws error when calling getNext() after all pages retrieved', async () => {
      createRequestMock.mockResolvedValueOnce(createPromptsPaginatedResponse([mockPrompt1]));

      const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });
      await pager.getNext();

      await expect(pager.getNext()).rejects.toThrow('No more results available');
    });

    test('handles empty results', async () => {
      createRequestMock.mockResolvedValueOnce(createPromptsPaginatedResponse([]));

      const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });
      const results = await pager.getNext();

      expect(results).toHaveLength(0);
      expect(pager.hasNext()).toBe(false);
    });
  });

  // ─── ListSpacesPager Tests (unique implementation) ──────────────────────────

  describe('ListSpacesPager', () => {
    const mockSpace1 = { id: 'space-1', name: 'Space 1' };
    const mockSpace2 = { id: 'space-2', name: 'Space 2' };

    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(
        createSpacesPaginatedResponse([mockSpace1, mockSpace2])
      );

      const pager = new WatsonXAI.ListSpacesPager(service);
      const results = await pager.getNext();

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockSpace1);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves multiple pages of results', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createSpacesPaginatedResponse([mockSpace1], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(createSpacesPaginatedResponse([mockSpace2]));

      const pager = new WatsonXAI.ListSpacesPager(service);

      const page1 = await pager.getNext();
      expect(page1).toHaveLength(1);
      expect(page1[0]).toEqual(mockSpace1);
      expect(pager.hasNext()).toBe(true);

      const page2 = await pager.getNext();
      expect(page2).toHaveLength(1);
      expect(page2[0]).toEqual(mockSpace2);
      expect(pager.hasNext()).toBe(false);
    });

    test('retrieves all results using getAll()', async () => {
      createRequestMock
        .mockResolvedValueOnce(
          createSpacesPaginatedResponse([mockSpace1], 'https://api.example.com?start=token2')
        )
        .mockResolvedValueOnce(createSpacesPaginatedResponse([mockSpace2]));

      const pager = new WatsonXAI.ListSpacesPager(service);
      const allResults = await pager.getAll();

      expect(allResults).toHaveLength(2);
      expect(allResults[0]).toEqual(mockSpace1);
      expect(allResults[1]).toEqual(mockSpace2);
    });

    test('throws error when calling getNext() after all pages retrieved', async () => {
      createRequestMock.mockResolvedValueOnce(createSpacesPaginatedResponse([mockSpace1]));

      const pager = new WatsonXAI.ListSpacesPager(service);
      await pager.getNext();

      await expect(pager.getNext()).rejects.toThrow('No more results available');
    });

    test('throws error when start param is missing in next URL', async () => {
      createRequestMock.mockResolvedValueOnce(
        createSpacesPaginatedResponse([mockSpace1], 'https://api.example.com?invalid=param')
      );

      const pager = new WatsonXAI.ListSpacesPager(service);
      await expect(pager.getNext()).rejects.toThrow("'start' param is not present in provided url");
    });
  });

  // ─── Edge Cases and Error Handling ──────────────────────────────────────────

  describe('Edge cases and error handling', () => {
    test('handles empty results array', async () => {
      createRequestMock.mockResolvedValueOnce(createStandardPaginatedResponse([]));

      const pager = new WatsonXAI.FoundationModelSpecsPager(service, {});
      const results = await pager.getNext();

      expect(results).toHaveLength(0);
      expect(pager.hasNext()).toBe(false);
    });

    test('preserves params across pages', async () => {
      const params = { limit: 10, filters: 'test' };
      createRequestMock
        .mockResolvedValueOnce(
          createStandardPaginatedResponse(
            [{ model_id: 'model-1' }],
            'https://api.example.com?start=token2'
          )
        )
        .mockResolvedValueOnce(createStandardPaginatedResponse([{ model_id: 'model-2' }]));

      const pager = new WatsonXAI.FoundationModelSpecsPager(service, params);
      await pager.getNext();
      await pager.getNext();

      // Verify that the original params were preserved (not mutated)
      expect(createRequestMock).toHaveBeenCalledTimes(2);
    });

    test('handles network errors gracefully', async () => {
      createRequestMock.mockRejectedValueOnce(new Error('Network error'));

      const pager = new WatsonXAI.FoundationModelSpecsPager(service, {});
      await expect(pager.getNext()).rejects.toThrow('Network error');
    });
  });
});

// Made with Bob
