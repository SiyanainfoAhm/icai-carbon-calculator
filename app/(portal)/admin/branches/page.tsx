"use client";

import { EntityAdmin } from "@/components/admin/EntityAdmin";
export default function AdminBranchesPage() {
  return <EntityAdmin title="Branch Offices" dataKey="branches" columns={[
    { key: "code", header: "Code" }, { key: "name", header: "Branch" },
    { key: "regionName", header: "Region" }, { key: "location", header: "Location" },
    { key: "totalEmissions", header: "Emissions" }, { key: "submissionStatus", header: "Status" },
  ]} />;
}
