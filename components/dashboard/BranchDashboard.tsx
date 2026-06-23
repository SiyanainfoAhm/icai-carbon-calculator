"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { CategoryPieChart, ScopeBarChart, TrendLineChart, ComparisonBarChart } from "./Charts";
import { Building2, FileText, AlertCircle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";

export function BranchDashboard() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const branch = data.branches.find((b) => b.id === session?.entityId) ?? data.branches[0];

  const scopeData = [
    { name: "Scope 1", value: branch.totalEmissions * 0.3 },
    { name: "Scope 2", value: branch.totalEmissions * 0.35 },
    { name: "Scope 3", value: branch.totalEmissions * 0.35 },
  ];
  const categoryData = [
    { name: "Electricity", value: branch.totalEmissions * 0.35 },
    { name: "Travel", value: branch.totalEmissions * 0.25 },
    { name: "Paper", value: branch.totalEmissions * 0.15 },
    { name: "Waste", value: branch.totalEmissions * 0.1 },
    { name: "Other", value: branch.totalEmissions * 0.15 },
  ];
  const change = ((branch.totalEmissions - branch.previousEmissions) / branch.previousEmissions * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Branch Dashboard</h1>
        <p className="text-muted-foreground">{branch.name} — {branch.location}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Branch Total Emissions" value={`${branch.totalEmissions.toLocaleString()} kg`} icon={Building2} />
        <KpiCard title="Previous Period" value={`${branch.previousEmissions.toLocaleString()} kg`} icon={TrendingDown}
          trend={{ value: Math.round(change * 10) / 10, label: "vs previous" }} />
        <KpiCard title="Submitted Reports" value={data.reports.filter((r) => r.entityId === branch.id).length} icon={FileText} />
        <KpiCard title="Pending Documents" value={data.documents.filter((d) => d.status === "pending").length} icon={AlertCircle} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Branch Profile</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{branch.code}</span></div>
          <div><span className="text-muted-foreground">Region:</span> <span className="font-medium">{branch.regionName}</span></div>
          <div><span className="text-muted-foreground">Period:</span> <span className="font-medium">{branch.lastReportingPeriod}</span></div>
          <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={branch.submissionStatus} /></div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Category-wise Emissions"><CategoryPieChart data={categoryData} /></ChartCard>
        <ChartCard title="Scope-wise Emissions"><ScopeBarChart data={scopeData} /></ChartCard>
      </div>

      <ChartCard title="Month-wise Trend"><TrendLineChart data={data.monthlyEmissions} /></ChartCard>

      <ChartCard title="Period Comparison">
        <ComparisonBarChart data={[{ name: branch.name, current: branch.totalEmissions, previous: branch.previousEmissions }]} />
      </ChartCard>
    </div>
  );
}
