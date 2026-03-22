"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const agents = [
  "Priya (Qualification Agent)",
  "Arjun (Follow-up Agent)",
  "Neha (Survey Agent)",
];

const providers = ["Bland AI", "Retell AI", "Vapi", "Custom"];
const timezones = ["Asia/Kolkata (IST)", "Asia/Dubai (GST)", "America/New_York (EST)", "Europe/London (GMT)"];

interface FieldMapping {
  id: string;
  fieldId: string;
  systemKey: string;
  defaultValue: string;
}

const defaultFields: FieldMapping[] = [
  { id: "f-1", fieldId: "full_name", systemKey: "name", defaultValue: "" },
  { id: "f-2", fieldId: "phone_number", systemKey: "phone", defaultValue: "" },
  { id: "f-3", fieldId: "email", systemKey: "email", defaultValue: "" },
];

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-text-primary">{label}</span>
      <button onClick={onToggle} className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${enabled ? "bg-accent" : "bg-silver-light"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function CreateSequencePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState("");
  const [agent, setAgent] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [provider, setProvider] = useState("");
  const [agentId, setAgentId] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [maxChurn, setMaxChurn] = useState("5");
  const [followUp, setFollowUp] = useState(true);
  const [rnrVoicemail, setRnrVoicemail] = useState(true);
  const [customerFollowUp, setCustomerFollowUp] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("ankit@starealtor.in");
  const [slackUrl, setSlackUrl] = useState("");
  const [whatsappGroupId, setWhatsappGroupId] = useState("");
  const [sendQLead, setSendQLead] = useState(true);
  const [sendIQLead, setSendIQLead] = useState(false);
  const [fields, setFields] = useState<FieldMapping[]>(defaultFields);

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center",
  };

  const addField = () => {
    setFields((f) => [...f, { id: `f-${Date.now()}`, fieldId: "", systemKey: "", defaultValue: "" }]);
  };

  const removeField = (id: string) => {
    setFields((f) => f.filter((x) => x.id !== id));
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.push("/sequences")} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Agents › Sequences › Create</span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-10">
        {[{ label: "Sequence Details" }, { label: "Channel Setup" }].map((s, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => i <= step && setStep(i)} disabled={i > step} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all duration-200 ${i < step ? "bg-accent text-white" : i === step ? "bg-accent text-white ring-4 ring-accent/10" : "bg-surface-secondary text-text-tertiary"} ${i <= step ? "cursor-pointer" : "cursor-not-allowed"}`}>
                {i < step ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium ${i === step ? "text-text-primary" : i < step ? "text-text-secondary" : "text-text-tertiary"}`}>{s.label}</span>
            </button>
            {i < 1 && <div className={`w-24 h-[2px] mx-3 mt-[-18px] ${i < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-[680px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }}>
            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-[20px] font-semibold text-text-primary">Sequence Details</h2>
                  <p className="text-meta text-text-secondary mt-1">Basic information about this sequence</p>
                </div>
                <div className="bg-white border border-border rounded-card p-6 space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">Sequence Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Prestige Lakeside — Post-Call"
                      className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">Voice Agent *</label>
                    <select value={agent} onChange={(e) => setAgent(e.target.value)} className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer" style={selectStyle}>
                      <option value="">Select agent...</option>
                      {agents.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this sequence do?" rows={3}
                      className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-[20px] font-semibold text-text-primary">Channel Setup</h2>
                  <p className="text-meta text-text-secondary mt-1">Configure the calling service, notifications, and CRM integration</p>
                </div>

                {/* Service Config */}
                <div className="bg-white border border-border rounded-card p-6 space-y-4">
                  <h3 className="text-card-title text-text-primary">Service Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Service Provider</label>
                      <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer" style={selectStyle}>
                        <option value="">Select provider...</option>
                        {providers.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Agent Identifier</label>
                      <input type="text" value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="e.g., agent_abc123"
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary font-mono" />
                    </div>
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Time Zone</label>
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer" style={selectStyle}>
                        {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Max Churn</label>
                      <input type="number" value={maxChurn} onChange={(e) => setMaxChurn(e.target.value)}
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 tabular-nums" />
                    </div>
                  </div>
                  <div className="border-t border-border-subtle pt-3 space-y-0">
                    <Toggle enabled={followUp} onToggle={() => setFollowUp(!followUp)} label="Follow Up" />
                    <Toggle enabled={rnrVoicemail} onToggle={() => setRnrVoicemail(!rnrVoicemail)} label="RNR on Voicemail" />
                    <Toggle enabled={customerFollowUp} onToggle={() => setCustomerFollowUp(!customerFollowUp)} label="Customer Follow Up" />
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white border border-border rounded-card p-6 space-y-4">
                  <h3 className="text-card-title text-text-primary">Notifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Owner Email</label>
                      <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)}
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150" />
                    </div>
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Slack Webhook URL</label>
                      <input type="text" value={slackUrl} onChange={(e) => setSlackUrl(e.target.value)} placeholder="https://hooks.slack.com/..."
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] text-text-secondary mb-1">WhatsApp Group ID</label>
                    <input type="text" value={whatsappGroupId} onChange={(e) => setWhatsappGroupId(e.target.value)} placeholder="Optional"
                      className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                  </div>
                </div>

                {/* CRM */}
                <div className="bg-white border border-border rounded-card p-6 space-y-4">
                  <h3 className="text-card-title text-text-primary">CRM Integration</h3>
                  <Toggle enabled={sendQLead} onToggle={() => setSendQLead(!sendQLead)} label="Send Qualified Lead to CRM" />
                  <Toggle enabled={sendIQLead} onToggle={() => setSendIQLead(!sendIQLead)} label="Send Inquiry Lead to CRM" />
                </div>

                {/* Response Format */}
                <div className="bg-white border border-border rounded-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-card-title text-text-primary">Response Format Mapping</h3>
                    <button onClick={addField} className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary">
                      <Plus size={13} strokeWidth={1.5} /> Add field
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 px-1">
                      <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px]">Field ID</span>
                      <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px]">System Key</span>
                      <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px]">Default Value</span>
                      <span />
                    </div>
                    {fields.map((f) => (
                      <div key={f.id} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2">
                        <input type="text" defaultValue={f.fieldId} placeholder="field_id"
                          className="h-9 px-2.5 text-[12px] font-mono border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                        <input type="text" defaultValue={f.systemKey} placeholder="system_key"
                          className="h-9 px-2.5 text-[12px] font-mono border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                        <input type="text" defaultValue={f.defaultValue} placeholder="default"
                          className="h-9 px-2.5 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                        <button onClick={() => removeField(f.id)} className="h-9 flex items-center justify-center text-text-tertiary hover:text-status-error transition-colors duration-150">
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 pb-8">
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                    <ArrowLeft size={15} strokeWidth={1.5} /> Back
                  </button>
                  <button onClick={() => router.push("/sequences/seq-1")} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    <Check size={15} strokeWidth={2} /> Create Sequence
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
