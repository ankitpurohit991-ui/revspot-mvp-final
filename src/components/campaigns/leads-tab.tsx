"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Send,
  Zap,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { campaignLeads } from "@/lib/campaign-data";
import type { CampaignLead, LeadTemperature, LeadQualification, EnrichmentStatus } from "@/lib/campaign-data";
import { LeadDetailPanel } from "./lead-detail-panel";

function TemperatureBadge({ temp }: { temp: LeadTemperature }) {
  const config = {
    hot: { label: "Hot", cls: "bg-[#FEF2F2] text-[#DC2626]" },
    warm: { label: "Warm", cls: "bg-[#FEF3C7] text-[#92400E]" },
    lukewarm: { label: "Lukewarm", cls: "bg-[#F0F0F0] text-text-secondary" },
    cold: { label: "Cold", cls: "bg-[#EFF6FF] text-[#1D4ED8]" },
  };
  const { label, cls } = config[temp];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

function QualificationBadge({ status }: { status: LeadQualification }) {
  const config = {
    qualified: { label: "Qualified", cls: "bg-[#F0FDF4] text-[#15803D]" },
    not_qualified: { label: "Not Qualified", cls: "bg-[#FEF2F2] text-[#DC2626]" },
    pending: { label: "Pending", cls: "bg-[#FEF3C7] text-[#92400E]" },
  };
  const { label, cls } = config[status];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

function EnrichmentBadge({ status }: { status: EnrichmentStatus }) {
  const config = {
    enriched: { icon: CheckCircle2, cls: "text-status-success" },
    not_enriched: { icon: X, cls: "text-text-tertiary" },
    failed: { icon: X, cls: "text-status-error" },
  };
  const { icon: Icon, cls } = config[status];
  return <Icon size={14} strokeWidth={2} className={cls} />;
}

function formatLeadStatus(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PAGE_SIZE = 10;

export function LeadsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<CampaignLead | null>(null);

  const filtered = useMemo(() => {
    if (!search) return campaignLeads;
    const s = search.toLowerCase();
    return campaignLeads.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.phone.includes(s) ||
        l.adset.toLowerCase().includes(s)
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-[260px] flex-1">
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
            className="w-full h-8 pl-8 pr-3 text-[13px] border border-border rounded-input bg-white focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: RefreshCw, label: "Sync" },
            { icon: Download, label: "Export" },
            { icon: Zap, label: "Enrich" },
            { icon: Send, label: "Send to CRM" },
            { icon: Copy, label: "Copy to Campaign" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page hover:text-text-primary transition-colors duration-150"
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </button>
          ))}
          <button className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page hover:text-text-primary transition-colors duration-150">
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            Filters
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="text-[12px] text-text-tertiary mb-3">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
        {filtered.length} leads
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
                  { label: "Created", align: "left" },
                  { label: "Enriched", align: "center" },
                  { label: "Verified", align: "center" },
                  { label: "AI Status", align: "left" },
                  { label: "Temp", align: "left" },
                  { label: "Lead Status", align: "left" },
                  { label: "SQL", align: "center" },
                  { label: "CRM", align: "left" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-3 py-2.5 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
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
                  <td className="px-3 py-2.5 text-[13px] text-text-secondary tabular-nums whitespace-nowrap">
                    {lead.phone}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">
                    {format(new Date(lead.createdAt), "dd MMM, HH:mm")}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <EnrichmentBadge status={lead.enrichmentStatus} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {lead.verified ? (
                      <ShieldCheck size={14} strokeWidth={2} className="text-status-success inline-block" />
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
                      <CheckCircle2 size={14} strokeWidth={2} className="text-status-success inline-block" />
                    ) : (
                      <span className="text-[11px] text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-secondary whitespace-nowrap max-w-[120px] truncate">
                    {lead.sentToCRM || "—"}
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
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} leads
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

      {/* Lead Detail Panel */}
      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </>
  );
}
