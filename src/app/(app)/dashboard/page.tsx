"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { MetricCard } from "@/components/dashboard/metric-card";
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

export default function DashboardPage() {
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

      {/* Metric cards — 4x2 grid with smart coloring */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3 mb-5">
        <MetricCard
          label={dashboardMetrics.activeCampaigns.label}
          value={dashboardMetrics.activeCampaigns.value}
          previous={dashboardMetrics.activeCampaigns.previous}
          trend={dashboardMetrics.activeCampaigns.trend}
          status="good"
          trendContext="+2 campaigns vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.spends.label}
          value={dashboardMetrics.spends.value}
          previous={dashboardMetrics.spends.previous}
          tooltip={dashboardMetrics.spends.formattedFull}
          trend={dashboardMetrics.spends.trend}
          status="neutral"
          trendContext="₹90K more vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.totalLeads.label}
          value={dashboardMetrics.totalLeads.value}
          previous={dashboardMetrics.totalLeads.previous}
          trend={dashboardMetrics.totalLeads.trend}
          status="good"
          trendContext="91 more leads vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.verifiedLeads.label}
          value={dashboardMetrics.verifiedLeads.value}
          previous={dashboardMetrics.verifiedLeads.previous}
          trend={dashboardMetrics.verifiedLeads.trend}
          status="good"
          trendContext="23 more verified vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.verificationRate.label}
          value={dashboardMetrics.verificationRate.value}
          previous={dashboardMetrics.verificationRate.previous}
          trend={dashboardMetrics.verificationRate.trend}
          status="good"
          trendContext="1.2% higher rate vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.qualifiedLeads.label}
          value={dashboardMetrics.qualifiedLeads.value}
          previous={dashboardMetrics.qualifiedLeads.previous}
          trend={dashboardMetrics.qualifiedLeads.trend}
          status="good"
          trendContext="5 more qualified vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.avgCPL.label}
          value={dashboardMetrics.avgCPL.value}
          previous={dashboardMetrics.avgCPL.previous}
          trend={dashboardMetrics.avgCPL.trend}
          status="good"
          trendContext="₹62 cheaper per lead vs last 30 days"
        />
        <MetricCard
          label={dashboardMetrics.costPerVerified.label}
          value={dashboardMetrics.costPerVerified.value}
          previous={dashboardMetrics.costPerVerified.previous}
          trend={dashboardMetrics.costPerVerified.trend}
          status="warning"
          trendContext="₹162 more per verified vs last 30 days"
        />
      </motion.div>

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
