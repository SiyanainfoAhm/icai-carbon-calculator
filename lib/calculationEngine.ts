import type {
  CalculationLineItem,
  EmissionCategoryId,
  EmissionFactor,
  Scope,
} from "./types";

export function calculateCo2e(
  activityQuantity: number,
  emissionFactor: number
): number {
  return Math.round(activityQuantity * emissionFactor * 100) / 100;
}

export function getActiveFactorForCategory(
  factors: EmissionFactor[],
  categoryId: EmissionCategoryId,
  subType?: string
): EmissionFactor | undefined {
  const active = factors.filter(
    (f) => f.categoryId === categoryId && f.status === "active" && f.isCurrent
  );
  if (subType) {
    const match = active.find((f) =>
      f.factorName.toLowerCase().includes(subType.toLowerCase())
    );
    if (match) return match;
  }
  return active[0];
}

export function buildLineItem(
  categoryId: EmissionCategoryId,
  categoryName: string,
  factor: EmissionFactor,
  activityQuantity: number,
  metadata: Record<string, string | number> = {},
  notes?: string
): CalculationLineItem {
  const co2e = calculateCo2e(activityQuantity, factor.emissionFactor);
  return {
    id: `li-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    categoryId,
    categoryName,
    scope: factor.scope,
    activityQuantity,
    unit: factor.unit,
    emissionFactor: factor.emissionFactor,
    emissionFactorId: factor.id,
    co2e,
    notes,
    metadata,
  };
}

export function sumByScope(
  items: CalculationLineItem[]
): { scope1: number; scope2: number; scope3: number; total: number } {
  let scope1 = 0;
  let scope2 = 0;
  let scope3 = 0;
  for (const item of items) {
    if (item.scope === "Scope 1") scope1 += item.co2e;
    else if (item.scope === "Scope 2") scope2 += item.co2e;
    else scope3 += item.co2e;
  }
  const total = Math.round((scope1 + scope2 + scope3) * 100) / 100;
  return {
    scope1: Math.round(scope1 * 100) / 100,
    scope2: Math.round(scope2 * 100) / 100,
    scope3: Math.round(scope3 * 100) / 100,
    total,
  };
}

export function getCategoryBreakdown(
  items: CalculationLineItem[]
): { category: string; co2e: number; scope: Scope }[] {
  const map = new Map<string, { co2e: number; scope: Scope }>();
  for (const item of items) {
    const existing = map.get(item.categoryName);
    if (existing) {
      existing.co2e += item.co2e;
    } else {
      map.set(item.categoryName, { co2e: item.co2e, scope: item.scope });
    }
  }
  return Array.from(map.entries())
    .map(([category, data]) => ({
      category,
      co2e: Math.round(data.co2e * 100) / 100,
      scope: data.scope,
    }))
    .sort((a, b) => b.co2e - a.co2e);
}

export function getHighestCategory(
  items: CalculationLineItem[]
): { category: string; co2e: number } | null {
  const breakdown = getCategoryBreakdown(items);
  return breakdown[0] ?? null;
}

export const CATEGORY_FIELD_CONFIG: Record<
  EmissionCategoryId,
  { label: string; fields: { key: string; label: string; type: string; options?: string[] }[] }
> = {
  electricity: {
    label: "Electricity Consumption",
    fields: [
      { key: "kwh", label: "kWh Consumed", type: "number" },
      { key: "billingPeriod", label: "Billing Period", type: "text" },
    ],
  },
  diesel_generator: {
    label: "Diesel Generator Set",
    fields: [
      { key: "litres", label: "Diesel Litres", type: "number" },
      { key: "runningHours", label: "DG Running Hours", type: "number" },
    ],
  },
  personal_vehicle: {
    label: "Personal Vehicle",
    fields: [
      { key: "vehicleType", label: "Vehicle Type", type: "select", options: ["Car", "Two Wheeler", "SUV"] },
      { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel"] },
      { key: "kmTravelled", label: "KM Travelled", type: "number" },
      { key: "trips", label: "Number of Trips", type: "number" },
    ],
  },
  air_travel: {
    label: "Air Travel",
    fields: [
      { key: "fromCity", label: "From City", type: "text" },
      { key: "toCity", label: "To City", type: "text" },
      { key: "distanceKm", label: "Distance (KM)", type: "number" },
      { key: "travelClass", label: "Class", type: "select", options: ["Economy", "Business"] },
      { key: "trips", label: "Number of Trips", type: "number" },
    ],
  },
  rail_travel: {
    label: "Rail Travel",
    fields: [
      { key: "fromStation", label: "From Station", type: "text" },
      { key: "toStation", label: "To Station", type: "text" },
      { key: "distanceKm", label: "Distance (KM)", type: "number" },
      { key: "trips", label: "Number of Trips", type: "number" },
    ],
  },
  road_travel: {
    label: "Road Travel",
    fields: [
      { key: "vehicleType", label: "Vehicle Type", type: "select", options: ["Bus", "Taxi", "Auto"] },
      { key: "distanceKm", label: "Distance (KM)", type: "number" },
      { key: "trips", label: "Number of Trips", type: "number" },
    ],
  },
  cooking_fuel: {
    label: "Cooking Fuel & Gases",
    fields: [
      { key: "fuelType", label: "Fuel Type", type: "select", options: ["LPG", "PNG", "Other"] },
      { key: "quantity", label: "Quantity", type: "number" },
      { key: "unit", label: "Unit", type: "select", options: ["kg", "cubic metre"] },
    ],
  },
  paper: {
    label: "Paper Consumption",
    fields: [
      { key: "quantity", label: "Quantity", type: "number" },
      { key: "unit", label: "Unit", type: "select", options: ["KG", "Reams"] },
      { key: "paperType", label: "Paper Type", type: "select", options: ["A4", "Legal", "Recycled"] },
    ],
  },
  waste: {
    label: "Other Waste",
    fields: [
      { key: "wasteType", label: "Waste Type", type: "select", options: ["General", "E-Waste", "Plastic"] },
      { key: "quantityKg", label: "Quantity (KG)", type: "number" },
      { key: "disposalMethod", label: "Disposal Method", type: "select", options: ["Landfill", "Recycling", "Incineration"] },
    ],
  },
  hotel_stay: {
    label: "Hotel Stay",
    fields: [
      { key: "city", label: "City", type: "text" },
      { key: "nights", label: "Number of Nights", type: "number" },
      { key: "persons", label: "Number of Persons", type: "number" },
    ],
  },
};

export function getActivityQuantity(
  categoryId: EmissionCategoryId,
  metadata: Record<string, string | number>
): number {
  switch (categoryId) {
    case "electricity":
      return Number(metadata.kwh) || 0;
    case "diesel_generator":
      return Number(metadata.litres) || 0;
    case "personal_vehicle":
      return Number(metadata.kmTravelled) || 0;
    case "air_travel":
    case "rail_travel":
    case "road_travel":
      return (Number(metadata.distanceKm) || 0) * (Number(metadata.trips) || 1);
    case "cooking_fuel":
      return Number(metadata.quantity) || 0;
    case "paper":
      return Number(metadata.quantity) || 0;
    case "waste":
      return Number(metadata.quantityKg) || 0;
    case "hotel_stay":
      return Number(metadata.nights) || 0;
    default:
      return 0;
  }
}

export function getFactorSubType(
  categoryId: EmissionCategoryId,
  metadata: Record<string, string | number>
): string | undefined {
  if (categoryId === "personal_vehicle") {
    return String(metadata.fuelType || "Petrol");
  }
  if (categoryId === "cooking_fuel") {
    return String(metadata.fuelType || "LPG");
  }
  return undefined;
}
