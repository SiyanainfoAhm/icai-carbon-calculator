"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { ROLE_LABELS, type UserRole } from "@/lib/types";

export default function AuditLogsPage() {
  const data = useAppStore((s) => s.data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Complete audit trail of system activities</p>
      </div>
      <DataTable
        data={data.auditLogs as unknown as Record<string, unknown>[]}
        columns={[
          { key: "userName", header: "User" },
          { key: "role", header: "Role", render: (a) => ROLE_LABELS[(a as { role: UserRole }).role] ?? (a as { role: string }).role },
          { key: "action", header: "Action" },
          { key: "module", header: "Module" },
          { key: "timestamp", header: "Timestamp", render: (a) => new Date((a as { timestamp: string }).timestamp).toLocaleString() },
          { key: "ip", header: "IP" },
          { key: "details", header: "Details" },
        ]}
        searchKeys={["userName", "action", "module", "details"]}
        pageSize={15}
      />
    </div>
  );
}
