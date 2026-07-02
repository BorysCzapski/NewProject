// ============================================================================
// lib/anthropic.ts
// Server-only Claude client + a small helper for getting back structured
// JSON instead of parsing free-form text. Every AI feature (reading,
// writing, songs, grammar transformations, listening gap selection) goes
// through askClaudeForJSON so response parsing lives in exactly one place.
// ============================================================================
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set — AI features are unavailable. Add it to .env.local (see .env.example)."
      );
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Asks Claude to respond and forces the reply into `schema` via a synthetic
 * tool call, so callers get a parsed, type-safe object back instead of
 * having to scrape JSON out of prose.
 */
export async function askClaudeForJSON<T>(params: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 2048,
    system: params.system,
    messages: [{ role: "user", content: params.prompt }],
    tools: [
      {
        name: "respond",
        description: "Return the structured response for this task.",
        input_schema: {
          type: "object",
          properties: params.schema,
          required: Object.keys(params.schema),
        },
      },
    ],
    tool_choice: { type: "tool", name: "respond" },
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a structured response.");
  }

  return toolUse.input as T;
}

/** Plain free-text completion, for the rare case structured output isn't needed. */
export async function askClaude(params: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<string> {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: params.maxTokens ?? 1024,
    system: params.system,
    messages: [{ role: "user", content: params.prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}
