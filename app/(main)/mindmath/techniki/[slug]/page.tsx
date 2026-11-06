// ============================================================================
// app/(main)/mindmath/techniki/[slug]/page.tsx
// Jedna technika: kroki, przykład rozpisany po kolei i link do treningu.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Timer } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { getTechnique } from "@/lib/mindmath/techniques";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TechniquePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireProfile();
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) notFound();

  return (
    <div>
      <PageHeader title={t.title} subtitle={t.origin} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link href="/mindmath/techniki" className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Wszystkie techniki
        </Link>
        <Card>
          <p className="text-foreground">{t.summary}</p>
        </Card>
        <Card>
          <CardTitle>Jak to działa</CardTitle>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-foreground">
            {t.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Card>
        <Card>
          <CardTitle>Przykład: {t.example.problem}</CardTitle>
          <ul className="mt-2 space-y-1.5 text-foreground">
            {t.example.walkthrough.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Card>
        {t.tip && (
          <Card className="bg-primary-soft">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Wskazówka: </span>
              {t.tip}
            </p>
          </Card>
        )}
        {t.mode && (
          <Link href={`/mindmath/trening?tryb=${t.mode}`}>
            <Button className="w-full">
              <Timer className="h-5 w-5" />
              Ćwicz tę technikę
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
