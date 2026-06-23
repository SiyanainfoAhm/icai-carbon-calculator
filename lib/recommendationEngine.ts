import type { Calculation, Recommendation } from "./types";

const CATEGORY_RECOMMENDATIONS: Record<string, Omit<Recommendation, "id" | "createdAt" | "isActive" | "status" | "entityId">[]> = {
  "Electricity Consumption": [
    { categoryId: "electricity", category: "Electricity", priority: "High", title: "Shift 25% to Renewable Energy", description: "Shift 25% usage to renewable energy through green tariffs or rooftop solar.", estimatedSavings: 450 },
    { categoryId: "electricity", category: "Electricity", priority: "Medium", title: "LED Lighting Upgrade", description: "Replace conventional lighting with LED to reduce electricity consumption by 30%.", estimatedSavings: 200 },
    { categoryId: "electricity", category: "Electricity", priority: "Low", title: "Energy Monitoring", description: "Implement energy monitoring to identify consumption patterns.", estimatedSavings: 100 },
  ],
  "Air Travel": [
    { categoryId: "air_travel", category: "Travel", priority: "High", title: "Prefer Rail over Short Flights", description: "Use rail for journeys under 500 km.", estimatedSavings: 380 },
    { categoryId: "air_travel", category: "Travel", priority: "Medium", title: "Virtual Meetings", description: "Promote virtual meetings to reduce business travel.", estimatedSavings: 250 },
  ],
  "Rail Travel": [
    { categoryId: "rail_travel", category: "Travel", priority: "Low", title: "Optimize Rail Bookings", description: "Book trains in advance for better routes and lower emissions.", estimatedSavings: 50 },
  ],
  "Paper Consumption": [
    { categoryId: "paper", category: "Paper", priority: "Medium", title: "Digital Records", description: "Adopt digital record keeping to reduce paper consumption.", estimatedSavings: 120 },
    { categoryId: "paper", category: "Paper", priority: "Low", title: "Double-sided Printing", description: "Enable double-sided printing as default.", estimatedSavings: 60 },
  ],
  "Other Waste": [
    { categoryId: "waste", category: "Waste", priority: "Medium", title: "Waste Segregation", description: "Improve waste segregation at source for better recycling.", estimatedSavings: 80 },
    { categoryId: "waste", category: "Waste", priority: "Low", title: "Recycling Vendor", description: "Adopt a certified recycling vendor process.", estimatedSavings: 40 },
  ],
  "Diesel Generator Set": [
    { categoryId: "diesel_generator", category: "Diesel", priority: "High", title: "Optimize DG Usage", description: "Optimize diesel generator usage schedule and maintenance.", estimatedSavings: 300 },
    { categoryId: "diesel_generator", category: "Diesel", priority: "Medium", title: "Cleaner Backup Options", description: "Explore cleaner backup power options like battery storage.", estimatedSavings: 200 },
  ],
};

export function getDynamicRecommendations(
  calculations: Calculation[],
  entityId: string,
  existing: Recommendation[]
): Recommendation[] {
  const entityCalcs = calculations.filter((c) => c.entityId === entityId && c.status === "completed");
  if (!entityCalcs.length) return [];

  const categoryTotals = new Map<string, number>();
  for (const calc of entityCalcs) {
    for (const item of calc.lineItems) {
      categoryTotals.set(item.categoryName, (categoryTotals.get(item.categoryName) ?? 0) + item.co2e);
    }
  }

  const sorted = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]);
  const dynamic: Recommendation[] = [];

  for (const [categoryName] of sorted.slice(0, 3)) {
    const templates = CATEGORY_RECOMMENDATIONS[categoryName] ?? [];
    for (const template of templates) {
      const id = `dyn-${categoryName}-${template.title}`.replace(/\s/g, "-").toLowerCase();
      const persisted = existing.find((r) => r.id === id || r.title === template.title);
      if (persisted) continue;
      dynamic.push({
        ...template,
        id,
        status: "New",
        isActive: true,
        entityId,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return dynamic;
}
