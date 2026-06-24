"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import type { User, UserRole } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

export function UsersAdmin() {
  const data = useAppStore((s) => s.data);
  const addUser = useAppStore((s) => s.addUser);
  const updateUser = useAppStore((s) => s.updateUser);
  const deleteUser = useAppStore((s) => s.deleteUser);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "demo123", role: "ca_firm" as UserRole, entityName: "", regionName: "Northern Region", status: "active" as "active" | "inactive" });

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    if (editUser) {
      updateUser(editUser.id, { ...form, entityId: editUser.entityId, regionId: editUser.regionId });
      toast.success("User updated");
    } else {
      addUser({ ...form, entityId: `entity-${Date.now()}`, regionId: "reg-north" });
      toast.success("User created");
    }
    setOpen(false);
    setEditUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div><h1 className="text-2xl font-bold">User Management</h1></div>
        <Button className="bg-primary" onClick={() => { setEditUser(null); setForm({ name: "", email: "", password: "demo123", role: "ca_firm", entityName: "", regionName: "Northern Region", status: "active" }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>
      <DataTable
        data={data.users as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role", render: (u) => ROLE_LABELS[(u as { role: UserRole }).role] },
          { key: "entityName", header: "Entity" },
          { key: "regionName", header: "Region" },
          { key: "status", header: "Status", render: (u) => <StatusBadge status={(u as { status: string }).status} /> },
          { key: "lastLogin", header: "Last Login", render: (u) => (u as { lastLogin?: string }).lastLogin ? new Date((u as { lastLogin: string }).lastLogin).toLocaleDateString() : "—" },
          { key: "createdAt", header: "Created", render: (u) => new Date((u as { createdAt: string }).createdAt).toLocaleDateString() },
          { key: "actions", header: "Actions", render: (u) => {
            const user = u as unknown as User;
            return (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditUser(user); setForm({ name: user.name, email: user.email, password: user.password, role: user.role, entityName: user.entityName, regionName: user.regionName, status: user.status }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => { updateUser(user.id, { status: user.status === "active" ? "inactive" : "active" }); toast.success("Status updated"); }}>{user.status === "active" ? "Deactivate" : "Activate"}</Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { deleteUser(user.id); toast.success("Deleted"); }}>Delete</Button>
              </div>
            );
          }},
        ]}
        searchKeys={["name", "email", "entityName"]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Entity</Label><Input value={form.entityName} onChange={(e) => setForm({ ...form, entityName: e.target.value })} /></div>
            <div><Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-primary" onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
