"use server";

// ============================================================================
// lib/prompt-forge/actions.ts
// Server Actions backing Kuźnia (the prompt-forge mini-app): creating a
// session, running one AI turn of the builder chat, renaming and deleting.
// The AI turn is the core of the feature — on every user message it returns
// an updated draft, proactive suggestions, and any unresolved conflicts —
// see SYSTEM_PROMPT below for exactly what it's asked to do.
// ============================================================================
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionFailure, type ActionResult } from "@/lib/action-result";
import type { PromptForgeConflict, PromptForgeMessage } from "@/lib/types/database";

const SYSTEM_PROMPT =
  "Jesteś ekspertem w inżynierii promptów (prompt engineering). Pomagasz użytkownikowi, wiadomość po " +
  "wiadomości, napisać kompletny, przemyślany prompt opisujący aplikację, którą chce zbudować. Ten prompt " +
  'zostanie PÓŹNIEJ skopiowany i wklejony do zupełnie NOWEJ, oddzielnej sesji czatu z innym asystentem AI, ' +
  'który dopiero zacznie budowę od zera — więc musi być samowystarczalny (bez odwołań w stylu "jak wyżej" ' +
  'czy "jak ustaliliśmy") i wyczerpujący. Odpowiadasz PO POLSKU.\n\n' +
  "Na podstawie CAŁEJ dotychczasowej rozmowy i najnowszej wiadomości użytkownika wykonujesz cztery rzeczy naraz:\n" +
  "1. `draft` — PEŁNA, zaktualizowana wersja dokumentu promptu w Markdown (całość od nowa, nigdy fragment ani " +
  "diff). Rozwijaj go stopniowo o to, co użytkownik właśnie powiedział. Dobry draft ma sekcje takie jak: cel " +
  "aplikacji i dla kogo jest, kluczowe funkcje, model danych, ograniczenia/technologie (jeśli sprecyzowane), " +
  "obsługa błędów i przypadków brzegowych, kryteria sukcesu, oraz — jeśli to istotne — czego świadomie NIE robić.\n" +
  "2. `reply` — krótka, konkretna odpowiedź po polsku: potwierdź, co dopisałeś do draftu, i jeśli brakuje " +
  "istotnej informacji potrzebnej do zaczęcia budowy, zadaj JEDNO celne pytanie doprecyzowujące.\n" +
  "3. `suggestions` — 2 do 4 KONKRETNYCH, realnie przydatnych propozycji uzupełnienia TEGO promptu (nie " +
  'ogólniki typu "pomyśl o UX" — tylko rzeczy, o których użytkownik jeszcze nie wspomniał, a które wpłyną na ' +
  "jakość aplikacji, np. konkretne pole danych do przechowania, rola administratora, limity/walidacja, " +
  "urządzenia docelowe, integracja z zewnętrznym API).\n" +
  "4. `conflicts` — sprzeczności lub istotne luki w dotychczasowym draftcie, których NIE dało się jednoznacznie " +
  "rozstrzygnąć z kontekstu (np. wzajemnie wykluczające się wymagania, brak kluczowej decyzji). Każdy element " +
  "to {issue, fix}: issue — krótki opis sprzeczności/luki, fix — konkretna propozycja jej rozwiązania. Jeśli " +
  "sprzeczność da się jednoznacznie naprawić na podstawie tego, co użytkownik już powiedział — NAPRAW ją od " +
  "razu w `draft` i NIE dodawaj jej do `conflicts`. W `conflicts` mają zostać tylko przypadki wymagające " +
  "decyzji użytkownika.\n\n" +
  "`readyToCopy` = true, gdy draft ma już jasno określony cel i główne funkcje i nie ma nierozwiązanych " +
  "`conflicts` — czyli nadaje się, by go skopiować i zacząć budowę (nie musi wyczerpywać każdego szczegółu).";

const FORGE_SCHEMA = {
  reply: { type: "string", description: "krótka odpowiedź po polsku dla użytkownika" },
  draft: { type: "string", description: "pełny, zaktualizowany dokument promptu w Markdown (całość, nie diff)" },
  suggestions: {
    type: "array",
    items: { type: "string" },
    description: "2-4 konkretne propozycje uzupełnienia promptu",
  },
  conflicts: {
    type: "array",
    items: {
      type: "object",
      properties: {
        issue: { type: "string", description: "krótki opis sprzeczności lub luki" },
        fix: { type: "string", description: "konkretna propozycja rozwiązania" },
      },
      required: ["issue", "fix"],
    },
    description: "sprzeczności/luki wymagające decyzji użytkownika",
  },
  readyToCopy: {
    type: "boolean",
    description: "true, gdy draft nadaje się do skopiowania i rozpoczęcia budowy",
  },
};

interface ForgeTurn {
  reply: string;
  draft: string;
  suggestions: string[];
  conflicts: PromptForgeConflict[];
  readyToCopy: boolean;
}

export interface ForgeTurnData extends ForgeTurn {
  messages: PromptForgeMessage[];
}

/** Creates a new prompt-building session and redirects to it. */
export async function createPromptSession(goal: string): Promise<ActionFailure> {
  const profile = await requireProfile();
  const trimmed = goal.trim();
  if (!trimmed) return actionFailure("Opisz krótko, jaką aplikację chcesz zbudować.");

  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("prompt_sessions")
    .insert({ user_id: profile.id, title: trimmed.slice(0, 60), goal: trimmed })
    .select("id")
    .single();
  if (error || !session) {
    console.error("[prompt-forge] session insert failed:", error);
    return actionFailure("Nie udało się utworzyć nowej sesji. Spróbuj ponownie.");
  }

  revalidatePath("/kuznia");
  redirect(`/kuznia/${session.id}`);
}

/**
 * Runs one AI turn: sends the full chat history (for real memory, unlike the
 * writing module's follow-up chat) plus the current draft, gets back an
 * updated draft/suggestions/conflicts, and persists the new state.
 */
export async function sendForgeMessage(
  sessionId: string,
  userMessage: string
): Promise<ActionResult<ForgeTurnData>> {
  const profile = await requireProfile();
  const trimmed = userMessage.trim();
  if (!trimmed) return actionFailure("Napisz coś przed wysłaniem.");

  const supabase = await createClient();
  const { data: session, error: fetchError } = await supabase
    .from("prompt_sessions")
    .select("draft, messages")
    .eq("id", sessionId)
    .eq("user_id", profile.id)
    .single();
  if (fetchError || !session) return actionFailure("Nie znaleziono sesji.");

  const priorMessages = session.messages as PromptForgeMessage[];
  const history = priorMessages.map((m) => ({ role: m.role, content: m.content }));
  const draft = session.draft as string;

  let turn: ForgeTurn;
  try {
    turn = await askAIForJSON<ForgeTurn>({
      system: SYSTEM_PROMPT,
      history,
      prompt:
        (draft ? `Aktualny draft promptu (Markdown):\n"""\n${draft}\n"""\n\n` : "") +
        `Nowa wiadomość użytkownika: "${trimmed}"`,
      schema: FORGE_SCHEMA,
      maxTokens: 3000,
    });
  } catch (err) {
    console.error("[prompt-forge] AI turn failed:", err);
    return actionFailure("Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie za chwilę.");
  }

  const messages: PromptForgeMessage[] = [
    ...priorMessages,
    { role: "user", content: trimmed },
    { role: "assistant", content: turn.reply },
  ];

  const { error: updateError } = await supabase
    .from("prompt_sessions")
    .update({
      draft: turn.draft,
      messages,
      conflicts: turn.conflicts,
      suggestions: turn.suggestions,
      ready_to_copy: turn.readyToCopy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
  if (updateError) {
    console.error("[prompt-forge] session update failed:", updateError);
    return actionFailure("Odpowiedź przyszła, ale nie udało się jej zapisać. Spróbuj ponownie.");
  }

  return { ok: true, data: { ...turn, messages } };
}

/** Renames a session (used from the session list and the workspace header). */
export async function renamePromptSession(sessionId: string, title: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const trimmed = title.trim();
  if (!trimmed) return actionFailure("Tytuł nie może być pusty.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("prompt_sessions")
    .update({ title: trimmed })
    .eq("id", sessionId)
    .eq("user_id", profile.id);
  if (error) {
    console.error("[prompt-forge] rename failed:", error);
    return actionFailure("Nie udało się zmienić nazwy.");
  }

  revalidatePath("/kuznia");
  return { ok: true, data: null };
}

/** Deletes a session and returns to the session list. */
export async function deletePromptSession(sessionId: string): Promise<ActionFailure> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("prompt_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", profile.id);
  if (error) {
    console.error("[prompt-forge] delete failed:", error);
    return actionFailure("Nie udało się usunąć sesji.");
  }

  revalidatePath("/kuznia");
  redirect("/kuznia");
}
