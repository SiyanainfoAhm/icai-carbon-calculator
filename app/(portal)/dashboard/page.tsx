"use client";

import { useAppStore } from "@/store/useAppStore";
import { CAFirmDashboard } from "@/components/dashboard/CAFirmDashboard";
import { BranchDashboard } from "@/components/dashboard/BranchDashboard";
import { RegionalDashboard } from "@/components/dashboard/RegionalDashboard";
import { HeadOfficeDashboard } from "@/components/dashboard/HeadOfficeDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const session = useAppStore((s) => s.session);
  if (!session) return null;

  switch (session.role) {
    case "ca_firm": return <CAFirmDashboard />;
    case "branch_office": return <BranchDashboard />;
    case "regional_office": return <RegionalDashboard />;
    case "head_office": return <HeadOfficeDashboard />;
    case "system_admin": return <AdminDashboard />;
    default: return <CAFirmDashboard />;
  }
}
