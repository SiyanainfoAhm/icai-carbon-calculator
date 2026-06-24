"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CategoryPieChart, ScopeBarChart, TrendLineChart } from "./Charts";
import { Map, Building2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRegionalReport } from "@/lib/reportUtils";
import { toast } from "sonner";

export function RegionalDashboard() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const addReport = useAppStore((s) => s.addReport);

  const region = data.regions.find((r) => r.id === session?.regionId) ?? data.regions[0];
  const branches = data.branches.filter((b) => b.regionId === region.id);
  const topEmitting = [...branches].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 5);
  const topImproved = [...branches].sort((a, b) => (a.totalEmissions - a.previousEmissions) - (b.totalEmissions - b.previousEmissions)).slice(0, 5);

  const handleExport = () => {
    if (!session) {
      toast.error("Session expired. Please log in again.");
      return;
    }
    const report = generateRegionalReport(
      region.name,
      region.id,
      "FY 2024-25",
      region.totalEmissions,
      session.name,
      session
    );
    addReport(report);
    toast.success("Regional report generated and saved to Reports");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Regional Dashboard</h1>
          <p className="text-muted-foreground">{region.name}</p>
        </div>
        <Button onClick={handleExport} className="bg-teal-600 hover:bg-teal-700">Export Regional Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Region Emissions" value={`${region.totalEmissions.toLocaleString()} kg`} icon={Map} />
        <KpiCard title="Branches" value={branches.length} icon={Building2} />
        <KpiCard title="Pending Reports" value={branches.filter((b) => b.submissionStatus === "Pending").length} icon={FileText} />
        <KpiCard title="Needs Review" value={branches.filter((b) => b.submissionStatus === "Needs Review").length} icon={AlertCircle} />
      </div>

      <CardSection title="Branch Submission Status">
        <DataTable
          data={branches as unknown as Record<string, unknown>[]}
          columns={[
            { key: "name", header: "Branch" },
            { key: "location", header: "Location" },
            { key: "totalEmissions", header: "Emissions (kg)", render: (b) => (b as { totalEmissions: number }).totalEmissions.toLocaleString() },
            { key: "submissionStatus", header: "Status", render: (b) => <StatusBadge status={(b as { submissionStatus: string }).submissionStatus} /> },
          ]}
          searchKeys={["name", "location"]}
          pageSize={10}
        />
      </CardSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top 5 Highest Emitting Branches">
          <ScopeBarChart data={topEmitting.map((b) => ({ name: b.code, value: b.totalEmissions }))} />
        </ChartCard>
        <ChartCard title="Top 5 Most Improved Branches">
          <ScopeBarChart data={topImproved.map((b) => ({ name: b.code, value: b.previousEmissions - b.totalEmissions }))} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Scope-wise"><ScopeBarChart data={[
          { name: "Scope 1", value: region.totalEmissions * 0.32 },
          { name: "Scope 2", value: region.totalEmissions * 0.28 },
          { name: "Scope 3", value: region.totalEmissions * 0.4 },
        ]} /></ChartCard>
        <ChartCard title="Category-wise"><CategoryPieChart data={[
          { name: "Electricity", value: region.totalEmissions * 0.3 },
          { name: "Travel", value: region.totalEmissions * 0.28 },
          { name: "Paper", value: region.totalEmissions * 0.12 },
          { name: "Other", value: region.totalEmissions * 0.3 },
        ]} /></ChartCard>
      </div>

      <ChartCard title="Monthly Trend"><TrendLineChart data={data.monthlyEmissions} /></ChartCard>
    </div>
  );
}

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="p-4 border-b"><h3 className="font-semibold">{title}</h3></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
