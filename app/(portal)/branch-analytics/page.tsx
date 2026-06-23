"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { ComparisonBarChart } from "@/components/dashboard/Charts";
import { KpiCard } from "@/components/common/KpiCard";
import { Building2 } from "lucide-react";

export default function BranchAnalyticsPage() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const branches = session?.role === "regional_office"
    ? data.branches.filter((b) => b.regionId === session.regionId)
    : data.branches;

  const topBranches = [...branches].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Branch Analytics</h1>
        <p className="text-muted-foreground">{branches.length} branches — search, filter and paginate</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Branches" value={branches.length} icon={Building2} />
        <KpiCard title="Submitted" value={branches.filter((b) => b.submissionStatus === "Submitted").length} />
        <KpiCard title="Pending" value={branches.filter((b) => b.submissionStatus === "Pending").length} />
      </div>
      <ChartCard title="Top 10 Branches by Emissions">
        <ComparisonBarChart data={topBranches.map((b) => ({ name: b.code, current: b.totalEmissions, previous: b.previousEmissions }))} />
      </ChartCard>
      <DataTable
        data={branches as unknown as Record<string, unknown>[]}
        columns={[
          { key: "code", header: "Code" },
          { key: "name", header: "Branch" },
          { key: "regionName", header: "Region" },
          { key: "location", header: "Location" },
          { key: "totalEmissions", header: "Emissions (kg)", render: (b) => (b as { totalEmissions: number }).totalEmissions.toLocaleString() },
          { key: "submissionStatus", header: "Status", render: (b) => <StatusBadge status={(b as { submissionStatus: string }).submissionStatus} /> },
        ]}
        searchKeys={["name", "code", "location", "regionName"]}
        pageSize={15}
      />
    </div>
  );
}
