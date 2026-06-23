"use client";

import { useAppStore } from "@/store/useAppStore";
import { DESIGN_THEMES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function DesignOptionsPage() {
  const selected = useAppStore((s) => s.data.uiSettings.selectedDesign);
  const updateUISettings = useAppStore((s) => s.updateUISettings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Design Options</h1>
        <p className="text-muted-foreground">Original distinctive design concepts for ICAI presentation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESIGN_THEMES.map((theme) => (
          <Card key={theme.id} className={selected === theme.id ? "ring-2 ring-teal-500" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <Badge variant={selected === theme.id ? "default" : "secondary"}>
                  {selected === theme.id ? "Selected" : "Proposed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{theme.description}</p>
              <div className="flex gap-1">
                {theme.colors.map((c) => (
                  <div key={c} className="h-8 flex-1 rounded" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: theme.colors[3], color: theme.colors[4] }}>
                <p className="font-bold text-lg" style={{ color: theme.colors[0] }}>Sample Heading</p>
                <p>Body text preview for typography and card styling.</p>
              </div>
              <Button
                className="w-full"
                variant={selected === theme.id ? "default" : "outline"}
                onClick={() => { updateUISettings({ selectedDesign: theme.id }); toast.success(`${theme.name} selected`); }}
              >
                {selected === theme.id ? "Currently Selected" : "Select Design"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
