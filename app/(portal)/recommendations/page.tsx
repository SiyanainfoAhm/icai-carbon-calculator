"use client";

import { RecommendationsList } from "@/components/recommendations/RecommendationsList";
export default function RecommendationsRoute() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Sustainability Recommendations</h1><p className="text-muted-foreground">Personalized emission reduction suggestions</p></div>
      <RecommendationsList />
    </div>
  );
}
