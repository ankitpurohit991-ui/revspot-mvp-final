"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  CircleCheck, AlertTriangle, XCircle, TrendingDown, Lightbulb, Target,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { campaignDiagnosis, adSetsData, campaignDetail } from "@/lib/campaign-data";
import type { AdSetRow } from "@/lib/campaign-data";

// ── Helpers ─────────────────────────────────────────────────

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Mock trend data generators per metric
function makeTrendData(startVal: number, endVal: number, label: string, prefix = "₹", suffix = "") {
  return Array.from({ length: 14 }, (_, i) => {
    const progress = i / 13;
    const base = startVal + (endVal - startVal) * progress + (Math.random() * (startVal * 0.06) - startVal * 0.03);
    return { date: `Mar ${10 + i}`, value: Math.round(base * 10) / 10 };
  });
}

const trendDataMap: Record<string, { data: { date: string; value: number }[]; prefix: string; suffix: string; target?: number }> = {
  spend: { data: makeTrendData(6500, 8200, "Spend"), prefix: "₹", suffix: "" },
  leads: { data: makeTrendData(4, 8, "Leads"), prefix: "", suffix: "" },
  qualified: { data: makeTrendData(0.5, 1.2, "Qualified"), prefix: "", suffix: "" },
  cpl: { data: makeTrendData(1400, 1100, "CPL"), prefix: "₹", suffix: "", target: 1200 },
  ctr: { data: makeTrendData(1.6, 2.1, "CTR"), prefix: "", suffix: "%" },
  cvr: { data: makeTrendData(3.8, 4.8, "CVR"), prefix: "", suffix: "%" },
  verificationRate: { data: makeTrendData(18, 22.6, "Verification Rate"), prefix: "", suffix: "%" },
  aiQualRate: { data: makeTrendData(15, 18.3, "AI Qual Rate"), prefix: "", suffix: "%" },
  sqlRate: { data: makeTrendData(9, 11.8, "SQL Rate"), prefix: "", suffix: "%" },
  verifiedSql: { data: makeTrendData(45, 52.4, "Verified→SQL"), prefix: "", suffix: "%" },
  totalSpend: { data: makeTrendData(170000, 220000, "Total Spend"), prefix: "₹", suffix: "" },
  cpm: { data: makeTrendData(230, 245, "CPM"), prefix: "₹", suffix: "" },
  cpc: { data: makeTrendData(62, 57, "CPC"), prefix: "₹", suffix: "" },
  cpvl: { data: makeTrendData(4800, 5238, "CPVL"), prefix: "₹", suffix: "" },
  cpql: { data: makeTrendData(9200, 10000, "CPQL"), prefix: "₹", suffix: "" },
  frequency: { data: makeTrendData(2.0, 2.4, "Frequency"), prefix: "", suffix: "" },
  budgetPacing: { data: makeTrendData(92, 97.5, "Budget Pacing"), prefix: "", suffix: "%" },
};

// ── Section Label ───────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3 mt-2">{children}</div>
  );
}

// ── Metric Card with Tooltip + Click-to-chart ───────────────

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: number; direction: "up" | "down"; positive?: boolean };
  tooltip: string;
  healthDot?: "green" | "yellow" | "red";
  chartKey?: string;
  isHeadline?: boolean;
  activeChart: string | null;
  onChartToggle: (key: string | null) => void;
}

function MetricCard({
  label, value, sub, trend, tooltip, healthDot, chartKey, isHeadline, activeChart, onChartToggle,
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trendPositive = trend ? (trend.positive !== undefined ? trend.positive : trend.direction === "up") : false;
  const isActive = chartKey ? activeChart === chartKey : false;

  const handleMouseEnter = () => { timeoutRef.current = setTimeout(() => setShowTooltip(true), 300); };
  const handleMouseLeave = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShowTooltip(false); };

  return (
    <button
      onClick={() => chartKey && onChartToggle(isActive ? null : chartKey)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative text-left w-full rounded-card transition-all duration-150 ${
        isHeadline ? "bg-surface-page border border-border px-5 py-4" : "bg-white border border-border px-4 py-3"
      } ${isActive ? "ring-1 ring-accent/20 border-accent" : "hover:shadow-card-hover hover:-translate-y-px"} ${
        chartKey ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {healthDot && (
        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
          healthDot === "green" ? "bg-status-success" : healthDot === "yellow" ? "bg-status-warning" : "bg-status-error"
        }`} />
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px]">{label}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${trendPositive ? "text-status-success" : "text-status-error"}`}>
            {trend.direction === "up" ? <ArrowUpRight size={11} strokeWidth={2.5} /> : <ArrowDownRight size={11} strokeWidth={2.5} />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className={`${isHeadline ? "text-[26px]" : "text-[20px]"} font-semibold text-text-primary leading-tight tabular-nums`}>{value}</div>
      {sub && <div className="mt-1 text-[11px] text-text-tertiary">{sub}</div>}
      {isActive && chartKey && (
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full" />
      )}

      <AnimatePresence>
        {showTooltip && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-text-primary text-white text-[12px] leading-relaxed px-3 py-2 rounded-[6px] shadow-lg max-w-[280px] pointer-events-none">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Inline Chart ────────────────────────────────────────────

function InlineChart({ chartKey }: { chartKey: string }) {
  const td = trendDataMap[chartKey];
  if (!td) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 220 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white border border-border rounded-card p-4 overflow-hidden"
    >
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart data={td.data} margin={{ top: 5, right: 15, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id={`fill-${chartKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} interval={2} />
          <YAxis tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false}
            tickFormatter={(v: number) => td.prefix === "₹" ? (v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`) : `${v}${td.suffix}`} />
          <RTooltip contentStyle={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "6px", fontSize: "12px" }}
            formatter={(v) => [`${td.prefix}${Number(v).toLocaleString("en-IN")}${td.suffix}`, chartKey]} />
          {td.target && (
            <ReferenceLine y={td.target} stroke="#9B9B9B" strokeDasharray="6 4"
              label={{ value: `Target ${td.prefix}${td.target.toLocaleString("en-IN")}`, position: "insideTopRight", fill: "#9B9B9B", fontSize: 10 }} />
          )}
          <Area type="monotone" dataKey="value" stroke="#1A1A1A" strokeWidth={2} fill={`url(#fill-${chartKey})`}
            dot={{ r: 2, fill: "#1A1A1A", strokeWidth: 0 }} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ── Badges ──────────────────────────────────────────────────

function DiagnosisBadge({ diagnosis }: { diagnosis: AdSetRow["diagnosis"] }) {
  const cfg = {
    "on-track": { icon: CircleCheck, label: "On Track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": { icon: AlertTriangle, label: "Attention", cls: "text-[#92400E] bg-[#FEF3C7]" },
    "pause-candidate": { icon: XCircle, label: "Pause", cls: "text-status-error bg-[#FEF2F2]" },
  };
  const { icon: Icon, label, cls } = cfg[diagnosis];
  return <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}><Icon size={11} strokeWidth={2} /> {label}</span>;
}

function CampaignStatusBadge({ status }: { status: "on-target" | "near-target" | "off-target" }) {
  const cfg = {
    "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
    "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
    "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { label, cls } = cfg[status];
  return <span className={`inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-badge ${cls}`}>{label}</span>;
}

// ── Funnel stages (Leads → Qualified only) ──────────────────

const funnelStages = [
  { label: "Leads", value: 186, color: "rgba(26,26,26,0.85)" },
  { label: "Verified", value: 42, color: "rgba(26,26,26,0.65)" },
  { label: "AI Qualified", value: 34, color: "rgba(26,26,26,0.50)" },
  { label: "Qualified (SQL)", value: 22, color: "rgba(26,26,26,0.35)" },
];

// ══════════════════════════════════════════════════════════════

export function AnalysisTab() {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30d");

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 10px center",
  };

  const mc = { activeChart, onChartToggle: setActiveChart }; // shared props

  return (
    <div className="space-y-6">
      {/* Date Range + Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-badge bg-surface-secondary text-text-secondary">
            <Target size={13} strokeWidth={1.5} />
            Target CPL: ₹{campaignDetail.targetCPL.toLocaleString("en-IN")}
          </span>
          <CampaignStatusBadge status={campaignDiagnosis.status} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[12px] text-text-secondary">Mar 1 — Mar 23, 2026</div>
            <div className="text-[11px] text-text-tertiary">vs previous period (Feb 1 — Feb 28)</div>
          </div>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="h-8 px-3 pr-8 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
            style={selectStyle}>
            <option value="1d">Yesterday</option><option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option><option value="30d">Last 30 days</option>
            <option value="all">Lifetime</option>
          </select>
        </div>
      </div>

      {/* ═══ KEY METRICS ═══ */}
      <SectionLabel>Key Metrics</SectionLabel>
      <div className="grid grid-cols-4 gap-3">
        <MetricCard isHeadline label="Spend" value="₹2.2L" sub="₹2,20,000" chartKey="spend"
          trend={{ value: 25.9, direction: "up" }} tooltip="Total amount spent on this campaign in the selected period." {...mc} />
        <MetricCard isHeadline label="Leads" value="186" chartKey="leads"
          trend={{ value: 12, direction: "up" }} tooltip="Total lead form submissions from this campaign." {...mc} />
        <MetricCard isHeadline label="Qualified" value="22" sub="11.8% of total" chartKey="qualified"
          trend={{ value: 7.9, direction: "up" }} tooltip="Leads that passed all qualification criteria and are ready for sales." {...mc} />
        <MetricCard isHeadline label="CPL vs Target" value="₹1,183" sub="Target: ₹1,200 · 1.4% under" chartKey="cpl"
          trend={{ value: 5, direction: "down", positive: true }} tooltip="Your actual cost per lead compared to your target." {...mc} />
      </div>
      <AnimatePresence>{activeChart && ["spend", "leads", "qualified", "cpl"].includes(activeChart) && <InlineChart chartKey={activeChart} />}</AnimatePresence>

      {/* ═══ LEAD FUNNEL ═══ */}
      <div className="grid grid-cols-[1fr_1fr] gap-5">
        {/* Funnel Card */}
        <div className="bg-white border border-border rounded-card p-5">
          <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-4">Lead Funnel</div>
          <div className="space-y-1.5">
            {funnelStages.map((stage, i) => {
              const maxVal = funnelStages[0].value;
              const widthPct = Math.max((stage.value / maxVal) * 100, 12);
              const dropOff = i > 0 ? ((stage.value / funnelStages[i - 1].value) * 100).toFixed(1) : null;
              return (
                <div key={stage.label}>
                  {dropOff && <div className="text-[10px] text-text-tertiary pl-[100px] mb-0.5">{dropOff}% ↓</div>}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-text-secondary w-[90px] text-right shrink-0">{stage.label}</span>
                    <div className="flex-1 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                        className="h-7 rounded-[4px] flex items-center px-2.5"
                        style={{ backgroundColor: stage.color }}
                      >
                        <span className="text-[11px] font-semibold text-white tabular-nums">{stage.value.toLocaleString("en-IN")}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Rates */}
        <div className="grid grid-cols-2 gap-3 content-start">
          <MetricCard label="CTR" value="2.1%" sub="Impressions → Clicks" chartKey="ctr"
            trend={{ value: 15, direction: "up" }} tooltip="Click-through rate. Industry average for real estate: 1.5-2.5%." {...mc} />
          <MetricCard label="CVR" value="4.8%" sub="Clicks → Leads" chartKey="cvr"
            trend={{ value: 8, direction: "up" }} tooltip="Conversion rate. Percentage of clicks that became leads." {...mc} />
          <MetricCard label="Verification" value="22.6%" sub="Leads → Verified" chartKey="verificationRate"
            trend={{ value: 22.1, direction: "up" }} tooltip="Percentage of leads with valid contact info. Low = bot traffic." {...mc} />
          <MetricCard label="SQL Rate" value="11.8%" sub="Leads → Qualified" chartKey="sqlRate"
            trend={{ value: 7.9, direction: "up" }} tooltip="End-to-end funnel efficiency. Percentage of all leads that qualified." {...mc} />
        </div>
      </div>
      <AnimatePresence>{activeChart && ["ctr", "cvr", "verificationRate", "aiQualRate", "sqlRate", "verifiedSql"].includes(activeChart) && <InlineChart chartKey={activeChart} />}</AnimatePresence>

      {/* ═══ COST BREAKDOWN ═══ */}
      <SectionLabel>Cost Breakdown</SectionLabel>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total Spend" value="₹2.2L" sub="₹2,20,000" chartKey="totalSpend"
          trend={{ value: 25.9, direction: "up" }} tooltip="Total amount spent in the selected period." {...mc} />
        <MetricCard label="CPM" value="₹245" sub="Cost per 1,000 impressions" chartKey="cpm"
          trend={{ value: 3.1, direction: "up", positive: false }} tooltip="Rising CPM = more competition or declining ad relevance." {...mc} />
        <MetricCard label="CPC" value="₹57" sub="Cost per click" chartKey="cpc"
          trend={{ value: 2.3, direction: "down", positive: true }} tooltip="Higher CTR generally lowers CPC." {...mc} />
        <MetricCard label="CPL" value="₹1,183" sub="vs target ₹1,200 · 1.4% under" chartKey="cpl"
          trend={{ value: 5, direction: "down", positive: true }} tooltip="Primary cost efficiency metric." {...mc} />
        <MetricCard label="CPVL" value="₹5,238" sub="Cost per verified lead" chartKey="cpvl"
          trend={{ value: 3.1, direction: "up", positive: false }} tooltip="High CPVL relative to CPL = many invalid leads." {...mc} />
        <MetricCard label="CPQL" value="₹10,000" sub="Cost per qualified lead" chartKey="cpql"
          trend={{ value: 5, direction: "up", positive: false }} tooltip="True cost of acquiring a sales-ready lead." {...mc} />
      </div>
      <AnimatePresence>{activeChart && ["totalSpend", "cpm", "cpc", "cpvl", "cpql"].includes(activeChart) && <InlineChart chartKey={activeChart} />}</AnimatePresence>

      {/* ═══ CAMPAIGN HEALTH ═══ */}
      <SectionLabel>Campaign Health</SectionLabel>
      <div className="flex items-center gap-2 px-4 py-2 bg-[#F0FDF4] border border-[#22C55E]/15 rounded-[6px] mb-3">
        <CircleCheck size={14} strokeWidth={2} className="text-[#15803D]" />
        <span className="text-[13px] text-[#15803D] font-medium">All systems healthy ✓</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="CTR" value="2.1%" sub="Ad engagement" healthDot="green" chartKey="ctr"
          trend={{ value: 15, direction: "up" }} tooltip="Below 1.5% = creative fatigue. Yours is healthy." {...mc} />
        <MetricCard label="CVR" value="4.8%" sub="Form conversion" healthDot="green" chartKey="cvr"
          trend={{ value: 8, direction: "up" }} tooltip="Below 3% = form friction or misaligned messaging." {...mc} />
        <MetricCard label="CPL vs Target" value="₹1,183 / ₹1,200" sub="1.4% under" healthDot="green"
          trend={{ value: 5, direction: "down", positive: true }} tooltip="Green = at or below target." {...mc} />
        <MetricCard label="CPM" value="₹245" sub="Auction cost" healthDot="green" chartKey="cpm"
          trend={{ value: 3.1, direction: "up" }} tooltip="Stable CPM is healthy. Rising >15% in 7 days = warning." {...mc} />
        <MetricCard label="Budget Pacing" value="97.5%" sub="₹7,800 of ₹8,000 daily" healthDot="green" chartKey="budgetPacing"
          tooltip="Below 80% = targeting too narrow or bids too low." {...mc} />
        <MetricCard label="Frequency" value="2.4" sub="Max recommended: 3.0" healthDot="green" chartKey="frequency"
          trend={{ value: 0.3, direction: "up", positive: false }} tooltip="Above 3.0 = audience saturation, refresh creatives." {...mc} />
      </div>
      <AnimatePresence>{activeChart && ["budgetPacing", "frequency"].includes(activeChart) && <InlineChart chartKey={activeChart} />}</AnimatePresence>

      {/* ═══ CAMPAIGN DIAGNOSIS ═══ */}
      <SectionLabel>AI Diagnosis</SectionLabel>
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-section-header text-text-primary">Campaign Diagnosis</h3>
          <CampaignStatusBadge status={campaignDiagnosis.status} />
        </div>
        <p className="text-[13px] text-text-primary leading-relaxed mb-5">{campaignDiagnosis.summary}</p>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">Why</span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.reasons.map((r, i) => (
                <li key={i} className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-text-tertiary before:rounded-full">{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Lightbulb size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">What to do</span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.recommendations.map((r, i) => (
                <li key={i} className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-accent before:rounded-full">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ═══ AD SETS TABLE ═══ */}
      <SectionLabel>Ad Set Breakdown</SectionLabel>
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Ad Set", align: "left" }, { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" }, { label: "QLs", align: "right" },
                  { label: "CPL", align: "right" }, { label: "CPQL", align: "right" },
                  { label: "CTR", align: "right" }, { label: "CVR", align: "right" },
                  { label: "Freq", align: "right" }, { label: "Diagnosis", align: "center" },
                ].map((h) => (
                  <th key={h.label} className={`px-3 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adSetsData.map((adset, i) => (
                <tr key={adset.id} className={`border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary font-medium whitespace-nowrap max-w-[180px] truncate">{adset.name}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{formatCurrency(adset.spend)}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.leads}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.qualifiedLeads}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">₹{adset.cpl.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.cpql > 0 ? `₹${adset.cpql.toLocaleString("en-IN")}` : "—"}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.ctr}%</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.ctlPercent}%</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">2.4</td>
                  <td className="px-3 py-2.5 text-center"><DiagnosisBadge diagnosis={adset.diagnosis} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
