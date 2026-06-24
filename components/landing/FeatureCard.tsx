import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group h-full border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-200 landing-feature-card">
      <CardHeader className="h-full">
        <div className="rounded-lg bg-teal-50 w-fit p-2.5 mb-3 transition-colors group-hover:bg-teal-100">
          <Icon className="h-6 w-6 text-teal-600" aria-hidden />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
