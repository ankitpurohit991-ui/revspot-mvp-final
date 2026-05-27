"use client";

// Bottom half: filter bar + saved views + match tile + chart grid + add slot.
// Owns local UI state for the picker only; filters / savedViews / chartCards
// state lives in the page (so localStorage persistence stays at one level).

import { useMemo } from "react";
import { evalFilters } from "@/lib/dashboard/filter-eval";
import { DEFAULT_CHART_CARDS } from "@/lib/dashboard/types";
import type {
  ChartCardId,
  FilterClause,
  LeadProfile,
  SavedView,
} from "@/lib/dashboard/types";

import { BreakdownChartCard } from "./breakdown-chart-card";
import { LeadFilterBar } from "./lead-filter-bar";
import { SavedViewsStrip } from "./saved-views-strip";
import { LeadMatchTile } from "./lead-match-tile";
import { AddChartCardMenu } from "./add-chart-card-menu";

interface Props {
  profiles: LeadProfile[];
  filters: FilterClause[];
  onFiltersChange: (f: FilterClause[]) => void;
  savedViews: SavedView[];
  onSavedViewsChange: (v: SavedView[]) => void;
  chartCards: ChartCardId[];
  onChartCardsChange: (c: ChartCardId[]) => void;
}

export function LeadExplorer({
  profiles,
  filters,
  onFiltersChange,
  savedViews,
  onSavedViewsChange,
  chartCards,
  onChartCardsChange,
}: Props) {
  const filtered = useMemo(
    () => profiles.filter((p) => evalFilters(p, filters)),
    [profiles, filters],
  );

  return (
    <section>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.4px] text-text-tertiary mb-3">
        Who are your leads?
      </h2>

      {/* Filter row + saved views */}
      <div className="bg-white border border-border rounded-card p-3 mb-3 flex flex-col gap-2.5">
        <LeadFilterBar filters={filters} onChange={onFiltersChange} />
        <div className="border-t border-border-subtle pt-2.5">
          <SavedViewsStrip
            savedViews={savedViews}
            activeFilters={filters}
            onApplyView={(v) => onFiltersChange([...v.filters])}
            onSaveView={(v) => onSavedViewsChange([...savedViews, v])}
            onDeleteView={(id) => onSavedViewsChange(savedViews.filter((s) => s.id !== id))}
            onClearFilters={() => onFiltersChange([])}
          />
        </div>
      </div>

      {/* Match tile */}
      <LeadMatchTile matching={filtered.length} total={profiles.length} />

      {/* Chart grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {chartCards.map((cardId) => {
          const isDefault = DEFAULT_CHART_CARDS.includes(cardId);
          return (
            <BreakdownChartCard
              key={cardId}
              cardId={cardId}
              profiles={filtered}
              removable={!isDefault}
              onRemove={() => onChartCardsChange(chartCards.filter((c) => c !== cardId))}
            />
          );
        })}
        <AddChartCardMenu
          active={chartCards}
          onAdd={(c) => onChartCardsChange([...chartCards, c])}
        />
      </div>
    </section>
  );
}
