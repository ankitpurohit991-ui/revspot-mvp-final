"use client";

import { Sparkles, Calendar } from "lucide-react";
import type { StatusStripData } from "@/lib/types/diagnosis-payload";
import { verdictStyles } from "@/lib/diagnosis-data";

interface StatusStripProps {
  data: StatusStripData;
}

export function StatusStrip({ data }: StatusStripProps) {
  const style = verdictStyles[data.verdict];
  return (
    <div className="bg-white border border-border rounded-card px-4 py-2.5 flex items-center gap-3">
      <div className="w-5 h-5 rounded-[5px] bg-accent flex items-center justify-center shrink-0">
        <Sparkles size={11} strokeWidth={1.5} className="text-white" />
      </div>
      <span
        className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.5px] px-2 py-0.5 rounded-badge shrink-0 ${style.pillBg} ${style.pillText}`}
      >
        {style.label}
      </span>
      <p className="text-[13px] font-medium text-text-primary truncate flex-1 min-w-0">
        {data.headline}
      </p>
      <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary shrink-0 tabular-nums">
        <Calendar size={11} strokeWidth={1.5} />
        Day {data.days_live} of {data.days_total}
      </span>
      <span className="text-border">|</span>
      <span className="text-[11px] text-text-secondary tabular-nums shrink-0">
        {data.primary_metric_summary}
      </span>
    </div>
  );
}
