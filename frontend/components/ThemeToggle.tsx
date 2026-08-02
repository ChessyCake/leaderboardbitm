"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-mono uppercase tracking-widest cursor-pointer"
      style={{
        borderColor: "var(--lb-border-accent)",
        color: "var(--lb-text-secondary)",
        background: "var(--lb-surface)",
      }}
    >
      <span
        className="inline-flex transition-transform duration-300"
        style={{
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      </span>
      <span>{theme === "dark" ? "DARK_MODE" : "LIGHT_MODE"}</span>
    </button>
  );
}
