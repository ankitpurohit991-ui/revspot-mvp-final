"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatMessage, ConceptVersion } from "./types";
import { AdMockup } from "./ad-mockup";

interface CreativeChatPanelProps {
  messages: ChatMessage[];
  /** Disabled while the AI is generating — composer should be locked. */
  isGenerating: boolean;
  /** Called when user sends a refinement message. */
  onSend: (text: string) => void;
  /** Called when user clicks a concept in the initial 4-grid bubble. */
  onPickConcept?: (versionId: string) => void;
  /** When true, inline preview thumbnails in AI bubbles are clickable to focus them in the right pane. */
  onFocusVersion?: (versionId: string) => void;
  /** The version id currently shown in the right pane. Used to highlight bubbles. */
  activeVersionId: string | null;
  /** Composer placeholder. Differs by phase. */
  placeholder?: string;
  /** Empty-state message shown when messages array is empty. */
  emptyMessage?: string;
}

export function CreativeChatPanel({
  messages,
  isGenerating,
  onSend,
  onPickConcept,
  onFocusVersion,
  activeVersionId,
  placeholder = "Refine the concept… e.g., make the headline more urgent",
  emptyMessage = "Send a message to refine this concept.",
}: CreativeChatPanelProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message whenever messages change.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const submit = () => {
    const text = draft.trim();
    if (!text || isGenerating) return;
    onSend(text);
    setDraft("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-page">
      {/* Message list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[12px] text-text-tertiary">
            {emptyMessage}
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            activeVersionId={activeVersionId}
            onPickConcept={onPickConcept}
            onFocusVersion={onFocusVersion}
          />
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            rows={2}
            disabled={isGenerating}
            className="flex-1 px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed disabled:bg-surface-page disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || isGenerating}
            className="h-9 w-9 inline-flex items-center justify-center bg-accent text-white rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Send"
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-[10px] text-text-tertiary mt-1.5 px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Message bubble                                                     */
/* ------------------------------------------------------------------ */

interface MessageBubbleProps {
  message: ChatMessage;
  activeVersionId: string | null;
  onPickConcept?: (versionId: string) => void;
  onFocusVersion?: (versionId: string) => void;
}

function MessageBubble({ message, activeVersionId, onPickConcept, onFocusVersion }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="flex justify-end"
      >
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="bg-accent text-white text-[13px] leading-relaxed rounded-card px-3 py-2 whitespace-pre-wrap">
            {message.text}
          </div>
          <div className="w-6 h-6 rounded-full bg-text-primary flex items-center justify-center shrink-0 mt-0.5">
            <User size={12} strokeWidth={1.5} className="text-white" />
          </div>
        </div>
      </motion.div>
    );
  }

  // AI bubble
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex"
    >
      <div className="flex items-start gap-2 max-w-[92%]">
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={12} strokeWidth={1.5} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="bg-white border border-border text-[13px] leading-relaxed text-text-primary rounded-card px-3 py-2">
            {message.pending ? (
              <div className="flex items-center gap-2 text-text-tertiary">
                <span className="h-3 w-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Thinking…
              </div>
            ) : (
              message.text
            )}
          </div>

          {/* 4-concept grid in the first AI turn */}
          {message.concept_grid && (
            <div className="grid grid-cols-2 gap-2">
              {message.concept_grid.map((v) => (
                <ConceptGridCard
                  key={v.id}
                  version={v}
                  onPick={() => onPickConcept?.(v.id)}
                  isActive={v.id === activeVersionId}
                />
              ))}
            </div>
          )}

          {/* Single-version thumbnail attached to a refinement reply */}
          {message.version_id && !message.concept_grid && (
            <SingleVersionThumb
              versionId={message.version_id}
              isActive={message.version_id === activeVersionId}
              onClick={() => onFocusVersion?.(message.version_id!)}
              version={undefined}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Concept grid card (used in the first AI bubble)                    */
/* ------------------------------------------------------------------ */

interface ConceptGridCardProps {
  version: ConceptVersion;
  isActive: boolean;
  onPick: () => void;
}

function ConceptGridCard({ version, isActive, onPick }: ConceptGridCardProps) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`group relative aspect-square rounded-card overflow-hidden border-2 transition-all duration-150 ${
        isActive
          ? "border-accent ring-2 ring-accent/30"
          : "border-border hover:border-border-hover"
      }`}
    >
      <AdMockup variant={version.variant} headline={version.headline} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="text-[10px] font-medium text-white truncate">{version.label}</div>
      </div>
      {isActive && (
        <div className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-semibold uppercase tracking-[0.5px] px-1.5 py-0.5 rounded-badge">
          Picked
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Single-version thumbnail (used in refinement replies)              */
/* ------------------------------------------------------------------ */

// Note: This component is a stub — the parent (concept editor) usually passes
// the version through indirectly via `activeVersionId`. We render a small
// "View this version" anchor instead of redrawing the mock here.
interface SingleVersionThumbProps {
  versionId: string;
  isActive: boolean;
  onClick: () => void;
  version: ConceptVersion | undefined;
}

function SingleVersionThumb({ isActive, onClick }: SingleVersionThumbProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-badge transition-colors ${
        isActive
          ? "bg-accent/10 text-accent"
          : "bg-surface-secondary text-text-secondary hover:bg-white"
      }`}
    >
      <Sparkles size={10} strokeWidth={1.5} />
      {isActive ? "Showing this version →" : "View this version →"}
    </button>
  );
}
