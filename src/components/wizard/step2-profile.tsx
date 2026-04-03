"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Pencil,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { extractedProfile, strategyData } from "@/lib/wizard-data";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function Step2BusinessProfile({ onNext, onBack }: Step2Props) {
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const personas = strategyData.personas;

  return (
    <div className="space-y-6">
      {/* Section 1: Business Profile Summary */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-semibold text-text-primary">
            Business Profile
          </h2>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150"
          >
            <Pencil size={12} strokeWidth={1.5} />
            Edit
          </button>
        </div>

        {/* Key Fields Grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Project", value: extractedProfile.projectName },
            { label: "Builder", value: extractedProfile.builderName },
            { label: "City", value: extractedProfile.city },
            { label: "Category", value: extractedProfile.industry },
            { label: "Price Positioning", value: extractedProfile.pricePositioning },
          ].map((field) => (
            <div key={field.label}>
              <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">
                {field.label}
              </span>
              <span className="block text-[13px] text-text-primary font-medium">
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Offer Summary */}
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
            Offer Summary
          </span>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {extractedProfile.offerSummary}
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
            Key Benefits
          </span>
          <div className="flex flex-wrap gap-1.5">
            {extractedProfile.keyBenefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-surface-page text-text-secondary border border-border"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Special Ad Category */}
        {extractedProfile.specialAdCategory && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-badge bg-[#FEF3C7] text-[#92400E]">
            <AlertTriangle size={11} strokeWidth={2} />
            Special Category: {extractedProfile.specialAdCategory}
          </div>
        )}
      </div>

      {/* Section 2: AI Persona Generation */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
          <h3 className="text-[16px] font-semibold text-text-primary">
            AI-Generated Personas
          </h3>
          {isGenerating && (
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          )}
        </div>

        {isGenerating ? (
          /* Loading State */
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-[13px] text-text-secondary">
                  Generating personas based on your business profile...
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-border rounded-card p-5 space-y-3"
                >
                  <div className="h-5 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="h-3 w-1/2 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-3 w-2/3 bg-surface-secondary rounded-[8px] animate-pulse" />
                  </div>
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-5 w-16 bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-5 w-20 bg-surface-secondary rounded-[8px] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Loaded State */
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {personas.map((persona, i) => (
                <motion.div
                  key={persona.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="bg-white border border-border rounded-card p-5"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[14px] font-semibold text-text-primary">
                      {persona.name}
                    </h4>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-accent/10 text-accent">
                      {persona.angle}
                    </span>
                  </div>

                  {/* Pain point */}
                  <p className="text-[11px] text-text-tertiary mb-3">
                    {persona.pain}
                  </p>

                  {/* Description */}
                  <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
                    {persona.description}
                  </p>

                  {/* Hooks as tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {persona.hooks.map((hook) => (
                      <span
                        key={hook}
                        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-badge bg-surface-page text-text-tertiary border border-border"
                      >
                        {hook}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-[12px] text-text-tertiary">
              These personas will be used to generate ad sets, creatives, and
              targeting strategy.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm & Generate Strategy
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
