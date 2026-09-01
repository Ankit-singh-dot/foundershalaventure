"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import ExpertModal from "./expert-modal";

export default function DocumentTeaser() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expertModalOpen, setExpertModalOpen] = useState<boolean>(false);
  const [modalService, setModalService] = useState<string>("");

  const totalPages = 20;
  const isUnlocked = currentPage <= 3;

  const handleOpenExpert = (service: string) => {
    setModalService(service);
    setExpertModalOpen(true);
  };

  return (
    <section id="document-teaser" className="relative py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-700" /> CONFIDENTIAL DEAL COLLATERAL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CIM & Valuation Report Teaser
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Sample 20-Page Information Memorandum. Pages 1–3 are open for preview. Pages 4–20 are delivered exclusively for Foundershala clients.
          </p>
        </div>

        {/* PDF Reader Window Container */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Reader Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-700 truncate max-w-[200px] sm:max-w-none">
                FOUNDERSHALA_CIM_VALUATION_SAMPLE_2025.PDF
              </span>
            </div>

            {/* Page Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">
                Page <span className="text-slate-900 font-bold">{currentPage}</span> of {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => handleOpenExpert("CIM & Valuation Report Unlock")}
                className="hidden sm:flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Lock className="h-3.5 w-3.5" /> Order Full Report
              </button>
            </div>
          </div>

          {/* Document Content View Area */}
          <div className="relative min-h-[480px] bg-white p-6 sm:p-10 text-slate-900">
            <AnimatePresence mode="wait">
              {/* UNLOCKED PAGES (PAGES 1, 2, 3) */}
              {isUnlocked ? (
                <motion.div
                  key={`page-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {currentPage === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            CONFIDENTIAL INFORMATION MEMORANDUM (CIM)
                          </div>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                            Acme Technologies Pvt Ltd
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Series A Investment Opportunity • ₹50.0 Cr Valuation Benchmark
                          </p>
                        </div>
                        <div className="rounded border border-slate-300 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-800">
                          Foundershala Verified
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">2025 Revenue</div>
                          <div className="text-xl font-bold text-slate-900 mt-1">₹2.50 Cr</div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">+140% YoY Growth</div>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Pre-Tax EBITDA</div>
                          <div className="text-xl font-bold text-slate-900 mt-1">₹0.69 Cr</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">27.6% Margin</div>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Capital Ask</div>
                          <div className="text-xl font-bold text-slate-900 mt-1">₹5.00 Cr</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">10% Dilution Target</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Executive Summary</h4>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Acme Technologies is a high-growth B2B enterprise software provider serving over 180 corporate accounts. With strong gross margins (82%) and negative net churn, the company is raising ₹5.0 Cr to accelerate enterprise sales expansion and double product engineering throughput.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PAGE 2: FINANCIAL MODEL & MULTIPLES</div>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">5-Year Revenue & EBITDA Forecast</h3>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50">
                              <th className="py-2.5 px-3">Metric (₹ Cr)</th>
                              <th className="py-2.5 px-3">FY2023</th>
                              <th className="py-2.5 px-3">FY2024</th>
                              <th className="py-2.5 px-3 font-bold text-slate-900">FY2025 (Act)</th>
                              <th className="py-2.5 px-3">FY2026 (P)</th>
                              <th className="py-2.5 px-3">FY2027 (P)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-mono">
                            <tr>
                              <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Gross Revenue</td>
                              <td className="py-2.5 px-3">0.60</td>
                              <td className="py-2.5 px-3">1.20</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">2.50</td>
                              <td className="py-2.5 px-3">6.00</td>
                              <td className="py-2.5 px-3">14.50</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Gross Profit (82%)</td>
                              <td className="py-2.5 px-3">0.49</td>
                              <td className="py-2.5 px-3">0.98</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">2.05</td>
                              <td className="py-2.5 px-3">4.92</td>
                              <td className="py-2.5 px-3">11.89</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">Pre-Tax EBITDA</td>
                              <td className="py-2.5 px-3">0.08</td>
                              <td className="py-2.5 px-3">0.24</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">0.69</td>
                              <td className="py-2.5 px-3">1.80</td>
                              <td className="py-2.5 px-3">4.64</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-slate-900">Valuation Methodology:</div>
                        <p>Applied 10.0x FY2025 Revenue Multiple + Discounted Cash Flow (DCF) resulting in ₹48.5 Cr – ₹52.0 Cr EV range.</p>
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PAGE 3: UNIT ECONOMICS & SAAS BENCHMARKS</div>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">CAC, LTV & Payback Metrics</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-900 mb-1">Customer Acquisition Cost (CAC)</div>
                          <div className="text-xl font-bold text-slate-900">₹42,000</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Blended inbound & outbound acquisition</div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-900 mb-1">Customer Lifetime Value (LTV)</div>
                          <div className="text-xl font-bold text-slate-900">₹3,80,000</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">LTV / CAC Ratio: 9.0x (Institutional Grade)</div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 font-medium">
                        <strong>Preview Note:</strong> Pages 1 to 3 are complete. Pages 4 through 20 contain complete cap table waterfall, exit scenario analysis, and legal due diligence documentation.
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* LOCKED PAGES (PAGES 4 TO 20) */
                <motion.div
                  key={`locked-page-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative min-h-[400px] flex items-center justify-center"
                >
                  <div className="absolute inset-0 select-none blur-sm opacity-20 p-4 space-y-4 pointer-events-none">
                    <div className="h-6 w-3/4 bg-slate-400 rounded" />
                    <div className="h-4 w-full bg-slate-300 rounded" />
                    <div className="h-4 w-5/6 bg-slate-300 rounded" />
                    <div className="h-32 w-full bg-slate-200 rounded-lg" />
                  </div>

                  <div className="relative z-10 max-w-md mx-auto text-center rounded-xl border border-slate-200 bg-white p-8 shadow-lg space-y-4">
                    <div className="inline-flex rounded-full bg-slate-100 p-3.5 text-slate-900 ring-1 ring-slate-200">
                      <Lock className="h-7 w-7 text-slate-800" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        Locked Page {currentPage} of {totalPages}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Full 20-Page Information Memorandum, Cap Table Waterfall & Legal Structuring delivered exclusively for Foundershala IB clients.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleOpenExpert("Full 20-Page CIM & Valuation Report")}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
                      >
                        <PhoneCall className="h-4 w-4" /> Request Foundershala to Build My CIM
                      </button>

                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Back to Unlocked Page 1
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Page Picker Bar */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto border-t border-slate-200 bg-slate-50 p-3">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const active = pageNum === currentPage;
              const unlocked = pageNum <= 3;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-7 w-7 items-center justify-center rounded text-xs font-semibold transition-all ${
                    active
                      ? "bg-slate-900 text-white font-bold"
                      : unlocked
                      ? "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100"
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        prefillService={modalService}
        defaultMessage="I would like Foundershala IB experts to prepare a 20-page investor CIM and Valuation report for my company."
      />
    </section>
  );
}
