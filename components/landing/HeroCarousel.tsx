"use client";

import { useCallback, useEffect, useState } from "react";
import { Calculator, Building2, FileText, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: Calculator,
    title: "GHG Emission Calculator",
    description: "Calculate Scope 1, 2 and 3 emissions using standardized factors.",
    accent: "from-teal-500/20 to-emerald-500/10",
  },
  {
    icon: Building2,
    title: "ICAI Multi-level Reporting",
    description: "CA Firm, Branch, Regional Office and Head Office dashboards.",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    icon: FileText,
    title: "Audit-ready Reports",
    description: "Generate PDF/Excel reports with calculation traceability.",
    accent: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Lightbulb,
    title: "Sustainability Recommendations",
    description: "Get intelligent recommendations based on emission trends.",
    accent: "from-amber-500/20 to-orange-500/10",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[280px] sm:min-h-[300px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden">
        {SLIDES.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === active;
          return (
            <div
              key={slide.title}
              role="tabpanel"
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 flex flex-col justify-center p-6 sm:p-8 transition-all duration-700 ease-in-out landing-carousel-slide",
                isActive ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-6 z-0 pointer-events-none"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", slide.accent)} />
              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
                  <Icon className="h-7 w-7 text-teal-300" aria-hidden />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{slide.title}</h3>
                <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-md">
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 landing-progress-bar"
            style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Hero showcase slides">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Go to slide: ${slide.title}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
              index === active ? "w-8 bg-teal-400" : "w-2.5 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
