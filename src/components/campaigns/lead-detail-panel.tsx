"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  X,
  Send,
  Copy,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import type { CampaignLead } from "@/lib/campaign-data";

const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panel: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { x: "100%", transition: { duration: 0.15, ease: "easeIn" } },
};

interface LeadDetailPanelProps {
  lead: CampaignLead;
  onClose: () => void;
}

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        variants={overlay}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        variants={panel}
        initial="hidden"
        animate="show"
        exit="exit"
        className="fixed right-0 top-0 h-full w-[640px] bg-white z-50 shadow-lg overflow-y-auto border-l border-border"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-text-primary">{lead.name}</h2>
            {lead.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
                <ShieldCheck size={11} strokeWidth={2} />
                Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary transition-colors duration-150"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta Ad Info */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Meta Ad Info
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Campaign", value: lead.campaign },
                { label: "Adset", value: lead.adset },
                { label: "Ad", value: lead.adName },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-badge bg-surface-secondary text-text-secondary"
                >
                  <span className="text-text-tertiary">{item.label}:</span>
                  <span className="font-medium text-text-primary">{item.value}</span>
                  <ExternalLink size={10} strokeWidth={1.5} className="text-text-tertiary" />
                </span>
              ))}
            </div>
          </div>

          {/* Lead Info */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Lead Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name", value: lead.name },
                { label: "Phone", value: lead.phone },
                { label: "Email", value: lead.email },
                { label: "Created", value: format(new Date(lead.createdAt), "dd MMM yyyy, HH:mm") },
                { label: "Updated", value: format(new Date(lead.updatedAt), "dd MMM yyyy, HH:mm") },
                { label: "Lead Status", value: lead.leadStatus.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") },
              ].map((item) => (
                <div key={item.label} className="bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="text-[11px] text-text-tertiary">{item.label}</div>
                  <div className="text-[13px] text-text-primary font-medium mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Responses */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Form Responses
            </h3>
            <div className="space-y-2">
              {lead.formResponses.map((fr, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border-subtle last:border-0">
                  <span className="text-[12px] text-text-secondary min-w-[160px]">{fr.question}</span>
                  <span className="text-[13px] text-text-primary font-medium">{fr.answer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Assessment */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">
              Quality Assessment
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">AI Qualification</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                    lead.aiQualification === "qualified"
                      ? "bg-[#F0FDF4] text-[#15803D]"
                      : lead.aiQualification === "not_qualified"
                      ? "bg-[#FEF2F2] text-[#DC2626]"
                      : "bg-[#FEF3C7] text-[#92400E]"
                  }`}>
                    {lead.aiQualification === "qualified"
                      ? "Qualified"
                      : lead.aiQualification === "not_qualified"
                      ? "Not Qualified"
                      : "Pending"}
                  </span>
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Temperature</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                    lead.temperature === "hot"
                      ? "bg-[#FEF2F2] text-[#DC2626]"
                      : lead.temperature === "warm"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : lead.temperature === "lukewarm"
                      ? "bg-[#F0F0F0] text-text-secondary"
                      : "bg-[#EFF6FF] text-[#1D4ED8]"
                  }`}>
                    {lead.temperature.charAt(0).toUpperCase() + lead.temperature.slice(1)}
                  </span>
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">SQL Status</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.sql ? (
                    <>
                      <CheckCircle2 size={13} strokeWidth={2} className="text-status-success" />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Verified</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.verified ? (
                    <>
                      <ShieldCheck size={13} strokeWidth={2} className="text-status-success" />
                      Yes
                    </>
                  ) : (
                    "No"
                  )}
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2 col-span-2">
                <div className="text-[11px] text-text-tertiary">Sent to CRM</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5">
                  {lead.sentToCRM || "Not sent"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <Send size={14} strokeWidth={1.5} />
            Send to CRM
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
            <Copy size={14} strokeWidth={1.5} />
            Copy to Campaign
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150 ml-auto">
            <CheckCircle2 size={14} strokeWidth={1.5} />
            Assessed
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
