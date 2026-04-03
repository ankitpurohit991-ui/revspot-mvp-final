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
  Plus,
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
  const [chatOpen, setChatOpen] = useState(false);
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

  const openChat = () => {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: "ai",
          text: `You have ${personas.length} personas. You can add, remove, or modify any of them.\n\nTry:\n• "Add a persona for first-time homebuyers"\n• "Remove Suresh"\n• "Make Meera younger"\n• "Focus more on investment buyers"`,
        },
      ]);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setChatInput("");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let responseText = "";

      if (lower.includes("add") || lower.includes("new persona")) {
        const newPersona: Persona = {
          id: `p-${Date.now()}`,
          name: "Priya",
          age: 29,
          role: "First-Time Homebuyer, Recently Married",
          bullets: [
            "Just married and looking for their first own home — currently living with parents.",
            "Budget-conscious but wants a reputed builder for peace of mind.",
            "Prefers 2BHK with option to upgrade later — close to metro and shopping.",
          ],
        };
        setPersonas((prev) => [...prev, newPersona]);
        responseText = `Added a new persona:\n\n**${newPersona.name}, ${newPersona.age} (${newPersona.role})**\n${newPersona.bullets.map((b) => `• ${b}`).join("\n")}\n\nAnything else?`;
      } else if (lower.includes("remove")) {
        const nameToRemove = personas.find((p) => lower.includes(p.name.toLowerCase()));
        if (nameToRemove) {
          setPersonas((prev) => prev.filter((p) => p.id !== nameToRemove.id));
          responseText = `Removed **${nameToRemove.name}** from the personas. You now have ${personas.length - 1} personas.\n\nAnything else?`;
        } else {
          responseText = `I couldn't find that persona. Current personas: ${personas.map((p) => p.name).join(", ")}. Which one would you like to remove?`;
        }
      } else {
        // Generic edit — simulate an update to the first matching persona
        const matchedPersona = personas.find((p) => lower.includes(p.name.toLowerCase()));
        if (matchedPersona) {
          const updated = { ...matchedPersona };
          if (lower.includes("younger")) updated.age = Math.max(22, updated.age - 5);
          if (lower.includes("older")) updated.age = updated.age + 5;
          if (lower.includes("budget") && lower.includes("lower")) {
            updated.bullets = updated.bullets.map((b) =>
              b.includes("budget") || b.includes("Budget") || b.includes("₹")
                ? b.replace(/₹[\d.]+Cr/g, "₹1.2Cr")
                : b
            );
          }
          setPersonas((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          responseText = `Updated **${updated.name}**:\n\n**${updated.name}, ${updated.age} (${updated.role})**\n${updated.bullets.map((b) => `• ${b}`).join("\n")}\n\nAnything else?`;
        } else {
          responseText = `I'll adjust the personas based on your feedback. Could you be more specific? Current personas: ${personas.map((p) => `${p.name} (${p.age})`).join(", ")}.`;
        }
      }

      setChatMessages((prev) => [...prev, { role: "ai", text: responseText }]);
      setIsAiTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Campaign Brief */}
      <div className="bg-white border border-border rounded-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px] font-semibold text-text-primary">Campaign Brief</h2>
          <button onClick={onBack}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150">
            <Pencil size={12} strokeWidth={1.5} /> Edit
          </button>
        </div>

        {/* Target Numbers — highlighted */}
        <div className="bg-accent/5 border border-accent/20 rounded-[8px] p-4 mb-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="block text-[22px] font-bold text-text-primary">500</span>
              <span className="block text-[11px] text-text-secondary mt-0.5">Target Leads</span>
            </div>
            <div className="text-center">
              <span className="block text-[22px] font-bold text-text-primary">30</span>
              <span className="block text-[11px] text-text-secondary mt-0.5">Days</span>
            </div>
            <div className="text-center">
              <span className="block text-[22px] font-bold text-accent">₹2.5L</span>
              <span className="block text-[11px] text-text-secondary mt-0.5">Budget</span>
            </div>
          </div>
        </div>

        {/* Project + Campaign Details */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Project", value: extractedProfile.projectName },
            { label: "Brand", value: extractedProfile.builderName },
            { label: "Location", value: `${extractedProfile.city} — ${extractedProfile.geography}` },
            { label: "Price Range", value: extractedProfile.pricePositioning },
            { label: "Objective", value: "Lead Generation" },
            { label: "Languages", value: "English, Hindi, Kannada" },
          ].map((field) => (
            <div key={field.label}>
              <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">{field.label}</span>
              <span className="block text-[13px] text-text-primary font-medium">{field.value}</span>
            </div>
          ))}
        </div>

        {/* Offer Summary */}
        <div className="mb-4">
          <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">Offer Summary</span>
          <p className="text-[13px] text-text-secondary leading-relaxed">{extractedProfile.offerSummary}</p>
        </div>

        {/* Key Benefits */}
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

        {/* Special Ad Category */}
        {extractedProfile.specialAdCategory && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-badge bg-[#FEF3C7] text-[#92400E]">
            <AlertTriangle size={11} strokeWidth={2} />
            Special Category: {extractedProfile.specialAdCategory}
          </div>
        )}
      </div>

      {/* Section 2: AI Persona Generation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
            <h3 className="text-[16px] font-semibold text-text-primary">AI-Generated Personas</h3>
            {isGenerating && <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />}
          </div>
          {!isGenerating && (
            <button onClick={openChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors duration-150">
              <MessageCircle size={13} strokeWidth={1.5} />
              Edit Personas
            </button>
          )}
        </div>

        {isGenerating ? (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-card p-5">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-[13px] text-text-secondary">Generating personas based on your business profile...</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white border border-border rounded-card p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
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
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {personas.map((persona, i) => (
                <motion.div
                  key={persona.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="bg-white border border-border rounded-card p-5"
                >
                  <h4 className="text-[14px] font-semibold text-text-primary mb-0.5">
                    {persona.name}, {persona.age}
                  </h4>
                  <p className="text-[11px] text-text-tertiary mb-3">
                    {persona.role}
                  </p>
                  <ul className="space-y-2">
                    {persona.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px] text-text-secondary leading-relaxed">
                        <span className="text-text-tertiary mt-[3px] shrink-0">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <p className="text-[12px] text-text-tertiary">
              These personas will be used to generate ad sets, creatives, and targeting strategy.
            </p>
          </div>
        )}
      </div>

      {/* Global Chat Editor (Slide-over panel) */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            <div className="absolute inset-0 bg-black/20" onClick={closeChat} />

            <motion.div
              initial={{ x: 440 }}
              animate={{ x: 0 }}
              exit={{ x: 440 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-[440px] h-full bg-white border-l border-border flex flex-col shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <div className="text-[14px] font-semibold text-text-primary">Edit Personas</div>
                  <div className="text-[12px] text-text-secondary mt-0.5">{personas.length} personas defined</div>
                </div>
                <button onClick={closeChat} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors">
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Current Personas Preview */}
              <div className="px-5 py-3 bg-surface-page border-b border-border-subtle max-h-[200px] overflow-y-auto">
                <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">Current Personas</div>
                <div className="space-y-2">
                  {personas.map((p) => (
                    <div key={p.id} className="text-[11px]">
                      <span className="font-medium text-text-primary">{p.name}, {p.age}</span>
                      <span className="text-text-tertiary"> — {p.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-[10px] text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-[4px]"
                        : "bg-surface-page text-text-primary border border-border-subtle rounded-bl-[4px]"
                    }`}>
                      {msg.text}
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
                    placeholder='e.g., "Add a first-time homebuyer persona"'
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
