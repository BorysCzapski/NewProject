// ============================================================================
// app/(main)/godziny/tematy/page.tsx
// Lista tematów nauki — to, co można wybrać przy zapisywaniu godzin.
//
// Do każdego tematu doliczamy jego dotychczasowe użycie (minuty + liczba
// wpisów). To nie jest ozdoba: właśnie ta liczba decyduje, czy temat wolno
// skasować, czy tylko zarchiwizować, więc użytkownik widzi powód, zanim
// kliknie.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { listTopics, minutesByTopic } from "@/lib/godziny/queries";
import { PageHeader } from "@/components/layout/page-header";
import { TopicManager, type TopicUsage } from "@/components/godziny/topic-manager";
import { SeedTopicsButton } from "@/components/godziny/seed-topics-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function GodzinyTematyPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, totals] = await Promise.all([
    listTopics(supabase, profile.id, { includeArchived: true }),
    minutesByTopic(supabase, profile.id),
  ]);

  // Map nie przechodzi przez granicę serwer→klient tak przewidywalnie jak
  // zwykły obiekt, więc spłaszczamy ją tutaj.
  const usage: Record<string, TopicUsage> = {};
  for (const [topicId, value] of totals) usage[topicId] = value;

  return (
    <div>
      <PageHeader title="Tematy" subtitle="Czego możesz się uczyć" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {topics.length === 0 && (
          <Card className="flex flex-col gap-3">
            <div>
              <CardTitle>Pusta lista</CardTitle>
              <CardDescription className="mt-1">
                Możesz zacząć od gotowego zestawu (przedmioty szkolne, rozwój własny i aplikacje
                edukacyjne z Phoenixa) i dopasować go do siebie — albo dodać własne tematy od zera.
              </CardDescription>
            </div>
            <SeedTopicsButton />
          </Card>
        )}

        <TopicManager topics={topics} usage={usage} />
      </div>
    </div>
  );
}
