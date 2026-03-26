"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { campaignDiagnosis, campaignDetail, healthIndicators } from "@/lib/campaign-data";
import { MetricExplorer } from "./metric-explorer";

// ── Performance Status ──────────────────────────────────────
// Determines subtle card background tint based on metric performance
type CardStatus = "good" | "warning" | "bad" | "neutral";

function getCardBg(status: CardStatus) {
  return {
    good: "bg-[#F7FDF9]", // very subtle green tint
    warning: "bg-[#FFFBF5]", // very subtle amber tint
    bad: "bg-[#FEF9F9]", // very subtle red tint
    neutral: "bg-surface-page",
  }[status];
}

function getCardBorder(status: CardStatus, isSelected: boolean) {
  if (isSelected) return "border-accent ring-1 ring-accent/20";
  return {
    good: "border-[#E2F5E9]",
    warning: "border-[#F5EDD8]",
    bad: "border-[#F5E2E2]",
    neutral: "border-border",
  }[status];
}

// ── Headline Metric Card ────────────────────────────────────

function HeadlineCard({
  label, value, sub, trend, tooltip, chartKey, selectedMetrics, onToggle, status = "neutral", trendContext,
}: {
  label: string; value: string; sub?: string;
  trend?: { value: number; direction: "up" | "down"; positive?: boolean };
  tooltip: string; chartKey: string;
  selectedMetrics: string[]; onToggle: (key: string) => void;
  status?: CardStatus;
  trendContext?: string; // e.g. "₹476 more per qualified lead vs last period"
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trendPositive = trend ? (trend.positive !== undefined ? trend.positive : trend.direction === "up") : false;
  const isSelected = selectedMetrics.includes(chartKey);

  return (
    <button
      onClick={() => onToggle(chartKey)}
      onMouseEnter={() => { timeoutRef.current = setTimeout(() => setShowTooltip(true), 300); }}
      onMouseLeave={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShowTooltip(false); }}
      className={`relative text-left w-full ${getCardBg(status)} border rounded-card px-4 py-3.5 transition-all duration-150 hover:shadow-card-hover hover:-translate-y-px ${getCardBorder(status, isSelected)}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.3px]">{label}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${trendPositive ? "text-status-success" : "text-status-error"}`}>
            {trend.direction === "up" ? <ArrowUpRight size={10} strokeWidth={2.5} /> : <ArrowDownRight size={10} strokeWidth={2.5} />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="text-[22px] font-semibold text-text-primary leading-tight tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-[10px] text-text-tertiary">{sub}</div>}
      {trendContext && (
        <div className={`mt-1 text-[10px] leading-tight ${trendPositive ? "text-status-success" : "text-status-error"}`}>
          {trendContext}
        </div>
      )}
      {isSelected && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full" />}

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

// ── Funnel Stages ───────────────────────────────────────────

const funnelStages = [
  { label: "Leads", value: 186 },
  { label: "Verified", value: 42, rate: "22.6%" },
  { label: "AI Qualified", value: 34, rate: "81.0%" },
  { label: "Qualified", value: 22, rate: "64.7%" },
];

// ── Date Range Select Style ─────────────────────────────────

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 10px center",
};

// ══════════════════════════════════════════════════════════════

export function AnalysisTab() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["cpl"]);
  const [dateRange, setDateRange] = useState("30d");

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  };

  return (
    <div className="space-y-5">
      {/* Date Range + Target CPL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-badge bg-surface-secondary text-text-secondary">
            <Target size={13} strokeWidth={1.5} />
            Target CPL: ₹{campaignDetail.targetCPL.toLocaleString("en-IN")}
          </span>
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

      {/* Row 1: 5 metric cards + funnel side by side */}
      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Metrics */}
        <div className="grid grid-cols-5 gap-2.5">
          <HeadlineCard label="Spend" value="₹2.2L" sub="₹2,20,000" chartKey="spend" status="neutral"
            trend={{ value: 25.9, direction: "up" }}
            trendContext="₹46K more than last period"
            tooltip="Total amount spent in the selected period."
            selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
          <HeadlineCard label="Leads" value="186" chartKey="leads" status="good"
            trend={{ value: 12, direction: "up" }}
            trendContext="20 more leads than last period"
            tooltip="Total lead form submissions."
            selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
          <HeadlineCard label="Qualified" value="22" sub="11.8% of total" chartKey="qualified" status="good"
            trend={{ value: 7.9, direction: "up" }}
            trendContext="2 more qualified than last period"
            tooltip="Leads that passed all qualification criteria."
            selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
          <HeadlineCard label="CPL" value="₹1,183" sub="Target ₹1,200" chartKey="cpl" status="good"
            trend={{ value: 5, direction: "down", positive: true }}
            trendContext="₹62 cheaper per lead vs last period"
            tooltip="Cost per lead vs your target. Under target = outperforming."
            selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
          <HeadlineCard label="CPQL" value="₹10,000" sub="Cost per qualified" chartKey="cpql" status="warning"
            trend={{ value: 5, direction: "up", positive: false }}
            trendContext="₹476 more per qualified lead"
            tooltip="True cost of acquiring a sales-ready lead."
            selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
        </div>

        {/* Funnel — compact vertical card */}
        <div className="bg-white border border-border rounded-card px-4 py-3">
          <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-2.5">Lead Funnel</div>
          <div className="space-y-1.5">
            {funnelStages.map((stage, i) => {
              const maxVal = funnelStages[0].value;
              const widthPct = Math.max((stage.value / maxVal) * 100, 14);
              const opacity = 0.85 - i * 0.15;
              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-text-secondary">{stage.label}</span>
                    <span className="text-[10px] text-text-tertiary tabular-nums">{stage.rate || ""}</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                    className="h-5 rounded-[3px] flex items-center px-2"
                    style={{ backgroundColor: `rgba(26,26,26,${opacity})` }}
                  >
                    <span className="text-[10px] font-semibold text-white tabular-nums">{stage.value.toLocaleString("en-IN")}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metric Explorer */}
      <MetricExplorer selectedMetrics={selectedMetrics} onToggleMetric={toggleMetric} />

      {/* Health Status Strip */}
      <div className="bg-white border border-border rounded-card px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px]">Health</span>
          <div className="flex items-center gap-5">
            {healthIndicators.map((h) => (
              <button
                key={h.key}
                onClick={() => toggleMetric(h.key)}
                className={`flex items-center gap-1.5 transition-colors duration-150 ${
                  selectedMetrics.includes(h.key) ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className={`w-[6px] h-[6px] rounded-full ${
                  h.status === "green" ? "bg-status-success" : h.status === "yellow" ? "bg-status-warning" : "bg-status-error"
                }`} />
                <span className="text-[11px] text-text-secondary">{h.label}</span>
                <span className="text-[11px] font-medium text-text-primary tabular-nums">{h.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
