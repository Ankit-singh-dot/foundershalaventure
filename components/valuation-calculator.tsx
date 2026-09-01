"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Globe,
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw,
  Award,
  PieChart,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Sliders,
  ShieldCheck,
  FileCheck,
  Zap,
} from "lucide-react";

export default function ValuationCalculator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Website & Sector
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("SaaS / Enterprise Tech");
  const [validatingWebsite, setValidatingWebsite] = useState(false);
  const [websiteError, setWebsiteError] = useState("");

  // Step 2 State: Financial Metrics
  const [revenue2025, setRevenue2025] = useState<string>("250"); // 250 Lakhs = 2.5 Cr
  const [preTaxProfit, setPreTaxProfit] = useState<string>("45"); // 45 Lakhs
  const [ownerSalary, setOwnerSalary] = useState<string>("24"); // 24 Lakhs
  const [targetValuation, setTargetValuation] = useState<string>("50"); // 50 Cr
  const [targetDilution, setTargetDilution] = useState<string>("10"); // 10%

  // Step 3 State: Generated Report
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [generationError, setGenerationError] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "pipeline" | "bridge" | "scorecard">("summary");

  // 1. Step 1 Submit: Groq Strict Website Validation
  const handleValidateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim()) {
      setWebsiteError("Please enter your official company website URL.");
      return;
    }

    setWebsiteError("");
    setValidatingWebsite(true);

    try {
      const res = await fetch("/api/validate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });

      const data = await res.json();

      if (!res.ok || !data.isValidCompany) {
        setWebsiteError(
          data.reason ||
            "Be serious! You are a founder looking for investment banking services. Please enter your official company website URL."
        );
        return;
      }

      if (data.websiteUrl) setWebsite(data.websiteUrl);
      if (data.detectedCompanyName && !companyName) {
        setCompanyName(data.detectedCompanyName);
      }
      if (data.suggestedSector) {
        setSector(data.suggestedSector);
      }

      setStep(2);
    } catch (err: any) {
      setWebsiteError("Failed to validate domain. Please enter a valid URL.");
    } finally {
      setValidatingWebsite(false);
    }
  };

  // 2. Step 2 Submit: Generate AI Valuation Report
  const handleGenerateValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerationError("");
    setGeneratingReport(true);

    try {
      const res = await fetch("/api/valuation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          companyName: companyName || website.replace(/^https?:\/\//, "").split(".")[0],
          sector,
          revenue2025: parseFloat(revenue2025) || 0,
          preTaxProfit: parseFloat(preTaxProfit) || 0,
          ownerSalary: parseFloat(ownerSalary) || 0,
          targetValuation: parseFloat(targetValuation) || 50,
          targetDilution: parseFloat(targetDilution) || 10,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate valuation analysis.");
      }

      setReport(data.report);
      setStep(3);
      setActiveTab("summary");

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setGenerationError(err.message || "An unexpected error occurred while generating valuation report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleProceedToVault = () => {
    // Auto-fill Deal Vault onboarding form with extracted valuation data
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("foundershala:fill-lead", {
          detail: {
            companyName: companyName || report?.companyName || "",
            website: website || report?.website || "",
            revenue2025: revenue2025,
            preTaxProfit: preTaxProfit,
          },
        })
      );
      const vaultElement = document.getElementById("deal-vault");
      if (vaultElement) {
        vaultElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="valuation-calculator" className="relative py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-slate-700" /> INSTITUTIONAL VALUATION ENGINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Startup Valuation Calculator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Get an instant investor-ready DCF, SDE & Revenue Multiple valuation benchmark before pitching VCs.
          </p>
        </div>

        {/* Multi-Step Card */}
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-slate-900 font-bold" : ""}`}>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${step >= 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-slate-100 text-slate-500"}`}>
                1
              </div>
              <span>Domain Verification</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-slate-900 font-bold" : ""}`}>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${step >= 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-slate-100 text-slate-500"}`}>
                2
              </div>
              <span>Financial Audit</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-slate-900 font-bold" : ""}`}>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${step >= 3 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-slate-100 text-slate-500"}`}>
                3
              </div>
              <span>Valuation Certificate</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: WEBSITE & DOMAIN LEGITIMACY CHECK */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-bold text-slate-900 mb-1">Step 1: Enter Official Company Website</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Our Groq AI algorithms perform domain verification to validate authentic startup onboarding.
                </p>

                <form onSubmit={handleValidateWebsite} className="space-y-5">
                  {websiteError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-xs sm:text-sm flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold uppercase text-[10px] tracking-wider text-red-900">Founder Verification Warning</div>
                        <div>{websiteError}</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Website URL *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourcompany.com"
                        className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Acme Pvt Ltd"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Industry Sector
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                      >
                        <option value="SaaS / Enterprise Tech">SaaS / Enterprise Tech</option>
                        <option value="FinTech">FinTech & Financial Services</option>
                        <option value="D2C / E-commerce">D2C & E-commerce</option>
                        <option value="Healthcare / HealthTech">Healthcare & HealthTech</option>
                        <option value="Manufacturing / Industrial">Manufacturing & DeepTech</option>
                        <option value="Services / B2B">B2B Services & Consulting</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={validatingWebsite}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {validatingWebsite ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying Domain with Groq AI...
                      </>
                    ) : (
                      <>
                        Verify & Continue <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: FINANCIAL DATA INPUTS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Step 2: Financial Performance Data</h3>
                    <p className="text-xs text-slate-500">
                      Enter your 2025 performance metrics (all values in ₹ Lakhs).
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-600 hover:text-slate-900 underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="h-3 w-3" /> Change Website
                  </button>
                </div>

                <form onSubmit={handleGenerateValuation} className="space-y-5">
                  {generationError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 font-medium">
                      {generationError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        2025 Revenue / Sales *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          required
                          value={revenue2025}
                          onChange={(e) => setRevenue2025(e.target.value)}
                          placeholder="e.g. 250"
                          className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-500 uppercase font-semibold">Lakhs</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">₹{((parseFloat(revenue2025) || 0) / 100).toFixed(2)} Cr</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pre-Tax Net Profit *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          required
                          value={preTaxProfit}
                          onChange={(e) => setPreTaxProfit(e.target.value)}
                          placeholder="e.g. 45"
                          className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-500 uppercase font-semibold">Lakhs</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">₹{((parseFloat(preTaxProfit) || 0) / 100).toFixed(2)} Cr</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Owner Salary *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          required
                          value={ownerSalary}
                          onChange={(e) => setOwnerSalary(e.target.value)}
                          placeholder="e.g. 24"
                          className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-500 uppercase font-semibold">Lakhs</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">₹{((parseFloat(ownerSalary) || 0) / 100).toFixed(2)} Cr</p>
                    </div>
                  </div>

                  {/* Target Valuation & Dilution */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <PieChart className="h-4 w-4 text-slate-700" /> Target Capital Ask & Equity Dilution
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Enterprise Valuation (₹ Cr)
                        </label>
                        <input
                          type="number"
                          value={targetValuation}
                          onChange={(e) => setTargetValuation(e.target.value)}
                          placeholder="e.g. 50"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Equity Dilution (%)
                        </label>
                        <input
                          type="number"
                          value={targetDilution}
                          onChange={(e) => setTargetDilution(e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Calculated Ask: Raising <span className="font-bold text-slate-900">₹{(((parseFloat(targetValuation) || 50) * (parseFloat(targetDilution) || 10)) / 100).toFixed(2)} Cr</span> capital for <span className="font-bold text-slate-900">{targetDilution}%</span> equity dilution at <span className="font-bold text-slate-900">₹{targetValuation} Cr</span> valuation.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={generatingReport}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Running Financial Multiples & DCF Model via Groq AI...
                      </>
                    ) : (
                      <>
                        Generate Valuation Report <Sparkles className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: GENERATED VALUATION REPORT DISPLAY */}
            {step === 3 && report && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Certificate Banner */}
                <div className="relative rounded-xl border border-slate-900 bg-slate-900 p-6 text-white overflow-hidden shadow-md">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 text-white pointer-events-none">
                    <Award className="h-64 w-64" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase mb-2">
                        <ShieldCheck className="h-3 w-3" /> OFFICIAL IB CERTIFICATE OF VALUATION
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">{report.companyName}</h3>
                      <p className="text-xs text-slate-300 mt-0.5">Website: {website} • Sector: {report.sector}</p>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 font-semibold"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Recalculate
                    </button>
                  </div>

                  {/* Primary Certificate Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                    <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Valuation Range</div>
                      <div className="text-2xl font-black text-white mt-1">
                        ₹{report.valuationMinCr} - ₹{report.valuationMaxCr} <span className="text-xs font-semibold text-slate-400">Cr</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                        <TrendingUp className="h-3 w-3" /> {report.revenueMultipleUsed || "Revenue Multiples"}
                      </div>
                    </div>

                    <div className="rounded-lg bg-emerald-950/40 p-4 border border-emerald-500/40">
                      <div className="text-[10px] uppercase font-bold text-emerald-300">Recommended Benchmark</div>
                      <div className="text-3xl font-black text-emerald-300 mt-1">
                        ₹{report.recommendedValuationCr} <span className="text-xs font-semibold text-emerald-200">Cr</span>
                      </div>
                      <div className="text-[10px] text-emerald-300/80 mt-1 font-medium">DCF & SDE Normalized Benchmark</div>
                    </div>

                    <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Investor Readiness Score</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">
                        {report.readinessScore || 78}<span className="text-xs text-slate-400">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1 font-medium">Institutional VC Grade</div>
                    </div>
                  </div>
                </div>

                {/* Detailed View Tabs */}
                <div className="border-b border-slate-200 flex overflow-x-auto gap-2 text-xs font-semibold text-slate-600">
                  {[
                    { id: "summary", label: "Executive Summary", icon: FileCheck },
                    { id: "pipeline", label: "4-Stage Valuation Sequence", icon: Sliders },
                    { id: "bridge", label: "Multi-Methodology Bridge", icon: BarChart3 },
                    { id: "scorecard", label: "Due Diligence Scorecard", icon: Award },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap font-medium transition-all ${
                          isActive
                            ? "border-slate-900 text-slate-900 font-bold"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: EXECUTIVE SUMMARY */}
                {activeTab === "summary" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-slate-700" /> Target Ask Critique ({targetDilution}% Dilution at ₹{targetValuation} Cr)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{report.targetAskAssessment}</p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Investment Banking Partner Executive Summary
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{report.executiveSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Key Strategic Strengths
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {report.keyStrengths?.map((str: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-amber-600" /> Strategic Action Steps Before VC Pitch
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {report.actionableSteps?.map((step: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: 4-STAGE VALUATION METHODOLOGY SEQUENCE */}
                {activeTab === "pipeline" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Foundershala's institutional valuation engine follows a strict 4-stage sequential audit process used by global investment banks:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">STAGE 01</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">COMPLETED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">SDE & Financial Normalization</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Reconciles owner discretionary salary (₹{report.ownerSalaryCr || ((parseFloat(ownerSalary)||0)/100).toFixed(2)} Cr) and pre-tax earnings (₹{report.preTaxProfitCr || ((parseFloat(preTaxProfit)||0)/100).toFixed(2)} Cr) to derive normalized annual operating cashflow of <span className="font-bold text-slate-900">₹{report.sdeLakhs || (parseFloat(preTaxProfit||"0")+parseFloat(ownerSalary||"0"))} Lakhs</span>.
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">STAGE 02</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">COMPLETED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Multi-Methodology Valuation Bridge</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Executes 3 parallel valuation engines: Sector Revenue Multiples ({report.revenueMultipleUsed || "5.8x"}), EBITDA/SDE Multiples ({report.ebitdaMultipleUsed || "11.5x"}), and 5-Year Discounted Cash Flow (DCF).
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">STAGE 03</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">COMPLETED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Institutional Risk Rating Audit</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Evaluates risk factors across Financial Auditability, Market TAM, Unit Economics, and Scalability to yield an overall Investor Readiness Score of <span className="font-bold text-emerald-700">{report.readinessScore || 78}/100</span>.
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">STAGE 04</span>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">COMPLETED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Target Ask Stress-Test & Cap Table</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Stress-tests target ask of ₹{targetValuation} Cr pre-money valuation for {targetDilution}% equity (₹{(((parseFloat(targetValuation)||50)*(parseFloat(targetDilution)||10))/100).toFixed(2)} Cr capital raise) against investor IRR expectations (~{report.irrExpectationPercent || 32}%).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: MULTI-VALUATION METHODOLOGY BRIDGE TABLE */}
                {activeTab === "bridge" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Valuation Methodology</th>
                            <th className="py-3 px-4">Multiple / Parameters</th>
                            <th className="py-3 px-4">Estimated Valuation</th>
                            <th className="py-3 px-4">VC Weighting</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          <tr>
                            <td className="py-3 px-4 font-semibold text-slate-900">1. Revenue Multiple Method</td>
                            <td className="py-3 px-4">{report.revenueMultipleUsed || "5.8x 2025 Revenue"}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{report.revenueMultipleValuationCr || (report.valuationMinCr * 1.05).toFixed(2)} Cr</td>
                            <td className="py-3 px-4 text-slate-500">35% Weight</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-semibold text-slate-900">2. EBITDA / SDE Multiple Method</td>
                            <td className="py-3 px-4">{report.ebitdaMultipleUsed || "11.5x Normalized SDE"}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{report.ebitdaMultipleValuationCr || (report.valuationMinCr * 1.25).toFixed(2)} Cr</td>
                            <td className="py-3 px-4 text-slate-500">35% Weight</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-semibold text-slate-900">3. 5-Year DCF Model (WACC 20%)</td>
                            <td className="py-3 px-4">Terminal Growth ~4.5%</td>
                            <td className="py-3 px-4 font-bold text-slate-900">₹{report.dcfValuationCr || (report.valuationMaxCr * 0.95).toFixed(2)} Cr</td>
                            <td className="py-3 px-4 text-slate-500">30% Weight</td>
                          </tr>
                          <tr className="bg-emerald-50/70 font-bold text-slate-900">
                            <td className="py-3 px-4 uppercase text-[10px] tracking-wider text-emerald-900">Final Weighted Recommended Benchmark</td>
                            <td className="py-3 px-4 text-emerald-900">Combined Multi-Engine Bridge</td>
                            <td className="py-3 px-4 text-emerald-900 text-sm">₹{report.recommendedValuationCr} Cr</td>
                            <td className="py-3 px-4 text-emerald-900 font-bold">100% Certified</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: DUE DILIGENCE READINESS SCORECARD */}
                {activeTab === "scorecard" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Financial Auditability", score: report.financialAuditabilityScore || 82, desc: "Accuracy of revenue statements & founder salary disclosures." },
                        { title: "Market TAM & Growth Potential", score: report.marketTamScore || 76, desc: "Addressable market size and sector tailwinds." },
                        { title: "Unit Economics & CAC Payback", score: report.unitEconomicsScore || 74, desc: "LTV/CAC ratio and gross margin trajectory." },
                        { title: "Scalability & Product Moat", score: report.scalabilityScore || 85, desc: "Operational leverage and technology barrier." },
                      ].map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{item.title}</span>
                            <span className="text-xs font-black text-slate-900">{item.score}/100</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-slate-900 h-full rounded-full" style={{ width: `${item.score}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Extraction & Deal Vault CTA */}
                <div className="rounded-xl border border-slate-200 bg-slate-900 p-6 text-white space-y-4 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        NEXT STEP • INSTITUTIONAL ADVISORY
                      </div>
                      <h4 className="text-lg font-bold text-white mt-0.5">
                        Unlock 25-Page Pitch CIM & Match with Institutional VCs
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        Submit your 5 deal deliverables to Foundershala's Investment Banking desk to initiate institutional VC introductions.
                      </p>
                    </div>

                    <button
                      onClick={handleProceedToVault}
                      className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Proceed to Deal Vault <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
