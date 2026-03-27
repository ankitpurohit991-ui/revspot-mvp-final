"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Plus,
  Search,
  CircleCheck,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { campaignsList } from "@/lib/campaign-data";
import type { CampaignStatus, CampaignHealth } from "@/lib/campaign-data";
import { agentsList } from "@/lib/voice-agent-data";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    paused: { label: "Paused", cls: "bg-surface-secondary text-text-secondary" },
    completed: { label: "Completed", cls: "bg-[#F0F0F0] text-text-primary" },
  };
  const { label, cls } = config[status];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

function HealthBadge({ health }: { health: CampaignHealth }) {
  const config = {
    "on-track": { icon: CircleCheck, label: "On track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": { icon: AlertTriangle, label: "Attention", cls: "text-[#92400E] bg-[#FEF3C7]" },
    underperforming: { icon: XCircle, label: "Low", cls: "text-status-error bg-[#FEF2F2]" },
  };
  const { icon: Icon, label, cls } = config[health];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      <Icon size={11} strokeWidth={2} />
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
      type === "Performance"
        ? "bg-[#EFF6FF] text-[#1D4ED8]"
        : "bg-[#FDF4FF] text-[#7C3AED]"
    }`}>
      {type}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function CampaignsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return campaignsList.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.client.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [showImport, setShowImport] = useState(false);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Campaigns</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
          >
            <Download size={15} strokeWidth={1.5} />
            Import Campaigns
          </button>
          <button
            onClick={() => router.push("/campaigns/create")}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Create campaign
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5">
          {(["all", "active", "paused", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors duration-150 capitalize ${
                statusFilter === s
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-[280px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 pl-8 pr-3 text-[13px] border border-border rounded-input bg-white focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="bg-white border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Campaign", align: "left" },
                  { label: "Type", align: "left" },
                  { label: "Project", align: "left" },
                  { label: "Status", align: "left" },
                  { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" },
                  { label: "Verified", align: "right" },
                  { label: "CPL", align: "right" },
                  { label: "Health", align: "center" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align}`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/campaigns/${c.id}`)}
                  className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-4 py-3 text-[13px] text-text-primary font-medium max-w-[280px] truncate">
                    {c.name}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={c.type} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{c.client}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    {formatCurrency(c.spend)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    {c.leads}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="text-[13px] text-text-primary">{c.verifiedLeads}</span>
                    <span className="text-[11px] text-text-tertiary ml-1">
                      ({Math.round((c.verifiedLeads / c.leads) * 100)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    ₹{c.cpl.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <HealthBadge health={c.health} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
          <span className="text-[12px] text-text-tertiary">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} campaigns
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Import Modal */}
      {showImport && <ImportCampaignsModal onClose={() => setShowImport(false)} />}
    </motion.div>
  );
}

// ── Import Campaigns Modal ──────────────────────────────────

const importableCampaigns = {
  meta: [
    { id: "imp-m1", name: "Whitefield Villas LeadGen", status: "Active", spend: "₹2.4L/mo", leads: 320, adSets: 4, imported: false },
    { id: "imp-m2", name: "Sarjapur 2BHK Campaign", status: "Active", spend: "₹89K/mo", leads: 210, adSets: 3, imported: false },
    { id: "imp-m3", name: "NRI Investment Campaign", status: "Active", spend: "₹45K/mo", leads: 65, adSets: 2, imported: false },
    { id: "imp-m4", name: "Brand Awareness — Q1", status: "Paused", spend: "₹25K/mo", leads: 0, adSets: 1, imported: true },
  ],
  google: [
    { id: "imp-g1", name: "Luxury Villas Search", status: "Active", spend: "₹1.8L/mo", leads: 148, adSets: 5, imported: false },
    { id: "imp-g2", name: "Brand Campaign", status: "Active", spend: "₹55K/mo", leads: 42, adSets: 2, imported: false },
    { id: "imp-g3", name: "Competitor Keywords", status: "Active", spend: "₹40K/mo", leads: 35, adSets: 3, imported: false },
  ],
  linkedin: [
    { id: "imp-l1", name: "CXO Real Estate", status: "Active", spend: "₹65K/mo", leads: 28, adSets: 2, imported: false },
    { id: "imp-l2", name: "IT Pros Bangalore", status: "Active", spend: "₹35K/mo", leads: 18, adSets: 1, imported: false },
  ],
};

type Platform = "meta" | "google" | "linkedin";

function ImportToggle({ enabled, onToggle, label, helper }: { enabled: boolean; onToggle: () => void; label: string; helper?: string }) {
  return (
    <div className="flex items-start justify-between px-4 py-3">
      <div className="flex-1 mr-4">
        <span className="text-[13px] text-text-primary">{label}</span>
        {helper && <p className="text-[11px] text-text-tertiary mt-0.5">{helper}</p>}
      </div>
      <button onClick={onToggle} className={`relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0 mt-0.5 ${enabled ? "bg-accent" : "bg-silver-light"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function isLeadGenCampaign(c: { name: string; leads: number }) {
  return c.leads > 0 && !/brand/i.test(c.name);
}

function ImportCampaignsModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<Platform | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignProject, setAssignProject] = useState("skip");

  // Lead processing (step 2)
  const [verifyLeads, setVerifyLeads] = useState(true);
  const [enableAICalling, setEnableAICalling] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  const campaigns = platform ? importableCampaigns[platform] : [];
  const selectableCount = campaigns.filter((c) => !c.imported).length;

  const selectedLeadGen = campaigns.filter((c) => selected.has(c.id) && isLeadGenCampaign(c));
  const hasLeadGen = selectedLeadGen.length > 0;

  const activeAgents = agentsList.filter((a) => a.status === "active");

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const selectAll = () => {
    if (selected.size === selectableCount) setSelected(new Set());
    else setSelected(new Set(campaigns.filter((c) => !c.imported).map((c) => c.id)));
  };

  const goBack = () => {
    if (step === 3 && !hasLeadGen) setStep(1);
    else setStep((s) => s - 1);
  };

  const platforms: { key: Platform; label: string; connected: boolean; account: string }[] = [
    { key: "meta", label: "Meta Ads", connected: true, account: "Star Realtor Ad Account" },
    { key: "google", label: "Google Ads", connected: true, account: "Star Realtor Google" },
    { key: "linkedin", label: "LinkedIn Ads", connected: true, account: "Star Realtor LinkedIn" },
  ];

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 10px center",
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-card border border-border shadow-lg w-full max-w-[600px] max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between shrink-0">
            <h2 className="text-[16px] font-semibold text-text-primary">Import Campaigns</h2>
            <button onClick={onClose} className="p-1 text-text-secondary hover:bg-surface-secondary rounded-button"><X size={16} strokeWidth={1.5} /></button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 0 — Select Platform */}
            {step === 0 && (
              <div className="space-y-4">
                <p className="text-[13px] text-text-secondary mb-4">Import campaigns from</p>
                <div className="space-y-2">
                  {platforms.map((p) => (
                    <button key={p.key} onClick={() => { setPlatform(p.key); setStep(1); setSelected(new Set()); }}
                      className={`w-full flex items-center justify-between p-4 border rounded-card text-left hover:border-border-hover transition-all duration-150 ${
                        platform === p.key ? "border-accent" : "border-border"
                      }`}>
                      <div>
                        <div className="text-[14px] font-medium text-text-primary">{p.label}</div>
                        <div className="text-[12px] text-text-secondary mt-0.5 flex items-center gap-1">
                          {p.connected ? (
                            <><CheckCircle2 size={12} strokeWidth={2} className="text-[#15803D]" /> Connected — {p.account}</>
                          ) : "Not connected"}
                        </div>
                      </div>
                      <ArrowRight size={16} strokeWidth={1.5} className="text-text-tertiary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Select Campaigns */}
            {step === 1 && (
              <div>
                <p className="text-[13px] text-text-secondary mb-4">Select campaigns from {platforms.find((p) => p.key === platform)?.label}</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="px-3 py-2 text-left w-8">
                        <input type="checkbox" checked={selected.size === selectableCount && selectableCount > 0} onChange={selectAll}
                          className="w-3.5 h-3.5 rounded cursor-pointer" />
                      </th>
                      {["Campaign", "Status", "Spend", "Leads"].map((h) => (
                        <th key={h} className="px-3 py-2 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className={`border-b border-border-subtle last:border-0 ${c.imported ? "opacity-50" : ""}`}>
                        <td className="px-3 py-2.5">
                          {c.imported ? (
                            <span className="text-[10px] text-text-tertiary">—</span>
                          ) : (
                            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)}
                              className="w-3.5 h-3.5 rounded cursor-pointer" />
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="text-[12px] text-text-primary font-medium">{c.name}</div>
                          {c.imported && <span className="text-[10px] text-text-tertiary">Already imported</span>}
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-text-secondary">{c.status}</td>
                        <td className="px-3 py-2.5 text-[11px] text-text-secondary tabular-nums">{c.spend}</td>
                        <td className="px-3 py-2.5 text-[11px] text-text-secondary tabular-nums">{c.leads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Step 2 — Lead Processing (conditional) */}
            {step === 2 && hasLeadGen && (
              <div className="space-y-4">
                <p className="text-[13px] text-text-secondary">Configure lead processing for imported campaigns</p>
                <p className="text-[12px] text-text-tertiary">{selectedLeadGen.length} campaign{selectedLeadGen.length !== 1 ? "s" : ""} with leads detected.</p>

                <div className="space-y-1.5">
                  {selectedLeadGen.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-2 bg-surface-page rounded-[6px]">
                      <span className="text-[12px] text-text-primary font-medium">{c.name}</span>
                      <span className="text-[11px] text-text-tertiary tabular-nums">{c.leads} leads</span>
                    </div>
                  ))}
                </div>

                <div className="border border-border rounded-card divide-y divide-border-subtle overflow-hidden">
                  <ImportToggle enabled={verifyLeads} onToggle={() => setVerifyLeads(!verifyLeads)}
                    label="Verify existing leads" helper="Run email & phone verification on imported leads" />
                  <ImportToggle enabled={enableAICalling} onToggle={() => setEnableAICalling(!enableAICalling)}
                    label="Enable AI calling" helper="Assign a voice agent to qualify leads automatically" />
                  {enableAICalling && (
                    <div className="px-4 py-3">
                      <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-1.5 block">Select Agent</label>
                      <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                        style={selectStyle}>
                        <option value="">Choose an agent...</option>
                        {activeAgents.map((a) => (
                          <option key={a.id} value={a.id}>{a.name} · {a.qualificationRate}% qual rate</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 — Assign to Project */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-[13px] text-text-secondary">Assign to a project (optional)</p>
                <p className="text-[12px] text-text-tertiary">Organize imported campaigns into a project, or leave them unassigned.</p>
                <div className="space-y-2">
                  {[
                    { value: "skip", label: "Skip — leave unassigned" },
                    { value: "proj-1", label: "Whitefield Luxury Villas" },
                    { value: "proj-2", label: "Assetz Mizumi — Phase 3 Launch" },
                    { value: "proj-3", label: "Brigade Utopia — Pre-launch" },
                    { value: "__new__", label: "+ Create new project" },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 border rounded-card cursor-pointer transition-all ${
                      assignProject === opt.value ? "border-accent bg-surface-page" : "border-border hover:border-border-hover"
                    }`}>
                      <input type="radio" name="project" value={opt.value} checked={assignProject === opt.value}
                        onChange={() => setAssignProject(opt.value)} className="w-3.5 h-3.5" />
                      <span className="text-[13px] text-text-primary">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between shrink-0">
            {step > 0 ? (
              <button onClick={goBack}
                className="inline-flex items-center gap-1 h-9 px-3 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                <ArrowLeft size={14} strokeWidth={1.5} /> Back
              </button>
            ) : <div />}
            <div className="flex items-center gap-3">
              {step === 1 && selected.size > 0 && (
                <span className="text-[12px] text-text-secondary">{selected.size} selected</span>
              )}
              {step === 0 && <button onClick={onClose} className="h-9 px-4 text-[13px] font-medium text-text-secondary">Cancel</button>}
              {step === 1 && (
                <button onClick={() => setStep(hasLeadGen ? 2 : 3)} disabled={selected.size === 0}
                  className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                  Continue <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              )}
              {step === 2 && (
                <button onClick={() => setStep(3)}
                  className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors inline-flex items-center gap-1">
                  Continue <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              )}
              {step === 3 && (
                <button onClick={onClose}
                  className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors">
                  Import {selected.size} Campaign{selected.size !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
