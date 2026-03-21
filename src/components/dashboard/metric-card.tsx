"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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
}

export function MetricCard({ label, value, previous, tooltip, trend }: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const trendIsPositive = trend
    ? trend.positive !== undefined
      ? trend.positive
      : trend.direction === "up"
    : false;

  return (
    <div
      className="relative bg-white border border-border rounded-card px-4 py-3.5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-150"
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
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
        <div className="mt-1.5 text-[11px] text-text-tertiary">
          prev: <span className="font-medium text-text-secondary">{previous}</span>
        </div>
      )}
      {showTooltip && tooltip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
}
