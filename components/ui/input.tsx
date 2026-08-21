// ============================================================================
// components/ui/input.tsx
// Base text input, styled to match the app's rounded card language.
// ============================================================================
import { cn } from "@/lib/utils";
import type { ComponentPropsWithRef } from "react";

// ComponentPropsWithRef, not InputHTMLAttributes: callers need to hold a ref
// to the underlying input (e.g. components/ui/accent-bar.tsx inserts a
// character at the caret). React 19 passes `ref` through as an ordinary prop
// for function components, so this needs no forwardRef — only the type.
export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground",
        "placeholder:text-foreground-muted",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
}
