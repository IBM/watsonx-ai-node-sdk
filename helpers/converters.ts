import WatsonxAiMlVml_v1 = require('../watsonx-ai-ml/vml_v1');

function convertUtilityToolToWatsonxTool(
  utilityTool: WatsonxAiMlVml_v1.UtilityAgentTool
): WatsonxAiMlVml_v1.TextChatParameterTools {
  const { name, description, input_schema, config_schema } = utilityTool;

  const parseParameters = (
    input?: WatsonxAiMlVml_v1.JsonObject,
    config?: WatsonxAiMlVml_v1.JsonObject
  ) => {
    if (config) {
      config.properties.input = { type: 'string', description: 'Input for the tool' };
      return config;
    }
    if (input) return input;
    return {
      properties: {
        input: { type: 'string', description: 'Input for the tool' },
      },
      type: 'object',
    };
  };

  const tool: WatsonxAiMlVml_v1.TextChatParameterTools = {
    type: 'function',
    function: {
      name,
      description,
      parameters: parseParameters(input_schema, config_schema),
    },
  };
  return tool;
}

function convertWatsonxToolCallToUtilityToolCall(
  toolCall: WatsonxAiMlVml_v1.TextChatToolCall
): WatsonxAiMlVml_v1.WxUtilityAgentToolsRunRequest {
  const { name, arguments: stringifiedArguments } = toolCall.function;
  const jsonArguments: WatsonxAiMlVml_v1.JsonObject = JSON.parse(stringifiedArguments);
  const { input, ...args } = jsonArguments;
  return {
    input: input ?? args,
    tool_name: name,
    config: input ? args : {},
  };
}
export = { convertUtilityToolToWatsonxTool, convertWatsonxToolCallToUtilityToolCall };
