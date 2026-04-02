"use client";

import { useState } from "react";
import { Upload, ArrowRight, X, FileText } from "lucide-react";
import { existingClients, cities, languages, qualityPreferences } from "@/lib/wizard-data";

interface Step1Props {
  onNext: () => void;
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

function SelectField({ label, options, placeholder, value, onChange, required }: {
  label: string; options: (string | { value: string; label: string })[]; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}{required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
        style={selectStyle}>
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const lbl = typeof opt === "string" ? opt : opt.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, required, type = "text", helper, prefix }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; helper?: string; prefix?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}{required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">{prefix}</span>
        )}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full h-10 ${prefix ? "pl-7" : "px-3"} pr-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary`} />
      </div>
      {helper && <p className="text-[11px] text-text-tertiary mt-1">{helper}</p>}
    </div>
  );
}

function TextAreaField({ label, placeholder, value, onChange, required, rows = 3 }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
        {label}{required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed" />
    </div>
  );
}

export function Step1CampaignInput({ onNext }: Step1Props) {
  const [project, setProject] = useState("");
  const [objective, setObjective] = useState("");
  const [offer, setOffer] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [city, setCity] = useState("Bangalore");
  const [targetVolume, setTargetVolume] = useState("");
  const [targetCPL, setTargetCPL] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budgetCeiling, setBudgetCeiling] = useState("");
  const [language, setLanguage] = useState("English");
  const [qualityPref, setQualityPref] = useState("balanced");

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFiles((prev) => [...prev, "Godrej_Air_Brochure.pdf"]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Campaign Input</h2>
        <p className="text-meta text-text-secondary mt-1">Provide campaign details and the AI will generate a complete strategy</p>
      </div>

      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        {/* 1. Project */}
        <SelectField label="Project" options={[...existingClients, { value: "__new__", label: "+ Create new project" }]}
          placeholder="Select a project..." value={project} onChange={setProject} required />

        {/* 2. Campaign Objective */}
        <TextAreaField label="Campaign Objective" placeholder="e.g., Generate 100 qualified leads for luxury 3BHK apartments in Whitefield, Bangalore"
          value={objective} onChange={setObjective} required rows={3} />

        {/* 3. Offer */}
        <TextField label="Offer" placeholder="e.g., Godrej Reflections Habitat, 3BHK Launch Offer"
          value={offer} onChange={setOffer} required />

        {/* 4. Upload Brochures */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Upload Brochures</label>
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}
            onClick={() => setFiles((prev) => [...prev, "Godrej_Air_Brochure.pdf"])}
            className="border-2 border-dashed border-border rounded-input p-6 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150">
            <Upload size={20} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-2" />
            <p className="text-[13px] text-text-secondary">Drag & drop files here, or <span className="text-accent font-medium">browse</span></p>
            <p className="text-[11px] text-text-tertiary mt-1">PDF, PPT, DOCX up to 25MB</p>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.5} className="text-text-tertiary" />
                    <span className="text-[12px] text-text-primary">{f}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, j) => j !== i)); }}
                    className="text-text-tertiary hover:text-text-primary transition-colors duration-150">
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Website URL */}
        <TextField label="Website URL" placeholder="https://www.assetz.in/mizumi" value={websiteUrl} onChange={setWebsiteUrl} />

        {/* 6. Business Details */}
        <TextAreaField label="Business Details" placeholder="Any additional context about the product, target audience, or competitive positioning..."
          value={businessDetails} onChange={setBusinessDetails} rows={3} />
      </div>

      {/* Targeting & Budget */}
      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        <h3 className="text-[14px] font-semibold text-text-primary">Targeting & Budget</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* 7. Primary City */}
          <SelectField label="Primary City" options={cities} placeholder="Select city..." value={city} onChange={setCity} />

          {/* 8. Target Lead Volume */}
          <TextField label="Target Lead Volume" placeholder="e.g., 200" value={targetVolume} onChange={setTargetVolume} type="number" />

          {/* 9. Target CPL */}
          <TextField label="Target CPL" placeholder="e.g., 1200" value={targetCPL} onChange={setTargetCPL} type="number" prefix="₹"
            helper="Your target cost per lead. We'll optimize toward this." />

          {/* 10. Timeline */}
          <TextField label="Timeline (days)" placeholder="e.g., 30" value={timeline} onChange={setTimeline} type="number" />

          {/* 11. Budget Ceiling */}
          <TextField label="Budget Ceiling" placeholder="e.g., 250000" value={budgetCeiling} onChange={setBudgetCeiling} type="number" prefix="₹" />

          {/* 12. Language */}
          <SelectField label="Language" options={languages} placeholder="Select language..." value={language} onChange={setLanguage} />
        </div>

        {/* 13. Lead Quality Preference */}
        <SelectField label="Lead Quality Preference" options={qualityPreferences} placeholder="Select preference..."
          value={qualityPref} onChange={setQualityPref} />
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-2">
        <button onClick={onNext}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          Create & Extract Profile <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
