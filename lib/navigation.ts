import type { NavItem, UserRole } from "./types";

export function getNavItemsForRole(role: UserRole): NavItem[] {
  const common = {
    profile: { label: "Profile", href: "/profile", icon: "User" },
    helpdesk: { label: "Helpdesk", href: "/helpdesk", icon: "HelpCircle" },
    recommendations: { label: "Recommendations", href: "/recommendations", icon: "Lightbulb" },
    reports: { label: "Reports", href: "/reports", icon: "FileText" },
    history: { label: "Calculation History", href: "/history", icon: "History" },
    calculator: { label: "New Calculation", href: "/calculator", icon: "Calculator" },
    dashboard: { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    resources: { label: "Resources", href: "/resources", icon: "BookOpen" },
  };

  switch (role) {
    case "ca_firm":
      return [
        common.dashboard,
        common.calculator,
        common.history,
        common.reports,
        common.recommendations,
        common.helpdesk,
        common.resources,
        common.profile,
      ];
    case "branch_office":
      return [
        { label: "Branch Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        common.calculator,
        common.history,
        { label: "Branch Reports", href: "/reports", icon: "FileText" },
        common.recommendations,
        common.helpdesk,
        common.resources,
        common.profile,
      ];
    case "regional_office":
      return [
        { label: "Regional Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Branch Analytics", href: "/branch-analytics", icon: "Building2" },
        common.reports,
        common.helpdesk,
        common.resources,
        common.profile,
      ];
    case "head_office":
      return [
        { label: "HO Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Regional Analytics", href: "/regional-analytics", icon: "Map" },
        { label: "Branch Analytics", href: "/branch-analytics", icon: "Building2" },
        { label: "CA Firm Analytics", href: "/ca-firm-analytics", icon: "Briefcase" },
        common.reports,
        { label: "MIS", href: "/mis", icon: "BarChart3" },
        common.helpdesk,
        { label: "Security", href: "/security", icon: "Shield" },
        common.profile,
      ];
    case "system_admin":
      return [
        { label: "Admin Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
        { label: "Users", href: "/admin/users", icon: "Users" },
        { label: "Entities", href: "/admin/entities", icon: "Building" },
        { label: "Branches", href: "/admin/branches", icon: "Building2" },
        { label: "Regions", href: "/admin/regions", icon: "Map" },
        { label: "CA Firms", href: "/admin/ca-firms", icon: "Briefcase" },
        { label: "Emission Factors", href: "/admin/emission-factors", icon: "FlaskConical" },
        { label: "Factor Version History", href: "/admin/factor-history", icon: "GitBranch" },
        { label: "Recommendations", href: "/admin/recommendations", icon: "Lightbulb" },
        { label: "Queries", href: "/admin/queries", icon: "MessageSquare" },
        common.reports,
        { label: "Audit Logs", href: "/admin/audit-logs", icon: "ScrollText" },
        { label: "Design Options", href: "/admin/design-options", icon: "Palette" },
        { label: "Settings", href: "/admin/settings", icon: "Settings" },
      ];
    default:
      return [common.dashboard];
  }
}

export function getAllowedPathsForRole(role: UserRole): string[] {
  const navHrefs = getNavItemsForRole(role).map((i) => i.href);
  const shared = ["/profile", "/resources"];
  switch (role) {
    case "ca_firm":
    case "branch_office":
      return [...new Set([...navHrefs, ...shared, "/calculator", "/history"])];
    case "regional_office":
      return [...new Set([...navHrefs, ...shared])];
    case "head_office":
      return [...new Set([...navHrefs, ...shared, "/security"])];
    case "system_admin":
      return [...new Set([...navHrefs, ...shared, "/admin"])];
    default:
      return navHrefs;
  }
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  const allowed = getAllowedPathsForRole(role);
  return allowed.some(
    (href) => path === href || (href !== "/" && path.startsWith(`${href}/`))
  );
}

export function isNavItemActive(pathname: string, href: string, allHrefs: string[]): boolean {
  const matches =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  if (!matches) return false;
  const moreSpecific = allHrefs.filter(
    (h) =>
      h !== href &&
      h.length > href.length &&
      h.startsWith(href) &&
      (pathname === h || pathname.startsWith(`${h}/`))
  );
  return moreSpecific.length === 0;
}

export function getDashboardPathForRole(_role: UserRole): string {
  return "/dashboard";
}
