"use client";

import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { AgentMvpDetail } from "@/lib/voice-agent-data";

interface AgentTabProps {
  agent: AgentMvpDetail;
}

/** Renders {{variable}} tokens in accent color */
function TemplateText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span key={i} className="text-accent font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function AgentTab({ agent }: AgentTabProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex gap-5">
      {/* Left: System Prompt (~60%) */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-border rounded-card">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-semibold text-text-primary">
                System Prompt
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
              >
                Guidelines <ExternalLink size={11} strokeWidth={1.5} />
              </a>
              <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-secondary text-text-secondary">
                Sections {agent.systemPromptSections}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="h-8 px-3.5 text-[12px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors">
                Save Changes
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="h-8 px-3 text-[12px] font-medium border border-border rounded-button bg-white text-text-secondary hover:bg-surface-page transition-colors inline-flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    Collapse <ChevronUp size={13} strokeWidth={1.5} />
                  </>
                ) : (
                  <>
                    Expand <ChevronDown size={13} strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt body */}
          {expanded && (
            <div className="p-5">
              <div className="w-full min-h-[280px] p-4 bg-surface-page border border-border rounded-card text-[13px] leading-relaxed text-text-primary font-mono whitespace-pre-wrap">
                {agent.systemPrompt}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Greeting + Voice (~40%) */}
      <div className="w-[340px] shrink-0 flex flex-col gap-4">
        {/* Greeting Message */}
        <div className="bg-white border border-border rounded-card p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-3">
            Greeting Message
          </h3>
          <div className="p-3 bg-surface-page border border-border rounded-card text-[13px] leading-relaxed text-text-primary">
            <TemplateText text={agent.greetingTemplate} />
          </div>
        </div>

        {/* Voice */}
        <div className="bg-white border border-border rounded-card p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-3">
            Voice
          </h3>
          <select
            defaultValue={agent.voiceId}
            className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
          >
            <option value={agent.voiceId}>{agent.voiceName}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
