"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { campaignDetail, campaignDiagnosis } from "@/lib/campaign-data";
import { LeadsTab } from "@/components/campaigns/leads-tab";
import { AnalysisTab } from "@/components/campaigns/analysis-tab";
import { SettingsTab } from "@/components/campaigns/settings-tab";
import { DiagnosisTab } from "@/components/campaigns/diagnosis-tab";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "analysis" | "leads" | "diagnosis" | "settings";

// Diagnosis status badge config
const diagnosisStatusConfig = {
  "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
  "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
  "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analysis");

  const campaign = campaignDetail;
  const diagCfg = diagnosisStatusConfig[campaignDiagnosis.status];

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "analysis", label: "Analysis" },
    { key: "leads", label: "Leads", count: 186 },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push("/campaigns")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Lead Generation › Campaigns › {campaign.name}</span>
      </div>

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-page-title text-text-primary">{campaign.name}</h1>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
            {campaign.platform}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-secondary text-text-secondary">
            <Calendar size={10} strokeWidth={1.5} /> Day 14 of 30
          </span>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-text-secondary">
          <span>Project: <Link href="/projects/proj-2" className="text-text-primary font-medium hover:underline">{campaign.client}</Link></span>
          <span className="text-border">|</span>
          <span>Owner: <span className="text-text-primary font-medium">{campaign.owner}</span></span>
          <span className="text-border">|</span>
          <span>Budget: <span className="text-text-primary font-medium">₹{campaign.dailyBudget.toLocaleString("en-IN")}/day</span></span>
        </div>
      </div>

      {/* Diagnosis Summary Bar */}
      <div className="flex items-center gap-3 mb-5 px-4 py-2.5 bg-white border border-border rounded-card">
        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-badge ${diagCfg.cls}`}>
          {diagCfg.label}
        </span>
        <p className="text-[12px] text-text-secondary flex-1 truncate">
          CPL ₹1,183 vs target ₹1,200 — improving trend visible in second half of the flight
        </p>
        <button onClick={() => setActiveTab("diagnosis")}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150 shrink-0">
          View details <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              activeTab === tab.key ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}>
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[11px] text-text-tertiary font-normal tabular-nums">({tab.count})</span>
              )}
            </span>
            {activeTab === tab.key && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" transition={{ duration: 0.15 }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "analysis" && <AnalysisTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "diagnosis" && <DiagnosisTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </motion.div>
  );
}
