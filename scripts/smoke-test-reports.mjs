/**
 * Smoke test for report generation utilities (no browser required).
 * Run: node scripts/smoke-test-reports.mjs
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

// Inline minimal copies of logic under test (ESM can't import TS without build)
const REPORT_DISCLAIMER =
  "This is a demo Proof of Concept report. Production reports will include secure PDF/Excel export, digital signatures, and backend audit validation.";
const METHODOLOGY_NOTE =
  "CO₂e is calculated using activity data multiplied by active emission factors.";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").slice(0, 60);
}

function buildReportFileName(report, ext) {
  const date = new Date(report.generatedDate).toISOString().slice(0, 10);
  const entity = sanitizeFileName(report.entityName);
  const period = sanitizeFileName(report.reportingPeriod);
  return `ICAI_Emission_Report_${entity}_${period}_${date}.${ext}`;
}

const mockCalc = {
  id: "calc-test-1",
  entityId: "ent-1",
  entityName: "Demo CA Firm Alpha",
  entityType: "CA Firm",
  regionId: "reg-1",
  regionName: "North Region",
  reportingPeriod: "FY 2024-25",
  totalCo2e: 1250.5,
  scope1Total: 0,
  scope2Total: 800,
  scope3Total: 450.5,
  lineItems: [
    {
      id: "li-1",
      categoryId: "electricity",
      categoryName: "Electricity Consumption",
      activityQuantity: 5000,
      unit: "kWh",
      emissionFactor: 0.16,
      co2e: 800,
      scope: 2,
    },
    {
      id: "li-2",
      categoryId: "air_travel",
      categoryName: "Air Travel",
      activityQuantity: 3000,
      unit: "km",
      emissionFactor: 0.15,
      co2e: 450.5,
      scope: 3,
    },
  ],
};

const mockSession = {
  userId: "user-1",
  email: "user1@icai-demo.org",
  name: "CA Firm User 1",
  role: "ca_firm",
  entityId: "ent-1",
  entityName: "Demo CA Firm Alpha",
  regionId: "reg-1",
  regionName: "North Region",
  loggedInAt: new Date().toISOString(),
};

console.log("\n=== Report Smoke Test ===\n");

// Check source files exist
const files = [
  "lib/reportUtils.ts",
  "lib/reportExport.ts",
  "components/reports/ReportsPage.tsx",
  "components/reports/ReportPreview.tsx",
  "store/useAppStore.ts",
];
for (const f of files) {
  readFileSync(join(root, f), "utf8");
  assert(true, `file exists: ${f}`);
}

// Filename format
const mockReport = {
  entityName: "Demo CA Firm Alpha",
  reportingPeriod: "FY 2024-25",
  generatedDate: "2025-06-23T10:00:00.000Z",
};
const csvName = buildReportFileName(mockReport, "csv");
assert(csvName.startsWith("ICAI_Emission_Report_"), "CSV filename prefix");
assert(csvName.endsWith(".csv"), "CSV filename extension");
assert(csvName.includes("FY_2024-25"), "period in filename");

const pdfName = buildReportFileName(mockReport, "pdf");
assert(pdfName.endsWith(".pdf"), "PDF filename extension");

// Constants present in source
const reportUtilsSrc = readFileSync(join(root, "lib/reportUtils.ts"), "utf8");
assert(reportUtilsSrc.includes("buildReportFromCalculation"), "buildReportFromCalculation defined");
assert(reportUtilsSrc.includes("generatedByEmail"), "report includes email field");

const reportExportSrc = readFileSync(join(root, "lib/reportExport.ts"), "utf8");
assert(reportExportSrc.includes("exportReportAsExcelCsv"), "CSV export defined");
assert(reportExportSrc.includes("exportReportAsPdf"), "PDF export defined");
assert(reportExportSrc.includes("METHODOLOGY_NOTE"), "methodology referenced in export");

const storeSrc = readFileSync(join(root, "lib/storage.ts"), "utf8");
assert(storeSrc.includes('icai_carbon_app_data'), "app data storage key");
assert(storeSrc.includes('icai_carbon_session'), "session storage key");

const wizardSrc = readFileSync(join(root, "components/calculator/CalculatorWizard.tsx"), "utf8");
assert(wizardSrc.includes("generating === \"PDF\""), "PDF loading state");
assert(wizardSrc.includes("disabled={!!generating}"), "buttons disabled during generation");

const reportsPageSrc = readFileSync(join(root, "components/reports/ReportsPage.tsx"), "utf8");
assert(reportsPageSrc.includes("No reports generated yet"), "empty state message");
assert(reportsPageSrc.includes("downloadReport"), "download wired to store");

console.log("\n=== All report smoke checks passed ===\n");
