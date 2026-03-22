"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Phone, ArrowRight } from "lucide-react";
import { voiceAgentsList } from "@/lib/voice-agent-data";
import type { AgentStatus } from "@/lib/voice-agent-data";

const fadeIn = { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, ease: "easeOut" as const } };

function StatusBadge({ status }: { status: AgentStatus }) {
  const config = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    inactive: { label: "Inactive", cls: "bg-surface-secondary text-text-secondary" },
    training: { label: "Training", cls: "bg-[#EFF6FF] text-[#1D4ED8]" },
  };
  const { label, cls } = config[status];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

export default function VoiceAgentsPage() {
  const router = useRouter();

  return (
    <motion.div {...fadeIn}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Agents</div>
          <h1 className="text-page-title text-text-primary">Voice Agents</h1>
        </div>
        <button
          onClick={() => router.push("/agents/voice/create")}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          <Plus size={15} strokeWidth={2} />
          Create agent
        </button>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-3 gap-4">
        {voiceAgentsList.map((agent) => (
          <button
            key={agent.id}
            onClick={() => router.push(`/agents/voice/${agent.id}`)}
            className="bg-white border border-border rounded-card p-5 text-left hover:shadow-card-hover hover:-translate-y-px transition-all duration-150 group"
          >
            {/* Top: Name + Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center">
                  <Phone size={16} strokeWidth={1.5} className="text-text-secondary" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-accent transition-colors duration-150">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
                      {agent.industry}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {agent.languages.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-[0.3px]">Calls</div>
                <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
                  {agent.callsMade.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-[0.3px]">Qual Rate</div>
                <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
                  {agent.qualificationRate}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary uppercase tracking-[0.3px]">Avg Dur.</div>
                <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
                  {agent.avgDuration} min
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] text-text-tertiary">Last used: {agent.lastUsed}</span>
              <ArrowRight size={14} strokeWidth={1.5} className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
