"use client";

import { EntityAdmin } from "@/components/admin/EntityAdmin";
export default function AdminRegionsPage() {
  return <EntityAdmin title="Regions" dataKey="regions" columns={[
    { key: "name", header: "Region" }, { key: "code", header: "Code" },
    { key: "location", header: "Location" }, { key: "totalBranches", header: "Branches" },
    { key: "totalEmissions", header: "Emissions" }, { key: "status", header: "Status" },
  ]} />;
}
