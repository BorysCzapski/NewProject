// ============================================================================
// app/(main)/matura/slownictwo/powtorka/page.tsx
// The cross-block review queue: entries whose Leitner interval has elapsed,
// most overdue first. This is what makes the bank revisable at all — several
// thousand entries cannot be worked through by walking topics in order.
// ============================================================================
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getDueVocabEntries, getVocabProgressForEntries } from "@/lib/matura/vocab";
import { langInfo } from "@/lib/languages";
import { PageHeader } from "@/components/layout/page-header";
import { VocabDrill } from "@/components/matura/vocab-drill";

const BACK_HREF = "/matura/slownictwo";

export default async function MaturaVocabReviewPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const due = await getDueVocabEntries(supabase, profile.id, settings.language, settings.level, 20);
  const entries = due.map((item) => item.entry);
  const progress = await getVocabProgressForEntries(
    supabase,
    profile.id,
    entries.map((entry) => entry.id)
  );
  const boxes = Object.fromEntries([...progress.entries()].map(([id, row]) => [id, row.box]));

  return (
    <div>
      <PageHeader title="Powtórka" subtitle="Słowa, których termin powtórki właśnie minął" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <VocabDrill
          entries={entries}
          boxes={boxes}
          backHref={BACK_HREF}
          accentChars={langInfo(settings.language).specialChars}
        />
      </div>
    </div>
  );
}
