import { CarbonLogo } from "@/components/common/CarbonLogo";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { HierarchySection } from "@/components/landing/HierarchySection";
import { DesignConceptsSection } from "@/components/landing/DesignConceptsSection";
import {
  Calculator, BarChart3, Building2, FileText, FlaskConical, Lightbulb,
  MessageSquare, ScrollText,
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

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingHero />

      <section className="py-20 px-4 sm:px-6 lg:px-10 xl:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12 landing-section-heading">
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Sustainability Platform</h2>
          <p className="text-muted-foreground mt-2">Everything needed for institutional GHG reporting</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} />
          ))}
        </div>
      </section>

      <HierarchySection />

      <DesignConceptsSection />

      <footer className="border-t py-10 px-4 sm:px-6 text-center text-sm text-muted-foreground">
        <CarbonLogo size="sm" className="justify-center mb-3" />
        <p>ICAI Carbon Emission Calculator — Demo Proof of Concept</p>
        <p className="mt-1">Institute of Chartered Accountants of India — Branding Placeholder</p>
      </footer>
    </div>
  );
}
