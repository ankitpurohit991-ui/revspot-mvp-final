"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MetricChart } from "@/components/shared/metric-chart";
import type { MetricChartDef, MetricOption } from "@/components/shared/metric-chart";
import { Insights } from "@/components/dashboard/insights";
import { CampaignTable } from "@/components/dashboard/campaign-table";
import { RecentlyQualified } from "@/components/dashboard/recently-qualified";
import { VoiceAgentPerformance } from "@/components/dashboard/voice-agent-performance";
import {
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

// ── Trend Data ──────────────────────────────────────────────
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
  qualifiedLeads: { key: "qualifiedLeads", label: "Qualified Leads", unit: "number", data: makeTrend(63, 68) },
  cpl: { key: "cpl", label: "CPL", unit: "currency", data: makeTrend(1245, 1183) },
  cpvl: { key: "cpvl", label: "CPVL", unit: "currency", data: makeTrend(5192, 5354) },
  cpql: { key: "cpql", label: "CPQL", unit: "currency", data: makeTrend(9524, 10000) },
  verificationRate: { key: "verificationRate", label: "Verification Rate", unit: "percentage", data: makeTrend(13.8, 15) },
  qualificationRate: { key: "qualificationRate", label: "Qualification Rate", unit: "percentage", data: makeTrend(7.4, 8.1) },
  ctr: { key: "ctr", label: "CTR", unit: "percentage", data: makeTrend(1.6, 2.1) },
  connectRate: { key: "connectRate", label: "Connect Rate", unit: "percentage", data: makeTrend(72, 78.9) },
};

const allAvailableMetrics: MetricOption[] = [
  { key: "activeCampaigns", label: "Active Campaigns", category: "Overview", currentValue: "9" },
  { key: "spends", label: "Spends", category: "Overview", currentValue: "₹6.8L" },
  { key: "totalLeads", label: "Total Leads", category: "Leads", currentValue: "845" },
  { key: "verifiedLeads", label: "Verified Leads", category: "Leads", currentValue: "127" },
  { key: "qualifiedLeads", label: "Qualified Leads", category: "Leads", currentValue: "68" },
  { key: "cpl", label: "CPL", category: "Cost", currentValue: "₹1,183" },
  { key: "cpvl", label: "CPVL", category: "Cost", currentValue: "₹5,354" },
  { key: "cpql", label: "CPQL", category: "Cost", currentValue: "₹10,000" },
  { key: "verificationRate", label: "Verification Rate", category: "Rates", currentValue: "15%" },
  { key: "qualificationRate", label: "Qualification Rate", category: "Rates", currentValue: "8.1%" },
  { key: "ctr", label: "CTR", category: "Rates", currentValue: "2.1%" },
  { key: "connectRate", label: "Voice Connect Rate", category: "Rates", currentValue: "78.9%" },
];

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

      {/* Metric cards — 4x2 grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3 mb-3">
        <MetricCard label="Active campaigns" value={9} previous={7}
          delta="+2" trend={{ value: 28.6, direction: "up" }}
          trendContext="+2 vs last 30d"
          chartKey="activeCampaigns" isSelected={selectedMetrics.includes("activeCampaigns")} onToggle={toggleMetric} />
        <MetricCard label="Spends" value="₹6.8L" previous="₹5.9L"
          delta="+₹90K" tooltip="₹6,80,000"
          trend={{ value: 15, direction: "up" }}
          trendContext="₹90K more vs last 30d"
          chartKey="spends" isSelected={selectedMetrics.includes("spends")} onToggle={toggleMetric} />
        <MetricCard label="Total leads" value={845} previous={754}
          delta="+91" trend={{ value: 12, direction: "up" }}
          trendContext="+91 vs last 30d"
          chartKey="totalLeads" isSelected={selectedMetrics.includes("totalLeads")} onToggle={toggleMetric} />
        <MetricCard label="Verified leads" value={127} previous={104}
          delta="+23" trend={{ value: 22.1, direction: "up" }}
          subMetric="15% verification rate"
          trendContext="+23 vs last 30d"
          chartKey="verifiedLeads" isSelected={selectedMetrics.includes("verifiedLeads")} onToggle={toggleMetric} />
        <MetricCard label="Qualified leads" value={68} previous={63}
          delta="+5" trend={{ value: 7.9, direction: "up" }}
          subMetric="8.1% qualification rate"
          trendContext="+5 vs last 30d"
          chartKey="qualifiedLeads" isSelected={selectedMetrics.includes("qualifiedLeads")} onToggle={toggleMetric} />
        <MetricCard label="CPL" value="₹1,183" previous="₹1,245"
          delta="-₹62" trend={{ value: 5, direction: "down", positive: true }}
          trendContext="₹62 cheaper vs last 30d"
          chartKey="cpl" isSelected={selectedMetrics.includes("cpl")} onToggle={toggleMetric} />
        <MetricCard label="CPVL" value="₹5,354" previous="₹5,192"
          delta="+₹162" tooltip="Cost per verified lead"
          trend={{ value: 3.1, direction: "up", positive: false }}
          trendContext="₹162 more vs last 30d"
          chartKey="cpvl" isSelected={selectedMetrics.includes("cpvl")} onToggle={toggleMetric} />
        <MetricCard label="CPQL" value="₹10,000" previous="₹9,524"
          delta="+₹476" tooltip="Cost per qualified lead"
          trend={{ value: 5, direction: "up", positive: false }}
          trendContext="₹476 more vs last 30d"
          chartKey="cpql" isSelected={selectedMetrics.includes("cpql")} onToggle={toggleMetric} />
      </motion.div>

      {/* Chart with Add Metric dropdown */}
      {selectedChartDefs.length > 0 ? (
        <motion.div variants={fadeUp} className="mb-5">
          <MetricChart metrics={selectedChartDefs} dates={dates} onRemove={toggleMetric}
            onAdd={toggleMetric} availableMetrics={allAvailableMetrics} selectedKeys={selectedMetrics} maxMetrics={MAX_CHART_METRICS} />
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="mb-5">
          <div className="text-[11px] text-text-tertiary text-center py-2">Click any metric card to visualize its trend</div>
        </motion.div>
      )}

      {/* Two column: Insights + Voice Agent Performance */}
      <motion.div variants={fadeUp} className="grid grid-cols-[3fr_2fr] gap-5 mb-5">
        <Insights />
        <VoiceAgentPerformance metrics={voiceAgentMetrics} disqualificationReasons={disqualificationReasons} />
      </motion.div>

      {/* Two column: Campaign table + Recently qualified leads */}
      <motion.div variants={fadeUp} className="grid grid-cols-[3fr_2fr] gap-5">
        <CampaignTable campaigns={campaignPerformance} />
        <RecentlyQualified />
      </motion.div>
    </motion.div>
  );
}
