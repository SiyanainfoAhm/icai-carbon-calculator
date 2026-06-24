import { readFileSync, writeFileSync } from "fs";

const files = [
  "components/layout/AppLayout.tsx",
  "components/layout/Sidebar.tsx",
  "components/layout/MobileNav.tsx",
  "components/layout/Header.tsx",
  "components/common/KpiCard.tsx",
  "components/common/EmptyState.tsx",
  "components/common/Stepper.tsx",
  "components/common/DataTable.tsx",
  "components/common/ProfileForm.tsx",
  "components/common/CarbonLogo.tsx",
  "components/auth/LoginForm.tsx",
  "components/reports/ReportsPage.tsx",
  "components/reports/ReportPreview.tsx",
  "components/helpdesk/HelpdeskPage.tsx",
  "components/calculator/CalculatorWizard.tsx",
  "components/dashboard/RegionalDashboard.tsx",
  "components/admin/EntityAdmin.tsx",
  "components/admin/UsersAdmin.tsx",
  "components/admin/EmissionFactorsAdmin.tsx",
  "components/recommendations/RecommendationsList.tsx",
];

const replacements = [
  ["bg-teal-600 hover:bg-teal-700", "bg-primary hover:bg-primary/90"],
  ["from-teal-600 to-emerald-700", "from-primary to-primary/80"],
  ["from-teal-500 to-emerald-600 shadow-lg shadow-teal-200", "from-primary to-primary/80 shadow-lg shadow-primary/20"],
  ["border-teal-600 text-teal-700 hover:bg-teal-50", "border-primary text-primary hover:bg-primary/10"],
  ["text-teal-100", "text-primary-foreground/80"],
  ["text-teal-200", "text-primary-foreground/70"],
  ["hover:bg-teal-50/50", "hover:bg-primary/10"],
  ["hover:border-teal-300", "hover:border-primary/40"],
  ["shadow-teal-900/30", "shadow-theme"],
  ["hover:bg-teal-700", "hover:bg-primary/90"],
  ["bg-teal-600", "bg-primary"],
  ["text-teal-800", "text-primary"],
  ["text-teal-700", "text-primary"],
  ["text-teal-600", "text-primary"],
  ["text-teal-500", "text-primary"],
  ["text-teal-300", "text-theme-light"],
  ["bg-teal-100", "bg-primary/15"],
  ["bg-teal-50", "bg-primary/10"],
  ["border-teal-600", "border-primary"],
  ["bg-teal-500", "bg-primary"],
  ["via-teal-50/30 to-emerald-50/20", "via-primary/5 to-primary/10"],
];

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const orig = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  if (content !== orig) {
    writeFileSync(file, content);
    console.log("updated", file);
  }
}
