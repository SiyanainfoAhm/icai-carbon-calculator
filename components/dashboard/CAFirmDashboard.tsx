"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CategoryPieChart, ScopeBarChart, TrendLineChart } from "./Charts";
import { Leaf, FileText, Clock, AlertCircle, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CAFirmDashboard() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);

  const calcs = data.calculations.filter(
    (c) => c.entityId === session?.entityId && c.status === "completed"
  );
  const totalEmissions = calcs.reduce((s, c) => s + c.totalCo2e, 0);
  const scope1 = calcs.reduce((s, c) => s + c.scope1Total, 0);
  const scope2 = calcs.reduce((s, c) => s + c.scope2Total, 0);
  const scope3 = calcs.reduce((s, c) => s + c.scope3Total, 0);
  const reports = data.reports.filter((r) => r.entityId === session?.entityId);
  const pendingDocs = data.documents.filter((d) => d.status === "pending").length;
  const lastCalc = calcs[0];

  const categoryData = calcs.flatMap((c) => c.lineItems).reduce((acc, li) => {
    const existing = acc.find((a) => a.name === li.categoryName);
    if (existing) existing.value += li.co2e;
    else acc.push({ name: li.categoryName, value: Math.round(li.co2e * 100) / 100 });
    return acc;
  }, [] as { name: string; value: number }[]);

  const scopeData = [
    { name: "Scope 1", value: Math.round(scope1 * 100) / 100 },
    { name: "Scope 2", value: Math.round(scope2 * 100) / 100 },
    { name: "Scope 3", value: Math.round(scope3 * 100) / 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Emissions (FY)" value={`${totalEmissions.toLocaleString()} kg`} subtitle="CO2e this year" icon={Leaf} />
        <KpiCard title="Current Period" value={`${(totalEmissions * 0.85).toFixed(0)} kg`} subtitle="FY 2024-25" icon={Calculator} />
        <KpiCard title="Reports Generated" value={reports.length} icon={FileText} />
        <KpiCard title="Pending Documents" value={pendingDocs} icon={AlertCircle} iconClassName="bg-amber-50 [&_svg]:text-amber-600" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Scope 1" value={`${scope1.toLocaleString()} kg`} className="border-l-4 border-l-blue-500" />
        <KpiCard title="Scope 2" value={`${scope2.toLocaleString()} kg`} className="border-l-4 border-l-purple-500" />
        <KpiCard title="Scope 3" value={`${scope3.toLocaleString()} kg`} className="border-l-4 border-l-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Category-wise Emissions" description="Breakdown by activity category">
          <CategoryPieChart data={categoryData} />
        </ChartCard>
        <ChartCard title="Scope-wise Emissions" description="GHG Protocol scopes">
          <ScopeBarChart data={scopeData} />
        </ChartCard>
      </div>

      <ChartCard title="Monthly Emission Trend" description="12-month rolling trend">
        <TrendLineChart data={data.monthlyEmissions} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Calculation History</CardTitle></CardHeader>
            <CardContent>
              <DataTable
                data={calcs as unknown as Record<string, unknown>[]}
                columns={[
                  { key: "reportingPeriod", header: "Period" },
                  { key: "totalCo2e", header: "CO2e (kg)", render: (c) => `${(c as { totalCo2e: number }).totalCo2e.toLocaleString()}` },
                  { key: "status", header: "Status", render: (c) => <StatusBadge status={(c as { status: string }).status} /> },
                  { key: "updatedAt", header: "Date", render: (c) => new Date((c as { updatedAt: string }).updatedAt).toLocaleDateString() },
                ]}
                searchKeys={["reportingPeriod"]}
                pageSize={5}
                emptyMessage="No calculations yet"
              />
            </CardContent>
          </Card>
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "New Calculation", href: "/calculator", icon: Calculator },
              { label: "View Reports", href: "/reports", icon: FileText },
              { label: "Submit Query", href: "/helpdesk", icon: AlertCircle },
              { label: "Recommendations", href: "/recommendations", icon: Leaf },
            ].map((a) => {
              const Icon = a.icon;
              return (
              <Button key={a.href} variant="outline" className="w-full justify-between" asChild>
                <Link href={a.href}><span className="flex items-center gap-2"><Icon className="h-4 w-4" />{a.label}</span><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            );})}
          </CardContent>
        </Card>
      </div>

      {lastCalc && (
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> Last calculation: {new Date(lastCalc.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
