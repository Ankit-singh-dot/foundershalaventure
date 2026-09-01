"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Video,
  Calculator,
  PieChart,
  Upload,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Loader2,
  Lock,
} from "lucide-react";
import ExpertModal from "./expert-modal";

export default function DealVaultSection() {
  const [founderName, setFounderName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [revenue2025, setRevenue2025] = useState("");
  const [preTaxProfit, setPreTaxProfit] = useState("");

  useEffect(() => {
    const handleFillLead = (e: CustomEvent) => {
      if (e.detail) {
        if (e.detail.companyName) setCompanyName(e.detail.companyName);
        if (e.detail.website) setWebsite(e.detail.website);
        if (e.detail.revenue2025) setRevenue2025(String(e.detail.revenue2025));
        if (e.detail.preTaxProfit) setPreTaxProfit(String(e.detail.preTaxProfit));
      }
    };
    window.addEventListener("foundershala:fill-lead", handleFillLead as EventListener);
    return () => {
      window.removeEventListener("foundershala:fill-lead", handleFillLead as EventListener);
    };
  }, []);

  // 5 Investment Deliverables
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [infoMemoFile, setInfoMemoFile] = useState<File | null>(null);
  const [financialModelFile, setFinancialModelFile] = useState<File | null>(null);
  const [valuationReportFile, setValuationReportFile] = useState<File | null>(null);
  const [videoPitchUrl, setVideoPitchUrl] = useState("");

  // Requested Paid Services checkboxes
  const [requestedServices, setRequestedServices] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [expertModalOpen, setExpertModalOpen] = useState(false);

  const handleToggleService = (serviceName: string) => {
    if (requestedServices.includes(serviceName)) {
      setRequestedServices(requestedServices.filter((s) => s !== serviceName));
    } else {
      setRequestedServices([...requestedServices, serviceName]);
    }
  };

  const handleSubmitDealVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderName || !email || !companyName) {
      setErrorMessage("Please fill in Founder Name, Work Email, and Company Name.");
      return;
    }

    setErrorMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("founderName", founderName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("companyName", companyName);
      formData.append("website", website || "https://foundershalaventures.com");
      formData.append("linkedin", linkedin);
      formData.append("revenue2025", revenue2025 || "0");
      formData.append("preTaxProfit", preTaxProfit || "0");

      if (pitchDeckFile) formData.append("pitchDeck", pitchDeckFile);
      if (infoMemoFile) formData.append("infoMemo", infoMemoFile);
      if (financialModelFile) formData.append("financialModel", financialModelFile);
      if (valuationReportFile) formData.append("valuationReport", valuationReportFile);
      if (videoPitchUrl) formData.append("videoPitchUrl", videoPitchUrl);

      formData.append("requestedServices", JSON.stringify(requestedServices));

      const res = await fetch("/api/leads/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit deal vault.");

      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An engineering exception occurred while submitting. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="deal-vault" className="relative py-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> PITCH READINESS & DEAL VAULT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            The 5 Essential Investment Deliverables
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Institutional VCs & Investment Bankers require 5 key collaterals before starting due diligence. Upload your existing files or request Foundershala experts to build them for you.
          </p>
        </div>

        {/* Deliverables Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {[
            { num: "01", title: "Pitch Deck", desc: "12-15 slide investor presentation outlining problem, traction & TAM.", icon: FileText },
            { num: "02", title: "Info Memorandum", desc: "Comprehensive CIM document covering tech, economics & structure.", icon: FileText },
            { num: "03", title: "Financial Model", desc: "5-Year monthly driver-based revenue, CAC, LTV, and payback model.", icon: Calculator },
            { num: "04", title: "Valuation Report", desc: "Certified DCF & market multiples report for board & VC negotiation.", icon: PieChart },
            { num: "05", title: "YC Video Pitch", desc: "2-minute YC style elevator video presentation (YouTube or Loom link).", icon: Video },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.num} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deliverable {item.num}</span>
                  <Icon className="h-4 w-4 text-slate-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Main Deal Form Card */}
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          {!submitSuccess ? (
            <form onSubmit={handleSubmitDealVault} className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Founder & Startup Onboarding</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit your startup parameters and deal collaterals for confidential Investment Banking review.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Basic Company Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Founder & Company Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Founder Name *</label>
                    <input
                      type="text"
                      required
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="Ankit Singh"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@company.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Innovations"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://acme.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/founder"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Upload Existing Materials */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Upload Existing Collaterals (Optional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-600" /> Pitch Deck (PDF / PPTX)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.pptx,.ppt"
                      onChange={(e) => setPitchDeckFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-600" /> Info Memorandum (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => setInfoMemoFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Calculator className="h-4 w-4 text-slate-600" /> Financial Model (XLSX / PDF)
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.pdf"
                      onChange={(e) => setFinancialModelFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <PieChart className="h-4 w-4 text-slate-600" /> Valuation Report (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setValuationReportFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-slate-600" /> YC-Style Pitch Video Link (YouTube / Loom)
                  </label>
                  <input
                    type="url"
                    value={videoPitchUrl}
                    onChange={(e) => setVideoPitchUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Paid Service Request Toggle */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3. Request Paid Preparation Services by Foundershala
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Don't have these deliverables ready? Select which ones you want our Investment Bankers to craft for you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "Pitch Deck", title: "Pitch Deck Creation", desc: "12-15 Slide Investor Grade Presentation" },
                    { key: "Info Memorandum", title: "Info Memorandum (CIM)", desc: "20+ Page Comprehensive Deal Teaser & Data Room" },
                    { key: "Financial Model", title: "5-Year Financial Model", desc: "Driver-Based Unit Economics & CAC/LTV Logic" },
                    { key: "Valuation Report", title: "Certified Valuation Report", desc: "Globally Accepted DCF & Revenue Multiple Framework" },
                    { key: "YC Video Pitch", title: "YC Video Pitch Coaching", desc: "2-Min Founder Pitch Script & Production Guidance" },
                  ].map((service) => {
                    const isSelected = requestedServices.includes(service.key);
                    return (
                      <div
                        key={service.key}
                        onClick={() => handleToggleService(service.key)}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>{service.title}</span>
                          <div
                            className={`h-4 w-4 rounded border flex items-center justify-center ${
                              isSelected
                                ? "border-white bg-white text-slate-900"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {isSelected && <CheckCircle className="h-3 w-3 text-slate-900 stroke-[3]" />}
                          </div>
                        </div>
                        <p className={`text-[11px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{service.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting Deal Vault Asynchronously...
                    </>
                  ) : (
                    <>
                      Submit Deal Vault & Request Partner Review <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success View */
            <div className="py-12 text-center space-y-5">
              <div className="inline-flex rounded-full bg-slate-100 p-4 text-slate-900 ring-1 ring-slate-200">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Deal Vault Submitted Successfully</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your deal parameters and pitch materials have been recorded in our confidential database. CA Varun Deep Singh & our Investment Banking team will review your submission.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setExpertModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white"
                >
                  <PhoneCall className="h-4 w-4" /> Talk to IB Expert Now
                </button>

                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Submit Another Lead
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ExpertModal isOpen={expertModalOpen} onClose={() => setExpertModalOpen(false)} />
    </section>
  );
}
