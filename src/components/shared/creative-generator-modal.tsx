"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  ChatMessage,
  ConceptVersion,
  CreativePhase,
  CreativeWorkspace,
  GeneratedCreative,
} from "./creative/types";
import {
  emptyWorkspace,
  getSize,
  makeMockReply,
  makeMockVersion,
  mkId,
  pickFreshVariant,
} from "./creative/types";
import { CreativeSetupPanel } from "./creative/creative-setup-panel";
import { CreativeConceptEditor } from "./creative/creative-concept-editor";
import { CreativeResizeEditor } from "./creative/creative-resize-editor";
import { StrategyStrip } from "./creative/strategy-strip";

/* ------------------------------------------------------------------ */
/*  Public types — preserved so consumers don't change                 */
/* ------------------------------------------------------------------ */

export type { GeneratedCreative };

interface CreativeGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (creatives: GeneratedCreative[]) => void;
  angleName: string;
  personaName: string;
  personaRole?: string;
  personaBullets?: string[];
  painPoint?: string;
  usp?: string;
  hook: string;
  cta: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

const PHASES: { id: CreativePhase; label: string }[] = [
  { id: "setup", label: "Setup" },
  { id: "concept", label: "Concept" },
  { id: "resize", label: "Resize" },
];

const MOCK_LATENCY_MS = 1400;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CreativeGeneratorModal({
  open,
  onClose,
  onComplete,
  angleName,
  personaName,
  personaRole,
  painPoint,
  usp,
  hook,
  cta,
}: CreativeGeneratorModalProps) {
  const [phase, setPhase] = useState<CreativePhase>("setup");
  const [workspace, setWorkspace] = useState<CreativeWorkspace>(emptyWorkspace);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state whenever the modal is opened.
  useEffect(() => {
    if (!open) return;
    setPhase("setup");
    setWorkspace(emptyWorkspace());
    setIsGenerating(false);
  }, [open]);

  /* ---------- Phase A handlers ---------- */

  const handlePromptChange = (text: string) =>
    setWorkspace((w) => ({ ...w, prompt: text }));

  const handleStyleRef = (file: { name: string } | null) =>
    setWorkspace((w) => ({ ...w, style_reference: file }));

  const handleProductImage = (file: { name: string } | null) =>
    setWorkspace((w) => ({ ...w, product_image: file }));

  const handleGenerateInitialConcepts = () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const userMessage: ChatMessage = {
      id: mkId("msg"),
      role: "user",
      text: workspace.prompt,
      created_at: Date.now(),
    };
    const pendingMessage: ChatMessage = {
      id: mkId("msg"),
      role: "ai",
      text: "Generating concept…",
      pending: true,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      concept_messages: [userMessage, pendingMessage],
    }));
    setPhase("concept");

    window.setTimeout(() => {
      const firstVer = makeMockVersion({ parent_id: null, labelPrefix: "Option 1" });
      const aiReply: ChatMessage = {
        id: mkId("msg"),
        role: "ai",
        text: "Here's a concept based on your prompt. Refine it via chat, or click 'Generate new option' on the right for a fresh take.",
        version_id: firstVer.id,
        created_at: Date.now(),
      };
      setWorkspace((w) => ({
        ...w,
        concept_messages: [userMessage, aiReply],
        concept_versions: [firstVer],
        active_concept_version_id: firstVer.id,
      }));
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  /* ---------- Phase B handlers ---------- */

  const handleSelectConceptVersion = (versionId: string) => {
    setWorkspace((w) => ({ ...w, active_concept_version_id: versionId }));
  };

  /**
   * Generate a fresh "new option" — a sibling concept rooted at the original
   * prompt rather than a refinement of the active version. We pick a variant
   * that isn't already in use to keep the visual variety high.
   */
  const handleGenerateNewOption = () => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Find which "Option N" we're up to — count root-level (parent_id null)
    // versions in the chain so the label increments.
    const optionCount = workspace.concept_versions.filter((v) => v.parent_id === null).length + 1;
    const usedVariants = workspace.concept_versions.map((v) => v.variant);
    const variant = pickFreshVariant(usedVariants);

    const userMessage: ChatMessage = {
      id: mkId("msg"),
      role: "user",
      text: "Generate another option.",
      created_at: Date.now(),
    };
    const pendingMessage: ChatMessage = {
      id: mkId("msg"),
      role: "ai",
      text: "Generating a new option…",
      pending: true,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      concept_messages: [...w.concept_messages, userMessage, pendingMessage],
    }));

    window.setTimeout(() => {
      const newVer = makeMockVersion({
        parent_id: null,
        preferVariant: variant,
        labelPrefix: `Option ${optionCount}`,
      });
      const aiReply: ChatMessage = {
        id: mkId("msg"),
        role: "ai",
        text: `Here's option ${optionCount}. Pick whichever feels right — you can keep generating more.`,
        version_id: newVer.id,
        created_at: Date.now(),
      };
      setWorkspace((w) => {
        const messagesWithoutPending = w.concept_messages.filter((m) => !m.pending);
        return {
          ...w,
          concept_messages: [...messagesWithoutPending, aiReply],
          concept_versions: [...w.concept_versions, newVer],
          active_concept_version_id: newVer.id,
        };
      });
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  const handleBranchFromVersion = (versionId: string) => {
    // Branching just means: set this version as the new active, so the next
    // refinement message uses it as the parent. Adds an AI note in the chat
    // so the user sees their branch was acknowledged.
    const branchNote: ChatMessage = {
      id: mkId("msg"),
      role: "ai",
      text: "Branching from this version. Send your next refinement and I'll continue from here.",
      version_id: versionId,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      active_concept_version_id: versionId,
      concept_messages: [...w.concept_messages, branchNote],
    }));
  };

  const handleSendConceptMessage = (text: string) => {
    if (isGenerating) return;
    const parent = workspace.active_concept_version_id;
    if (!parent) return; // shouldn't happen after the single-concept handoff
    setIsGenerating(true);

    const userMessage: ChatMessage = {
      id: mkId("msg"),
      role: "user",
      text,
      created_at: Date.now(),
    };
    const pendingMessage: ChatMessage = {
      id: mkId("msg"),
      role: "ai",
      text: "Refining…",
      pending: true,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      concept_messages: [...w.concept_messages, userMessage, pendingMessage],
    }));

    window.setTimeout(() => {
      const newVer = makeMockVersion({
        parent_id: parent,
        labelPrefix: `v${workspace.concept_versions.length + 1}`,
        refinementText: text,
      });
      const aiReply: ChatMessage = {
        id: mkId("msg"),
        role: "ai",
        text: makeMockReply(text),
        version_id: newVer.id,
        created_at: Date.now(),
      };
      setWorkspace((w) => {
        const messagesWithoutPending = w.concept_messages.filter((m) => !m.pending);
        return {
          ...w,
          concept_messages: [...messagesWithoutPending, aiReply],
          concept_versions: [...w.concept_versions, newVer],
          active_concept_version_id: newVer.id,
        };
      });
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  const handleFinalizeConcept = () => {
    const activeId = workspace.active_concept_version_id;
    if (!activeId) return;
    const activeVer = workspace.concept_versions.find((v) => v.id === activeId);
    if (!activeVer) return;

    // Seed every currently-selected size with a fresh version cloned from
    // the finalized concept.
    setWorkspace((w) => {
      const nextSizeVersions: Record<string, ConceptVersion> = { ...w.size_versions };
      for (const sizeId of w.selected_sizes) {
        nextSizeVersions[sizeId] = makeSizeVersion(sizeId, activeVer);
      }
      return { ...w, size_versions: nextSizeVersions };
    });
    setPhase("resize");
  };

  /* ---------- Phase C handlers ---------- */

  const handleToggleSize = (sizeId: string) => {
    setWorkspace((w) => {
      const isSelected = w.selected_sizes.includes(sizeId);
      if (isSelected) {
        // Don't allow removing the last size.
        if (w.selected_sizes.length === 1) return w;
        const nextSizeVersions = { ...w.size_versions };
        delete nextSizeVersions[sizeId];
        const nextSelected = w.selected_sizes.filter((id) => id !== sizeId);
        return { ...w, selected_sizes: nextSelected, size_versions: nextSizeVersions };
      }

      // Adding a new size — seed it from the finalized concept.
      const activeId = w.active_concept_version_id;
      const activeVer = activeId ? w.concept_versions.find((v) => v.id === activeId) : undefined;
      const nextSizeVersions = { ...w.size_versions };
      if (activeVer && !nextSizeVersions[sizeId]) {
        nextSizeVersions[sizeId] = makeSizeVersion(sizeId, activeVer);
      }
      return {
        ...w,
        selected_sizes: [...w.selected_sizes, sizeId],
        size_versions: nextSizeVersions,
      };
    });
  };

  /**
   * Regenerate a single size, optionally with a refinement prompt. The current
   * version is replaced (no per-size history kept — keeps the resize flow
   * intentionally lightweight).
   */
  const handleRegenerateSize = (sizeId: string, refinementText?: string) => {
    if (isGenerating) return;
    const current = workspace.size_versions[sizeId];
    if (!current) return;
    setIsGenerating(true);

    window.setTimeout(() => {
      setWorkspace((w) => {
        const cur = w.size_versions[sizeId];
        if (!cur) return w;
        const replacement = makeMockVersion({
          parent_id: cur.id,
          preferVariant: cur.variant,
          labelPrefix: `${getSize(sizeId)?.label ?? "size"} v${(extractVersionNumber(cur.label) ?? 1) + 1}`,
          refinementText: refinementText?.trim() ? refinementText : undefined,
        });
        return {
          ...w,
          size_versions: { ...w.size_versions, [sizeId]: replacement },
        };
      });
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  const handleConfirm = () => {
    const out: GeneratedCreative[] = [];
    for (const sizeId of workspace.selected_sizes) {
      const ver = workspace.size_versions[sizeId];
      if (!ver) continue;
      const sizeMeta = getSize(sizeId);
      out.push({
        id: `creative-${sizeId}-${Date.now()}`,
        size: sizeMeta?.dimensions ?? "1080×1080",
        label: sizeMeta?.label ?? "Square",
        postText: ver.primary_text,
        headline: ver.headline,
        description: ver.description,
      });
    }
    onComplete(out);
  };

  /* ---------- Computed ---------- */

  const phaseIndex = useMemo(() => PHASES.findIndex((p) => p.id === phase), [phase]);

  const handlePhaseClick = (target: CreativePhase) => {
    // Only allow stepping back to a phase the user has already passed through.
    const targetIndex = PHASES.findIndex((p) => p.id === target);
    if (targetIndex <= phaseIndex) {
      setPhase(target);
    }
  };

  /* ---------- Render ---------- */

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/30 z-[80] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-card border border-border shadow-2xl w-full max-w-[1120px] h-[88vh] max-h-[820px] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-[8px] bg-accent flex items-center justify-center shrink-0">
                <Sparkles size={14} strokeWidth={1.5} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-text-primary leading-tight truncate">
                  Generate creative
                </div>
                <div className="text-[11px] text-text-tertiary leading-tight truncate">
                  {angleName} · {personaName}
                </div>
              </div>
              {/* Phase breadcrumb */}
              <div className="flex items-center gap-1 ml-4">
                {PHASES.map((p, i) => {
                  const isActive = p.id === phase;
                  const isPast = i < phaseIndex;
                  const isClickable = isActive || isPast;
                  return (
                    <div key={p.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => isClickable && handlePhaseClick(p.id)}
                        disabled={!isClickable}
                        className={`text-[11px] font-medium px-2 py-1 rounded-button transition-colors ${
                          isActive
                            ? "bg-accent text-white"
                            : isPast
                            ? "text-text-secondary hover:text-text-primary hover:bg-surface-page"
                            : "text-text-tertiary cursor-default"
                        }`}
                      >
                        {i + 1}. {p.label}
                      </button>
                      {i < PHASES.length - 1 && (
                        <ChevronRight size={11} strokeWidth={1.5} className="text-text-tertiary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors duration-150"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Strategy strip — always visible (collapsible) so the user can
              refer back to pain point / USP / hook / CTA while iterating. */}
          <StrategyStrip
            angleName={angleName}
            personaName={personaName}
            personaRole={personaRole}
            painPoint={painPoint}
            usp={usp}
            hook={hook}
            cta={cta}
          />

          {/* Body — switches between phases */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {phase === "setup" && (
              <div className="overflow-y-auto h-full">
                <CreativeSetupPanel
                  workspace={workspace}
                  onPromptChange={handlePromptChange}
                  onUploadStyleRef={handleStyleRef}
                  onUploadProductImage={handleProductImage}
                  onGenerate={handleGenerateInitialConcepts}
                  contextHint={`${hook} · CTA: ${cta}`}
                  isGenerating={isGenerating}
                />
              </div>
            )}

            {phase === "concept" && (
              <CreativeConceptEditor
                messages={workspace.concept_messages}
                versions={workspace.concept_versions}
                activeVersionId={workspace.active_concept_version_id}
                isGenerating={isGenerating}
                onSendMessage={handleSendConceptMessage}
                onSelectVersion={handleSelectConceptVersion}
                onBranchFromVersion={handleBranchFromVersion}
                onGenerateNewOption={handleGenerateNewOption}
                onFinalize={handleFinalizeConcept}
              />
            )}

            {phase === "resize" && (
              <CreativeResizeEditor
                workspace={workspace}
                isGenerating={isGenerating}
                onToggleSize={handleToggleSize}
                onRegenerateSize={handleRegenerateSize}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Build the initial version for a sizeId, seeded from the finalized concept.
 * Used both when entering Phase C and when adding a new size mid-flow.
 */
function makeSizeVersion(sizeId: string, fromVersion: ConceptVersion): ConceptVersion {
  const sizeLabel = getSize(sizeId)?.label ?? "size";
  return {
    ...fromVersion,
    id: mkId("ver"),
    parent_id: fromVersion.id,
    label: `${sizeLabel} v1`,
    created_at: Date.now(),
  };
}

/** Pull the numeric suffix off a `"… v3"` style label. */
function extractVersionNumber(label: string): number | null {
  const m = label.match(/v(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}
