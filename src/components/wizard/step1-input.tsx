"use client";

import { useState } from "react";
import { Upload, ArrowRight, X, FileText } from "lucide-react";
import { existingClients, cities, languages } from "@/lib/wizard-data";

interface Step1Props {
  onNext: () => void;
}

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

const projectCategories = [
  "Real Estate",
  "EdTech",
  "FinTech",
  "Healthcare",
  "SaaS",
  "E-commerce",
  "Other",
];


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
  const [isNewProject, setIsNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const [objectiveType, setObjectiveType] = useState<"leads" | "verified_leads" | "qualified_leads">("leads");
  const [targetCount, setTargetCount] = useState("");
  const [campaignDays, setCampaignDays] = useState("");

  const [offer, setOffer] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [city, setCity] = useState("Bangalore");
  const [budgetCeiling, setBudgetCeiling] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);

  const handleProjectChange = (v: string) => {
    if (v === "__new__") {
      setProject("");
      setIsNewProject(true);
    } else {
      setProject(v);
      setIsNewProject(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

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
        <div>
          <SelectField label="Project" options={[...existingClients, { value: "__new__", label: "+ Create new project" }]}
            placeholder="Select a project..." value={isNewProject ? "" : project} onChange={handleProjectChange} required />

          {isNewProject && (
            <div className="mt-3 ml-2 bg-surface-page border border-border-subtle rounded-[8px] p-4 space-y-4">
              <TextField label="Project Name" placeholder="e.g., Godrej Air Launch"
                value={newProjectName} onChange={setNewProjectName} required />
              <TextField label="Client Name" placeholder="e.g., Godrej Properties"
                value={newProjectClient} onChange={setNewProjectClient} />
              <SelectField label="Category" options={projectCategories}
                placeholder="Select category..." value={newProjectCategory} onChange={setNewProjectCategory} />
              <TextAreaField label="Description" placeholder="Brief project description (optional)"
                value={newProjectDescription} onChange={setNewProjectDescription} rows={2} />
            </div>
          )}
        </div>

        {/* 2. Campaign Objective */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-3">
            Campaign Objective<span className="text-status-error ml-0.5">*</span>
          </label>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[12px] text-text-secondary mb-1">Optimize for</label>
              <div className="flex gap-2">
                {([
                  { value: "leads" as const, label: "Leads" },
                  { value: "verified_leads" as const, label: "Verified Leads" },
                  { value: "qualified_leads" as const, label: "Qualified Leads" },
                ]).map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setObjectiveType(opt.value)}
                    className={`px-3 py-2 text-[12px] font-medium rounded-[6px] border transition-colors duration-150 ${
                      objectiveType === opt.value
                        ? "border-accent bg-accent text-white"
                        : "border-border bg-white text-text-secondary hover:border-border-hover hover:text-text-primary"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-[140px]">
              <label className="block text-[12px] text-text-secondary mb-1">Target count</label>
              <input type="number" value={targetCount} onChange={(e) => setTargetCount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary tabular-nums" />
            </div>
            <div className="w-[140px]">
              <label className="block text-[12px] text-text-secondary mb-1">Duration (days)</label>
              <input type="number" value={campaignDays} onChange={(e) => setCampaignDays(e.target.value)}
                placeholder="e.g., 30"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary tabular-nums" />
            </div>
          </div>
        </div>

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

          {/* 8. Budget Ceiling */}
          <TextField label="Budget Ceiling" placeholder="e.g., 250000" value={budgetCeiling} onChange={setBudgetCeiling} type="number" prefix="₹" />
        </div>

        {/* 9. Targeted Language(s) */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Targeted Language(s)</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-badge transition-colors ${
                  selectedLanguages.includes(lang)
                    ? "bg-accent text-white"
                    : "bg-surface-secondary text-text-secondary"
                }`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-2">
        <button onClick={onNext}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          Continue to Personas <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
