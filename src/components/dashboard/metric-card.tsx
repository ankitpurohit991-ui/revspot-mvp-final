"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type CardStatus = "good" | "warning" | "bad" | "neutral";

interface MetricCardProps {
  label: string;
  value: string | number;
  previous?: string | number;
  tooltip?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
    positive?: boolean;
  };
  status?: CardStatus;
  trendContext?: string;
  /** If provided, card is clickable to toggle chart selection */
  chartKey?: string;
  isSelected?: boolean;
  onToggle?: (key: string) => void;
}

function getCardBg(status: CardStatus) {
  return {
    good: "bg-[#F7FDF9]",
    warning: "bg-[#FFFBF5]",
    bad: "bg-[#FEF9F9]",
    neutral: "bg-white",
  }[status];
}

function getCardBorder(status: CardStatus, isSelected: boolean) {
  if (isSelected) return "border-accent ring-1 ring-accent/20";
  return {
    good: "border-[#E2F5E9]",
    warning: "border-[#F5EDD8]",
    bad: "border-[#F5E2E2]",
    neutral: "border-border",
  }[status];
}

export function MetricCard({ label, value, previous, tooltip, trend, status = "neutral", trendContext, chartKey, isSelected = false, onToggle }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trendIsPositive = trend
    ? trend.positive !== undefined
      ? trend.positive
      : trend.direction === "up"
    : false;

  const isClickable = !!chartKey && !!onToggle;

  const handleClick = () => {
    if (isClickable) onToggle!(chartKey!);
  };

  const Tag = isClickable ? "button" : "div";

  return (
    <Tag
      onClick={isClickable ? handleClick : undefined}
      className={`relative text-left w-full ${getCardBg(status)} border ${getCardBorder(status, isSelected)} rounded-card px-4 py-3.5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-150 ${isClickable ? "cursor-pointer" : ""}`}
      onMouseEnter={() => { if (tooltip) timeoutRef.current = setTimeout(() => setShowTooltip(true), 300); }}
      onMouseLeave={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShowTooltip(false); }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px]">
          {label}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
              trendIsPositive ? "text-status-success" : "text-status-error"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight size={11} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={11} strokeWidth={2.5} />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      <span className="text-[22px] font-semibold text-text-primary leading-tight tabular-nums">
        {value}
      </span>
      {previous !== undefined && (
        <div className="mt-1 text-[11px] text-text-tertiary">
          prev: <span className="font-medium text-text-secondary">{previous}</span>
        </div>
      )}
      {trendContext && (
        <div className={`mt-1 text-[10px] leading-snug ${trendIsPositive ? "text-status-success" : "text-status-error"}`}>
          {trendContext}
        </div>
      )}
      {isSelected && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full" />}
      {showTooltip && tooltip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-10 pointer-events-none">
          {tooltip}
        </div>
      )}
    </Tag>
  );
}
