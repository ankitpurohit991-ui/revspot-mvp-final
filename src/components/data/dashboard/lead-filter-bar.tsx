"use client";

// Active filter chips + "+ Add filter" launcher. Bar wraps the AddFilterMenu
// popover with `relative` so the menu anchors below the button.

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { clauseLabel } from "@/lib/dashboard/filter-eval";
import type { FilterClause } from "@/lib/dashboard/types";
import { AddFilterMenu } from "./add-filter-menu";

interface Props {
  filters: FilterClause[];
  onChange: (filters: FilterClause[]) => void;
}

export function LeadFilterBar({ filters, onChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeDims = filters.map((f) => f.dim);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.4px] text-text-tertiary">
        Filters:
      </span>

      {filters.length === 0 && (
        <span className="text-[12px] text-text-secondary">
          None — showing all enriched leads
        </span>
      )}

      {filters.map((c, i) => (
        <span
          key={`${c.dim}-${i}`}
          className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 text-[11.5px] font-medium text-white bg-text-primary rounded-input"
        >
          {clauseLabel(c)}
          <button
            onClick={() => onChange(filters.filter((_, j) => j !== i))}
            aria-label="Remove filter"
            className="p-0.5 -mr-0.5 hover:bg-white/15 rounded-[3px] transition-colors"
          >
            <X size={11} strokeWidth={2} />
          </button>
        </span>
      ))}

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center gap-1 h-7 px-2.5 text-[11.5px] font-medium text-text-secondary bg-white border border-border rounded-input hover:text-text-primary transition-colors"
        >
          <Plus size={11} strokeWidth={2} />
          Add filter
        </button>
        <AddFilterMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeDims={activeDims}
          onApply={(clause) => onChange([...filters, clause])}
        />
      </div>
    </div>
  );
}
