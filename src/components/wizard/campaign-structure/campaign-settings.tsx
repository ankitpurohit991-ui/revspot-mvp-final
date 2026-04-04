"use client";

import { Info } from "lucide-react";
import type {
  CampaignSettings,
  CampaignObjective,
  SpecialAdCategory,
  BidStrategy,
} from "./types";
import {
  objectiveOptions,
  specialAdCategoryOptions,
  bidStrategyOptions,
} from "./types";

interface CampaignSettingsProps {
  campaign: CampaignSettings;
  onChange: (updates: Partial<CampaignSettings>) => void;
}

/* ─── Toggle switch (matches step4-forms pattern) ─── */
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ${
      checked ? "bg-accent" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-150 ${
        checked ? "translate-x-[18px]" : "translate-x-[3px]"
      }`}
    />
  </button>
);

export function CampaignSettingsCard({ campaign, onChange }: CampaignSettingsProps) {
  /* ─── Special Ad Category logic: "none" is mutually exclusive ─── */
  const handleCategoryToggle = (value: SpecialAdCategory) => {
    if (value === "none") {
      onChange({ specialAdCategories: ["none"] });
      return;
    }
    const current = campaign.specialAdCategories.filter((c) => c !== "none");
    const exists = current.includes(value);
    const next = exists ? current.filter((c) => c !== value) : [...current, value];
    onChange({ specialAdCategories: next.length === 0 ? ["none"] : next });
  };

  return (
    <div className="bg-white border border-border rounded-card p-6">
      {/* Section label */}
      <h2 className="text-[20px] font-semibold text-text-primary mb-6">Campaign Settings</h2>

      <div className="space-y-5">
        {/* ── 1. Campaign Name ── */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaign.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
            placeholder="Enter campaign name"
          />
        </div>

        {/* ── 2. Campaign Objective ── */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
            Campaign Objective
          </label>
          <div className="flex flex-wrap gap-2">
            {objectiveOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ objective: opt.value as CampaignObjective })}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors duration-150 ${
                  campaign.objective === opt.value
                    ? "bg-accent text-white"
                    : "bg-surface-secondary text-text-secondary hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Special Ad Categories ── */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">
              Special Ad Categories
            </label>
            <div className="group relative">
              <Info size={12} strokeWidth={2} className="text-text-tertiary cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 text-[11px] text-white bg-gray-900 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-10">
                Required for ads about credit, employment, housing, or social issues
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialAdCategoryOptions.map((opt) => {
              const isActive =
                opt.value === "none"
                  ? campaign.specialAdCategories.includes("none")
                  : campaign.specialAdCategories.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCategoryToggle(opt.value as SpecialAdCategory)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors duration-150 ${
                    isActive
                      ? "bg-accent text-white"
                      : "bg-surface-secondary text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. Advantage Campaign Budget (CBO) ── */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-text-primary">
              Advantage Campaign Budget
            </label>
            <Toggle
              checked={campaign.cboEnabled}
              onChange={() => onChange({ cboEnabled: !campaign.cboEnabled })}
            />
          </div>

          {/* ── 5. Campaign Budget (conditional on CBO) ── */}
          {campaign.cboEnabled && (
            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-secondary">
                  &#8377;
                </span>
                <input
                  type="number"
                  value={campaign.budget}
                  onChange={(e) => onChange({ budget: Number(e.target.value) })}
                  className="w-full h-9 pl-7 pr-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div className="flex rounded-input border border-border overflow-hidden">
                {(["daily", "lifetime"] as const).map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => onChange({ budgetType: bt })}
                    className={`px-3 h-9 text-[12px] font-medium transition-colors duration-150 ${
                      campaign.budgetType === bt
                        ? "bg-accent text-white"
                        : "bg-white text-text-secondary hover:bg-surface-secondary"
                    }`}
                  >
                    {bt === "daily" ? "Daily" : "Lifetime"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 6. Bid Strategy ── */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
            Bid Strategy
          </label>
          <select
            value={campaign.bidStrategy}
            onChange={(e) => onChange({ bidStrategy: e.target.value as BidStrategy })}
            className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
          >
            {bidStrategyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Target CPA (conditional on cost_per_result) */}
          {campaign.bidStrategy === "cost_per_result" && (
            <div className="mt-3 relative">
              <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
                Target Cost Per Result
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-secondary">
                  &#8377;
                </span>
                <input
                  type="number"
                  value={campaign.targetCPA ?? ""}
                  onChange={(e) =>
                    onChange({ targetCPA: e.target.value ? Number(e.target.value) : null })
                  }
                  className="w-full h-9 pl-7 pr-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                  placeholder="e.g. 250"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
