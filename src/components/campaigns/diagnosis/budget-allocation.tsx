"use client";

import { ArrowLeftRight } from "lucide-react";
import type { BudgetAllocationData } from "@/lib/types/diagnosis-payload";
import { stanceStyles, formatINR } from "@/lib/diagnosis-data";

interface BudgetAllocationProps {
  data: BudgetAllocationData;
  onApplyTopMove?: () => void;
}

export function BudgetAllocation({ data, onApplyTopMove }: BudgetAllocationProps) {
  return (
    <div className="bg-white border border-border rounded-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border-subtle">
        <h3 className="text-section-header text-text-primary">Budget allocation</h3>
        <p className="text-[11px] text-text-tertiary mt-0.5">
          Each adset's share of spend vs share of qualified leads — shows where money is
          working harder than its weight.
        </p>
      </div>

      {/* Top move */}
      {data.top_move && (
        <div className="px-5 py-3 bg-[#FFFBEB] border-b border-[#FDE68A]/60">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[6px] bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <ArrowLeftRight size={13} strokeWidth={1.5} className="text-[#92400E]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#92400E] mb-0.5">
                Top reallocation
              </div>
              <p className="text-[13px] font-medium text-text-primary leading-snug">
                {data.top_move.headline}
              </p>
            </div>
            {onApplyTopMove && (
              <button
                type="button"
                onClick={onApplyTopMove}
                className="h-8 px-3.5 text-[12px] font-medium bg-[#B45309] text-white rounded-button hover:bg-[#92400E] transition-colors duration-150 shrink-0"
              >
                Apply move
              </button>
            )}
          </div>
        </div>
      )}

      {/* Adset table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              {[
                { label: "Adset", align: "left" },
                { label: "Spend share", align: "right" },
                { label: "Lead share", align: "right" },
                { label: "Qualified share", align: "right" },
                { label: "Efficiency", align: "right" },
                { label: "Stance", align: "center" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-4 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.adsets.map((a, i) => {
              const stance = stanceStyles[a.stance];
              const spendBarPct = Math.min(a.spend_share_pct, 100);
              const leadBarPct = Math.min(a.lead_share_pct, 100);
              const efficiencyTone =
                a.efficiency_ratio >= 1.0
                  ? "text-[#15803D]"
                  : a.efficiency_ratio >= 0.7
                  ? "text-text-primary"
                  : "text-[#B91C1C]";
              return (
                <tr
                  key={a.name}
                  className={`border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-4 py-3 text-[12px] text-text-primary font-medium whitespace-nowrap max-w-[220px] truncate">
                    {a.name}
                  </td>
                  <td className="px-4 py-3">
                    <ShareBar pct={a.spend_share_pct} barPct={spendBarPct} tone="neutral" />
                  </td>
                  <td className="px-4 py-3">
                    <ShareBar pct={a.lead_share_pct} barPct={leadBarPct} tone="positive" />
                  </td>
                  <td className="px-4 py-3 text-[12px] text-right tabular-nums text-text-secondary">
                    {a.qualified_share_pct === null
                      ? "—"
                      : `${a.qualified_share_pct.toFixed(1)}%`}
                  </td>
                  <td className={`px-4 py-3 text-[12px] text-right tabular-nums font-semibold ${efficiencyTone}`}>
                    {a.efficiency_ratio.toFixed(2)}×
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.5px] px-2 py-0.5 rounded-badge ${stance.cls}`}
                    >
                      {stance.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShareBar({
  pct,
  barPct,
  tone,
}: {
  pct: number;
  barPct: number;
  tone: "neutral" | "positive";
}) {
  const fill = tone === "positive" ? "bg-text-primary" : "bg-text-tertiary";
  return (
    <div className="flex items-center gap-2 justify-end min-w-[90px]">
      <span className="text-[12px] tabular-nums text-text-secondary font-medium">
        {pct.toFixed(1)}%
      </span>
      <div className="relative w-[60px] h-1.5 bg-surface-secondary rounded-full overflow-hidden">
        <div className={`absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width: `${barPct}%` }} />
      </div>
    </div>
  );
}

// Suppress unused import warning at compile-time
void formatINR;
