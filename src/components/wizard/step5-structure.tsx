"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Plus, Send, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  type CampaignSettings,
  type AdSetState,
  defaultCampaignSettings,
  defaultPlacements,
  initialAdSets,
} from "./campaign-structure/types";
import { emptyTargetingSelection } from "@/lib/targeting-options";
import { CampaignSettingsCard } from "./campaign-structure/campaign-settings";
import { AdSetCard } from "./campaign-structure/ad-set-card";

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.35, ease: "easeOut" as const },
  }),
};

export function Step5Structure({ onNext, onBack }: Step5Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<CampaignSettings>(defaultCampaignSettings);
  const [adSets, setAdSets] = useState<AdSetState[]>(initialAdSets);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const updateCampaign = (updates: Partial<CampaignSettings>) => {
    setCampaign((prev) => ({ ...prev, ...updates }));
  };

  const updateAdSet = (id: string, updates: Partial<AdSetState>) => {
    setAdSets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAdSet = (id: string) => {
    if (adSets.length <= 1) return;
    setAdSets((prev) => prev.filter((a) => a.id !== id));
  };

  const duplicateAdSet = (id: string) => {
    const source = adSets.find((a) => a.id === id);
    if (!source) return;
    const newAdSet: AdSetState = {
      ...source,
      id: `as-${Date.now()}`,
      name: `${source.name} (copy)`,
      locations: [...source.locations],
      detailedTargeting: {
        included: [...source.detailedTargeting.included],
        excluded: [...source.detailedTargeting.excluded],
        narrowing_groups: source.detailedTargeting.narrowing_groups.map((g) => [...g]),
      },
      manualPlacements: JSON.parse(JSON.stringify(source.manualPlacements)),
      ads: source.ads.map((ad) => ({ ...ad, id: `ad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })),
    };
    setAdSets((prev) => [...prev, newAdSet]);
  };

  const addAdSet = () => {
    const newAdSet: AdSetState = {
      id: `as-${Date.now()}`,
      name: `Ad Set ${adSets.length + 1}`,
      instantFormId: "",
      budget: 2000,
      budgetType: "daily",
      locations: [],
      ageMin: 18,
      ageMax: 65,
      gender: "all",
      detailedTargeting: { ...emptyTargetingSelection },
      advantagePlusAudience: true,
      advantagePlusPlacements: true,
      manualPlacements: JSON.parse(JSON.stringify(defaultPlacements)),
      ads: [],
    };
    setAdSets((prev) => [...prev, newAdSet]);
  };

  const handleAiEdit = () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      // Simulate AI edit — e.g. "increase budget for NRI ad set"
      const lower = aiPrompt.toLowerCase();
      if (lower.includes("budget") && lower.includes("nri")) {
        setAdSets((prev) => prev.map((a) =>
          a.name.toLowerCase().includes("nri") ? { ...a, budget: a.budget + 1000 } : a
        ));
      } else if (lower.includes("add") && lower.includes("ad set")) {
        addAdSet();
      } else if (lower.includes("rename")) {
        setCampaign((prev) => ({ ...prev, name: prev.name + " (Updated)" }));
      }
      setAiPrompt("");
      setIsAiProcessing(false);
    }, 1500);
  };

  const totalDailyBudget = campaign.cboEnabled
    ? campaign.budget
    : adSets.reduce((sum, a) => sum + a.budget, 0);
  const campaignDuration = 30;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
        <h2 className="text-[20px] font-semibold text-text-primary">Campaign Structure</h2>
        {isLoading && <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-text-secondary">Generating campaign structure...</span>
            </div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white border border-border rounded-card p-5 space-y-3">
              <div className="h-5 w-1/2 bg-surface-secondary rounded-[8px] animate-pulse" />
              <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
              <div className="h-3 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* AI context banner — explains auto-generation + ongoing optimization */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-card overflow-hidden">
            {/* Row 1: AI generated context */}
            <div className="px-5 py-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={14} strokeWidth={2} className="text-[#3B82F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-text-primary">AI has generated this structure</h4>
                <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
                  Ad sets, targeting, and budget allocation were auto-filled based on your personas, creatives, and business inputs.
                  You can edit anything below.
                </p>
              </div>
            </div>


            {/* Divider */}
            <div className="border-t border-[#3B82F6]/15" />

            {/* Row 3: Continuous optimization toggle */}
            <div className="px-5 py-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-semibold text-text-primary">Keep AI optimizing after launch</h4>
                  <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
                    Once the campaign is live, Revspot will monitor performance and suggest budget reallocation across ad sets
                    to reduce CPL. Suggestions appear in the campaign dashboard.
                  </p>
                  {autoOptimize && (
                    <div className="mt-2 text-[11px] text-[#1D4ED8] font-medium">
                      ✓ Optimization starts automatically on campaign launch
                    </div>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setAutoOptimize(!autoOptimize)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 shrink-0 mt-1 ${
                  autoOptimize ? "bg-[#3B82F6]" : "bg-gray-200"
                }`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-150 ${
                  autoOptimize ? "translate-x-[18px]" : "translate-x-[3px]"
                }`} />
              </button>
            </div>
          </motion.div>

          {/* Campaign Card (contains settings + ad sets) */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white border border-border border-l-4 border-l-accent rounded-card overflow-hidden">

            {/* Campaign Settings */}
            <div className="p-6 pb-4">
              <CampaignSettingsCard campaign={campaign} onChange={updateCampaign} />
            </div>

            {/* Ad Sets Section (nested inside campaign) */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-3 pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">Ad Sets</span>
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary">{adSets.length}</span>
                </div>
                <button onClick={addAdSet}
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors duration-150">
                  <Plus size={11} strokeWidth={2} />
                  Add Ad Set
                </button>
              </div>

              <div className="space-y-3">
                {adSets.map((adSet, i) => (
                  <AdSetCard
                    key={adSet.id}
                    adSet={adSet}
                    index={i}
                    cboEnabled={campaign.cboEnabled}
                    canDelete={adSets.length > 1}
                    onChange={(updates) => updateAdSet(adSet.id, updates)}
                    onDelete={() => deleteAdSet(adSet.id)}
                    onDuplicate={() => duplicateAdSet(adSet.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Budget Summary */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="bg-accent/5 border border-accent/20 rounded-card p-6">
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">Budget Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Total Daily Budget</span>
                <span className="block text-[16px] font-semibold text-text-primary">₹{totalDailyBudget.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Estimated CPL Range</span>
                <span className="block text-[16px] font-semibold text-text-primary">₹800 – ₹1,200</span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Estimated Leads/Day</span>
                <span className="block text-[16px] font-semibold text-text-primary">~{Math.round(totalDailyBudget / 1000)}</span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Campaign Duration</span>
                <span className="block text-[16px] font-semibold text-text-primary">{campaignDuration} days</span>
              </div>
              <div className="col-span-2 pt-3 border-t border-accent/10">
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Total Estimated Spend</span>
                <span className="block text-[20px] font-semibold text-text-primary">₹{(totalDailyBudget * campaignDuration).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button onClick={onNext} disabled={isLoading}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
          Continue to Launch <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
