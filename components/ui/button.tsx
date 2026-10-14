// ============================================================================
// components/ui/button.tsx
// Base button primitive. Sized for thumb-friendly mobile tap targets
// (min-height 48px on the default size) with a few visual variants reused
// across every module.
// ============================================================================
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground shadow-(--shadow-primary) hover:brightness-110",
  secondary: "bg-accent text-accent-foreground shadow-sm hover:brightness-110",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-muted hover:border-primary/30",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-white shadow-sm hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-12 px-5 text-base gap-2",
  lg: "h-14 px-6 text-lg gap-2",
  icon: "h-11 w-11 shrink-0",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-(--radius-control) font-medium",
        "transition-[filter,transform,background-color,box-shadow] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
