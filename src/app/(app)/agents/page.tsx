"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Plus, Phone, MessageCircle, Play, Pause, Copy, Pencil } from "lucide-react";
import { agentsList } from "@/lib/voice-agent-data";
import type { AgentItem } from "@/lib/voice-agent-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function StatusBadge({ status }: { status: AgentItem["status"] }) {
  const cfg = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    draft: { label: "Draft", cls: "bg-surface-secondary text-text-secondary" },
    paused: { label: "Paused", cls: "bg-[#FEF3C7] text-[#92400E]" },
  };
  const { label, cls } = cfg[status];
  return <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>{label}</span>;
}

export default function AgentsPage() {
  const router = useRouter();

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Tools</div>
          <h1 className="text-page-title text-text-primary">Agents</h1>
        </div>
        <button
          onClick={() => router.push("/agents/create")}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          <Plus size={15} strokeWidth={2} /> Create Agent
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4">
        {agentsList.map((agent) => (
          <div
            key={agent.id}
            onClick={() => router.push(`/agents/${agent.id}`)}
            className="bg-white border border-border rounded-card p-5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-150 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Row 1: name + badges */}
                <div className="flex items-center gap-2.5 mb-2">
                  <h3 className="text-[14px] font-semibold text-text-primary">{agent.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
                    {agent.channel === "voice" ? <Phone size={10} strokeWidth={2} /> : <MessageCircle size={10} strokeWidth={2} />}
                    {agent.channel === "voice" ? "Voice" : "WhatsApp"}
                  </span>
                  <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-surface-secondary text-text-secondary capitalize">
                    {agent.template === "qualifying" ? "Qualifying" : "Custom"}
                  </span>
                  <StatusBadge status={agent.status} />
                </div>

                {/* Row 2: languages */}
                <div className="text-[12px] text-text-secondary mb-3">
                  {agent.languages.join(", ")}
                </div>

                {/* Row 3: stats + post-call */}
                <div className="flex items-center gap-5">
                  {agent.status === "active" && agent.callsMade > 0 && (
                    <span className="text-[12px] text-text-secondary">
                      <span className="text-text-primary font-medium tabular-nums">{agent.callsMade.toLocaleString()}</span> calls
                      <span className="mx-1.5 text-border">·</span>
                      <span className="text-text-primary font-medium tabular-nums">{agent.qualificationRate}%</span> qualified
                      <span className="mx-1.5 text-border">·</span>
                      <span className="text-text-primary font-medium tabular-nums">{agent.avgDuration}</span> min avg
                    </span>
                  )}
                  <span className="text-[11px] text-text-tertiary">{agent.postCallSummary}</span>
                </div>
              </div>

              {/* Right: last used + actions */}
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className="text-[11px] text-text-tertiary">{agent.lastUsed}</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1.5 rounded-button text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors" title="Edit">
                    <Pencil size={13} strokeWidth={1.5} />
                  </button>
                  <button className="p-1.5 rounded-button text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors" title="Duplicate">
                    <Copy size={13} strokeWidth={1.5} />
                  </button>
                  {agent.status === "active" ? (
                    <button className="p-1.5 rounded-button text-text-tertiary hover:text-[#92400E] hover:bg-[#FEF3C7] transition-colors" title="Pause">
                      <Pause size={13} strokeWidth={1.5} />
                    </button>
                  ) : (
                    <button className="p-1.5 rounded-button text-text-tertiary hover:text-[#15803D] hover:bg-[#F0FDF4] transition-colors" title="Resume">
                      <Play size={13} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
