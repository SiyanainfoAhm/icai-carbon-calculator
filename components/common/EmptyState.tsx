import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="rounded-full bg-teal-50 p-4 mb-4">
        {icon ?? <Leaf className="h-8 w-8 text-teal-500" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
