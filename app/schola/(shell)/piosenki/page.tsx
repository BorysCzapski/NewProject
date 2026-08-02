// ============================================================================
// app/schola/(shell)/piosenki/page.tsx
// Song library list: text search + tag filter (GET query params, native
// form, no client JS required for filtering itself).
// ============================================================================
import Link from "next/link";
import { Plus, FileUp, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listScholaSongs } from "@/lib/schola/queries";
import { SUGGESTED_SCHOLA_TAGS } from "@/lib/schola/tags";
import { ScholaPageHeader } from "@/components/schola/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ScholaSongsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const supabase = await createClient();
  const songs = await listScholaSongs(supabase, { search: q, tag });

  return (
    <div>
      <ScholaPageHeader
        title="Piosenki"
        action={
          <Link href="/schola/piosenki/nowa">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Dodaj
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <div className="mb-4 flex gap-2">
          <Link href="/schola/piosenki/import-pdf" className="flex-1">
            <Button variant="outline" className="w-full">
              <FileUp className="h-4 w-4" /> Import z PDF
            </Button>
          </Link>
          <Link href="/schola/piosenki/import-zdjecie" className="flex-1">
            <Button variant="outline" className="w-full">
              <Camera className="h-4 w-4" /> Ze zdjęcia
            </Button>
          </Link>
        </div>

        <form method="get" className="mb-4 flex flex-col gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Szukaj po tytule..."
            className="h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/schola/piosenki"
              className={`rounded-full border px-3 py-1.5 text-sm ${
                !tag ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
              }`}
            >
              Wszystkie
            </Link>
            {SUGGESTED_SCHOLA_TAGS.map((t) => (
              <Link
                key={t}
                href={`/schola/piosenki?tag=${encodeURIComponent(t)}`}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  tag === t ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </form>

        {songs.length === 0 ? (
          <Card>
            <CardDescription>Brak pieśni spełniających wybrane kryteria.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/schola/piosenki/${song.id}`}
                className="flex flex-col gap-1 rounded-(--radius-control) border border-border bg-surface px-4 py-3 active:opacity-80"
              >
                <span className="font-medium text-foreground">{song.title}</span>
                {song.tags.length > 0 && (
                  <span className="text-xs text-foreground-muted">{song.tags.join(" · ")}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
