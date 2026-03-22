"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { MessageCircle, UserPlus, CheckSquare, HelpCircle, Bell } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function WhatsAppAgentsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} className="mb-6">
        <div className="text-meta text-text-secondary mb-1">Agents</div>
        <h1 className="text-page-title text-text-primary">WhatsApp Agents</h1>
      </motion.div>

      {/* Hero */}
      <motion.div variants={fadeUp} className="bg-white border border-border rounded-card p-10 text-center mb-6">
        <div className="w-16 h-16 rounded-[16px] bg-surface-secondary flex items-center justify-center mx-auto mb-5">
          <MessageCircle size={28} strokeWidth={1.5} className="text-text-tertiary" />
        </div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-2">Coming Soon</h2>
        <p className="text-[14px] text-text-secondary max-w-[480px] mx-auto leading-relaxed mb-6">
          WhatsApp agents will let you automate lead capture, qualification, and FAQ responses via WhatsApp. Get notified when it launches.
        </p>

        {!submitted ? (
          <div className="flex items-center gap-2 max-w-[360px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
            />
            <button
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-1.5 h-10 px-5 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 shrink-0"
            >
              <Bell size={14} strokeWidth={1.5} />
              Notify me
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 h-10 px-5 bg-[#F0FDF4] text-[#15803D] text-[13px] font-medium rounded-button">
            <CheckSquare size={14} strokeWidth={2} />
            We&apos;ll notify you when WhatsApp agents launch!
          </div>
        )}
      </motion.div>

      {/* Feature Preview Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {[
          {
            icon: UserPlus,
            title: "Lead Capture",
            description: "Auto-capture leads from WhatsApp conversations. Structured data extraction from free-form messages.",
          },
          {
            icon: CheckSquare,
            title: "Qualification",
            description: "Qualify leads via structured WhatsApp conversations. Budget, timeline, and intent scoring.",
          },
          {
            icon: HelpCircle,
            title: "FAQ Bot",
            description: "Answer product questions automatically, 24/7. Trained on your brochures and project details.",
          },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-white border border-border rounded-card p-5 hover:shadow-card-hover hover:-translate-y-px transition-all duration-150">
              <div className="w-9 h-9 rounded-[8px] bg-surface-secondary flex items-center justify-center mb-3">
                <Icon size={18} strokeWidth={1.5} className="text-text-secondary" />
              </div>
              <h3 className="text-[14px] font-semibold text-text-primary mb-1.5">{feature.title}</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
