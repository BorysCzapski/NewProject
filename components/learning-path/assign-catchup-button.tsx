"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignCatchUpHomework } from "@/lib/learning-path/actions";
import type { UserLevel } from "@/lib/types/database";

export function AssignCatchupButton({ level, category }: { level: UserLevel; category: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Button variant="outline" size="sm" disabled className="w-full">
        Praca domowa zadana ✓
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      isLoading={isPending}
      onClick={() =>
        startTransition(async () => {
          await assignCatchUpHomework(level, category);
          setDone(true);
        })
      }
    >
      <Sparkles className="h-4 w-4" /> Zadaj pracę domową z tej kategorii
    </Button>
  );
}
