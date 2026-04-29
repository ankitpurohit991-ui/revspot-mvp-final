"use client";

import {
  Pause,
  TrendingUp,
  RefreshCw,
  ArrowLeftRight,
  Plus,
  Search,
  Check,
  Hourglass,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { NextBestAction as NBAType, ActionVerb } from "@/lib/types/diagnosis-payload";
import { actionColorStyles } from "@/lib/diagnosis-data";

interface NextBestActionProps {
  action: NBAType;
  onApply?: () => void;
  onSnooze?: () => void;
}

const verbIcons: Record<ActionVerb, LucideIcon> = {
  WAIT: Hourglass,
  CONTINUE: Check,
  SCALE: TrendingUp,
  OPTIMIZE: Wand2,
  INTERVENE: ArrowLeftRight,
  URGENT: ArrowLeftRight,
  REFRESH: RefreshCw,
  ADD_ADSET: Plus,
  PAUSE: Pause,
  SHIFT_BUDGET: ArrowLeftRight,
  ADD_CREATIVE: Plus,
};

const verbLabels: Record<ActionVerb, string> = {
  WAIT: "Wait",
  CONTINUE: "Continue",
  SCALE: "Scale",
  OPTIMIZE: "Optimize",
  INTERVENE: "Intervene",
  URGENT: "Urgent",
  REFRESH: "Refresh",
  ADD_ADSET: "Add adset",
  PAUSE: "Pause",
  SHIFT_BUDGET: "Shift budget",
  ADD_CREATIVE: "Add creative",
};

export function NextBestAction({ action, onApply, onSnooze }: NextBestActionProps) {
  const colorStyle = actionColorStyles[action.color];
  const Icon = verbIcons[action.verb] ?? Search;

  return (
    <div
      className={`${colorStyle.cardBg} border ${colorStyle.cardBorder} rounded-card overflow-hidden`}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          {/* Verb badge */}
          <div className="shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 ${colorStyle.badgeBg} ${colorStyle.badgeText} text-[11px] font-semibold uppercase tracking-[0.5px] px-2.5 py-1 rounded-badge`}
            >
              <Icon size={12} strokeWidth={2} />
              {verbLabels[action.verb]}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.5px]">
              Next best action
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-text-primary leading-snug mb-1">
              {action.headline}
            </h3>
            <p className="text-[12px] text-text-secondary leading-relaxed mb-2">
              {action.reason}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white border border-border-subtle rounded-badge px-2 py-1 text-text-primary">
              <span className="text-text-tertiary uppercase tracking-[0.4px] text-[9px] font-semibold">
                Expected
              </span>
              {action.expected_impact}
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {onApply && (
              <button
                type="button"
                onClick={onApply}
                className={`h-9 px-4 text-[12px] font-medium text-white rounded-button transition-colors duration-150 ${colorStyle.ctaBg} ${colorStyle.ctaHover}`}
              >
                {action.cta_label}
              </button>
            )}
            {onSnooze && (
              <button
                type="button"
                onClick={onSnooze}
                className="text-[10px] font-medium text-text-tertiary hover:text-text-primary transition-colors px-2 py-0.5"
              >
                Snooze 24h
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
