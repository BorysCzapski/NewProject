"use server";

// ============================================================================
// lib/matura/practice-actions.ts
// "Rozwiąż zadanie tego typu" — picks the next task of a CKE type for the
// student and sends them to it, then tops the queue back up in the background.
//
// A Server Action rather than a link, on purpose. Handing out a task is a
// MUTATION: when the queue is empty it generates and stores a new task. Next
// prefetches <Link> targets on hover and in the viewport, so a GET route here
// would fire the generator for every type card the student merely scrolled
// past — burning Groq budget on tasks nobody asked for. A form POST is never
// prefetched.
//
// Top-up runs inside `after()`, which Next runs once the response (here: the
// redirect) has been flushed — so the student is already looking at their task
// while the next ones are being written. `after` still runs when the callback's
// caller ended in a redirect, which is exactly this shape.
// ============================================================================
import { after } from "next/server";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getTaskType, getWritingType } from "@/lib/matura/task-types";
import { pickTaskForType, topUpTypeStock } from "@/lib/matura/task-stock";
import { pickWritingTaskForType, topUpWritingStock } from "@/lib/matura/writing-stock";
import type { MaturaSection } from "@/lib/types/database";

/** Shared lookup: the student's current (język, poziom) and the section row
 * that pairs with it. Everything in this file is scoped by that choice. */
async function resolveSection(sectionSlug: string) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: sectionRow } = await supabase
    .from("matura_sections")
    .select("*")
    .eq("language", settings.language)
    .eq("level", settings.level)
    .eq("slug", sectionSlug)
    .maybeSingle();

  if (!sectionRow) redirect("/matura/nauka");
  return { profile, supabase, settings, section: sectionRow as MaturaSection };
}

export async function startTaskType(formData: FormData): Promise<void> {
  const sectionSlug = String(formData.get("sectionSlug") ?? "");
  const typeSlug = String(formData.get("typeSlug") ?? "");

  const typeDef = getTaskType(typeSlug);
  if (!typeDef || typeDef.section !== sectionSlug) redirect(`/matura/nauka/${sectionSlug}`);

  const { profile, supabase, settings, section } = await resolveSection(sectionSlug);

  const picked = await pickTaskForType({
    supabase,
    userId: profile.id,
    sectionId: section.id,
    typeDef,
    language: settings.language,
    level: settings.level,
  });

  // No bank and no generator (rozumienie ze słuchu before any recording has
  // been curated) — back to the hub, which explains the empty state.
  if (!picked) redirect(`/matura/nauka/${sectionSlug}?pusto=${typeSlug}`);

  after(async () => {
    try {
      await topUpTypeStock({
        supabase,
        userId: profile.id,
        sectionId: section.id,
        typeDef,
        language: settings.language,
        level: settings.level,
      });
    } catch (err) {
      console.error("[matura] uzupełnianie zapasu zadań nie powiodło się:", err);
    }
  });

  redirect(`/matura/nauka/${sectionSlug}/zadanie/${picked.taskId}?typ=${typeSlug}`);
}

export async function startWritingType(formData: FormData): Promise<void> {
  const formType = String(formData.get("formType") ?? "");

  const typeDef = getWritingType(formType);
  if (!typeDef) redirect("/matura/nauka/pisanie");

  const { profile, supabase, settings, section } = await resolveSection("pisanie");

  const picked = await pickWritingTaskForType({
    supabase,
    userId: profile.id,
    sectionId: section.id,
    typeDef,
    language: settings.language,
    level: settings.level,
  });

  if (!picked) redirect(`/matura/nauka/pisanie?pusto=${formType}`);

  after(async () => {
    try {
      await topUpWritingStock({
        supabase,
        userId: profile.id,
        sectionId: section.id,
        typeDef,
        language: settings.language,
        level: settings.level,
      });
    } catch (err) {
      console.error("[matura] uzupełnianie zapasu poleceń nie powiodło się:", err);
    }
  });

  redirect(`/matura/nauka/pisanie/zadanie/${picked.taskId}?typ=${formType}`);
}
