"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { ComparisonBarChart } from "@/components/dashboard/Charts";
import { KpiCard } from "@/components/common/KpiCard";
import { Map } from "lucide-react";

export default function RegionalAnalyticsPage() {
  const data = useAppStore((s) => s.data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Regional Analytics</h1>
        <p className="text-muted-foreground">All-India regional comparison</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {data.regions.map((r) => (
          <KpiCard key={r.id} title={r.code} value={`${(r.totalEmissions / 1000).toFixed(1)}t`} subtitle={r.name} icon={Map} />
        ))}
      </div>
      <ChartCard title="Region-wise Emissions Comparison">
        <ComparisonBarChart data={data.regions.map((r) => ({ name: r.code, current: r.totalEmissions, previous: r.totalEmissions * 0.93 }))} />
      </ChartCard>
      <DataTable
        data={data.regions as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", header: "Region" },
          { key: "location", header: "Location" },
          { key: "totalBranches", header: "Branches" },
          { key: "totalEmissions", header: "Emissions (kg)", render: (r) => (r as { totalEmissions: number }).totalEmissions.toLocaleString() },
          { key: "submissionStatus", header: "Status", render: (r) => <StatusBadge status={(r as { submissionStatus: string }).submissionStatus} /> },
        ]}
        searchKeys={["name", "code"]}
      />
    </div>
  );
}
