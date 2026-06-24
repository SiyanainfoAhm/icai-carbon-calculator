import type { Calculation, GeneratedReport, ReportFormat, Session } from "./types";
import { getCategoryBreakdown } from "./calculationEngine";

export const REPORT_DISCLAIMER =
  "This is a demo Proof of Concept report. Production reports will include secure PDF/Excel export, digital signatures, and backend audit validation.";

export const METHODOLOGY_NOTE =
  "CO₂e is calculated using activity data multiplied by active emission factors.";

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").slice(0, 60);
}

export function buildReportFileName(report: GeneratedReport, ext: string): string {
  const date = new Date(report.generatedDate).toISOString().slice(0, 10);
  const entity = sanitizeFileName(report.entityName);
  const period = sanitizeFileName(report.reportingPeriod);
  return `ICAI_Emission_Report_${entity}_${period}_${date}.${ext}`;
}

export function buildReportFromCalculation(
  calculation: Calculation,
  format: ReportFormat,
  session: Session,
  recommendationsSummary: string[] = []
): GeneratedReport {
  const id = `RPT-${Date.now().toString(36).toUpperCase()}`;
  return {
    id,
    reportName: `${calculation.entityName} - ${calculation.reportingPeriod} Emission Report`,
    entityId: calculation.entityId,
    entityName: calculation.entityName,
    entityType: calculation.entityType,
    regionId: calculation.regionId,
    regionName: calculation.regionName,
    reportingPeriod: calculation.reportingPeriod,
    generatedBy: session.name,
    generatedByUserId: session.userId,
    generatedByEmail: session.email,
    generatedDate: new Date().toISOString(),
    format,
    status: "Generated",
    totalCo2e: calculation.totalCo2e,
    scope1Total: calculation.scope1Total,
    scope2Total: calculation.scope2Total,
    scope3Total: calculation.scope3Total,
    calculationId: calculation.id,
    categoryBreakdown: getCategoryBreakdown(calculation.lineItems),
    lineItems: calculation.lineItems,
    recommendationsSummary,
  };
}

/** @deprecated use buildReportFromCalculation */
export function generateReportFromCalculation(
  calculation: Calculation,
  format: ReportFormat,
  generatedBy: string
): GeneratedReport {
  return buildReportFromCalculation(calculation, format, {
    userId: calculation.userId,
    email: "",
    name: generatedBy,
    role: "ca_firm",
    entityId: calculation.entityId,
    entityName: calculation.entityName,
    regionId: calculation.regionId,
    regionName: calculation.regionName,
    loggedInAt: new Date().toISOString(),
  });
}

export function generateRegionalReport(
  regionName: string,
  regionId: string,
  reportingPeriod: string,
  totalCo2e: number,
  generatedBy: string,
  session?: Session
): GeneratedReport {
  return {
    id: `RPT-REG-${Date.now().toString(36).toUpperCase()}`,
    reportName: `${regionName} Regional Emission Report - ${reportingPeriod}`,
    entityId: regionId,
    entityName: regionName,
    entityType: "Regional Office",
    regionId,
    regionName,
    reportingPeriod,
    generatedBy,
    generatedByUserId: session?.userId,
    generatedByEmail: session?.email,
    generatedDate: new Date().toISOString(),
    format: "PDF",
    status: "Generated",
    totalCo2e,
    scope1Total: Math.round(totalCo2e * 0.35 * 100) / 100,
    scope2Total: Math.round(totalCo2e * 0.25 * 100) / 100,
    scope3Total: Math.round(totalCo2e * 0.4 * 100) / 100,
    categoryBreakdown: [],
    lineItems: [],
    recommendationsSummary: [],
  };
}
