// ============================================================================
// app/(main)/aplikacje/page.tsx
// Phoenix app manager: browse every mini-app in the registry and choose
// which ones appear on your launcher. Planned (comingSoon) apps are listed
// as a roadmap teaser but can't be installed yet.
// ============================================================================
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { AppManager } from "@/components/phoenix/app-manager";

export default async function AplikacjePage() {
  const profile = await requireProfile();

  return (
    <div>
      <PageHeader title="Aplikacje" subtitle="Wybierz, co widzisz na ekranie głównym" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Ekran główny
        </Link>
        <AppManager installedIds={profile.installed_apps ?? ["jezyki"]} />
      </div>
    </div>
  );
}
