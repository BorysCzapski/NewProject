"use server";

// ============================================================================
// lib/phoenix/actions.ts
// Server Actions for the Phoenix shell: installing/uninstalling mini-apps
// on the user's launcher.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { installableAppIds } from "@/lib/phoenix/apps";

/** Adds or removes one app from the user's launcher. */
export async function toggleAppInstalled(appId: string): Promise<void> {
  if (!installableAppIds().includes(appId)) {
    throw new Error("Nieznana aplikacja.");
  }
  const profile = await requireProfile();
  const current = profile.installed_apps ?? ["jezyki"];
  const next = current.includes(appId)
    ? current.filter((id) => id !== appId)
    : [...current, appId];

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ installed_apps: next })
    .eq("id", profile.id);
  if (error) {
    console.error("[phoenix] installed_apps update failed:", error);
    throw new Error("Nie udało się zapisać zmiany. Spróbuj ponownie.");
  }

  revalidatePath("/");
  revalidatePath("/aplikacje");
}
