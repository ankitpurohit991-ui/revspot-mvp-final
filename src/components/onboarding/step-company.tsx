"use client";

import { useState } from "react";
import { ArrowRight, Upload, X } from "lucide-react";
import { industries } from "@/lib/wizard-data";

interface StepCompanyProps {
  onNext: (data: {
    companyName: string;
    industry: string;
    logoFile?: string;
    userName: string;
  }) => void;
}

export function StepCompany({ onNext }: StepCompanyProps) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoFile, setLogoFile] = useState("");
  const [userName, setUserName] = useState("");

  const canContinue = companyName.trim() && industry && userName.trim();

  return (
    <div className="max-w-[560px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-[24px] font-semibold text-text-primary mb-2">
          Welcome to Revspot
        </h2>
        <p className="text-[14px] text-text-secondary">
          Let&apos;s set up your organization. This is a one-time setup.
        </p>
      </div>

      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        {/* Company Name */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Company Name <span className="text-status-error">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., Godrej Properties"
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Industry <span className="text-status-error">*</span>
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="">Select industry...</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Company Logo{" "}
            <span className="text-text-tertiary font-normal">(optional)</span>
          </label>
          {logoFile ? (
            <div className="flex items-center justify-between bg-surface-page rounded-[6px] px-3 py-2">
              <span className="text-[12px] text-text-primary">{logoFile}</span>
              <button
                onClick={() => setLogoFile("")}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setLogoFile("company_logo.png")}
              className="border-2 border-dashed border-border rounded-input p-4 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150"
            >
              <Upload
                size={16}
                strokeWidth={1.5}
                className="mx-auto text-text-tertiary mb-1"
              />
              <p className="text-[12px] text-text-secondary">
                Click to upload PNG, JPG, or SVG
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border-subtle pt-5" />

        {/* User Name */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Your Name <span className="text-status-error">*</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g., Ankit Purohit"
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={() =>
            onNext({
              companyName: companyName.trim(),
              industry,
              logoFile: logoFile || undefined,
              userName: userName.trim(),
            })
          }
          disabled={!canContinue}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40"
        >
          Continue <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
