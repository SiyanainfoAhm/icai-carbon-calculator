"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";

export default function HistoryPage() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const calcs = data.calculations.filter((c) => c.entityId === session?.entityId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calculation History</h1>
          <p className="text-muted-foreground">Saved calculations and drafts</p>
        </div>
        <Button className="bg-teal-600" asChild><Link href="/calculator"><Plus className="h-4 w-4 mr-1" /> New</Link></Button>
      </div>
      <DataTable
        data={calcs as unknown as Record<string, unknown>[]}
        columns={[
          { key: "reportingPeriod", header: "Period" },
          { key: "totalCo2e", header: "Total CO2e (kg)", render: (c) => (c as { totalCo2e: number }).totalCo2e.toLocaleString() },
          { key: "scope1Total", header: "Scope 1", render: (c) => (c as { scope1Total: number }).scope1Total.toFixed(0) },
          { key: "scope2Total", header: "Scope 2", render: (c) => (c as { scope2Total: number }).scope2Total.toFixed(0) },
          { key: "scope3Total", header: "Scope 3", render: (c) => (c as { scope3Total: number }).scope3Total.toFixed(0) },
          { key: "status", header: "Status", render: (c) => <StatusBadge status={(c as { status: string }).status} /> },
          { key: "updatedAt", header: "Updated", render: (c) => new Date((c as { updatedAt: string }).updatedAt).toLocaleDateString() },
          { key: "actions", header: "", render: (c) => (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/calculator/${(c as { id: string }).id}`}><Eye className="h-4 w-4" /></Link>
            </Button>
          )},
        ]}
        searchKeys={["reportingPeriod"]}
      />
    </div>
  );
}
