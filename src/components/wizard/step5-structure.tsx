"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Users,
  Heart,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import { campaignStructureData } from "@/lib/wizard-data";

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
}

interface AdSetState {
  id: string;
  name: string;
  persona: string;
  targeting: {
    geo: string;
    audience: string;
    interests: string;
  };
  dailyBudget: number;
  assignedCreatives: string[];
  assignedForm: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function Step5Structure({ onNext, onBack }: Step5Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [campaignName, setCampaignName] = useState(
    campaignStructureData.campaignName
  );
  const [adSets, setAdSets] = useState<AdSetState[]>(
    campaignStructureData.adSets.map((a) => ({ ...a }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const updateAdSetName = (id: string, name: string) => {
    setAdSets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, name } : a))
    );
  };

  const updateAdSetBudget = (id: string, dailyBudget: number) => {
    setAdSets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dailyBudget } : a))
    );
  };

  const totalDailyBudget = adSets.reduce((sum, a) => sum + a.dailyBudget, 0);
  const campaignDuration = 30;
  const totalEstimatedSpend = totalDailyBudget * campaignDuration;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
        <h2 className="text-[20px] font-semibold text-text-primary">
          Campaign Structure
        </h2>
        {isLoading && (
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
        )}
      </div>

      {isLoading ? (
        /* Loading State */
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-text-secondary">
                Generating campaign structure...
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-card p-5 space-y-3"
              >
                <div className="h-5 w-1/2 bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="flex gap-2 pt-1">
                  <div className="h-8 w-24 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="h-8 w-24 bg-surface-secondary rounded-[8px] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Loaded State */
        <div className="space-y-5">
          {/* Campaign Name */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white border border-border rounded-card p-6"
          >
            <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full h-10 px-3 text-[16px] font-semibold border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
            />
          </motion.div>

          {/* Ad Sets */}
          {adSets.map((adSet, i) => (
            <motion.div
              key={adSet.id}
              custom={i + 1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white border border-border rounded-card p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-3">
                  <input
                    type="text"
                    value={adSet.name}
                    onChange={(e) => updateAdSetName(adSet.id, e.target.value)}
                    className="w-full h-8 px-2 text-[14px] font-semibold border border-transparent rounded-input bg-transparent text-text-primary hover:border-border focus:outline-none focus:border-accent transition-colors duration-150"
                  />
                </div>
                <span className="shrink-0 inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-accent/10 text-accent">
                  {adSet.persona}
                </span>
              </div>

              {/* Targeting */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin
                    size={13}
                    strokeWidth={1.5}
                    className="text-text-tertiary mt-[2px] shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-0.5">
                      Geo
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {adSet.targeting.geo.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-page text-text-secondary border border-border"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users
                    size={13}
                    strokeWidth={1.5}
                    className="text-text-tertiary mt-[2px] shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-0.5">
                      Audience
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {adSet.targeting.audience.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-page text-text-secondary border border-border"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Heart
                    size={13}
                    strokeWidth={1.5}
                    className="text-text-tertiary mt-[2px] shrink-0"
                  />
                  <div>
                    <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-0.5">
                      Interests
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {adSet.targeting.interests.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-page text-text-secondary border border-border"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee
                    size={13}
                    strokeWidth={1.5}
                    className="text-text-tertiary shrink-0"
                  />
                  <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">
                    Daily Budget
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] text-text-secondary">&#8377;</span>
                  <input
                    type="number"
                    value={adSet.dailyBudget}
                    onChange={(e) =>
                      updateAdSetBudget(adSet.id, Number(e.target.value) || 0)
                    }
                    className="w-24 h-8 px-2 text-[13px] font-medium border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                  />
                </div>
              </div>

              {/* Assigned Creative & Form */}
              <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                <div>
                  <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                    Creative
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {adSet.assignedCreatives.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-blue-50 text-blue-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                    Form
                  </span>
                  <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-green-50 text-green-700">
                    {adSet.assignedForm}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Budget Summary */}
          <motion.div
            custom={adSets.length + 1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white border border-border rounded-card p-6"
          >
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">
              Budget Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                  Total Daily Budget
                </span>
                <span className="block text-[16px] font-semibold text-text-primary">
                  &#8377;{totalDailyBudget.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                  Estimated CPL Range
                </span>
                <span className="block text-[16px] font-semibold text-text-primary">
                  &#8377;{campaignStructureData.estimatedCPL.min.toLocaleString("en-IN")} &ndash; &#8377;{campaignStructureData.estimatedCPL.max.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                  Estimated Leads/Day
                </span>
                <span className="block text-[16px] font-semibold text-text-primary">
                  ~{campaignStructureData.estimatedLeadsPerDay}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                  Campaign Duration
                </span>
                <span className="block text-[16px] font-semibold text-text-primary">
                  {campaignDuration} days
                </span>
              </div>
              <div className="col-span-2 pt-3 border-t border-border-subtle">
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                  Total Estimated Spend
                </span>
                <span className="block text-[20px] font-semibold text-text-primary">
                  &#8377;{totalEstimatedSpend.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={isLoading}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Launch <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
