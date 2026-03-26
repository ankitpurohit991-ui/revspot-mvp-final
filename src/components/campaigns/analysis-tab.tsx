"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { campaignDiagnosis, campaignDetail, healthIndicators } from "@/lib/campaign-data";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
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

// ══════════════════════════════════════════════════════════════

export function AnalysisTab() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["cpl"]);

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
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-badge bg-surface-secondary text-text-secondary">
          <Target size={13} strokeWidth={1.5} />
          Target CPL: ₹{campaignDetail.targetCPL.toLocaleString("en-IN")}
        </span>
        <DateRangeSelector compact />
      </div>

      {/* 5 metric cards — full width row */}
      <div className="grid grid-cols-5 gap-2.5">
        <HeadlineCard label="Spend" value="₹2.2L" sub="₹2,20,000" chartKey="spend" status="neutral"
          trend={{ value: 25.9, direction: "up" }}
          trendContext="₹46K more vs last 30d"
          tooltip="Total amount spent in the selected period."
          selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
        <HeadlineCard label="Leads" value="186" chartKey="leads" status="good"
          trend={{ value: 12, direction: "up" }}
          trendContext="+20 vs last 30d"
          tooltip="Total lead form submissions."
          selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
        <HeadlineCard label="Qualified" value="22" sub="11.8% of total" chartKey="qualified" status="good"
          trend={{ value: 7.9, direction: "up" }}
          trendContext="+2 vs last 30d"
          tooltip="Leads that passed all qualification criteria."
          selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
        <HeadlineCard label="CPL" value="₹1,183" sub="Target ₹1,200" chartKey="cpl" status="good"
          trend={{ value: 5, direction: "down", positive: true }}
          trendContext="₹62 cheaper vs last 30d"
          tooltip="Cost per lead vs your target. Under target = outperforming."
          selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
        <HeadlineCard label="CPQL" value="₹10,000" sub="Per qualified lead" chartKey="cpql" status="warning"
          trend={{ value: 5, direction: "up", positive: false }}
          trendContext="₹476 more vs last 30d"
          tooltip="True cost of acquiring a sales-ready lead."
          selectedMetrics={selectedMetrics} onToggle={toggleMetric} />
      </div>

      {/* Lead Funnel — horizontal strip */}
      <div className="bg-white border border-border rounded-card px-5 py-3">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] shrink-0">Lead Funnel</span>
          {funnelStages.map((stage, i) => {
            const maxVal = funnelStages[0].value;
            const widthPx = Math.max(Math.round((stage.value / maxVal) * 200), 30);
            const opacity = 0.85 - i * 0.15;
            return (
              <div key={stage.label} className="flex items-center gap-2">
                {i > 0 && <span className="text-[9px] text-text-tertiary">→</span>}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: widthPx }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                    className="h-6 rounded-[3px] flex items-center justify-center px-2 shrink-0"
                    style={{ backgroundColor: `rgba(26,26,26,${opacity})` }}
                  >
                    <span className="text-[10px] font-semibold text-white tabular-nums whitespace-nowrap">{stage.value}</span>
                  </motion.div>
                  <div className="shrink-0">
                    <div className="text-[10px] text-text-secondary leading-tight">{stage.label}</div>
                    {stage.rate && <div className="text-[9px] text-text-tertiary leading-tight">{stage.rate}</div>}
                  </div>
                </div>
              </div>
            );
          })}
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
