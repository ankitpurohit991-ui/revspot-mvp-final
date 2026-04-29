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
  SizeChat,
} from "./creative/types";
import {
  emptyWorkspace,
  getSize,
  makeInitialGrid,
  makeMockReply,
  makeMockVersion,
  mkId,
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
  const [activeSizeId, setActiveSizeId] = useState<string>("sq-feed");
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state whenever the modal is opened.
  useEffect(() => {
    if (!open) return;
    setPhase("setup");
    setWorkspace(emptyWorkspace());
    setActiveSizeId("sq-feed");
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
      text: "Generating 4 concepts…",
      pending: true,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      concept_messages: [userMessage, pendingMessage],
    }));
    setPhase("concept");

    window.setTimeout(() => {
      const grid = makeInitialGrid();
      const aiReply: ChatMessage = {
        id: mkId("msg"),
        role: "ai",
        text:
          "Here are 4 concepts based on your prompt. Pick one to start refining — or send a message to regenerate the grid.",
        concept_grid: grid,
        created_at: Date.now(),
      };
      setWorkspace((w) => ({
        ...w,
        concept_messages: [userMessage, aiReply],
        concept_versions: grid,
        // No active selection yet — user must pick from the grid.
        active_concept_version_id: null,
      }));
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  /* ---------- Phase B handlers ---------- */

  const handlePickConcept = (versionId: string) => {
    setWorkspace((w) => ({ ...w, active_concept_version_id: versionId }));
  };

  const handleSelectConceptVersion = (versionId: string) => {
    setWorkspace((w) => ({ ...w, active_concept_version_id: versionId }));
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
    if (!parent) {
      // Treat as a regenerate-grid request before any concept is picked.
      handleGenerateInitialConcepts();
      return;
    }
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

    // Initialize the default size's chat with an opening AI message + initial
    // version cloned from the finalized concept.
    setWorkspace((w) => {
      const seedChat = makeSizeChat(activeSizeId, activeVer);
      return { ...w, size_chats: { ...w.size_chats, [activeSizeId]: seedChat } };
    });
    setPhase("resize");
  };

  /* ---------- Phase C handlers ---------- */

  const handleToggleSize = (sizeId: string) => {
    let switchTo: string | null = null;
    setWorkspace((w) => {
      const isSelected = w.selected_sizes.includes(sizeId);
      if (isSelected) {
        // Don't allow removing the last size.
        if (w.selected_sizes.length === 1) return w;
        const nextChats = { ...w.size_chats };
        delete nextChats[sizeId];
        const nextSelected = w.selected_sizes.filter((id) => id !== sizeId);
        // If we removed the active tab, switch to the first remaining size.
        if (sizeId === activeSizeId) switchTo = nextSelected[0] ?? null;
        return { ...w, selected_sizes: nextSelected, size_chats: nextChats };
      }

      // Adding a new size — seed a chat for it from the finalized concept.
      const activeId = w.active_concept_version_id;
      const activeVer = activeId ? w.concept_versions.find((v) => v.id === activeId) : undefined;
      const nextChats = { ...w.size_chats };
      if (activeVer && !nextChats[sizeId]) {
        nextChats[sizeId] = makeSizeChat(sizeId, activeVer);
      }
      switchTo = sizeId;
      return { ...w, selected_sizes: [...w.selected_sizes, sizeId], size_chats: nextChats };
    });
    if (switchTo) setActiveSizeId(switchTo);
  };

  const handleSelectSize = (sizeId: string) => setActiveSizeId(sizeId);

  const handleSelectVersionInSize = (sizeId: string, versionId: string) => {
    setWorkspace((w) => {
      const chat = w.size_chats[sizeId];
      if (!chat) return w;
      return {
        ...w,
        size_chats: {
          ...w.size_chats,
          [sizeId]: { ...chat, active_version_id: versionId },
        },
      };
    });
  };

  const handleSendInSize = (sizeId: string, text: string) => {
    if (isGenerating) return;
    const chat = workspace.size_chats[sizeId];
    if (!chat) return;
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
      text: "Adjusting this size…",
      pending: true,
      created_at: Date.now(),
    };
    setWorkspace((w) => ({
      ...w,
      size_chats: {
        ...w.size_chats,
        [sizeId]: {
          ...w.size_chats[sizeId],
          messages: [...w.size_chats[sizeId].messages, userMessage, pendingMessage],
        },
      },
    }));

    window.setTimeout(() => {
      setWorkspace((w) => {
        const c = w.size_chats[sizeId];
        const newVer = makeMockVersion({
          parent_id: c.active_version_id,
          preferVariant: c.versions[0].variant,
          labelPrefix: `v${c.versions.length + 1}`,
          refinementText: text,
        });
        const aiReply: ChatMessage = {
          id: mkId("msg"),
          role: "ai",
          text: makeMockReply(text),
          version_id: newVer.id,
          created_at: Date.now(),
        };
        const messagesWithoutPending = c.messages.filter((m) => !m.pending);
        return {
          ...w,
          size_chats: {
            ...w.size_chats,
            [sizeId]: {
              ...c,
              messages: [...messagesWithoutPending, aiReply],
              versions: [...c.versions, newVer],
              active_version_id: newVer.id,
            },
          },
        };
      });
      setIsGenerating(false);
    }, MOCK_LATENCY_MS);
  };

  const handleConfirm = () => {
    const out: GeneratedCreative[] = [];
    for (const sizeId of workspace.selected_sizes) {
      const chat = workspace.size_chats[sizeId];
      if (!chat) continue;
      const ver = chat.versions.find((v) => v.id === chat.active_version_id);
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

  const hasPickedConcept = !!workspace.active_concept_version_id;

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
                onPickConcept={handlePickConcept}
                onSelectVersion={handleSelectConceptVersion}
                onBranchFromVersion={handleBranchFromVersion}
                onFinalize={handleFinalizeConcept}
                hasPickedConcept={hasPickedConcept}
              />
            )}

            {phase === "resize" && (
              <CreativeResizeEditor
                workspace={workspace}
                activeSizeId={activeSizeId}
                isGenerating={isGenerating}
                onToggleSize={handleToggleSize}
                onSelectSize={handleSelectSize}
                onSendInSize={handleSendInSize}
                onSelectVersionInSize={handleSelectVersionInSize}
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
 * Build the initial size-chat for a given sizeId, seeded from the finalized
 * concept version (or any concept version, when adding a new size mid-flow).
 */
function makeSizeChat(sizeId: string, fromVersion: ConceptVersion): SizeChat {
  const sizeLabel = getSize(sizeId)?.label ?? "size";
  const seedVer: ConceptVersion = {
    ...fromVersion,
    id: mkId("ver"),
    parent_id: fromVersion.id,
    label: `${sizeLabel} v1`,
    created_at: Date.now(),
  };
  const opening: ChatMessage = {
    id: mkId("msg"),
    role: "ai",
    text: `Generated the ${sizeLabel} version from your finalized concept. Refine below — changes here won't affect other sizes.`,
    version_id: seedVer.id,
    created_at: Date.now(),
  };
  return {
    size_id: sizeId,
    messages: [opening],
    versions: [seedVer],
    active_version_id: seedVer.id,
  };
}
