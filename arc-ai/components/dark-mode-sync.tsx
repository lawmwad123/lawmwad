"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store";

export function DarkModeSync() {
  const { darkMode } = useUIStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}
