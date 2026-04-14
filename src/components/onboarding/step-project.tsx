"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, X, Lightbulb } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ImportedCampaign {
  id: string;
  name: string;
  status: string;
  spend: string;
  leads: number;
}

interface ProjectDraft {
  name: string;
  campaignIds: Set<string>;
}

interface StepProjectProps {
  importedCampaigns: ImportedCampaign[];
  onNext: (data: { projects: { name: string; campaignIds: string[] }[] }) => void;
  onBack: () => void;
}

const PROJECT_CONTEXT: Record<string, { term: string; example: string; description: string }> = {
  "Real Estate": {
    term: "property",
    example: "Godrej Air Phase 3",
    description: "Each project represents a property or development. All campaigns, leads, and voice agents for that property live under one roof.",
  },
  "EdTech": {
    term: "program",
    example: "Data Science Bootcamp 2026",
    description: "Each project represents a program or course. All campaigns, leads, and outreach for that program live under one roof.",
  },
  "E-commerce": {
    term: "product line",
    example: "Summer Collection 2026",
    description: "Each project represents a product line or collection. All campaigns, leads, and outreach for that line live under one roof.",
  },
};

const DEFAULT_CONTEXT = {
  term: "product",
  example: "Product Launch Q2",
  description: "Each project represents a product or offering. All campaigns, leads, and outreach for that product live under one roof.",
};

export function StepProject({ importedCampaigns, onNext, onBack }: StepProjectProps) {
  const companyProfile = useAppStore((s) => s.companyProfile);
  const industry = companyProfile?.industry ?? "";
  const ctx = PROJECT_CONTEXT[industry] ?? DEFAULT_CONTEXT;

  const [projects, setProjects] = useState<ProjectDraft[]>([
    { name: "", campaignIds: new Set(importedCampaigns.map((c) => c.id)) },
  ]);

  const hasCampaigns = importedCampaigns.length > 0;
  const canContinue = projects.some((p) => p.name.trim());

  const updateProjectName = (idx: number, name: string) => {
    setProjects((prev) => prev.map((p, i) => (i === idx ? { ...p, name } : p)));
  };

  const toggleCampaign = (projectIdx: number, campaignId: string) => {
    setProjects((prev) =>
      prev.map((p, i) => {
        if (i !== projectIdx) return p;
        const next = new Set(p.campaignIds);
        if (next.has(campaignId)) next.delete(campaignId);
        else next.add(campaignId);
        return { ...p, campaignIds: next };
      })
    );
  };

  const addProject = () => {
    setProjects((prev) => [...prev, { name: "", campaignIds: new Set() }]);
  };

  const removeProject = (idx: number) => {
    if (projects.length <= 1) return;
    setProjects((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    const validProjects = projects
      .filter((p) => p.name.trim())
      .map((p) => ({ name: p.name.trim(), campaignIds: Array.from(p.campaignIds) }));
    onNext({ projects: validProjects.length > 0 ? validProjects : [{ name: "My Project", campaignIds: importedCampaigns.map((c) => c.id) }] });
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-semibold text-text-primary mb-2">
          Create your first project
        </h2>
        <p className="text-[14px] text-text-secondary">
          {hasCampaigns
            ? `Organize your imported campaigns into projects — one per ${ctx.term}.`
            : `A project groups everything for one ${ctx.term} in one place.`}
        </p>
      </div>

      {/* Explainer card */}
      <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-card px-4 py-3.5 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={14} strokeWidth={1.5} className="text-[#D97706]" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-primary mb-0.5">
            What&apos;s a project?
          </p>
          <p className="text-[12px] text-text-secondary leading-[1.5]">
            {ctx.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project, pIdx) => (
          <div
            key={pIdx}
            className="bg-white border border-border rounded-card p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                  Project Name <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProjectName(pIdx, e.target.value)}
                  placeholder={`e.g., ${ctx.example}`}
                  className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                />
              </div>
              {projects.length > 1 && (
                <button
                  onClick={() => removeProject(pIdx)}
                  className="mt-7 p-1.5 text-text-tertiary hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-button transition-colors"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Campaign assignment */}
            {hasCampaigns && (
              <div className="mt-4">
                <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-2">
                  Assign Campaigns
                </label>
                <div className="space-y-1.5">
                  {importedCampaigns.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-surface-page transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={project.campaignIds.has(c.id)}
                        onChange={() => toggleCampaign(pIdx, c.id)}
                        className="w-3.5 h-3.5 rounded border-border accent-accent cursor-pointer"
                      />
                      <span className="text-[12px] text-text-primary truncate">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-text-tertiary ml-auto shrink-0">
                        {c.status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add another project */}
        <button
          onClick={addProject}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add another project
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNext({ projects: [{ name: "Unassigned", campaignIds: importedCampaigns.map((c) => c.id) }] })}
            className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
          >
            I&apos;ll organize later &rarr;
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40"
          >
            Continue <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
