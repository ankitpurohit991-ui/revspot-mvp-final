"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  highIntentFormFields,
  quickInquiryFormFields,
  type FormField,
} from "@/lib/wizard-data";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

type FormType = "high_intent" | "quick_inquiry" | "custom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

const formTypeOptions: {
  value: FormType;
  label: string;
  description: string;
}[] = [
  {
    value: "high_intent",
    label: "High Intent",
    description: "More questions, better lead quality",
  },
  {
    value: "quick_inquiry",
    label: "Quick Inquiry",
    description: "Fewer questions, higher volume",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Build your own form",
  },
];

function getPresetFields(type: FormType): FormField[] {
  switch (type) {
    case "high_intent":
      return highIntentFormFields.map((f) => ({ ...f }));
    case "quick_inquiry":
      return quickInquiryFormFields.map((f) => ({ ...f }));
    case "custom":
      return [];
  }
}

export function Step4Forms({ onNext, onBack }: Step4Props) {
  const [formType, setFormType] = useState<FormType>("high_intent");
  const [fields, setFields] = useState<FormField[]>(
    getPresetFields("high_intent")
  );
  const [formHeadline, setFormHeadline] = useState("Get details about Godrej Air");
  const [formGreeting, setFormGreeting] = useState(
    "Fill this form to get a callback from our team"
  );
  const [submitText, setSubmitText] = useState("Get Details");

  const handleFormTypeChange = (type: FormType) => {
    setFormType(type);
    setFields(getPresetFields(type));
  };

  const toggleFieldEnabled = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const toggleFieldRequired = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, required: !f.required } : f))
    );
  };

  const addCustomField = () => {
    const newField: FormField = {
      id: `custom-${Date.now()}`,
      name: "Custom Question",
      type: "custom",
      required: false,
      enabled: true,
      placeholder: "Enter your answer",
    };
    setFields((prev) => [...prev, newField]);
  };

  const deleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  const updateFieldName = (fieldId: string, name: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, name } : f))
    );
  };

  const enabledFields = fields.filter((f) => f.enabled);

  const typeBadgeColor = (type: FormField["type"]) => {
    switch (type) {
      case "text":
        return "bg-blue-50 text-blue-700";
      case "phone":
        return "bg-green-50 text-green-700";
      case "email":
        return "bg-purple-50 text-purple-700";
      case "dropdown":
        return "bg-amber-50 text-amber-700";
      case "custom":
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Left Column — Form Builder (60%) */}
        <div className="w-[60%] space-y-5">
          {/* Form Type Selector */}
          <div className="bg-white border border-border rounded-card p-6">
            <h2 className="text-[20px] font-semibold text-text-primary mb-4">
              Form Type
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {formTypeOptions.map((option, i) => (
                <motion.button
                  key={option.value}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  type="button"
                  onClick={() => handleFormTypeChange(option.value)}
                  className={`text-left p-4 rounded-card border transition-colors duration-150 ${
                    formType === option.value
                      ? "border-accent bg-accent/5"
                      : "border-border bg-white hover:bg-surface-page"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        formType === option.value
                          ? "border-accent"
                          : "border-border"
                      }`}
                    >
                      {formType === option.value && (
                        <div className="h-2 w-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <span className="text-[13px] font-semibold text-text-primary">
                      {option.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-tertiary pl-6">
                    {option.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="bg-white border border-border rounded-card p-6">
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">
              Form Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                  Form Headline
                </label>
                <input
                  type="text"
                  value={formHeadline}
                  onChange={(e) => setFormHeadline(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                  Greeting
                </label>
                <input
                  type="text"
                  value={formGreeting}
                  onChange={(e) => setFormGreeting(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={submitText}
                  onChange={(e) => setSubmitText(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                />
              </div>
            </div>
          </div>

          {/* Fields List */}
          <div className="bg-white border border-border rounded-card p-6">
            <h3 className="text-[16px] font-semibold text-text-primary mb-4">
              Form Fields
            </h3>
            {fields.length === 0 ? (
              <p className="text-[13px] text-text-tertiary py-4 text-center">
                No fields yet. Add a custom question below.
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <motion.div
                    key={field.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex items-center gap-3 p-3 rounded-card border border-border-subtle bg-surface-page"
                  >
                    {/* Enabled checkbox */}
                    <label className="flex items-center shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={() => toggleFieldEnabled(field.id)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
                      />
                    </label>

                    {/* Field name */}
                    <div className="flex-1 min-w-0">
                      {field.type === "custom" ? (
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            updateFieldName(field.id, e.target.value)
                          }
                          className="w-full h-7 px-2 text-[13px] font-medium border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                        />
                      ) : (
                        <span className="text-[13px] font-medium text-text-primary">
                          {field.name}
                        </span>
                      )}
                    </div>

                    {/* Type badge */}
                    <span
                      className={`shrink-0 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-badge ${typeBadgeColor(field.type)}`}
                    >
                      {field.type}
                    </span>

                    {/* Required toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFieldRequired(field.id)}
                      className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ${
                        field.required ? "bg-accent" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-150 ${
                          field.required ? "translate-x-[18px]" : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                    <span className="text-[10px] text-text-tertiary shrink-0 w-14">
                      {field.required ? "Required" : "Optional"}
                    </span>

                    {/* Delete (custom only) */}
                    {field.type === "custom" ? (
                      <button
                        type="button"
                        onClick={() => deleteField(field.id)}
                        className="shrink-0 p-1 text-text-tertiary hover:text-red-500 transition-colors duration-150"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    ) : (
                      <div className="w-6 shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addCustomField}
              className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 text-[12px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors duration-150"
            >
              <Plus size={13} strokeWidth={1.5} />
              Add Custom Question
            </button>
          </div>
        </div>

        {/* Right Column — Live Preview (40%) */}
        <div className="w-[40%]">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={16} strokeWidth={1.5} className="text-accent" />
              <h3 className="text-[16px] font-semibold text-text-primary">
                Live Preview
              </h3>
            </div>

            {/* Phone Frame */}
            <div className="flex justify-center">
              <div className="w-[280px] rounded-[32px] border-[8px] border-[#1A1A1A] bg-white overflow-hidden shadow-lg">
                {/* Notch */}
                <div className="flex justify-center pt-2 pb-1 bg-white">
                  <div className="h-[6px] w-[80px] rounded-full bg-[#1A1A1A]" />
                </div>

                {/* Form Content */}
                <div className="px-4 pb-5 pt-3 space-y-3 max-h-[480px] overflow-y-auto">
                  <h4 className="text-[14px] font-semibold text-text-primary leading-snug">
                    {formHeadline || "Form Headline"}
                  </h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {formGreeting || "Greeting text"}
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {enabledFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] font-medium text-text-tertiary mb-1">
                          {field.name}
                          {field.required && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </label>
                        {field.type === "dropdown" ? (
                          <div className="w-full h-7 px-2 text-[11px] border border-gray-200 rounded-[6px] bg-gray-50 text-text-tertiary flex items-center justify-between">
                            <span>Select...</span>
                            <span className="text-[9px]">&#9662;</span>
                          </div>
                        ) : (
                          <div className="w-full h-7 px-2 text-[11px] border border-gray-200 rounded-[6px] bg-gray-50 text-text-tertiary flex items-center">
                            {field.placeholder || `Enter ${field.name.toLowerCase()}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {enabledFields.length > 0 && (
                    <button
                      type="button"
                      className="w-full h-8 bg-accent text-white text-[12px] font-medium rounded-[8px] mt-2"
                    >
                      {submitText || "Submit"}
                    </button>
                  )}
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2 bg-white">
                  <div className="h-[4px] w-[100px] rounded-full bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          Continue to Campaign Structure <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
