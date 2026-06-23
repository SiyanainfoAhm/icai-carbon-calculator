import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  inactive: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  Submitted: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Draft: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  "Needs Review": "bg-orange-100 text-orange-800 hover:bg-orange-100",
  Open: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "In Progress": "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Resolved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Closed: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  High: "bg-red-100 text-red-800 hover:bg-red-100",
  Medium: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  New: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  Implemented: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  Generated: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  draft: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  PDF: "bg-red-100 text-red-800 hover:bg-red-100",
  Excel: "bg-green-100 text-green-800 hover:bg-green-100",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="secondary" className={cn(statusColors[status] ?? "bg-slate-100", className)}>
      {status}
    </Badge>
  );
}
