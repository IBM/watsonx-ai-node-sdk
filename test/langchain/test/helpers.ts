import type { ToolCall } from '@langchain/core/messages/tool';
import { AIMessage, AIMessageChunk } from '@langchain/core/messages';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';

/** Weather forecast helper function */
export function weatherForecast(city: string): string {
  return `***Weather forecast in ${city} for the upcoming days***\
Today: Heavy rain, 20°C. Rain should stop in 4 hours.\
Tomorrow: Partly cloudy, 18°C. Light showers in the evening.\
The day after tomorrow: Sunny, 24°C. Clear skies all day.`;
}

/** Creates a weather tool that returns weather information for a given city */
export function createWeatherTool(weatherResponse: (city: string) => string = weatherForecast) {
  return tool(async ({ city }) => weatherResponse(city), {
    name: 'weather',
    description: 'Get weather for a given city',
    schema: z.object({
      city: z.string().describe('The city name'),
    }),
  });
}

/** Creates a time tool that returns time information for a given city */
export function createTimeTool(
  timeResponse: (city: string) => string = (city) => `Time for ${city}: 10:30`
) {
  return tool(async ({ city }) => timeResponse(city), {
    name: 'time',
    description: 'Get current time for a given city',
    schema: z.object({
      city: z.string(),
    }),
  });
}

/** Creates a user lookup tool */
export function createGetUserTool(users: Record<string, any>) {
  return tool(
    async ({ username }) => {
      const user = users[username];
      return user ? JSON.stringify(user) : 'User not found';
    },
    {
      name: 'get_user',
      description: 'Retrieve user information by username',
      schema: z.object({
        username: z.string().describe('The username to look up'),
      }),
    }
  );
}

/** Creates an orders lookup tool */
export function createGetOrdersTool(orders: Record<string, any[]>) {
  return tool(
    async ({ user_id }) => {
      const userOrders = orders[user_id];
      return userOrders ? JSON.stringify(userOrders) : 'No orders found';
    },
    {
      name: 'get_orders',
      description: 'Retrieve orders for a given user',
      schema: z.object({
        user_id: z.string().describe('The user ID to look up orders for'),
      }),
    }
  );
}

/** Streams a chat response and concatenates all chunks into a single message */
export async function streamAndConcatenate(
  stream: AsyncIterable<AIMessageChunk>
): Promise<AIMessageChunk | undefined> {
  let message: AIMessageChunk | undefined = undefined;
  for await (const chunk of stream) {
    message = message ? message.concat(chunk) : chunk;
  }
  return message;
}

/** Extracts content from a message as a string */
export function extractMessageContent(message: AIMessage | AIMessageChunk | undefined): string {
  if (!message) return '';
  return typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
}

/** Verifies tool call structure and properties */
export function verifyToolCall(
  toolCall: ToolCall | undefined,
  expectedName: string,
  expectedArgs?: Record<string, any>
) {
  expect(toolCall).toBeDefined();
  expect(toolCall?.name).toBe(expectedName);
  expect(typeof toolCall?.id).toBe('string');

  if (expectedArgs) {
    expect(toolCall?.args).toEqual(expectedArgs);
  }
}

/** Verifies multiple tool calls structure */
export function verifyToolCalls(
  toolCalls: ToolCall[] | undefined,
  expectedNames: string[],
  minLength: number = expectedNames.length
) {
  expect(toolCalls).toBeDefined();
  expect(Array.isArray(toolCalls)).toBe(true);
  expect(toolCalls?.length ?? 0).toBeGreaterThanOrEqual(minLength);

  const toolNames = toolCalls?.map((tc) => tc.name) ?? [];
  expectedNames.forEach((name) => {
    expect(toolNames).toContain(name);
  });

  toolCalls?.forEach((tc) => {
    expect(tc.id).toBeDefined();
    expect(typeof tc.id).toBe('string');
    expect(tc.name).toBeDefined();
    expect(tc.args).toBeDefined();
  });
}
