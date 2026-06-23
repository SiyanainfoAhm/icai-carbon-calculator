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

export function Sidebar() {
  const pathname = usePathname();
  const session = useAppStore((s) => s.session);
  if (!session) return null;

  const navItems = getNavItemsForRole(session.role);
  const allHrefs = navItems.map((i) => i.href);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0">
      <div className="p-5 border-b border-white/10 shrink-0">
        <CarbonLogo size="sm" className="[&_p]:text-white [&_p:last-child]:text-teal-300" />
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 shrink-0">
        <p className="text-xs text-slate-400">ICAI Sustainability Portal</p>
        <p className="text-xs text-slate-500 mt-1">Demo PoC v1.0</p>
      </div>
    </aside>
  );
}
