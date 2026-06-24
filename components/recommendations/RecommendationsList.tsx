"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";
import { Lightbulb, CheckCircle } from "lucide-react";
import { getDynamicRecommendations } from "@/lib/recommendationEngine";
import type { Recommendation } from "@/lib/types";

export function RecommendationsList({ adminMode = false }: { adminMode?: boolean }) {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const upsertRecommendation = useAppStore((s) => s.upsertRecommendation);
  const deleteRecommendation = useAppStore((s) => s.deleteRecommendation);
  const updateRecommendation = useAppStore((s) => s.updateRecommendation);

  const recs = useMemo(() => {
    const base = adminMode ? data.recommendations : data.recommendations.filter((r) => r.isActive);
    if (adminMode || !session) return base;
    const dynamic = getDynamicRecommendations(data.calculations, session.entityId, base);
    const merged = [...dynamic, ...base];
    const seen = new Set<string>();
    return merged.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [adminMode, data.recommendations, data.calculations, session]);

  const handleMarkImplemented = (rec: Recommendation) => {
    upsertRecommendation({ ...rec, status: "Implemented", isActive: true });
    toast.success("Marked as implemented");
  };

  if (!recs.length) {
    return (
      <EmptyState
        title="No recommendations yet"
        description="Complete a calculation to receive personalized sustainability recommendations."
      />
    );
  }

  return (
    <div className="space-y-4">
      {recs.map((rec) => (
        <Card key={rec.id} className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{rec.category}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <StatusBadge status={rec.priority} />
                <StatusBadge status={rec.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
            <p className="text-sm font-medium text-primary">Est. savings: {rec.estimatedSavings} kg CO2e/year</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {!adminMode && rec.status !== "Implemented" && (
                <Button size="sm" className="bg-primary" onClick={() => handleMarkImplemented(rec)}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Mark Implemented
                </Button>
              )}
              {adminMode && (
                <>
                  <Button size="sm" variant="outline" onClick={() => { updateRecommendation(rec.id, { isActive: !rec.isActive }); toast.success(rec.isActive ? "Deactivated" : "Activated"); }}>
                    {rec.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { deleteRecommendation(rec.id); toast.success("Deleted"); }}>Delete</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
