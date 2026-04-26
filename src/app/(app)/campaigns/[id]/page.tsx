"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, Calendar, ArrowRight, Sparkles, Lightbulb, X, Check, Bot, AlertTriangle, Pause, Play } from "lucide-react";
import { campaignDetail, campaignDiagnosis, leadDistributionData } from "@/lib/campaign-data";
import { LeadsTab } from "@/components/campaigns/leads-tab";
import { AnalysisTab } from "@/components/campaigns/analysis-tab";
import { SettingsTab } from "@/components/campaigns/settings-tab";
import { DiagnosisTab } from "@/components/campaigns/diagnosis-tab";
import { LeadInsights } from "@/components/campaigns/lead-insights";
import { CampaignBriefTab } from "@/components/campaigns/campaign-brief-tab";
import { ActionBanner } from "@/components/shared/action-banner";
import { FunnelEvidenceChips, type FunnelEvidence } from "@/components/shared/funnel-evidence-chips";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "analysis" | "leads" | "insights" | "diagnosis" | "brief" | "settings";

// Diagnosis status badge config
const diagnosisStatusConfig = {
  "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
  "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
  "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [campaignStatus, setCampaignStatus] = useState<"enabled" | "paused">(
    campaignDetail.status === "paused" ? "paused" : "enabled"
  );
  const [statusConfirm, setStatusConfirm] = useState<"pause" | "enable" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [bannerSnoozed, setBannerSnoozed] = useState(false);

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
  const diagCfg = diagnosisStatusConfig[campaignDiagnosis.status];

  interface Suggestion {
    id: string;
    text: string;
    cta: string;
    ctaLink?: string;
    ctaModule?: string;
    type: "budget" | "creative" | "targeting" | "general";
    funnel_evidence?: FunnelEvidence[];
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "sug-1",
      text: 'Shift 20% budget from "Broad Bangalore" to "Whitefield HNI" — Whitefield delivers 3.2× more qualified leads per ₹ and 4 of 5 site visits this month came from it.',
      cta: "Adjust Budget",
      type: "budget",
      funnel_evidence: [
        { stage: "TOF", fact: "CTR 2.4% vs 0.9%" },
        { stage: "MOF", fact: "Verify 31% vs 11%" },
        { stage: "BOF", fact: "4/5 site visits" },
      ],
    },
    {
      id: "sug-2",
      text: 'Pause "Godrej Air Floor Plan Static" creative — 0.8% CTR is dragging upstream cost up and the few leads it produces verify at 0%.',
      cta: "Update Creative",
      ctaLink: "/creatives",
      ctaModule: "Creatives",
      type: "creative",
      funnel_evidence: [
        { stage: "TOF", fact: "CTR 0.8% (-40% in 7d)" },
        { stage: "MOF", fact: "0 of 6 leads verified" },
      ],
    },
    {
      id: "sug-3",
      text: 'Increase bid on "3BHK Whitefield" audience by 15% — qualification rate is 2.3× campaign average but impression share is low.',
      cta: "Adjust Targeting",
      type: "targeting",
      funnel_evidence: [
        { stage: "TOF", fact: "Impression share 12%" },
        { stage: "BOF", fact: "Qual rate 27% vs 12% avg" },
      ],
    },
    {
      id: "sug-4",
      text: 'Add Sarjapur Road as a separate ad set — 12% of qualified leads originate there with no dedicated targeting yet.',
      cta: "Add Ad Set",
      type: "general",
      funnel_evidence: [
        { stage: "MOF", fact: "Sarjapur leads verify at 24%" },
        { stage: "BOF", fact: "12% of qualified leads" },
      ],
    },
  ]);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [navigationConfirm, setNavigationConfirm] = useState<{ link: string; module: string } | null>(null);

  const applySuggestion = (sug: Suggestion) => {
    if (sug.ctaLink && sug.ctaModule) {
      setNavigationConfirm({ link: sug.ctaLink, module: sug.ctaModule });
      return;
    }
    setAppliedId(sug.id);
    setTimeout(() => {
      setSuggestions((prev) => prev.filter((s) => s.id !== sug.id));
      setAppliedId(null);
    }, 1200);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const confirmNavigation = () => {
    if (navigationConfirm) {
      router.push(navigationConfirm.link);
    }
    setNavigationConfirm(null);
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

      {/* Navigation Confirmation Popup */}
      {navigationConfirm && (
        <>
          <div className="fixed inset-0 bg-black/20 z-[60]" onClick={() => setNavigationConfirm(null)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-card border border-border shadow-xl w-full max-w-[400px] p-6">
              <h3 className="text-[16px] font-semibold text-text-primary mb-2">Navigate to {navigationConfirm.module}?</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                You&apos;ll be taken to the {navigationConfirm.module} section to make the recommended changes. Any unsaved changes on this page will be preserved.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setNavigationConfirm(null)}
                  className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">
                  Cancel
                </button>
                <button onClick={confirmNavigation}
                  className="h-9 px-4 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors">
                  Go to {navigationConfirm.module}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* No Agent Connected Banner (shown when agentConnected is false) */}
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

      {/* Action-first banner — leads with what to do */}
      {!bannerSnoozed && campaignDiagnosis.headline_action && (
        <ActionBanner
          verb={campaignDiagnosis.headline_action.verb}
          target={campaignDiagnosis.headline_action.target}
          outcome={campaignDiagnosis.headline_action.outcome}
          expectedImpact={campaignDiagnosis.headline_action.expected_impact}
          ctaLabel={campaignDiagnosis.headline_action.cta_label}
          onCtaClick={() => setActiveTab("settings")}
          onSnooze={() => setBannerSnoozed(true)}
          variant="campaign"
        />
      )}

      {/* Merged Diagnosis Summary + AI Recommendations Bar */}
      <div className="mb-5 bg-white border border-border rounded-card">
        {/* Diagnosis row */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-5 h-5 rounded-[5px] bg-accent flex items-center justify-center shrink-0">
            <Sparkles size={11} strokeWidth={1.5} className="text-white" />
          </div>
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

        {/* Inline recommendations (max 2) */}
        {suggestions.length > 0 && (
          <div className="border-t border-border-subtle">
            {suggestions.slice(0, 2).map((sug) => (
              <div key={sug.id} className="flex items-start gap-3 px-4 py-3 border-b border-border-subtle last:border-b-0">
                <Lightbulb size={13} strokeWidth={1.5} className="text-[#3B82F6] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-text-secondary leading-relaxed">{sug.text}</p>
                  {sug.funnel_evidence && sug.funnel_evidence.length > 0 && (
                    <div className="mt-1.5">
                      <FunnelEvidenceChips evidence={sug.funnel_evidence} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {appliedId === sug.id ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803D]">
                      <Check size={12} strokeWidth={2} /> Applied!
                    </span>
                  ) : (
                    <>
                      <button onClick={() => applySuggestion(sug)}
                        className="h-7 px-3 text-[11px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors">
                        {sug.cta}
                      </button>
                      <button onClick={() => dismissSuggestion(sug.id)}
                        className="p-1 text-text-tertiary hover:text-text-primary rounded-button hover:bg-surface-secondary transition-colors">
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {suggestions.length > 2 && (
              <div className="px-4 py-2">
                <button onClick={() => setActiveTab("diagnosis")}
                  className="text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150">
                  See {suggestions.length - 2} more recommendations <ArrowRight size={11} strokeWidth={1.5} className="inline" />
                </button>
              </div>
            )}
          </div>
        )}
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
