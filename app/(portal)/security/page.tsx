"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Server, Database, Activity } from "lucide-react";

const features = [
  { icon: Shield, title: "Role-Based Access Control", desc: "Five distinct user roles with granular permissions and protected routes." },
  { icon: Eye, title: "Audit Logs", desc: "Comprehensive audit trail for all user actions, logins, and data changes." },
  { icon: Lock, title: "Secure Authentication", desc: "Session-based authentication with persistent secure login (production: OAuth/SAML)." },
  { icon: Database, title: "Data Encryption", desc: "Encryption at rest and in transit for all emission data and reports (placeholder)." },
  { icon: Server, title: "Backup & DR", desc: "Automated backup and disaster recovery with 99.9% uptime target." },
  { icon: Activity, title: "Performance Monitoring", desc: "Real-time performance monitoring and health checks (placeholder)." },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Security & Compliance</h1>
        <p className="text-muted-foreground">Security features and compliance representation</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-teal-100 text-teal-800">RBAC Enabled</Badge>
        <Badge className="bg-blue-100 text-blue-800">Audit Logging</Badge>
        <Badge className="bg-emerald-100 text-emerald-800">99.9% Uptime Target</Badge>
        <Badge className="bg-violet-100 text-violet-800">Data Encryption</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <f.icon className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-base">{f.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{f.desc}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
