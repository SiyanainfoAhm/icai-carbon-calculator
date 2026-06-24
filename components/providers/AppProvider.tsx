"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

function hydrateStore() {
  if (typeof window !== "undefined" && !useAppStore.getState().hydrated) {
    useAppStore.getState().init();
  }
}

// Synchronous hydration before first paint on the client
hydrateStore();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const initError = useAppStore((s) => s.initError);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (!hydrated) hydrateStore();
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) return;
    const timer = window.setTimeout(() => setShowRecovery(true), 2000);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  if (!hydrated && !showRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
          <p className="text-sm font-medium text-teal-800">Loading ICAI Carbon Calculator...</p>
        </div>
      </div>
    );
  }

  if (!hydrated && showRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
        <div className="max-w-md text-center space-y-4 rounded-xl border bg-white p-8 shadow-lg">
          <p className="text-slate-800 font-medium">
            Demo data is taking longer than expected. Click Reset Demo Data to continue.
          </p>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              resetDemo();
              useAppStore.getState().init();
            }}
          >
            Reset Demo Data
          </Button>
        </div>
      </div>
    );
  }

  if (initError === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
        <div className="max-w-md text-center space-y-4 rounded-xl border bg-white p-8 shadow-lg">
          <p className="text-slate-800 font-medium">Unable to load demo data. Please reset to continue.</p>
          <Button className="bg-teal-600" onClick={() => resetDemo()}>
            Reset Demo Data
          </Button>
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
