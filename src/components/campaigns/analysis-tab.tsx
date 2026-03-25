"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from "recharts";
import {
  CircleCheck, AlertTriangle, XCircle, TrendingDown, Lightbulb, Target,
  ArrowUpRight, ArrowDownRight, Calendar,
} from "lucide-react";
import { campaignDiagnosis, adSetsData, campaignDetail } from "@/lib/campaign-data";
import type { AdSetRow } from "@/lib/campaign-data";

// ── Helpers ─────────────────────────────────────────────────

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ── CPL Trend Data ──────────────────────────────────────────

const cplTrendData = Array.from({ length: 30 }, (_, i) => {
  const base = 1400 - (i * 10) + (Math.random() * 80 - 40);
  return { date: `${i < 8 ? "Feb" : "Mar"} ${i < 8 ? 22 + i : i - 7}`, cpl: Math.round(Math.max(1050, Math.min(1500, base))), target: 1200 };
});

// ── Tooltip Wrapper ─────────────────────────────────────────

function MetricTooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = () => {
    const t = setTimeout(() => setShow(true), 300);
    setTimer(t);
  };
  const onLeave = () => {
    if (timer) clearTimeout(timer);
    setShow(false);
  };

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {children}
      {show && (
        <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[260px] bg-text-primary text-white text-[12px] leading-relaxed px-3 py-2 rounded-[6px] shadow-lg pointer-events-none animate-fade-in">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-text-primary rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}

// ── Metric Card ─────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: number; direction: "up" | "down"; positive?: boolean };
  tooltip: string;
  healthDot?: "green" | "yellow" | "red";
  primary?: boolean;
}

function MetricCard({ label, value, sub, trend, tooltip, healthDot, primary }: MetricCardProps) {
  const trendPositive = trend ? (trend.positive !== undefined ? trend.positive : trend.direction === "up") : false;

  return (
    <MetricTooltip text={tooltip}>
      <div className={`relative border rounded-card text-left w-full transition-all duration-150 hover:shadow-card-hover hover:-translate-y-px ${
        primary ? "bg-white border-border px-5 py-4" : "bg-white border-border px-4 py-3"
      }`}>
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
        <span className={`font-semibold text-text-primary leading-tight tabular-nums ${primary ? "text-[24px]" : "text-[20px]"}`}>{value}</span>
        {sub && <div className="mt-1 text-[11px] text-text-tertiary">{sub}</div>}
      </div>
    </MetricTooltip>
  );
}

// ── Badges ──────────────────────────────────────────────────

function DiagnosisBadge({ diagnosis }: { diagnosis: AdSetRow["diagnosis"] }) {
  const config = {
    "on-track": { icon: CircleCheck, label: "On Track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": { icon: AlertTriangle, label: "Attention", cls: "text-[#92400E] bg-[#FEF3C7]" },
    "pause-candidate": { icon: XCircle, label: "Pause", cls: "text-status-error bg-[#FEF2F2]" },
  };
  const { icon: Icon, label, cls } = config[diagnosis];
  return <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}><Icon size={11} strokeWidth={2} />{label}</span>;
}

function CampaignStatusBadge({ status }: { status: "on-target" | "near-target" | "off-target" }) {
  const config = {
    "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
    "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
    "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { label, cls } = config[status];
  return <span className={`inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-badge ${cls}`}>{label}</span>;
}

// ── Funnel Visualization ────────────────────────────────────

const funnelStages = [
  { label: "Impressions", value: 89400, rate: null },
  { label: "Clicks", value: 3850, rate: "4.3%" },
  { label: "Leads", value: 186, rate: "4.8%" },
  { label: "Verified", value: 42, rate: "22.6%" },
  { label: "AI Qualified", value: 34, rate: "81.0%" },
  { label: "Qualified", value: 22, rate: "64.7%" },
];

type AnalysisSubTab = "funnel" | "cost" | "health";

// ── Main Component ──────────────────────────────────────────

export function AnalysisTab() {
  const [subTab, setSubTab] = useState<AnalysisSubTab>("funnel");
  const [dateRange, setDateRange] = useState("30d");

  const dateRangeOptions = [
    { value: "1d", label: "Yesterday" },
    { value: "7d", label: "Last 7 days" },
    { value: "14d", label: "Last 14 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "lifetime", label: "Lifetime" },
  ];

  // Health statuses
  const healthCards = [
    { label: "CTR", value: "2.1%", sub: "Ad engagement health", trend: { value: 15, direction: "up" as const }, dot: "green" as const, tooltip: "Ad engagement health. Below 1.5% typically indicates creative fatigue or poor audience targeting. Your current CTR is healthy." },
    { label: "CVR", value: "4.8%", sub: "Form conversion health", trend: { value: 8, direction: "up" as const }, dot: "green" as const, tooltip: "Landing page and form conversion health. Below 3% may indicate form friction, slow page load, or misaligned messaging." },
    { label: "CPL vs Target", value: "₹1,183 / ₹1,200", sub: "1.4% under target", trend: { value: 5, direction: "down" as const, positive: true }, dot: "green" as const, tooltip: "How your actual cost per lead compares to your target. Green means you're at or below target." },
    { label: "CPM", value: "₹245", sub: "Auction competitiveness", trend: { value: 3.1, direction: "up" as const }, dot: "green" as const, tooltip: "Auction cost health. Rapidly rising CPM indicates increased competition. Stable or declining CPM is healthy." },
    { label: "Budget Pacing", value: "97.5%", sub: "₹7,800 of ₹8,000 daily", trend: { value: 0, direction: "up" as const }, dot: "green" as const, tooltip: "How much of your daily budget is utilized. Below 80% means ads aren't reaching enough people." },
    { label: "Frequency", value: "2.4", sub: "Recommended max: 3.0", trend: { value: 0.3, direction: "up" as const, positive: false }, dot: "green" as const, tooltip: "Average times each person saw your ad. Above 3.0 indicates audience saturation — consider refreshing creatives." },
  ];

  const allHealthGreen = healthCards.every((c) => c.dot === "green");

  return (
    <div className="space-y-5">
      {/* Date Range + Target CPL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-badge bg-surface-secondary text-text-secondary">
            <Target size={13} strokeWidth={1.5} />
            Target CPL: ₹{campaignDetail.targetCPL.toLocaleString("en-IN")}
          </span>
          <CampaignStatusBadge status={campaignDiagnosis.status} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-text-tertiary">
            <span>Mar 1 — Mar 23, 2026</span>
            <span className="block">vs Feb 1 — Feb 28</span>
          </div>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="h-8 px-3 pr-8 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
            {dateRangeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ═══ HEADLINE METRICS (always visible) ═══ */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard primary label="Spend" value="₹2.2L" sub="₹2,20,000" trend={{ value: 25.9, direction: "up" }} tooltip="Total amount spent on this campaign in the selected period." />
        <MetricCard primary label="Leads" value="186" trend={{ value: 12, direction: "up" }} tooltip="Total lead form submissions from this campaign." />
        <MetricCard primary label="Qualified" value="22" sub="11.8% of total" trend={{ value: 7.9, direction: "up" }} tooltip="Leads that passed all qualification criteria and are ready for sales follow-up." />
        <MetricCard primary label="CPL vs Target" value="₹1,183" sub="Target: ₹1,200 · 1.4% under" trend={{ value: 5, direction: "down", positive: true }} tooltip="Your actual cost per lead compared to your target. Under target means you're performing better than planned." />
      </div>

      {/* ═══ SUB-TABS ═══ */}
      <div className="flex items-center gap-0 border-b border-border">
        {([
          { key: "funnel" as const, label: "Funnel" },
          { key: "cost" as const, label: "Cost" },
          { key: "health" as const, label: "Health" },
        ]).map((tab) => (
          <button key={tab.key} onClick={() => setSubTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              subTab === tab.key ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}>
            {tab.label}
            {subTab === tab.key && <motion.div layoutId="analysis-subtab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" transition={{ duration: 0.15 }} />}
          </button>
        ))}
      </div>

      {/* ═══ FUNNEL TAB ═══ */}
      {subTab === "funnel" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-5">
          {/* Funnel Visualization */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-5">Lead Funnel</h3>
            <div className="space-y-2">
              {funnelStages.map((stage, i) => {
                const maxVal = funnelStages[0].value;
                const pct = (stage.value / maxVal) * 100;
                const opacity = 1 - (i * 0.12);
                return (
                  <div key={stage.label} className="flex items-center gap-3">
                    <span className="text-[11px] text-text-secondary w-[90px] text-right shrink-0">{stage.label}</span>
                    <div className="flex-1 h-6 bg-surface-secondary rounded-[4px] overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                        className="h-full rounded-[4px]"
                        style={{ backgroundColor: `rgba(26,26,26,${opacity})` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-text-primary tabular-nums">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-tertiary w-[40px] tabular-nums">{stage.rate || ""}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate Cards */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="CTR" value="2.1%" sub="Impressions → Clicks" trend={{ value: 15, direction: "up" }} tooltip="Click-through rate. Percentage of people who saw your ad and clicked. Industry average for real estate: 1.5-2.5%." />
            <MetricCard label="CVR" value="4.8%" sub="Clicks → Leads" trend={{ value: 8, direction: "up" }} tooltip="Conversion rate. Percentage of ad clicks that resulted in a lead form submission." />
            <MetricCard label="Verification Rate" value="22.6%" sub="Leads → Verified" trend={{ value: 22.1, direction: "up" }} tooltip="Percentage of total leads with valid, verified contact information. Low rates may indicate bot traffic." />
            <MetricCard label="AI Qualification Rate" value="18.3%" sub="Verified → AI Qualified" trend={{ value: 5.2, direction: "up" }} tooltip="Percentage of verified leads that passed AI voice agent qualification." />
            <MetricCard label="SQL Rate" value="11.8%" sub="Total Leads → Qualified" trend={{ value: 7.9, direction: "up" }} tooltip="Overall qualification rate. Percentage of all leads that became sales-qualified." />
            <MetricCard label="Verified → SQL" value="52.4%" sub="Verified → Qualified" trend={{ value: 4.1, direction: "up" }} tooltip="Of leads that were real and verified, what percentage ultimately qualified. Isolates qualification quality from verification quality." />
          </div>
        </motion.div>
      )}

      {/* ═══ COST TAB ═══ */}
      {subTab === "cost" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Total Spend" value="₹2.2L" sub="₹2,20,000" trend={{ value: 25.9, direction: "up" }} tooltip="Total amount spent on this campaign in the selected period." />
            <MetricCard label="CPM" value="₹245" sub="Cost per 1,000 impressions" trend={{ value: 3.1, direction: "up", positive: false }} tooltip="Cost per mille. Indicates how competitive the ad auction is. Rising CPM means more competition or declining ad relevance." />
            <MetricCard label="CPC" value="₹57" sub="Cost per click" trend={{ value: 2.3, direction: "down", positive: true }} tooltip="Cost per click. What you pay each time someone clicks your ad. Higher CTR generally lowers CPC." />
            <MetricCard label="CPL" value="₹1,183" sub="vs target ₹1,200 · 1.4% under" trend={{ value: 5, direction: "down", positive: true }} tooltip="Cost per lead. What you pay for each form submission. This is your primary cost efficiency metric." />
            <MetricCard label="CPVL" value="₹5,238" sub="Cost per verified lead" trend={{ value: 3.1, direction: "up", positive: false }} tooltip="Cost per verified lead. High CPVL relative to CPL indicates many leads are invalid." />
            <MetricCard label="CPQL" value="₹10,000" sub="Cost per qualified lead" trend={{ value: 5, direction: "up", positive: false }} tooltip="Cost per qualified lead. The true cost of acquiring a sales-ready lead from this campaign." />
          </div>

          {/* CPL Trend Chart */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4">CPL Trend</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cplTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <defs>
                    <linearGradient id="cplFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} domain={[900, 1600]} tickFormatter={(v: number) => `₹${v}`} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "6px", fontSize: "12px" }}
                    formatter={(value, name) => [name === "cpl" ? `₹${Number(value).toLocaleString("en-IN")}` : `₹${value}`, name === "cpl" ? "CPL" : "Target"]} />
                  <ReferenceLine y={1200} stroke="#9B9B9B" strokeDasharray="6 4"
                    label={{ value: "Target ₹1,200", position: "insideTopRight", fill: "#9B9B9B", fontSize: 11 }} />
                  <Area type="monotone" dataKey="cpl" stroke="#1A1A1A" strokeWidth={2} fill="url(#cplFill)" dot={{ r: 2, fill: "#1A1A1A", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ HEALTH TAB ═══ */}
      {subTab === "health" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-5">
          {/* Health Summary */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-card ${
            allHealthGreen ? "bg-[#F0FDF4]" : "bg-[#FEF3C7]"
          }`}>
            {allHealthGreen ? (
              <CircleCheck size={14} strokeWidth={2} className="text-[#15803D]" />
            ) : (
              <AlertTriangle size={14} strokeWidth={2} className="text-[#92400E]" />
            )}
            <span className={`text-[13px] font-medium ${allHealthGreen ? "text-[#15803D]" : "text-[#92400E]"}`}>
              {allHealthGreen ? "Campaign health: All systems healthy ✓" : "Campaign health: 1 metric needs attention"}
            </span>
          </div>

          {/* Health Cards */}
          <div className="grid grid-cols-3 gap-3">
            {healthCards.map((c) => (
              <MetricCard key={c.label} label={c.label} value={c.value} sub={c.sub} trend={c.trend} tooltip={c.tooltip} healthDot={c.dot} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ ALWAYS VISIBLE: DIAGNOSIS + AD SETS ═══ */}

      {/* AI Diagnosis */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-text-primary">Campaign Diagnosis</h3>
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

      {/* Ad Sets Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="text-[14px] font-semibold text-text-primary">Ad Sets Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Ad Set", align: "left" },
                  { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" },
                  { label: "QLs", align: "right" },
                  { label: "CPL", align: "right" },
                  { label: "CPQL", align: "right" },
                  { label: "CTR", align: "right" },
                  { label: "CVR", align: "right" },
                  { label: "Freq", align: "right" },
                  { label: "Diagnosis", align: "center" },
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
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{(adset.leads / (adset.leads / adset.ctr * 100) * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">2.{i + 1}</td>
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
