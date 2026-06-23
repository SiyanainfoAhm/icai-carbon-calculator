"use client";

import { EntityAdmin } from "@/components/admin/EntityAdmin";
export default function AdminCAFirmsPage() {
  return <EntityAdmin title="CA Firms" dataKey="caFirms" columns={[
    { key: "name", header: "Firm" }, { key: "registrationNumber", header: "FRN" },
    { key: "regionName", header: "Region" }, { key: "location", header: "Location" },
    { key: "totalEmissions", header: "Emissions" }, { key: "submissionStatus", header: "Status" },
  ]} />;
}
