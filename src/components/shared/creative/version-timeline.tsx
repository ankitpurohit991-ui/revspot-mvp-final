"use client";

import { GitBranch } from "lucide-react";
import type { ConceptVersion } from "./types";
import { AdMockup } from "./ad-mockup";

interface VersionTimelineProps {
  versions: ConceptVersion[];
  activeVersionId: string | null;
  onSelect: (versionId: string) => void;
  /** Called when user clicks the "Continue from this version" button on a non-latest version. */
  onBranch?: (versionId: string) => void;
  /** Visual scale — "lg" for Phase B, "sm" for Phase C right pane. */
  size?: "lg" | "sm";
}

export function VersionTimeline({
  versions,
  activeVersionId,
  onSelect,
  onBranch,
  size = "lg",
}: VersionTimelineProps) {
  if (versions.length === 0) return null;

  const tileSize = size === "lg" ? "h-20 w-20" : "h-14 w-14";
  const labelSize = size === "lg" ? "text-[10px]" : "text-[9px]";

  // Find the latest version id (the one that is NOT a parent of any other version
  // AND is at the end of the chain). For our linear-with-branches model, the
  // "latest in the active chain" is the active version. So branching applies to
  // any version that has children — i.e., a version whose id is a parent of some
  // other version OR isn't the activeVersionId.
  const childrenById = new Set<string>();
  for (const v of versions) {
    if (v.parent_id) childrenById.add(v.parent_id);
  }

  return (
    <div className="border-t border-border bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.5px]">
            Version history
          </span>
          <span className="text-[11px] text-text-tertiary tabular-nums">
            {versions.length} version{versions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-end gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {/* Newest first — render in reverse so the most recent version is on the left. */}
          {versions
            .map((v, chronoIdx) => ({ v, chronoIdx }))
            .reverse()
            .map(({ v, chronoIdx }) => {
              const isActive = v.id === activeVersionId;
              const hasChildren = childrenById.has(v.id);
              const isLatest = chronoIdx === versions.length - 1;
              // Branching from the latest version is the default behavior of the
              // composer, so the "Branch" affordance is only useful on older versions.
              const showBranchHint = !isActive && !isLatest;
              return (
                <div key={v.id} className="flex flex-col items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelect(v.id)}
                    className={`relative ${tileSize} rounded-card overflow-hidden border-2 transition-all duration-150 ${
                      isActive
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-border hover:border-border-hover"
                    }`}
                  >
                    <AdMockup variant={v.variant} headline={v.headline} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
                      <div className={`${labelSize} font-medium text-white truncate text-left`}>
                        v{chronoIdx + 1}
                        {isLatest && (
                          <span className="ml-1 text-[8px] font-semibold uppercase tracking-[0.4px] text-white/80">
                            · latest
                          </span>
                        )}
                      </div>
                    </div>
                    {hasChildren && !isActive && (
                      <div className="absolute top-1 right-1 bg-white/90 text-text-tertiary p-0.5 rounded-[3px]">
                        <GitBranch size={9} strokeWidth={1.5} />
                      </div>
                    )}
                  </button>
                  {showBranchHint && onBranch && (
                    <button
                      type="button"
                      onClick={() => onBranch(v.id)}
                      title="Continue refining from this version"
                      className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <GitBranch size={9} strokeWidth={1.5} /> Branch
                    </button>
                  )}
                  {!showBranchHint && <div className="mt-1.5 h-[14px]" />}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
