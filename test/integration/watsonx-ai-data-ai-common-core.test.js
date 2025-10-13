/* This test suit is not executed on the Tekton pipeline. Anytime changes are made regarding InstructLab */
/* These tests should be run on your local machine. Especially the main flow test. Command: `npm run test-ilab` */

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

const path = require('path');
const { WatsonXAI } = require('../../dist/vml_v1');
const authHelper = require('../resources/auth-helper.js');

// testcase timeout value (200s).
const timeout = 200000;

// Location of our config file.
const configFile = path.resolve(__dirname, '../../credentials/watsonx_ai_ml_vml_v1.env');
const describe = authHelper.prepareTests(configFile);
const version = '2023-07-07';

authHelper.loadEnv();

const checkIfJobFinshed = async (getter, retries = 10, delay = 10000) => {
  for (let i = 0; i < retries; i += 1) {
    const res = await getter();
    if (res.result.entity.status.state === 'active') {
      return res;
    }
    if (res.result.entity.status.state === 'failed') {
      throw new Error(
        `Failed to create space. ${res.result.entity.status.failure.errors[0].message}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Failed to get a valid response after maximum retries');
};

const watsonxInstance = WatsonXAI.newInstance({
  serviceUrl: process.env.WATSONX_AI_SERVICE_URL,
  platformUrl: process.env.WATSONX_AI_PLATFORM_URL,
  version,
});

const deleteSpaceAfterTests = async (spaceId) => {
  try {
    const res = await watsonxInstance.deleteSpace({
      spaceId,
    });
    expect(res.status).toBe(202);
  } catch (e) {
    console.error(e);
    throw new Error(`Could not delete the space after test run. space_id: ${spaceId}`);
  }
};

describe('Repository methods tests', () => {
  jest.setTimeout(timeout);

  describe('Space', () => {
    describe('Creation', () => {
      let createdSpaceId;

      afterAll(async () => {
        if (createdSpaceId) await deleteSpaceAfterTests(createdSpaceId);
      });

      test('createSpace()', async () => {
        const timestamp = Date.now();
        const name = `test-node-js-${timestamp}`;
        const res = await watsonxInstance.createSpace({
          name,
          storage: {
            resource_crn: process.env.WATSONX_AI_COS_CRN_ID,
          },
        });

        expect(res.status).toBe(202);
        expect(res.result.entity).toBeDefined();
        expect(res.result.entity.status.state).toBe('preparing');
        expect(res.result.entity.name).toBe(name);
        expect(res.result.metadata).toBeDefined();
        createdSpaceId = res.result.metadata.id;
      });
    });

    describe('Operations on existing space', () => {
      let createdSpaceId;
      const timestamp = Date.now();
      let name = `test-node-js-${timestamp}`;

      beforeAll(async () => {
        const res = await watsonxInstance.createSpace({
          name,
          storage: {
            resource_crn: process.env.WATSONX_AI_COS_CRN_ID,
          },
        });
        expect(res.status).toBe(202);
        expect(res.result.entity).toBeDefined();
        expect(res.result.entity.status.state).toBe('preparing');
        expect(res.result.entity.name).toBe(name);
        expect(res.result.metadata).toBeDefined();
        createdSpaceId = res.result.metadata.id;
      });

      afterAll(async () => {
        if (createdSpaceId) await deleteSpaceAfterTests(createdSpaceId);
      });

      test('getSpace()', async () => {
        const getter = () =>
          watsonxInstance.getSpace({
            spaceId: createdSpaceId,
          });
        const res = await checkIfJobFinshed(getter);
        expect(res.result.entity).toBeDefined();
        expect(res.result.entity.status.state).toBe('active');
        expect(res.result.entity.name).toBe(name);
        expect(res.result.metadata).toBeDefined();
      });

      test('updateSpace()', async () => {
        const updatedName = `${name}-updated`;
        const patch = {
          'op': 'replace',
          'path': '/name',
          'value': updatedName,
        };
        const res = await watsonxInstance.updateSpace({
          spaceId: createdSpaceId,
          jsonPatch: [patch],
        });

        expect(res.status).toBe(200);
        expect(res.result.entity.name).toBe(updatedName);
        expect(res.result.metadata).toBeDefined();
        name = updatedName;
      });

      test('listSpaces()', async () => {
        const res = await watsonxInstance.listSpaces({
          name,
        });
        expect(res.result.resources).toHaveLength(1);
      });

      test('getNext()', async () => {
        const params = {
          limit: 1,
        };
        const pager = new WatsonXAI.ListSpacesPager(watsonxInstance, params);
        const result = await pager.getNext();

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
      });

      test('getAll()', async () => {
        const params = {
          limit: 50,
        };
        const pager = new WatsonXAI.ListSpacesPager(watsonxInstance, params);
        const result = await pager.getAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThanOrEqual(1);
      });

      test('deleteSpace()', async () => {
        const res = await watsonxInstance.deleteSpace({
          spaceId: createdSpaceId,
        });
        expect(res.status).toBe(202);
        expect(res.statusText).toBe('Accepted');
        createdSpaceId = null;
      });
    });
  });
});
