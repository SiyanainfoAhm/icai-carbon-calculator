"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard>
      <AppLayout>{children}</AppLayout>
    </RoleGuard>
  );
}
