"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { campaignDetail, healthIndicators } from "@/lib/campaign-data";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MetricExplorer } from "./metric-explorer";

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
        <MetricCard label="Spend" value="₹2.2L" previous="₹1.74L"
          delta="+₹46K" tooltip="Total amount spent in the selected period."
          trend={{ value: 25.9, direction: "up" }} trendContext="₹46K more vs last 30d"
          chartKey="spend" isSelected={selectedMetrics.includes("spend")} onToggle={toggleMetric} />
        <MetricCard label="Leads" value="186" previous={166}
          delta="+20" tooltip="Total lead form submissions."
          trend={{ value: 12, direction: "up" }} trendContext="+20 vs last 30d"
          chartKey="leads" isSelected={selectedMetrics.includes("leads")} onToggle={toggleMetric} />
        <MetricCard label="Qualified" value="22" previous={20}
          delta="+2" tooltip="Leads that passed all qualification criteria."
          subMetric="11.8% qualification rate"
          trend={{ value: 7.9, direction: "up" }} trendContext="+2 vs last 30d"
          chartKey="qualified" isSelected={selectedMetrics.includes("qualified")} onToggle={toggleMetric} />
        <MetricCard label="CPL" value="₹1,183" previous="₹1,245"
          delta="-₹62" tooltip="Cost per lead vs your target. Under target = outperforming."
          subMetric="Target ₹1,200"
          trend={{ value: 5, direction: "down", positive: true }} trendContext="₹62 cheaper vs last 30d"
          chartKey="cpl" isSelected={selectedMetrics.includes("cpl")} onToggle={toggleMetric} />
        <MetricCard label="CPQL" value="₹10,000" previous="₹9,524"
          delta="+₹476" tooltip="True cost of acquiring a sales-ready lead."
          trend={{ value: 5, direction: "up", positive: false }} trendContext="₹476 more vs last 30d"
          chartKey="cpql" isSelected={selectedMetrics.includes("cpql")} onToggle={toggleMetric} />
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
