"use client";

import { useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  /** Previous period value: "₹5.9L", "104" */
  previous?: string | number;
  /** Absolute change shown as small pill: "+23", "-₹62" */
  delta?: string;
  tooltip?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
    positive?: boolean;
  };
  /** Secondary metric shown prominently: "15% verification rate" */
  subMetric?: string;
  /** Trend context: "+23 vs last 30d" */
  trendContext?: string;
  /** Chart selection */
  chartKey?: string;
  isSelected?: boolean;
  onToggle?: (key: string) => void;
  /** Icon component to show in top-left */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
}

export function MetricCard({
  label, value, previous, delta, tooltip, trend, subMetric, trendContext,
  chartKey, isSelected = false, onToggle, icon: Icon,
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trendIsPositive = trend
    ? trend.positive !== undefined ? trend.positive : trend.direction === "up"
    : false;

  const isClickable = !!chartKey && !!onToggle;
  const Tag = isClickable ? "button" : "div";

  return (
    <Tag
      onClick={isClickable ? () => onToggle!(chartKey!) : undefined}
      className={`relative text-left w-full bg-white border rounded-card px-4 py-3.5 transition-all duration-150 hover:shadow-card-hover hover:-translate-y-px min-h-[120px] flex flex-col ${
        isSelected ? "border-accent ring-1 ring-accent/20" : "border-border"
      } ${isClickable ? "cursor-pointer" : ""}`}
      onMouseEnter={() => { if (tooltip) timeoutRef.current = setTimeout(() => setShowTooltip(true), 300); }}
      onMouseLeave={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShowTooltip(false); }}
    >
      {/* Row 1: Icon/Label + Trend Icon */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={13} strokeWidth={1.5} className="text-text-tertiary" />}
          <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px]">
            {label}
          </span>
        </div>
        {trend && (
          <div className={`${trendIsPositive ? "text-status-success" : "text-status-error"}`}>
            {trend.direction === "up"
              ? <TrendingUp size={16} strokeWidth={2} />
              : <TrendingDown size={16} strokeWidth={2} />
            }
          </div>
        )}
      </div>

      {/* Row 2: Value + Delta badge */}
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-semibold text-text-primary leading-tight tabular-nums">
          {value}
        </span>
        {delta && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] tabular-nums ${
            trendIsPositive ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#FEF2F2] text-[#DC2626]"
          }`}>
            {delta}
          </span>
        )}
      </div>

      {/* Row 3: Sub-metric — prominent inline badge */}
      {subMetric && (
        <div className="mt-1.5">
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-surface-secondary text-text-primary tabular-nums">
            {subMetric}
          </span>
        </div>
      )}

      {/* Row 4: Previous + trend context — pushed to bottom */}
      <div className="mt-auto pt-1">
        {previous !== undefined && (
          <div className="text-[11px] text-text-tertiary tabular-nums">
            prev: <span className="font-medium text-text-secondary">{previous}</span>
          </div>
        )}
        {trendContext && (
          <div className={`text-[10px] ${trendIsPositive ? "text-status-success" : "text-status-error"}`}>
            {trendContext}
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-full" />}

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-10 pointer-events-none">
          {tooltip}
        </div>
      )}
    </Tag>
  );
}
