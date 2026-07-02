// ============================================================================
// components/layout/page-header.tsx
// Sticky top bar used at the top of every screen inside the (main) app
// shell: a title, optional subtitle, and a slot for right-aligned actions.
// ============================================================================
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/95 px-5 pb-3 backdrop-blur"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
