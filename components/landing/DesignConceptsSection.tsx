"use client";

import { useState } from "react";
import { DESIGN_THEMES } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function DesignConceptsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-10 xl:px-16 max-w-7xl mx-auto">
      <div className="text-center mb-8 landing-section-heading">
        <h2 className="text-3xl font-bold text-slate-900">Design Concept Options</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Distinctive visual themes prepared for ICAI presentation — explore when needed.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold",
            "border-2 border-teal-500 text-teal-700 bg-teal-50",
            "hover:bg-teal-500 hover:text-white hover:scale-[1.02] active:scale-[0.98]",
            "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
          )}
        >
          <Palette className="h-4 w-4" aria-hidden />
          {expanded ? "Hide Design Concepts" : "View Design Concepts"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
        </button>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500",
          expanded ? "opacity-100 max-h-[5000px]" : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        )}
        aria-hidden={!expanded}
      >
        {DESIGN_THEMES.map((theme) => (
          <Card key={theme.id} className="overflow-hidden border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex h-3">
              {theme.colors.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <CardHeader>
              <CardTitle className="text-base">{theme.name}</CardTitle>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: theme.colors[3] }}>
                <p className="font-bold" style={{ color: theme.colors[0] }}>Dashboard Preview</p>
                <p style={{ color: theme.colors[4] }}>Sample KPI card and typography</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
