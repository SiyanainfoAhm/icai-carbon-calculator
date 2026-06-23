"use client";

import { EntityAdmin } from "@/components/admin/EntityAdmin";
export default function AdminEntitiesPage() {
  return <EntityAdmin title="Entities" dataKey="entities" columns={[
    { key: "name", header: "Name" }, { key: "entityType", header: "Type" },
    { key: "regionName", header: "Region" }, { key: "location", header: "Location" },
    { key: "status", header: "Status" }, { key: "submissionStatus", header: "Submission" },
  ]} />;
}
