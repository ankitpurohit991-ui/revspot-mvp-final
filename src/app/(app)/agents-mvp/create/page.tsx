"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";
import {
  newVoiceOptions,
  languageOptions,
} from "@/lib/voice-agent-data";

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Shared inline helpers (same pattern as configuration-tab.tsx)       */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-border rounded-card p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
      {label}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Tab = "agent" | "configuration" | "knowledge" | "faqs";

interface KbFile {
  id: string;
  name: string;
  type: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CreateAgentPage() {
  const router = useRouter();

  /* ---- UI state ---- */
  const [activeTab, setActiveTab] = useState<Tab>("agent");
  const [isCreating, setIsCreating] = useState(false);

  /* ---- Agent tab ---- */
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [greetingTemplate, setGreetingTemplate] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");

  /* ---- Configuration tab ---- */
  const [llmProvider, setLlmProvider] = useState("Groq");
  const [llmModel, setLlmModel] = useState("GPT-OSS 120B");
  const [temperature, setTemperature] = useState(0.2);

  const [sttProvider, setSttProvider] = useState("Deepgram");
  const [sttModel, setSttModel] = useState("Nova 3");
  const [sttLanguage, setSttLanguage] = useState("Hindi (hi)");

  const [primaryLanguage, setPrimaryLanguage] = useState("English");
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([]);

  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [concurrency, setConcurrency] = useState(2);
  const [speakingSpeed, setSpeakingSpeed] = useState(1.0);

  /* ---- Knowledge Base tab ---- */
  const [files, setFiles] = useState<KbFile[]>([]);

  /* ---- FAQs tab ---- */
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  /* ---------------------------------------------------------------- */
  /*  Tab config                                                       */
  /* ---------------------------------------------------------------- */

  const tabs: { key: Tab; label: string }[] = [
    { key: "agent", label: "Agent" },
    { key: "configuration", label: "Configuration" },
    { key: "knowledge", label: "Knowledge Base" },
    { key: "faqs", label: "FAQs" },
  ];

  /* ---------------------------------------------------------------- */
  /*  FAQ helpers                                                       */
  /* ---------------------------------------------------------------- */

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const openAddFaq = () => {
    setEditingFaqId(null);
    setNewFaqQuestion("");
    setNewFaqAnswer("");
    setShowAddFaq(true);
  };

  const openEditFaq = (faq: FaqItem) => {
    setEditingFaqId(faq.id);
    setNewFaqQuestion(faq.question);
    setNewFaqAnswer(faq.answer);
    setShowAddFaq(true);
  };

  const cancelFaqForm = () => {
    setShowAddFaq(false);
    setEditingFaqId(null);
    setNewFaqQuestion("");
    setNewFaqAnswer("");
  };

  const saveFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    if (editingFaqId) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaqId
            ? { ...f, question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }
            : f
        )
      );
    } else {
      setFaqs((prev) => [
        ...prev,
        {
          id: `faq-${Date.now()}`,
          question: newFaqQuestion.trim(),
          answer: newFaqAnswer.trim(),
        },
      ]);
    }
    cancelFaqForm();
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  /* ---------------------------------------------------------------- */
  /*  KB helpers                                                       */
  /* ---------------------------------------------------------------- */

  const addStagedFile = () => {
    setFiles((prev) => [
      ...prev,
      { id: `file-${Date.now()}`, name: "Uploaded_File.pdf", type: "pdf" },
    ]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /* ---------------------------------------------------------------- */
  /*  Additional language toggle                                       */
  /* ---------------------------------------------------------------- */

  const toggleAdditionalLang = (lang: string) => {
    setAdditionalLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Create handler                                                   */
  /* ---------------------------------------------------------------- */

  const handleCreate = () => {
    if (!name.trim()) return;
    setIsCreating(true);
    setTimeout(() => {
      router.push("/agents-mvp");
    }, 2000);
  };

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="pb-24"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/agents-mvp")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">
          Tools &rsaquo; Agents MVP &rsaquo; Create Agent
        </span>
      </div>

      {/* Title */}
      <h1 className="text-page-title text-text-primary mb-5">Create Agent</h1>

      {/* Agent Name */}
      <div className="mb-6">
        <FieldLabel label="Agent Name *" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Godrej Air Lead Qualifier"
          className="w-full h-11 px-4 text-[15px] font-medium bg-white border border-border rounded-button text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              activeTab === tab.key
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="create-agent-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={{ duration: 0.15 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/*  Tab content                                                   */}
      {/* ============================================================ */}

      {/* --- Agent Tab --- */}
      {activeTab === "agent" && (
        <div className="grid grid-cols-5 gap-5">
          {/* Left 60% */}
          <div className="col-span-3">
            <SectionCard title="System Prompt">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter the system prompt for your agent..."
                className="w-full min-h-[280px] px-4 py-3 text-[13px] font-mono bg-surface-page border border-border rounded-button text-text-primary placeholder:text-text-tertiary resize-y"
              />
            </SectionCard>
          </div>

          {/* Right 40% */}
          <div className="col-span-2 space-y-5">
            {/* Greeting */}
            <SectionCard title="Greeting Message">
              <div>
                <FieldLabel label="Greeting Template" />
                <textarea
                  value={greetingTemplate}
                  onChange={(e) => setGreetingTemplate(e.target.value)}
                  placeholder="Good {{greeting_time}}, am I speaking with {{salutation}} {{customer_name}}?"
                  rows={3}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-border rounded-button text-text-primary placeholder:text-text-tertiary resize-none"
                />
                <p className="text-[11px] text-text-tertiary mt-1.5">
                  Use &#123;&#123;variable&#125;&#125; for dynamic values
                </p>
              </div>
            </SectionCard>

            {/* Voice */}
            <SectionCard title="Voice">
              <div>
                <FieldLabel label="Voice" />
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  <option value="">Select a voice...</option>
                  {newVoiceOptions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender})
                    </option>
                  ))}
                </select>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* --- Configuration Tab --- */}
      {activeTab === "configuration" && (
        <div className="space-y-5">
          {/* LLM Configuration */}
          <SectionCard title="LLM Configuration">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel label="Provider" />
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {["Groq", "OpenAI", "Anthropic"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Model" />
                <select
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {["GPT-OSS 120B", "GPT-4o", "GPT-4o-mini", "Claude 3.5 Sonnet"].map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <FieldLabel label="Temperature" />
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 accent-accent cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-accent tabular-nums w-8 text-right">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-text-tertiary">Precise</span>
                  <span className="text-[10px] text-text-tertiary">Creative</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* STT Configuration */}
          <SectionCard title="STT Configuration">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel label="Provider" />
                <select
                  value={sttProvider}
                  onChange={(e) => setSttProvider(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {["Deepgram", "Google", "AssemblyAI"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Model" />
                <select
                  value={sttModel}
                  onChange={(e) => setSttModel(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {["Nova 3", "Nova 2", "Whisper"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Language" />
                <select
                  value={sttLanguage}
                  onChange={(e) => setSttLanguage(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {["Hindi (hi)", "English (en)", "Multi"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Language Configuration */}
          <SectionCard title="Language Configuration">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Primary Language" />
                <select
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Additional Languages" />
                <div className="flex flex-wrap gap-1.5">
                  {languageOptions
                    .filter((l) => l !== primaryLanguage)
                    .map((lang) => (
                      <button
                        key={lang}
                        onClick={() => toggleAdditionalLang(lang)}
                        className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-badge transition-colors ${
                          additionalLanguages.includes(lang)
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Other Configuration */}
          <SectionCard title="Other Configuration">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel label="Timezone" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary appearance-none cursor-pointer"
                >
                  {[
                    "Asia/Kolkata (IST)",
                    "US/Eastern (EST)",
                    "Europe/London (GMT)",
                  ].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Concurrency" />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={concurrency}
                  onChange={(e) =>
                    setConcurrency(
                      Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary"
                />
              </div>
              <div>
                <FieldLabel label="Speaking Speed" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-secondary w-8">Slow</span>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={speakingSpeed}
                    onChange={(e) =>
                      setSpeakingSpeed(parseFloat(e.target.value))
                    }
                    className="flex-1 h-1.5 accent-accent cursor-pointer"
                  />
                  <span className="text-[11px] text-text-secondary w-8">Fast</span>
                  <span className="text-[13px] font-medium text-text-primary tabular-nums w-10 text-right">
                    {speakingSpeed.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* --- Knowledge Base Tab --- */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-[16px] font-semibold text-text-primary mb-1">
              Knowledge Base
            </h3>
            <p className="text-[13px] text-text-secondary">
              Upload files for your agent to learn from.
            </p>
          </div>

          {/* Upload area */}
          <button
            type="button"
            onClick={addStagedFile}
            className="w-full border-2 border-dashed border-border rounded-card p-8 flex flex-col items-center justify-center text-center hover:border-accent/40 transition-colors cursor-pointer bg-transparent"
          >
            <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center mb-3">
              <Upload size={18} strokeWidth={1.5} className="text-text-secondary" />
            </div>
            <p className="text-[13px] font-medium text-text-primary mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-[12px] text-text-secondary">
              PDF, DOC, DOCX, TXT, MD allowed
            </p>
          </button>

          {/* Staged files */}
          {files.length > 0 && (
            <div>
              <h4 className="text-[13px] font-semibold text-text-primary mb-3">
                Staged Files
              </h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 bg-white border border-border rounded-card px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-[6px] bg-surface-secondary flex items-center justify-center shrink-0">
                      <FileText
                        size={15}
                        strokeWidth={1.5}
                        className="text-text-secondary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Staged for upload
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-button text-text-tertiary hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      title="Remove"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- FAQs Tab --- */}
      {activeTab === "faqs" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">
                Frequently Asked Questions
              </h3>
              <p className="text-[13px] text-text-secondary">
                Add common questions and answers for your agent.
              </p>
            </div>
            <button
              onClick={openAddFaq}
              className="h-9 px-4 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              <Plus size={14} strokeWidth={1.5} />
              Add FAQ
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-border rounded-button text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          {/* Inline Add/Edit Form */}
          {showAddFaq && (
            <div className="bg-white border border-border rounded-card p-5 space-y-3">
              <h4 className="text-[13px] font-semibold text-text-primary">
                {editingFaqId ? "Edit FAQ" : "Add FAQ"}
              </h4>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="Enter the question..."
                  className="w-full h-9 px-3 text-[13px] bg-white border border-border rounded-button text-text-primary placeholder:text-text-tertiary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">
                  Answer
                </label>
                <textarea
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  rows={3}
                  className="w-full px-3 py-2 text-[13px] bg-white border border-border rounded-button text-text-primary placeholder:text-text-tertiary resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveFaq}
                  className="h-8 px-3.5 text-[12px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelFaqForm}
                  className="h-8 px-3.5 text-[12px] font-medium border border-border rounded-button bg-white text-text-secondary hover:bg-surface-page transition-colors inline-flex items-center gap-1"
                >
                  <X size={12} strokeWidth={1.5} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-border rounded-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3">
                    Question &amp; Answer
                  </th>
                  <th className="text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3 w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="text-center text-[13px] text-text-secondary py-10"
                    >
                      No FAQs added yet.
                    </td>
                  </tr>
                ) : (
                  filteredFaqs.map((faq) => (
                    <tr
                      key={faq.id}
                      className="border-b border-border last:border-b-0 hover:bg-surface-page/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-text-primary mb-0.5">
                          {faq.question}
                        </p>
                        <p className="text-[12px] text-text-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditFaq(faq)}
                            className="p-1.5 rounded-button text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => deleteFaq(faq.id)}
                            className="p-1.5 rounded-button text-text-tertiary hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Sticky Footer                                                */}
      {/* ============================================================ */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 flex items-center justify-end gap-3 z-30">
        <button
          onClick={() => router.push("/agents-mvp")}
          className="h-9 px-5 text-[13px] font-medium border border-border rounded-button bg-white text-text-primary hover:bg-surface-page transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={isCreating || !name.trim()}
          className="h-9 px-5 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {isCreating ? (
            <>
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
              Creating Agent...
            </>
          ) : (
            "Create Agent"
          )}
        </button>
      </div>
    </motion.div>
  );
}
