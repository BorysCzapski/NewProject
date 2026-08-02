// ============================================================================
// components/schola/page-header.tsx
// Schola's own page-title block — deliberately NOT @/components/layout/
// page-header.tsx, which is `sticky top-0` and would visually collide with
// app/schola/(shell)/layout.tsx's own sticky top bar (two independent
// `sticky top-0` siblings stack/overlap incorrectly). This one is a plain,
// non-sticky block; the shell bar is the only sticky element in this realm.
// ============================================================================
import type { ReactNode } from "react";

export function ScholaPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-5 pt-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
