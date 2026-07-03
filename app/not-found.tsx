// ============================================================================
// app/not-found.tsx
// Global 404 page (Next.js file convention) — shown for any unmatched route.
// ============================================================================
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="text-2xl font-bold text-foreground">Nie znaleziono strony</h1>
      <p className="max-w-xs text-foreground-muted">
        Ta strona nie istnieje albo została przeniesiona. Wróć na stronę główną i spróbuj
        ponownie.
      </p>
      <Link href="/">
        <Button size="lg">Wróć do panelu</Button>
      </Link>
    </div>
  );
}
