"use client";

import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { CreativeWorkspace, SizeChat } from "./types";
import { SIZE_OPTIONS, getSize, aspectRatioFor } from "./types";
import { CreativeChatPanel } from "./creative-chat-panel";
import { VersionTimeline } from "./version-timeline";
import { AdMockup } from "./ad-mockup";

interface CreativeResizeEditorProps {
  workspace: CreativeWorkspace;
  /** The size whose tab is active. */
  activeSizeId: string;
  /** Locks composer + size operations during AI calls. */
  isGenerating: boolean;
  onToggleSize: (sizeId: string) => void;
  onSelectSize: (sizeId: string) => void;
  onSendInSize: (sizeId: string, text: string) => void;
  onSelectVersionInSize: (sizeId: string, versionId: string) => void;
  onConfirm: () => void;
}

export function CreativeResizeEditor({
  workspace,
  activeSizeId,
  isGenerating,
  onToggleSize,
  onSelectSize,
  onSendInSize,
  onSelectVersionInSize,
  onConfirm,
}: CreativeResizeEditorProps) {
  const selected = workspace.selected_sizes;
  const activeChat: SizeChat | undefined = workspace.size_chats[activeSizeId];
  const activeVersion = activeChat?.versions.find((v) => v.id === activeChat.active_version_id);
  const activeSizeMeta = getSize(activeSizeId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
    >
      {/* Size selector + tabs */}
      <div className="border-b border-border bg-white px-6 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary">
              Resize for each placement
            </h3>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Each size has its own chat — refine one without affecting the others.
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
                  {isOn ? (
                    <Check size={11} strokeWidth={2} />
                  ) : (
                    <Plus size={11} strokeWidth={2} />
                  )}
                  {s.label.split("—")[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active size tab strip */}
        <div className="flex items-center gap-0">
          {selected.map((id) => {
            const s = getSize(id);
            if (!s) return null;
            const isActive = id === activeSizeId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectSize(id)}
                className={`relative px-3 py-2 text-[12px] font-medium transition-colors duration-150 ${
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {s.label}
                <span className="text-[10px] text-text-tertiary ml-1.5 tabular-nums">
                  {s.dimensions}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="size-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    transition={{ duration: 0.15 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body — chat + preview, just like Phase B but per-size */}
      <div className="flex-1 grid grid-cols-[2fr_3fr] divide-x divide-border min-h-0">
        {/* Left: per-size chat */}
        <div className="flex flex-col min-h-0">
          {activeChat ? (
            <CreativeChatPanel
              messages={activeChat.messages}
              isGenerating={isGenerating}
              onSend={(text) => onSendInSize(activeSizeId, text)}
              onFocusVersion={(vid) => onSelectVersionInSize(activeSizeId, vid)}
              activeVersionId={activeChat.active_version_id}
              placeholder={
                activeSizeMeta
                  ? `Refine the ${activeSizeMeta.label} version… e.g., 'crop tighter on the property'`
                  : "Refine this size…"
              }
              emptyMessage={
                activeSizeMeta
                  ? `Generating ${activeSizeMeta.label}…`
                  : "Loading…"
              }
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-surface-page">
              <span className="text-[12px] text-text-tertiary">No size selected.</span>
            </div>
          )}
        </div>

        {/* Right: per-size preview + version timeline */}
        <div className="flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 bg-surface-page">
            {activeChat && activeVersion && activeSizeMeta ? (
              <div className="max-w-[420px] mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-text-primary">
                      {activeSizeMeta.label}
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5 tabular-nums">
                      {activeSizeMeta.dimensions}
                    </p>
                  </div>
                </div>
                <div
                  className="rounded-card overflow-hidden border border-border bg-white mx-auto"
                  style={{
                    aspectRatio: aspectRatioFor(activeSizeId),
                    maxWidth: activeSizeId === "story" ? 240 : activeSizeId === "portrait" ? 300 : "100%",
                  }}
                >
                  <AdMockup variant={activeVersion.variant} headline={activeVersion.headline} />
                </div>
                <div className="mt-3 text-center text-[11px] text-text-tertiary">
                  v{activeChat.versions.findIndex((v) => v.id === activeVersion.id) + 1} ·{" "}
                  {activeVersion.label}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[12px] text-text-tertiary">
                Loading preview…
              </div>
            )}
          </div>

          {activeChat && activeChat.versions.length > 0 && (
            <VersionTimeline
              versions={activeChat.versions}
              activeVersionId={activeChat.active_version_id}
              onSelect={(vid) => onSelectVersionInSize(activeSizeId, vid)}
              size="sm"
            />
          )}
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
    </motion.div>
  );
}
