"use client";

import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, Plug, Loader2, ChevronDown } from "lucide-react";

interface ImportableCampaign {
  id: string;
  name: string;
  status: string;
  spend: string;
  leads: number;
}

interface AdAccount {
  id: string;
  name: string;
  accountId: string;
}

interface BusinessManager {
  id: string;
  name: string;
  adAccounts: AdAccount[];
}

const MOCK_BUSINESS_MANAGERS: BusinessManager[] = [
  {
    id: "bm-1",
    name: "Godrej Properties",
    adAccounts: [
      { id: "aa-1", name: "Godrej Properties — Primary", accountId: "Act: 1029384756" },
      { id: "aa-2", name: "Godrej Properties — NRI", accountId: "Act: 8374652910" },
    ],
  },
  {
    id: "bm-2",
    name: "Godrej Residential",
    adAccounts: [
      { id: "aa-3", name: "Godrej Residential — South", accountId: "Act: 5738291046" },
    ],
  },
];

const MOCK_CAMPAIGNS_BY_ACCOUNT: Record<string, ImportableCampaign[]> = {
  "aa-1": [
    { id: "imp-1", name: "Godrej Air — Lead Gen (Whitefield)", status: "Active", spend: "₹1.9L", leads: 214 },
    { id: "imp-2", name: "Godrej Air — Retargeting", status: "Active", spend: "₹85K", leads: 98 },
    { id: "imp-3", name: "Godrej Reflections — NRI", status: "Paused", spend: "₹1.4L", leads: 156 },
    { id: "imp-4", name: "Godrej Habitat — Brand Awareness", status: "Active", spend: "₹48K", leads: 64 },
    { id: "imp-5", name: "Godrej Eternity — Lead Gen", status: "Completed", spend: "₹2.1L", leads: 312 },
  ],
  "aa-2": [
    { id: "imp-6", name: "Godrej Air — NRI Dubai", status: "Active", spend: "₹3.2L", leads: 89 },
    { id: "imp-7", name: "Godrej Reflections — NRI Singapore", status: "Active", spend: "₹2.8L", leads: 72 },
    { id: "imp-8", name: "Godrej Properties — NRI UK", status: "Paused", spend: "₹1.1L", leads: 45 },
  ],
  "aa-3": [
    { id: "imp-9", name: "Godrej Ananda — Lead Gen (Bangalore)", status: "Active", spend: "₹2.4L", leads: 187 },
    { id: "imp-10", name: "Godrej Eternity — South Region", status: "Active", spend: "₹1.6L", leads: 134 },
    { id: "imp-11", name: "Godrej Reserve — Premium Launch", status: "Completed", spend: "₹4.1L", leads: 256 },
    { id: "imp-12", name: "Godrej Woodland — Brand Awareness", status: "Active", spend: "₹72K", leads: 41 },
  ],
};

interface StepAdAccountProps {
  onNext: (data: { accountName: string; importedCampaigns: ImportableCampaign[] }) => void;
  onBack: () => void;
}

export function StepAdAccount({ onNext, onBack }: StepAdAccountProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedBMId, setSelectedBMId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const selectedBM = useMemo(
    () => MOCK_BUSINESS_MANAGERS.find((bm) => bm.id === selectedBMId) ?? null,
    [selectedBMId]
  );

  const selectedAccount = useMemo(
    () => selectedBM?.adAccounts.find((a) => a.id === selectedAccountId) ?? null,
    [selectedBM, selectedAccountId]
  );

  const campaigns = useMemo(
    () => (selectedAccountId && !loadingCampaigns ? MOCK_CAMPAIGNS_BY_ACCOUNT[selectedAccountId] ?? [] : []),
    [selectedAccountId, loadingCampaigns]
  );

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  };

  const handleBMChange = (bmId: string) => {
    setSelectedAccountId(null);
    setSelectedIds(new Set());
    if (!bmId) {
      setSelectedBMId(null);
      return;
    }
    setSelectedBMId(bmId);
    setLoadingAccounts(true);
    const delay = 3000 + Math.random() * 2000;
    setTimeout(() => {
      setLoadingAccounts(false);
    }, delay);
  };

  const handleAccountChange = (accountId: string) => {
    setSelectedIds(new Set());
    if (!accountId) {
      setSelectedAccountId(null);
      return;
    }
    setSelectedAccountId(accountId);
    setLoadingCampaigns(true);
    const delay = 3000 + Math.random() * 2000;
    setTimeout(() => {
      const acctCampaigns = MOCK_CAMPAIGNS_BY_ACCOUNT[accountId] ?? [];
      setSelectedIds(new Set(acctCampaigns.map((c) => c.id)));
      setLoadingCampaigns(false);
    }, delay);
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
    if (selectedIds.size === campaigns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(campaigns.map((c) => c.id)));
    }
  };

  const selectedCampaigns = campaigns.filter((c) => selectedIds.has(c.id));

  const accountDisplayName = selectedAccount
    ? `${selectedAccount.name} (${selectedAccount.accountId})`
    : "";

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
          <div>
            {/* Connected header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-badge bg-[#1877F2]/10 flex items-center justify-center">
                  <Plug size={15} strokeWidth={1.5} className="text-[#1877F2]" />
                </div>
                <span className="text-[14px] font-semibold text-text-primary">Meta Ads</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-badge">
                <Check size={12} strokeWidth={2.5} /> Connected
              </span>
            </div>

            {/* Business Manager dropdown */}
            <div className="mb-4">
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
                Business Manager
              </label>
              <div className="relative">
                <select
                  value={selectedBMId ?? ""}
                  onChange={(e) => handleBMChange(e.target.value)}
                  disabled={loadingAccounts || loadingCampaigns}
                  className="w-full h-10 pl-3 pr-9 text-[13px] text-text-primary bg-white border border-border rounded-input appearance-none cursor-pointer hover:border-border-hover focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a Business Manager</option>
                  {MOCK_BUSINESS_MANAGERS.map((bm) => (
                    <option key={bm.id} value={bm.id}>
                      {bm.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              </div>
            </div>

            {/* Ad Account dropdown */}
            <div>
              <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
                Ad Account
              </label>
              {loadingAccounts ? (
                <div className="w-full h-10 border border-border rounded-input bg-surface-secondary flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin text-text-tertiary" />
                  <span className="text-[12px] text-text-tertiary">Fetching ad accounts…</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedAccountId ?? ""}
                    onChange={(e) => handleAccountChange(e.target.value)}
                    disabled={!selectedBMId || loadingCampaigns}
                    className="w-full h-10 pl-3 pr-9 text-[13px] text-text-primary bg-white border border-border rounded-input appearance-none cursor-pointer hover:border-border-hover focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary"
                  >
                    <option value="">
                      {selectedBMId ? "Select an Ad Account" : "Select a Business Manager first"}
                    </option>
                    {selectedBM?.adAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.accountId})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Campaign loading state */}
      {connected && loadingCampaigns && (
        <div className="bg-white border border-border rounded-card p-6 mb-5">
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <Loader2 size={20} className="animate-spin text-text-tertiary" />
            <span className="text-[13px] text-text-secondary">Fetching campaigns…</span>
          </div>
        </div>
      )}

      {/* Campaign import list */}
      {connected && !loadingCampaigns && selectedAccountId && campaigns.length > 0 && (
        <div className="bg-white border border-border rounded-card overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-primary">
              {campaigns.length} campaigns found
            </span>
            <button
              onClick={toggleAll}
              className="text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
            >
              {selectedIds.size === campaigns.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div>
            {campaigns.map((c) => (
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
          {connected && !selectedAccountId && (
            <button
              onClick={() => onNext({ accountName: "", importedCampaigns: [] })}
              className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Skip &rarr;
            </button>
          )}
          {connected && selectedAccountId && (
            <button
              onClick={() =>
                onNext({
                  accountName: accountDisplayName,
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
