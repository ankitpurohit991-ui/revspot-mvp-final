"use client";

import { Phone } from "lucide-react";

interface VoiceAgentPerformanceProps {
  metrics: {
    totalCalls: number;
    connected: { value: number; rate: number };
    qualified: { value: number; rate: number };
    avgDuration: number;
  };
  disqualificationReasons: { reason: string; percentage: number }[];
}

export function VoiceAgentPerformance({
  metrics,
  disqualificationReasons,
}: VoiceAgentPerformanceProps) {
  return (
    <div className="bg-white border border-border rounded-card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Phone size={16} strokeWidth={1.5} className="text-text-secondary" />
        <h2 className="text-section-header text-text-primary">Voice agent performance</h2>
      </div>

      {/* Mini metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-page rounded-metric px-4 py-3">
          <span className="text-[12px] text-text-tertiary block mb-0.5">Total calls</span>
          <span className="text-stat-md text-text-primary">{metrics.totalCalls}</span>
        </div>
        <div className="bg-surface-page rounded-metric px-4 py-3">
          <span className="text-[12px] text-text-tertiary block mb-0.5">Connected</span>
          <span className="text-stat-md text-text-primary">{metrics.connected.value}</span>
          <span className="text-[12px] text-text-secondary ml-1">({metrics.connected.rate}%)</span>
        </div>
        <div className="bg-surface-page rounded-metric px-4 py-3">
          <span className="text-[12px] text-text-tertiary block mb-0.5">Qualified</span>
          <span className="text-stat-md text-text-primary">{metrics.qualified.value}</span>
          <span className="text-[12px] text-text-secondary ml-1">({metrics.qualified.rate}%)</span>
        </div>
        <div className="bg-surface-page rounded-metric px-4 py-3">
          <span className="text-[12px] text-text-tertiary block mb-0.5">Avg duration</span>
          <span className="text-stat-md text-text-primary">{metrics.avgDuration}</span>
          <span className="text-[12px] text-text-secondary ml-1">min</span>
        </div>
      </div>

      {/* Disqualification reasons */}
      <div>
        <h3 className="text-[12px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
          Top disqualification reasons
        </h3>
        <div className="space-y-2.5">
          {disqualificationReasons.map((item) => (
            <div key={item.reason}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-text-secondary">{item.reason}</span>
                <span className="text-[13px] font-medium text-text-primary tabular-nums">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-charcoal/20 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
