// ============================================================================
// lib/ai.ts
// Server-only Groq client + a small helper for getting back structured JSON
// instead of parsing free-form text. Every AI feature (reading, writing,
// songs, grammar transformations, listening gap selection, homework
// suggestions) goes through askAIForJSON so response parsing lives in
// exactly one place. Groq's API is OpenAI-compatible; structured output is
// forced via a synthetic tool call (tool_choice pinned to one function).
// ============================================================================
import "server-only";
import Groq from "groq-sdk";
import { cleanEnv } from "@/lib/env";

const MODEL = cleanEnv(process.env.GROQ_MODEL) || "llama-3.3-70b-versatile";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = cleanEnv(process.env.GROQ_API_KEY);
    if (!apiKey || apiKey === "your-groq-api-key") {
      throw new Error(
        "GROQ_API_KEY is not set — AI features are unavailable. Add it to .env.local (see .env.example)."
      );
    }
    client = new Groq({ apiKey });
  }
  return client;
}

/** True when the error means "this model doesn't exist / was retired". */
function isModelUnavailable(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const status = (err as { status?: number }).status;
  return (
    (status === 404 || status === 400) &&
    /model|decommission|does not exist|not found/i.test(err.message)
  );
}

/**
 * Runs a completion, falling back through FALLBACK_MODELS when the current
 * model has been retired by Groq. Any other failure is logged with its real
 * cause (visible in Vercel logs) and rethrown.
 */
async function createCompletion(
  groq: Groq,
  params: Omit<ChatCompletionCreateParamsNonStreaming, "model">
): Promise<Groq.Chat.ChatCompletion> {
  const candidates = [activeModel, ...FALLBACK_MODELS.filter((m) => m !== activeModel)];
  let lastError: unknown;

  for (const model of candidates) {
    try {
      const response = await groq.chat.completions.create({ ...params, model });
      activeModel = model;
      return response;
    } catch (err) {
      lastError = err;
      if (isModelUnavailable(err)) {
        console.error(`[ai] model "${model}" unavailable, trying next fallback:`, err instanceof Error ? err.message : err);
        continue;
      }
      console.error("[ai] Groq request failed:", err);
      throw err;
    }
  }

  console.error("[ai] all models unavailable:", lastError);
  throw lastError;
}

/**
 * Asks the model to respond and forces the reply into `schema` via a pinned
 * tool call, so callers get a parsed, type-safe object back instead of
 * having to scrape JSON out of prose.
 */
export async function askAIForJSON<T>(params: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const groq = getClient();

  const response = await createCompletion(groq, {
    max_completion_tokens: params.maxTokens ?? 2048,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.prompt },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "respond",
          description: "Return the structured response for this task.",
          parameters: {
            type: "object",
            properties: params.schema,
            required: Object.keys(params.schema),
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "respond" } },
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function.name !== "respond") {
    throw new Error("The AI did not return a structured response.");
  }

  try {
    return JSON.parse(toolCall.function.arguments) as T;
  } catch {
    throw new Error("The AI returned malformed JSON.");
  }
}

/** Plain free-text completion, for the rare case structured output isn't needed. */
export async function askAI(params: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<string> {
  const groq = getClient();
  const response = await createCompletion(groq, {
    max_completion_tokens: params.maxTokens ?? 1024,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.prompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
