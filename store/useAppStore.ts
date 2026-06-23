"use client";

import { create } from "zustand";
import type {
  AppData,
  Calculation,
  EmissionFactor,
  GeneratedReport,
  HelpdeskQuery,
  QueryReply,
  Recommendation,
  Session,
  User,
  UserProfile,
  UserRole,
} from "@/lib/types";
import {
  loadAppData,
  saveAppData,
  resetAppData,
  loadSession,
  saveSession,
  clearSession,
  validateSession,
} from "@/lib/storage";
import { createAuditLog } from "@/lib/audit";
import { generateReportFromCalculation } from "@/lib/reportUtils";
import { sumByScope } from "@/lib/calculationEngine";

interface AppState {
  hydrated: boolean;
  session: Session | null;
  data: AppData;
  init: () => void;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateProfile: (userId: string, profile: UserProfile) => void;
  addAuditLog: (action: string, module: string, details: string) => void;
  resetDemo: () => void;
  exportData: () => string;
  updateUISettings: (settings: Partial<AppData["uiSettings"]>) => void;
  // Calculations
  saveCalculation: (calc: Calculation) => void;
  deleteCalculation: (id: string) => void;
  getCalculation: (id: string) => Calculation | undefined;
  // Reports
  addReport: (report: GeneratedReport) => void;
  deleteReport: (id: string) => void;
  generateReport: (calculationId: string, format: "PDF" | "Excel") => GeneratedReport | null;
  // Recommendations
  updateRecommendationStatus: (id: string, status: Recommendation["status"]) => void;
  upsertRecommendation: (rec: Recommendation) => void;
  addRecommendation: (rec: Omit<Recommendation, "id" | "createdAt">) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
  deleteRecommendation: (id: string) => void;
  // Queries
  submitQuery: (query: Omit<HelpdeskQuery, "id" | "queryNumber" | "submittedDate" | "lastUpdated">) => void;
  replyQuery: (queryId: string, reply: Omit<QueryReply, "id" | "createdAt">, status: HelpdeskQuery["status"]) => void;
  updateQuery: (id: string, updates: Partial<HelpdeskQuery>) => void;
  // Users
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Emission factors
  updateEmissionFactor: (id: string, updates: Partial<EmissionFactor>, reason: string) => void;
  addEmissionFactor: (factor: Omit<EmissionFactor, "id">) => void;
  deleteEmissionFactor: (id: string) => void;
  // Generic entity updates
  updateData: <K extends keyof AppData>(key: K, value: AppData[K]) => void;
  updateItem: <T extends { id: string }>(key: keyof AppData, id: string, updates: Partial<T>) => void;
  addItem: <T extends { id: string }>(key: keyof AppData, item: T) => void;
  deleteItem: (key: keyof AppData, id: string) => void;
  addDocument: (doc: AppData["documents"][0]) => void;
}

function persist(state: AppState) {
  saveAppData(state.data);
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  session: null,
  data: {} as AppData,

  init: () => {
    if (get().hydrated) return;
    const data = loadAppData();
    const rawSession = loadSession();
    const session = validateSession(rawSession, data.users);
    if (rawSession && !session) clearSession();
    set({ data, session, hydrated: true });
  },

  login: (email, password, role) => {
    const { data } = get();
    const user = data.users.find(
      (u) => u.email === email && u.password === password && u.role === role && u.status === "active"
    );
    if (!user) return false;
    const session: Session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      entityId: user.entityId,
      entityName: user.entityName,
      regionId: user.regionId,
      regionName: user.regionName,
      loggedInAt: new Date().toISOString(),
    };
    saveSession(session);
    const updatedUsers = data.users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: session.loggedInAt } : u
    );
    const audit = createAuditLog(session, "Login", "Authentication", `User ${user.name} logged in as ${role}`);
    const newData = { ...data, users: updatedUsers, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ session, data: newData });
    return true;
  },

  logout: () => {
    const { session, data } = get();
    if (session) {
      const audit = createAuditLog(session, "Logout", "Authentication", `User ${session.name} logged out`);
      const newData = { ...data, auditLogs: [audit, ...data.auditLogs] };
      saveAppData(newData);
      set({ data: newData });
    }
    clearSession();
    set({ session: null });
  },

  updateProfile: (userId, profile) => {
    const { session, data } = get();
    const users = data.users.map((u) =>
      u.id === userId ? { ...u, profile, name: profile.name } : u
    );
    const audit = createAuditLog(session, "Profile Update", "Profile", `Profile updated for ${profile.name}`);
    const newData = { ...data, users, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    if (session?.userId === userId) {
      const updatedSession = { ...session, name: profile.name };
      saveSession(updatedSession);
      set({ session: updatedSession, data: newData });
    } else {
      set({ data: newData });
    }
  },

  addAuditLog: (action, module, details) => {
    const { session, data } = get();
    const audit = createAuditLog(session, action, module, details);
    const newData = { ...data, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  resetDemo: () => {
    const data = resetAppData();
    const audit = createAuditLog(get().session, "Reset Demo Data", "Settings", "Demo data reset to seed values");
    const newData = { ...data, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  exportData: () => JSON.stringify(get().data, null, 2),

  updateUISettings: (settings) => {
    const { data } = get();
    const newData = { ...data, uiSettings: { ...data.uiSettings, ...settings } };
    persist({ ...get(), data: newData });
    set({ data: newData });
  },

  saveCalculation: (calc) => {
    const { session, data } = get();
    const totals = sumByScope(calc.lineItems);
    const fullCalc: Calculation = {
      ...calc,
      totalCo2e: totals.total,
      scope1Total: totals.scope1,
      scope2Total: totals.scope2,
      scope3Total: totals.scope3,
      updatedAt: new Date().toISOString(),
    };
    const exists = data.calculations.find((c) => c.id === calc.id);
    const calculations = exists
      ? data.calculations.map((c) => (c.id === calc.id ? fullCalc : c))
      : [fullCalc, ...data.calculations];
    const action = exists ? "Save Calculation" : "New Calculation";
    const audit = createAuditLog(session, action, "Calculator", `${action}: ${fullCalc.id}`);
    const newData = { ...data, calculations, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteCalculation: (id) => {
    const { data } = get();
    const newData = { ...data, calculations: data.calculations.filter((c) => c.id !== id) };
    saveAppData(newData);
    set({ data: newData });
  },

  getCalculation: (id) => get().data.calculations.find((c) => c.id === id),

  addReport: (report) => {
    const { session, data } = get();
    const audit = createAuditLog(session, "Report Generated", "Reports", `Report ${report.id} generated`);
    const newData = { ...data, reports: [report, ...data.reports], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteReport: (id) => {
    const { data } = get();
    const newData = { ...data, reports: data.reports.filter((r) => r.id !== id) };
    saveAppData(newData);
    set({ data: newData });
  },

  generateReport: (calculationId, format) => {
    const { session, data } = get();
    const calc = data.calculations.find((c) => c.id === calculationId);
    if (!calc || !session) return null;
    const report = generateReportFromCalculation(calc, format, session.name);
    get().addReport(report);
    return report;
  },

  updateRecommendationStatus: (id, status) => {
    const { session, data } = get();
    const existing = data.recommendations.find((r) => r.id === id);
    if (!existing) return;
    const recommendations = data.recommendations.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    const audit = createAuditLog(session, "Update Recommendation", "Recommendations", `Recommendation ${id} status: ${status}`);
    const newData = { ...data, recommendations, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  upsertRecommendation: (rec) => {
    const { session, data } = get();
    const exists = data.recommendations.find((r) => r.id === rec.id);
    const recommendations = exists
      ? data.recommendations.map((r) => (r.id === rec.id ? { ...r, ...rec } : r))
      : [rec, ...data.recommendations];
    const audit = createAuditLog(
      session,
      exists ? "Update Recommendation" : "Add Recommendation",
      "Recommendations",
      `${rec.title} — ${rec.status}`
    );
    const newData = { ...data, recommendations, auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  addRecommendation: (rec) => {
    const { session, data } = get();
    const item: Recommendation = { ...rec, id: `rec-${Date.now()}`, createdAt: new Date().toISOString() };
    const audit = createAuditLog(session, "Add Recommendation", "Recommendations", `Added: ${item.title}`);
    const newData = { ...data, recommendations: [item, ...data.recommendations], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  updateRecommendation: (id, updates) => {
    const { data } = get();
    const newData = { ...data, recommendations: data.recommendations.map((r) => (r.id === id ? { ...r, ...updates } : r)) };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteRecommendation: (id) => {
    const { data } = get();
    const newData = { ...data, recommendations: data.recommendations.filter((r) => r.id !== id) };
    saveAppData(newData);
    set({ data: newData });
  },

  submitQuery: (query) => {
    const { session, data } = get();
    const num = data.queries.length + 1;
    const item: HelpdeskQuery = {
      ...query,
      id: `q-${Date.now()}`,
      queryNumber: `HD-2024-${String(num).padStart(3, "0")}`,
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    const audit = createAuditLog(session, "Submit Query", "Helpdesk", `Query ${item.queryNumber} submitted`);
    const newData = { ...data, queries: [item, ...data.queries], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  replyQuery: (queryId, reply, status) => {
    const { session, data } = get();
    const item: QueryReply = { ...reply, id: `qr-${Date.now()}`, createdAt: new Date().toISOString() };
    const queries = data.queries.map((q) =>
      q.id === queryId ? { ...q, status, lastUpdated: new Date().toISOString() } : q
    );
    const audit = createAuditLog(session, "Reply Query", "Helpdesk", `Reply to query ${queryId}`);
    const newData = { ...data, queries, queryReplies: [item, ...data.queryReplies], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  updateQuery: (id, updates) => {
    const { data } = get();
    const newData = { ...data, queries: data.queries.map((q) => (q.id === id ? { ...q, ...updates, lastUpdated: new Date().toISOString() } : q)) };
    saveAppData(newData);
    set({ data: newData });
  },

  addUser: (user) => {
    const { session, data } = get();
    const item: User = { ...user, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
    const audit = createAuditLog(session, "Add User", "Users", `User ${item.name} created`);
    const newData = { ...data, users: [item, ...data.users], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  updateUser: (id, updates) => {
    const { session, data } = get();
    const audit = createAuditLog(session, "Edit User", "Users", `User ${id} updated`);
    const newData = {
      ...data,
      users: data.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      auditLogs: [audit, ...data.auditLogs],
    };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteUser: (id) => {
    const { session, data } = get();
    const audit = createAuditLog(session, "Delete User", "Users", `User ${id} deleted`);
    const newData = { ...data, users: data.users.filter((u) => u.id !== id), auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  updateEmissionFactor: (id, updates, reason) => {
    const { session, data } = get();
    const factor = data.emissionFactors.find((f) => f.id === id);
    if (!factor) return;
    const newValue = updates.emissionFactor ?? factor.emissionFactor;
    const version = {
      id: `efv-${Date.now()}`,
      factorId: id,
      factorName: factor.factorName,
      category: factor.category,
      oldValue: factor.emissionFactor,
      newValue,
      changedBy: session?.name ?? "System",
      changeDate: new Date().toISOString(),
      reason,
      versionNumber: factor.version + 1,
      source: factor.source,
    };
    const emissionFactors = data.emissionFactors.map((f) =>
      f.id === id ? { ...f, ...updates, version: f.version + 1 } : f
    );
    const audit = createAuditLog(session, "Edit Emission Factor", "Emission Factors", `Factor ${factor.factorName} updated`);
    const newData = {
      ...data,
      emissionFactors,
      emissionFactorVersions: [version, ...data.emissionFactorVersions],
      auditLogs: [audit, ...data.auditLogs],
    };
    saveAppData(newData);
    set({ data: newData });
  },

  addEmissionFactor: (factor) => {
    const { session, data } = get();
    const item: EmissionFactor = { ...factor, id: `ef-${Date.now()}` };
    const audit = createAuditLog(session, "Add Emission Factor", "Emission Factors", `Factor ${item.factorName} added`);
    const newData = { ...data, emissionFactors: [item, ...data.emissionFactors], auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteEmissionFactor: (id) => {
    const { session, data } = get();
    const audit = createAuditLog(session, "Delete Emission Factor", "Emission Factors", `Factor ${id} deleted`);
    const newData = { ...data, emissionFactors: data.emissionFactors.filter((f) => f.id !== id), auditLogs: [audit, ...data.auditLogs] };
    saveAppData(newData);
    set({ data: newData });
  },

  updateData: (key, value) => {
    const { data } = get();
    const newData = { ...data, [key]: value };
    saveAppData(newData);
    set({ data: newData });
  },

  updateItem: (key, id, updates) => {
    const { data } = get();
    const items = (data[key] as { id: string }[]).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    const newData = { ...data, [key]: items };
    saveAppData(newData);
    set({ data: newData });
  },

  addItem: (key, item) => {
    const { data } = get();
    const items = [item, ...(data[key] as { id: string }[])];
    const newData = { ...data, [key]: items };
    saveAppData(newData);
    set({ data: newData });
  },

  deleteItem: (key, id) => {
    const { data } = get();
    const items = (data[key] as { id: string }[]).filter((item) => item.id !== id);
    const newData = { ...data, [key]: items };
    saveAppData(newData);
    set({ data: newData });
  },

  addDocument: (doc) => {
    const { data } = get();
    const newData = { ...data, documents: [doc, ...data.documents] };
    saveAppData(newData);
    set({ data: newData });
  },
}));
