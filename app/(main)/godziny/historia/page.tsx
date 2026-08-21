// ============================================================================
// app/(main)/godziny/historia/page.tsx
// Przegląd historii nauki wg dni, tygodni albo miesięcy, z filtrem po temacie.
//
// Oba filtry czytamy z adresu (?grupowanie=&temat=) i przeliczamy na serwerze.
// Nieznana wartość w URL-u nie jest błędem — wracamy do domyślnego widoku
// dziennego, bo to adres wpisany ręcznie albo stary link, a nie atak.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getHistory, listTopics } from "@/lib/godziny/queries";
import { isGrouping, todayKey } from "@/lib/godziny/format";
import { PageHeader } from "@/components/layout/page-header";
import { HistoryView } from "@/components/godziny/history-view";
import { Card, CardDescription } from "@/components/ui/card";

export default async function GodzinyHistoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ grupowanie?: string; temat?: string }>;
}) {
  const { grupowanie, temat } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();
  const today = todayKey();

  const grouping = isGrouping(grupowanie) ? grupowanie : "day";

  const topics = await listTopics(supabase, profile.id, { includeArchived: true });
  // Temat z URL-a musi być NASZ — inaczej filtr byłby sondą, czy dany
  // identyfikator istnieje u kogoś innego.
  const topicId = topics.some((topic) => topic.id === temat) ? temat : undefined;

  const history = await getHistory(supabase, profile.id, { grouping, topicId, today });

  return (
    <div>
      <PageHeader title="Historia" subtitle="Ile czasu i na co poszło" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {topics.length === 0 ? (
          <Card>
            <CardDescription>
              Nie masz jeszcze żadnych tematów ani wpisów — historia pojawi się po zapisaniu
              pierwszej nauki.
            </CardDescription>
          </Card>
        ) : (
          <HistoryView history={history} topics={topics} today={today} topicId={topicId} />
        )}
      </div>
    </div>
  );
}
