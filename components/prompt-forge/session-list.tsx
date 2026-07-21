"use client";

// ============================================================================
// components/prompt-forge/session-list.tsx
// The Kuźnia hub's list of saved sessions, each linking into its workspace,
// with a per-row delete (deletePromptSession redirects back here on success).
// ============================================================================
import { useState, useTransition } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePromptSession } from "@/lib/prompt-forge/actions";

interface SessionSummary {
  id: string;
  title: string;
  ready_to_copy: boolean;
  updated_at: string;
}

export function SessionList({ sessions }: { sessions: SessionSummary[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string) {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        // On success the action redirects; on failure it RETURNS the error
        // (thrown Server Action errors are redacted in production).
        const result = await deletePromptSession(id);
        if (!result.ok) {
          setError(result.error);
          setPendingId(null);
        }
      } catch (err) {
        unstable_rethrow(err);
        setError("Nie udało się usunąć sesji.");
        setPendingId(null);
      }
    });
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center text-sm text-foreground-muted">
        Brak zapisanych promptów — zacznij od formularza powyżej.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-danger">{error}</p>}
      {sessions.map((session) => (
        <Card key={session.id} className="flex items-center gap-3">
          <Link href={`/kuznia/${session.id}`} className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="truncate">{session.title}</CardTitle>
              {session.ready_to_copy && <Badge className="shrink-0 bg-accent-soft text-accent">Gotowy</Badge>}
            </div>
            <CardDescription className="mt-0.5">
              {new Date(session.updated_at).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </CardDescription>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Usuń sesję"
            onClick={() => handleDelete(session.id)}
            isLoading={pendingId === session.id}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
