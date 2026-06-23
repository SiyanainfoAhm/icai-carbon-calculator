"use client";

import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertTriangle, Download, Upload, RotateCcw } from "lucide-react";

export function SettingsPage() {
  const data = useAppStore((s) => s.data);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const exportData = useAppStore((s) => s.exportData);
  const updateUISettings = useAppStore((s) => s.updateUISettings);

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icai-carbon-demo-data.json";
    a.click();
    toast.success("Demo data exported");
  };

  const handleReset = () => {
    if (confirm("Reset all demo data to seed values? This cannot be undone.")) {
      resetDemo();
      toast.success("Demo data reset");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Portal Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Portal Name</Label><Input value={data.uiSettings.portalName} onChange={(e) => updateUISettings({ portalName: e.target.value })} /></div>
          <div className="flex items-center justify-between">
            <Label>Maintenance Mode (placeholder)</Label>
            <Switch checked={data.uiSettings.maintenanceMode} onCheckedChange={(v) => updateUISettings({ maintenanceMode: v })} />
          </div>
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">ICAI Branding Placeholder — Logo, colors, and institutional assets configurable here.</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Demo Data Management</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export Demo Data as JSON
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Import JSON placeholder — select file to restore demo data")}>
            <Upload className="h-4 w-4 mr-2" /> Import Demo Data JSON
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset Demo Data
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Reset clears all persisted data and reloads seed data. Session is preserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}
