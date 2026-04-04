"use client";

import { Trash2, Copy, Lock, ChevronDown, X } from "lucide-react";
import type { AdSetState, PlacementSelection } from "./types";
import { mockInstantForms } from "./types";
import { LocationSelector } from "./location-selector";
import { AudienceSuggestions } from "./audience-suggestions";
import { ManualPlacementsSelector } from "./manual-placements";

interface AdSetCardProps {
  adSet: AdSetState;
  index: number;
  cboEnabled: boolean;
  canDelete: boolean;
  onChange: (updates: Partial<AdSetState>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const genderOptions: { value: AdSetState["gender"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export function AdSetCard({
  adSet,
  index,
  cboEnabled,
  canDelete,
  onChange,
  onDelete,
  onDuplicate,
}: AdSetCardProps) {
  return (
    <div className="bg-white border border-border rounded-card hover:shadow-sm transition-shadow duration-200">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex-1 mr-3">
          <input
            type="text"
            value={adSet.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full h-8 px-2 text-[14px] font-semibold border border-transparent rounded-input bg-transparent text-text-primary hover:border-border focus:outline-none focus:border-accent transition-colors duration-150"
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors"
            title="Duplicate ad set"
          >
            <Copy size={14} strokeWidth={1.5} />
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-text-tertiary hover:text-red-600 hover:bg-red-50 rounded-button transition-colors"
              title="Delete ad set"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-0">
        {/* ── Conversion Location ─────────────────────────────── */}
        <div>
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Conversion Location
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-badge bg-surface-page text-text-secondary border border-border">
            <Lock size={11} strokeWidth={2} className="text-text-tertiary" />
            Instant Forms
          </span>
        </div>

        {/* ── Instant Form ────────────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Instant Form
          </span>
          <div className="relative">
            <select
              value={adSet.instantFormId}
              onChange={(e) => onChange({ instantFormId: e.target.value })}
              className="w-full h-9 px-3 pr-8 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none"
            >
              {mockInstantForms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
          </div>
        </div>

        {/* ── Budget (only when CBO off) ──────────────────────── */}
        {!cboEnabled && (
          <div className="border-t border-border-subtle pt-4 mt-4">
            <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
              Budget
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 flex-1">
                <span className="text-[13px] text-text-secondary shrink-0">&#8377;</span>
                <input
                  type="number"
                  value={adSet.budget}
                  onChange={(e) => onChange({ budget: Number(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-[13px] font-medium border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <div className="flex shrink-0">
                {(["daily", "lifetime"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onChange({ budgetType: t })}
                    className={`h-9 px-3 text-[12px] font-medium border transition-colors duration-150 first:rounded-l-input last:rounded-r-input ${
                      adSet.budgetType === t
                        ? "bg-accent text-white border-accent"
                        : "bg-white text-text-secondary border-border hover:bg-surface-page"
                    }`}
                  >
                    {t === "daily" ? "Daily" : "Lifetime"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Locations ───────────────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Locations
          </span>
          <LocationSelector
            locations={adSet.locations}
            onChange={(locations) => onChange({ locations })}
          />
        </div>

        {/* ── Age & Gender ────────────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-3">
            Age &amp; Gender
          </span>
          <div className="flex items-end gap-6">
            {/* Age */}
            <div className="flex items-center gap-2">
              <div>
                <span className="block text-[10px] text-text-tertiary mb-1">Min</span>
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={adSet.ageMin}
                  onChange={(e) =>
                    onChange({ ageMin: Math.max(18, Math.min(65, Number(e.target.value) || 18)) })
                  }
                  className="w-16 h-9 px-2 text-[13px] text-center font-medium border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
              <span className="text-[12px] text-text-tertiary mt-4">&ndash;</span>
              <div>
                <span className="block text-[10px] text-text-tertiary mb-1">Max</span>
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={adSet.ageMax}
                  onChange={(e) =>
                    onChange({ ageMax: Math.max(18, Math.min(65, Number(e.target.value) || 65)) })
                  }
                  className="w-16 h-9 px-2 text-[13px] text-center font-medium border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex shrink-0">
              {genderOptions.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => onChange({ gender: g.value })}
                  className={`h-9 px-3 text-[12px] font-medium border transition-colors duration-150 first:rounded-l-input last:rounded-r-input ${
                    adSet.gender === g.value
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-text-secondary border-border hover:bg-surface-page"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detailed Targeting ──────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Detailed Targeting
          </span>

          {/* Show included targeting as chips */}
          {adSet.detailedTargeting.included.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {adSet.detailedTargeting.included.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-badge bg-surface-page text-text-secondary border border-border"
                >
                  {t.name}
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        detailedTargeting: {
                          ...adSet.detailedTargeting,
                          included: adSet.detailedTargeting.included.filter((i) => i.id !== t.id),
                        },
                      })
                    }
                    className="ml-0.5 text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <X size={10} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            className="text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Browse Interests &amp; Behaviors
          </button>
        </div>

        {/* ── AI Audiences ────────────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <AudienceSuggestions
            onApply={(name) => {
              // Placeholder: just log or could add to targeting later
              console.log(`Applied audience: ${name}`);
            }}
          />
        </div>

        {/* ── Advantage+ Audience ─────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[12px] font-semibold text-text-primary">
                Advantage+ Audience
              </span>
              <span className="block text-[11px] text-text-tertiary mt-0.5">
                Let Meta find the best audience using AI optimisation.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ advantagePlusAudience: !adSet.advantagePlusAudience })}
              className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${
                adSet.advantagePlusAudience ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  adSet.advantagePlusAudience ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Advantage+ Placements ───────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[12px] font-semibold text-text-primary">
                Advantage+ Placements
              </span>
              <span className="block text-[11px] text-text-tertiary mt-0.5">
                Automatically show ads across all available placements.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ advantagePlusPlacements: !adSet.advantagePlusPlacements })}
              className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${
                adSet.advantagePlusPlacements ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  adSet.advantagePlusPlacements ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Manual placements when Advantage+ off */}
          {!adSet.advantagePlusPlacements && (
            <div className="mt-3 pl-1">
              <ManualPlacementsSelector
                placements={adSet.manualPlacements}
                onChange={(manualPlacements) => onChange({ manualPlacements })}
              />
            </div>
          )}
        </div>

        {/* ── Full Config link ────────────────────────────────── */}
        <div className="border-t border-border-subtle pt-4 mt-4">
          <button
            type="button"
            className="text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150 underline underline-offset-2"
          >
            Full Config (Advanced)
          </button>
        </div>
      </div>
    </div>
  );
}
