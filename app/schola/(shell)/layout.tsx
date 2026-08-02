// ============================================================================
// app/schola/(shell)/layout.tsx
// Chrome for every member-only Schola screen: requireScholaMember() gates
// the whole subtree in one place, and a minimal top bar replaces Phoenix's
// BottomNav/launcher — no lib/constants.ts NAV_BY_PREFIX involvement at
// all, that system is Phoenix-shell-specific and irrelevant here.
// ============================================================================
import Link from "next/link";
import { requireScholaMember } from "@/lib/schola/get-member";
import { scholaLogout } from "@/lib/schola/auth-actions";

export default async function ScholaShellLayout({ children }: { children: React.ReactNode }) {
  await requireScholaMember();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-5 py-3">
          <Link href="/schola" className="text-lg font-bold text-primary">
            Schola
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-foreground-muted">
            <Link href="/schola/piosenki" className="hover:text-foreground">
              Piosenki
            </Link>
            <Link href="/schola/msze" className="hover:text-foreground">
              Msze
            </Link>
            <form action={scholaLogout}>
              <button type="submit" className="hover:text-danger">
                Wyloguj
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
