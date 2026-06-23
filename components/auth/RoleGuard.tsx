"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { canAccessRoute } from "@/lib/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

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

  if (!hydrated) return <LoadingSkeleton />;
  if (!session || !isAuthorized) return <LoadingSkeleton />;

  return <>{children}</>;
}
