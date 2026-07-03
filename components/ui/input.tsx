// ============================================================================
// components/ui/input.tsx
// Base text input, styled to match the app's rounded card language.
// ============================================================================
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
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
