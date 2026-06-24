import type { AppData, Session, UISettings } from "./types";
import { generateSeedData, clearSeedCache } from "./mockData";

const STORAGE_KEY = "icai_carbon_app_data";
const SESSION_KEY = "icai_carbon_session";
const STORAGE_VERSION = 1;

export const DEFAULT_UI_SETTINGS: UISettings = {
  selectedDesign: "modern_esg",
  portalName: "ICAI Carbon Emission Calculator",
  maintenanceMode: false,
};

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function mergeArray<T>(partial: T[] | undefined, seed: T[]): T[] {
  return partial !== undefined ? partial : seed;
}

/** Full merge with seed — only for first-time load or incomplete stored data. */
function mergeWithSeed(partial: Partial<AppData>): AppData {
  const seed = generateSeedData();
  return {
    users: mergeArray(partial.users, seed.users),
    entities: mergeArray(partial.entities, seed.entities),
    regions: mergeArray(partial.regions, seed.regions),
    branches: mergeArray(partial.branches, seed.branches),
    caFirms: mergeArray(partial.caFirms, seed.caFirms),
    emissionCategories: mergeArray(partial.emissionCategories, seed.emissionCategories),
    emissionFactors: mergeArray(partial.emissionFactors, seed.emissionFactors),
    emissionFactorVersions: mergeArray(partial.emissionFactorVersions, seed.emissionFactorVersions),
    calculations: mergeArray(partial.calculations, seed.calculations),
    reports: mergeArray(partial.reports, seed.reports),
    recommendations: mergeArray(partial.recommendations, seed.recommendations),
    queries: mergeArray(partial.queries, seed.queries),
    queryReplies: mergeArray(partial.queryReplies, seed.queryReplies),
    documents: mergeArray(partial.documents, seed.documents),
    auditLogs: mergeArray(partial.auditLogs, seed.auditLogs),
    monthlyEmissions: mergeArray(partial.monthlyEmissions, seed.monthlyEmissions),
    uiSettings: { ...seed.uiSettings, ...partial.uiSettings },
  };
}

function hasStoredCoreData(parsed: Partial<AppData>): boolean {
  return Array.isArray(parsed.users) && parsed.users.length > 0 && Array.isArray(parsed.branches);
}

function hasPartialStoredData(parsed: Partial<AppData>): boolean {
  return Array.isArray(parsed.users) || Array.isArray(parsed.branches);
}

/** Fast path: reuse stored data without regenerating 185+ branch seed records. */
function normalizeStoredData(partial: Partial<AppData>): AppData {
  return {
    users: partial.users ?? [],
    entities: partial.entities ?? [],
    regions: partial.regions ?? [],
    branches: partial.branches ?? [],
    caFirms: partial.caFirms ?? [],
    emissionCategories: partial.emissionCategories ?? [],
    emissionFactors: partial.emissionFactors ?? [],
    emissionFactorVersions: partial.emissionFactorVersions ?? [],
    calculations: partial.calculations ?? [],
    reports: partial.reports ?? [],
    recommendations: partial.recommendations ?? [],
    queries: partial.queries ?? [],
    queryReplies: partial.queryReplies ?? [],
    documents: partial.documents ?? [],
    auditLogs: partial.auditLogs ?? [],
    monthlyEmissions: partial.monthlyEmissions ?? [],
    uiSettings: { ...DEFAULT_UI_SETTINGS, ...partial.uiSettings },
  };
}

export function loadAppData(): AppData {
  if (!isBrowser()) return generateSeedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppData> & { _version?: number };
      if (hasStoredCoreData(parsed)) {
        return normalizeStoredData(parsed);
      }
      if (hasPartialStoredData(parsed)) {
        return mergeWithSeed(parsed);
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ICAI] localStorage parse failed, reseeding:", err);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  const seed = generateSeedData();
  saveAppData(seed);
  return seed;
}

export function saveAppData(data: AppData): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, _version: STORAGE_VERSION }));
}

export function resetAppData(): AppData {
  clearSeedCache();
  const seed = generateSeedData();
  saveAppData(seed);
  return seed;
}

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
  return null;
}

export function saveSession(session: Session): void {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function exportDemoData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function validateSession(session: Session | null, users: AppData["users"]): Session | null {
  if (!session) return null;
  const user = users.find((u) => u.id === session.userId && u.status === "active");
  if (!user) return null;
  return {
    ...session,
    name: user.name,
    email: user.email,
    role: user.role,
    entityId: user.entityId,
    entityName: user.entityName,
    regionId: user.regionId,
    regionName: user.regionName,
  };
}
