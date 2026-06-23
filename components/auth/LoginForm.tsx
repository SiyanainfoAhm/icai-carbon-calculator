"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { DEMO_USERS } from "@/lib/mockData";
import { ROLE_LABELS, type UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarbonLogo } from "@/components/common/CarbonLogo";
import { toast } from "sonner";
import { Building2, MapPin, Globe, Shield, Briefcase } from "lucide-react";

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  ca_firm: Briefcase,
  branch_office: Building2,
  regional_office: MapPin,
  head_office: Globe,
  system_admin: Shield,
};

export function LoginForm() {
  const login = useAppStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [role, setRole] = useState<UserRole>("ca_firm");

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    const success = login(email, password, role);
    if (success) {
      toast.success("Login successful");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials. Use demo login cards or demo123 password.");
    }
  };

  const quickLogin = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setRole(demoRole);
    const success = login(demoEmail, "demo123", demoRole);
    if (success) {
      toast.success(`Logged in as ${ROLE_LABELS[demoRole]}`);
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center">
        <CarbonLogo size="lg" className="justify-center mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">Sign in to the ICAI Carbon Emission Calculator</p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter credentials or use quick demo login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@icai-demo.org" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Demo Login</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_USERS.map((demo) => {
          const Icon = roleIcons[demo.role];
          return (
            <button
              key={demo.role}
              onClick={() => quickLogin(demo.role, demo.email)}
              className="flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
            >
              <div className="rounded-lg bg-teal-50 p-2">
                <Icon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">{demo.label}</p>
                <p className="text-xs text-muted-foreground">{demo.email}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
