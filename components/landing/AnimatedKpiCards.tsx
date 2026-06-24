"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KPIS = [
  { label: "Scope 1", value: 12.4, unit: "tCO₂e", color: "border-blue-400/40 bg-blue-500/10", delay: "0s" },
  { label: "Scope 2", value: 28.7, unit: "tCO₂e", color: "border-purple-400/40 bg-purple-500/10", delay: "0.15s" },
  { label: "Scope 3", value: 46.2, unit: "tCO₂e", color: "border-amber-400/40 bg-amber-500/10", delay: "0.3s" },
  { label: "Total CO₂e", value: 87.3, unit: "tCO₂e", color: "border-teal-400/40 bg-teal-500/15", delay: "0.45s", highlight: true },
];

function useCountUp(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target * 10) / 10);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}

function KpiCard({ label, value, unit, color, delay, highlight }: (typeof KPIS)[0]) {
  const display = useCountUp(value);

  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur-sm px-4 py-3 shadow-lg landing-kpi-float landing-fade-in",
        color,
        highlight && "ring-1 ring-teal-400/30"
      )}
      style={{ animationDelay: delay }}
    >
      <p className="text-[11px] uppercase tracking-wider text-teal-200/80 font-medium">{label}</p>
      <p className={cn("text-lg sm:text-xl font-bold text-white tabular-nums", highlight && "text-teal-300")}>
        {display.toFixed(1)} <span className="text-xs font-normal text-teal-200/70">{unit}</span>
      </p>
    </div>
  );
}

export function AnimatedKpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}
