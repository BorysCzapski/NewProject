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
      className="sticky top-0 z-30 bg-background/80 px-5 pb-3 shadow-[0_1px_0_var(--border),0_8px_24px_-16px_rgb(0_0_0/0.3)] backdrop-blur-md"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
