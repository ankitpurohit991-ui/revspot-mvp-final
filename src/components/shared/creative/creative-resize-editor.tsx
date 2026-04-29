"use client";

import { useState } from "react";
import { Check, Plus, RefreshCw, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CreativeWorkspace } from "./types";
import { SIZE_OPTIONS, getSize, aspectRatioFor } from "./types";
import { AdMockup } from "./ad-mockup";

interface CreativeResizeEditorProps {
  workspace: CreativeWorkspace;
  isGenerating: boolean;
  onToggleSize: (sizeId: string) => void;
  /** Regenerate one size, optionally with a refinement prompt. */
  onRegenerateSize: (sizeId: string, refinementText?: string) => void;
  onConfirm: () => void;
}

export function CreativeResizeEditor({
  workspace,
  isGenerating,
  onToggleSize,
  onRegenerateSize,
  onConfirm,
}: CreativeResizeEditorProps) {
  const [regenSizeId, setRegenSizeId] = useState<string | null>(null);
  // Track which sizeId is currently being regenerated, so only that card shows
  // a spinner instead of the global isGenerating dimming the whole grid.
  const [activeRegenSizeId, setActiveRegenSizeId] = useState<string | null>(null);

  const selected = workspace.selected_sizes;

  const handleRegenSubmit = (refinement?: string) => {
    if (!regenSizeId) return;
    setActiveRegenSizeId(regenSizeId);
    onRegenerateSize(regenSizeId, refinement);
    setRegenSizeId(null);
  };

  // Clear the per-card spinner once the global generating flag flips back.
  if (!isGenerating && activeRegenSizeId) {
    // Defer to next tick to avoid setState-in-render warnings.
    queueMicrotask(() => setActiveRegenSizeId(null));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
    >
      {/* Size selector */}
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary">Resize for placements</h3>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Each size can be regenerated independently — open it to add a refinement prompt or
              just shuffle.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {SIZE_OPTIONS.map((s) => {
              const isOn = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onToggleSize(s.id)}
                  className={`inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-medium rounded-button border transition-colors duration-150 ${
                    isOn
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-text-secondary border-border hover:border-border-hover hover:text-text-primary"
                  }`}
                  title={s.dimensions}
                >
                  {isOn ? <Check size={11} strokeWidth={2} /> : <Plus size={11} strokeWidth={2} />}
                  {s.label.split("—")[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Size grid */}
      <div className="flex-1 overflow-y-auto bg-surface-page p-6">
        <div className="grid grid-cols-2 gap-4 max-w-[920px] mx-auto">
          {selected.map((sizeId) => {
            const sizeMeta = getSize(sizeId);
            const ver = workspace.size_versions[sizeId];
            if (!sizeMeta) return null;
            const isRegen = activeRegenSizeId === sizeId;
            return (
              <div
                key={sizeId}
                className="bg-white border border-border rounded-card overflow-hidden flex flex-col"
              >
                <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary truncate">
                      {sizeMeta.label}
                    </div>
                    <div className="text-[10px] text-text-tertiary tabular-nums">
                      {sizeMeta.dimensions}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegenSizeId(sizeId)}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1 h-7 px-2.5 text-[11px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page hover:text-text-primary transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={11} strokeWidth={1.5} className={isRegen ? "animate-spin" : ""} />
                    {isRegen ? "Regenerating…" : "Regenerate"}
                  </button>
                </div>
                <div className="p-4 flex items-center justify-center bg-surface-page min-h-[260px]">
                  {ver ? (
                    <div
                      className="rounded-card overflow-hidden border border-border bg-white"
                      style={{
                        aspectRatio: aspectRatioFor(sizeId),
                        maxWidth:
                          sizeId === "story" ? 220 :
                          sizeId === "portrait" ? 260 :
                          sizeId === "landscape" ? 360 :
                          280,
                        width: "100%",
                        opacity: isRegen ? 0.4 : 1,
                        transition: "opacity 0.15s",
                      }}
                    >
                      <AdMockup variant={ver.variant} headline={ver.headline} />
                    </div>
                  ) : (
                    <div className="text-[11px] text-text-tertiary">No preview yet</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm bar */}
      <div className="border-t border-border bg-white px-6 py-3 flex items-center justify-between">
        <div className="text-[11px] text-text-tertiary">
          {selected.length} size{selected.length !== 1 ? "s" : ""} ready to confirm.
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={selected.length === 0 || isGenerating}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={14} strokeWidth={2} />
          Confirm & add to campaign
        </button>
      </div>

      {/* Regenerate popup */}
      <AnimatePresence>
        {regenSizeId && (
          <RegeneratePopup
            sizeLabel={getSize(regenSizeId)?.label ?? "this size"}
            onCancel={() => setRegenSizeId(null)}
            onSubmit={handleRegenSubmit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Regenerate popup                                                   */
/* ------------------------------------------------------------------ */

interface RegeneratePopupProps {
  sizeLabel: string;
  onCancel: () => void;
  onSubmit: (refinement?: string) => void;
}

function RegeneratePopup({ sizeLabel, onCancel, onSubmit }: RegeneratePopupProps) {
  const [text, setText] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-[5] bg-black/30 flex items-center justify-center p-6"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-card border border-border shadow-2xl w-full max-w-[440px] overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center">
              <Sparkles size={13} strokeWidth={1.5} className="text-white" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-text-primary">Regenerate {sizeLabel}</div>
              <div className="text-[11px] text-text-tertiary">
                Add a prompt — or just hit Regenerate for a fresh take.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-5">
          <label className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.5px] mb-1.5">
            What should change? (optional)
          </label>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., 'crop tighter on the property', 'use a darker palette', 'make the headline urgent'"
            rows={3}
            className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed"
          />
        </div>
        <div className="px-5 py-3 border-t border-border-subtle bg-surface-page flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(text.trim() ? text : undefined)}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-accent text-white text-[12px] font-medium rounded-button hover:bg-accent-hover transition-colors"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
            Regenerate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
