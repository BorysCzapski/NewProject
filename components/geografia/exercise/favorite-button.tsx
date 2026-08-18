"use client";

// ============================================================================
// components/geografia/exercise/favorite-button.tsx
// Toggles geo_favorites for one exercise — "oznaczanie zadań jako ulubione"
// from the product spec's personalization requirement.
// ============================================================================
import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toggleFavorite } from "@/lib/geografia/actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({ exerciseId, initialFavorited }: { exerciseId: string; initialFavorited: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={favorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleFavorite(exerciseId);
          if (result.ok) setFavorited(result.data.favorited);
        })
      }
      className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted active:bg-surface-muted disabled:opacity-50"
    >
      <Star className={cn("h-5 w-5", favorited && "fill-warning text-warning")} />
    </button>
  );
}
