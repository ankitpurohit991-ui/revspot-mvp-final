"use client";

import React, { useMemo, useState } from "react";
import {
  CircleCheck,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adSetsData } from "@/lib/campaign-data";
import type { AdSetRow } from "@/lib/campaign-data";
import { campaignDiagnosisPayload } from "@/lib/diagnosis-data";
import { CreativeGeneratorModal } from "@/components/shared/creative-generator-modal";

import { GoalTracker } from "./diagnosis/goal-tracker";
import { BudgetAllocation } from "./diagnosis/budget-allocation";
import { DiagnosisBullets } from "./diagnosis/diagnosis-bullets";
import { MoreActions } from "./diagnosis/more-actions";

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
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      <Icon size={11} strokeWidth={2} /> {label}
    </span>
  );
}

// Mock creatives per ad set — kept for the tactical AdSet Breakdown section.
const adSetCreatives: Record<
  string,
  { id: string; name: string; format: string; ctr: number; status: "active" | "paused" }[]
> = {
  "adset-1": [
    { id: "cr-1", name: "Godrej Air 3BHK Carousel v2", format: "Carousel", ctr: 2.8, status: "active" },
    { id: "cr-2", name: "Godrej Air Lifestyle Video", format: "Video", ctr: 3.4, status: "active" },
    { id: "cr-3", name: "Godrej Air Floor Plan Static", format: "Image", ctr: 0.8, status: "paused" },
  ],
  "adset-2": [
    { id: "cr-4", name: "Godrej Air Amenities Carousel", format: "Carousel", ctr: 2.1, status: "active" },
    { id: "cr-5", name: "Godrej Air NRI Investment Static", format: "Image", ctr: 1.9, status: "active" },
  ],
  "adset-3": [
    { id: "cr-6", name: "Godrej Air Family Lifestyle", format: "Video", ctr: 1.2, status: "active" },
    { id: "cr-7", name: "Godrej Air 3BHK Carousel v2", format: "Carousel", ctr: 0.9, status: "active" },
  ],
};

export function DiagnosisTab() {
  const [expandedAdSet, setExpandedAdSet] = useState<string | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [generatorAdSet, setGeneratorAdSet] = useState<string | null>(null);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

  const payload = campaignDiagnosisPayload;

  // Map of action_id → headline for diagnosis bullets that drive an action.
  const actionHeadlines = useMemo(() => {
    const map: Record<string, string> = {
      [payload.next_best_action.id]: payload.next_best_action.headline,
    };
    for (const a of payload.more_actions) map[a.id] = a.headline;
    return map;
  }, [payload]);

  const toggleAdSet = (id: string) => setExpandedAdSet((prev) => (prev === id ? null : id));
  const openGenerator = (adSetId: string) => {
    setGeneratorAdSet(adSetId);
    setGeneratorOpen(true);
  };
  const adSetName = adSetsData.find((a) => a.id === generatorAdSet)?.name || "Ad Set";

  return (
    <div className="space-y-5">
      {/* Goal tracker */}
      <GoalTracker data={payload.goal_tracker} />

      {/* Budget allocation + top move */}
      <BudgetAllocation data={payload.budget_allocation} />

      {/* Diagnosis bullets — TOF/MOF/BOF chips with action linkage */}
      <DiagnosisBullets
        bullets={payload.diagnosis}
        actionHeadlines={actionHeadlines}
        highlightActionId={hoveredActionId ?? payload.next_best_action.id}
        onSelectAction={(id) => setHoveredActionId(id)}
      />

      {/* More actions */}
      <MoreActions
        actions={payload.more_actions}
        onApply={() => {
          /* mock: mark applied — not wired to real backend */
        }}
        onDismiss={() => {
          /* mock: dismiss locally — not wired */
        }}
        onHover={setHoveredActionId}
      />

      {/* Tactical Ad Set Breakdown (kept for drill-in) */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="text-section-header text-text-primary">Ad set breakdown</h3>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Click an ad set to view and manage its creatives
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="w-6 px-2"></th>
                {[
                  { label: "Ad Set", align: "left" },
                  { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" },
                  { label: "QLs", align: "right" },
                  { label: "CPL", align: "right" },
                  { label: "CPQL", align: "right" },
                  { label: "CTR", align: "right" },
                  { label: "CVR", align: "right" },
                  { label: "Freq", align: "right" },
                  { label: "Diagnosis", align: "center" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-3 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adSetsData.map((adset, i) => {
                const isExpanded = expandedAdSet === adset.id;
                const creatives = adSetCreatives[adset.id] || [];
                return (
                  <React.Fragment key={adset.id}>
                    <tr
                      onClick={() => toggleAdSet(adset.id)}
                      className={`border-b border-border-subtle cursor-pointer transition-colors hover:bg-surface-page/60 ${
                        i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                      } ${isExpanded ? "bg-accent/5" : ""}`}
                    >
                      <td className="px-2 py-2.5 text-text-tertiary">
                        {isExpanded ? (
                          <ChevronDown size={14} strokeWidth={1.5} />
                        ) : (
                          <ChevronRight size={14} strokeWidth={1.5} />
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary font-medium whitespace-nowrap max-w-[180px] truncate">
                        {adset.name}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {formatCurrency(adset.spend)}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {adset.leads}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {adset.qualifiedLeads}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        ₹{adset.cpl.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {adset.cpql > 0 ? `₹${adset.cpql.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {adset.ctr}%
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                        {adset.ctlPercent}%
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">2.4</td>
                      <td className="px-3 py-2.5 text-center">
                        <DiagnosisBadge diagnosis={adset.diagnosis} />
                      </td>
                    </tr>

                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={11} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-surface-page px-6 py-4 border-b border-border-subtle">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <ImageIcon size={14} strokeWidth={1.5} className="text-text-tertiary" />
                                    <span className="text-[12px] font-semibold text-text-primary">
                                      Creatives in {adset.name}
                                    </span>
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary">
                                      {creatives.length}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openGenerator(adset.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors"
                                  >
                                    <Plus size={11} strokeWidth={2} /> Add Creative
                                  </button>
                                </div>

                                {creatives.length > 0 ? (
                                  <div className="grid grid-cols-3 gap-3">
                                    {creatives.map((cr) => (
                                      <div key={cr.id} className="bg-white border border-border rounded-[8px] p-3">
                                        <div className="aspect-[4/3] bg-surface-secondary rounded-[6px] flex items-center justify-center mb-2">
                                          <ImageIcon size={20} strokeWidth={1} className="text-text-tertiary" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="min-w-0">
                                            <div className="text-[11px] font-medium text-text-primary truncate">
                                              {cr.name}
                                            </div>
                                            <div className="text-[10px] text-text-tertiary mt-0.5">
                                              {cr.format} · CTR {cr.ctr}%
                                            </div>
                                          </div>
                                          <span
                                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-badge shrink-0 ml-2 ${
                                              cr.status === "active"
                                                ? "bg-[#F0FDF4] text-[#15803D]"
                                                : "bg-[#FEF3C7] text-[#92400E]"
                                            }`}
                                          >
                                            {cr.status === "active" ? "Active" : "Paused"}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6 text-[12px] text-text-tertiary">
                                    No creatives in this ad set yet
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CreativeGeneratorModal
        open={generatorOpen}
        onClose={() => {
          setGeneratorOpen(false);
          setGeneratorAdSet(null);
        }}
        onComplete={() => {
          setGeneratorOpen(false);
          setGeneratorAdSet(null);
        }}
        angleName={adSetName}
        personaName={adSetName}
        hook="Premium living in Whitefield"
        cta="Book a site visit"
      />
    </div>
  );
}
