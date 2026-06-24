"use client";

import { useLayoutEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { applyDesignTheme } from "@/lib/designTheme";

export function DesignThemeProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const selectedDesign = useAppStore((s) => s.data.uiSettings?.selectedDesign);

  useLayoutEffect(() => {
    if (!hydrated) return;
    applyDesignTheme(selectedDesign);
  }, [hydrated, selectedDesign]);

  return <>{children}</>;
}
