"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChartCard } from "@/components/common/ChartCard";
import { ScopeBarChart } from "@/components/dashboard/Charts";
import { KpiCard } from "@/components/common/KpiCard";
import { Briefcase } from "lucide-react";

export default function CAFirmAnalyticsPage() {
  const data = useAppStore((s) => s.data);
  const total = data.caFirms.reduce((s, f) => s + f.totalEmissions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CA Firm Analytics</h1>
        <p className="text-muted-foreground">{data.caFirms.length} registered CA firms</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Total Firms" value={data.caFirms.length} icon={Briefcase} />
        <KpiCard title="Total Emissions" value={`${total.toLocaleString()} kg`} />
        <KpiCard title="Avg per Firm" value={`${Math.round(total / data.caFirms.length).toLocaleString()} kg`} />
      </div>
      <ChartCard title="Top CA Firms by Emissions">
        <ScopeBarChart data={[...data.caFirms].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 8).map((f) => ({ name: f.registrationNumber, value: f.totalEmissions }))} />
      </ChartCard>
      <DataTable
        data={data.caFirms as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", header: "Firm" },
          { key: "registrationNumber", header: "FRN" },
          { key: "regionName", header: "Region" },
          { key: "location", header: "Location" },
          { key: "totalEmissions", header: "Emissions (kg)", render: (f) => (f as { totalEmissions: number }).totalEmissions.toLocaleString() },
          { key: "submissionStatus", header: "Status", render: (f) => <StatusBadge status={(f as { submissionStatus: string }).submissionStatus} /> },
        ]}
        searchKeys={["name", "registrationNumber", "regionName"]}
        pageSize={10}
      />
    </div>
  );
}
