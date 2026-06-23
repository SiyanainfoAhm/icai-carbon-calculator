import type {
  AppData,
  Branch,
  Calculation,
  CalculationLineItem,
  EmissionCategory,
  EmissionCategoryId,
  EmissionFactor,
  HelpdeskQuery,
  MonthlyEmission,
  QueryReply,
  Recommendation,
  Region,
  UploadedDocument,
  User,
  UserRole,
} from "./types";
import { createSystemAuditLog } from "./audit";

const REGIONS_DATA = [
  { id: "reg-north", name: "Northern Region", code: "NR", location: "New Delhi" },
  { id: "reg-south", name: "Southern Region", code: "SR", location: "Chennai" },
  { id: "reg-east", name: "Eastern Region", code: "ER", location: "Kolkata" },
  { id: "reg-west", name: "Western Region", code: "WR", location: "Mumbai" },
  { id: "reg-central", name: "Central Region", code: "CR", location: "Bhopal" },
];

const CITIES: Record<string, string[]> = {
  "reg-north": ["New Delhi", "Chandigarh", "Jaipur", "Lucknow", "Dehradun", "Amritsar", "Kanpur", "Noida", "Gurgaon", "Agra"],
  "reg-south": ["Chennai", "Bengaluru", "Hyderabad", "Kochi", "Coimbatore", "Visakhapatnam", "Mysuru", "Madurai", "Thiruvananthapuram", "Tiruchirappalli"],
  "reg-east": ["Kolkata", "Bhubaneswar", "Patna", "Guwahati", "Ranchi", "Siliguri", "Durgapur", "Jamshedpur", "Cuttack", "Agartala"],
  "reg-west": ["Mumbai", "Pune", "Ahmedabad", "Surat", "Nagpur", "Indore", "Vadodara", "Nashik", "Rajkot", "Goa"],
  "reg-central": ["Bhopal", "Raipur", "Bhubaneswar", "Jabalpur", "Gwalior", "Ujjain", "Bilaspur", "Nagpur", "Jhansi", "Satna"],
};

const SUBMISSION_STATUSES = ["Submitted", "Pending", "Draft", "Needs Review"] as const;
const FIRMS = [
  "Sharma & Associates", "Gupta Audit Partners", "Patel CA Consultants", "Reddy & Co Chartered Accountants",
  "Iyer Financial Advisors", "Mehta Audit Bureau", "Singh & Sons CA", "Kapoor Tax Consultants",
  "Desai & Partners", "Joshi Audit Services", "Nair CA Firm", "Verma Associates",
  "Agarwal Audit House", "Banerjee & Co", "Chopra Chartered Accountants", "Malhotra Tax Advisors",
  "Rao & Associates", "Pillai CA Consultants", "Kulkarni Audit Partners", "Bose Financial Services",
];

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function randomStatus(): (typeof SUBMISSION_STATUSES)[number] {
  return SUBMISSION_STATUSES[Math.floor(Math.random() * SUBMISSION_STATUSES.length)];
}

function generateBranches(): Branch[] {
  const branches: Branch[] = [];
  let idx = 1;
  for (const region of REGIONS_DATA) {
    const cities = CITIES[region.id];
    for (let i = 0; i < 37; i++) {
      const city = cities[i % cities.length];
      const emissions = Math.round((500 + Math.random() * 4500) * 100) / 100;
      const prev = Math.round(emissions * (0.85 + Math.random() * 0.3) * 100) / 100;
      branches.push({
        id: `branch-${idx}`,
        name: `ICAI Branch - ${city} ${String(idx).padStart(3, "0")}`,
        code: `ICAI-${region.code}-${String(idx).padStart(3, "0")}`,
        regionId: region.id,
        regionName: region.name,
        location: `${city}, India`,
        contactPerson: `Branch Secretary ${idx}`,
        email: `branch${idx}@icai.org.in`,
        mobile: `+91 98${String(10000000 + idx).slice(0, 8)}`,
        status: Math.random() > 0.05 ? "active" : "inactive",
        lastReportingPeriod: "FY 2024-25",
        submissionStatus: randomStatus(),
        totalEmissions: emissions,
        previousEmissions: prev,
      });
      idx++;
    }
  }
  return branches;
}

function createEmissionCategories(): EmissionCategory[] {
  return [
    { id: "electricity", name: "Electricity Consumption", description: "Grid electricity usage", defaultScope: "Scope 2", unit: "kWh" },
    { id: "diesel_generator", name: "Diesel Generator Set", description: "DG set diesel consumption", defaultScope: "Scope 1", unit: "litre" },
    { id: "personal_vehicle", name: "Personal Vehicle", description: "Firm vehicle travel", defaultScope: "Scope 1", unit: "km" },
    { id: "air_travel", name: "Air Travel", description: "Domestic and international flights", defaultScope: "Scope 3", unit: "km" },
    { id: "rail_travel", name: "Rail Travel", description: "Train travel for business", defaultScope: "Scope 3", unit: "km" },
    { id: "road_travel", name: "Road Travel", description: "Bus, taxi and road transport", defaultScope: "Scope 3", unit: "km" },
    { id: "cooking_fuel", name: "Cooking Fuel & Gases", description: "LPG, PNG and other cooking fuels", defaultScope: "Scope 1", unit: "kg" },
    { id: "paper", name: "Paper Consumption", description: "Office paper usage", defaultScope: "Scope 3", unit: "kg" },
    { id: "waste", name: "Other Waste", description: "General and recyclable waste", defaultScope: "Scope 3", unit: "kg" },
    { id: "hotel_stay", name: "Hotel Stay", description: "Business travel accommodation", defaultScope: "Scope 3", unit: "night" },
  ];
}

function createEmissionFactors(): EmissionFactor[] {
  const base: Omit<EmissionFactor, "id">[] = [
    { categoryId: "electricity", category: "Electricity Consumption", factorName: "Grid Electricity India", unit: "kWh", emissionFactor: 0.82, scope: "Scope 2", source: "CEA 2023", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "diesel_generator", category: "Diesel Generator Set", factorName: "Diesel DG Set", unit: "litre", emissionFactor: 2.68, scope: "Scope 1", source: "IPCC 2006", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "personal_vehicle", category: "Personal Vehicle", factorName: "Petrol Vehicle", unit: "km", emissionFactor: 0.18, scope: "Scope 1", source: "MoEFCC", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "personal_vehicle", category: "Personal Vehicle", factorName: "Diesel Vehicle", unit: "km", emissionFactor: 0.21, scope: "Scope 1", source: "MoEFCC", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "air_travel", category: "Air Travel", factorName: "Domestic Air Travel", unit: "km", emissionFactor: 0.15, scope: "Scope 3", source: "DEFRA 2023", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "rail_travel", category: "Rail Travel", factorName: "Indian Railways", unit: "km", emissionFactor: 0.04, scope: "Scope 3", source: "Indian Railways", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "road_travel", category: "Road Travel", factorName: "Road Transport", unit: "km", emissionFactor: 0.12, scope: "Scope 3", source: "MoRTH", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "cooking_fuel", category: "Cooking Fuel & Gases", factorName: "LPG Cooking Fuel", unit: "kg", emissionFactor: 2.98, scope: "Scope 1", source: "IPCC 2006", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "cooking_fuel", category: "Cooking Fuel & Gases", factorName: "PNG Cooking Fuel", unit: "kg", emissionFactor: 2.75, scope: "Scope 1", source: "IPCC 2006", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "paper", category: "Paper Consumption", factorName: "Office Paper", unit: "kg", emissionFactor: 1.3, scope: "Scope 3", source: "EPA WARM", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "waste", category: "Other Waste", factorName: "Mixed Waste", unit: "kg", emissionFactor: 0.45, scope: "Scope 3", source: "EPA WARM", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "hotel_stay", category: "Hotel Stay", factorName: "Hotel Accommodation", unit: "night", emissionFactor: 25, scope: "Scope 3", source: "DEFRA 2023", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: true },
    { categoryId: "electricity", category: "Electricity Consumption", factorName: "Grid Electricity (Old)", unit: "kWh", emissionFactor: 0.79, scope: "Scope 2", source: "CEA 2022", effectiveDate: "2023-04-01", version: 0, status: "inactive", isCurrent: false },
    { categoryId: "air_travel", category: "Air Travel", factorName: "International Air Travel", unit: "km", emissionFactor: 0.18, scope: "Scope 3", source: "DEFRA 2023", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
    { categoryId: "waste", category: "Other Waste", factorName: "E-Waste", unit: "kg", emissionFactor: 0.62, scope: "Scope 3", source: "EPA WARM", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
    { categoryId: "paper", category: "Paper Consumption", factorName: "Recycled Paper", unit: "kg", emissionFactor: 0.9, scope: "Scope 3", source: "EPA WARM", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
    { categoryId: "road_travel", category: "Road Travel", factorName: "Bus Transport", unit: "km", emissionFactor: 0.08, scope: "Scope 3", source: "MoRTH", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
    { categoryId: "diesel_generator", category: "Diesel Generator Set", factorName: "Diesel DG (Old)", unit: "litre", emissionFactor: 2.55, scope: "Scope 1", source: "IPCC 2006", effectiveDate: "2023-04-01", version: 0, status: "inactive", isCurrent: false },
    { categoryId: "cooking_fuel", category: "Cooking Fuel & Gases", factorName: "Other Cooking Fuel", unit: "kg", emissionFactor: 3.1, scope: "Scope 1", source: "IPCC 2006", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
    { categoryId: "hotel_stay", category: "Hotel Stay", factorName: "Budget Hotel", unit: "night", emissionFactor: 18, scope: "Scope 3", source: "DEFRA 2023", effectiveDate: "2024-04-01", version: 1, status: "active", isCurrent: false },
  ];
  return base.map((f, i) => ({ ...f, id: `ef-${i + 1}` }));
}

function createUsers(branches: Branch[]): User[] {
  const users: User[] = [];
  const roles: { role: UserRole; count: number; entityType: string }[] = [
    { role: "ca_firm", count: 5, entityType: "ca" },
    { role: "branch_office", count: 5, entityType: "branch" },
    { role: "regional_office", count: 5, entityType: "region" },
    { role: "head_office", count: 5, entityType: "ho" },
    { role: "system_admin", count: 5, entityType: "admin" },
  ];

  let userIdx = 1;
  for (const r of roles) {
    for (let i = 0; i < r.count; i++) {
      const region = REGIONS_DATA[i % REGIONS_DATA.length];
      let entityId = region.id;
      let entityName = region.name;
      if (r.entityType === "branch") {
        const branch = branches[i * 7];
        entityId = branch.id;
        entityName = branch.name;
      } else if (r.entityType === "ca") {
        entityId = `cafirm-${i + 1}`;
        entityName = FIRMS[i];
      } else if (r.entityType === "ho") {
        entityId = "entity-ho";
        entityName = "ICAI Head Office";
      } else if (r.entityType === "admin") {
        entityId = "entity-admin";
        entityName = "ICAI System Administration";
      }

      users.push({
        id: `user-${userIdx}`,
        name: `${r.role === "ca_firm" ? "CA" : r.role === "system_admin" ? "Admin" : "Officer"} User ${userIdx}`,
        email: `user${userIdx}@icai-demo.org`,
        password: "demo123",
        role: r.role,
        entityId,
        entityName,
        regionId: region.id,
        regionName: region.name,
        status: "active",
        lastLogin: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
        createdAt: "2024-01-15T00:00:00.000Z",
        profile: {
          name: `Demo User ${userIdx}`,
          entityName,
          entityType: r.role === "ca_firm" ? "CA Firm" : r.role === "branch_office" ? "Branch Office" : r.role === "regional_office" ? "Regional Office" : r.role === "head_office" ? "Head Office" : "Head Office",
          location: region.location,
          region: region.name,
          reportingPeriod: "FY 2024-25",
          membershipNumber: `ICAI/MEM/${10000 + userIdx}`,
          contactEmail: `user${userIdx}@icai-demo.org`,
          mobileNumber: `+91 98765${String(10000 + userIdx).slice(-5)}`,
          address: `${region.location}, India`,
        },
      });
      userIdx++;
    }
  }
  return users;
}

function createMonthlyEmissions(): MonthlyEmission[] {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return months.map((month, i) => {
    const scope1 = Math.round((800 + Math.random() * 400 + i * 20) * 100) / 100;
    const scope2 = Math.round((1200 + Math.random() * 600 + i * 30) * 100) / 100;
    const scope3 = Math.round((600 + Math.random() * 300 + i * 15) * 100) / 100;
    return { month, scope1, scope2, scope3, total: Math.round((scope1 + scope2 + scope3) * 100) / 100 };
  });
}

function createSampleCalculations(users: User[]): Calculation[] {
  const calcs: Calculation[] = [];
  const caUsers = users.filter((u) => u.role === "ca_firm" || u.role === "branch_office").slice(0, 8);
  caUsers.forEach((user, i) => {
    const lineItems: CalculationLineItem[] = [
      { id: uid("li"), categoryId: "electricity", categoryName: "Electricity Consumption", scope: "Scope 2", activityQuantity: 5000 + i * 200, unit: "kWh", emissionFactor: 0.82, emissionFactorId: "ef-1", co2e: (5000 + i * 200) * 0.82, metadata: { kwh: 5000 + i * 200 } },
      { id: uid("li"), categoryId: "air_travel", categoryName: "Air Travel", scope: "Scope 3", activityQuantity: 3000 + i * 100, unit: "km", emissionFactor: 0.15, emissionFactorId: "ef-5", co2e: (3000 + i * 100) * 0.15, metadata: { distanceKm: 1500, trips: 2 } },
      { id: uid("li"), categoryId: "paper", categoryName: "Paper Consumption", scope: "Scope 3", activityQuantity: 50 + i * 5, unit: "kg", emissionFactor: 1.3, emissionFactorId: "ef-10", co2e: (50 + i * 5) * 1.3, metadata: { quantity: 50 + i * 5 } },
    ];
    const scope1 = 0;
    const scope2 = lineItems.filter((l) => l.scope === "Scope 2").reduce((s, l) => s + l.co2e, 0);
    const scope3 = lineItems.filter((l) => l.scope === "Scope 3").reduce((s, l) => s + l.co2e, 0);
    calcs.push({
      id: `calc-${i + 1}`,
      userId: user.id,
      userName: user.name,
      entityId: user.entityId,
      entityName: user.entityName,
      entityType: user.role === "ca_firm" ? "CA Firm" : "Branch Office",
      regionId: user.regionId,
      regionName: user.regionName,
      reportingPeriod: "FY 2024-25",
      status: i < 6 ? "completed" : "draft",
      lineItems,
      totalCo2e: Math.round((scope1 + scope2 + scope3) * 100) / 100,
      scope1Total: scope1,
      scope2Total: Math.round(scope2 * 100) / 100,
      scope3Total: Math.round(scope3 * 100) / 100,
      createdAt: new Date(Date.now() - (i + 1) * 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 3 * 86400000).toISOString(),
      completedAt: i < 6 ? new Date(Date.now() - i * 3 * 86400000).toISOString() : undefined,
      documentIds: [`doc-${i + 1}`],
    });
  });
  return calcs;
}

function createRecommendations(): Recommendation[] {
  const recs = [
    { categoryId: "electricity" as EmissionCategoryId, category: "Electricity", priority: "High" as const, title: "Shift to Renewable Energy", description: "Shift 25% usage to renewable energy through green tariffs or rooftop solar.", estimatedSavings: 450 },
    { categoryId: "electricity" as EmissionCategoryId, category: "Electricity", priority: "Medium" as const, title: "LED Lighting Upgrade", description: "Replace conventional lighting with LED to reduce electricity consumption by 30%.", estimatedSavings: 200 },
    { categoryId: "air_travel" as EmissionCategoryId, category: "Travel", priority: "High" as const, title: "Prefer Rail over Short Flights", description: "Use rail for journeys under 500 km to significantly reduce travel emissions.", estimatedSavings: 380 },
    { categoryId: "air_travel" as EmissionCategoryId, category: "Travel", priority: "Medium" as const, title: "Virtual Meetings", description: "Promote virtual meetings to reduce business travel requirements.", estimatedSavings: 250 },
    { categoryId: "paper" as EmissionCategoryId, category: "Paper", priority: "Medium" as const, title: "Digital Records", description: "Adopt digital record keeping to reduce paper consumption.", estimatedSavings: 120 },
    { categoryId: "paper" as EmissionCategoryId, category: "Paper", priority: "Low" as const, title: "Double-sided Printing", description: "Enable double-sided printing as default across all offices.", estimatedSavings: 60 },
    { categoryId: "waste" as EmissionCategoryId, category: "Waste", priority: "Medium" as const, title: "Waste Segregation", description: "Improve waste segregation at source for better recycling.", estimatedSavings: 80 },
    { categoryId: "diesel_generator" as EmissionCategoryId, category: "Diesel", priority: "High" as const, title: "Optimize DG Usage", description: "Optimize diesel generator usage schedule and maintenance.", estimatedSavings: 300 },
  ];
  return recs.map((r, i) => ({
    id: `rec-${i + 1}`,
    ...r,
    status: i < 2 ? "Implemented" : i < 4 ? "In Progress" : "New",
    isActive: true,
    createdAt: "2024-06-01T00:00:00.000Z",
  }));
}

function createQueries(users: User[]): HelpdeskQuery[] {
  return [
    { id: "q-1", queryNumber: "HD-2024-001", userId: users[0].id, userName: users[0].name, entityId: users[0].entityId, entityName: users[0].entityName, subject: "Emission factor clarification", category: "Technical", message: "Please clarify which emission factor to use for backup DG sets.", status: "Resolved", submittedDate: "2024-08-01T10:00:00.000Z", lastUpdated: "2024-08-03T14:00:00.000Z", assignedTo: "Admin User 21" },
    { id: "q-2", queryNumber: "HD-2024-002", userId: users[5].id, userName: users[5].name, entityId: users[5].entityId, entityName: users[5].entityName, subject: "Report generation issue", category: "Technical", message: "Unable to generate PDF report for Q2 data.", status: "In Progress", submittedDate: "2024-09-15T09:00:00.000Z", lastUpdated: "2024-09-16T11:00:00.000Z", assignedTo: "Admin User 22" },
    { id: "q-3", queryNumber: "HD-2024-003", userId: users[10].id, userName: users[10].name, entityId: users[10].entityId, entityName: users[10].entityName, subject: "Scope 3 categorization", category: "Guidance", message: "How should we categorize employee commute emissions?", status: "Open", submittedDate: "2024-10-01T08:00:00.000Z", lastUpdated: "2024-10-01T08:00:00.000Z" },
    { id: "q-4", queryNumber: "HD-2024-004", userId: users[1].id, userName: users[1].name, entityId: users[1].entityId, entityName: users[1].entityName, subject: "Data upload support", category: "Support", message: "Need help uploading electricity bill documents.", status: "Closed", submittedDate: "2024-07-10T12:00:00.000Z", lastUpdated: "2024-07-12T16:00:00.000Z", assignedTo: "Admin User 23" },
  ];
}

function createQueryReplies(): QueryReply[] {
  return [
    { id: "qr-1", queryId: "q-1", repliedBy: "Admin User 21", message: "Please use the DG diesel factor of 2.68 kg CO2e/litre as per the current active factor.", isInternal: false, createdAt: "2024-08-03T14:00:00.000Z" },
    { id: "qr-2", queryId: "q-2", repliedBy: "Admin User 22", message: "We are investigating the PDF generation issue. Please try again after clearing browser cache.", isInternal: false, createdAt: "2024-09-16T11:00:00.000Z" },
    { id: "qr-3", queryId: "q-2", repliedBy: "Admin User 22", message: "Internal: Issue related to large dataset - need to optimize report template.", isInternal: true, createdAt: "2024-09-16T10:30:00.000Z" },
  ];
}

function createDocuments(): UploadedDocument[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `doc-${i + 1}`,
    fileName: `supporting_doc_${i + 1}.pdf`,
    fileType: "application/pdf",
    fileSize: Math.round(100000 + Math.random() * 500000),
    uploadedBy: `User ${i + 1}`,
    relatedCategory: ["Electricity", "Air Travel", "Paper", "Diesel"][i % 4],
    relatedCalculationId: `calc-${(i % 6) + 1}`,
    uploadDate: new Date(Date.now() - i * 5 * 86400000).toISOString(),
    status: i < 7 ? "uploaded" as const : "pending" as const,
  }));
}

export function generateSeedData(): AppData {
  const branches = generateBranches();
  const regions: Region[] = REGIONS_DATA.map((r) => {
    const regionBranches = branches.filter((b) => b.regionId === r.id);
    const totalEmissions = regionBranches.reduce((s, b) => s + b.totalEmissions, 0);
    return {
      id: r.id,
      name: r.name,
      code: r.code,
      location: r.location,
      contactPerson: `Regional Director - ${r.name}`,
      email: `${r.code.toLowerCase()}@icai.org.in`,
      mobile: `+91 11${String(20000000 + REGIONS_DATA.indexOf(r)).slice(0, 8)}`,
      status: "active" as const,
      totalBranches: regionBranches.length,
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      lastReportingPeriod: "FY 2024-25",
      submissionStatus: randomStatus(),
    };
  });

  const caFirms = FIRMS.map((name, i) => ({
    id: `cafirm-${i + 1}`,
    name,
    registrationNumber: `FRN/${10000 + i}/2020`,
    regionId: REGIONS_DATA[i % 5].id,
    regionName: REGIONS_DATA[i % 5].name,
    location: CITIES[REGIONS_DATA[i % 5].id][i % 10] + ", India",
    contactPerson: `Partner - ${name.split(" ")[0]}`,
    email: `contact@${name.toLowerCase().replace(/[^a-z]/g, "")}.in`,
    mobile: `+91 98${String(20000000 + i).slice(0, 8)}`,
    status: "active" as const,
    lastReportingPeriod: "FY 2024-25",
    submissionStatus: randomStatus(),
    totalEmissions: Math.round((1000 + Math.random() * 8000) * 100) / 100,
  }));

  const users = createUsers(branches);
  const emissionFactors = createEmissionFactors();
  const calculations = createSampleCalculations(users);

  const entities = [
    { id: "entity-ho", name: "ICAI Head Office", entityType: "Head Office" as const, regionId: "reg-central", regionName: "Central Region", location: "New Delhi", contactPerson: "Director General", email: "ho@icai.org.in", mobile: "+91 11 3011 0400", status: "active" as const, lastReportingPeriod: "FY 2024-25", submissionStatus: "Submitted" as const, totalEmissions: 12500 },
    ...regions.map((r) => ({ id: r.id, name: r.name, entityType: "Regional Office" as const, regionId: r.id, regionName: r.name, location: r.location, contactPerson: r.contactPerson, email: r.email, mobile: r.mobile, status: r.status, lastReportingPeriod: r.lastReportingPeriod, submissionStatus: r.submissionStatus, totalEmissions: r.totalEmissions })),
    ...caFirms.slice(0, 5).map((f) => ({ id: f.id, name: f.name, entityType: "CA Firm" as const, regionId: f.regionId, regionName: f.regionName, location: f.location, contactPerson: f.contactPerson, email: f.email, mobile: f.mobile, status: f.status, lastReportingPeriod: f.lastReportingPeriod, submissionStatus: f.submissionStatus, totalEmissions: f.totalEmissions })),
  ];

  const reports = calculations.filter((c) => c.status === "completed").slice(0, 5).map((c, i) => ({
    id: `RPT-SEED-${i + 1}`,
    reportName: `${c.entityName} - Emission Report`,
    entityId: c.entityId,
    entityName: c.entityName,
    entityType: c.entityType,
    regionId: c.regionId,
    regionName: c.regionName,
    reportingPeriod: c.reportingPeriod,
    generatedBy: c.userName,
    generatedDate: c.completedAt ?? c.updatedAt,
    format: (i % 2 === 0 ? "PDF" : "Excel") as "PDF" | "Excel",
    status: "Generated" as const,
    totalCo2e: c.totalCo2e,
    scope1Total: c.scope1Total,
    scope2Total: c.scope2Total,
    scope3Total: c.scope3Total,
    calculationId: c.id,
    categoryBreakdown: c.lineItems.map((l) => ({ category: l.categoryName, co2e: l.co2e, scope: l.scope })),
  }));

  const auditLogs = [
    createSystemAuditLog("Demo Data Seeded", "System", "Initial demo data loaded"),
    createSystemAuditLog("Factor Updated", "Emission Factors", "Electricity factor updated from 0.79 to 0.82"),
    createSystemAuditLog("User Created", "Users", "Demo users seeded"),
    createSystemAuditLog("Report Generated", "Reports", "Sample reports created"),
  ];

  return {
    users,
    entities,
    regions,
    branches,
    caFirms,
    emissionCategories: createEmissionCategories(),
    emissionFactors,
    emissionFactorVersions: [
      { id: "efv-1", factorId: "ef-1", factorName: "Grid Electricity India", category: "Electricity Consumption", oldValue: 0.79, newValue: 0.82, changedBy: "Admin User 21", changeDate: "2024-04-01T00:00:00.000Z", reason: "Updated per CEA 2023 grid factor", versionNumber: 1, source: "CEA 2023" },
      { id: "efv-2", factorId: "ef-2", factorName: "Diesel DG Set", category: "Diesel Generator Set", oldValue: 2.55, newValue: 2.68, changedBy: "Admin User 22", changeDate: "2024-04-01T00:00:00.000Z", reason: "IPCC methodology revision", versionNumber: 1, source: "IPCC 2006" },
    ],
    calculations,
    reports,
    recommendations: createRecommendations(),
    queries: createQueries(users),
    queryReplies: createQueryReplies(),
    documents: createDocuments(),
    auditLogs,
    monthlyEmissions: createMonthlyEmissions(),
    uiSettings: {
      selectedDesign: "modern_esg",
      portalName: "ICAI Carbon Emission Calculator",
      maintenanceMode: false,
    },
  };
}

export const DEMO_USERS = [
  { role: "ca_firm" as UserRole, email: "user1@icai-demo.org", label: "CA Firm User" },
  { role: "branch_office" as UserRole, email: "user6@icai-demo.org", label: "Branch Office User" },
  { role: "regional_office" as UserRole, email: "user11@icai-demo.org", label: "Regional Office User" },
  { role: "head_office" as UserRole, email: "user16@icai-demo.org", label: "Head Office Admin" },
  { role: "system_admin" as UserRole, email: "user21@icai-demo.org", label: "System Admin" },
];
