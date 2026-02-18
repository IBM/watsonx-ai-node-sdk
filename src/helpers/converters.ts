/**
 * (C) Copyright IBM Corp. 2025-2026.
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
import type WatsonXAI from '../vml_v1';

/**
 * Converts a utility agent tool to a Watsonx text chat parameter tool format. This function
 * transforms the tool definition from the utility agent format to the format expected by Watsonx
 * text chat APIs.
 *
 * @example
 *   ```typescript
 *   const utilityTool = {
 *     name: 'calculator',
 *     description: 'Performs calculations',
 *     input_schema: { type: 'object', properties: { expression: { type: 'string' } } }
 *   };
 *   const watsonxTool = convertUtilityToolToWatsonxTool(utilityTool);
 *   ```;
 *
 * @param {WatsonXAI.UtilityAgentTool} utilityTool - The utility agent tool to convert
 * @returns {WatsonXAI.TextChatParameterTools} The converted tool in Watsonx format
 */
function convertUtilityToolToWatsonxTool(
  utilityTool: WatsonXAI.UtilityAgentTool
): WatsonXAI.TextChatParameterTools {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { name, description, input_schema } = utilityTool;

  const parseParameters = (input?: WatsonXAI.JsonObject): WatsonXAI.JsonObject => {
    if (input) return input;
    return {
      properties: {
        input: { type: 'string', description: 'Input for the tool' },
      },
      type: 'object',
    };
  };

  const tool: WatsonXAI.TextChatParameterTools = {
    type: 'function',
    function: {
      name,
      description,
      parameters: parseParameters(input_schema),
    },
  };
  return tool;
}

/**
 * Converts a Watsonx tool call to a utility agent tool run request. This function transforms the
 * tool call from Watsonx text chat format to the format expected by the utility agent tools run
 * API.
 *
 * @example
 *   ```typescript
 *   const toolCall = {
 *     id: '12345',
 *     type: 'function',
 *     function: {
 *       name: 'calculator',
 *       arguments: '{"input": "2 + 2"}'
 *     }
 *   };
 *   const runRequest = convertWatsonxToolCallToUtilityToolCall(toolCall);
 *   ```;
 *
 * @param {WatsonXAI.TextChatToolCall} toolCall - The Watsonx tool call to convert
 * @param {WatsonXAI.JsonObject} [config] - Optional configuration for the tool run
 * @returns {WatsonXAI.WxUtilityAgentToolsRunRequest} The converted tool run request
 */
function convertWatsonxToolCallToUtilityToolCall(
  toolCall: WatsonXAI.TextChatToolCall,
  config?: WatsonXAI.JsonObject
): WatsonXAI.WxUtilityAgentToolsRunRequest {
  const { name, arguments: stringifiedArguments } = toolCall.function;
  const jsonArguments: WatsonXAI.JsonObject = JSON.parse(stringifiedArguments);
  const { input } = jsonArguments;
  return {
    input: input ?? jsonArguments,
    tool_name: name,
    config,
  };
}
export { convertUtilityToolToWatsonxTool, convertWatsonxToolCallToUtilityToolCall };
