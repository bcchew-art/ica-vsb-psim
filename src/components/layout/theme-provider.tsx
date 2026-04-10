"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vsb-theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("vsb-theme") as "light" | "dark" | null;
    if (saved) {
      useThemeStore.getState().setTheme(saved);
    }
  }, []);

  return <>{children}</>;
}
