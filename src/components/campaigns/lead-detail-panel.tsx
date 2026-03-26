"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Upload,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { CampaignLead } from "@/lib/campaign-data";

interface LeadDetailPanelProps {
  lead: CampaignLead;
  onClose: () => void;
}

const leadStatusLabels: Record<string, string> = {
  intent_qualified: "Intent Qualified",
  not_qualified: "Not Qualified",
  interested_not_ready: "Interested but Not Ready",
  duplicate: "Duplicate",
  invalid: "Invalid",
};

const leadStageLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit_scheduled: "Site Visit Scheduled",
  site_visit_done: "Site Visit Done",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[640px] bg-white z-[70] shadow-lg overflow-y-auto border-l border-border">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-semibold text-text-primary">{lead.name}</h2>
            {lead.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
                <ShieldCheck size={11} strokeWidth={2} /> Verified
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary transition-colors duration-150">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta Ad Info */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Meta Ad Info</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Campaign", value: lead.campaign },
                { label: "Adset", value: lead.adset },
                { label: "Ad", value: lead.adName },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-badge bg-surface-secondary text-text-secondary">
                  <span className="text-text-tertiary">{item.label}:</span>
                  <span className="font-medium text-text-primary">{item.value}</span>
                  <ExternalLink size={10} strokeWidth={1.5} className="text-text-tertiary" />
                </span>
              ))}
            </div>
          </div>

          {/* Lead Info */}
          <div>
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Lead Information</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name", value: lead.name },
                { label: "Phone", value: lead.phone },
                { label: "Email", value: lead.email },
                { label: "Created", value: format(new Date(lead.createdAt), "dd MMM yyyy, HH:mm") },
                { label: "Lead Status", value: leadStatusLabels[lead.leadStatus] || lead.leadStatus },
                { label: "Lead Stage", value: leadStageLabels[lead.leadStage] || lead.leadStage },
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
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Form Responses</h3>
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
            <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] mb-3">Quality Assessment</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">AI Qualification</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                    lead.aiQualification === "qualified" ? "bg-[#F0FDF4] text-[#15803D]" :
                    lead.aiQualification === "not_qualified" ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#92400E]"
                  }`}>
                    {lead.aiQualification === "qualified" ? "Qualified" : lead.aiQualification === "not_qualified" ? "Not Qualified" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Temperature</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                    lead.temperature === "hot" ? "bg-[#FEF2F2] text-[#DC2626]" :
                    lead.temperature === "warm" ? "bg-[#F0FDF4] text-[#15803D]" :
                    lead.temperature === "lukewarm" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-surface-secondary text-text-secondary"
                  }`}>
                    {lead.temperature.charAt(0).toUpperCase() + lead.temperature.slice(1)}
                  </span>
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Qualified</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.sql ? (<><CheckCircle2 size={13} strokeWidth={2} className="text-status-success" /> Yes</>) : "No"}
                </div>
              </div>
              <div className="bg-surface-page rounded-[6px] px-3 py-2">
                <div className="text-[11px] text-text-tertiary">Verified</div>
                <div className="text-[13px] text-text-primary font-medium mt-0.5 flex items-center gap-1.5">
                  {lead.verified ? (<><ShieldCheck size={13} strokeWidth={2} className="text-status-success" /> Yes</>) : "No"}
                </div>
              </div>
            </div>
          </div>

          {/* CRM Sync Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px]">CRM Sync</h3>
              <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                lead.crmSync.status === "pushed" ? "bg-[#F0FDF4] text-[#15803D]" :
                lead.crmSync.status === "failed" ? "bg-[#FEF2F2] text-[#DC2626]" :
                lead.crmSync.status === "pending" ? "bg-[#FEF3C7] text-[#92400E]" :
                "bg-surface-secondary text-text-secondary"
              }`}>
                {lead.crmSync.status === "pushed" ? "Pushed ✓" :
                 lead.crmSync.status === "failed" ? "Failed" :
                 lead.crmSync.status === "pending" ? "Pending" : "Not synced"}
              </span>
            </div>

            {/* Pushed state */}
            {lead.crmSync.status === "pushed" && (
              <div className="space-y-3">
                <div className="bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-text-tertiary">Pushed to GoHighLevel</div>
                      <div className="text-[13px] text-text-primary font-medium mt-0.5">
                        {lead.crmSync.crmRecordId}
                      </div>
                    </div>
                    <button className="text-[11px] text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors duration-150">
                      Open in GoHighLevel <ExternalLink size={10} strokeWidth={1.5} />
                    </button>
                  </div>
                  {lead.crmSync.pushedAt && (
                    <div className="text-[11px] text-text-tertiary mt-1">
                      {format(new Date(lead.crmSync.pushedAt), "MMM dd, yyyy h:mm a")}
                    </div>
                  )}
                </div>

                {/* Sync History */}
                {lead.crmSync.syncHistory && lead.crmSync.syncHistory.length > 0 && (
                  <div>
                    <div className="text-[11px] text-text-tertiary mb-2">Sync history</div>
                    <div className="space-y-0">
                      {lead.crmSync.syncHistory.map((entry, i) => (
                        <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-border-subtle last:border-0">
                          <Clock size={11} strokeWidth={1.5} className="text-text-tertiary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[11px] text-text-tertiary">{entry.date}</span>
                            <span className="text-[11px] text-text-secondary ml-1.5">— {entry.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Failed state */}
            {lead.crmSync.status === "failed" && (
              <div className="bg-[#FEF2F2] rounded-[6px] px-3 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} strokeWidth={1.5} className="text-status-error mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[12px] text-[#DC2626] font-medium">Failed to push</div>
                    <div className="text-[11px] text-[#DC2626]/80 mt-0.5">{lead.crmSync.failReason}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="inline-flex items-center gap-1 text-[11px] font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                        <RefreshCw size={11} strokeWidth={1.5} /> Retry
                      </button>
                      <button className="text-[11px] text-[#DC2626]/60 hover:text-[#DC2626] underline transition-colors">
                        Push anyway (create duplicate)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Not synced state */}
            {lead.crmSync.status === "not_synced" && (
              <div className="bg-surface-page rounded-[6px] px-3 py-3">
                <div className="text-[12px] text-text-secondary mb-2">
                  Not synced — lead status doesn&apos;t meet auto-sync rules
                </div>
                <button className="inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                  <Upload size={11} strokeWidth={1.5} /> Push manually
                </button>
              </div>
            )}

            {/* Pending state */}
            {lead.crmSync.status === "pending" && (
              <div className="bg-[#FEF3C7]/50 rounded-[6px] px-3 py-3">
                <div className="text-[12px] text-[#92400E]">
                  Qualification still in progress — will auto-push when qualified
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <CheckCircle2 size={14} strokeWidth={1.5} /> Assessed
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
