"use client";

// ============================================================================
// components/projekty/new-project-form.tsx
// Dodawanie projektu: nazwa + "co dokładnie chcę zrobić". Po zapisie przenosi
// do strony projektu, gdzie dodaje się kroki, potrzebne rzeczy i sesje.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createProject } from "@/lib/projekty/actions";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createProject(title, description);
      if (!res.ok) setError(res.error);
      else router.push(`/projekty/${res.data.id}`);
    });
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <CardTitle>Nowy projekt</CardTitle>
        <div>
          <Label htmlFor="project-title">Nazwa</Label>
          <Input
            id="project-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="np. Naprawa magnetofonu"
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="project-desc">Co dokładnie chcę zrobić? (opcjonalnie)</Label>
          <textarea
            id="project-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={4000}
            className="w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="np. wyczyścić, wymienić pasek i sprawdzić głowice"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isPending || !title.trim()}>
          <Plus className="h-5 w-5" />
          Dodaj projekt
        </Button>
      </form>
    </Card>
  );
}
