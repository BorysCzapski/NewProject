// ============================================================================
// app/(main)/modlitwa/intencje/page.tsx
// Lista osób, za które użytkownik obiecał się modlić, plus proponowana
// modlitwa wstawiennicza do odmówienia nad całą listą.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getPrayerRequests } from "@/lib/modlitwa/queries";
import { todayKey } from "@/lib/modlitwa/liturgical-calendar";
import { MODLITWA_ZA_INNYCH } from "@/lib/modlitwa/prayers";
import { PageHeader } from "@/components/layout/page-header";
import { IntentionsList } from "@/components/modlitwa/intentions-list";
import { Card, CardTitle } from "@/components/ui/card";

export default async function IntencjePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { active, fulfilled } = await getPrayerRequests(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Intencje" subtitle="Modlitwa za innych" />

      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <IntentionsList initialActive={active} initialFulfilled={fulfilled} today={todayKey()} />

        <Card className="flex flex-col gap-2">
          <CardTitle>{MODLITWA_ZA_INNYCH.title}</CardTitle>
          <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-foreground">
            {MODLITWA_ZA_INNYCH.text}
          </p>
        </Card>

        <p className="text-xs text-foreground-muted">
          Intencje są prywatne — widzisz je tylko Ty. Nie są udostępniane innym użytkownikom ani
          administratorowi, a do kalendarza trafiają wyłącznie po włączeniu tej opcji w ustawieniach.
        </p>
      </div>
    </div>
  );
}
