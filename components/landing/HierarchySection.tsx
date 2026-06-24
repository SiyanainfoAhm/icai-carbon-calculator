import { Globe, ArrowRight } from "lucide-react";

const hierarchy = [
  { level: "CA Firm", desc: "Individual chartered accountancy firms reporting emissions", color: "from-teal-500 to-emerald-600" },
  { level: "Branch Office", desc: "ICAI branch offices across India", color: "from-blue-500 to-cyan-600" },
  { level: "Regional Office", desc: "Five regional offices consolidating branch data", color: "from-violet-500 to-purple-600" },
  { level: "Head Office", desc: "All-India consolidated reporting and MIS", color: "from-slate-700 to-slate-900" },
];

export function HierarchySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10 xl:px-16 bg-gradient-to-b from-teal-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 landing-section-heading">
          <h2 className="text-3xl font-bold text-slate-900">ICAI Reporting Hierarchy</h2>
          <p className="text-muted-foreground mt-2">Structured emission data flow across organizational levels</p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-2">
          {hierarchy.map((h, index) => (
            <div key={h.level} className="flex flex-col lg:flex-row items-center flex-1 min-w-0 gap-4 lg:gap-2">
              <div
                className={`w-full rounded-2xl bg-gradient-to-br ${h.color} p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 landing-hierarchy-card`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Globe className="h-8 w-8 mb-3 opacity-80" aria-hidden />
                <h3 className="text-xl font-bold">{h.level}</h3>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{h.desc}</p>
              </div>
              {index < hierarchy.length - 1 && (
                <ArrowRight
                  className="h-6 w-6 text-teal-500 shrink-0 rotate-90 lg:rotate-0 landing-flow-arrow"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
