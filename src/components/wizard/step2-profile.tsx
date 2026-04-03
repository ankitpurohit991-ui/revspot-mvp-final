"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Pencil,
  Sparkles,
  Send,
  X,
  MessageCircle,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractedProfile, strategyData } from "@/lib/wizard-data";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

interface Persona {
  id: string;
  name: string;
  age: number;
  role: string;
  bullets: string[];
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function Step2BusinessProfile({ onNext, onBack }: Step2Props) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setPersonas(strategyData.personas as Persona[]);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const openEditor = (personaId: string) => {
    const p = personas.find((x) => x.id === personaId);
    if (!p) return;
    setEditingPersona(personaId);
    setChatMessages([
      {
        role: "ai",
        text: `You're editing **${p.name}, ${p.age} (${p.role})**. Tell me what you'd like to change — e.g., "Make them younger", "Change the budget to ₹1.5Cr", "Add a bullet about wanting a home office".`,
      },
    ]);
    setChatInput("");
  };

  const closeEditor = () => {
    setEditingPersona(null);
    setChatMessages([]);
    setChatInput("");
  };

  const sendChat = () => {
    if (!chatInput.trim() || !editingPersona) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const p = personas.find((x) => x.id === editingPersona);
      if (!p) return;

      // Simulate a persona update based on common edit patterns
      const updated = { ...p };
      if (userMsg.toLowerCase().includes("younger")) {
        updated.age = Math.max(25, p.age - 5);
      }
      if (userMsg.toLowerCase().includes("older")) {
        updated.age = p.age + 5;
      }
      if (userMsg.toLowerCase().includes("home office") || userMsg.toLowerCase().includes("work from home")) {
        updated.bullets = [...p.bullets.slice(0, 2), "Needs a dedicated home office space for remote work — this is non-negotiable."];
      }

      setPersonas((prev) => prev.map((x) => (x.id === editingPersona ? updated : x)));
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Done! I've updated **${updated.name}**. Here's the revised persona:\n\n**${updated.name}, ${updated.age} (${updated.role})**\n${updated.bullets.map((b) => `• ${b}`).join("\n")}\n\nAnything else you'd like to change?`,
        },
      ]);
      setIsAiTyping(false);
    }, 1500);
  };

  const editingPersonaData = personas.find((x) => x.id === editingPersona);

  return (
    <div className="space-y-6">
      {/* Section 1: Business Profile Summary */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-semibold text-text-primary">Business Profile</h2>
          <button onClick={onBack}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150">
            <Pencil size={12} strokeWidth={1.5} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Project", value: extractedProfile.projectName },
            { label: "Builder", value: extractedProfile.builderName },
            { label: "City", value: extractedProfile.city },
            { label: "Category", value: extractedProfile.industry },
            { label: "Price Positioning", value: extractedProfile.pricePositioning },
          ].map((field) => (
            <div key={field.label}>
              <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">{field.label}</span>
              <span className="block text-[13px] text-text-primary font-medium">{field.value}</span>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">Offer Summary</span>
          <p className="text-[13px] text-text-secondary leading-relaxed">{extractedProfile.offerSummary}</p>
        </div>
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">Key Benefits</span>
          <div className="flex flex-wrap gap-1.5">
            {extractedProfile.keyBenefits.map((benefit) => (
              <span key={benefit} className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-surface-page text-text-secondary border border-border">
                {benefit}
              </span>
            ))}
          </div>
        </div>
        {extractedProfile.specialAdCategory && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-badge bg-[#FEF3C7] text-[#92400E]">
            <AlertTriangle size={11} strokeWidth={2} />
            Special Category: {extractedProfile.specialAdCategory}
          </div>
        )}
      </div>

      {/* Section 2: AI Persona Generation */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
          <h3 className="text-[16px] font-semibold text-text-primary">AI-Generated Personas</h3>
          {isGenerating && <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />}
        </div>

        {isGenerating ? (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-card p-5">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-[13px] text-text-secondary">Generating personas based on your business profile...</span>
              </div>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white border border-border rounded-card p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-32 bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-4 w-20 bg-surface-secondary rounded-[8px] animate-pulse" />
                  </div>
                  <div className="h-3 w-2/3 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="space-y-2 pt-1">
                    <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-3 w-5/6 bg-surface-secondary rounded-[8px] animate-pulse" />
                    <div className="h-3 w-4/5 bg-surface-secondary rounded-[8px] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {personas.map((persona, i) => (
              <motion.div
                key={persona.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white border border-border rounded-card p-5 hover:shadow-card-hover transition-all duration-150"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Name + Age + Role */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="text-[14px] font-semibold text-text-primary">
                        {persona.name}, {persona.age}
                      </h4>
                      <span className="text-[12px] text-text-secondary">
                        ({persona.role})
                      </span>
                    </div>
                    {/* Bullet points */}
                    <ul className="mt-2.5 space-y-1.5">
                      {persona.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13px] text-text-secondary leading-relaxed">
                          <span className="text-text-tertiary mt-[3px] shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Edit button */}
                  <button
                    onClick={() => openEditor(persona.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-text-secondary hover:text-accent border border-border rounded-button hover:border-accent/30 transition-colors duration-150 shrink-0 ml-4"
                  >
                    <MessageCircle size={11} strokeWidth={1.5} />
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}

            <p className="text-[12px] text-text-tertiary mt-2">
              These personas will be used to generate ad sets, creatives, and targeting strategy. Click &quot;Edit&quot; on any persona to tweak it.
            </p>
          </div>
        )}
      </div>

      {/* Chat-based Persona Editor (Slide-over panel) */}
      <AnimatePresence>
        {editingPersona && editingPersonaData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20" onClick={closeEditor} />

            {/* Panel */}
            <motion.div
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-[420px] h-full bg-white border-l border-border flex flex-col shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <div className="text-[14px] font-semibold text-text-primary">
                    Edit Persona
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5">
                    {editingPersonaData.name}, {editingPersonaData.age}
                  </div>
                </div>
                <button onClick={closeEditor} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors">
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Current Persona Preview */}
              <div className="px-5 py-3 bg-surface-page border-b border-border-subtle">
                <div className="text-[12px] font-medium text-text-primary mb-1.5">
                  {editingPersonaData.name}, {editingPersonaData.age} ({editingPersonaData.role})
                </div>
                <ul className="space-y-1">
                  {editingPersonaData.bullets.map((b, j) => (
                    <li key={j} className="text-[11px] text-text-secondary leading-relaxed flex items-start gap-1.5">
                      <span className="text-text-tertiary mt-[1px]">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-[10px] text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-[4px]"
                        : "bg-surface-page text-text-primary border border-border-subtle rounded-bl-[4px]"
                    }`}>
                      {msg.text.split("\n").map((line, k) => (
                        <span key={k}>
                          {line.startsWith("**") && line.endsWith("**")
                            ? <strong>{line.replace(/\*\*/g, "")}</strong>
                            : line.startsWith("• ")
                              ? <span className="block ml-1">{line}</span>
                              : line
                          }
                          {k < msg.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-[10px] bg-surface-page border border-border-subtle rounded-bl-[4px]">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="px-4 py-3 border-t border-border bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                    placeholder="e.g., Make them younger, change budget..."
                    className="flex-1 h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || isAiTyping}
                    className="h-9 w-9 flex items-center justify-center bg-accent text-white rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button onClick={onNext} disabled={isGenerating}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
          Confirm & Generate Strategy <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
