"use client";

import Link from "next/link";
import { CarbonLogo } from "@/components/common/CarbonLogo";
import { HeroCarousel } from "./HeroCarousel";
import { AnimatedKpiCards } from "./AnimatedKpiCards";
import { ArrowRight, Leaf, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-900/40 hover:from-teal-400 hover:to-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white border-2 border-teal-400/80 bg-teal-500/10 hover:bg-teal-500 hover:border-teal-400 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

export function LandingHero() {
  return (
    <header className="relative text-white">
      {/* Background layers — clipped separately so text never crops */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
        <div className="absolute inset-0 landing-grid-pattern opacity-40" />
        <div className="landing-blob landing-blob-1 absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="landing-blob landing-blob-2 absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="landing-blob landing-blob-3 absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="landing-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-teal-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Nav */}
        <nav className="flex items-center justify-between py-5">
          <CarbonLogo className="[&_p]:text-white [&_p:last-child]:text-teal-300 shrink-0" />
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-teal-200 border border-white/10">
            <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>ICAI Branding Placeholder</span>
          </div>
        </nav>

        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center pb-16 sm:pb-20 lg:pb-28 pt-4 sm:pt-8">
          {/* Left column */}
          <div className="min-w-0 text-left landing-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-400/30 px-4 py-1.5 text-sm text-teal-200 mb-6">
              <Leaf className="h-4 w-4 shrink-0" aria-hidden />
              <span>Sustainability Reporting Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold leading-[1.15] tracking-tight text-white break-words">
              ICAI Carbon Emission Calculator
            </h1>

            <p className="mt-5 text-base sm:text-lg text-teal-100/85 leading-relaxed max-w-xl">
              A standardized GHG emission reporting and monitoring portal for Chartered Accountants and ICAI offices across India.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link href="/login" className={cn(primaryBtn)}>
                Login
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/login" className={cn(secondaryBtn)}>
                Start Demo
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="min-w-0 flex flex-col gap-5 landing-fade-in landing-fade-in-delay">
            <HeroCarousel />
            <AnimatedKpiCards />
          </div>
        </div>
      </div>
    </header>
  );
}
