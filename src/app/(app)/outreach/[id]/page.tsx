"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Pause,
  Play,
  Download,
  Send,
  RefreshCw,
  Search,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  outreachDetail,
  outreachContacts,
  disqualReasons,
} from "@/lib/outreach-data";
import type { ContactOutcome } from "@/lib/outreach-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function OutcomeBadge({ outcome }: { outcome: ContactOutcome }) {
  const config: Record<ContactOutcome, { label: string; cls: string }> = {
    qualified: { label: "Qualified", cls: "bg-[#F0FDF4] text-[#15803D]" },
    not_qualified: { label: "Not Qualified", cls: "bg-[#FEF2F2] text-[#DC2626]" },
    callback: { label: "Callback", cls: "bg-[#FEF3C7] text-[#92400E]" },
    no_answer: { label: "No Answer", cls: "bg-surface-secondary text-text-secondary" },
    not_called: { label: "Not Called", cls: "bg-surface-secondary text-text-tertiary" },
    busy: { label: "Busy", cls: "bg-[#FEF3C7] text-[#92400E]" },
    wrong_number: { label: "Wrong #", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { label, cls } = config[outcome];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

const PAGE_SIZE = 8;

export default function OutreachDetailPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const d = outreachDetail;
  const progressPercent = (d.called / d.totalContacts) * 100;

  const outcomeSegments = [
    { label: "Qualified", count: d.qualified, color: "#22C55E" },
    { label: "Not Qualified", count: d.notQualified, color: "#E53E3E" },
    { label: "Callback", count: d.callback, color: "#F5A623" },
    { label: "No Answer", count: d.noAnswer, color: "#D4D4D4" },
    { label: "Busy", count: d.busy, color: "#9B9B9B" },
    { label: "Wrong #", count: d.wrongNumber, color: "#6B6B6B" },
  ];
  const totalOutcomes = outcomeSegments.reduce((s, o) => s + o.count, 0);

  const filtered = useMemo(() => {
    if (!search) return outreachContacts;
    const s = search.toLowerCase();
    return outreachContacts.filter(
      (c) => c.name.toLowerCase().includes(s) || c.phone.includes(s)
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/outreach")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">
          Lead Generation › Outreach › {d.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-page-title text-text-primary">{d.name}</h1>
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
              In Progress ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-text-secondary">
            <span>{d.voiceAgent}</span>
            <span className="text-border">|</span>
            <span>{d.purpose}</span>
          </div>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium rounded-button border transition-colors duration-150 ${
            isPaused
              ? "bg-accent text-white border-transparent hover:bg-accent-hover"
              : "bg-white text-text-secondary border-border hover:bg-surface-page"
          }`}
        >
          {isPaused ? (
            <>
              <Play size={14} strokeWidth={1.5} />
              Resume
            </>
          ) : (
            <>
              <Pause size={14} strokeWidth={1.5} />
              Pause
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        <MetricCard label="Total" value={d.totalContacts} />
        <MetricCard label="Called" value={d.called} subMetric={`${Math.round((d.called / d.totalContacts) * 100)}% coverage`} />
        <MetricCard label="Connected" value={d.connected} subMetric={`${Math.round((d.connected / d.called) * 100)}% rate`} />
        <MetricCard label="Qualified" value={d.qualified} subMetric={`${Math.round((d.qualified / d.connected) * 100)}% qual rate`} />
        <MetricCard label="Not Qualified" value={d.notQualified} />
        <MetricCard label="Callback" value={d.callback} />
        <MetricCard label="No Answer" value={d.noAnswer} />
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-border rounded-card p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-medium text-text-primary">
            {d.called} of {d.totalContacts} called
          </span>
          <span className="text-[12px] text-text-tertiary tabular-nums">
            {d.remaining} remaining
          </span>
        </div>
        <div className="w-full bg-surface-secondary rounded-full h-2">
          <div
            className="bg-accent rounded-full h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Two columns: Outcome breakdown + Disqualification reasons */}
      <div className="grid grid-cols-[3fr_2fr] gap-5 mb-5">
        {/* Outcome Breakdown */}
        <div className="bg-white border border-border rounded-card p-5">
          <h3 className="text-card-title text-text-primary mb-4">Outcome Breakdown</h3>
          <div className="flex w-full h-6 rounded-full overflow-hidden mb-4">
            {outcomeSegments.map(
              (seg) =>
                seg.count > 0 && (
                  <div
                    key={seg.label}
                    style={{
                      width: `${(seg.count / totalOutcomes) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                    className="h-full"
                    title={`${seg.label}: ${seg.count}`}
                  />
                )
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {outcomeSegments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[11px] text-text-secondary">
                  {seg.label}:{" "}
                  <span className="font-medium text-text-primary tabular-nums">{seg.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disqualification Reasons */}
        <div className="bg-white border border-border rounded-card p-5">
          <h3 className="text-card-title text-text-primary mb-4">
            Top Disqualification Reasons
          </h3>
          <div className="space-y-3">
            {disqualReasons.map((r) => (
              <div key={r.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-text-secondary">{r.reason}</span>
                  <span className="text-[12px] font-medium text-text-primary tabular-nums">
                    {r.percentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-secondary rounded-full h-1.5">
                  <div
                    className="bg-text-tertiary rounded-full h-1.5"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-5">
        <button className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <Download size={13} strokeWidth={1.5} />
          Export Qualified (CSV)
        </button>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <Send size={13} strokeWidth={1.5} />
          Send to CRM
        </button>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <RefreshCw size={13} strokeWidth={1.5} />
          Create Follow-up
        </button>
      </div>

      {/* Contacts Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-section-header text-text-primary">Contacts</h3>
          <div className="relative max-w-[240px]">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-8 pl-8 pr-3 text-[13px] border border-border rounded-input bg-white focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Name", align: "left" },
                  { label: "Phone", align: "left" },
                  { label: "Outcome", align: "left" },
                  { label: "Duration", align: "right" },
                  { label: "Verified", align: "center" },
                  { label: "Key Notes", align: "left" },
                  { label: "Date", align: "left" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-4 py-2.5 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
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
                  className={`border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-4 py-2.5 text-[13px] text-text-primary font-medium whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-text-secondary tabular-nums whitespace-nowrap">
                    {c.phone}
                  </td>
                  <td className="px-4 py-2.5">
                    <OutcomeBadge outcome={c.outcome} />
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {c.duration !== null ? `${c.duration} min` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {c.verified ? (
                      <ShieldCheck size={14} strokeWidth={2} className="text-status-success inline-block" />
                    ) : (
                      <span className="text-[11px] text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-text-secondary max-w-[200px] truncate">
                    {c.keyNotes || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">
                    {c.calledAt ? format(new Date(c.calledAt), "dd MMM, HH:mm") : "—"}
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
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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
    </motion.div>
  );
}
