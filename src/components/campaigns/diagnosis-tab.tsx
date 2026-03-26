"use client";

import {
  CircleCheck, AlertTriangle, XCircle, TrendingDown, Lightbulb,
} from "lucide-react";
import { campaignDiagnosis, adSetsData } from "@/lib/campaign-data";
import type { AdSetRow } from "@/lib/campaign-data";

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function DiagnosisBadge({ diagnosis }: { diagnosis: AdSetRow["diagnosis"] }) {
  const cfg = {
    "on-track": { icon: CircleCheck, label: "On Track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": { icon: AlertTriangle, label: "Attention", cls: "text-[#92400E] bg-[#FEF3C7]" },
    "pause-candidate": { icon: XCircle, label: "Pause", cls: "text-status-error bg-[#FEF2F2]" },
  };
  const { icon: Icon, label, cls } = cfg[diagnosis];
  return <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}><Icon size={11} strokeWidth={2} /> {label}</span>;
}

function CampaignStatusBadge({ status }: { status: "on-target" | "near-target" | "off-target" }) {
  const cfg = {
    "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
    "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
    "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { label, cls } = cfg[status];
  return <span className={`inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-badge ${cls}`}>{label}</span>;
}

export function DiagnosisTab() {
  return (
    <div className="space-y-6">
      {/* AI Diagnosis */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-section-header text-text-primary">Campaign Diagnosis</h3>
          <CampaignStatusBadge status={campaignDiagnosis.status} />
        </div>
        <p className="text-[13px] text-text-primary leading-relaxed mb-5">{campaignDiagnosis.summary}</p>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">Why</span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.reasons.map((r, i) => (
                <li key={i} className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-text-tertiary before:rounded-full">{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Lightbulb size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">What to do</span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.recommendations.map((r, i) => (
                <li key={i} className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-accent before:rounded-full">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ad Sets Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="text-section-header text-text-primary">Ad Set Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Ad Set", align: "left" }, { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" }, { label: "QLs", align: "right" },
                  { label: "CPL", align: "right" }, { label: "CPQL", align: "right" },
                  { label: "CTR", align: "right" }, { label: "CVR", align: "right" },
                  { label: "Freq", align: "right" }, { label: "Diagnosis", align: "center" },
                ].map((h) => (
                  <th key={h.label} className={`px-3 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adSetsData.map((adset, i) => (
                <tr key={adset.id} className={`border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary font-medium whitespace-nowrap max-w-[180px] truncate">{adset.name}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{formatCurrency(adset.spend)}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.leads}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.qualifiedLeads}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">₹{adset.cpl.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.cpql > 0 ? `₹${adset.cpql.toLocaleString("en-IN")}` : "—"}</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.ctr}%</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">{adset.ctlPercent}%</td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">2.4</td>
                  <td className="px-3 py-2.5 text-center"><DiagnosisBadge diagnosis={adset.diagnosis} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
