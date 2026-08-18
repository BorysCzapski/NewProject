"use client";

// ============================================================================
// components/geografia/upload/file-list-item.tsx
// One uploaded worksheet: extraction status, exercise count, link to view/
// annotate, delete button.
// ============================================================================
import Link from "next/link";
import { useState, useTransition } from "react";
import { CheckCircle2, FileText, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteGeoFile } from "@/lib/geografia/annotations-actions";
import type { GeoFile } from "@/lib/types/database";

export function FileListItem({ file }: { file: GeoFile }) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;

  return (
    <Card className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <Link href={`/geografia/pliki/${file.id}`} className="truncate text-sm font-medium text-foreground">
          {file.title}
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          {file.status === "processing" && (
            <Badge className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> przetwarzanie
            </Badge>
          )}
          {file.status === "ready" && (
            <Badge className="flex items-center gap-1 bg-accent-soft text-accent">
              <CheckCircle2 className="h-3 w-3" /> {file.exercises_extracted} ćwiczeń
            </Badge>
          )}
          {file.status === "failed" && (
            <Badge className="flex items-center gap-1 bg-danger-soft text-danger">
              <TriangleAlert className="h-3 w-3" /> błąd
            </Badge>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Usuń plik"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await deleteGeoFile(file.id);
            if (result.ok) setDeleted(true);
          })
        }
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground-muted active:bg-surface-muted disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </Card>
  );
}
