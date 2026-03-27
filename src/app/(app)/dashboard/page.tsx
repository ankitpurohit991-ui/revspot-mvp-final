"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MetricChart } from "@/components/shared/metric-chart";
import type { MetricChartDef } from "@/components/shared/metric-chart";
import { Insights } from "@/components/dashboard/insights";
import { CampaignTable } from "@/components/dashboard/campaign-table";
import { RecentlyQualified } from "@/components/dashboard/recently-qualified";
import { VoiceAgentPerformance } from "@/components/dashboard/voice-agent-performance";
import {
  dashboardMetrics,
  campaignPerformance,
  voiceAgentMetrics,
  disqualificationReasons,
} from "@/lib/mock-data";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

// ── Dashboard Trend Data ────────────────────────────────────
const dates = Array.from({ length: 14 }, (_, i) => `Mar ${10 + i}`);

function makeTrend(start: number, end: number) {
  return Array.from({ length: 14 }, (_, i) => {
    const progress = i / 13;
    return Math.round((start + (end - start) * progress + (Math.random() * start * 0.05 - start * 0.025)) * 10) / 10;
  });
}

const dashboardTrends: Record<string, MetricChartDef> = {
  activeCampaigns: { key: "activeCampaigns", label: "Active Campaigns", unit: "number", data: makeTrend(7, 9) },
  spends: { key: "spends", label: "Spends", unit: "currency", data: makeTrend(540000, 680000) },
  totalLeads: { key: "totalLeads", label: "Total Leads", unit: "number", data: makeTrend(754, 845) },
  verifiedLeads: { key: "verifiedLeads", label: "Verified Leads", unit: "number", data: makeTrend(104, 127) },
  verificationRate: { key: "verificationRate", label: "Verification Rate", unit: "percentage", data: makeTrend(13.8, 15) },
  qualifiedLeads: { key: "qualifiedLeads", label: "Qualified Leads", unit: "number", data: makeTrend(63, 68) },
  avgCPL: { key: "avgCPL", label: "Avg CPL", unit: "currency", data: makeTrend(1245, 1183) },
  costPerVerified: { key: "costPerVerified", label: "Cost per Verified", unit: "currency", data: makeTrend(5192, 5354) },
};

const MAX_CHART_METRICS = 3;

export default function DashboardPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const toggleMetric = useCallback((key: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_CHART_METRICS) return prev;
      return [...prev, key];
    });
  }, []);

  const selectedChartDefs = selectedMetrics.map((k) => dashboardTrends[k]).filter(Boolean);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Dashboard</h1>
        </div>
        <DateRangeSelector />
      </motion.div>

      {/* Metric cards — 4x2 grid with chart selection */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3 mb-3">
        <MetricCard label={dashboardMetrics.activeCampaigns.label} value={dashboardMetrics.activeCampaigns.value}
          previous={dashboardMetrics.activeCampaigns.previous} trend={dashboardMetrics.activeCampaigns.trend}
          status="good" trendContext="+2 campaigns vs last 30 days"
          chartKey="activeCampaigns" isSelected={selectedMetrics.includes("activeCampaigns")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.spends.label} value={dashboardMetrics.spends.value}
          previous={dashboardMetrics.spends.previous} tooltip={dashboardMetrics.spends.formattedFull}
          trend={dashboardMetrics.spends.trend} status="neutral" trendContext="₹90K more vs last 30 days"
          chartKey="spends" isSelected={selectedMetrics.includes("spends")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.totalLeads.label} value={dashboardMetrics.totalLeads.value}
          previous={dashboardMetrics.totalLeads.previous} trend={dashboardMetrics.totalLeads.trend}
          status="good" trendContext="91 more leads vs last 30 days"
          chartKey="totalLeads" isSelected={selectedMetrics.includes("totalLeads")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.verifiedLeads.label} value={dashboardMetrics.verifiedLeads.value}
          previous={dashboardMetrics.verifiedLeads.previous} trend={dashboardMetrics.verifiedLeads.trend}
          status="good" trendContext="23 more verified vs last 30 days"
          chartKey="verifiedLeads" isSelected={selectedMetrics.includes("verifiedLeads")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.verificationRate.label} value={dashboardMetrics.verificationRate.value}
          previous={dashboardMetrics.verificationRate.previous} trend={dashboardMetrics.verificationRate.trend}
          status="good" trendContext="1.2% higher rate vs last 30 days"
          chartKey="verificationRate" isSelected={selectedMetrics.includes("verificationRate")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.qualifiedLeads.label} value={dashboardMetrics.qualifiedLeads.value}
          previous={dashboardMetrics.qualifiedLeads.previous} trend={dashboardMetrics.qualifiedLeads.trend}
          status="good" trendContext="5 more qualified vs last 30 days"
          chartKey="qualifiedLeads" isSelected={selectedMetrics.includes("qualifiedLeads")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.avgCPL.label} value={dashboardMetrics.avgCPL.value}
          previous={dashboardMetrics.avgCPL.previous} trend={dashboardMetrics.avgCPL.trend}
          status="good" trendContext="₹62 cheaper per lead vs last 30 days"
          chartKey="avgCPL" isSelected={selectedMetrics.includes("avgCPL")} onToggle={toggleMetric} />
        <MetricCard label={dashboardMetrics.costPerVerified.label} value={dashboardMetrics.costPerVerified.value}
          previous={dashboardMetrics.costPerVerified.previous} trend={dashboardMetrics.costPerVerified.trend}
          status="warning" trendContext="₹162 more per verified vs last 30 days"
          chartKey="costPerVerified" isSelected={selectedMetrics.includes("costPerVerified")} onToggle={toggleMetric} />
      </motion.div>

      {/* Chart — shows when metrics are selected */}
      {selectedChartDefs.length > 0 && (
        <motion.div variants={fadeUp} className="mb-5">
          <MetricChart metrics={selectedChartDefs} dates={dates} onRemove={toggleMetric} maxMetrics={MAX_CHART_METRICS} />
        </motion.div>
      )}

      {/* Hint text when no chart */}
      {selectedChartDefs.length === 0 && (
        <motion.div variants={fadeUp} className="mb-5">
          <div className="text-[11px] text-text-tertiary text-center py-2">
            Click any metric card to visualize its trend
          </div>
        </motion.div>
      )}

      {/* Two column: Insights + Voice Agent Performance */}
      <motion.div variants={fadeUp} className="grid grid-cols-[3fr_2fr] gap-5 mb-5">
        <Insights />
        <VoiceAgentPerformance
          metrics={voiceAgentMetrics}
          disqualificationReasons={disqualificationReasons}
        />
      </motion.div>

      {/* Two column: Campaign table + Recently qualified leads */}
      <motion.div variants={fadeUp} className="grid grid-cols-[3fr_2fr] gap-5">
        <CampaignTable campaigns={campaignPerformance} />
        <RecentlyQualified />
      </motion.div>
    </motion.div>
  );
}
