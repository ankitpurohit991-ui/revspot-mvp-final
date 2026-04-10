"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Plug, Loader2 } from "lucide-react";

interface ImportableCampaign {
  id: string;
  name: string;
  status: string;
  spend: string;
  leads: number;
}

const MOCK_CAMPAIGNS: ImportableCampaign[] = [
  { id: "imp-1", name: "Godrej Air — Lead Gen (Whitefield)", status: "Active", spend: "₹1.9L", leads: 214 },
  { id: "imp-2", name: "Godrej Air — Retargeting", status: "Active", spend: "₹85K", leads: 98 },
  { id: "imp-3", name: "Godrej Reflections — NRI", status: "Paused", spend: "₹1.4L", leads: 156 },
  { id: "imp-4", name: "Godrej Habitat — Brand Awareness", status: "Active", spend: "₹48K", leads: 64 },
  { id: "imp-5", name: "Godrej Eternity — Lead Gen", status: "Completed", spend: "₹2.1L", leads: 312 },
];

interface StepAdAccountProps {
  onNext: (data: { accountName: string; importedCampaigns: ImportableCampaign[] }) => void;
  onBack: () => void;
}

export function StepAdAccount({ onNext, onBack }: StepAdAccountProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [accountName] = useState("Godrej Properties (Act: 1029384756)");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setSelectedIds(new Set(MOCK_CAMPAIGNS.map((c) => c.id)));
    }, 1500);
  };

  const toggleCampaign = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === MOCK_CAMPAIGNS.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(MOCK_CAMPAIGNS.map((c) => c.id)));
    }
  };

  const selectedCampaigns = MOCK_CAMPAIGNS.filter((c) => selectedIds.has(c.id));

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-[24px] font-semibold text-text-primary mb-2">
          Connect your ad account
        </h2>
        <p className="text-[14px] text-text-secondary">
          Import your existing campaigns so you can manage everything from Revspot.
        </p>
      </div>

      {/* Connection card */}
      <div className="bg-white border border-border rounded-card p-6 mb-5">
        {!connected ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-metric bg-[#1877F2]/10 flex items-center justify-center mx-auto mb-3">
              <Plug size={22} strokeWidth={1.5} className="text-[#1877F2]" />
            </div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-1">
              Meta Ads
            </h3>
            <p className="text-[12px] text-text-secondary mb-4">
              Connect your Facebook / Instagram ad account
            </p>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="inline-flex items-center gap-2 h-10 px-6 bg-[#1877F2] text-white text-[13px] font-medium rounded-button hover:bg-[#1565C0] transition-colors duration-150 disabled:opacity-60"
            >
              {connecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <Plug size={14} strokeWidth={1.5} /> Connect Meta Ad Account
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-metric bg-[#F0FDF4] flex items-center justify-center shrink-0">
              <Check size={18} strokeWidth={2} className="text-[#15803D]" />
            </div>
            <div className="flex-1">
              <span className="block text-[13px] font-medium text-text-primary">
                {accountName}
              </span>
              <span className="block text-[11px] text-[#15803D]">Connected</span>
            </div>
          </div>
        )}
      </div>

      {/* Campaign import list */}
      {connected && (
        <div className="bg-white border border-border rounded-card overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-primary">
              {MOCK_CAMPAIGNS.length} campaigns found
            </span>
            <button
              onClick={toggleAll}
              className="text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
            >
              {selectedIds.size === MOCK_CAMPAIGNS.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div>
            {MOCK_CAMPAIGNS.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-surface-page transition-colors cursor-pointer border-b border-border-subtle last:border-0"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleCampaign(c.id)}
                  className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-[13px] text-text-primary font-medium truncate">
                    {c.name}
                  </span>
                  <span className="text-[11px] text-text-tertiary">
                    {c.status} &bull; Spend: {c.spend} &bull; {c.leads} leads
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2} /> Back
        </button>

        <div className="flex items-center gap-3">
          {!connected && (
            <button
              onClick={() => onNext({ accountName: "", importedCampaigns: [] })}
              className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
            >
              I don&apos;t have campaigns yet &rarr; Skip
            </button>
          )}
          {connected && (
            <button
              onClick={() =>
                onNext({
                  accountName,
                  importedCampaigns: selectedCampaigns,
                })
              }
              className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
            >
              {selectedIds.size > 0
                ? `Import ${selectedIds.size} & Continue`
                : "Skip Import & Continue"}
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
