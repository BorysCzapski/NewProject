// ============================================================================
// app/(main)/kuznia/page.tsx
// Kuźnia hub ("/kuznia"): start a new prompt-building session or resume a
// saved one. Kuźnia is one of Phoenix's mini-apps; the platform launcher
// lives at "/".
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { NewSessionForm } from "@/components/prompt-forge/new-session-form";
import { SessionList } from "@/components/prompt-forge/session-list";

export default async function KuzniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("prompt_sessions")
    .select("id, title, ready_to_copy, updated_at")
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Kuźnia" subtitle="Kreator promptów do budowy kolejnych aplikacji" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <NewSessionForm />
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Twoje sesje
          </h2>
          <SessionList sessions={sessions ?? []} />
        </section>
      </div>
    </div>
  );
}
