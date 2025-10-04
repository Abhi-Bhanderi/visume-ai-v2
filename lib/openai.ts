/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/openai.ts

import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import OpenAI from "openai";

export class ValidationError extends Error {
  public issues: z.ZodIssue[];
  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Call OpenAI with structured output and schema validation.
 */
export async function callOpenAIWithSchema<T>(
  model: string,
  userPrompt: string,
  outputSchema: z.ZodSchema<T>,
  systemPrompt?: string
): Promise<T> {
  // Convert Zod schema to JSON Schema for OpenAI
  const rawJsonSchema = zodToJsonSchema(outputSchema, {
    $refStrategy: "none",
  }) as any;

  // Remove properties that OpenAI doesn't accept
  const { $schema, definitions, ...jsonSchema } = rawJsonSchema;

  console.log("JSON Schema:", JSON.stringify(jsonSchema, null, 2));

  // Build messages
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });

  // Call OpenAI
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: model,
    messages: messages,
   
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned no response");
  }

  // Parse and validate output
  const parsed = JSON.parse(content);
  const validated = outputSchema.safeParse(parsed);

  if (!validated.success) {
    throw new ValidationError(
      "Output validation failed",
      validated.error.issues
    );
  }

  return validated.data;
}
