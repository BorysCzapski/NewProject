"use client";

// ============================================================================
// components/phoenix/app-manager.tsx
// The /aplikacje list: every registry app grouped by section, with an
// install/uninstall toggle (built apps) or a "wkrótce" badge (planned ones).
// ============================================================================
import { useState, useTransition } from "react";
import { Check, Plus } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/phoenix/app-icon";
import { toggleAppInstalled } from "@/lib/phoenix/actions";
import { PHOENIX_APPS, PHOENIX_SECTIONS } from "@/lib/phoenix/apps";

export function AppManager({ installedIds }: { installedIds: string[] }) {
  const [installed, setInstalled] = useState(new Set(installedIds));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(appId: string) {
    setError(null);
    setPendingId(appId);
    startTransition(async () => {
      try {
        await toggleAppInstalled(appId);
        setInstalled((prev) => {
          const next = new Set(prev);
          if (next.has(appId)) next.delete(appId);
          else next.add(appId);
          return next;
        });
      } catch {
        setError("Nie udało się zapisać zmiany. Spróbuj ponownie.");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-sm text-danger">{error}</p>}
      {PHOENIX_SECTIONS.map((section) => {
        const apps = PHOENIX_APPS.filter((a) => a.section === section.id);
        if (apps.length === 0) return null;
        return (
          <section key={section.id}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              <AppIcon name={section.icon} className="h-4 w-4" />
              {section.label}
            </h2>
            <div className="flex flex-col gap-2">
              {apps.map((app) => {
                const isInstalled = installed.has(app.id);
                return (
                  <Card key={app.id} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <AppIcon name={app.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <CardTitle>{app.name}</CardTitle>
                      <CardDescription className="mt-0.5">{app.description}</CardDescription>
                    </span>
                    {app.comingSoon ? (
                      <Badge className="shrink-0">Wkrótce</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant={isInstalled ? "outline" : "primary"}
                        className="shrink-0"
                        onClick={() => toggle(app.id)}
                        isLoading={pendingId === app.id}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="h-4 w-4" /> Mam
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" /> Dodaj
                          </>
                        )}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
