// ============================================================================
// app/(main)/jezyki/nauka/podrecznik/page.tsx
// Podręcznik hub: upload a new textbook PDF, browse a SHARED library of
// every textbook any student has uploaded — once one person uploads a book,
// everyone can study it (see 0012_textbooks_shared.sql).
// ============================================================================
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Textbook } from "@/lib/types/database";

export default async function PodrecznikHubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: textbooks } = await supabase
    .from("textbooks")
    .select("*")
    .order("created_at", { ascending: false });

  const textbookList = (textbooks ?? []) as Textbook[];

  return (
    <div>
      <PageHeader title="Angielski szkoła" subtitle="Twój własny podręcznik do angielskiego" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-6">
          <CardTitle>Nowy podręcznik</CardTitle>
          <CardDescription className="mb-3 mt-1">
            Wgraj PDF z podręcznikiem do angielskiego — AI podzieli go na działy, wypisze słówka z
            tłumaczeniami i przygotuje ćwiczenia z gramatyki.
          </CardDescription>
          <Link href="/jezyki/nauka/podrecznik/nowy">
            <Button size="lg" className="w-full">
              Wgraj podręcznik (PDF)
            </Button>
          </Link>
        </Card>

        <h2 className="mb-3 text-sm font-semibold text-foreground-muted">Podręczniki</h2>
        {textbookList.length === 0 ? (
          <Card>
            <CardDescription>Nikt jeszcze nie wgrał podręcznika — wgraj pierwszy powyżej.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {textbookList.map((textbook) => (
              <Link key={textbook.id} href={`/jezyki/nauka/podrecznik/${textbook.id}`}>
                <Card className="flex items-center gap-4 active:scale-[0.98] transition-transform">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <BookMarked className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <CardTitle className="truncate">{textbook.title}</CardTitle>
                  </span>
                  {textbook.user_id === profile.id && <Badge className="shrink-0">Twój</Badge>}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
