"use client";

import { useState } from "react";
import {
  ArrowRight, ArrowLeft, Rocket, AlertCircle, Upload, Image, Phone,
  Zap, X, CheckCircle2, ExternalLink,
} from "lucide-react";
import { adAccounts, facebookPages } from "@/lib/wizard-data";
import { agentsList } from "@/lib/voice-agent-data";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

function Toggle({ enabled, onToggle, label, helper }: {
  enabled: boolean; onToggle: () => void; label: string; helper?: string;
}) {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1 mr-4">
        <span className="text-[13px] text-text-primary">{label}</span>
        {helper && <p className="text-[11px] text-text-tertiary mt-0.5">{helper}</p>}
      </div>
      <button onClick={onToggle} className={`relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0 mt-0.5 ${enabled ? "bg-accent" : "bg-silver-light"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

// Mock creatives for the library
const mockCreatives = [
  { id: "cr-1", name: "Godrej Air 3BHK Carousel", format: "Carousel", thumb: "🏠" },
  { id: "cr-2", name: "Godrej Air Lifestyle Video", format: "Video", thumb: "🎬" },
  { id: "cr-3", name: "Floor Plan Static", format: "Image", thumb: "📐" },
  { id: "cr-4", name: "Amenities Showcase", format: "Carousel", thumb: "🏊" },
];

export function Step4Launch({ onNext, onBack }: Step4Props) {
  const [adAccount, setAdAccount] = useState("");
  const [fbPage, setFbPage] = useState("");
  const [launching, setLaunching] = useState(false);

  // Creatives
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>([]);
  const [showCreativeModal, setShowCreativeModal] = useState(false);

  // Enrichment & Voice AI
  const [autoEnrich, setAutoEnrich] = useState(true);
  const [enableVoiceAI, setEnableVoiceAI] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  const canLaunch = adAccount && fbPage;
  const activeAgents = agentsList.filter((a) => a.status === "active");
  const agent = activeAgents.find((a) => a.id === selectedAgent);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => { setLaunching(false); onNext(); }, 2000);
  };

  const toggleCreative = (id: string) => {
    setSelectedCreatives((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Launch Campaign</h2>
        <p className="text-meta text-text-secondary mt-1">Attach creatives, configure lead processing, and connect your Meta ad account</p>
      </div>

      {/* Campaign Creatives */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Image size={16} strokeWidth={1.5} className="text-text-tertiary" />
          <h3 className="text-[14px] font-semibold text-text-primary">Campaign Creatives</h3>
        </div>
        <p className="text-[12px] text-text-tertiary mb-4">Attach creative assets for this campaign</p>

        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setShowCreativeModal(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">
            <Image size={13} strokeWidth={1.5} /> Select from library
          </button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">
            <Upload size={13} strokeWidth={1.5} /> Upload new
          </button>
        </div>

        {selectedCreatives.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCreatives.map((id) => {
              const cr = mockCreatives.find((c) => c.id === id);
              return cr ? (
                <div key={id} className="inline-flex items-center gap-2 bg-surface-page rounded-[6px] px-3 py-2">
                  <span className="text-[16px]">{cr.thumb}</span>
                  <div>
                    <div className="text-[12px] font-medium text-text-primary">{cr.name}</div>
                    <div className="text-[10px] text-text-tertiary">{cr.format}</div>
                  </div>
                  <button onClick={() => toggleCreative(id)} className="text-text-tertiary hover:text-text-primary ml-1">
                    <X size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}

        <p className="text-[11px] text-text-tertiary mt-3">You can add creatives after launch too.</p>
      </div>

      {/* Enrichment & Voice AI */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} strokeWidth={1.5} className="text-text-tertiary" />
          <h3 className="text-[14px] font-semibold text-text-primary">Enrichment & Voice AI</h3>
        </div>
        <p className="text-[12px] text-text-tertiary mb-3">Configure lead processing for this campaign</p>

        <div className="border-b border-border-subtle">
          <Toggle enabled={autoEnrich} onToggle={() => setAutoEnrich(!autoEnrich)}
            label="Auto-enrich new leads" helper="Automatically enrich incoming leads with Revspot data" />
        </div>

        <Toggle enabled={enableVoiceAI} onToggle={() => setEnableVoiceAI(!enableVoiceAI)}
          label="Enable Voice AI qualification" helper="Automatically call and qualify new leads using an AI voice agent" />

        {enableVoiceAI && (
          <div className="mt-1 ml-0 space-y-3">
            {activeAgents.length > 0 ? (
              <>
                <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                  style={selectStyle}>
                  <option value="">Select agent...</option>
                  {activeAgents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} · {a.qualificationRate}% qual rate</option>
                  ))}
                </select>
                {agent && (
                  <div className="bg-surface-page rounded-[6px] px-3 py-2.5">
                    <div className="text-[12px] text-text-primary font-medium">{agent.name}</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">{agent.languages.join(", ")} · {agent.qualificationRate}% qualification rate</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{agent.postCallSummary}</div>
                    <button className="text-[11px] text-accent font-medium mt-1 inline-flex items-center gap-1 hover:underline">
                      Preview agent <ExternalLink size={10} strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-surface-page rounded-[6px] px-3 py-2.5">
                <p className="text-[12px] text-text-secondary">No agents created yet.</p>
                <a href="/agents/create" className="text-[12px] text-accent font-medium inline-flex items-center gap-1 mt-1 hover:underline">
                  Create one <ArrowRight size={11} strokeWidth={1.5} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ad Account & Page */}
      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-text-primary">Meta Ad Account</h3>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Ad Account <span className="text-status-error">*</span></label>
          <select value={adAccount} onChange={(e) => setAdAccount(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
            style={selectStyle}>
            <option value="">Select ad account...</option>
            {adAccounts.map((acc) => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Facebook Page <span className="text-status-error">*</span></label>
          <select value={fbPage} onChange={(e) => setFbPage(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
            style={selectStyle}>
            <option value="">Select Facebook page...</option>
            {facebookPages.map((pg) => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
          </select>
        </div>
        <div className="flex items-start gap-2.5 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-[6px] px-4 py-3">
          <AlertCircle size={14} strokeWidth={1.5} className="text-[#1D4ED8] mt-0.5 shrink-0" />
          <p className="text-[12px] text-[#1D4ED8] leading-relaxed">
            This will create the campaign on your Meta ad account in <span className="font-medium">paused</span> state — review before going live.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button onClick={handleLaunch} disabled={!canLaunch || launching}
          className={`inline-flex items-center gap-2 h-10 px-6 text-[13px] font-medium rounded-button transition-colors duration-150 ${
            canLaunch && !launching ? "bg-accent text-white hover:bg-accent-hover" : "bg-surface-secondary text-text-tertiary cursor-not-allowed"
          }`}>
          {launching ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating on Meta...</>
          ) : (
            <><Rocket size={15} strokeWidth={1.5} /> Create Campaign on Meta</>
          )}
        </button>
      </div>

      {/* Creative Selection Modal */}
      {showCreativeModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-[60]" onClick={() => setShowCreativeModal(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-card border border-border shadow-lg w-full max-w-[480px]">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-text-primary">Select creatives</h3>
                <button onClick={() => setShowCreativeModal(false)} className="p-1 text-text-secondary hover:bg-surface-secondary rounded-button"><X size={16} strokeWidth={1.5} /></button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {mockCreatives.map((cr) => (
                  <button key={cr.id} onClick={() => toggleCreative(cr.id)}
                    className={`text-left border rounded-card p-3 transition-all duration-150 ${
                      selectedCreatives.includes(cr.id) ? "border-accent ring-1 ring-accent/20" : "border-border hover:border-border-hover"
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[20px]">{cr.thumb}</span>
                      {selectedCreatives.includes(cr.id) && <CheckCircle2 size={14} strokeWidth={2} className="text-accent ml-auto" />}
                    </div>
                    <div className="text-[12px] font-medium text-text-primary">{cr.name}</div>
                    <div className="text-[10px] text-text-tertiary">{cr.format}</div>
                  </button>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border-subtle flex justify-end">
                <button onClick={() => setShowCreativeModal(false)}
                  className="h-8 px-4 bg-accent text-white text-[12px] font-medium rounded-button hover:bg-accent-hover transition-colors">
                  Attach {selectedCreatives.length > 0 ? `(${selectedCreatives.length})` : "selected"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
