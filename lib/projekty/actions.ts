"use server";
// ============================================================================
// lib/projekty/actions.ts
// Server Actions "Projektów". Żadna nie przyjmuje user_id z zewnątrz (bierzemy
// go z sesji), a każde zapytanie dodatkowo filtruje po user_id; RLS to druga
// warstwa. Komunikaty błędów są ZWRACANE, nie rzucane (patrz lib/action-result.ts).
// ============================================================================
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { isValidDateKey, todayKey } from "@/lib/habits/dates";
import { STATUSES } from "@/lib/projekty/constants";
import type { ProjectStatus } from "@/lib/types/database";

const MAX_PROJECTS = 100;
const MAX_ITEMS = 200;

function refresh(projectId?: string) {
  revalidatePath("/projekty");
  if (projectId) revalidatePath(`/projekty/${projectId}`);
}

export async function createProject(title: string, description: string): Promise<ActionResult<{ id: string }>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const t = title?.trim() ?? "";
  if (!t) return actionFailure("Wpisz nazwę projektu.");
  if (t.length > 100) return actionFailure("Nazwa może mieć maksymalnie 100 znaków.");
  if ((description ?? "").length > 4000) return actionFailure("Opis jest za długi (max 4000 znaków).");

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);
  if ((count ?? 0) >= MAX_PROJECTS) return actionFailure(`Maksymalnie ${MAX_PROJECTS} projektów.`);

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: profile.id, title: t, description: description?.trim() ?? "" })
    .select("id")
    .single();
  if (error || !data) return actionFailure("Nie udało się utworzyć projektu. Spróbuj ponownie.");
  refresh();
  return { ok: true, data: { id: data.id } };
}

export async function updateProject(
  projectId: string,
  patch: { title?: string; description?: string; status?: ProjectStatus }
): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t || t.length > 100) return actionFailure("Nazwa musi mieć od 1 do 100 znaków.");
    update.title = t;
  }
  if (patch.description !== undefined) {
    if (patch.description.length > 4000) return actionFailure("Opis jest za długi (max 4000 znaków).");
    update.description = patch.description.trim();
  }
  if (patch.status !== undefined) {
    if (!STATUSES.includes(patch.status)) return actionFailure("Nieznany status.");
    update.status = patch.status;
  }
  const { error } = await supabase.from("projects").update(update).eq("id", projectId).eq("user_id", profile.id);
  if (error) return actionFailure("Nie udało się zapisać zmian.");
  refresh(projectId);
  return { ok: true, data: null };
}

export async function deleteProject(projectId: string): Promise<void> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", profile.id);
  if (error) console.error("[projekty] delete failed:", error);
  refresh();
  redirect("/projekty");
}

export async function addItem(
  projectId: string,
  kind: "step" | "need",
  text: string,
  note = ""
): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const t = text?.trim() ?? "";
  if (!t) return actionFailure("Wpisz treść.");
  if (t.length > 200) return actionFailure("Maksymalnie 200 znaków.");
  if (note.length > 1000) return actionFailure("Notatka jest za długa (max 1000 znaków).");
  if (kind !== "step" && kind !== "need") return actionFailure("Nieznany typ wpisu.");

  const { count } = await supabase
    .from("project_items")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("user_id", profile.id);
  if ((count ?? 0) >= MAX_ITEMS) return actionFailure(`Maksymalnie ${MAX_ITEMS} wpisów w projekcie.`);

  const { error } = await supabase.from("project_items").insert({
    project_id: projectId,
    user_id: profile.id,
    kind,
    text: t,
    note: note.trim(),
    position: count ?? 0,
  });
  if (error) return actionFailure("Nie udało się dodać wpisu.");
  await touch(projectId, profile.id);
  refresh(projectId);
  return { ok: true, data: null };
}

export async function setItemDone(itemId: string, projectId: string, done: boolean): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_items")
    .update({ done })
    .eq("id", itemId)
    .eq("user_id", profile.id);
  if (error) return actionFailure("Nie udało się zapisać.");
  await touch(projectId, profile.id);
  refresh(projectId);
  return { ok: true, data: null };
}

export async function deleteItem(itemId: string, projectId: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("project_items").delete().eq("id", itemId).eq("user_id", profile.id);
  if (error) return actionFailure("Nie udało się usunąć wpisu.");
  refresh(projectId);
  return { ok: true, data: null };
}

export async function addSession(projectId: string, note: string, day?: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const n = note?.trim() ?? "";
  if (!n) return actionFailure("Napisz, nad czym pracowałeś.");
  if (n.length > 2000) return actionFailure("Wpis jest za długi (max 2000 znaków).");
  const date = day && isValidDateKey(day) ? day : todayKey();
  if (date > todayKey()) return actionFailure("Nie można dodać sesji z przyszłości.");

  const { error } = await supabase
    .from("project_sessions")
    .insert({ project_id: projectId, user_id: profile.id, day: date, note: n });
  if (error) return actionFailure("Nie udało się zapisać sesji.");
  await touch(projectId, profile.id);
  refresh(projectId);
  return { ok: true, data: null };
}

export async function deleteSession(sessionId: string, projectId: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("project_sessions").delete().eq("id", sessionId).eq("user_id", profile.id);
  if (error) return actionFailure("Nie udało się usunąć sesji.");
  refresh(projectId);
  return { ok: true, data: null };
}

async function touch(projectId: string, userId: string) {
  const supabase = await createClient();
  await supabase
    .from("projects")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", userId);
}
