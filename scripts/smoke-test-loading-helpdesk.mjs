/**
 * Smoke tests for fast loading and helpdesk storage.
 * Run: node scripts/smoke-test-loading-helpdesk.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

console.log("\n=== Loading & Helpdesk Smoke Test ===\n");

const storageSrc = readFileSync(join(root, "lib/storage.ts"), "utf8");
assert(storageSrc.includes("normalizeStoredData"), "fast normalize path exists");
assert(storageSrc.includes("hasStoredCoreData"), "core data check exists");
assert(!storageSrc.includes("mergeWithSeed(parsed)") || storageSrc.includes("hasPartialStoredData"), "merge only for partial data");
assert(storageSrc.includes('icai_carbon_app_data'), "app data key");
assert(storageSrc.includes('icai_carbon_session'), "session key");

const mockSrc = readFileSync(join(root, "lib/mockData.ts"), "utf8");
assert(mockSrc.includes("cachedSeedData"), "seed data cache exists");
assert(mockSrc.includes("clearSeedCache"), "seed cache clear on reset");

const providerSrc = readFileSync(join(root, "components/providers/AppProvider.tsx"), "utf8");
assert(providerSrc.includes("hydrateStore"), "sync hydration on client");
assert(providerSrc.includes("2000"), "2s timeout fallback");
assert(providerSrc.includes("Reset Demo Data"), "recovery message");

const storeSrc = readFileSync(join(root, "store/useAppStore.ts"), "utf8");
assert(storeSrc.includes("Helpdesk Query Submitted"), "submit audit action");
assert(storeSrc.includes("Helpdesk Query Replied"), "reply audit action");
assert(storeSrc.includes("Helpdesk Query Status Changed"), "status change audit");

const helpdeskSrc = readFileSync(join(root, "components/helpdesk/HelpdeskPage.tsx"), "utf8");
assert(helpdeskSrc.includes("adminMode"), "admin mode supported");
assert(helpdeskSrc.includes("System Admin can review it from Admin Queries"), "submit success message");
assert(helpdeskSrc.includes("No helpdesk queries submitted yet"), "admin empty state");
assert(helpdeskSrc.includes("Save Reply"), "admin save reply button");

const adminDashSrc = readFileSync(join(root, "components/dashboard/AdminDashboard.tsx"), "utf8");
assert(adminDashSrc.includes("Open Queries"), "open queries KPI");
assert(adminDashSrc.includes("/admin/queries"), "link to queries");

const roleGuardSrc = readFileSync(join(root, "components/auth/RoleGuard.tsx"), "utf8");
assert(!roleGuardSrc.includes("LoadingSkeleton"), "no skeleton blocker on route guard");

console.log("\n=== All loading & helpdesk checks passed ===\n");
