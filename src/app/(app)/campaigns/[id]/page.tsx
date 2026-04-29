"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Bot,
  AlertTriangle,
  Pause,
  Play,
} from "lucide-react";
import { campaignDetail, leadDistributionData } from "@/lib/campaign-data";
import { campaignDiagnosisPayload } from "@/lib/diagnosis-data";
import { LeadsTab } from "@/components/campaigns/leads-tab";
import { AnalysisTab } from "@/components/campaigns/analysis-tab";
import { SettingsTab } from "@/components/campaigns/settings-tab";
import { DiagnosisTab } from "@/components/campaigns/diagnosis-tab";
import { LeadInsights } from "@/components/campaigns/lead-insights";
import { CampaignBriefTab } from "@/components/campaigns/campaign-brief-tab";
import { StatusStrip } from "@/components/campaigns/diagnosis/status-strip";
import { NextBestAction } from "@/components/campaigns/diagnosis/next-best-action";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "analysis" | "leads" | "insights" | "diagnosis" | "brief" | "settings";

export default function CampaignDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [campaignStatus, setCampaignStatus] = useState<"enabled" | "paused">(
    campaignDetail.status === "paused" ? "paused" : "enabled"
  );
  const [statusConfirm, setStatusConfirm] = useState<"pause" | "enable" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [nbaSnoozed, setNbaSnoozed] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleStatusConfirm = () => {
    if (!statusConfirm) return;
    if (statusConfirm === "pause") {
      setCampaignStatus("paused");
      setToast("Campaign paused");
    } else {
      setCampaignStatus("enabled");
      setToast("Campaign enabled");
    }
    setStatusConfirm(null);
  };

  const campaign = campaignDetail;
  const isEnabled = campaignStatus === "enabled";
  const diagnosis = campaignDiagnosisPayload;

  const handleApplyNba = () => {
    // Visual nudge → take user to the Diagnosis tab where the full context lives.
    setActiveTab("diagnosis");
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "analysis", label: "Analysis" },
    { key: "leads", label: "Leads", count: 186 },
    { key: "insights", label: "Insights" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "brief", label: "Campaign setup" },
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
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-page-title text-text-primary">{campaign.name}</h1>
            <span
              className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                isEnabled
                  ? "bg-[#F0FDF4] text-[#15803D]"
                  : "bg-surface-secondary text-text-secondary"
              }`}
            >
              {isEnabled ? "Enabled" : "Paused"}
            </span>
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
              {campaign.platform}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-secondary text-text-secondary">
              <Calendar size={10} strokeWidth={1.5} /> Day {diagnosis.status_strip.days_live} of {diagnosis.status_strip.days_total}
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

        {/* Top-right CTA */}
        <button
          type="button"
          onClick={() => setStatusConfirm(isEnabled ? "pause" : "enable")}
          className={`inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-medium rounded-button border transition-colors duration-150 shrink-0 ${
            isEnabled
              ? "text-text-secondary border-border bg-white hover:bg-surface-page hover:text-text-primary"
              : "text-white bg-[#15803D] border-[#15803D] hover:bg-[#166534]"
          }`}
        >
          {isEnabled ? <Pause size={14} strokeWidth={2} /> : <Play size={14} strokeWidth={2} />}
          {isEnabled ? "Pause Campaign" : "Enable Campaign"}
        </button>
      </div>

      {/* No Agent Connected Banner */}
      {!campaign.agentConnected && (
        <div className="mb-4 flex items-start gap-3 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-card px-5 py-4">
          <AlertTriangle size={16} strokeWidth={1.5} className="text-[#92400E] mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-[13px] font-semibold text-[#92400E]">No Agent Connected</h4>
            <p className="text-[12px] text-[#92400E]/80 mt-0.5 leading-relaxed">
              Qualification metrics (Qualified Leads, CPQL, Qualification Rate) are unavailable. Connect an agent to start qualifying leads from this campaign.
            </p>
          </div>
          <button onClick={() => router.push("/agents")}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 text-[12px] font-medium bg-[#92400E] text-white rounded-button hover:bg-[#78350F] transition-colors shrink-0">
            <Bot size={13} strokeWidth={1.5} /> Connect Agent
          </button>
        </div>
      )}

      {/* Status strip — compact verdict + headline + primary metric */}
      <div className="mb-3">
        <StatusStrip data={diagnosis.status_strip} />
      </div>

      {/* Next Best Action — prescriptive card */}
      {!nbaSnoozed && (
        <div className="mb-5">
          <NextBestAction
            action={diagnosis.next_best_action}
            onApply={handleApplyNba}
            onSnooze={() => setNbaSnoozed(true)}
          />
        </div>
      )}

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
        {activeTab === "analysis" && <AnalysisTab agentConnected={campaign.agentConnected} />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "insights" && (
          <LeadInsights
            distributions={leadDistributionData}
          />
        )}
        {activeTab === "diagnosis" && <DiagnosisTab />}
        {activeTab === "brief" && <CampaignBriefTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      {/* Pause/Enable confirmation */}
      {statusConfirm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[60]" onClick={() => setStatusConfirm(null)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-card border border-border shadow-xl w-full max-w-[420px] p-6">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    statusConfirm === "pause" ? "bg-surface-secondary" : "bg-[#F0FDF4]"
                  }`}
                >
                  {statusConfirm === "pause" ? (
                    <Pause size={16} strokeWidth={1.5} className="text-text-secondary" />
                  ) : (
                    <Play size={16} strokeWidth={1.5} className="text-[#15803D]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-text-primary">
                    {statusConfirm === "pause" ? "Pause campaign?" : "Enable campaign?"}
                  </h3>
                  <p className="text-[12px] text-text-secondary leading-relaxed mt-1">
                    {statusConfirm === "pause" ? (
                      <>
                        <span className="font-medium text-text-primary">{campaign.name}</span> will stop serving ads on Meta. Budget will stop spending. You can enable it again anytime.
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-text-primary">{campaign.name}</span> will resume on Meta. Ads will start serving and budget will begin spending within minutes.
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusConfirm(null)}
                  className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusConfirm}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium rounded-button transition-colors ${
                    statusConfirm === "pause"
                      ? "bg-text-primary text-white hover:bg-black"
                      : "bg-[#15803D] text-white hover:bg-[#166534]"
                  }`}
                >
                  {statusConfirm === "pause" ? (
                    <Pause size={13} strokeWidth={2} />
                  ) : (
                    <Play size={13} strokeWidth={2} />
                  )}
                  {statusConfirm === "pause" ? "Pause campaign" : "Enable campaign"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-text-primary text-white text-[13px] font-medium px-4 py-2.5 rounded-[8px] shadow-lg">
            <Check size={14} strokeWidth={2} className="text-[#4ADE80]" />
            {toast}
          </div>
        </div>
      )}
    </motion.div>
  );
}
