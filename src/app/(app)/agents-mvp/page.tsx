"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap, Bot, Phone, MessageCircle, Plus, Sparkles, Play, Pause,
  ShieldCheck, Clock, Target, ArrowRight, Pencil,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// Mock agents with packaged sequence
const agentsMvp = [
  {
    id: "amvp-1",
    name: "Godrej Air — Lead Qualifier",
    status: "active" as const,
    channels: ["Voice", "WhatsApp"],
    campaign: "Godrej Air Phase 3 — Lead Gen",
    createdBy: "AI (Campaign Launcher)",
    objectives: ["Budget fit (≥₹1Cr)", "Timeline (≤6 months)", "Site visit interest", "Decision maker"],
    sequence: {
      dailyLimit: 200,
      callingHours: "10 AM – 7 PM",
      retryPolicy: "2 retries, 4-hour interval",
      followUpRules: ["No answer → Retry 4h", "Partially qualified → Follow up 48h", "Not interested → Stop"],
    },
    stats: { totalCalls: 342, connected: 268, qualified: 89, qualRate: 33.2, avgDuration: 3.1 },
  },
  {
    id: "amvp-2",
    name: "Godrej Reflections — Re-engagement",
    status: "active" as const,
    channels: ["Voice"],
    campaign: "Godrej Reflections Habitat — Lead Gen",
    createdBy: "AI (Campaign Launcher)",
    objectives: ["Re-confirm interest", "Budget update", "Schedule site visit"],
    sequence: {
      dailyLimit: 100,
      callingHours: "10 AM – 6 PM",
      retryPolicy: "3 retries, 6-hour interval",
      followUpRules: ["No answer → Retry 6h", "Callback → Follow up 24h", "Not interested → Stop"],
    },
    stats: { totalCalls: 156, connected: 112, qualified: 42, qualRate: 37.5, avgDuration: 2.8 },
  },
];

export default function AgentsMvpPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createMode, setCreateMode] = useState<"select" | "ai" | "manual">("select");
  const [projectContext, setProjectContext] = useState("");

  const handleAICreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setShowCreateForm(false);
    }, 3000);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Tools</div>
          <div className="flex items-center gap-2">
            <h1 className="text-page-title text-text-primary">Agents MVP</h1>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-accent/10 text-accent">Beta</span>
          </div>
          <p className="text-[12px] text-text-secondary mt-1">AI agents with built-in sequences — created automatically from campaign context</p>
        </div>
        <button onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          <Plus size={15} strokeWidth={2} /> Create Agent
        </button>
      </motion.div>

      {/* Create Agent */}
      {showCreateForm && (
        <motion.div variants={fadeUp} className="mb-6 bg-white border border-border rounded-card p-6">
          {createMode === "select" && (
            <>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">Create Agent</h3>
              <p className="text-[12px] text-text-secondary mb-5">Choose how you want to create your agent</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={() => setCreateMode("ai")}
                  className="text-left p-5 rounded-card border border-border bg-white hover:border-accent hover:bg-accent/5 transition-colors duration-150">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
                    <span className="text-[14px] font-semibold text-text-primary">Create with AI</span>
                  </div>
                  <p className="text-[12px] text-text-tertiary">Describe what you want and AI will set up the agent, objectives, knowledge base, and calling sequence automatically.</p>
                </button>
                <button onClick={() => setCreateMode("manual")}
                  className="text-left p-5 rounded-card border border-border bg-white hover:border-accent hover:bg-accent/5 transition-colors duration-150">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Pencil size={16} strokeWidth={1.5} className="text-accent" />
                    <span className="text-[14px] font-semibold text-text-primary">Create Manually</span>
                  </div>
                  <p className="text-[12px] text-text-tertiary">Configure the agent step-by-step: identity, channels, knowledge, conversation flow, objectives, and sequence settings.</p>
                </button>
              </div>
              <button onClick={() => { setShowCreateForm(false); setCreateMode("select"); }}
                className="text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
            </>
          )}

          {createMode === "ai" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
                <h3 className="text-[16px] font-semibold text-text-primary">Create with AI</h3>
              </div>
              <p className="text-[12px] text-text-secondary mb-4 leading-relaxed">
                Describe what you want the agent to do. AI will create the agent with objectives, knowledge base, and an automated calling sequence.
              </p>
              <textarea
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                rows={3}
                placeholder="e.g., Create a qualification agent for Godrej Air Phase 3. It should call new leads, verify their budget (min ₹1Cr), timeline, and interest in a site visit. Use Voice + WhatsApp."
                className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed mb-3"
              />
              <div className="flex items-center gap-2">
                <button onClick={handleAICreate} disabled={isCreating || !projectContext.trim()}
                  className="inline-flex items-center gap-2 h-9 px-5 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {isCreating ? (
                    <><div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Agent + Sequence...</>
                  ) : (
                    <><Sparkles size={14} strokeWidth={1.5} /> Create with AI</>
                  )}
                </button>
                <button onClick={() => setCreateMode("select")}
                  className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">
                  Back
                </button>
              </div>
            </>
          )}

          {createMode === "manual" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Pencil size={16} strokeWidth={1.5} className="text-accent" />
                <h3 className="text-[16px] font-semibold text-text-primary">Create Manually</h3>
              </div>
              <p className="text-[12px] text-text-secondary mb-4 leading-relaxed">
                You&apos;ll configure the agent step-by-step. The wizard combines agent creation + sequence setup into one flow.
              </p>
              <div className="bg-surface-page border border-border-subtle rounded-[8px] p-4 mb-4">
                <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">What you&apos;ll configure</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Agent identity & persona",
                    "Voice & WhatsApp channels",
                    "Knowledge base & FAQs",
                    "Conversation flow steps",
                    "Qualification objectives",
                    "Calling cadence & schedule",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                      <span className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-accent">{i + 1}</span>
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => router.push("/agents/create")}
                  className="inline-flex items-center gap-2 h-9 px-5 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors">
                  <ArrowRight size={14} strokeWidth={1.5} /> Start Agent Wizard
                </button>
                <button onClick={() => setCreateMode("select")}
                  className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">
                  Back
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Agent Cards */}
      <motion.div variants={fadeUp} className="space-y-4">
        {agentsMvp.map((agent) => (
          <div key={agent.id} className="bg-white border border-border rounded-card overflow-hidden">
            {/* Agent Header */}
            <div className="p-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-[14px] font-semibold text-text-primary">{agent.name}</h3>
                    {agent.channels.map((ch) => (
                      <span key={ch} className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                        ch === "Voice" ? "bg-[#EFF6FF] text-[#1D4ED8]" : "bg-[#F0FDF4] text-[#15803D]"
                      }`}>
                        {ch === "Voice" ? <Phone size={10} strokeWidth={2} /> : <MessageCircle size={10} strokeWidth={2} />}
                        {ch}
                      </span>
                    ))}
                    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">Active</span>
                  </div>
                  <div className="text-[12px] text-text-secondary">
                    Campaign: <span className="text-text-primary font-medium">{agent.campaign}</span>
                    <span className="mx-1.5 text-border">·</span>
                    Created by: <span className="text-accent font-medium">{agent.createdBy}</span>
                  </div>
                </div>
                <button className="p-1.5 rounded-button text-text-tertiary hover:text-[#92400E] hover:bg-[#FEF3C7] transition-colors" title="Pause">
                  <Pause size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Stats + Details in two columns */}
            <div className="grid grid-cols-2 border-t border-border-subtle">
              {/* Left: Agent Details */}
              <div className="p-5 border-r border-border-subtle">
                <div className="flex items-center gap-1.5 mb-3">
                  <Target size={13} strokeWidth={1.5} className="text-text-tertiary" />
                  <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">Qualification Objectives</span>
                </div>
                <ul className="space-y-1.5">
                  {agent.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-text-secondary">
                      <ShieldCheck size={12} strokeWidth={1.5} className="text-accent mt-0.5 shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-border-subtle">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={13} strokeWidth={1.5} className="text-text-tertiary" />
                    <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">Sequence (Built-in)</span>
                  </div>
                  <div className="text-[11px] text-text-secondary space-y-1">
                    <p>{agent.sequence.dailyLimit} calls/day · {agent.sequence.callingHours}</p>
                    <p>{agent.sequence.retryPolicy}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.sequence.followUpRules.map((rule, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-tertiary">{rule}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Performance Stats */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Bot size={13} strokeWidth={1.5} className="text-text-tertiary" />
                  <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">Performance</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[22px] font-bold text-text-primary tabular-nums">{agent.stats.totalCalls}</span>
                    <span className="block text-[11px] text-text-tertiary">Total Calls</span>
                  </div>
                  <div>
                    <span className="block text-[22px] font-bold text-text-primary tabular-nums">{agent.stats.connected}</span>
                    <span className="block text-[11px] text-text-tertiary">Connected</span>
                  </div>
                  <div>
                    <span className="block text-[22px] font-bold text-accent tabular-nums">{agent.stats.qualified}</span>
                    <span className="block text-[11px] text-text-tertiary">Qualified</span>
                  </div>
                  <div>
                    <span className="block text-[22px] font-bold text-text-primary tabular-nums">{agent.stats.qualRate}%</span>
                    <span className="block text-[11px] text-text-tertiary">Qual Rate</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border-subtle text-[11px] text-text-tertiary">
                  Avg call duration: {agent.stats.avgDuration} min
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
