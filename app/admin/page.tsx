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
  UserPlus,
  Key,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sliders,
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck,
  BadgeAlert,
  X,
  Plus,
  Edit2,
  Send,
} from "lucide-react";

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [valuationReports, setValuationReports] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    "kanban" | "allocation" | "team" | "updates" | "valuations"
  >("kanban");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Active Selections
  const [selectedDealForUpdates, setSelectedDealForUpdates] = useState<any>(null);
  const [dealUpdates, setDealUpdates] = useState<any[]>([]);
  const [newUpdateMessage, setNewUpdateMessage] = useState("");
  const [newUpdateStatus, setNewUpdateStatus] = useState("IN_PROGRESS");
  const [postingUpdate, setPostingUpdate] = useState(false);

  // New Team Member Modal
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("foundershala123");
  const [newMemberRole, setNewMemberRole] = useState("ANALYST");
  const [newMemberTitle, setNewMemberTitle] = useState("Investment Banking Associate");
  const [addingMember, setAddingMember] = useState(false);

  // Edit Credentials Modal
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("ANALYST");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [editTitle, setEditTitle] = useState("");
  const [savingMember, setSavingMember] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setValuationReports(data.valuationReports || []);
        setTeamMembers(data.teamMembers || []);
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

  // Handle allocating a deal to a team member
  const handleAssignDeal = async (dealId: string, teamMemberId: string, stage?: string) => {
    try {
      const res = await fetch("/api/admin/deals/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          assignedToId: teamMemberId === "UNASSIGNED" ? null : teamMemberId,
          ...(stage ? { stage } : {}),
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error("Failed to assign deal:", err);
    }
  };

  // Handle updating stage or priority
  const handleUpdateStageOrPriority = async (
    dealId: string,
    field: "stage" | "priority" | "status",
    value: string
  ) => {
    try {
      const res = await fetch("/api/admin/deals/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          [field]: value,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update deal:", err);
    }
  };

  // Fetch updates for selected deal
  const handleOpenUpdates = async (deal: any) => {
    setSelectedDealForUpdates(deal);
    setDealUpdates([]);
    try {
      const res = await fetch(`/api/admin/deals/updates?dealId=${deal.id}`);
      const data = await res.json();
      if (data.success) {
        setDealUpdates(data.updates || []);
      }
    } catch (err) {
      console.error("Fetch deal updates error:", err);
    }
  };

  // Post new work update note
  const handlePostUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealForUpdates || !newUpdateMessage.trim()) return;

    setPostingUpdate(true);
    try {
      const res = await fetch("/api/admin/deals/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealLeadId: selectedDealForUpdates.id,
          authorName: "Admin Partner",
          authorRole: "ADMIN",
          message: newUpdateMessage,
          taskStatus: newUpdateStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDealUpdates((prev) => [data.update, ...prev]);
        setNewUpdateMessage("");
        fetchData();
      }
    } catch (err) {
      console.error("Post update note error:", err);
    } finally {
      setPostingUpdate(false);
    }
  };

  // Add new team member
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    setAddingMember(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMemberName,
          email: newMemberEmail,
          password: newMemberPassword,
          role: newMemberRole,
          title: newMemberTitle,
          status: "ACTIVE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddTeamModal(false);
        setNewMemberName("");
        setNewMemberEmail("");
        fetchData();
      } else {
        alert(data.error || "Failed to add team member");
      }
    } catch (err) {
      console.error("Add team member error:", err);
    } finally {
      setAddingMember(false);
    }
  };

  // Save edited member credentials
  const handleSaveMemberCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setSavingMember(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: editingMember.id,
          password: editPassword || undefined,
          role: editRole,
          status: editStatus,
          title: editTitle,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingMember(null);
        fetchData();
      }
    } catch (err) {
      console.error("Save credentials error:", err);
    } finally {
      setSavingMember(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter || lead.stage === statusFilter;
    const matchesAssignee =
      assigneeFilter === "ALL"
        ? true
        : assigneeFilter === "UNASSIGNED"
        ? !lead.assignedToId
        : lead.assignedToId === assigneeFilter;

    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.founderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesAssignee && matchesSearch;
  });

  const unassignedCount = leads.filter((l) => !l.assignedToId).length;
  const activeKanbanLeads = leads.filter((l) => l.stage !== "CLOSED");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Foundershala Ventures IB Operational CRM
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Deal Pipeline & Team Member Allocator
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Top-level workflow tracker • Manage 8 IB team members, assign deals, track task progress notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Add Team Member
            </button>

            <button
              onClick={fetchData}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Top Level CRM Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Deals Onboarded</div>
            <div className="text-2xl font-black text-white mt-1">{leads.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Foundershala Vault submissions</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="text-[10px] uppercase font-bold text-amber-400">Unassigned Deals</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{unassignedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Requires analyst allocation</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Active Work Capacity</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{teamMembers.length} Members</div>
            <div className="text-[10px] text-slate-400 mt-0.5">IB Analysts & Associates</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="text-[10px] uppercase font-bold text-slate-300">Paid Service Requests</div>
            <div className="text-2xl font-black text-white mt-1">
              {leads.filter((l) => l.requestedServices && l.requestedServices.length > 0).length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">CIM / Model / Valuation asks</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="text-[10px] uppercase font-bold text-slate-300">AI Valuation Reports</div>
            <div className="text-2xl font-black text-white mt-1">{valuationReports.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Groq AI certificates</div>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex overflow-x-auto gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
            {[
              { id: "kanban", label: "Pipeline Stage Kanban", icon: Sliders },
              { id: "allocation", label: "Deal Allocation Matrix", icon: LayoutDashboard },
              { id: "team", label: `IB Team (${teamMembers.length})`, icon: Users },
              { id: "updates", label: "Task Progress Logs", icon: MessageSquare },
              { id: "valuations", label: "Valuation Reports", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filter bar for allocation/kanban tabs */}
          {(activeTab === "kanban" || activeTab === "allocation") && (
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search company or founder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
              </div>

              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="ALL">All Analysts (8+)</option>
                <option value="UNASSIGNED">Unassigned Deals Only</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.activeDealsCount} deals)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: PIPELINE STAGE KANBAN BOARD */}
        {activeTab === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {[
              { key: "NEW_DEAL", title: "1. New Inquiries", bg: "border-amber-500/40 bg-amber-950/20" },
              { key: "ASSIGNED", title: "2. Assigned to Analyst", bg: "border-blue-500/40 bg-blue-950/20" },
              { key: "MODELING", title: "3. Valuation & Financial Model", bg: "border-purple-500/40 bg-purple-950/20" },
              { key: "CIM_PREP", title: "4. CIM & Deck Prep", bg: "border-indigo-500/40 bg-indigo-950/20" },
              { key: "VC_MATCHING", title: "5. VC Pitch Ready", bg: "border-emerald-500/40 bg-emerald-950/20" },
            ].map((col) => {
              const colDeals = filteredLeads.filter(
                (l) => l.stage === col.key || (col.key === "NEW_DEAL" && (!l.stage || l.stage === "NEW"))
              );

              return (
                <div
                  key={col.key}
                  className={`rounded-xl border p-3 flex flex-col min-h-[500px] ${col.bg}`}
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white">{col.title}</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {colDeals.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colDeals.length === 0 ? (
                      <div className="text-[11px] text-slate-500 p-4 text-center border border-dashed border-slate-800 rounded-lg">
                        No deals in this stage
                      </div>
                    ) : (
                      colDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="rounded-lg border border-slate-800 bg-slate-900 p-3.5 space-y-2.5 shadow-sm hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">{deal.companyName}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{deal.founderName}</p>
                            </div>

                            <span
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                deal.priority === "URGENT"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                  : deal.priority === "HIGH"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {deal.priority || "MEDIUM"}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                            <span>Rev: ₹{deal.revenue2025 || 0} L</span>
                            <span>Profit: ₹{deal.preTaxProfit || 0} L</span>
                          </div>

                          {/* Allocation Selector */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                              Assigned Analyst:
                            </label>
                            <select
                              value={deal.assignedToId || "UNASSIGNED"}
                              onChange={(e) => handleAssignDeal(deal.id, e.target.value, col.key)}
                              className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-emerald-400 font-semibold focus:outline-none"
                            >
                              <option value="UNASSIGNED">❌ Unassigned</option>
                              {teamMembers.map((m) => (
                                <option key={m.id} value={m.id}>
                                  👤 {m.name} ({m.role})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Stage Transition Selector */}
                          <div className="flex items-center justify-between pt-1">
                            <select
                              value={deal.stage || "NEW_DEAL"}
                              onChange={(e) =>
                                handleUpdateStageOrPriority(deal.id, "stage", e.target.value)
                              }
                              className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[9px] text-slate-300 font-medium focus:outline-none"
                            >
                              <option value="NEW_DEAL">Stage: New</option>
                              <option value="ASSIGNED">Stage: Assigned</option>
                              <option value="MODELING">Stage: Valuation</option>
                              <option value="CIM_PREP">Stage: CIM Prep</option>
                              <option value="VC_MATCHING">Stage: VC Pitch</option>
                              <option value="CLOSED">Stage: Closed</option>
                            </select>

                            <button
                              onClick={() => {
                                handleOpenUpdates(deal);
                                setActiveTab("updates");
                              }}
                              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <MessageSquare className="h-3 w-3" /> Logs ({deal.updates?.length || 0})
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DEAL ALLOCATION MATRIX TABLE */}
        {activeTab === "allocation" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Deal Allocation & Workload Matrix</h3>
                <p className="text-xs text-slate-400">
                  Assign leads to specific analysts, set deal priority, and manage stage workflows.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredLeads.length}</strong> deals
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Company & Founder</th>
                    <th className="py-3 px-4">Financials (2025)</th>
                    <th className="py-3 px-4">Deliverables</th>
                    <th className="py-3 px-4">Assigned IB Worker</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No deal leads match filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((deal) => (
                      <tr key={deal.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="font-bold text-sm text-white">{deal.companyName}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {deal.founderName} • {deal.email}
                          </div>
                          {deal.website && (
                            <a
                              href={deal.website.startsWith("http") ? deal.website : `https://${deal.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-400 underline hover:text-emerald-300 inline-flex items-center gap-1 mt-0.5"
                            >
                              <Globe className="h-2.5 w-2.5" /> {deal.website}
                            </a>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div>Rev: ₹{deal.revenue2025 || 0} Lakhs</div>
                          <div className="text-[10px] text-slate-400">Profit: ₹{deal.preTaxProfit || 0} Lakhs</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {deal.pitchDeckFileName && (
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300 font-medium">
                                Deck
                              </span>
                            )}
                            {deal.infoMemoFileName && (
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300 font-medium">
                                CIM
                              </span>
                            )}
                            {deal.financialModelFileName && (
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300 font-medium">
                                Model
                              </span>
                            )}
                            {deal.requestedServices?.length > 0 && (
                              <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold">
                                +{deal.requestedServices.length} Services
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={deal.assignedToId || "UNASSIGNED"}
                            onChange={(e) => handleAssignDeal(deal.id, e.target.value)}
                            className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-slate-700"
                          >
                            <option value="UNASSIGNED">Unassigned</option>
                            {teamMembers.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.title})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={deal.stage || "NEW_DEAL"}
                            onChange={(e) =>
                              handleUpdateStageOrPriority(deal.id, "stage", e.target.value)
                            }
                            className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="NEW_DEAL">New Deal</option>
                            <option value="ASSIGNED">Assigned</option>
                            <option value="MODELING">Valuation / Model</option>
                            <option value="CIM_PREP">CIM Prep</option>
                            <option value="VC_MATCHING">VC Pitching</option>
                            <option value="CLOSED">Deal Closed</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={deal.priority || "MEDIUM"}
                            onChange={(e) =>
                              handleUpdateStageOrPriority(deal.id, "priority", e.target.value)
                            }
                            className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none font-bold"
                          >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="URGENT">URGENT</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              handleOpenUpdates(deal);
                              setActiveTab("updates");
                            }}
                            className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-emerald-400 font-semibold hover:bg-slate-700 cursor-pointer"
                          >
                            <MessageSquare className="h-3 w-3" /> Task Logs ({deal.updates?.length || 0})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM MEMBERS & CREDENTIALS MANAGEMENT (8+ MEMBERS) */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Investment Banking Team & Credentials</h3>
                <p className="text-xs text-slate-400">
                  Manage worker accounts, assign passwords, set roles (Admin / Analyst / Associate), and track deal workloads.
                </p>
              </div>

              <button
                onClick={() => setShowAddTeamModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 shadow-sm relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{member.title}</p>
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                        member.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : member.role === "ANALYST"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 border-t border-b border-slate-800/80 py-2.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="h-3 w-3 text-slate-500" /> {member.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Key className="h-3 w-3 text-slate-500" /> Password:{" "}
                      <span className="font-mono text-emerald-400 font-bold">
                        {member.password || "foundershala123"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Active Workload: <strong className="text-white">{member.activeDealsCount || 0} Deals</strong>
                    </span>

                    <button
                      onClick={() => {
                        setEditingMember(member);
                        setEditPassword(member.password || "");
                        setEditRole(member.role || "ANALYST");
                        setEditStatus(member.status || "ACTIVE");
                        setEditTitle(member.title || "");
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" /> Credentials
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WORK PROGRESS & TASK LOGS */}
        {activeTab === "updates" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Deal Task & Progress Updates</h3>
                <p className="text-xs text-slate-400">
                  Select an assigned deal to view or post analyst work logs, financial model progress, and VC pitch notes.
                </p>
              </div>

              <div className="sm:w-72">
                <select
                  value={selectedDealForUpdates?.id || ""}
                  onChange={(e) => {
                    const found = leads.find((l) => l.id === e.target.value);
                    if (found) handleOpenUpdates(found);
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">-- Select Deal Lead --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.companyName} ({l.assignedToName || "Unassigned"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedDealForUpdates ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Deal Overview */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4 h-fit">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      SELECTED DEAL LEADS
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedDealForUpdates.companyName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Founder: {selectedDealForUpdates.founderName}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800 py-3">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">Assigned Worker</span>
                      <div className="text-emerald-400 font-bold text-sm">
                        {selectedDealForUpdates.assignedToName || "Unassigned"}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">Stage</span>
                      <div className="font-semibold">{selectedDealForUpdates.stage || "NEW_DEAL"}</div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">Financials</span>
                      <div>Rev: ₹{selectedDealForUpdates.revenue2025} L • Profit: ₹{selectedDealForUpdates.preTaxProfit} L</div>
                    </div>
                  </div>

                  {/* Post New Update Note Form */}
                  <form onSubmit={handlePostUpdateNote} className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase">Post New Analyst Work Note</h4>
                    <div>
                      <textarea
                        required
                        rows={3}
                        value={newUpdateMessage}
                        onChange={(e) => setNewUpdateMessage(e.target.value)}
                        placeholder="Type deliverable progress note, financial model status, or VC feedback..."
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={newUpdateStatus}
                        onChange={(e) => setNewUpdateStatus(e.target.value)}
                        className="rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300"
                      >
                        <option value="IN_PROGRESS">Status: In Progress</option>
                        <option value="COMPLETED">Status: Completed</option>
                        <option value="BLOCKED">Status: Blocked</option>
                        <option value="INFO">Status: Info Note</option>
                      </select>

                      <button
                        type="submit"
                        disabled={postingUpdate}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-3 w-3" /> Post Note
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right 2 Columns: Timeline of Updates */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Work Progress Log Timeline ({dealUpdates.length})
                  </h4>

                  {dealUpdates.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
                      No progress notes posted on this deal yet. Use the form on the left to post the first update log.
                    </div>
                  ) : (
                    dealUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{update.authorName}</span>
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                              {update.authorRole}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-500">
                            {new Date(update.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed">{update.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center text-xs text-slate-500">
                Please select a deal lead from the dropdown above to view or post analyst task updates.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: HISTORICAL VALUATION REPORTS */}
        {activeTab === "valuations" && (
          <div className="space-y-4">
            {valuationReports.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center text-xs text-slate-500">
                No valuation reports recorded in database yet.
              </div>
            ) : (
              valuationReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3"
                >
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{report.companyName || report.website}</h3>
                      <p className="text-xs text-slate-400">
                        Sector: {report.sector} • Website: {report.website} • Generated{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
                      Readiness: {report.readinessScore || 80}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">2025 Revenue</span>
                      <div className="text-sm font-bold text-white mt-0.5">₹{report.revenue2025} Lakhs</div>
                    </div>

                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Net Profit</span>
                      <div className="text-sm font-bold text-white mt-0.5">₹{report.preTaxProfit} Lakhs</div>
                    </div>

                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Owner Salary</span>
                      <div className="text-sm font-bold text-white mt-0.5">₹{report.ownerSalary} Lakhs</div>
                    </div>

                    <div className="rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 p-3">
                      <span className="text-emerald-400/80 font-bold block text-[10px] uppercase">Valuation Range</span>
                      <div className="text-sm font-bold text-emerald-300 mt-0.5">
                        ₹{report.valuationMin} - ₹{report.valuationMax} Cr
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD TEAM MEMBER MODAL */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New IB Team Member</h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="rahul@foundershalaventures.com"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Login Password *</label>
                <input
                  type="text"
                  required
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  placeholder="foundershala123"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ANALYST">ANALYST</option>
                    <option value="ASSOCIATE">ASSOCIATE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newMemberTitle}
                    onChange={(e) => setNewMemberTitle(e.target.value)}
                    placeholder="Valuation Specialist"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addingMember}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {addingMember ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CREDENTIALS MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit Credentials & Role</h3>
                <p className="text-xs text-slate-400">{editingMember.name} • {editingMember.email}</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Change Password (Leave blank to keep current)
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ANALYST">ANALYST</option>
                    <option value="ASSOCIATE">ASSOCIATE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BUSY">BUSY</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingMember}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {savingMember ? "Saving..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
