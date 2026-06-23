"use client";

import { RecommendationsList } from "@/components/recommendations/RecommendationsList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { EmissionCategoryId, RecommendationPriority } from "@/lib/types";

export default function AdminRecommendationsPage() {
  const addRecommendation = useAppStore((s) => s.addRecommendation);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ categoryId: "electricity" as EmissionCategoryId, category: "Electricity", priority: "Medium" as RecommendationPriority, title: "", description: "", estimatedSavings: 100 });

  const handleAdd = () => {
    if (!form.title) { toast.error("Title required"); return; }
    addRecommendation({ ...form, status: "New", isActive: true });
    toast.success("Recommendation added");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div><h1 className="text-2xl font-bold">Manage Recommendations</h1></div>
        <Button className="bg-teal-600" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <RecommendationsList adminMode />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Recommendation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as RecommendationPriority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["High", "Medium", "Low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Est. Savings (kg CO2e)</Label><Input type="number" value={form.estimatedSavings} onChange={(e) => setForm({ ...form, estimatedSavings: Number(e.target.value) })} /></div>
            <Button className="w-full bg-teal-600" onClick={handleAdd}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
