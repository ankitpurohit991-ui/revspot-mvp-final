"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  Database,
  Linkedin,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type EnrichStatus = "enriched" | "pending" | "failed";

interface EnrichmentRow {
  id: string;
  name: string;
  phone: string;
  campaign: string;
  status: EnrichStatus;
  dataPoints: number;
  enrichedAt: string | null;
}

const enrichmentQueue: EnrichmentRow[] = [
  { id: "er-1", name: "V***** R*****", phone: "98XXX XX342", campaign: "Prestige Lakeside", status: "enriched", dataPoints: 8, enrichedAt: "2026-03-22T10:30:00" },
  { id: "er-2", name: "S***** M*****", phone: "90XXX XX891", campaign: "Brigade Utopia", status: "enriched", dataPoints: 6, enrichedAt: "2026-03-22T09:15:00" },
  { id: "er-3", name: "A***** K*****", phone: "87XXX XX156", campaign: "Sobha Windsor", status: "enriched", dataPoints: 9, enrichedAt: "2026-03-22T08:00:00" },
  { id: "er-4", name: "P***** J*****", phone: "99XXX XX723", campaign: "Godrej Splendour", status: "pending", dataPoints: 0, enrichedAt: null },
  { id: "er-5", name: "R***** B*****", phone: "80XXX XX445", campaign: "Embassy Lake Terraces", status: "enriched", dataPoints: 7, enrichedAt: "2026-03-21T15:00:00" },
  { id: "er-6", name: "N***** D*****", phone: "91XXX XX867", campaign: "Assetz Mizumi PM R3", status: "enriched", dataPoints: 5, enrichedAt: "2026-03-21T14:00:00" },
  { id: "er-7", name: "M***** S*****", phone: "96XXX XX218", campaign: "Assetz Mizumi PM R3", status: "enriched", dataPoints: 8, enrichedAt: "2026-03-21T12:00:00" },
  { id: "er-8", name: "K***** G*****", phone: "88XXX XX534", campaign: "Prestige Lakeside", status: "pending", dataPoints: 0, enrichedAt: null },
  { id: "er-9", name: "D***** T*****", phone: "70XXX XX912", campaign: "Sobha Windsor", status: "enriched", dataPoints: 6, enrichedAt: "2026-03-20T16:00:00" },
  { id: "er-10", name: "G***** P*****", phone: "95XXX XX671", campaign: "Godrej Splendour", status: "failed", dataPoints: 0, enrichedAt: null },
  { id: "er-11", name: "T***** A*****", phone: "85XXX XX390", campaign: "Prestige Lakeside", status: "enriched", dataPoints: 9, enrichedAt: "2026-03-20T10:00:00" },
  { id: "er-12", name: "H***** V*****", phone: "93XXX XX148", campaign: "Brigade Utopia", status: "enriched", dataPoints: 4, enrichedAt: "2026-03-19T16:30:00" },
];

function StatusBadge({ status }: { status: EnrichStatus }) {
  const config = {
    enriched: { icon: CheckCircle2, label: "Enriched", cls: "bg-[#F0FDF4] text-[#15803D]" },
    pending: { icon: Clock, label: "Pending", cls: "bg-[#FEF3C7] text-[#92400E]" },
    failed: { icon: XCircle, label: "Failed", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { icon: Icon, label, cls } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      <Icon size={11} strokeWidth={2} />
      {label}
    </span>
  );
}

function Toggle({ enabled, onToggle, label, sub, disabled }: { enabled: boolean; onToggle: () => void; label: string; sub?: string; disabled?: boolean }) {
  const [on, setOn] = useState(enabled);
  return (
    <div className={`flex items-center justify-between py-3 ${disabled ? "opacity-50" : ""}`}>
      <div>
        <span className="text-[13px] text-text-primary">{label}</span>
        {sub && <span className="text-[11px] text-text-tertiary ml-2">{sub}</span>}
      </div>
      <button
        onClick={() => { if (!disabled) { setOn(!on); onToggle(); } }}
        disabled={disabled}
        className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${on ? "bg-accent" : "bg-silver-light"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${on ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function EnrichmentPage() {
  const [page, setPage] = useState(1);

  const enrichedCount = enrichmentQueue.filter((r) => r.status === "enriched").length;
  const totalCount = enrichmentQueue.length;
  const enrichRate = Math.round((enrichedCount / totalCount) * 100);
  const avgDataPoints = Math.round(enrichmentQueue.filter((r) => r.dataPoints > 0).reduce((a, b) => a + b.dataPoints, 0) / enrichedCount);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginated = enrichmentQueue.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      <div className="mb-6">
        <div className="text-meta text-text-secondary mb-1">CRM</div>
        <h1 className="text-page-title text-text-primary">Enrichment</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Contacts enriched", value: enrichedCount, sub: `of ${totalCount} total` },
          { label: "Enrichment rate", value: `${enrichRate}%`, sub: "overall" },
          { label: "Avg data points", value: avgDataPoints, sub: "per contact" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-card px-5 py-4">
            <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px]">{stat.label}</div>
            <div className="text-[24px] font-semibold text-text-primary mt-1 tabular-nums">
              {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-[11px] text-text-tertiary mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* Queue Table */}
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="text-section-header text-text-primary">Enrichment Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  {[
                    { label: "Contact", align: "left" },
                    { label: "Campaign", align: "left" },
                    { label: "Status", align: "left" },
                    { label: "Data Points", align: "center" },
                    { label: "Enriched At", align: "left" },
                  ].map((h) => (
                    <th key={h.label} className={`px-4 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr key={row.id} className={`border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                    <td className="px-4 py-2.5">
                      <div className="text-[13px] text-text-primary font-medium">{row.name}</div>
                      <div className="text-[11px] text-text-tertiary tabular-nums">{row.phone}</div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">{row.campaign}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-[13px] font-medium tabular-nums ${row.dataPoints > 0 ? "text-text-primary" : "text-text-tertiary"}`}>
                        {row.dataPoints > 0 ? `+${row.dataPoints}` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-text-secondary whitespace-nowrap">
                      {row.enrichedAt
                        ? new Date(row.enrichedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
            <span className="text-[12px] text-text-tertiary">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150">
                <ChevronLeft size={14} strokeWidth={1.5} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150">
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-card-title text-text-primary mb-3">Auto-Enrichment</h3>
            <Toggle enabled={true} onToggle={() => {}} label="Auto-enrich new leads" sub="Recommended" />
            <p className="text-[11px] text-text-tertiary leading-relaxed mt-1">
              Automatically enrich leads as they come in from campaigns. Uses Revspot Database.
            </p>
          </div>

          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-card-title text-text-primary mb-3">Data Sources</h3>
            <div className="space-y-0 divide-y divide-border-subtle">
              <div className="flex items-center gap-3 py-3 first:pt-0">
                <div className="w-8 h-8 rounded-[6px] bg-surface-secondary flex items-center justify-center">
                  <Database size={15} strokeWidth={1.5} className="text-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-text-primary font-medium">Revspot Database</div>
                  <div className="text-[11px] text-status-success">Connected</div>
                </div>
                <Toggle enabled={true} onToggle={() => {}} label="" />
              </div>
              <div className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-[6px] bg-surface-secondary flex items-center justify-center">
                  <Linkedin size={15} strokeWidth={1.5} className="text-text-tertiary" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-text-primary font-medium">LinkedIn</div>
                  <div className="text-[11px] text-text-tertiary">Coming soon</div>
                </div>
                <Toggle enabled={false} onToggle={() => {}} label="" disabled />
              </div>
              <div className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-[6px] bg-surface-secondary flex items-center justify-center">
                  <Building2 size={15} strokeWidth={1.5} className="text-text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-text-primary font-medium">Company Data</div>
                  <div className="text-[11px] text-status-success">Connected</div>
                </div>
                <Toggle enabled={true} onToggle={() => {}} label="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
