"use client";

import { useTheme } from "./theme-provider";

// @req SCD-UI-006
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm transition-colors hover:bg-foreground/10"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
