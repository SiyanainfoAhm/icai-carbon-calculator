"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Users, Building2, Map, Calculator, FileText, MessageSquare, FlaskConical, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const data = useAppStore((s) => s.data);
  const activeFactors = data.emissionFactors.filter((f) => f.status === "active" && f.isCurrent);
  const lastFactorUpdate = data.emissionFactorVersions[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System administration and monitoring</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Users" value={data.users.length} subtitle={`${data.users.filter((u) => u.status === "active").length} active`} icon={Users} />
        <KpiCard title="CA Firms" value={data.caFirms.length} icon={Building2} />
        <KpiCard title="Branches" value={data.branches.length} icon={Map} />
        <KpiCard title="Regions" value={data.regions.length} icon={Map} />
        <KpiCard title="Calculations" value={data.calculations.length} icon={Calculator} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Reports" value={data.reports.length} icon={FileText} />
        <KpiCard title="Open Queries" value={data.queries.filter((q) => ["Open", "In Progress"].includes(q.status)).length} icon={MessageSquare} />
        <KpiCard title="Active Factors" value={activeFactors.length} icon={FlaskConical} />
        <KpiCard title="Uptime Target" value="99.9%" subtitle="Performance monitoring" icon={Activity} />
      </div>

      {lastFactorUpdate && (
        <p className="text-sm text-muted-foreground">Last factor update: {lastFactorUpdate.factorName} on {new Date(lastFactorUpdate.changeDate).toLocaleDateString()}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Recent Audit Logs</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={data.auditLogs.slice(0, 10) as unknown as Record<string, unknown>[]}
              columns={[
                { key: "userName", header: "User" },
                { key: "action", header: "Action" },
                { key: "module", header: "Module" },
                { key: "timestamp", header: "Time", render: (a) => new Date((a as { timestamp: string }).timestamp).toLocaleString() },
              ]}
              pageSize={5}
            />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Recent Queries</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              data={data.queries.slice(0, 10) as unknown as Record<string, unknown>[]}
              columns={[
                { key: "queryNumber", header: "ID" },
                { key: "subject", header: "Subject" },
                { key: "status", header: "Status", render: (q) => <StatusBadge status={(q as { status: string }).status} /> },
              ]}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Admin Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { label: "Manage Users", href: "/admin/users" },
            { label: "Emission Factors", href: "/admin/emission-factors" },
            { label: "Audit Logs", href: "/admin/audit-logs" },
            { label: "Settings", href: "/admin/settings" },
            { label: "Design Options", href: "/admin/design-options" },
          ].map((a) => (
            <Button key={a.href} variant="outline" asChild><Link href={a.href}>{a.label}</Link></Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
