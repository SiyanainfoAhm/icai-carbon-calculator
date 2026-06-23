import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CarbonLogo } from "@/components/common/CarbonLogo";
import { DESIGN_THEMES } from "@/lib/types";
import {
  Calculator, BarChart3, Building2, FileText, FlaskConical, Lightbulb,
  MessageSquare, ScrollText, Leaf, Globe, ArrowRight, Shield,
} from "lucide-react";

const features = [
  { icon: Calculator, title: "GHG Emission Calculator", desc: "Standardized multi-step emission calculation wizard" },
  { icon: BarChart3, title: "Scope 1, 2 & 3 Reporting", desc: "Complete GHG Protocol scope classification" },
  { icon: Building2, title: "Multi-level Dashboards", desc: "Branch, Regional and Head Office analytics" },
  { icon: FileText, title: "CA Firm Reporting", desc: "Dedicated emission reporting for CA firms" },
  { icon: FlaskConical, title: "Admin Emission Factors", desc: "Version-controlled emission factor management" },
  { icon: FileText, title: "PDF/Excel Reports", desc: "Professional report generation and preview" },
  { icon: Lightbulb, title: "Sustainability Recommendations", desc: "Dynamic recommendations based on emissions" },
  { icon: MessageSquare, title: "Query & Helpdesk", desc: "Integrated support and query management" },
  { icon: ScrollText, title: "Audit Trails", desc: "Comprehensive audit logging for compliance" },
];

const hierarchy = [
  { level: "CA Firm", desc: "Individual chartered accountancy firms reporting emissions", color: "from-teal-500 to-emerald-600" },
  { level: "Branch Office", desc: "ICAI branch offices across India", color: "from-blue-500 to-cyan-600" },
  { level: "Regional Office", desc: "Five regional offices consolidating branch data", color: "from-violet-500 to-purple-600" },
  { level: "Head Office", desc: "All-India consolidated reporting and MIS", color: "from-slate-700 to-slate-900" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <CarbonLogo className="[&_p]:text-white [&_p:last-child]:text-teal-300" />
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-teal-200">
            <Shield className="h-3.5 w-3.5" /> ICAI Branding Placeholder
          </div>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-400/30 px-4 py-1.5 text-sm text-teal-200 mb-6">
            <Leaf className="h-4 w-4" /> Sustainability Reporting Portal
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
            ICAI Carbon Emission Calculator
          </h1>
          <p className="text-lg lg:text-xl text-teal-100/80 max-w-2xl mx-auto mb-8">
            A standardized GHG emission reporting and monitoring portal for Chartered Accountants and ICAI offices across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-white" asChild>
              <Link href="/login">Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/login">Start Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/login">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Sustainability Platform</h2>
          <p className="text-muted-foreground mt-2">Everything needed for institutional GHG reporting</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="rounded-lg bg-teal-50 w-fit p-2 mb-2"><f.icon className="h-6 w-6 text-teal-600" /></div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section className="py-20 px-6 bg-gradient-to-b from-teal-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">ICAI Reporting Hierarchy</h2>
            <p className="text-muted-foreground mt-2">Structured emission data flow across organizational levels</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hierarchy.map((h) => (
              <div key={h.level} className={`rounded-2xl bg-gradient-to-br ${h.color} p-6 text-white`}>
                <Globe className="h-8 w-8 mb-3 opacity-80" />
                <h3 className="text-xl font-bold">{h.level}</h3>
                <p className="text-sm text-white/80 mt-2">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Concepts */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Design Concept Options</h2>
          <p className="text-muted-foreground mt-2">Original distinctive design alternatives for ICAI presentation</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESIGN_THEMES.map((theme) => (
            <Card key={theme.id} className="overflow-hidden">
              <div className="flex h-3">{theme.colors.map((c) => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}</div>
              <CardHeader>
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: theme.colors[3] }}>
                  <p className="font-bold" style={{ color: theme.colors[0] }}>Dashboard Preview</p>
                  <p style={{ color: theme.colors[4] }}>Sample KPI card and typography</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        <CarbonLogo size="sm" className="justify-center mb-3" />
        <p>ICAI Carbon Emission Calculator — Demo Proof of Concept</p>
        <p className="mt-1">Institute of Chartered Accountants of India — Branding Placeholder</p>
      </footer>
    </div>
  );
}
