"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme} className="w-full justify-between" size="lg">
      <span className="flex items-center gap-2">
        {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        Tryb {theme === "dark" ? "ciemny" : "jasny"}
      </span>
      <span className="text-sm text-foreground-muted">Zmień</span>
    </Button>
  );
}
