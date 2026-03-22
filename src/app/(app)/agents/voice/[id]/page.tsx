"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Phone,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { agentDetail, conversationFlow } from "@/lib/voice-agent-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "overview" | "calls";

function OutcomeBadge({ outcome }: { outcome: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    qualified: { label: "Qualified", cls: "bg-[#F0FDF4] text-[#15803D]" },
    not_qualified: { label: "Not Qualified", cls: "bg-[#FEF2F2] text-[#DC2626]" },
    callback: { label: "Callback", cls: "bg-[#FEF3C7] text-[#92400E]" },
    no_answer: { label: "No Answer", cls: "bg-surface-secondary text-text-secondary" },
  };
  const { label, cls } = config[outcome] || { label: outcome, cls: "bg-surface-secondary text-text-secondary" };
  return <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>{label}</span>;
}

export default function VoiceAgentDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const d = agentDetail;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "calls", label: "Call History" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push("/agents/voice")} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Agents › Voice Agents › {d.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center">
            <Phone size={18} strokeWidth={1.5} className="text-text-secondary" />
          </div>
          <div>
            <h1 className="text-page-title text-text-primary">{d.name}</h1>
            <div className="flex items-center gap-3 text-[12px] text-text-secondary mt-0.5">
              <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">{d.industry}</span>
              <span>{d.languages.join(", ")}</span>
              <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">Active</span>
            </div>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <Pencil size={14} strokeWidth={1.5} /> Edit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Calls", value: d.stats.totalCalls.toLocaleString() },
          { label: "Connected", value: d.stats.connected.toLocaleString(), sub: `${d.stats.connectionRate}%` },
          { label: "Qualified", value: d.stats.qualified.toLocaleString(), highlight: true },
          { label: "Not Qualified", value: d.stats.notQualified.toLocaleString() },
          { label: "Qual Rate", value: `${d.stats.qualificationRate}%` },
          { label: "Avg Duration", value: `${d.stats.avgDuration} min` },
        ].map((s) => (
          <div key={s.label} className={`bg-white border rounded-card px-4 py-3 ${s.highlight ? "border-accent/30" : "border-border"}`}>
            <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.3px]">{s.label}</div>
            <div className="text-[20px] font-semibold text-text-primary leading-tight tabular-nums mt-0.5">{s.value}</div>
            {s.sub && <div className="text-[11px] text-text-tertiary mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${activeTab === tab.key ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`}>
            {tab.label}
            {activeTab === tab.key && <motion.div layoutId="agent-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" transition={{ duration: 0.15 }} />}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-5">
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-card-title text-text-primary mb-3">Goal</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{d.goal}</p>
            </div>
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-card-title text-text-primary mb-3">Knowledge Bases</h3>
              <div className="space-y-1.5">
                {d.knowledgeBases.map((kb, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-page rounded-[6px] px-3 py-2">
                    <FileText size={13} strokeWidth={1.5} className="text-text-tertiary" />
                    <span className="text-[12px] text-text-primary">{kb}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-card-title text-text-primary mb-3">Voice & Languages</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="text-[11px] text-text-tertiary">Voice</div>
                  <div className="text-[13px] text-text-primary font-medium mt-0.5">{d.voice.name} <span className="text-[11px] text-text-tertiary font-normal">({d.voice.gender})</span></div>
                </div>
                <div className="bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="text-[11px] text-text-tertiary">Languages</div>
                  <div className="text-[13px] text-text-primary font-medium mt-0.5">{d.selectedLanguages.join(", ")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-card-title text-text-primary mb-3">Qualification Metrics</h3>
              <div className="space-y-2">
                {d.metrics.map((m) => (
                  <div key={m.id} className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2">
                    <div>
                      <div className="text-[13px] font-medium text-text-primary">{m.name}</div>
                      <div className="text-[11px] text-text-tertiary mt-0.5">{m.type === "yes_no" ? "Yes/No" : m.type} · {m.condition}</div>
                    </div>
                    <span className="text-[12px] font-medium text-text-secondary tabular-nums">{m.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-card-title text-text-primary mb-4">Conversation Flow</h3>
              {conversationFlow.map((step, i) => (
                <div key={step.step} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">{step.step}</div>
                    {i < conversationFlow.length - 1 && <div className="w-[2px] h-6 bg-border mt-0.5" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-[12px] font-medium text-text-primary">{step.name}</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calls Tab */}
      {activeTab === "calls" && (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {["Name", "Phone", "Outcome", "Duration", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.recentCalls.map((call, i) => (
                <tr key={call.id} className={`border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                  <td className="px-4 py-3 text-[13px] text-text-primary font-medium">{call.name}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary tabular-nums">{call.phone}</td>
                  <td className="px-4 py-3"><OutcomeBadge outcome={call.outcome} /></td>
                  <td className="px-4 py-3 text-[12px] text-text-primary tabular-nums">{call.duration > 0 ? `${call.duration} min` : "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{format(new Date(call.date), "dd MMM, HH:mm")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
