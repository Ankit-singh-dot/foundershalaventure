"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, TrendingUp, Building2, PieChart } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-200 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              FOUNDERSHALA VENTURES • INSTITUTIONAL SELL-SIDE IB
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Unlocking Capital. <br />
              <span className="text-slate-700">Realizing Potential.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Forward-thinking investment banking and advisory designed for ambitious founders. Value your business with Groq AI, structure your 5 pitch deliverables, and raise capital at peak valuation.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#valuation-calculator"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all"
              >
                Calculate AI Valuation Engine <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#deal-vault"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <PieChart className="h-4 w-4 text-slate-600" /> Prepare Deal Vault (5 Deliverables)
              </a>
            </div>

            {/* Key Statistics Bar */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-900">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,500+</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Advisors & CA Experts</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">300+</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Founder Ecosystem</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">50+</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Partner VCs & Funds</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">100%</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">Founder Commitment</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Generated Corporate Office Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl">
              <Image
                src="/images/ib_hero_office.jpg"
                alt="Foundershala Investment Banking Boardroom"
                width={700}
                height={500}
                className="w-full h-[420px] object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Foundershala Deal Advisory Room</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase font-semibold">Active Pipeline</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Advising founders on M&A, equity research, financial modeling, and VC transactions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
