"use client";

import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { EntityType, UserProfile } from "@/lib/types";
import { useState, useEffect } from "react";

export function ProfileForm() {
  const session = useAppStore((s) => s.session);
  const data = useAppStore((s) => s.data);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const user = data.users.find((u) => u.id === session?.userId);
  const [profile, setProfile] = useState<UserProfile>({
    name: "", entityName: "", entityType: "CA Firm", location: "", region: "",
    reportingPeriod: "FY 2024-25", membershipNumber: "", contactEmail: "", mobileNumber: "", address: "",
  });

  useEffect(() => {
    if (user?.profile) setProfile(user.profile);
    else if (session) {
      setProfile((p) => ({
        ...p, name: session.name, entityName: session.entityName, region: session.regionName,
        contactEmail: session.email,
      }));
    }
  }, [user, session]);

  const handleSave = () => {
    const required = ["name", "entityName", "location", "region", "contactEmail", "mobileNumber", "address"] as const;
    for (const field of required) {
      if (!profile[field]?.trim()) { toast.error(`${field} is required`); return; }
    }
    if (!session) return;
    updateProfile(session.userId, profile);
    toast.success("Profile saved successfully");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground">Basic information and reporting details</p></div>
      <Card>
        <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {([
            ["name", "Name"], ["entityName", "Entity Name"], ["location", "Location"],
            ["region", "Region"], ["reportingPeriod", "Reporting Period"],
            ["membershipNumber", "Membership / FRN"], ["contactEmail", "Contact Email"],
            ["mobileNumber", "Mobile Number"], ["gstPan", "GST/PAN (optional)"],
          ] as const).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input value={profile[key] ?? ""} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} />
            </div>
          ))}
          <div className="space-y-1">
            <Label>Entity Type</Label>
            <Select value={profile.entityType} onValueChange={(v) => setProfile({ ...profile, entityType: v as EntityType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["CA Firm", "Branch Office", "Regional Office", "Head Office"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          </div>
          <Button className="bg-primary" onClick={handleSave}>Save Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
