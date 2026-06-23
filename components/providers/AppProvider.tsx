"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Toaster } from "@/components/ui/sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const init = useAppStore((s) => s.init);
  const hydrated = useAppStore((s) => s.hydrated);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      init();
    }
  }, [init]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
          <p className="text-sm font-medium text-teal-800">Loading ICAI Carbon Calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
