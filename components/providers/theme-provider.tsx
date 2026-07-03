"use client";

// ============================================================================
// theme-provider.tsx
// Minimal light/dark theme toggle: persists choice in localStorage and
// toggles the ".dark" class on <html> (see app/globals.css custom-variant).
// Reads the DOM/localStorage as an external store (useSyncExternalStore)
// rather than mirroring it into useState-in-an-effect, so the very first
// client render can never mismatch the server-rendered HTML.
// ============================================================================
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  window.localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
  for (const listener of listeners) listener();
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
