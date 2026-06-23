import type { AppData, Session } from "./types";
import { generateSeedData } from "./mockData";

const STORAGE_KEY = "icai_carbon_app_data";
const SESSION_KEY = "icai_carbon_session";
const STORAGE_VERSION = 1;

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function mergeArray<T>(partial: T[] | undefined, seed: T[]): T[] {
  return partial !== undefined ? partial : seed;
}

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

export function loadAppData(): AppData {
  if (!isBrowser()) return generateSeedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppData>;
      return mergeWithSeed(parsed);
    }
  } catch {
    // fall through to seed
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
