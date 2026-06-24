"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import type { EmissionFactor } from "@/lib/types";

export function EmissionFactorsAdmin() {
  const data = useAppStore((s) => s.data);
  const updateEmissionFactor = useAppStore((s) => s.updateEmissionFactor);
  const addEmissionFactor = useAppStore((s) => s.addEmissionFactor);
  const deleteEmissionFactor = useAppStore((s) => s.deleteEmissionFactor);
  const [edit, setEdit] = useState<EmissionFactor | null>(null);
  const [reason, setReason] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSave = () => {
    if (!edit || !reason) { toast.error("Reason required for factor changes"); return; }
    updateEmissionFactor(edit.id, { emissionFactor: Number(newValue) || edit.emissionFactor }, reason);
    toast.success("Factor updated with version history");
    setEdit(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Emission Factor Management</h1>
      <DataTable
        data={data.emissionFactors as unknown as Record<string, unknown>[]}
        columns={[
          { key: "category", header: "Category" },
          { key: "factorName", header: "Factor Name" },
          { key: "unit", header: "Unit" },
          { key: "emissionFactor", header: "Factor" },
          { key: "scope", header: "Scope" },
          { key: "source", header: "Source" },
          { key: "version", header: "Ver" },
          { key: "status", header: "Status", render: (f) => <StatusBadge status={(f as { status: string }).status} /> },
          { key: "isCurrent", header: "Current", render: (f) => (f as { isCurrent: boolean }).isCurrent ? "Yes" : "No" },
          { key: "actions", header: "Actions", render: (f) => {
            const factor = f as unknown as EmissionFactor;
            return (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEdit(factor); setNewValue(String(factor.emissionFactor)); setReason(""); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => { updateEmissionFactor(factor.id, { status: factor.status === "active" ? "inactive" : "active", isCurrent: factor.status !== "active" }, "Status toggle"); toast.success("Updated"); }}>Toggle</Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { deleteEmissionFactor(factor.id); toast.success("Deleted"); }}>Delete</Button>
              </div>
            );
          }},
        ]}
        searchKeys={["category", "factorName"]}
      />
      <Dialog open={!!edit} onOpenChange={() => setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Factor: {edit?.factorName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>New Emission Factor</Label><Input type="number" step="0.01" value={newValue} onChange={(e) => setNewValue(e.target.value)} /></div>
            <div><Label>Reason for Change *</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} /></div>
            <Button className="w-full bg-primary" onClick={handleSave}>Save & Create Version</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function FactorHistoryAdmin() {
  const data = useAppStore((s) => s.data);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Emission Factor Version History</h1>
      <DataTable
        data={data.emissionFactorVersions as unknown as Record<string, unknown>[]}
        columns={[
          { key: "factorName", header: "Factor" },
          { key: "category", header: "Category" },
          { key: "oldValue", header: "Old Value" },
          { key: "newValue", header: "New Value" },
          { key: "changedBy", header: "Changed By" },
          { key: "changeDate", header: "Date", render: (v) => new Date((v as { changeDate: string }).changeDate).toLocaleDateString() },
          { key: "reason", header: "Reason" },
          { key: "versionNumber", header: "Version" },
          { key: "source", header: "Source" },
        ]}
        searchKeys={["factorName", "category"]}
      />
    </div>
  );
}
