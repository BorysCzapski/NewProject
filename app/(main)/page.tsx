// ============================================================================
// app/(main)/page.tsx
// Phoenix home — the launcher. Shows the user's INSTALLED mini-apps grouped
// by section, with a link to the /aplikacje manager to add more. Individual
// apps live under their own route namespace (e.g. Linguo under /jezyki).
// ============================================================================
import Link from "next/link";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/phoenix/app-icon";
import { PHOENIX_APPS, PHOENIX_SECTIONS } from "@/lib/phoenix/apps";

export default async function PhoenixHomePage() {
  const profile = await requireProfile();
  // Tolerate profiles from before migration 0005 (column missing → undefined).
  const installed = new Set(profile.installed_apps ?? ["jezyki"]);
  const installedApps = PHOENIX_APPS.filter((a) => !a.comingSoon && installed.has(a.id));

  return (
    <div>
      <PageHeader title="Phoenix" subtitle={`Cześć, ${profile.username}!`} />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        {installedApps.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Brak zainstalowanych aplikacji</CardTitle>
            <CardDescription>
              Dodaj aplikacje, których chcesz używać — pojawią się na tym ekranie.
            </CardDescription>
          </Card>
        ) : (
          PHOENIX_SECTIONS.map((section) => {
            const apps = installedApps.filter((a) => a.section === section.id);
            if (apps.length === 0) return null;
            return (
              <section key={section.id}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  <AppIcon name={section.icon} className="h-4 w-4" />
                  {section.label}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {apps.map((app) => (
                    <Link key={app.id} href={app.href}>
                      <Card className="flex h-full flex-col gap-2 active:scale-[0.98] transition-transform">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                          <AppIcon name={app.icon} className="h-6 w-6" />
                        </span>
                        <span>
                          <CardTitle>{app.name}</CardTitle>
                          <CardDescription className="mt-0.5">{app.description}</CardDescription>
                        </span>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        )}

        <Link href="/aplikacje">
          <Button variant="outline" size="lg" className="w-full">
            <LayoutGrid className="h-5 w-5" />
            Wszystkie aplikacje
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
