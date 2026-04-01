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

import {
  convertUtilityToolToWatsonxTool,
  convertWatsonxToolCallToUtilityToolCall,
} from '../../src';
import { validateRequestParams, validateRequiredOneOf } from '../../src/helpers/validators';
import type WatsonXAI from '../../src/vml_v1';

describe('Helpers Tests', () => {
  describe('converters', () => {
    describe('convertUtilityToolToWatsonxTool', () => {
      test('converts utility tool with input_schema', () => {
        const utilityTool: WatsonXAI.UtilityAgentTool = {
          name: 'calculator',
          description: 'Performs calculations',
          input_schema: {
            type: 'object',
            properties: { expression: { type: 'string' } },
            required: ['expression'],
          },
        };

        const result = convertUtilityToolToWatsonxTool(utilityTool);

        expect(result.type).toBe('function');
        expect(result.function?.name).toBe('calculator');
        expect(result.function?.parameters).toEqual(utilityTool.input_schema);
      });

      test('uses default parameters when input_schema not provided', () => {
        const utilityTool: WatsonXAI.UtilityAgentTool = {
          name: 'simple_tool',
          description: 'A simple tool',
        };

        const result = convertUtilityToolToWatsonxTool(utilityTool);

        expect(result.function?.parameters).toHaveProperty('properties.input');
      });
    });

    describe('convertWatsonxToolCallToUtilityToolCall', () => {
      test('converts Watsonx tool call to utility format', () => {
        const toolCall: WatsonXAI.TextChatToolCall = {
          id: 'call_123',
          type: 'function',
          function: {
            name: 'calculator',
            arguments: '{"input": "2 + 2"}',
          },
        };

        const result = convertWatsonxToolCallToUtilityToolCall(toolCall);

        expect(result).toEqual({
          input: '2 + 2',
          tool_name: 'calculator',
          config: undefined,
        });
      });

      test('uses entire JSON when input field not present', () => {
        const toolCall: WatsonXAI.TextChatToolCall = {
          id: 'call_abc',
          type: 'function',
          function: {
            name: 'tool',
            arguments: '{"query": "test", "limit": 10}',
          },
        };

        const result = convertWatsonxToolCallToUtilityToolCall(toolCall);

        expect(result.input).toEqual({ query: 'test', limit: 10 });
      });

      test('throws error for invalid JSON', () => {
        const toolCall: WatsonXAI.TextChatToolCall = {
          id: 'call_invalid',
          type: 'function',
          function: { name: 'tool', arguments: 'invalid json' },
        };

        expect(() => convertWatsonxToolCallToUtilityToolCall(toolCall)).toThrow();
      });
    });
  });

  describe('validators', () => {
    describe('validateRequestParams', () => {
      test('returns null for valid params', () => {
        const params = { requiredField: 'value', optionalField: 'optional' };
        const result = validateRequestParams(params, ['requiredField'], ['optionalField']);
        expect(result).toBeNull();
      });

      test('returns error when required param missing', () => {
        const params = { optionalField: 'optional' };
        const result = validateRequestParams(params, ['requiredField'], ['optionalField']);
        expect(result).toBeInstanceOf(Error);
        expect(result?.message).toContain('requiredField');
      });

      test('allows common params (headers, signal)', () => {
        const params = {
          requiredField: 'value',
          headers: { 'Content-Type': 'application/json' },
          signal: new AbortController().signal,
        };
        const result = validateRequestParams(params, ['requiredField'], []);
        expect(result).toBeNull();
      });
    });

    describe('validateRequiredOneOf', () => {
      test('does not throw when exactly one param provided', () => {
        const params = { data: 'some data' };
        expect(() => validateRequiredOneOf(params, ['data', 'dataReference'])).not.toThrow();
      });

      test('throws when none provided', () => {
        const params = { otherField: 'value' };
        expect(() => validateRequiredOneOf(params, ['data', 'dataReference'])).toThrow(
          'One of the following parameters is required: data,dataReference'
        );
      });

      test('throws when multiple provided', () => {
        const params = { data: 'some data', dataReference: 'ref' };
        expect(() => validateRequiredOneOf(params, ['data', 'dataReference'])).toThrow(
          'Only one of the following parameters is allowed: data,dataReference'
        );
      });

      test('handles falsy values correctly', () => {
        const params = { data: 0 };
        expect(() => validateRequiredOneOf(params, ['data', 'dataReference'])).toThrow();
      });
    });
  });
});
