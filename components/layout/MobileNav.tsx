"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavItemsForRole, isNavItemActive } from "@/lib/navigation";
import { useAppStore } from "@/store/useAppStore";
import { CarbonLogo } from "@/components/common/CarbonLogo";
import {
  LayoutDashboard, Calculator, History, FileText, Lightbulb, HelpCircle, User,
  Building2, Map, Briefcase, BarChart3, Shield, Users, Building, FlaskConical,
  GitBranch, MessageSquare, ScrollText, Palette, Settings, BookOpen,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calculator, History, FileText, Lightbulb, HelpCircle, User,
  Building2, Map, Briefcase, BarChart3, Shield, Users, Building, FlaskConical,
  GitBranch, MessageSquare, ScrollText, Palette, Settings, BookOpen,
};

export function MobileNav() {
  const pathname = usePathname();
  const session = useAppStore((s) => s.session);
  if (!session) return null;
  const navItems = getNavItemsForRole(session.role);
  const allHrefs = navItems.map((i) => i.href);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-5 border-b border-white/10">
        <CarbonLogo size="sm" className="[&_p]:text-white [&_p:last-child]:text-theme-light" />
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const isActive = isNavItemActive(pathname, item.href, allHrefs);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-slate-300 hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
