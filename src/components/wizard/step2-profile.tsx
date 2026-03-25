"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { extractedProfile } from "@/lib/wizard-data";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step2BusinessProfile({ onNext, onBack }: Step2Props) {
  const [profile, setProfile] = useState(extractedProfile);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Business Profile</h2>
        <p className="text-meta text-text-secondary mt-1">
          AI-extracted from your brochure and website. Review and confirm.
        </p>
      </div>

      {/* Profile Fields */}
      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Builder Name", value: profile.builderName },
            { label: "Project Name", value: profile.projectName },
            { label: "City", value: profile.city },
            { label: "Industry", value: profile.industry },
            { label: "Geography", value: profile.geography },
            { label: "Price Positioning", value: profile.pricePositioning },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.value}
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150"
              />
            </div>
          ))}
        </div>

        {/* Offer Summary */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Offer Summary
          </label>
          <textarea
            defaultValue={profile.offerSummary}
            rows={3}
            className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150 resize-none leading-relaxed"
          />
        </div>

        {/* Key Benefits */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Key Benefits
          </label>
          <textarea
            defaultValue={profile.keyBenefits.join("\n")}
            rows={4}
            className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150 resize-none leading-relaxed"
          />
          <p className="text-[11px] text-text-tertiary mt-1">One benefit per line</p>
        </div>

        {/* Proof Points */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Proof Points
          </label>
          <div className="space-y-1.5">
            {profile.proofPoints.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-surface-page rounded-[6px] px-3 py-2">
                <ShieldCheck size={13} strokeWidth={1.5} className="text-status-success shrink-0" />
                <span className="text-[12px] text-text-primary">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objections */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Primary Objections
          </label>
          <textarea
            defaultValue={profile.primaryObjections.join("\n")}
            rows={3}
            className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150 resize-none leading-relaxed"
          />
        </div>

        {/* Assumptions */}
        <div>
          <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Assumptions
          </label>
          <textarea
            defaultValue={profile.assumptions.join("\n")}
            rows={3}
            className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150 resize-none leading-relaxed"
          />
        </div>

        {profile.specialAdCategory && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-badge bg-[#FEF3C7] text-[#92400E]">
            <AlertTriangle size={11} strokeWidth={2} />
            Special Category: {profile.specialAdCategory}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
            <RefreshCw size={14} strokeWidth={1.5} />
            Re-extract
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
          >
            Confirm Profile
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
