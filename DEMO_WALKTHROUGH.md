# ICAI Carbon Emission Calculator — Demo Walkthrough (Screen-Share Script)

**URL:** `http://localhost:3000`  
**Password (all roles):** `demo123`  
**Suggested demo duration:** 25–35 minutes + Q&A

---

## 1. Application Summary

The ICAI Carbon Emission Calculator is a **frontend Proof of Concept (PoC)** for standardized GHG emission reporting across ICAI’s hierarchy — CA Firms, Branch Offices, Regional Offices, and Head Office. Users enter activity data (electricity, travel, paper, etc.) through a guided wizard; the system applies admin-managed emission factors and calculates CO₂e by Scope 1, 2, and 3. Role-based dashboards show KPIs, charts, and submission status. Users can generate report records (PDF/Excel preview), receive sustainability recommendations, submit helpdesk queries, and maintain audit trails. System Admins manage users, entities, 185+ branches, emission factors with version history, and demo settings. **All data persists in the browser via localStorage** — no backend or database in this PoC. Architecture is modular so storage can later connect to Supabase/PostgreSQL and ICAI SSO.

---

## 2. Login and Role Flow

### Universal login details
| Field | Value |
|--------|--------|
| Password | `demo123` |
| Login page | `/login` |
| Quick login | Click role card on login page (auto-fills email + role) |

---

### CA Firm User
| Item | Detail |
|------|--------|
| **Demo email** | `user1@icai-demo.org` |
| **Entity** | Sharma & Associates (Northern Region) |
| **Dashboard** | CA Firm Dashboard — entity emissions KPIs, scope cards, category/scope charts, calculation history |
| **Sidebar modules** | Dashboard · New Calculation · Calculation History · Reports · Recommendations · Helpdesk · Resources · Profile |
| **Key actions** | Run calculator wizard, save draft/complete calculation, generate PDF/Excel report records, view recommendations, submit helpdesk query, update profile |

---

### Branch Office User
| Item | Detail |
|------|--------|
| **Demo email** | `user6@icai-demo.org` |
| **Entity** | ICAI Branch (Northern Region branch office) |
| **Dashboard** | Branch Dashboard — branch total emissions, period comparison, scope/category charts, branch profile summary |
| **Sidebar modules** | Branch Dashboard · New Calculation · Calculation History · Branch Reports · Recommendations · Helpdesk · Resources · Profile |
| **Key actions** | Same calculator flow as CA Firm; branch-level reporting and analytics |

---

### Regional Office User
| Item | Detail |
|------|--------|
| **Demo email** | `user11@icai-demo.org` |
| **Entity** | Northern Region (Regional Office) |
| **Dashboard** | Regional Dashboard — region consolidated emissions, branch submission status table, top emitting/improved branches, export regional report |
| **Sidebar modules** | Regional Dashboard · Branch Analytics · Reports · Helpdesk · Resources · Profile |
| **Key actions** | Monitor branch submissions, compare branches (paginated 185+ branches in analytics), export regional report, view reports, manage queries |

---

### Head Office Admin
| Item | Detail |
|------|--------|
| **Demo email** | `user16@icai-demo.org` |
| **Entity** | ICAI Head Office |
| **Dashboard** | HO Dashboard — All-India consolidated view, region/branch/CA firm comparisons, MIS-style KPIs |
| **Sidebar modules** | HO Dashboard · Regional Analytics · Branch Analytics · CA Firm Analytics · Reports · MIS · Helpdesk · Security · Profile |
| **Key actions** | All-India oversight, MIS export, security/compliance UI, consolidated reporting |

---

### System Admin
| Item | Detail |
|------|--------|
| **Demo email** | `user21@icai-demo.org` |
| **Entity** | ICAI System Administration |
| **Dashboard** | Admin Dashboard — user/branch/region counts, open queries, factor updates, recent audit logs |
| **Sidebar modules** | Admin Dashboard · Users · Entities · Branches · Regions · CA Firms · Emission Factors · Factor Version History · Recommendations · Queries · Reports · Audit Logs · Design Options · Settings |
| **Key actions** | CRUD users/entities/branches/regions/firms, edit emission factors (creates version history), reply to queries, reset demo data, export JSON, manage design theme |

---

## 3. End-to-End Demo Script (Step-by-Step)

### Phase A — Landing & positioning (2 min)
1. Open **`/`** (landing page).
2. Point out hero carousel, KPI preview cards, feature grid, ICAI hierarchy.
3. Click **Login** or **Start Demo** → `/login`.

**Say:** *"This is the ICAI Carbon Emission Calculator PoC — a standardized sustainability reporting portal aligned with GHG Protocol scopes, built for ICAI’s multi-level organizational structure."*

---

### Phase B — CA Firm User journey (10 min)

#### B1. Login
4. On `/login`, click **CA Firm User** card (or enter `user1@icai-demo.org`, password `demo123`, role CA Firm User).
5. Redirects to **`/dashboard`** — CA Firm Dashboard.

**Say:** *"Each role sees a tailored dashboard. CA Firm users report their own organizational emissions."*

#### B2. Profile (optional, 1 min)
6. Sidebar → **Profile** (`/profile`).
7. Show pre-filled entity, region, reporting period. Click **Save Profile** if you want to show persistence.

**Say:** *"Profile and organization details are stored locally and persist after refresh — in production this would sync with ICAI member/firm master data."*

#### B3. New calculation
8. Sidebar → **New Calculation** (`/calculator`).

**Step 1 — Basic Info:** Confirm reporting period `FY 2024-25` → **Next**.

**Step 2 — Categories:** Check **Electricity Consumption** and **Air Travel** → **Next**.

**Step 3 — Activity Data:**
   - Electricity: `kWh` = **5000**
   - Air Travel: Distance **1500** km, Trips **2** (shows live CO₂e per category)
   → **Next**

**Step 4 — Documents:** Click **Upload Placeholder** on one row (saves document metadata).

**Step 5 — Review:** Verify line items and total → click **Calculate**.

**Step 6 — Results:** Show total CO₂e, Scope 1/2/3 cards.

**Say:** *"Activity quantity multiplied by the active emission factor gives CO₂e in real time. Electricity uses the CEA grid factor at 0.82 kg per kWh — Scope 2."*

#### B4. Generate reports from results
9. On results screen → **Generate PDF Report** then **Generate Excel Report** (toast confirms).
10. Sidebar → **Reports** (`/reports`) → click **eye icon** to open **Report Preview** (ICAI branding, scope summary, disclaimer).

**Say:** *"Reports are generated as persisted records with full preview. In production, these export to secured PDF/Excel with digital signatures."*

#### B5. Recommendations
11. Sidebar → **Recommendations** (`/recommendations`).
12. Show priority cards; click **Mark Implemented** on one.

**Say:** *"Recommendations are driven by highest emission categories from completed calculations."*

#### B6. History & dashboard refresh
13. Sidebar → **Calculation History** (`/history`) — show saved calculation.
14. Back to **Dashboard** — point out updated totals/charts.

#### B7. Helpdesk (30 sec)
15. Sidebar → **Helpdesk** → submit a quick query (Subject + Message) → show acknowledgement.

#### B8. Persistence proof (30 sec)
16. **Refresh browser (F5)** — still logged in, calculation and reports remain.
17. **Logout** (header avatar menu) — session clears, data remains.

---

### Phase C — Branch Office User (3 min)
18. Login as **Branch Office User** (`user6@icai-demo.org`).
19. Show **Branch Dashboard** — branch emissions, profile, charts.
20. Open **New Calculation** briefly OR show **Calculation History** with branch data.
21. **Branch Reports** — same reports module, filtered to entity.

**Say:** *"Branch offices follow the same calculation workflow but roll up to regional and head office views."*

---

### Phase D — Regional Office User (4 min)
22. Logout → login **Regional Office User** (`user11@icai-demo.org`).
23. **Regional Dashboard** (`/dashboard`):
    - Region emissions KPI
    - Branch submission status table
    - Top emitting branches chart
    - Click **Export Regional Report**
24. **Branch Analytics** (`/branch-analytics`) — search/filter paginated branches (185+ seed records).

**Say:** *"Regional officers monitor branch compliance — submitted, pending, draft, needs review — and can export consolidated regional reports."*

---

### Phase E — Head Office Admin (4 min)
25. Login **Head Office Admin** (`user16@icai-demo.org`).
26. **HO Dashboard** — All-India KPIs, region comparison, CA Firm vs Branch chart.
27. **Regional Analytics** (`/regional-analytics`) — 5 ICAI regions compared.
28. **Branch Analytics** (`/branch-analytics`) — national branch view.
29. **CA Firm Analytics** (`/ca-firm-analytics`) — 20 CA firms.
30. **MIS** (`/mis`) — submission summary → **Export MIS** (demo toast).
31. **Security** (`/security`) — RBAC, audit, encryption placeholders.

**Say:** *"Head Office gets the executive MIS layer for all-India sustainability reporting and compliance monitoring."*

---

### Phase F — System Admin (5 min)
32. Login **System Admin** (`user21@icai-demo.org`).
33. **Admin Dashboard** — system KPIs, recent audit logs, open queries.
34. **Emission Factors** (`/admin/emission-factors`):
    - Edit Grid Electricity factor (e.g. change value, add reason) → saves + creates version
35. **Factor Version History** (`/admin/factor-history`) — show old vs new value.
36. **Users** (`/admin/users`) — show user table, briefly open Add User (optional).
37. **Branches** (`/admin/branches`) — paginated 185+ branches, search works.
38. **Queries** (`/admin/queries`) — reply to a query, change status.
39. **Audit Logs** (`/admin/audit-logs`) — show login, calculation, factor edit entries.
40. **Settings** (`/admin/settings`) — mention **Export Demo Data JSON** and **Reset Demo Data** (do NOT reset during live demo unless needed).

**Say:** *"System Admin controls the emission factor library with full version history — any factor change is audited and the calculator always uses the latest active factor."*

---

## 4. User Story Board

**As a CA Firm User**, I can enter activity data through a guided wizard so that I can calculate my organization’s carbon emissions using standardized ICAI emission factors.

**As a CA Firm User**, I can save calculations and generate PDF/Excel report records so that I can document and share my GHG footprint for the reporting period.

**As a Branch Office User**, I can submit branch-level emission data and view branch dashboards so that regional and head office can monitor branch performance and submission status.

**As a Regional Office User**, I can view branch-wise consolidated emissions and submission status so that I can compare branches and export regional sustainability reports.

**As a Head Office Admin**, I can view consolidated emissions across regions, branches, and CA firms so that ICAI can prepare all-India sustainability MIS and oversight reports.

**As a System Admin**, I can manage users, entities, branches, regions, and emission factors with version history so that calculations remain configurable, traceable, and audit-ready.

**As any user**, I can submit helpdesk queries and view educational resources so that I receive guidance on reporting methodology and portal usage.

---

## 5. Module-Wise Flow

### Authentication (`/login`)
Mock login with email + password + role selector. Quick-login cards for 5 roles. Session saved to `localStorage` key `icai_carbon_session`. Logout clears session only; demo data persists. Login/logout writes audit log.

### User profile (`/profile`)
Form: name, entity, region, reporting period, membership number, contact, address. Validates required fields. Saves to user record in localStorage. Audit log on save.

### Emission data entry (`/calculator`)
6-step wizard: Basic Info → Select Categories (10 categories) → Activity Data (category-specific fields, live CO₂e) → Upload Documents (metadata placeholder) → Review → Results. **Save Draft** available at any step.

### Emission calculation (`lib/calculationEngine.ts`)
Formula: **CO₂e = activity quantity × emission factor**. Uses latest **active + isCurrent** factor per category. Scopes assigned per factor.

### Scope-wise result (Results step + Dashboard)
Totals split into Scope 1, 2, 3. Charts: category pie, scope bar, monthly trend (seed/demo trend data on dashboards).

### Recommendations (`/recommendations`)
Static seed recommendations + dynamic ones from highest categories in completed calculations. User can mark **Implemented** (persisted). Admin manages at `/admin/recommendations`.

### Dashboard analytics (`/dashboard` — role-specific)
- CA Firm: entity calculations, scope KPIs, charts, history table
- Branch: branch profile + emissions
- Regional: branch status, top branches, export
- HO: all-India consolidation
- Admin: system overview

### Historical records (`/history`)
Table of calculations for current entity. Click row → `/calculator/[id]` to view/resume.

### PDF/Excel export (`/reports` + wizard results)
Generates **persisted report records** with preview modal. Download button shows demo toast (no actual file download). Formats: PDF and Excel.

### Admin emission factor management (`/admin/emission-factors`, `/admin/factor-history`)
Edit factor → requires reason → creates version history row → calculator picks up new active factor.

### User/role management (`/admin/users`)
Add, edit, activate/deactivate, delete users. 25 seed users across roles. All changes audited.

---

## 6. Data Flow (Simple)

```
User enters activity data (kWh, km, litres, etc.)
        ↓
System selects active emission factor for category (admin-managed)
        ↓
CO₂e = quantity × factor (per line item, real-time in wizard)
        ↓
Line items aggregated → Scope 1 / 2 / 3 totals
        ↓
Calculation saved to localStorage (draft or completed)
        ↓
Dashboard charts/KPIs read from saved calculations + seed analytics
        ↓
User generates PDF/Excel report record → stored in reports table
        ↓
Audit log entry created for each significant action
```

**Storage keys:**
- `icai_carbon_app_data` — all demo entities, calculations, reports, factors, audit logs
- `icai_carbon_session` — logged-in user session

---

## 7. Presenter Notes — Exact Lines Per Screen

| Screen | What to say |
|--------|-------------|
| **Landing `/`** | "This is the ICAI Carbon Emission Calculator — a standardized GHG reporting portal for CA firms and ICAI offices across India, aligned with Scope 1, 2, and 3." |
| **Login `/login`** | "We support five role types matching ICAI’s hierarchy. For the demo, one click logs you in — in production this connects to ICAI SSO and member authentication." |
| **CA Firm Dashboard** | "The firm sees its emission footprint, reporting period status, scope breakdown, and recent calculation history at a glance." |
| **Calculator Step 1** | "The wizard guides users through standardized data collection — same methodology whether you're a CA firm or branch office." |
| **Calculator Step 3** | "Notice CO₂e updates live as data is entered. The factor shown is the current admin-approved factor for this category." |
| **Calculator Results** | "Here is the total carbon footprint with scope-wise split. From here we can generate audit-ready reports." |
| **Reports Preview** | "The report preview includes entity details, scope summary, category breakdown, recommendations summary, and a compliance disclaimer." |
| **Recommendations** | "Based on the highest emission sources, the portal suggests actionable reductions — firms can track implementation status." |
| **History** | "Every calculation is stored and can be resumed or reviewed — data persists even after browser refresh." |
| **Branch Dashboard** | "Branch offices see their own performance and how they compare to the previous reporting period." |
| **Regional Dashboard** | "Regional officers get a consolidated view of all branches — who has submitted, who is pending, and top emitters." |
| **HO Dashboard** | "Head Office sees all-India numbers — regions, branches, and CA firms on one executive dashboard." |
| **MIS** | "The MIS module supports management reporting — submission rates, open queries, and regional emission summaries." |
| **Admin Factors** | "Emission factors are centrally managed. Any change requires a reason and creates a version history record for audit." |
| **Audit Logs** | "Every login, calculation, report, and admin change is logged — this is the compliance backbone of the portal." |
| **Settings** | "Admins can export all demo data as JSON or reset to seed data. In production, this becomes backup, migration, and environment management." |

---

## 8. Pre-Meeting Demo Checklist

Run through this **30 minutes before the meeting**:

- [ ] `npm run dev` running at `http://localhost:3000` (kill duplicate if port conflict)
- [ ] Open in **Chrome/Edge incognito** OR clear localStorage if you want fresh seed data
- [ ] Landing page loads; hero title not cropped; Login/Start Demo buttons visible
- [ ] Login works for all 5 quick-login cards (`demo123`)
- [ ] CA Firm: complete one calculation (Electricity 5000 kWh minimum)
- [ ] **Calculate** button works; results screen appears
- [ ] Generate PDF + Excel from results; visible in Reports
- [ ] **F5 refresh** — session + calculation + reports still there
- [ ] Logout → login as different role — correct sidebar appears
- [ ] Regional: Branch Analytics search works; table paginates
- [ ] Admin: edit one emission factor → appears in Factor Version History
- [ ] Admin: Audit Logs shows your test actions
- [ ] No red errors in browser console (F12)
- [ ] Do **NOT** click Reset Demo Data before meeting
- [ ] Optional: close unrelated tabs; zoom browser to 100%

---

## 9. Gaps / Safe Explanations (What Is Simulated)

| Feature | Demo behavior | What to say |
|---------|---------------|-------------|
| Authentication | Mock login, no real password hashing | "Production will use ICAI SSO, MFA, and secured session management." |
| Database | localStorage only | "PoC uses browser persistence; production connects to PostgreSQL/Supabase with RLS." |
| PDF/Excel download | Report **record + preview** created; download shows toast | "Export pipeline is demonstrated; production generates secured PDF/Excel files." |
| Document upload | Metadata only, no file stored | "File upload UI is ready; production connects to encrypted object storage." |
| Email on helpdesk reply | Toast simulation | "Email/SMS notifications will integrate with ICAI communication systems." |
| HO/Regional dashboard numbers | Mix of real calculations + seed analytics | "Consolidation logic is demonstrated; production aggregates live submissions in real time." |
| Monthly trend charts | Seed trend data | "Trend lines will reflect actual submitted periods once backend is connected." |
| Import JSON (Settings) | Placeholder toast | "Data migration/import will be part of the production admin toolkit." |
| Maintenance mode | UI toggle only | "Operational controls will be enforced server-side in production." |
| Security page | UI representation | "Encryption at rest/in transit, DR, and 99.9% uptime are design targets for production." |
| ICAI branding | Placeholders | "Final branding, logos, and institutional styling will be applied per ICAI guidelines." |
| 185 branches | Seed data, paginated | "Scale is proven in UI; production syncs from ICAI branch master." |

**Closing line for meeting:**  
*"This PoC demonstrates the complete user journey, calculation methodology, role-based access, auditability, and reporting workflow. The architecture is modular — we can plug in secured backend APIs, ICAI member database, and production-grade export and SSO without redesigning the portal."*

---

## Quick Reference — Demo Logins

| Role | Email | Password |
|------|-------|----------|
| CA Firm User | user1@icai-demo.org | demo123 |
| Branch Office User | user6@icai-demo.org | demo123 |
| Regional Office User | user11@icai-demo.org | demo123 |
| Head Office Admin | user16@icai-demo.org | demo123 |
| System Admin | user21@icai-demo.org | demo123 |

## Quick Reference — Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | Authentication |
| `/dashboard` | Role-based dashboard |
| `/calculator` | New calculation wizard |
| `/history` | Calculation history |
| `/reports` | Generated reports |
| `/recommendations` | Sustainability tips |
| `/helpdesk` | Support queries |
| `/branch-analytics` | Branch comparison (Regional/HO) |
| `/regional-analytics` | Region comparison (HO) |
| `/ca-firm-analytics` | CA firm comparison (HO) |
| `/mis` | MIS reporting (HO) |
| `/admin/emission-factors` | Factor management |
| `/admin/audit-logs` | Audit trail |
| `/admin/settings` | Reset / export demo data |
