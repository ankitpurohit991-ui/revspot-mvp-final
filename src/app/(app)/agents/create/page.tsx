"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Phone, MessageCircle, ShieldCheck, FileText,
  Upload, X, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Play, Volume2,
} from "lucide-react";
import {
  voiceOptions, languageOptions, defaultMetrics, conversationSteps,
  defaultSystemPrompt, defaultFAQs,
} from "@/lib/voice-agent-data";
import type { QualificationMetric } from "@/lib/voice-agent-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function Toggle({ enabled, onToggle, label, helper }: { enabled: boolean; onToggle: () => void; label: string; helper?: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1 pr-4">
        <span className="text-[13px] text-text-primary">{label}</span>
        {helper && <div className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">{helper}</div>}
      </div>
      <button onClick={onToggle} className={`relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0 mt-0.5 ${enabled ? "bg-accent" : "bg-silver-light"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function CreateAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<"voice" | "whatsapp" | "">("voice");
  const [template, setTemplate] = useState<"qualifying" | "blank" | "">("qualifying");
  const [goal, setGoal] = useState("");

  // Step 2
  const [knowledgeTab, setKnowledgeTab] = useState<"upload" | "manual">("manual");
  const [productDetails, setProductDetails] = useState("");
  const [faqs, setFaqs] = useState(defaultFAQs.map((f, i) => ({ ...f, id: `faq-${i}` })));
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [steps, setSteps] = useState(conversationSteps);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Step 3
  const [selectedVoice, setSelectedVoice] = useState("v-1");
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["English", "Hindi"]);
  const [tone, setTone] = useState<"formal" | "conversational" | "friendly">("conversational");
  const [metrics, setMetrics] = useState<QualificationMetric[]>(defaultMetrics);
  const [threshold, setThreshold] = useState("all_critical_1_high");
  const [pushToCRM, setPushToCRM] = useState(true);
  const [retryUnanswered, setRetryUnanswered] = useState(true);
  const [maxRetries, setMaxRetries] = useState("2");
  const [retryAfter, setRetryAfter] = useState("4 hours");
  const [followUpVoicemail, setFollowUpVoicemail] = useState(true);
  const [notifyQualified, setNotifyQualified] = useState(true);
  const [callingStart, setCallingStart] = useState("10:00 AM");
  const [callingEnd, setCallingEnd] = useState("7:00 PM");
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customerFollowUp, setCustomerFollowUp] = useState(false);
  const [maxFollowUps, setMaxFollowUps] = useState("3");
  const [followUpInterval, setFollowUpInterval] = useState("2 days");

  const canContinue1 = name.trim() && channel && template;

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center",
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.push("/agents")} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Tools › Agents › Create</span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-10">
        {[{ label: "Configure" }, { label: "Knowledge & Flow" }, { label: "Voice, Metrics & Post-Call" }].map((s, i) => (
          <div key={i} className="flex items-center">
            <button onClick={() => i <= step && setStep(i)} disabled={i > step} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all duration-200 ${
                i < step ? "bg-accent text-white" : i === step ? "bg-accent text-white ring-4 ring-accent/10" : "bg-surface-secondary text-text-tertiary"
              } ${i <= step ? "cursor-pointer" : "cursor-not-allowed"}`}>
                {i < step ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${i === step ? "text-text-primary" : i < step ? "text-text-secondary" : "text-text-tertiary"}`}>{s.label}</span>
            </button>
            {i < 2 && <div className={`w-20 h-[2px] mx-2 mt-[-18px] ${i < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-[780px] mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: "easeOut" }}>

            {/* ════ STEP 1 — Configure ════ */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-[20px] font-semibold text-text-primary">Configure your agent</h2>
                  <p className="text-meta text-text-secondary mt-1">Set up the basics. We&apos;ll pre-fill the rest based on your choices.</p>
                </div>

                <div className="bg-white border border-border rounded-card p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">Agent name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Villa Qualifier"
                      className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                  </div>

                  {/* Channel */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-2">Channel *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setChannel("voice")}
                        className={`flex items-center gap-3 p-4 rounded-card border transition-all duration-150 text-left ${channel === "voice" ? "border-accent ring-1 ring-accent/20 bg-white" : "border-border hover:border-border-hover bg-white"}`}>
                        <div className="w-10 h-10 rounded-[8px] bg-surface-secondary flex items-center justify-center shrink-0">
                          <Phone size={18} strokeWidth={1.5} className={channel === "voice" ? "text-text-primary" : "text-text-tertiary"} />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-text-primary">Voice Call</div>
                          <div className="text-[11px] text-text-tertiary mt-0.5">Interactive voice conversations</div>
                        </div>
                      </button>
                      <div className="relative flex items-center gap-3 p-4 rounded-card border border-border bg-surface-page opacity-60 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-[8px] bg-surface-secondary flex items-center justify-center shrink-0">
                          <MessageCircle size={18} strokeWidth={1.5} className="text-text-tertiary" />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-text-secondary">WhatsApp</div>
                          <div className="text-[11px] text-text-tertiary mt-0.5">Automated text-based chat</div>
                        </div>
                        <span className="absolute top-3 right-3 text-[10px] font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded">Coming soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Template */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-2">Template *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "qualifying" as const, icon: ShieldCheck, title: "Qualifying agent", desc: "Pre-configured for lead qualification and scoring. Includes standard flow, metrics, and post-call actions." },
                        { key: "blank" as const, icon: FileText, title: "Blank agent", desc: "Start from scratch. You define all rules, scripts, and behavior." },
                      ].map((t) => (
                        <button key={t.key} onClick={() => setTemplate(t.key)}
                          className={`flex items-start gap-3 p-4 rounded-card border transition-all duration-150 text-left ${template === t.key ? "border-accent ring-1 ring-accent/20 bg-white" : "border-border hover:border-border-hover bg-white"}`}>
                          <div className="w-10 h-10 rounded-[8px] bg-surface-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <t.icon size={18} strokeWidth={1.5} className={template === t.key ? "text-text-primary" : "text-text-tertiary"} />
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-text-primary">{t.title}</div>
                            <div className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">{t.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">Main goal</label>
                    <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={3}
                      placeholder="Describe what this agent should achieve on calls (e.g., Qualify inbound leads for luxury villa project and schedule site visits)"
                      className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={() => setStep(1)} disabled={!canContinue1}
                    className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 2 — Knowledge & Conversation ════ */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-[20px] font-semibold text-text-primary">Teach your agent</h2>
                  <p className="text-meta text-text-secondary mt-1">Give your agent context about your product and define how it should converse.</p>
                </div>

                {/* Knowledge Base */}
                <div className="bg-white border border-border rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-card-title text-text-primary">Knowledge base</h3>
                      <p className="text-[11px] text-text-tertiary mt-0.5">What does your agent know?</p>
                    </div>
                    <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5">
                      {(["upload", "manual"] as const).map((t) => (
                        <button key={t} onClick={() => setKnowledgeTab(t)}
                          className={`px-3 py-1 text-[11px] font-medium rounded-[5px] transition-colors ${knowledgeTab === t ? "bg-white text-text-primary shadow-sm" : "text-text-secondary"}`}>
                          {t === "upload" ? "Upload documents" : "Enter manually"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {knowledgeTab === "upload" && (
                    <div className="border-2 border-dashed border-border rounded-[8px] p-8 text-center">
                      <Upload size={24} strokeWidth={1.5} className="text-text-tertiary mx-auto mb-2" />
                      <div className="text-[13px] text-text-secondary">Click to upload files</div>
                      <div className="text-[11px] text-text-tertiary mt-1">PDF, DOC, or DOCX (max 10MB each)</div>
                    </div>
                  )}

                  {knowledgeTab === "manual" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[12px] text-text-secondary mb-1">Product/Service details</label>
                        <textarea value={productDetails} onChange={(e) => setProductDetails(e.target.value)} rows={3}
                          placeholder="Location, price range, unit types, amenities, builder info, key selling points..."
                          className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed" />
                      </div>
                      <div>
                        <label className="block text-[12px] text-text-secondary mb-2">FAQs</label>
                        <div className="space-y-2">
                          {faqs.map((faq, i) => (
                            <div key={faq.id} className="flex gap-2 items-start">
                              <div className="flex-1 space-y-1.5">
                                <input type="text" defaultValue={faq.question} placeholder="Question"
                                  className="w-full h-8 px-2.5 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent" />
                                <textarea defaultValue={faq.answer} placeholder="Answer" rows={2}
                                  className="w-full px-2.5 py-1.5 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent resize-none" />
                              </div>
                              <button onClick={() => setFaqs(f => f.filter((_, j) => j !== i))} className="p-1.5 text-text-tertiary hover:text-status-error mt-1"><Trash2 size={13} strokeWidth={1.5} /></button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setFaqs(f => [...f, { id: `faq-${Date.now()}`, question: "", answer: "" }])}
                          className="inline-flex items-center gap-1 mt-2 text-[12px] font-medium text-text-secondary hover:text-text-primary">
                          <Plus size={13} strokeWidth={1.5} /> Add FAQ
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversation Flow */}
                <div className="bg-white border border-border rounded-card p-6">
                  <h3 className="text-card-title text-text-primary mb-1">Conversation flow</h3>
                  <p className="text-[11px] text-text-tertiary mb-4">How should the agent talk?</p>

                  <div className="mb-4">
                    <label className="block text-[12px] text-text-secondary mb-1">System prompt</label>
                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={5}
                      className="w-full px-3 py-2.5 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 resize-none leading-relaxed font-mono" />
                    <button onClick={() => setSystemPrompt(defaultSystemPrompt)} className="text-[11px] text-text-tertiary hover:text-text-secondary mt-1">Reset to template</button>
                  </div>

                  <div className="space-y-1">
                    {steps.map((s, i) => (
                      <div key={s.id} className="border border-border rounded-[6px] overflow-hidden">
                        <button onClick={() => setExpandedStep(expandedStep === s.id ? null : s.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-surface-page transition-colors text-left">
                          <GripVertical size={12} strokeWidth={1.5} className="text-text-tertiary cursor-grab" />
                          <span className="w-5 h-5 rounded-full bg-surface-secondary flex items-center justify-center text-[10px] font-semibold text-text-tertiary">{s.step}</span>
                          <span className="text-[13px] font-medium text-text-primary flex-1">{s.name}</span>
                          {expandedStep !== s.id && <span className="text-[11px] text-text-tertiary truncate max-w-[200px]">{s.script}</span>}
                          {expandedStep === s.id ? <ChevronUp size={14} strokeWidth={1.5} className="text-text-tertiary" /> : <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />}
                        </button>
                        {expandedStep === s.id && (
                          <div className="px-3 pb-3 pt-1">
                            <textarea defaultValue={s.script} rows={2} className="w-full px-2.5 py-2 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent resize-none leading-relaxed" />
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="inline-flex items-center gap-1 mt-2 text-[12px] font-medium text-text-secondary hover:text-text-primary">
                      <Plus size={13} strokeWidth={1.5} /> Add step
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                    <ArrowLeft size={15} strokeWidth={1.5} /> Back
                  </button>
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 3 — Voice, Metrics & Post-Call ════ */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="mb-2">
                  <h2 className="text-[20px] font-semibold text-text-primary">Finalize your agent</h2>
                  <p className="text-meta text-text-secondary mt-1">Set the voice, define qualification criteria, and configure what happens after each call.</p>
                </div>

                {/* Voice & Delivery */}
                <div className="bg-white border border-border rounded-card p-6">
                  <h3 className="text-card-title text-text-primary mb-4">Voice & delivery</h3>
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {voiceOptions.map((v) => (
                      <button key={v.id} onClick={() => setSelectedVoice(v.id)}
                        className={`flex items-center gap-3 p-3 rounded-[6px] border transition-all duration-150 text-left ${selectedVoice === v.id ? "border-accent ring-1 ring-accent/20" : "border-border hover:border-border-hover"}`}>
                        <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                          <Volume2 size={14} strokeWidth={1.5} className="text-text-tertiary" />
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-text-primary">{v.name}</div>
                          <div className="text-[10px] text-text-tertiary">{v.gender} · {v.languages.join(", ")}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Language */}
                  <div className="mb-4">
                    <label className="block text-[12px] text-text-secondary mb-2">Languages</label>
                    <div className="flex flex-wrap gap-1.5">
                      {languageOptions.map((lang) => (
                        <button key={lang} onClick={() => setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-badge transition-colors ${selectedLangs.includes(lang) ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:text-text-primary"}`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-[12px] text-text-secondary mb-2">Tone</label>
                    <div className="flex gap-2">
                      {(["formal", "conversational", "friendly"] as const).map((t) => (
                        <button key={t} onClick={() => setTone(t)}
                          className={`px-3 py-1.5 text-[12px] font-medium rounded-badge capitalize transition-colors ${tone === t ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:text-text-primary"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Qualification Metrics */}
                <div className="bg-white border border-border rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-card-title text-text-primary">Qualification metrics</h3>
                      <p className="text-[11px] text-text-tertiary mt-0.5">Define what makes a lead qualified</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {metrics.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-2 bg-surface-page rounded-[6px] p-2.5">
                        <input type="text" defaultValue={m.name} className="flex-1 h-8 px-2 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent" />
                        <select defaultValue={m.type} className="h-8 px-2 text-[11px] border border-border rounded-input bg-white text-text-primary appearance-none cursor-pointer" style={selectStyle}>
                          <option value="yes_no">Yes/No</option>
                          <option value="scale">Scale</option>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                        </select>
                        <input type="text" defaultValue={m.condition} className="flex-1 h-8 px-2 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent" placeholder="Condition" />
                        <select defaultValue={m.weight} className="h-8 px-2 text-[11px] border border-border rounded-input bg-white text-text-primary appearance-none cursor-pointer" style={selectStyle}>
                          {["critical", "high", "medium", "low"].map((w) => <option key={w} value={w} className="capitalize">{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
                        </select>
                        <button onClick={() => setMetrics(ms => ms.filter((_, j) => j !== i))} className="p-1 text-text-tertiary hover:text-status-error"><Trash2 size={13} strokeWidth={1.5} /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setMetrics(ms => [...ms, { id: `qm-${Date.now()}`, name: "", type: "yes_no", condition: "", weight: "medium" }])}
                    className="inline-flex items-center gap-1 mt-2 text-[12px] font-medium text-text-secondary hover:text-text-primary">
                    <Plus size={13} strokeWidth={1.5} /> Add metric
                  </button>

                  <div className="mt-4 pt-3 border-t border-border-subtle">
                    <label className="block text-[12px] text-text-secondary mb-1.5">A lead is qualified when:</label>
                    <select value={threshold} onChange={(e) => setThreshold(e.target.value)}
                      className="h-9 px-3 pr-8 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer" style={selectStyle}>
                      <option value="all_critical_1_high">All critical + at least 1 high metric met</option>
                      <option value="all_critical">All critical metrics met</option>
                      <option value="any_3">Any 3 metrics met</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Post-Call Actions */}
                <div className="bg-white border border-border rounded-card p-6">
                  <h3 className="text-card-title text-text-primary mb-1">Post-call actions</h3>
                  <p className="text-[11px] text-text-tertiary mb-4">What happens after each call?</p>

                  <Toggle enabled={pushToCRM} onToggle={() => setPushToCRM(!pushToCRM)} label="Push qualified leads to CRM"
                    helper="Leads with status 'Intent Qualified' are pushed immediately after AI qualification" />
                  <Toggle enabled={retryUnanswered} onToggle={() => setRetryUnanswered(!retryUnanswered)} label="Retry unanswered calls" />
                  {retryUnanswered && (
                    <div className="flex items-center gap-3 py-2 pl-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-text-tertiary">Max retries:</span>
                        <select value={maxRetries} onChange={(e) => setMaxRetries(e.target.value)} className="h-7 px-2 text-[11px] border border-border rounded-input bg-white appearance-none cursor-pointer" style={selectStyle}>
                          {["1", "2", "3"].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-text-tertiary">After:</span>
                        <select value={retryAfter} onChange={(e) => setRetryAfter(e.target.value)} className="h-7 px-2 text-[11px] border border-border rounded-input bg-white appearance-none cursor-pointer" style={selectStyle}>
                          {["2 hours", "4 hours", "24 hours"].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  <Toggle enabled={followUpVoicemail} onToggle={() => setFollowUpVoicemail(!followUpVoicemail)} label="Send follow-up on voicemail" />
                  <Toggle enabled={notifyQualified} onToggle={() => setNotifyQualified(!notifyQualified)} label="Notify team on qualified lead" />

                  <div className="mt-4 pt-3 border-t border-border-subtle">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <label className="block text-[11px] text-text-tertiary mb-1">Calling hours</label>
                        <div className="flex items-center gap-1.5">
                          <input type="text" value={callingStart} onChange={(e) => setCallingStart(e.target.value)} className="w-20 h-8 px-2 text-[12px] border border-border rounded-input bg-white text-text-primary text-center" />
                          <span className="text-[11px] text-text-tertiary">to</span>
                          <input type="text" value={callingEnd} onChange={(e) => setCallingEnd(e.target.value)} className="w-20 h-8 px-2 text-[12px] border border-border rounded-input bg-white text-text-primary text-center" />
                        </div>
                      </div>
                    </div>
                    <label className="block text-[11px] text-text-tertiary mb-1.5">Active days</label>
                    <div className="flex gap-1.5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <button key={d} onClick={() => setActiveDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                          className={`w-10 h-8 text-[11px] font-medium rounded-[5px] transition-colors ${activeDays.includes(d) ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced */}
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Advanced settings
                </button>
                {showAdvanced && (
                  <div className="bg-white border border-border rounded-card p-6 space-y-4">
                    <div>
                      <label className="block text-[12px] text-text-secondary mb-1">Max concurrent calls</label>
                      <input type="number" defaultValue={10} className="w-24 h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent tabular-nums" />
                    </div>
                    <div>
                      <Toggle enabled={customerFollowUp} onToggle={() => setCustomerFollowUp(!customerFollowUp)} label="Customer follow-up" helper="Allow the agent to initiate follow-up calls with previously contacted leads" />
                      {customerFollowUp && (
                        <div className="ml-0 mt-3 pl-4 border-l-2 border-border-subtle space-y-3">
                          <div className="flex items-center gap-4">
                            <div>
                              <label className="block text-[11px] text-text-tertiary mb-1">Max follow-ups</label>
                              <select value={maxFollowUps} onChange={(e) => setMaxFollowUps(e.target.value)}
                                className="h-8 px-2.5 pr-7 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                                {["1", "2", "3", "5"].map((n) => (
                                  <option key={n} value={n}>{n} {n === "1" ? "time" : "times"}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] text-text-tertiary mb-1">Interval between follow-ups</label>
                              <select value={followUpInterval} onChange={(e) => setFollowUpInterval(e.target.value)}
                                className="h-8 px-2.5 pr-7 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                                {["4 hours", "8 hours", "1 day", "2 days", "3 days", "1 week"].map((v) => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <p className="text-[11px] text-text-tertiary leading-relaxed">
                            Agent will follow up up to {maxFollowUps} {maxFollowUps === "1" ? "time" : "times"}, spaced {followUpInterval} apart. Stops automatically when the lead is qualified, asks not to be called, or is marked lost.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 pb-8">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                    <ArrowLeft size={15} strokeWidth={1.5} /> Back
                  </button>
                  <button onClick={() => router.push("/agents/va-1")} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    <Check size={15} strokeWidth={2} /> Create Agent
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

