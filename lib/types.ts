export type UserRole =
  | "ca_firm"
  | "branch_office"
  | "regional_office"
  | "head_office"
  | "system_admin";

export type EntityType =
  | "CA Firm"
  | "Branch Office"
  | "Regional Office"
  | "Head Office";

export type Scope = "Scope 1" | "Scope 2" | "Scope 3";

export type SubmissionStatus =
  | "Submitted"
  | "Pending"
  | "Draft"
  | "Needs Review";

export type QueryStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type RecommendationPriority = "High" | "Medium" | "Low";

export type RecommendationStatus = "New" | "In Progress" | "Implemented";

export type ReportFormat = "PDF" | "Excel";

export type ReportStatus = "Generated" | "Draft" | "Archived";

export type DesignTheme =
  | "sustainability_green"
  | "institutional_blue"
  | "modern_esg"
  | "minimal_corporate"
  | "premium_dashboard";

export type EmissionCategoryId =
  | "electricity"
  | "diesel_generator"
  | "personal_vehicle"
  | "air_travel"
  | "rail_travel"
  | "road_travel"
  | "cooking_fuel"
  | "paper"
  | "waste"
  | "hotel_stay";

export interface UserProfile {
  name: string;
  entityName: string;
  entityType: EntityType;
  location: string;
  region: string;
  reportingPeriod: string;
  membershipNumber: string;
  contactEmail: string;
  mobileNumber: string;
  address: string;
  gstPan?: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  entityId: string;
  entityName: string;
  regionId: string;
  regionName: string;
  loggedInAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  entityId: string;
  entityName: string;
  regionId: string;
  regionName: string;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
  profile?: UserProfile;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  location: string;
  contactPerson: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  totalBranches: number;
  totalEmissions: number;
  lastReportingPeriod: string;
  submissionStatus: SubmissionStatus;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  regionId: string;
  regionName: string;
  location: string;
  contactPerson: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  lastReportingPeriod: string;
  submissionStatus: SubmissionStatus;
  totalEmissions: number;
  previousEmissions: number;
}

export interface CAFirm {
  id: string;
  name: string;
  registrationNumber: string;
  regionId: string;
  regionName: string;
  location: string;
  contactPerson: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  lastReportingPeriod: string;
  submissionStatus: SubmissionStatus;
  totalEmissions: number;
}

export interface Entity {
  id: string;
  name: string;
  entityType: EntityType;
  regionId: string;
  regionName: string;
  location: string;
  contactPerson: string;
  email: string;
  mobile: string;
  status: "active" | "inactive";
  lastReportingPeriod: string;
  submissionStatus: SubmissionStatus;
  totalEmissions: number;
}

export interface EmissionCategory {
  id: EmissionCategoryId;
  name: string;
  description: string;
  defaultScope: Scope;
  unit: string;
}

export interface EmissionFactor {
  id: string;
  categoryId: EmissionCategoryId;
  category: string;
  factorName: string;
  unit: string;
  emissionFactor: number;
  scope: Scope;
  source: string;
  effectiveDate: string;
  version: number;
  status: "active" | "inactive";
  isCurrent: boolean;
}

export interface EmissionFactorVersion {
  id: string;
  factorId: string;
  factorName: string;
  category: string;
  oldValue: number;
  newValue: number;
  changedBy: string;
  changeDate: string;
  reason: string;
  versionNumber: number;
  source: string;
}

export interface CalculationLineItem {
  id: string;
  categoryId: EmissionCategoryId;
  categoryName: string;
  scope: Scope;
  activityQuantity: number;
  unit: string;
  emissionFactor: number;
  emissionFactorId: string;
  co2e: number;
  notes?: string;
  metadata: Record<string, string | number>;
}

export interface Calculation {
  id: string;
  userId: string;
  userName: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  regionId: string;
  regionName: string;
  reportingPeriod: string;
  status: "draft" | "completed";
  lineItems: CalculationLineItem[];
  totalCo2e: number;
  scope1Total: number;
  scope2Total: number;
  scope3Total: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  documentIds: string[];
}

export interface GeneratedReport {
  id: string;
  reportName: string;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  regionId: string;
  regionName: string;
  reportingPeriod: string;
  generatedBy: string;
  generatedByUserId?: string;
  generatedByEmail?: string;
  generatedDate: string;
  format: ReportFormat;
  status: ReportStatus;
  totalCo2e: number;
  scope1Total: number;
  scope2Total: number;
  scope3Total: number;
  calculationId?: string;
  categoryBreakdown: { category: string; co2e: number; scope: Scope }[];
  lineItems?: CalculationLineItem[];
  recommendationsSummary?: string[];
}

export interface Recommendation {
  id: string;
  categoryId: EmissionCategoryId;
  category: string;
  priority: RecommendationPriority;
  title: string;
  description: string;
  estimatedSavings: number;
  status: RecommendationStatus;
  isActive: boolean;
  entityId?: string;
  createdAt: string;
}

export interface HelpdeskQuery {
  id: string;
  queryNumber: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: UserRole;
  entityId: string;
  entityName: string;
  entityType?: EntityType | string;
  regionId?: string;
  regionName?: string;
  subject: string;
  category: string;
  message: string;
  status: QueryStatus;
  priority?: RecommendationPriority;
  submittedDate: string;
  lastUpdated: string;
  assignedTo?: string;
  internalNote?: string;
  lastReply?: string;
  repliedBy?: string;
  repliedByUserId?: string;
  repliedByEmail?: string;
  repliedAt?: string;
}

export interface QueryReply {
  id: string;
  queryId: string;
  repliedBy: string;
  repliedByUserId?: string;
  repliedByEmail?: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  relatedCategory: string;
  relatedCalculationId: string;
  uploadDate: string;
  status: "uploaded" | "pending" | "verified";
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  details: string;
}

export interface MonthlyEmission {
  month: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface UISettings {
  selectedDesign: DesignTheme;
  portalName: string;
  maintenanceMode: boolean;
}

export interface AppData {
  users: User[];
  entities: Entity[];
  regions: Region[];
  branches: Branch[];
  caFirms: CAFirm[];
  emissionCategories: EmissionCategory[];
  emissionFactors: EmissionFactor[];
  emissionFactorVersions: EmissionFactorVersion[];
  calculations: Calculation[];
  reports: GeneratedReport[];
  recommendations: Recommendation[];
  queries: HelpdeskQuery[];
  queryReplies: QueryReply[];
  documents: UploadedDocument[];
  auditLogs: AuditLog[];
  monthlyEmissions: MonthlyEmission[];
  uiSettings: UISettings;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ca_firm: "CA Firm User",
  branch_office: "Branch Office User",
  regional_office: "Regional Office User",
  head_office: "Head Office Admin",
  system_admin: "System Admin",
};

export const DESIGN_THEMES: {
  id: DesignTheme;
  name: string;
  description: string;
  colors: string[];
  status: "Proposed" | "Selected";
}[] = [
  {
    id: "sustainability_green",
    name: "Sustainability Green",
    description: "Fresh green tones with earthy accents for eco-focused reporting.",
    colors: ["#059669", "#10B981", "#34D399", "#D1FAE5", "#064E3B"],
    status: "Proposed",
  },
  {
    id: "institutional_blue",
    name: "Institutional Blue",
    description: "Professional blue palette suited for ICAI institutional branding.",
    colors: ["#1E40AF", "#3B82F6", "#60A5FA", "#DBEAFE", "#1E3A8A"],
    status: "Proposed",
  },
  {
    id: "modern_esg",
    name: "Modern ESG",
    description: "Contemporary teal and slate combination for ESG dashboards.",
    colors: ["#0D9488", "#14B8A6", "#5EEAD4", "#CCFBF1", "#134E4A"],
    status: "Proposed",
  },
  {
    id: "minimal_corporate",
    name: "Minimal Corporate",
    description: "Clean neutral palette with subtle accent colors.",
    colors: ["#374151", "#6B7280", "#9CA3AF", "#F3F4F6", "#111827"],
    status: "Proposed",
  },
  {
    id: "premium_dashboard",
    name: "Premium Dashboard",
    description: "Rich gradient dashboard with premium data visualization feel.",
    colors: ["#7C3AED", "#8B5CF6", "#A78BFA", "#EDE9FE", "#4C1D95"],
    status: "Proposed",
  },
];
