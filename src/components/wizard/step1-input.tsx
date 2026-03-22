"use client";

import { useState } from "react";
import {
  Upload,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X,
  FileText,
} from "lucide-react";
import { existingClients, industries, cities, languages, qualityPreferences } from "@/lib/wizard-data";

interface Step1Props {
  onNext: () => void;
}

function SelectField({
  label,
  options,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  options: string[] | { value: string; label: string }[];
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}
        {required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}
        {required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
      />
    </div>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  required,
  rows = 3,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}
        {required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed"
      />
    </div>
  );
}

export function Step1CampaignInput({ onNext }: Step1Props) {
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("Real Estate");
  const [objective, setObjective] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedCity, setAdvancedCity] = useState("Bangalore");
  const [offerName, setOfferName] = useState("");
  const [targetVolume, setTargetVolume] = useState("");
  const [timeline, setTimeline] = useState("");
  const [language, setLanguage] = useState("English");
  const [budgetCeiling, setBudgetCeiling] = useState("");
  const [qualityPref, setQualityPref] = useState("balanced");

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Mock file upload
    setFiles((prev) => [...prev, "Assetz_Mizumi_Brochure.pdf"]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Campaign Input</h2>
        <p className="text-meta text-text-secondary mt-1">
          Provide campaign details and the AI will generate a complete strategy
        </p>
      </div>

      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Client"
            options={existingClients}
            placeholder="Select a client..."
            value={client}
            onChange={setClient}
            required
          />
          <SelectField
            label="Industry"
            options={industries}
            placeholder="Select industry..."
            value={industry}
            onChange={setIndustry}
            required
          />
        </div>

        <TextAreaField
          label="Campaign Objective"
          placeholder="e.g., Generate 100 qualified leads for luxury 3BHK apartments in Whitefield, Bangalore"
          value={objective}
          onChange={setObjective}
          required
          rows={3}
        />

        {/* File Upload */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Upload Brochures
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => setFiles((prev) => [...prev, "Assetz_Mizumi_Brochure.pdf"])}
            className="border-2 border-dashed border-border rounded-input p-6 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150"
          >
            <Upload size={20} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-[13px] text-text-secondary">
              Drag & drop files here, or <span className="text-accent font-medium">browse</span>
            </p>
            <p className="text-[11px] text-text-tertiary mt-1">PDF, PPT, DOCX up to 25MB</p>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.5} className="text-text-tertiary" />
                    <span className="text-[12px] text-text-primary">{f}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prev) => prev.filter((_, j) => j !== i));
                    }}
                    className="text-text-tertiary hover:text-text-primary transition-colors duration-150"
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <TextField
          label="Website URL"
          placeholder="https://www.assetz.in/mizumi"
          value={websiteUrl}
          onChange={setWebsiteUrl}
        />

        <TextAreaField
          label="Business Details"
          placeholder="Any additional context about the product, target audience, or competitive positioning..."
          value={businessDetails}
          onChange={setBusinessDetails}
          rows={3}
        />
      </div>

      {/* Advanced Options */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-6 py-4 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronDown size={15} strokeWidth={1.5} />
          ) : (
            <ChevronRight size={15} strokeWidth={1.5} />
          )}
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 pt-0 space-y-4 border-t border-border-subtle">
            <div className="pt-4 grid grid-cols-2 gap-4">
              <SelectField
                label="Primary City"
                options={cities}
                placeholder="Select city..."
                value={advancedCity}
                onChange={setAdvancedCity}
              />
              <TextField
                label="Offer / Product Name"
                placeholder="e.g., Assetz Mizumi Phase 3"
                value={offerName}
                onChange={setOfferName}
              />
              <TextField
                label="Target Lead Volume"
                placeholder="e.g., 200"
                value={targetVolume}
                onChange={setTargetVolume}
                type="number"
              />
              <TextField
                label="Timeline (days)"
                placeholder="e.g., 30"
                value={timeline}
                onChange={setTimeline}
                type="number"
              />
              <SelectField
                label="Language"
                options={languages}
                placeholder="Select language..."
                value={language}
                onChange={setLanguage}
              />
              <TextField
                label="Budget Ceiling (₹)"
                placeholder="e.g., 250000"
                value={budgetCeiling}
                onChange={setBudgetCeiling}
                type="number"
              />
            </div>
            <SelectField
              label="Lead Quality Preference"
              options={qualityPreferences}
              placeholder="Select preference..."
              value={qualityPref}
              onChange={setQualityPref}
            />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          Create & Extract Profile
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
