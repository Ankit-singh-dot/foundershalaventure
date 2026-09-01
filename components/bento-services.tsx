"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Building,
  ShieldCheck,
  Briefcase,
  PieChart,
  Award,
  ArrowUpRight,
} from "lucide-react";

export default function BentoServices() {
  const services = [
    {
      title: "Mergers & Acquisitions (M&A)",
      category: "M&A Advisory",
      description:
        "Comprehensive solutions across the M&A lifecycle: opportunity identification, tax advisory, valuation, due diligence, deal execution, and post-deal integration.",
      icon: TrendingUp,
    },
    {
      title: "Registration & Incorporation",
      category: "Corporate Setup",
      description:
        "End-to-end compliance support: COI filing, PAN & TAN, GST, MOA & AOA drafting, Director DINs, MSME, and DPIIT Startup Recognition.",
      icon: Building,
    },
    {
      title: "Investment Banking",
      category: "Equity Capital",
      description:
        "Helping promising startups raise capital with clarity, confidence, and institutional strategic support across seed to Series B rounds.",
      icon: Briefcase,
    },
    {
      title: "Audit & Taxation Advisory",
      category: "Tax & Compliance",
      description:
        "Specialized corporate tax advisory for domestic & cross-border transactions, minimizing liabilities and ensuring zero-litigation compliance.",
      icon: ShieldCheck,
    },
    {
      title: "IPO Services",
      category: "Public Listing",
      description:
        "Comprehensive planning and execution for SME & Mainboard IPOs, meeting ROC compliance and showcasing maximum shareholder value.",
      icon: Award,
    },
    {
      title: "Valuation Advisory",
      category: "Financial Modeling",
      description:
        "Valuing startups across ideation, traction, and pre-exit stages using sector research, DCF models, and globally-accepted frameworks.",
      icon: PieChart,
    },
  ];

  return (
    <section id="expertise" className="relative py-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            OUR CORE EXPERTISE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Precision in Finance. Excellence in Execution.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Modern investment banking and corporate finance strategies designed to maximize shareholder value.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-white p-2.5 text-slate-900 border border-slate-200 shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                </div>

                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                  <span>Advisory Breakdown</span> <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
