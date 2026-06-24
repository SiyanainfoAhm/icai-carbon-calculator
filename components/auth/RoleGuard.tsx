"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { canAccessRoute } from "@/lib/navigation";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppStore((s) => s.session);
  const hydrated = useAppStore((s) => s.hydrated);

  const isAuthorized =
    hydrated && session && canAccessRoute(session.role, pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!canAccessRoute(session.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [session, hydrated, pathname, router]);

  if (!hydrated) return null;
  if (!session || !isAuthorized) return null;

  return <>{children}</>;
}
