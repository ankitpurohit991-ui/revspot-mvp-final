"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageCircle,
  Check,
  Upload,
  FileText,
  X,
  Plus,
  Trash2,
  Play,
  Building2,
  Heart,
  Landmark,
  GraduationCap,
  Car,
  Cpu,
  Briefcase,
  Factory,
  ShoppingBag,
  Tv,
  MoreHorizontal,
} from "lucide-react";
import {
  industries,
  voiceOptions,
  languageOptions,
  defaultMetrics,
  conversationFlow,
  defaultSystemPrompt,
} from "@/lib/voice-agent-data";
import type { QualificationMetric } from "@/lib/voice-agent-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const iconMap: Record<string, React.ElementType> = {
  Building2, Heart, Landmark, GraduationCap, Car, Cpu, Briefcase, Factory,
  ShoppingBag, Tv, MoreHorizontal,
};

function getIndustryIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

const steps = [
  { key: "channel", label: "Channel" },
  { key: "template", label: "Template" },
  { key: "industry", label: "Industry" },
  { key: "details", label: "Details & Setup" },
] as const;

export default function CreateVoiceAgentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("qualifying");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [agentName, setAgentName] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [files, setFiles] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<QualificationMetric[]>(defaultMetrics);
  const [selectedVoice, setSelectedVoice] = useState("v-1");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push("/agents/voice")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Agents › Voice Agents › Create</span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {steps.map((step, i) => {
            const isComplete = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  disabled={i > currentStep}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all duration-200 ${
                    isComplete ? "bg-accent text-white" : isCurrent ? "bg-accent text-white ring-4 ring-accent/10" : "bg-surface-secondary text-text-tertiary"
                  } ${i <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}`}>
                    {isComplete ? <Check size={14} strokeWidth={2.5} /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium ${isCurrent ? "text-text-primary" : isComplete ? "text-text-secondary" : "text-text-tertiary"}`}>
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-20 h-[2px] mx-3 mt-[-18px] ${i < currentStep ? "bg-accent" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-[900px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Step 1: Channel */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary text-center mb-2">
                  Select communication channel
                </h2>
                <p className="text-meta text-text-secondary text-center mb-8">
                  Choose how your agent will communicate with leads
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-[500px] mx-auto">
                  <button className="bg-white border-2 border-accent rounded-card p-6 text-center ring-1 ring-accent/20">
                    <div className="w-12 h-12 mx-auto mb-3 bg-accent/5 rounded-full flex items-center justify-center">
                      <Phone size={22} strokeWidth={1.5} className="text-accent" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-text-primary">Voice Call</h3>
                    <p className="text-[12px] text-text-secondary mt-1">AI-powered phone calls</p>
                  </button>
                  <div className="bg-surface-page border border-border rounded-card p-6 text-center opacity-50 cursor-not-allowed">
                    <div className="w-12 h-12 mx-auto mb-3 bg-surface-secondary rounded-full flex items-center justify-center">
                      <MessageCircle size={22} strokeWidth={1.5} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-[14px] font-semibold text-text-secondary">WhatsApp</h3>
                    <p className="text-[12px] text-text-tertiary mt-1">Coming soon</p>
                  </div>
                </div>
                <div className="flex justify-center pt-8">
                  <button onClick={goNext} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Template */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary text-center mb-2">
                  Choose a template
                </h2>
                <p className="text-meta text-text-secondary text-center mb-8">
                  Start with a pre-configured template or build from scratch
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-[500px] mx-auto">
                  {[
                    { key: "qualifying", title: "Qualifying Agent", desc: "Pre-configured for lead qualification with scoring and routing" },
                    { key: "blank", title: "Blank Agent", desc: "Start from scratch with a clean configuration" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setSelectedTemplate(t.key)}
                      className={`bg-white border-2 rounded-card p-6 text-center transition-all duration-150 ${
                        selectedTemplate === t.key ? "border-accent ring-1 ring-accent/20" : "border-border hover:border-border-hover"
                      }`}
                    >
                      <h3 className="text-[14px] font-semibold text-text-primary">{t.title}</h3>
                      <p className="text-[12px] text-text-secondary mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-8 max-w-[500px] mx-auto">
                  <button onClick={goBack} className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                    <ArrowLeft size={15} strokeWidth={1.5} /> Back
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Industry */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-[20px] font-semibold text-text-primary text-center mb-2">
                  Select industry
                </h2>
                <p className="text-meta text-text-secondary text-center mb-8">
                  This helps pre-configure qualification criteria and conversation flow
                </p>
                <div className="grid grid-cols-4 gap-3 max-w-[640px] mx-auto">
                  {industries.map((ind) => {
                    const Icon = getIndustryIcon(ind.icon);
                    return (
                      <button
                        key={ind.id}
                        onClick={() => setSelectedIndustry(ind.id)}
                        className={`bg-white border-2 rounded-card px-3 py-4 text-center transition-all duration-150 ${
                          selectedIndustry === ind.id ? "border-accent ring-1 ring-accent/20" : "border-border hover:border-border-hover"
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.5} className={`mx-auto mb-2 ${selectedIndustry === ind.id ? "text-accent" : "text-text-secondary"}`} />
                        <span className="text-[12px] font-medium text-text-primary">{ind.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-8 max-w-[640px] mx-auto">
                  <button onClick={goBack} className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                    <ArrowLeft size={15} strokeWidth={1.5} /> Back
                  </button>
                  <button onClick={goNext} disabled={!selectedIndustry} className={`inline-flex items-center gap-2 h-10 px-6 text-[13px] font-medium rounded-button transition-colors duration-150 ${selectedIndustry ? "bg-accent text-white hover:bg-accent-hover" : "bg-surface-secondary text-text-tertiary cursor-not-allowed"}`}>
                    Continue <ArrowRight size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Details & Setup */}
            {currentStep === 3 && (
              <div className="grid grid-cols-[1fr_320px] gap-6">
                {/* Left: Form */}
                <div className="space-y-5">
                  <div className="bg-white border border-border rounded-card p-5 space-y-4">
                    <h3 className="text-card-title text-text-primary">Agent Configuration</h3>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">Agent Name *</label>
                      <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="e.g., Priya — Qualification Agent"
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">Main Goal *</label>
                      <textarea value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} placeholder="Describe the agent's primary objective..." rows={3}
                        className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed" />
                    </div>
                  </div>

                  {/* Knowledge Bases */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-3">Knowledge Bases</h3>
                    <div onClick={() => setFiles((f) => [...f, "Property_Brochure.pdf"])}
                      className="border-2 border-dashed border-border rounded-input p-4 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150">
                      <Upload size={18} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-1.5" />
                      <p className="text-[12px] text-text-secondary">Upload documents (PDF, DOC, DOCX)</p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2">
                            <div className="flex items-center gap-2">
                              <FileText size={13} strokeWidth={1.5} className="text-text-tertiary" />
                              <span className="text-[12px] text-text-primary">{f}</span>
                            </div>
                            <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-text-tertiary hover:text-text-primary">
                              <X size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* System Prompt */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-3">System Prompt</h3>
                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={10}
                      className="w-full px-3 py-2.5 text-[12px] font-mono border border-border rounded-input bg-surface-page text-text-primary focus:outline-none focus:border-accent focus:bg-white transition-colors duration-150 resize-none leading-relaxed" />
                  </div>

                  {/* Qualification Metrics */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-card-title text-text-primary">Qualification Metrics</h3>
                      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary">
                        <Plus size={13} strokeWidth={1.5} /> Add metric
                      </button>
                    </div>
                    <div className="space-y-2">
                      {metrics.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 bg-surface-page rounded-[6px] px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-text-primary">{m.name}</div>
                            <div className="text-[11px] text-text-tertiary mt-0.5">
                              {m.type === "yes_no" ? "Yes/No" : m.type === "scale" ? "Scale" : m.type === "number" ? "Number" : "Text"} · Condition: {m.condition} · Weight: {m.weight}%
                            </div>
                          </div>
                          <button className="text-text-tertiary hover:text-status-error shrink-0">
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-3">Voice Selection</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {voiceOptions.map((v) => (
                        <button key={v.id} onClick={() => setSelectedVoice(v.id)}
                          className={`border-2 rounded-[6px] px-3 py-2.5 text-left transition-all duration-150 ${
                            selectedVoice === v.id ? "border-accent ring-1 ring-accent/20 bg-white" : "border-border bg-white hover:border-border-hover"
                          }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-text-primary">{v.name}</span>
                            <Play size={11} strokeWidth={2} className="text-text-tertiary" />
                          </div>
                          <div className="text-[10px] text-text-tertiary mt-0.5">{v.gender} · {v.accent}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {languageOptions.map((lang) => (
                        <button key={lang} onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors duration-150 ${
                            selectedLanguages.includes(lang) ? "bg-accent text-white" : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                          }`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conversation Flow */}
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-4">Conversation Flow</h3>
                    <div className="space-y-0">
                      {conversationFlow.map((step, i) => (
                        <div key={step.step} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-accent text-white text-[11px] font-semibold flex items-center justify-center">
                              {step.step}
                            </div>
                            {i < conversationFlow.length - 1 && <div className="w-[2px] h-8 bg-border mt-1" />}
                          </div>
                          <div className="pb-4">
                            <div className="text-[13px] font-medium text-text-primary">{step.name}</div>
                            <div className="text-[11px] text-text-secondary mt-0.5">{step.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Summary */}
                <div className="sticky top-8">
                  <div className="bg-white border border-border rounded-card p-5">
                    <h3 className="text-card-title text-text-primary mb-4">Setup Summary</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Channel", value: "Voice Call" },
                        { label: "Template", value: selectedTemplate === "qualifying" ? "Qualifying Agent" : "Blank Agent" },
                        { label: "Industry", value: industries.find((i) => i.id === selectedIndustry)?.name || "—" },
                        { label: "Agent Name", value: agentName || "—" },
                        { label: "Voice", value: voiceOptions.find((v) => v.id === selectedVoice)?.name || "—" },
                        { label: "Languages", value: selectedLanguages.join(", ") || "—" },
                        { label: "Knowledge bases", value: files.length > 0 ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "None" },
                        { label: "Metrics", value: `${metrics.length} configured` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start justify-between">
                          <span className="text-[12px] text-text-secondary">{item.label}</span>
                          <span className="text-[12px] text-text-primary font-medium text-right max-w-[140px]">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => router.push("/agents/voice/va-1")}
                      className="w-full inline-flex items-center justify-center gap-2 h-10 mt-5 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
                    >
                      <Check size={15} strokeWidth={2} />
                      Create Agent
                    </button>
                  </div>

                  <div className="mt-3">
                    <button onClick={goBack} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150">
                      <ArrowLeft size={13} strokeWidth={1.5} /> Back to Industry
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
