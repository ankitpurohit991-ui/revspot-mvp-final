"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Rocket, AlertCircle } from "lucide-react";
import { adAccounts, facebookPages } from "@/lib/wizard-data";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step4Launch({ onNext, onBack }: Step4Props) {
  const [adAccount, setAdAccount] = useState("");
  const [fbPage, setFbPage] = useState("");
  const [launching, setLaunching] = useState(false);

  const canLaunch = adAccount && fbPage;

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      onNext();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-text-primary">Launch Campaign</h2>
        <p className="text-meta text-text-secondary mt-1">
          Connect your Meta ad account and page to create the campaign
        </p>
      </div>

      <div className="bg-white border border-border rounded-card p-6 space-y-5">
        {/* Ad Account */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Ad Account <span className="text-status-error">*</span>
          </label>
          <select
            value={adAccount}
            onChange={(e) => setAdAccount(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="">Select ad account...</option>
            {adAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Facebook Page */}
        <div>
          <label className="block text-[13px] font-medium text-text-primary mb-1.5">
            Facebook Page <span className="text-status-error">*</span>
          </label>
          <select
            value={fbPage}
            onChange={(e) => setFbPage(e.target.value)}
            className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="">Select Facebook page...</option>
            {facebookPages.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2.5 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-[6px] px-4 py-3">
          <AlertCircle size={14} strokeWidth={1.5} className="text-[#1D4ED8] mt-0.5 shrink-0" />
          <p className="text-[12px] text-[#1D4ED8] leading-relaxed">
            This will create the campaign, ad sets, ads, and lead forms on your Meta ad account.
            The campaign will be created in <span className="font-medium">paused</span> state — you
            can review everything on Meta before going live.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back
        </button>
        <button
          onClick={handleLaunch}
          disabled={!canLaunch || launching}
          className={`inline-flex items-center gap-2 h-10 px-6 text-[13px] font-medium rounded-button transition-colors duration-150 ${
            canLaunch && !launching
              ? "bg-accent text-white hover:bg-accent-hover"
              : "bg-surface-secondary text-text-tertiary cursor-not-allowed"
          }`}
        >
          {launching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating on Meta...
            </>
          ) : (
            <>
              <Rocket size={15} strokeWidth={1.5} />
              Create Campaign on Meta
            </>
          )}
        </button>
      </div>
    </div>
  );
}
