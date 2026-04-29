"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatMessage, ConceptVersion } from "./types";
import { CreativeChatPanel } from "./creative-chat-panel";
import { VersionTimeline } from "./version-timeline";
import { AdMockup } from "./ad-mockup";

interface CreativeConceptEditorProps {
  messages: ChatMessage[];
  versions: ConceptVersion[];
  activeVersionId: string | null;
  isGenerating: boolean;
  onSendMessage: (text: string) => void;
  onPickConcept: (versionId: string) => void;
  onSelectVersion: (versionId: string) => void;
  /** Branch from a non-latest version — sets it as active and the next refinement
   *  message will use it as the parent. We just call onSelectVersion under the
   *  hood; conversation context will pick up from there. */
  onBranchFromVersion: (versionId: string) => void;
  onFinalize: () => void;
  /** Empty when no concept has been picked yet. */
  hasPickedConcept: boolean;
}

export function CreativeConceptEditor({
  messages,
  versions,
  activeVersionId,
  isGenerating,
  onSendMessage,
  onPickConcept,
  onSelectVersion,
  onBranchFromVersion,
  onFinalize,
  hasPickedConcept,
}: CreativeConceptEditorProps) {
  const activeVersion = versions.find((v) => v.id === activeVersionId) ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-[2fr_3fr] h-full divide-x divide-border"
    >
      {/* Left: Chat */}
      <div className="flex flex-col min-h-0">
        <CreativeChatPanel
          messages={messages}
          isGenerating={isGenerating}
          onSend={onSendMessage}
          onPickConcept={onPickConcept}
          onFocusVersion={onSelectVersion}
          activeVersionId={activeVersionId}
          placeholder={
            hasPickedConcept
              ? "Refine — e.g., 'make it more luxurious', 'use a darker palette'"
              : "Pick one of the 4 concepts on the left to start refining."
          }
          emptyMessage="Generating concepts…"
        />
      </div>

      {/* Right: Active preview + timeline + finalize */}
      <div className="flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-6 bg-surface-page">
          {activeVersion ? (
            <div className="max-w-[480px] mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    {activeVersion.label}
                  </h3>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    {activeVersion.headline}
                  </p>
                </div>
              </div>
              <div className="aspect-square rounded-card overflow-hidden border border-border bg-white">
                <AdMockup variant={activeVersion.variant} headline={activeVersion.headline} />
              </div>
              {/* Post text preview */}
              <div className="mt-4 bg-white border border-border rounded-card p-4">
                <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.5px] mb-1.5">
                  Post text
                </div>
                <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {activeVersion.primary_text}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-[12px] text-text-tertiary max-w-[280px] mx-auto leading-relaxed">
                  Pick one of the 4 generated concepts in the chat to view it here. You can
                  refine via chat or branch from any past version.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Version timeline */}
        {versions.length > 0 && (
          <VersionTimeline
            versions={versions}
            activeVersionId={activeVersionId}
            onSelect={onSelectVersion}
            onBranch={onBranchFromVersion}
            size="lg"
          />
        )}

        {/* Finalize bar */}
        <div className="border-t border-border bg-white px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-text-tertiary leading-relaxed">
            {hasPickedConcept
              ? "Happy with the concept? Finalize to choose sizes."
              : "Pick a concept above to enable finalize."}
          </div>
          <button
            type="button"
            onClick={onFinalize}
            disabled={!hasPickedConcept}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Finalize concept
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
