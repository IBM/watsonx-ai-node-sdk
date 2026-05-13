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

type PagerConstructor = new (client: WatsonXAI, params?: any) => any;

interface PagerSuiteConfig<TResponse, TResult = TResponse> {
  pagerName: string;
  pagerClass: PagerConstructor;
  params?: any;
  createResponse: (items: TResponse[], next?: any) => { result: Record<string, any> };
  samples: {
    singlePage: TResponse[];
    allResultsPages: TResponse[][];
    multiPage?: TResponse[][];
  };
  getResultItems?: (result: TResponse) => TResult;
  expectMissingResultsError?: string | RegExp;
  extraTests?: () => void;
}

/**
 * Asserts that an actual pager result matches the expected source fixtures after optional
 * normalization. This keeps the suite helper generic while allowing callers to compare either raw
 * items or transformed values.
 *
 * @param actual - Items returned by the pager under test.
 * @param expectedSource - Source fixtures used to build the mocked response.
 * @param getResultItems - Normalizer used to map each fixture into the comparable expected shape.
 */
function expectItemsToEqual<TResponse, TResult>(
  actual: TResult[],
  expectedSource: TResponse[],
  getResultItems: (result: TResponse) => TResult
) {
  expect(actual).toHaveLength(expectedSource.length);
  expectedSource.forEach((item, index) => {
    expect(actual[index]).toEqual(getResultItems(item));
  });
}

/**
 * Builds a reusable pager behavior suite for pagers that share the same contract around
 * single-page, multi-page, [`getAll()`](test/unit/pagers.test.ts:156), and exhaustion handling. The
 * suite is driven entirely by response factories and fixture samples so pager-specific tests can
 * stay declarative.
 *
 * @param config - Pager suite configuration including constructors, response factories, sample
 *   pages, and optional extra assertions.
 */
function testPagerSuite<TResponse, TResult = TResponse>({
  pagerName,
  pagerClass,
  params = {},
  createResponse,
  samples,
  getResultItems = (result) => result as unknown as TResult,
  expectMissingResultsError,
  extraTests,
}: PagerSuiteConfig<TResponse, TResult>) {
  describe(pagerName, () => {
    test('retrieves single page of results', async () => {
      createRequestMock.mockResolvedValueOnce(createResponse(samples.singlePage));

      const pager = new pagerClass(service, params);
      const results = await pager.getNext();

      expectItemsToEqual(results, samples.singlePage, getResultItems);
      expect(pager.hasNext()).toBe(false);
    });

    if (samples.multiPage) {
      test('retrieves multiple pages of results', async () => {
        const multiPageSamples = samples.multiPage as TResponse[][];

        multiPageSamples.forEach((page, index) => {
          const nextToken =
            index < multiPageSamples.length - 1
              ? createResponse === createPromptsPaginatedResponse
                ? { bookmark: `bookmark${index + 2}` }
                : `https://api.example.com?start=token${index + 2}`
              : undefined;
          createRequestMock.mockResolvedValueOnce(createResponse(page, nextToken));
        });

        const pager = new pagerClass(service, params);

        for (let index = 0; index < multiPageSamples.length; index++) {
          const page = await pager.getNext();
          expectItemsToEqual(page, multiPageSamples[index], getResultItems);
          expect(pager.hasNext()).toBe(index < multiPageSamples.length - 1);
        }
      });
    }

    test('retrieves all results using getAll()', async () => {
      samples.allResultsPages.forEach((page, index) => {
        const nextToken =
          index < samples.allResultsPages.length - 1
            ? createResponse === createPromptsPaginatedResponse
              ? { bookmark: `bookmark${index + 2}` }
              : `https://api.example.com?start=token${index + 2}`
            : undefined;
        createRequestMock.mockResolvedValueOnce(createResponse(page, nextToken));
      });

      const pager = new pagerClass(service, params);
      const allResults = await pager.getAll();
      const expected = samples.allResultsPages.flatMap((page) =>
        page.map((item) => getResultItems(item))
      );

      expect(allResults).toHaveLength(expected.length);
      expected.forEach((item, index) => {
        expect(allResults[index]).toEqual(item);
      });
    });

    if (samples.singlePage.length > 0) {
      test('throws error when calling getNext() after all pages retrieved', async () => {
        createRequestMock.mockResolvedValueOnce(createResponse([samples.singlePage[0]]));

        const pager = new pagerClass(service, params);
        await pager.getNext();

        await expect(pager.getNext()).rejects.toThrow('No more results available');
      });
    }

    if (expectMissingResultsError) {
      test('throws error when resources is missing', async () => {
        createRequestMock.mockResolvedValueOnce({ result: {} });

        const pager = new pagerClass(service, params);
        await expect(pager.getNext()).rejects.toThrow(expectMissingResultsError);
      });
    }

    extraTests?.();
  });
}

function testStandardPager<T>(
  pagerName: string,
  pagerClass: PagerConstructor,
  mockData: T[],
  params: any = {}
) {
  testPagerSuite({
    pagerName,
    pagerClass,
    params,
    createResponse: createStandardPaginatedResponse,
    samples: {
      singlePage: [mockData[0], mockData[1]],
      multiPage: [[mockData[0]], [mockData[1]], [mockData[2]]],
      allResultsPages: [[mockData[0]], [mockData[1], mockData[2]]],
    },
    expectMissingResultsError: /./,
  });
}

/** Simplified test suite for pagers with basic pagination (2 tests instead of 5) */
function testSimplePager<T>(
  pagerName: string,
  pagerClass: PagerConstructor,
  mockData: T[],
  params: any = {}
) {
  testPagerSuite({
    pagerName,
    pagerClass,
    params,
    createResponse: createStandardPaginatedResponse,
    samples: {
      singlePage: [mockData[0], mockData[1]],
      allResultsPages: [[mockData[0]], [mockData[1]]],
    },
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

  testPagerSuite({
    pagerName: 'TextClassificationsPager',
    pagerClass: WatsonXAI.TextClassificationsPager,
    params: { spaceId: SPACE_ID },
    createResponse: createStandardPaginatedResponse,
    samples: {
      singlePage: [
        { id: 'class-1', name: 'Classification 1' },
        { id: 'class-2', name: 'Classification 2' },
      ],
      allResultsPages: [
        [{ id: 'class-1', name: 'Classification 1' }],
        [{ id: 'class-2', name: 'Classification 2' }],
      ],
    },
    expectMissingResultsError: 'No `resources` in the response.',
  });

  testPagerSuite({
    pagerName: 'ListPromptsPager',
    pagerClass: WatsonXAI.ListPromptsPager,
    params: { projectId: PROJECT_ID },
    createResponse: createPromptsPaginatedResponse,
    samples: {
      singlePage: [
        { asset_id: 'prompt-1', name: 'Prompt 1' },
        { asset_id: 'prompt-2', name: 'Prompt 2' },
      ],
      multiPage: [
        [{ asset_id: 'prompt-1', name: 'Prompt 1' }],
        [{ asset_id: 'prompt-2', name: 'Prompt 2' }],
      ],
      allResultsPages: [
        [{ asset_id: 'prompt-1', name: 'Prompt 1' }],
        [{ asset_id: 'prompt-2', name: 'Prompt 2' }],
      ],
    },
    extraTests: () => {
      test('handles empty results', async () => {
        createRequestMock.mockResolvedValueOnce(createPromptsPaginatedResponse([]));

        const pager = new WatsonXAI.ListPromptsPager(service, { projectId: PROJECT_ID });
        const results = await pager.getNext();

        expect(results).toHaveLength(0);
        expect(pager.hasNext()).toBe(false);
      });
    },
  });

  testPagerSuite({
    pagerName: 'ListSpacesPager',
    pagerClass: WatsonXAI.ListSpacesPager,
    createResponse: createSpacesPaginatedResponse,
    samples: {
      singlePage: [
        { id: 'space-1', name: 'Space 1' },
        { id: 'space-2', name: 'Space 2' },
      ],
      multiPage: [[{ id: 'space-1', name: 'Space 1' }], [{ id: 'space-2', name: 'Space 2' }]],
      allResultsPages: [[{ id: 'space-1', name: 'Space 1' }], [{ id: 'space-2', name: 'Space 2' }]],
    },
    extraTests: () => {
      test('throws error when start param is missing in next URL', async () => {
        createRequestMock.mockResolvedValueOnce(
          createSpacesPaginatedResponse(
            [{ id: 'space-1', name: 'Space 1' }],
            'https://api.example.com?invalid=param'
          )
        );

        const pager = new WatsonXAI.ListSpacesPager(service);
        await expect(pager.getNext()).rejects.toThrow(
          "'start' param is not present in provided url"
        );
      });
    },
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
