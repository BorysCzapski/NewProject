"use client";

// ============================================================================
// components/geografia/annotations/annotation-panel.tsx
// Private per-user notes on an uploaded worksheet PDF (product spec §11).
// Scope note: this is a PAGE-LEVEL note (page number + optional quoted
// excerpt + comment), not a pixel-precise PDF.js text-range highlight layer
// — a full coordinate-mapped annotation overlay is a much larger feature;
// this covers the same underlying need (mark important fragments, save
// remarks) with a much simpler, reliable implementation.
// ============================================================================
import { useState, useTransition } from "react";
import { Plus, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createAnnotation, deleteAnnotation } from "@/lib/geografia/annotations-actions";
import type { GeoAnnotation } from "@/lib/types/database";

export function AnnotationPanel({
  fileId,
  initialAnnotations,
}: {
  fileId: string;
  initialAnnotations: GeoAnnotation[];
}) {
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [pageNumber, setPageNumber] = useState(1);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) {
      setError("Wpisz treść notatki.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createAnnotation({
        fileId,
        pageNumber,
        type: "note",
        content,
        excerpt: excerpt.trim() || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAnnotations((prev) => [result.data, ...prev]);
      setContent("");
      setExcerpt("");
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteAnnotation(id, fileId);
      if (result.ok) setAnnotations((prev) => prev.filter((a) => a.id !== id));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-foreground-muted" htmlFor="geo-annotation-page">
            Strona
          </label>
          <input
            id="geo-annotation-page"
            type="number"
            min={1}
            value={pageNumber}
            onChange={(e) => setPageNumber(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded-(--radius-control) border border-border bg-surface px-2 py-1 text-sm text-foreground"
          />
        </div>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Cytowany fragment (opcjonalnie)"
          className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Twoja notatka..."
          maxLength={2000}
          className="w-full rounded-(--radius-control) border border-border bg-surface p-3 text-sm text-foreground placeholder:text-foreground-muted"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button size="sm" className="self-start" isLoading={isPending} onClick={submit}>
          <Plus className="h-4 w-4" />
          Dodaj notatkę
        </Button>
      </Card>

      {annotations.length === 0 ? (
        <p className="py-4 text-center text-sm text-foreground-muted">Brak notatek do tego pliku.</p>
      ) : (
        annotations.map((a) => (
          <Card key={a.id} className="flex items-start gap-2">
            <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground-muted">Strona {a.page_number}</p>
              {a.excerpt && <p className="mt-0.5 text-xs italic text-foreground-muted">&bdquo;{a.excerpt}&rdquo;</p>}
              <p className="mt-1 text-sm text-foreground">{a.content}</p>
            </div>
            <button
              type="button"
              aria-label="Usuń notatkę"
              disabled={isPending}
              onClick={() => remove(a.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground-muted active:bg-surface-muted disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))
      )}
    </div>
  );
}
