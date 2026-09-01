"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Phone,
  Globe,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [valuationReports, setValuationReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "valuations">("leads");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setValuationReports(data.valuationReports || []);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.founderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-600 tracking-wider">
              <LayoutDashboard className="h-4 w-4" /> Foundershala IB Admin Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Deal Pipeline & Founder Leads</h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time synchronization with Neon PostgreSQL Database.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Pipeline
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Leads</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{leads.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Deal submissions</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-amber-700">New Inquiries</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {leads.filter((l) => l.status === "NEW").length}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Pending partner review</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-700">Paid Service Requests</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {leads.filter((l) => l.requestedServices && l.requestedServices.length > 0).length}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">CIM / Model / Valuation requests</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-700">AI Valuation Certificates</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{valuationReports.length}</div>
            <div className="text-[10px] text-slate-500 mt-1">Groq AI certificates</div>
          </div>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex rounded-lg bg-slate-200 p-1 border border-slate-300">
            <button
              onClick={() => setActiveTab("leads")}
              className={`rounded px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "leads" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Deal Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("valuations")}
              className={`rounded px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "valuations" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Valuation Reports ({valuationReports.length})
            </button>
          </div>

          {activeTab === "leads" && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search company or founder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Deal Leads */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                No deal leads found. Submit a deal from the main landing page to see it recorded here.
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{lead.companyName}</h3>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            lead.status === "NEW"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : lead.status === "CONTACTED"
                              ? "bg-blue-100 text-blue-900 border border-blue-300"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Founder: <span className="font-semibold text-slate-900">{lead.founderName}</span> • Submitted {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                      >
                        <option value="NEW">Mark NEW</option>
                        <option value="IN_REVIEW">Mark IN REVIEW</option>
                        <option value="CONTACTED">Mark CONTACTED</option>
                        <option value="CLOSED">Mark CLOSED</option>
                      </select>

                      <a
                        href={`mailto:${lead.email}`}
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" /> Email Founder
                      </a>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Contact Details</span>
                      <div>Email: {lead.email}</div>
                      <div>Phone: {lead.phone || "N/A"}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Online Profiles</span>
                      <div className="flex items-center gap-3 mt-0.5">
                        {lead.website && (
                          <a
                            href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-900 underline flex items-center gap-1 font-semibold"
                          >
                            <Globe className="h-3 w-3" /> Website
                          </a>
                        )}
                        {lead.linkedin && (
                          <a
                            href={lead.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-900 underline flex items-center gap-1 font-semibold"
                          >
                            <Share2 className="h-3 w-3" /> LinkedIn
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">2025 Financials</span>
                      <div>Revenue: ₹{(lead.revenue2025 || 0)} Lakhs</div>
                      <div>Profit: ₹{(lead.preTaxProfit || 0)} Lakhs</div>
                    </div>
                  </div>

                  {/* Deliverables Status */}
                  <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-2 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500">5 Pitch Materials Status</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                      <div className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[9px]">Pitch Deck</span>
                        <span className={lead.pitchDeckFileName ? "text-slate-900 font-bold" : "text-slate-400"}>
                          {lead.pitchDeckFileName || "Not Uploaded"}
                        </span>
                      </div>

                      <div className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[9px]">Info Memo (CIM)</span>
                        <span className={lead.infoMemoFileName ? "text-slate-900 font-bold" : "text-slate-400"}>
                          {lead.infoMemoFileName || "Not Uploaded"}
                        </span>
                      </div>

                      <div className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[9px]">Financial Model</span>
                        <span className={lead.financialModelFileName ? "text-slate-900 font-bold" : "text-slate-400"}>
                          {lead.financialModelFileName || "Not Uploaded"}
                        </span>
                      </div>

                      <div className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[9px]">Valuation Report</span>
                        <span className={lead.valuationReportFileName ? "text-slate-900 font-bold" : "text-slate-400"}>
                          {lead.valuationReportFileName || "Not Uploaded"}
                        </span>
                      </div>

                      <div className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[9px]">YC Video Pitch</span>
                        <span className={lead.videoPitchUrl ? "text-slate-900 font-bold" : "text-slate-400"}>
                          {lead.videoPitchUrl ? "Link Provided" : "Not Provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Requested Paid Services */}
                  {lead.requestedServices && lead.requestedServices.length > 0 && (
                    <div className="rounded-lg bg-slate-100 border border-slate-200 p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Sparkles className="h-4 w-4 text-slate-700" /> Requested Paid Preparation Services:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.requestedServices.map((srv: string) => (
                          <span key={srv} className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: AI Valuation Reports */}
        {activeTab === "valuations" && (
          <div className="space-y-4">
            {valuationReports.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                No valuation reports recorded in database yet.
              </div>
            ) : (
              valuationReports.map((report) => {
                let parsedAnalysis: any = {};
                try {
                  parsedAnalysis = JSON.parse(report.analysisResult || "{}");
                } catch {}

                return (
                  <div
                    key={report.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{report.companyName || report.website}</h3>
                        <p className="text-xs text-slate-500">
                          Sector: {report.sector} • Website: {report.website} • Generated {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="rounded border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-900">
                        Readiness: {report.readinessScore || 80}/100
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">2025 Revenue</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">₹{report.revenue2025} Lakhs</div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Profit</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">₹{report.preTaxProfit} Lakhs</div>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Owner Salary</span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">₹{report.ownerSalary} Lakhs</div>
                      </div>

                      <div className="rounded-lg bg-slate-900 text-white p-3">
                        <span className="text-slate-300 font-bold block text-[10px] uppercase">Valuation Range</span>
                        <div className="text-base font-bold text-white mt-0.5">
                          ₹{report.valuationMin} - ₹{report.valuationMax} Cr
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
