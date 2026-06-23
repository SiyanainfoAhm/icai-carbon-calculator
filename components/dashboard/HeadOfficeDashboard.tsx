"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { ComparisonBarChart, CategoryPieChart, ScopeBarChart, TrendLineChart } from "./Charts";
import { Globe, Users, Building2, Briefcase, FileText, Calculator, Upload } from "lucide-react";

export function HeadOfficeDashboard() {
  const data = useAppStore((s) => s.data);

  const totalEmissions = data.regions.reduce((s, r) => s + r.totalEmissions, 0);
  const regionData = data.regions.map((r) => ({ name: r.code, current: r.totalEmissions, previous: r.totalEmissions * 0.92 }));
  const caFirmTotal = data.caFirms.reduce((s, f) => s + f.totalEmissions, 0);
  const branchTotal = data.branches.reduce((s, b) => s + b.totalEmissions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Head Office Dashboard</h1>
        <p className="text-muted-foreground">All-India consolidated emissions overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="All-India Emissions" value={`${(totalEmissions / 1000).toFixed(1)}t`} subtitle={`${totalEmissions.toLocaleString()} kg CO2e`} icon={Globe} />
        <KpiCard title="Total Users" value={data.users.length} icon={Users} />
        <KpiCard title="Total Branches" value={data.branches.length} icon={Building2} />
        <KpiCard title="Total CA Firms" value={data.caFirms.length} icon={Briefcase} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Calculations" value={data.calculations.length} icon={Calculator} />
        <KpiCard title="Reports" value={data.reports.length} icon={FileText} />
        <KpiCard title="Documents" value={data.documents.length} icon={Upload} />
        <KpiCard title="Open Queries" value={data.queries.filter((q) => q.status === "Open").length} icon={FileText} />
      </div>

      <ChartCard title="Region-wise Comparison">
        <ComparisonBarChart data={regionData} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Scope-wise Distribution">
          <ScopeBarChart data={[
            { name: "Scope 1", value: totalEmissions * 0.3 },
            { name: "Scope 2", value: totalEmissions * 0.28 },
            { name: "Scope 3", value: totalEmissions * 0.42 },
          ]} />
        </ChartCard>
        <ChartCard title="Top Emission Categories">
          <CategoryPieChart data={[
            { name: "Electricity", value: totalEmissions * 0.32 },
            { name: "Travel", value: totalEmissions * 0.26 },
            { name: "Paper", value: totalEmissions * 0.1 },
            { name: "Waste", value: totalEmissions * 0.08 },
            { name: "Other", value: totalEmissions * 0.24 },
          ]} />
        </ChartCard>
      </div>

      <ChartCard title="CA Firm vs Branch Emissions">
        <ScopeBarChart data={[
          { name: "CA Firms", value: caFirmTotal },
          { name: "Branches", value: branchTotal },
        ]} />
      </ChartCard>

      <ChartCard title="Monthly Trend Analysis">
        <TrendLineChart data={data.monthlyEmissions} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Regions">
          <ScopeBarChart data={[...data.regions].sort((a, b) => b.totalEmissions - a.totalEmissions).map((r) => ({ name: r.code, value: r.totalEmissions }))} />
        </ChartCard>
        <ChartCard title="Top Branches">
          <ScopeBarChart data={[...data.branches].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, 8).map((b) => ({ name: b.code, value: b.totalEmissions }))} />
        </ChartCard>
      </div>
    </div>
  );
}
