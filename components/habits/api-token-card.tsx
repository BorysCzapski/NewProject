"use client";

// ============================================================================
// components/habits/api-token-card.tsx
// "Skrót macOS": generowanie / odnawianie tokenu API do nawyków. Token
// pokazujemy tylko raz (w bazie jest sam hash), z przyciskiem kopiowania.
// ============================================================================
import { useState, useTransition } from "react";
import { Copy, KeyRound } from "lucide-react";
import { regenerateHabitApiToken, revokeHabitApiToken } from "@/lib/habits/actions";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }) : "nigdy";
}

export function ApiTokenCard({
  hasToken,
  createdAt,
  lastUsedAt,
}: {
  hasToken: boolean;
  createdAt: string | null;
  lastUsedAt: string | null;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generate() {
    if (hasToken && !window.confirm("Odnowienie unieważni obecny token — skróty trzeba będzie zaktualizować. Kontynuować?")) {
      return;
    }
    setError(null);
    setCopied(false);
    startTransition(async () => {
      const res = await regenerateHabitApiToken();
      if (res.ok) setToken(res.data.token);
      else setError(res.error);
    });
  }

  function revoke() {
    if (!window.confirm("Usunąć token? Skróty przestaną działać.")) return;
    setError(null);
    startTransition(async () => {
      const res = await revokeHabitApiToken();
      if (res.ok) setToken(null);
      else setError(res.error);
    });
  }

  async function copy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
    } catch {
      setError("Nie udało się skopiować — zaznacz token ręcznie.");
    }
  }

  return (
    <Card className="mt-4">
      <CardTitle>
        <span className="inline-flex items-center gap-2">
          <KeyRound className="h-4 w-4" aria-hidden /> Skrót macOS / API
        </span>
      </CardTitle>
      <p className="mt-2 text-sm text-muted-foreground">
        Odhaczaj nawyki z aplikacji Skróty (widget na pulpicie) lub z curl. Token wklejasz w nagłówku{" "}
        <code>Authorization: Bearer …</code>. Pełna instrukcja jest w README (sekcja Habit Tracking).
      </p>

      {token && (
        <div className="mt-3 rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Skopiuj teraz — drugi raz go nie pokażemy.</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 break-all text-xs">{token}</code>
            <Button type="button" size="sm" variant="outline" onClick={copy}>
              <Copy className="mr-1 h-3 w-3" aria-hidden /> {copied ? "Skopiowano" : "Kopiuj"}
            </Button>
          </div>
        </div>
      )}

      {!token && hasToken && (
        <p className="mt-3 text-xs text-muted-foreground">
          Token aktywny — utworzony {fmt(createdAt)}, ostatnio użyty: {fmt(lastUsedAt)}.
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" onClick={generate} disabled={isPending}>
          {hasToken ? "Odnów token" : "Wygeneruj token"}
        </Button>
        {hasToken && (
          <Button type="button" size="sm" variant="outline" onClick={revoke} disabled={isPending}>
            Usuń token
          </Button>
        )}
      </div>
    </Card>
  );
}
