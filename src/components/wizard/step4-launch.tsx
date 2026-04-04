"use client";

import { useState } from "react";
import {
  ArrowRight, ArrowLeft, Rocket, AlertCircle, ShieldCheck, Bot, Sparkles, Lock,
} from "lucide-react";
import { adAccounts, facebookPages } from "@/lib/wizard-data";
import { newAgentsList } from "@/lib/voice-agent-data";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

export function Step4Launch({ onNext, onBack }: Step4Props) {
  const [adAccount, setAdAccount] = useState("");
  const [fbPage, setFbPage] = useState("");
  const [launching, setLaunching] = useState(false);

  // Verification — ON by default, locked ON if objective is verified_leads
  const isVerifiedLeadsObjective = true; // mock: assume verified leads was selected in Step 1
  const [verificationEnabled, setVerificationEnabled] = useState(true);

  // Agent selection
  const [agentMode, setAgentMode] = useState<"existing" | "ai_create">("ai_create");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);

  const canLaunch = adAccount && fbPage;

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => { setLaunching(false); onNext(); }, 2000);
  };

  const handleCreateAgent = () => {
    setIsCreatingAgent(true);
    setTimeout(() => {
      setIsCreatingAgent(false);
      setAgentCreated(true);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Launch Campaign</h2>
        <p className="text-meta text-text-secondary mt-1">Connect your ad account, configure verification and AI agent</p>
      </div>

      {/* Campaign Summary */}
      <div className="bg-surface-page border border-border-subtle rounded-card p-5">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Campaign</span>
            <span className="block text-[13px] text-text-primary font-medium">Godrej Air Phase 3</span>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Ad Sets</span>
            <span className="block text-[13px] text-text-primary font-medium">3</span>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Creatives</span>
            <span className="block text-[13px] text-text-primary font-medium">3</span>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Daily Budget</span>
            <span className="block text-[13px] text-text-primary font-medium">₹8,000</span>
          </div>
        </div>
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
      </div>

      {/* Lead Verification */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={16} strokeWidth={1.5} className="text-[#15803D]" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">Lead Verification</h3>
              <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
                Automatically verify incoming leads via phone/email before marking them as verified.
                {isVerifiedLeadsObjective && (
                  <span className="text-[11px] text-[#15803D] font-medium block mt-1">
                    Required — your campaign objective is set to Verified Leads
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            {isVerifiedLeadsObjective && <Lock size={12} strokeWidth={2} className="text-text-tertiary" />}
            <button
              type="button"
              onClick={() => !isVerifiedLeadsObjective && setVerificationEnabled(!verificationEnabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ${
                verificationEnabled ? "bg-[#15803D]" : "bg-gray-200"
              } ${isVerifiedLeadsObjective ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-150 ${
                verificationEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Agent */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Bot size={16} strokeWidth={1.5} className="text-accent" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary">AI Agent</h3>
            <p className="text-[12px] text-text-secondary mt-0.5">
              An AI agent will qualify leads from this campaign. Select an existing agent or let AI create one.
            </p>
          </div>
        </div>

        {/* Agent mode toggle */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setAgentMode("ai_create"); setSelectedAgent(""); }}
            className={`flex-1 text-left p-3 rounded-[8px] border transition-colors duration-150 ${
              agentMode === "ai_create" ? "border-accent bg-accent/5" : "border-border hover:border-border-hover"
            }`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles size={12} strokeWidth={1.5} className="text-accent" />
              <span className="text-[12px] font-medium text-text-primary">AI Creates Agent</span>
            </div>
            <p className="text-[10px] text-text-tertiary">Auto-create agent + sequence based on project & campaign context</p>
          </button>
          <button onClick={() => { setAgentMode("existing"); setAgentCreated(false); }}
            className={`flex-1 text-left p-3 rounded-[8px] border transition-colors duration-150 ${
              agentMode === "existing" ? "border-accent bg-accent/5" : "border-border hover:border-border-hover"
            }`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Bot size={12} strokeWidth={1.5} className="text-text-secondary" />
              <span className="text-[12px] font-medium text-text-primary">Use Existing Agent</span>
            </div>
            <p className="text-[10px] text-text-tertiary">Select from your previously created agents</p>
          </button>
        </div>

        {/* AI Create mode */}
        {agentMode === "ai_create" && (
          <div>
            {agentCreated ? (
              <div className="bg-[#F0FDF4] border border-[#15803D]/20 rounded-[8px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} strokeWidth={2} className="text-[#15803D]" />
                  <span className="text-[13px] font-semibold text-[#15803D]">Agent + Sequence Created</span>
                </div>
                <div className="text-[12px] text-text-secondary leading-relaxed space-y-1">
                  <p><span className="font-medium text-text-primary">Agent:</span> Godrej Air — Qualification Agent (Voice + WhatsApp)</p>
                  <p><span className="font-medium text-text-primary">Sequence:</span> Auto-call new leads, retry 2x at 4-hour intervals</p>
                  <p><span className="font-medium text-text-primary">Objectives:</span> Budget, Timeline, Site Visit Interest, Decision Maker</p>
                </div>
              </div>
            ) : (
              <div className="bg-surface-page border border-border-subtle rounded-[8px] p-4">
                <p className="text-[12px] text-text-secondary mb-3">
                  AI will create a qualification agent based on your project knowledge base and campaign objectives. It will also set up an automated calling sequence.
                </p>
                <button onClick={handleCreateAgent} disabled={isCreatingAgent}
                  className="inline-flex items-center gap-2 h-9 px-4 text-[12px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors disabled:opacity-50">
                  {isCreatingAgent ? (
                    <><div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Agent...</>
                  ) : (
                    <><Sparkles size={13} strokeWidth={1.5} /> Create Agent with AI</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Existing agent mode */}
        {agentMode === "existing" && (
          <div>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
              style={selectStyle}>
              <option value="">Select an agent...</option>
              {newAgentsList.filter(a => a.status === "active").map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {selectedAgent && (() => {
              const agent = newAgentsList.find(a => a.id === selectedAgent);
              return agent ? (
                <div className="mt-2 bg-surface-page border border-border-subtle rounded-[8px] px-3 py-2.5">
                  <div className="text-[12px] text-text-primary font-medium">{agent.name}</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">{agent.languages.join(", ")} · {agent.qualification_rate}% qualification rate</div>
                  <div className="text-[11px] text-text-tertiary mt-0.5">{agent.objectives_count} objectives · {agent.supported_channels.join(" + ")}</div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* AI Qualification Toggle */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={16} strokeWidth={1.5} className="text-accent" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">AI Qualification</h3>
              <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
                When enabled, the AI agent will automatically call and qualify incoming leads from this campaign based on your qualification criteria.
              </p>
            </div>
          </div>
          <button type="button"
            className="relative inline-flex h-5 w-9 items-center rounded-full bg-accent transition-colors duration-150 shrink-0 mt-1">
            <span className="inline-block h-3.5 w-3.5 rounded-full bg-white translate-x-[18px] transition-transform duration-150" />
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-[6px] px-4 py-3">
        <AlertCircle size={14} strokeWidth={1.5} className="text-[#1D4ED8] mt-0.5 shrink-0" />
        <p className="text-[12px] text-[#1D4ED8] leading-relaxed">
          Campaign will be created on Meta in <span className="font-medium">paused</span> state. The AI agent and sequence will be set up automatically and start once you activate the campaign.
        </p>
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
    </div>
  );
}
