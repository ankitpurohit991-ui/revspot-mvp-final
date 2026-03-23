"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft, Pencil, Phone, Play, ShieldCheck, Volume2, CheckCircle2,
  AlertTriangle, PhoneOff, Voicemail, PhoneCall,
} from "lucide-react";
import { format } from "date-fns";
import { agentDetail } from "@/lib/voice-agent-data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "configuration" | "call_history" | "performance";

const callChartData = Array.from({ length: 14 }, (_, i) => ({
  date: `Mar ${9 + i}`,
  calls: Math.floor(60 + Math.random() * 80),
  qualified: Math.floor(15 + Math.random() * 40),
}));

function OutcomeIcon({ outcome }: { outcome: string }) {
  const cfg: Record<string, { icon: typeof CheckCircle2; cls: string; label: string }> = {
    qualified: { icon: CheckCircle2, cls: "text-[#15803D]", label: "Qualified" },
    not_qualified: { icon: AlertTriangle, cls: "text-[#92400E]", label: "Not Qualified" },
    no_answer: { icon: PhoneOff, cls: "text-text-tertiary", label: "No Answer" },
    callback: { icon: PhoneCall, cls: "text-status-info", label: "Callback" },
    voicemail: { icon: Voicemail, cls: "text-text-secondary", label: "Voicemail" },
  };
  const c = cfg[outcome] || cfg.no_answer;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${c.cls}`}>
      <c.icon size={12} strokeWidth={2} /> {c.label}
    </span>
  );
}

export default function AgentDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("configuration");
  const d = agentDetail;

  const tabs: { key: Tab; label: string }[] = [
    { key: "configuration", label: "Configuration" },
    { key: "call_history", label: "Call History" },
    { key: "performance", label: "Performance" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push("/agents")} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Tools › Agents › {d.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-page-title text-text-primary">{d.name}</h1>
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">Active</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
              <Phone size={10} strokeWidth={2} /> Voice
            </span>
          </div>
          <div className="text-[12px] text-text-secondary">{d.languages.join(", ")} · {d.template === "qualifying" ? "Qualifying" : "Custom"} template</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
            <Pencil size={14} strokeWidth={1.5} /> Edit
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <Play size={14} strokeWidth={1.5} /> Test Agent
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-5 mb-6 py-3 px-4 bg-surface-page rounded-metric">
        {[
          { label: "Total calls", value: d.stats.totalCalls.toLocaleString() },
          { label: "Connected", value: `${d.stats.connected.toLocaleString()} (${d.stats.connectionRate}%)` },
          { label: "Qualified", value: `${d.stats.qualified} (${d.stats.qualificationRate}%)` },
          { label: "Avg duration", value: `${d.stats.avgDuration} min` },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-[11px] text-text-tertiary uppercase tracking-[0.4px]">{s.label}</div>
            <div className="text-[16px] font-semibold text-text-primary mt-0.5 tabular-nums">{s.value}</div>
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

      {/* Configuration Tab */}
      {activeTab === "configuration" && (
        <div className="space-y-5">
          {/* Goal */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-2">Goal</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">{d.goal}</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Voice */}
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Voice & Delivery</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center"><Volume2 size={16} className="text-text-tertiary" /></div>
                <div>
                  <div className="text-[13px] font-medium text-text-primary">{d.voice.name}</div>
                  <div className="text-[11px] text-text-tertiary">{d.voice.gender} · {d.voice.languages.join(", ")}</div>
                </div>
              </div>
              <div className="text-[12px] text-text-secondary">Tone: <span className="capitalize font-medium text-text-primary">{d.tone}</span></div>
            </div>

            {/* Post-Call */}
            <div className="bg-white border border-border rounded-card p-5">
              <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Post-Call Actions</h3>
              <div className="space-y-1.5 text-[12px]">
                {[
                  { label: "Push to CRM", value: d.postCall.pushToCRM },
                  { label: "Retry unanswered", value: d.postCall.retryUnanswered },
                  { label: "Voicemail follow-up", value: d.postCall.sendFollowUpVoicemail },
                  { label: "Notify on qualified", value: d.postCall.notifyOnQualified },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className={`font-medium ${item.value ? "text-[#15803D]" : "text-text-tertiary"}`}>{item.value ? "Enabled" : "Disabled"}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Calling hours</span>
                  <span className="text-text-primary font-medium">{d.postCall.callingHoursStart} – {d.postCall.callingHoursEnd}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Active days</span>
                  <span className="text-text-primary font-medium">{d.postCall.activeDays.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Qualification Metrics</h3>
            <div className="space-y-2">
              {d.metrics.map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                  <span className="text-[13px] text-text-primary font-medium flex-1">{m.name}</span>
                  <span className="text-[11px] text-text-secondary">{m.condition}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-badge capitalize ${
                    m.weight === "critical" ? "bg-[#FEF2F2] text-[#DC2626]" : m.weight === "high" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-surface-secondary text-text-secondary"
                  }`}>{m.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">System Prompt</h3>
            <pre className="text-[12px] text-text-secondary whitespace-pre-wrap leading-relaxed font-mono bg-surface-page rounded-[6px] p-3">{d.systemPrompt}</pre>
          </div>

          {/* Flow */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Conversation Flow</h3>
            <div className="space-y-2">
              {d.flow.map((s) => (
                <div key={s.id} className="flex items-start gap-3 py-2 border-b border-border-subtle last:border-0">
                  <span className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-[10px] font-semibold text-text-tertiary shrink-0 mt-0.5">{s.step}</span>
                  <div>
                    <div className="text-[13px] font-medium text-text-primary">{s.name}</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{s.script}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call History Tab */}
      {activeTab === "call_history" && (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {["Lead", "Phone", "Date", "Duration", "Outcome", "Qualification"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.recentCalls.map((call, i) => (
                <tr key={call.id} className={`border-b border-border-subtle last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                  <td className="px-4 py-3 text-[13px] text-text-primary font-medium">{call.name}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary tabular-nums">{call.phone}</td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{format(new Date(call.date), "dd MMM, HH:mm")}</td>
                  <td className="px-4 py-3 text-[12px] text-text-primary tabular-nums">{call.duration > 0 ? `${call.duration} min` : "—"}</td>
                  <td className="px-4 py-3"><OutcomeIcon outcome={call.outcome} /></td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary">{call.qualification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="space-y-5">
          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total Calls", value: d.stats.totalCalls.toLocaleString() },
              { label: "Connection Rate", value: `${d.stats.connectionRate}%` },
              { label: "Qualification Rate", value: `${d.stats.qualificationRate}%` },
              { label: "Avg Duration", value: `${d.stats.avgDuration} min` },
            ].map((m) => (
              <div key={m.label} className="bg-white border border-border rounded-card px-4 py-3.5">
                <div className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">{m.label}</div>
                <div className="text-stat-md text-text-primary mt-1">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-section-header text-text-primary mb-4">Calls Over Time</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={callChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "6px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="calls" stroke="#1A1A1A" strokeWidth={2} dot={{ r: 3, fill: "#1A1A1A", strokeWidth: 0 }} name="Total Calls" />
                  <Line type="monotone" dataKey="qualified" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: "#22C55E", strokeWidth: 0 }} name="Qualified" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funnel */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-section-header text-text-primary mb-4">Qualification Funnel</h3>
            <div className="space-y-3">
              {[
                { label: "Total Calls", value: d.stats.totalCalls, pct: 100 },
                { label: "Connected", value: d.stats.connected, pct: d.stats.connectionRate },
                { label: "Qualified", value: d.stats.qualified, pct: d.stats.qualificationRate },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-text-secondary">{item.label}</span>
                    <span className="text-[13px] font-medium text-text-primary tabular-nums">{item.value.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Disqualification Reasons */}
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="text-section-header text-text-primary mb-4">Top Disqualification Reasons</h3>
            <div className="space-y-2.5">
              {[
                { reason: "Budget below threshold", pct: 41 },
                { reason: "Timeline >12 months", pct: 30 },
                { reason: "Not decision maker", pct: 17 },
                { reason: "Not interested", pct: 12 },
              ].map((item) => (
                <div key={item.reason} className="flex items-center gap-3">
                  <span className="text-[12px] text-text-secondary flex-1">{item.reason}</span>
                  <div className="w-32 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-text-tertiary rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-[12px] font-medium text-text-primary tabular-nums w-8 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
