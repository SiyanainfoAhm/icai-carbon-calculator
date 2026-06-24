"use client";

import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type EntityKey = "entities" | "regions" | "branches" | "caFirms";

interface EntityAdminProps {
  title: string;
  dataKey: EntityKey;
  columns: { key: string; header: string }[];
}

export function EntityAdmin({ title, dataKey, columns }: EntityAdminProps) {
  const data = useAppStore((s) => s.data);
  const updateItem = useAppStore((s) => s.updateItem);
  const addItem = useAppStore((s) => s.addItem);
  const deleteItem = useAppStore((s) => s.deleteItem);
  const addAuditLog = useAppStore((s) => s.addAuditLog);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ name: "", location: "", email: "", status: "active" });

  const items = data[dataKey] as { id: string; name: string; location?: string; email?: string; status: string }[];

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    const id = `${dataKey}-${Date.now()}`;
    addItem(dataKey, { id, ...form, totalEmissions: 0, submissionStatus: "Draft", lastReportingPeriod: "FY 2024-25" } as never);
    addAuditLog("Add Entity", title, `Added ${form.name}`);
    toast.success("Added");
    setOpen(false);
    setForm({ name: "", location: "", email: "", status: "active" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button className="bg-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <DataTable
        data={items as unknown as Record<string, unknown>[]}
        columns={[
          ...columns.map((c) => ({
            ...c,
            render: c.key === "status"
              ? (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />
              : c.key === "submissionStatus"
                ? (item: Record<string, unknown>) => <StatusBadge status={String(item.submissionStatus)} />
                : c.key === "totalEmissions"
                  ? (item: Record<string, unknown>) => Number(item.totalEmissions ?? 0).toLocaleString()
                  : undefined,
          })),
          { key: "actions", header: "Actions", render: (item) => {
            const id = (item as { id: string }).id;
            const status = (item as { status: string }).status;
            return (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { updateItem(dataKey, id, { status: status === "active" ? "inactive" : "active" } as never); addAuditLog("Edit Entity", title, `Toggled status for ${id}`); toast.success("Updated"); }}>{status === "active" ? "Deactivate" : "Activate"}</Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { deleteItem(dataKey, id); addAuditLog("Delete Entity", title, `Deleted ${id}`); toast.success("Deleted"); }}>Delete</Button>
              </div>
            );
          }},
        ]}
        searchKeys={["name", "location", "email", "code"]}
        pageSize={10}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add {title.slice(0, -1)}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <Button className="w-full bg-primary" onClick={handleAdd}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
