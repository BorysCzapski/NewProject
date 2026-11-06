// ============================================================================
// app/(main)/mindmath/techniki/page.tsx
// Lista technik szybkiego liczenia (Indie, Chiny/Japonia, sztuczki ogólne).
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { TECHNIQUES } from "@/lib/mindmath/techniques";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function TechnikiPage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Techniki" subtitle="Sprawdzone sposoby liczenia w głowie" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {TECHNIQUES.map((t) => (
          <Link key={t.slug} href={`/mindmath/techniki/${t.slug}`}>
            <Card className="flex flex-col gap-1">
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.summary}</CardDescription>
              <p className="text-xs text-foreground-muted">{t.origin}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
