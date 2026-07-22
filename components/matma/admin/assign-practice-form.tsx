"use client";

// ============================================================================
// components/matma/admin/assign-practice-form.tsx
// Per-student "zadaj ćwiczenie" control on the admin roster: a topic picker
// (native select, styled like Input — no Select primitive exists) plus an
// optional note, calling adminAssignTopicPractice. Same one-click spirit as
// components/learning-path/assign-catchup-button.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { adminAssignTopicPractice } from "@/lib/matma/actions";
import type { MathTopic } from "@/lib/types/database";

export function AssignPracticeForm({ studentId, topics }: { studentId: string; topics: MathTopic[] }) {
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  if (topics.length === 0) return null;

  function assign() {
    setStatus(null);
    startTransition(async () => {
      const result = await adminAssignTopicPractice(studentId, topicId, note);
      if (result.ok) {
        setStatus({ ok: true, message: "Zadano ćwiczenie." });
        setNote("");
      } else {
        setStatus({ ok: false, message: result.error });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <div>
        <Label htmlFor={`topic-${studentId}`}>Dział</Label>
        <select
          id={`topic-${studentId}`}
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`note-${studentId}`}>Notatka (opcjonalnie)</Label>
        <Input
          id={`note-${studentId}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Np. powtórz przed sprawdzianem"
        />
      </div>
      <Button size="sm" variant="outline" isLoading={isPending} onClick={assign} className="self-start">
        <Sparkles className="h-4 w-4" /> Zadaj ćwiczenie
      </Button>
      {status && <p className={cn("text-sm", status.ok ? "text-accent" : "text-danger")}>{status.message}</p>}
    </div>
  );
}
