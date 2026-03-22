"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, Pencil, Settings, Bell, Database } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const seqDetail = {
  name: "Prestige Lakeside — Post-Call",
  agent: "Priya (Qualification Agent)",
  description: "Automated sequence triggered after voice agent qualification calls. Routes qualified leads to CRM, sends follow-up WhatsApp, and schedules callbacks for undecided leads.",
  status: "active" as const,
  campaignsUsing: 2,
  config: {
    provider: "Bland AI",
    agentId: "agent_priya_qual_v3",
    timezone: "Asia/Kolkata (IST)",
    maxChurn: 5,
    followUp: true,
    rnrVoicemail: true,
    customerFollowUp: false,
  },
  notifications: {
    ownerEmail: "ankit@starealtor.in",
    slackUrl: "https://hooks.slack.com/services/T0X...",
    whatsappGroupId: "120363...",
  },
  crm: { sendQLead: true, sendIQLead: false },
  fields: [
    { fieldId: "full_name", systemKey: "name", defaultValue: "" },
    { fieldId: "phone_number", systemKey: "phone", defaultValue: "" },
    { fieldId: "email", systemKey: "email", defaultValue: "" },
    { fieldId: "budget_range", systemKey: "budget", defaultValue: "Not specified" },
  ],
};

export default function SequenceDetailPage() {
  const router = useRouter();
  const d = seqDetail;

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push("/sequences")} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Agents › Sequences › {d.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-page-title text-text-primary">{d.name}</h1>
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">Active</span>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-text-secondary">
            <span>{d.agent}</span>
            <span className="text-border">|</span>
            <span>{d.campaignsUsing} campaigns using</span>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <Pencil size={14} strokeWidth={1.5} /> Edit
        </button>
      </div>

      {/* Description */}
      <div className="bg-white border border-border rounded-card p-5 mb-5">
        <p className="text-[13px] text-text-secondary leading-relaxed">{d.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Service Config */}
        <div className="bg-white border border-border rounded-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={14} strokeWidth={1.5} className="text-text-tertiary" />
            <h3 className="text-card-title text-text-primary">Service Configuration</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Provider", value: d.config.provider },
              { label: "Agent ID", value: d.config.agentId, mono: true },
              { label: "Timezone", value: d.config.timezone },
              { label: "Max Churn", value: d.config.maxChurn.toString() },
              { label: "Follow Up", value: d.config.followUp ? "Enabled" : "Disabled" },
              { label: "RNR Voicemail", value: d.config.rnrVoicemail ? "Enabled" : "Disabled" },
              { label: "Customer Follow Up", value: d.config.customerFollowUp ? "Enabled" : "Disabled" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5">
                <span className="text-[12px] text-text-secondary">{item.label}</span>
                <span className={`text-[12px] text-text-primary font-medium ${item.mono ? "font-mono" : ""}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-5">
          <div className="bg-white border border-border rounded-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <h3 className="text-card-title text-text-primary">Notifications</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Owner Email", value: d.notifications.ownerEmail },
                { label: "Slack Webhook", value: d.notifications.slackUrl ? "Connected" : "Not set" },
                { label: "WhatsApp Group", value: d.notifications.whatsappGroupId ? "Connected" : "Not set" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] text-text-secondary">{item.label}</span>
                  <span className="text-[12px] text-text-primary font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <h3 className="text-card-title text-text-primary">CRM Integration</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[12px] text-text-secondary">Send QLead to CRM</span>
                <span className={`text-[12px] font-medium ${d.crm.sendQLead ? "text-status-success" : "text-text-tertiary"}`}>
                  {d.crm.sendQLead ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[12px] text-text-secondary">Send IQLead to CRM</span>
                <span className={`text-[12px] font-medium ${d.crm.sendIQLead ? "text-status-success" : "text-text-tertiary"}`}>
                  {d.crm.sendIQLead ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Mapping */}
      <div className="bg-white border border-border rounded-card p-5 mt-5">
        <h3 className="text-card-title text-text-primary mb-3">Response Format Mapping</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              {["Field ID", "System Key", "Default Value"].map((h) => (
                <th key={h} className="px-3 py-2 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.fields.map((f, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0">
                <td className="px-3 py-2 text-[12px] text-text-primary font-mono">{f.fieldId}</td>
                <td className="px-3 py-2 text-[12px] text-text-secondary font-mono">{f.systemKey}</td>
                <td className="px-3 py-2 text-[12px] text-text-tertiary">{f.defaultValue || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
