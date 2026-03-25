"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { campaignDetail } from "@/lib/campaign-data";
import { LeadsTab } from "@/components/campaigns/leads-tab";
import { AnalysisTab } from "@/components/campaigns/analysis-tab";
import { SettingsTab } from "@/components/campaigns/settings-tab";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "analysis" | "leads" | "settings";

export default function CampaignDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analysis");

  const campaign = campaignDetail;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "analysis", label: "Analysis" },
    { key: "leads", label: "Leads", count: 186 },
    { key: "settings", label: "Settings" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/campaigns")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">
          Lead Generation › Campaigns › {campaign.name}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-page-title text-text-primary">{campaign.name}</h1>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
            {campaign.platform}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-text-secondary">
          <span>
            Type: <span className="text-text-primary font-medium">{campaign.type}</span>
          </span>
          <span className="text-border">|</span>
          <span>
            Project: <span className="text-text-primary font-medium">{campaign.client}</span>
          </span>
          <span className="text-border">|</span>
          <span>
            Owner: <span className="text-text-primary font-medium">{campaign.owner}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              activeTab === tab.key
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[11px] text-text-tertiary font-normal tabular-nums">
                  ({tab.count})
                </span>
              )}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={{ duration: 0.15 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "analysis" && <AnalysisTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </motion.div>
  );
}
