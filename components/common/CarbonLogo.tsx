import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function CarbonLogo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20", sizes[size])}>
        <Leaf className="h-1/2 w-1/2 text-white" />
        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
      </div>
      {showText && (
        <div>
          <p className={cn("font-bold text-slate-900 leading-tight", textSizes[size])}>ICAI</p>
          <p className="text-[10px] font-medium text-primary tracking-wide uppercase">Carbon Calculator</p>
        </div>
      )}
    </div>
  );
}
