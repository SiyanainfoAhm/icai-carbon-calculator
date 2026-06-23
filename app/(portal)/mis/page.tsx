"use client";

import { useAppStore } from "@/store/useAppStore";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CategoryPieChart, ScopeBarChart } from "@/components/dashboard/Charts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, AlertCircle, FlaskConical } from "lucide-react";

export default function MISPage() {
  const data = useAppStore((s) => s.data);
  const totalEmissions = data.regions.reduce((s, r) => s + r.totalEmissions, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">MIS Reporting</h1>
          <p className="text-muted-foreground">Management Information System summary</p>
        </div>
        <Button className="bg-teal-600" onClick={() => toast.success("MIS report exported (demo)")}>Export MIS</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Submissions" value={data.branches.filter((b) => b.submissionStatus === "Submitted").length + data.caFirms.filter((f) => f.submissionStatus === "Submitted").length} icon={FileText} />
        <KpiCard title="Open Queries" value={data.queries.filter((q) => q.status === "Open").length} icon={AlertCircle} />
        <KpiCard title="Pending Documents" value={data.documents.filter((d) => d.status === "pending").length} />
        <KpiCard title="Factor Updates" value={data.emissionFactorVersions.length} icon={FlaskConical} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Region-wise Total Emissions">
          <ScopeBarChart data={data.regions.map((r) => ({ name: r.code, value: r.totalEmissions }))} />
        </ChartCard>
        <ChartCard title="Category-wise Emissions">
          <CategoryPieChart data={[
            { name: "Electricity", value: totalEmissions * 0.32 },
            { name: "Travel", value: totalEmissions * 0.26 },
            { name: "Paper", value: totalEmissions * 0.1 },
            { name: "Other", value: totalEmissions * 0.32 },
          ]} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white shadow-sm p-4">
          <h3 className="font-semibold mb-3">Branch Submission Status</h3>
          <DataTable
            data={data.branches.slice(0, 20) as unknown as Record<string, unknown>[]}
            columns={[
              { key: "code", header: "Branch" },
              { key: "submissionStatus", header: "Status", render: (b) => <StatusBadge status={(b as { submissionStatus: string }).submissionStatus} /> },
            ]}
            pageSize={10}
          />
        </div>
        <div className="rounded-xl border bg-white shadow-sm p-4">
          <h3 className="font-semibold mb-3">CA Firm Submission Status</h3>
          <DataTable
            data={data.caFirms as unknown as Record<string, unknown>[]}
            columns={[
              { key: "name", header: "Firm" },
              { key: "submissionStatus", header: "Status", render: (f) => <StatusBadge status={(f as { submissionStatus: string }).submissionStatus} /> },
            ]}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
