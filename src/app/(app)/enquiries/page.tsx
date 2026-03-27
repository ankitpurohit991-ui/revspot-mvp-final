"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Search,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ShieldCheck,
  ExternalLink,
  Copy,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MetricChart } from "@/components/shared/metric-chart";
import type { MetricChartDef, MetricOption } from "@/components/shared/metric-chart";
import { format } from "date-fns";
import {
  allLeads,
  enquiryStats,
  campaignFilterOptions,
} from "@/lib/enquiries-data";
import type { EnquiryLead } from "@/lib/enquiries-data";
import type {
  LeadTemperature,
  LeadQualification,
  EnrichmentStatus,
} from "@/lib/campaign-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

// ── Badge Components ────────────────────────────────────────
function TemperatureBadge({ temp }: { temp: LeadTemperature }) {
  const config = {
    hot: { label: "Hot", cls: "bg-[#FEF2F2] text-[#DC2626]" },
    warm: { label: "Warm", cls: "bg-[#FEF3C7] text-[#92400E]" },
    lukewarm: { label: "Lukewarm", cls: "bg-[#F0F0F0] text-text-secondary" },
    cold: { label: "Cold", cls: "bg-[#EFF6FF] text-[#1D4ED8]" },
  };
  const { label, cls } = config[temp];
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}
    >
      {label}
    </span>
  );
}

function QualificationBadge({ status }: { status: LeadQualification }) {
  const config = {
    qualified: { label: "Qualified", cls: "bg-[#F0FDF4] text-[#15803D]" },
    not_qualified: {
      label: "Not Qualified",
      cls: "bg-[#FEF2F2] text-[#DC2626]",
    },
    pending: { label: "Pending", cls: "bg-[#FEF3C7] text-[#92400E]" },
  };
  const { label, cls } = config[status];
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}
    >
      {label}
    </span>
  );
}

function EnrichmentIcon({ status }: { status: EnrichmentStatus }) {
  if (status === "enriched")
    return (
      <CheckCircle2
        size={14}
        strokeWidth={2}
        className="text-status-success"
      />
    );
  if (status === "failed")
    return <X size={14} strokeWidth={2} className="text-status-error" />;
  return <span className="text-[11px] text-text-tertiary">—</span>;
}

function formatLeadStatus(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Slide-over Panel ────────────────────────────────────────
function LeadPanel({
  lead,
  onClose,
}: {
  lead: EnquiryLead;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/20 z-[60]"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white z-[70] shadow-lg overflow-y-auto border-l border-border">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-text-primary">
              {lead.name}
            </h2>
            {lead.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
                <ShieldCheck size={11} strokeWidth={2} />
                Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary transition-colors duration-150"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Source */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Source
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Campaign", value: lead.campaign },
                { label: "Adset", value: lead.adset },
                { label: "Ad", value: lead.adName },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-badge bg-surface-secondary text-text-secondary"
                >
                  <span className="text-text-tertiary">{item.label}:</span>
                  <span className="font-medium text-text-primary">
                    {item.value}
                  </span>
                  <ExternalLink
                    size={10}
                    strokeWidth={1.5}
                    className="text-text-tertiary"
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name", value: lead.name },
                { label: "Phone", value: lead.phone },
                { label: "Email", value: lead.email },
                {
                  label: "Created",
                  value: format(
                    new Date(lead.createdAt),
                    "dd MMM yyyy, HH:mm"
                  ),
                },
                {
                  label: "Updated",
                  value: format(
                    new Date(lead.updatedAt),
                    "dd MMM yyyy, HH:mm"
                  ),
                },
                {
                  label: "Lead Status",
                  value: formatLeadStatus(lead.leadStatus),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-page rounded-[6px] px-3 py-2"
                >
                  <div className="text-[11px] text-text-tertiary">
                    {item.label}
                  </div>
                  <div className="text-[13px] text-text-primary font-medium mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Responses */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Form Responses
            </h3>
            <div className="space-y-2">
              {lead.formResponses.map((fr, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2 border-b border-border-subtle last:border-0"
                >
                  <span className="text-[12px] text-text-secondary min-w-[140px]">
                    {fr.question}
                  </span>
                  <span className="text-[13px] text-text-primary font-medium">
                    {fr.answer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Quality Assessment
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">
                  AI Qualification
                </div>
                <div className="mt-1">
                  <QualificationBadge status={lead.aiQualification} />
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">
                  Temperature
                </div>
                <div className="mt-1">
                  <TemperatureBadge temp={lead.temperature} />
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Qualified</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.sql ? (
                    <>
                      <CheckCircle2
                        size={13}
                        strokeWidth={2}
                        className="text-status-success"
                      />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Verified</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.verified ? (
                    <>
                      <ShieldCheck
                        size={13}
                        strokeWidth={2}
                        className="text-status-success"
                      />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2 col-span-2">
                <div className="text-[11px] text-text-tertiary">
                  Sent to CRM
                </div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5">
                  {lead.sentToCRM || "Not sent"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <Send size={14} strokeWidth={1.5} />
            Send to CRM
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
            <Copy size={14} strokeWidth={1.5} />
            Copy to Campaign
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150 ml-auto">
            <CheckCircle2 size={14} strokeWidth={1.5} />
            Assessed
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Main Page ───────────────────────────────────────────────
const PAGE_SIZE = 10;

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 10px center",
};

// Lead metric trends
const leadDates = Array.from({ length: 14 }, (_, i) => `Mar ${10 + i}`);
const leadTrends: Record<string, MetricChartDef> = {
  total: { key: "total", label: "Total Leads", unit: "number", data: Array.from({ length: 14 }, (_, i) => Math.round(780 + i * 5 + Math.random() * 15)) },
  verified: { key: "verified", label: "Verified", unit: "number", data: Array.from({ length: 14 }, (_, i) => Math.round(120 + i * 1.5 + Math.random() * 5)) },
  qualified: { key: "qualified", label: "Qualified", unit: "number", data: Array.from({ length: 14 }, (_, i) => Math.round(105 + i * 1.5 + Math.random() * 5)) },
  notQualified: { key: "notQualified", label: "Not Qualified", unit: "number", data: Array.from({ length: 14 }, (_, i) => Math.round(380 + i * 2 + Math.random() * 10)) },
  pending: { key: "pending", label: "Pending", unit: "number", data: Array.from({ length: 14 }, (_, i) => Math.round(280 + i * 2 + Math.random() * 8)) },
};
const leadMetricOptions: MetricOption[] = [
  { key: "total", label: "Total Leads", category: "Leads", currentValue: "845" },
  { key: "verified", label: "Verified", category: "Leads", currentValue: "142" },
  { key: "qualified", label: "Qualified", category: "Leads", currentValue: "127" },
  { key: "notQualified", label: "Not Qualified", category: "Leads", currentValue: "412" },
  { key: "pending", label: "Pending", category: "Leads", currentValue: "306" },
];

export default function EnquiriesPage() {
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "qualified" | "not_qualified" | "pending"
  >("all");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<EnquiryLead | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const toggleMetric = useCallback((key: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  }, []);

  const filtered = useMemo(() => {
    return allLeads.filter((l) => {
      if (
        campaignFilter !== "All Campaigns" &&
        l.campaign !== campaignFilter
      )
        return false;
      if (statusFilter !== "all" && l.aiQualification !== statusFilter)
        return false;
      if (
        search &&
        !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.phone.includes(search) &&
        !l.campaign.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, campaignFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">CRM</div>
          <h1 className="text-page-title text-text-primary">Leads</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
            <Download size={14} strokeWidth={1.5} />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <Send size={14} strokeWidth={1.5} />
            Send to CRM
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-5 gap-2.5 mb-3">
        <MetricCard label="Total" value={enquiryStats.total}
          chartKey="total" isSelected={selectedMetrics.includes("total")} onToggle={toggleMetric} />
        <MetricCard label="Verified" value={enquiryStats.verified}
          subMetric={`${Math.round((enquiryStats.verified / enquiryStats.total) * 100)}% rate`}
          chartKey="verified" isSelected={selectedMetrics.includes("verified")} onToggle={toggleMetric} />
        <MetricCard label="Qualified" value={enquiryStats.qualified}
          subMetric={`${Math.round((enquiryStats.qualified / enquiryStats.total) * 100)}% rate`}
          chartKey="qualified" isSelected={selectedMetrics.includes("qualified")} onToggle={toggleMetric} />
        <MetricCard label="Not Qualified" value={enquiryStats.notQualified}
          chartKey="notQualified" isSelected={selectedMetrics.includes("notQualified")} onToggle={toggleMetric} />
        <MetricCard label="Pending" value={enquiryStats.pending}
          chartKey="pending" isSelected={selectedMetrics.includes("pending")} onToggle={toggleMetric} />
      </div>

      {/* Chart */}
      {selectedMetrics.length > 0 && (
        <div className="mb-5">
          <MetricChart
            metrics={selectedMetrics.map((k) => leadTrends[k]).filter(Boolean)}
            dates={leadDates} onRemove={toggleMetric}
            onAdd={toggleMetric} availableMetrics={leadMetricOptions}
            selectedKeys={selectedMetrics} maxMetrics={3} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={campaignFilter}
          onChange={(e) => {
            setCampaignFilter(e.target.value);
            setPage(1);
          }}
          className="h-8 px-3 pr-7 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
          style={selectStyle}
        >
          {campaignFilterOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5">
          {(["all", "qualified", "not_qualified", "pending"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-[5px] transition-colors duration-150 ${
                  statusFilter === s
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {s === "all"
                  ? "All"
                  : s === "not_qualified"
                  ? "Not Qualified"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            )
          )}
        </div>

        <div className="relative flex-1 max-w-[240px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-8 pl-8 pr-3 text-[12px] border border-border rounded-input bg-white focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Name", align: "left" },
                  { label: "Phone", align: "left" },
                  { label: "Campaign", align: "left" },
                  { label: "Created", align: "left" },
                  { label: "Enriched", align: "center" },
                  { label: "Verified", align: "center" },
                  { label: "AI Status", align: "left" },
                  { label: "Temp", align: "left" },
                  { label: "Status", align: "left" },
                  { label: "Qualified", align: "center" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-3 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead, i) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-3 py-2.5 text-[13px] text-text-primary font-medium whitespace-nowrap">
                    {lead.name}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary tabular-nums whitespace-nowrap">
                    {lead.phone}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary whitespace-nowrap max-w-[160px] truncate">
                    {lead.campaign}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">
                    {format(new Date(lead.createdAt), "dd MMM, HH:mm")}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <EnrichmentIcon status={lead.enrichmentStatus} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {lead.verified ? (
                      <ShieldCheck
                        size={14}
                        strokeWidth={2}
                        className="text-status-success inline-block"
                      />
                    ) : (
                      <span className="text-[11px] text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <QualificationBadge status={lead.aiQualification} />
                  </td>
                  <td className="px-3 py-2.5">
                    <TemperatureBadge temp={lead.temperature} />
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">
                    {formatLeadStatus(lead.leadStatus)}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {lead.sql ? (
                      <CheckCircle2
                        size={14}
                        strokeWidth={2}
                        className="text-status-success inline-block"
                      />
                    ) : (
                      <span className="text-[11px] text-text-tertiary">—</span>
                    )}
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
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            leads
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
      </div>

      {/* Slide-over Panel */}
      {selectedLead && (
        <LeadPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </motion.div>
  );
}
