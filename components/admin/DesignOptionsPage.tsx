"use client";

import { useAppStore } from "@/store/useAppStore";
import { DESIGN_THEMES } from "@/lib/types";
import { getDesignTheme } from "@/lib/designTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check } from "lucide-react";

export function DesignOptionsPage() {
  const selectedDesign = useAppStore((s) => s.data.uiSettings?.selectedDesign ?? "modern_esg");
  const updateUISettings = useAppStore((s) => s.updateUISettings);

  const handleSelect = (themeId: typeof DESIGN_THEMES[number]["id"]) => {
    if (themeId === selectedDesign) return;
    updateUISettings({ selectedDesign: themeId });
    const theme = getDesignTheme(themeId);
    toast.success(`${theme.name} is now the active design theme`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Design Options</h1>
        <p className="text-muted-foreground">
          Choose a visual theme for the portal. The active theme updates buttons, accents, and sidebar highlights immediately.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Active theme: <strong>{getDesignTheme(selectedDesign).name}</strong>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESIGN_THEMES.map((theme) => {
          const isSelected = selectedDesign === theme.id;
          const primary = theme.colors[0];
          return (
            <Card
              key={theme.id}
              className="transition-shadow"
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? primary : undefined,
                boxShadow: isSelected ? `0 0 0 1px ${primary}33` : undefined,
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base">{theme.name}</CardTitle>
                  <Badge
                    style={
                      isSelected
                        ? { backgroundColor: primary, color: "#fff", borderColor: primary }
                        : undefined
                    }
                    variant={isSelected ? "default" : "secondary"}
                  >
                    {isSelected ? "Selected" : "Proposed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{theme.description}</p>
                <div className="flex gap-1">
                  {theme.colors.map((c) => (
                    <div key={c} className="h-8 flex-1 rounded" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
                <div
                  className="rounded-lg p-4 text-sm"
                  style={{ backgroundColor: theme.colors[3], color: theme.colors[4] }}
                >
                  <p className="font-bold text-lg" style={{ color: theme.colors[0] }}>
                    Sample Heading
                  </p>
                  <p>Body text preview for typography and card styling.</p>
                </div>
                <Button
                  className={isSelected ? "w-full" : "w-full border-primary text-primary hover:bg-primary/10"}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isSelected}
                  onClick={() => handleSelect(theme.id)}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Currently Selected
                    </>
                  ) : (
                    "Select Design"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
