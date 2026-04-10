"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Upload, FileText, X } from "lucide-react";
import { cities, adAccounts } from "@/lib/wizard-data";

const allLocations = ["All India", ...cities, "Dubai", "Singapore", "San Francisco", "London", "New York"];

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

interface StepCampaignProps {
  projectName: string;
  adAccountName: string;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepCampaign({ projectName, adAccountName, onNext, onBack, onSkip }: StepCampaignProps) {
  const [objectiveType, setObjectiveType] = useState<"leads" | "verified_leads" | "qualified_leads">("leads");
  const [targetCount, setTargetCount] = useState("");
  const [campaignDays, setCampaignDays] = useState("");
  const [offer, setOffer] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [budgetCeiling, setBudgetCeiling] = useState("");
  const [adAccount, setAdAccount] = useState(adAccountName ? adAccounts[0]?.id || "" : "");

  const locationSuggestions = allLocations.filter(
    (l) => l.toLowerCase().includes(locationInput.toLowerCase()) && !selectedLocations.includes(l)
  );

  const addLocation = (loc: string) => {
    if (!selectedLocations.includes(loc)) {
      setSelectedLocations((prev) => [...prev, loc]);
    }
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== loc));
  };

  // CPL validation
  const cplInfo = (() => {
    const budget = Number(budgetCeiling);
    const leads = Number(targetCount);
    const days = Number(campaignDays);
    if (!budget || !leads || !days) return null;
    const impliedCPL = Math.round(budget / leads);
    const dailyBudget = Math.round(budget / days);
    const isUnrealistic = impliedCPL < 200;
    const isAggressive = impliedCPL < 500 || dailyBudget < 2000;
    const isRealistic = impliedCPL >= 500 && impliedCPL <= 2000;
    const status = isUnrealistic ? "unrealistic" : isAggressive ? "aggressive" : isRealistic ? "realistic" : "high";
    const config: Record<string, { label: string; desc: string; cls: string }> = {
      unrealistic: { label: "Unrealistic", desc: `Implied CPL of ₹${impliedCPL} is too low for this market.`, cls: "bg-[#FEF2F2] border-[#DC2626]/20 text-[#DC2626]" },
      aggressive: { label: "Aggressive", desc: `Implied CPL of ₹${impliedCPL} is ambitious. You may need to optimize aggressively.`, cls: "bg-[#FEF3C7] border-[#92400E]/20 text-[#92400E]" },
      realistic: { label: "Realistic", desc: `Implied CPL of ₹${impliedCPL} is achievable. Daily budget of ₹${dailyBudget.toLocaleString("en-IN")} looks good.`, cls: "bg-[#F0FDF4] border-[#15803D]/20 text-[#15803D]" },
      high: { label: "Comfortable", desc: `Implied CPL of ₹${impliedCPL} gives you room to optimize for quality.`, cls: "bg-[#F0FDF4] border-[#15803D]/20 text-[#15803D]" },
    };
    return config[status];
  })();

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-[24px] font-semibold text-text-primary mb-2">
          Launch your first campaign
        </h2>
        <p className="text-[14px] text-text-secondary">
          Provide campaign details and the AI will generate a complete strategy.
        </p>
      </div>

      {/* Campaign Details Card */}
      <div className="bg-white border border-border rounded-card p-6 space-y-5 mb-5">
        {/* Project (read-only or selectable) */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Project</label>
          <input type="text" value={projectName} readOnly
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-surface-page text-text-secondary cursor-not-allowed" />
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-3">
            Campaign Objective <span className="text-status-error">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Optimize for</label>
              <select value={objectiveType} onChange={(e) => setObjectiveType(e.target.value as typeof objectiveType)}
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer" style={selectStyle}>
                <option value="leads">Leads</option>
                <option value="verified_leads">Verified Leads</option>
                <option value="qualified_leads">AI Qualified Leads</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Target count <span className="text-status-error">*</span></label>
              <input type="number" value={targetCount} onChange={(e) => setTargetCount(e.target.value)} placeholder="e.g., 500"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary tabular-nums" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary mb-1">Duration (days) <span className="text-status-error">*</span></label>
              <input type="number" value={campaignDays} onChange={(e) => setCampaignDays(e.target.value)} placeholder="e.g., 30"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary tabular-nums" />
            </div>
          </div>
        </div>

        {/* Offer */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Offer</label>
          <input type="text" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g., Godrej Reflections Habitat, 3BHK Launch Offer"
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary" />
        </div>

        {/* Brochures */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Upload Brochures</label>
          <div onClick={() => setFiles((p) => [...p, "Brochure.pdf"])}
            className="border-2 border-dashed border-border rounded-input p-5 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all">
            <Upload size={18} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-1.5" />
            <p className="text-[12px] text-text-secondary">Drag & drop files here, or <span className="text-accent font-medium">browse</span></p>
            <p className="text-[10px] text-text-tertiary mt-0.5">PDF, PPT, DOCX up to 25MB</p>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText size={13} strokeWidth={1.5} className="text-text-tertiary" />
                    <span className="text-[12px] text-text-primary">{f}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFiles((p) => p.filter((_, j) => j !== i)); }}
                    className="text-text-tertiary hover:text-text-primary"><X size={12} strokeWidth={1.5} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Project Website</label>
          <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://godrejproperties.com/godrej-air"
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary" />
          <p className="text-[11px] text-text-tertiary mt-1">Used as context for AI to understand the project better</p>
        </div>

        {/* Business Details */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Business Details</label>
          <textarea value={businessDetails} onChange={(e) => setBusinessDetails(e.target.value)} rows={3}
            placeholder="Any additional context about the product, target audience, or competitive positioning..."
            className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary resize-none" />
        </div>
      </div>

      {/* Targeting & Budget Card */}
      <div className="bg-white border border-border rounded-card p-6 space-y-5 mb-5">
        <h3 className="text-[14px] font-semibold text-text-primary">Targeting & Budget</h3>

        {/* Locations */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Target Locations</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selectedLocations.map((loc) => (
              <span key={loc} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-badge bg-accent text-white">
                {loc}
                <button onClick={() => removeLocation(loc)} className="hover:opacity-70"><X size={10} strokeWidth={2} /></button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && locationInput.trim()) { e.preventDefault(); addLocation(locationInput.trim()); } }}
              placeholder="Type a city, country, or region..."
              className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary" />
            {locationInput.length > 0 && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-[8px] shadow-lg z-10 max-h-[180px] overflow-y-auto">
                {locationSuggestions.slice(0, 6).map((loc) => (
                  <button key={loc} onClick={() => addLocation(loc)}
                    className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-surface-page first:rounded-t-[8px] last:rounded-b-[8px]">
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Budget</label>
          <div className="flex items-center gap-0">
            <span className="h-10 px-3 flex items-center text-[13px] text-text-secondary bg-surface-page border border-r-0 border-border rounded-l-input">₹</span>
            <input type="number" value={budgetCeiling} onChange={(e) => setBudgetCeiling(e.target.value)} placeholder="e.g., 250000"
              className="flex-1 h-10 px-3 text-[13px] border border-border rounded-r-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary tabular-nums" />
          </div>
          {cplInfo && (
            <div className={`mt-2 flex items-start gap-2 px-3 py-2 rounded-[6px] border text-[11px] leading-relaxed ${cplInfo.cls}`}>
              <span className="font-semibold shrink-0">{cplInfo.label}:</span>
              <span>{cplInfo.desc}</span>
            </div>
          )}
        </div>

        {/* Ad Account */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">Ad Account <span className="text-status-error">*</span></label>
          <select value={adAccount} onChange={(e) => setAdAccount(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer" style={selectStyle}>
            <option value="">Select ad account...</option>
            {adAccounts.map((acc) => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={15} strokeWidth={2} /> Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={onSkip}
            className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors">
            I&apos;ll create a campaign later &rarr;
          </button>
          <button onClick={onNext}
            className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            Launch Campaign <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
