"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileSpreadsheet,
  X,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import {
  triggerTypes,
  availableActions,
  csvPreviewHeaders,
  csvPreviewRows,
} from "@/lib/workflow-data";
import { newAgentsList } from "@/lib/voice-agent-data";
import type { TriggerType, PostActionType } from "@/lib/types/workflow";
import type { ChannelType } from "@/lib/types/common";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const STEPS = [
  { num: 1, label: "Trigger" },
  { num: 2, label: "Routing" },
  { num: 3, label: "Agent + Channel" },
  { num: 4, label: "After the Call" },
  { num: 5, label: "Schedule + Review" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
};

interface RoutingRule {
  field: string;
  operator: string;
  value: string;
}

interface Branch {
  id: string;
  label: string;
  agentId: string;
  channel: ChannelType;
  overrides: { key: string; value: string }[];
  rules: RoutingRule[];
}

export default function CreateWorkflowPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 — Trigger
  const [triggerType, setTriggerType] = useState<TriggerType | "">("");
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");

  // Step 2 — Routing
  const [routingEnabled, setRoutingEnabled] = useState(false);
  const [routingMode, setRoutingMode] = useState<"rules" | "ai">("rules");
  const [aiRoutingPrompt, setAiRoutingPrompt] = useState("");
  const [branches, setBranches] = useState<Branch[]>([
    { id: "br-1", label: "Branch 1", agentId: "", channel: "voice", overrides: [], rules: [{ field: "", operator: "equals", value: "" }] },
  ]);

  // Step 3 — Agent + Channel (single, when no routing)
  const [singleAgentId, setSingleAgentId] = useState("");
  const [singleChannel, setSingleChannel] = useState<ChannelType>("voice");
  const [singleOverrides, setSingleOverrides] = useState<{ key: string; value: string }[]>([]);

  // Step 4 — After the Call
  const [postActionMode, setPostActionMode] = useState<"rules" | "ai">("ai");
  const [postActionPrompt, setPostActionPrompt] = useState(
    "Push qualified leads to CRM immediately. If the lead is interested, send project details and brochure via WhatsApp. If the lead requested a callback, notify the sales team. If no answer after 2 retries, archive."
  );
  const [enabledActions, setEnabledActions] = useState<Set<PostActionType>>(
    new Set(["push_to_crm", "send_whatsapp", "notify_sales", "schedule_callback"])
  );
  const [fallbackAction, setFallbackAction] = useState<PostActionType>("notify_sales");

  // WhatsApp template config (shown when send_whatsapp is enabled)
  const [waTemplateMessage, setWaTemplateMessage] = useState(
    "Hi {{lead_name}}, thanks for speaking with us! Here are the details for {{project_name}}. Feel free to reach out if you have questions."
  );
  const [waIncludeBrochure, setWaIncludeBrochure] = useState(true);
  const [waIncludeImages, setWaIncludeImages] = useState(true);
  const [waSendTiming, setWaSendTiming] = useState<"immediate" | "5min" | "1hr">("immediate");

  // Step 5 — Schedule
  const [dailyLimit, setDailyLimit] = useState("200");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("19:00");
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const [retryEnabled, setRetryEnabled] = useState(true);
  const [maxRetries, setMaxRetries] = useState("2");
  const [retryInterval, setRetryInterval] = useState("4");

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleAction = (type: PostActionType) => {
    setEnabledActions((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const addBranch = () => {
    if (branches.length >= 3) return;
    setBranches((prev) => [
      ...prev,
      {
        id: `br-${prev.length + 1}`,
        label: `Branch ${prev.length + 1}`,
        agentId: "",
        channel: "voice",
        overrides: [],
        rules: [{ field: "", operator: "equals", value: "" }],
      },
    ]);
  };

  const removeBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const updateBranchRule = (branchId: string, ruleIdx: number, updates: Partial<RoutingRule>) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b;
        const rules = [...b.rules];
        rules[ruleIdx] = { ...rules[ruleIdx], ...updates };
        return { ...b, rules };
      })
    );
  };

  const canNext = () => {
    if (step === 1) return triggerType !== "";
    return true;
  };

  const triggerLabel = triggerTypes.find((t) => t.type === triggerType)?.label ?? triggerType;

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.push("/workflows")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">
          Lead Generation &rsaquo; Workflows &rsaquo; Create
        </span>
      </div>

      <div className="max-w-[720px]">
        <h1 className="text-page-title text-text-primary mb-1">Create Workflow</h1>
        <p className="text-meta text-text-secondary mb-8">
          Build an automated workflow to process leads end-to-end
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors duration-150 ${
                  step === s.num
                    ? "bg-accent text-white"
                    : step > s.num
                    ? "bg-[#F0FDF4] text-[#15803D] cursor-pointer"
                    : "bg-surface-secondary text-text-tertiary"
                }`}
              >
                {step > s.num ? (
                  <Check size={12} strokeWidth={2.5} />
                ) : (
                  <span>{s.num}</span>
                )}
                <span>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="w-4 h-px bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* ──────────── Step 1: Trigger ──────────── */}
        {step === 1 && (
          <div className="bg-white border border-border rounded-card p-6 mb-5">
            <h2 className="text-card-title text-text-primary mb-4">Select Trigger</h2>
            <div className="grid grid-cols-1 gap-2">
              {triggerTypes.map((t) => (
                <button
                  key={t.type}
                  onClick={() => { if (!t.comingSoon) { setTriggerType(t.type); setCsvUploaded(false); } }}
                  className={`flex items-start gap-3 text-left px-4 py-3 rounded-[8px] border transition-all duration-150 ${
                    t.comingSoon
                      ? "border-border bg-surface-page/50 opacity-60 cursor-not-allowed"
                      : triggerType === t.type
                        ? "border-accent bg-[#EFF6FF]/50 ring-1 ring-accent/20"
                        : "border-border hover:border-border-hover hover:bg-surface-page/50"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      triggerType === t.type && !t.comingSoon ? "border-accent" : "border-border"
                    }`}
                  >
                    {triggerType === t.type && !t.comingSoon && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-text-primary">{t.label}</span>
                      {t.comingSoon && (
                        <span className="text-[10px] font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded">Coming soon</span>
                      )}
                    </div>
                    <div className="text-[12px] text-text-secondary mt-0.5">{t.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* CSV Upload area */}
            {triggerType === "csv_upload" && (
              <div className="mt-5">
                {!csvUploaded ? (
                  <div
                    onClick={() => setCsvUploaded(true)}
                    className="border-2 border-dashed border-border rounded-input p-8 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150"
                  >
                    <Upload size={24} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-3" />
                    <p className="text-[13px] text-text-secondary">
                      Drag & drop your CSV file, or <span className="text-accent font-medium">browse</span>
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1">.csv files only</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-surface-page rounded-[6px] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet size={16} strokeWidth={1.5} className="text-text-secondary" />
                        <span className="text-[13px] text-text-primary font-medium">
                          godrej_reflections_leads.csv
                        </span>
                      </div>
                      <button
                        onClick={() => setCsvUploaded(false)}
                        className="text-text-tertiary hover:text-text-primary transition-colors duration-150"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} strokeWidth={2} className="text-status-success" />
                        <span className="text-[12px] text-text-primary font-medium">487 contacts detected</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={13} strokeWidth={2} className="text-status-warning" />
                        <span className="text-[12px] text-text-secondary">12 duplicates removed</span>
                      </div>
                    </div>
                    <div className="border border-border-subtle rounded-[6px] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-surface-page border-b border-border-subtle">
                            {csvPreviewHeaders.map((h) => (
                              <th key={h} className="px-3 py-2 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreviewRows.map((row, i) => (
                            <tr key={i} className="border-b border-border-subtle last:border-0">
                              {row.map((cell, j) => (
                                <td key={j} className="px-3 py-1.5 text-[11px] text-text-secondary">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-3 py-1.5 bg-surface-page text-[10px] text-text-tertiary">
                        Showing 5 of 487 rows
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campaign Lead selector */}
            {triggerType === "campaign_lead" && (
              <div className="mt-5">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Select Campaign</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
                  style={selectStyle}
                >
                  <option value="">Choose a campaign...</option>
                  <option value="camp-1">Godrej Reflections Habitat — Lead Gen</option>
                  <option value="camp-2">Godrej Eternity — Retargeting</option>
                  <option value="camp-3">Godrej Nurture — Lookalike</option>
                  <option value="camp-4">Godrej Platinum — Lead Gen</option>
                  <option value="camp-7">Godrej Air Phase 3 — Lead Gen</option>
                </select>
                <p className="text-[11px] text-text-tertiary mt-1.5">New leads from this campaign will automatically enter the workflow.</p>
              </div>
            )}

            {/* Manual (API) endpoint */}
            {triggerType === "manual" && (
              <div className="mt-5">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">API Endpoint</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-page border border-border rounded-input px-3 py-2.5 font-mono text-[12px] text-text-primary select-all">
                    POST https://api.revspot.io/v1/workflows/<span className="text-accent">&#123;workflow_id&#125;</span>/trigger
                  </div>
                  <button
                    onClick={() => navigator.clipboard?.writeText("https://api.revspot.io/v1/workflows/{workflow_id}/trigger")}
                    className="h-10 px-3 border border-border rounded-input bg-white text-text-secondary hover:text-text-primary hover:bg-surface-page transition-colors text-[12px] font-medium"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[11px] text-text-tertiary mt-1.5">Send a POST request with lead data in the body to trigger this workflow programmatically.</p>

                <div className="mt-3 bg-surface-page border border-border-subtle rounded-[6px] p-3">
                  <div className="text-[11px] font-medium text-text-secondary mb-1.5">Example payload</div>
                  <pre className="text-[11px] text-text-primary font-mono leading-relaxed">{`{
  "name": "Vikram Reddy",
  "phone": "+919876543210",
  "email": "vikram@example.com",
  "budget": "1.5Cr",
  "source": "website"
}`}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────── Step 2: Routing ──────────── */}
        {step === 2 && (
          <div className="bg-white border border-border rounded-card p-6 mb-5">
            <h2 className="text-card-title text-text-primary mb-4">Lead Routing</h2>

            {/* Toggle */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[13px] text-text-primary">Route leads to different agents?</span>
              <button
                onClick={() => setRoutingEnabled(!routingEnabled)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${
                  routingEnabled ? "bg-accent" : "bg-silver-light"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${
                    routingEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {!routingEnabled && (
              <div className="bg-surface-page rounded-[8px] px-4 py-3 text-[12px] text-text-secondary">
                All leads will be sent to the same agent (configured in the next step).
              </div>
            )}

            {routingEnabled && (
              <div className="space-y-5">
                {/* Mode Toggle */}
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-2">Routing Method</label>
                  <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5 w-fit">
                    {(["rules", "ai"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setRoutingMode(m)}
                        className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors duration-150 ${
                          routingMode === m
                            ? "bg-white text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {m === "rules" ? "Rules" : "AI decides"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Prompt */}
                {routingMode === "ai" && (
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                      Routing Instructions
                    </label>
                    <textarea
                      value={aiRoutingPrompt}
                      onChange={(e) => setAiRoutingPrompt(e.target.value)}
                      placeholder="Describe how leads should be routed. E.g., 'Route leads with budget > 1Cr to Priya, others to Arjun.'"
                      rows={3}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none"
                    />
                  </div>
                )}

                {/* Branches */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-text-primary">Branches</label>
                    {branches.length < 3 && (
                      <button
                        onClick={addBranch}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150"
                      >
                        <Plus size={13} strokeWidth={2} />
                        Add Branch
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {branches.map((br) => (
                      <div key={br.id} className="border border-border rounded-[8px] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={br.label}
                            onChange={(e) => updateBranch(br.id, { label: e.target.value })}
                            className="text-[13px] font-medium text-text-primary bg-transparent border-none focus:outline-none"
                          />
                          {branches.length > 1 && (
                            <button
                              onClick={() => removeBranch(br.id)}
                              className="p-1 text-text-tertiary hover:text-status-error transition-colors duration-150"
                            >
                              <Trash2 size={13} strokeWidth={1.5} />
                            </button>
                          )}
                        </div>

                        {/* Rules Builder (only for rules mode) */}
                        {routingMode === "rules" && (
                          <div className="space-y-2 mb-3">
                            {br.rules.map((rule, ri) => (
                              <div key={ri} className="grid grid-cols-[1fr_auto_1fr] gap-2">
                                <input
                                  type="text"
                                  value={rule.field}
                                  onChange={(e) => updateBranchRule(br.id, ri, { field: e.target.value })}
                                  placeholder="Field (e.g., lead.budget)"
                                  className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                                />
                                <select
                                  value={rule.operator}
                                  onChange={(e) => updateBranchRule(br.id, ri, { operator: e.target.value })}
                                  className="h-9 px-2 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
                                  style={selectStyle}
                                >
                                  <option value="equals">equals</option>
                                  <option value="not_equals">not equals</option>
                                  <option value="greater_than">greater than</option>
                                  <option value="less_than">less than</option>
                                  <option value="contains">contains</option>
                                  <option value="in">in</option>
                                </select>
                                <input
                                  type="text"
                                  value={rule.value}
                                  onChange={(e) => updateBranchRule(br.id, ri, { value: e.target.value })}
                                  placeholder="Value"
                                  className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────── Step 3: Agent + Channel ──────────── */}
        {step === 3 && (
          <div className="space-y-5">
            {routingEnabled ? (
              branches.map((br) => (
                <div key={br.id} className="bg-white border border-border rounded-card p-6">
                  <h2 className="text-card-title text-text-primary mb-4">{br.label}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                        Agent <span className="text-status-error">*</span>
                      </label>
                      <select
                        value={br.agentId}
                        onChange={(e) => updateBranch(br.id, { agentId: e.target.value })}
                        className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
                        style={selectStyle}
                      >
                        <option value="">Select agent...</option>
                        {newAgentsList.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-primary mb-2">Channel</label>
                      <div className="flex items-center gap-2">
                        {(["voice", "whatsapp"] as const).map((ch) => (
                          <button
                            key={ch}
                            onClick={() => updateBranch(br.id, { channel: ch })}
                            className={`px-4 py-2 text-[12px] font-medium rounded-[6px] border transition-colors duration-150 capitalize ${
                              br.channel === ch
                                ? "border-accent bg-[#EFF6FF]/50 text-accent"
                                : "border-border text-text-secondary hover:border-border-hover"
                            }`}
                          >
                            {ch === "whatsapp" ? "WhatsApp" : "Voice"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Variable overrides */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[13px] font-medium text-text-primary">Variable Overrides</label>
                        <button
                          onClick={() =>
                            updateBranch(br.id, {
                              overrides: [...br.overrides, { key: "", value: "" }],
                            })
                          }
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150"
                        >
                          <Plus size={13} strokeWidth={2} />
                          Add
                        </button>
                      </div>
                      {br.overrides.length === 0 && (
                        <div className="text-[12px] text-text-tertiary">No overrides</div>
                      )}
                      {br.overrides.map((ov, oi) => (
                        <div key={oi} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                          <input
                            type="text"
                            value={ov.key}
                            onChange={(e) => {
                              const overrides = [...br.overrides];
                              overrides[oi] = { ...overrides[oi], key: e.target.value };
                              updateBranch(br.id, { overrides });
                            }}
                            placeholder="Key"
                            className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                          />
                          <input
                            type="text"
                            value={ov.value}
                            onChange={(e) => {
                              const overrides = [...br.overrides];
                              overrides[oi] = { ...overrides[oi], value: e.target.value };
                              updateBranch(br.id, { overrides });
                            }}
                            placeholder="Value"
                            className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                          />
                          <button
                            onClick={() => {
                              const overrides = br.overrides.filter((_, idx) => idx !== oi);
                              updateBranch(br.id, { overrides });
                            }}
                            className="p-1 text-text-tertiary hover:text-status-error transition-colors duration-150"
                          >
                            <X size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-border rounded-card p-6">
                <h2 className="text-card-title text-text-primary mb-4">Agent + Channel</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                      Agent <span className="text-status-error">*</span>
                    </label>
                    <select
                      value={singleAgentId}
                      onChange={(e) => setSingleAgentId(e.target.value)}
                      className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
                      style={selectStyle}
                    >
                      <option value="">Select agent...</option>
                      {newAgentsList.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-2">Channel</label>
                    <div className="flex items-center gap-2">
                      {(["voice", "whatsapp"] as const).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setSingleChannel(ch)}
                          className={`px-4 py-2 text-[12px] font-medium rounded-[6px] border transition-colors duration-150 ${
                            singleChannel === ch
                              ? "border-accent bg-[#EFF6FF]/50 text-accent"
                              : "border-border text-text-secondary hover:border-border-hover"
                          }`}
                        >
                          {ch === "whatsapp" ? "WhatsApp" : "Voice"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Variable overrides */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[13px] font-medium text-text-primary">Variable Overrides</label>
                      <button
                        onClick={() => setSingleOverrides((prev) => [...prev, { key: "", value: "" }])}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors duration-150"
                      >
                        <Plus size={13} strokeWidth={2} />
                        Add
                      </button>
                    </div>
                    {singleOverrides.length === 0 && (
                      <div className="text-[12px] text-text-tertiary">No overrides configured</div>
                    )}
                    {singleOverrides.map((ov, oi) => (
                      <div key={oi} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                        <input
                          type="text"
                          value={ov.key}
                          onChange={(e) => {
                            const next = [...singleOverrides];
                            next[oi] = { ...next[oi], key: e.target.value };
                            setSingleOverrides(next);
                          }}
                          placeholder="Key"
                          className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                        />
                        <input
                          type="text"
                          value={ov.value}
                          onChange={(e) => {
                            const next = [...singleOverrides];
                            next[oi] = { ...next[oi], value: e.target.value };
                            setSingleOverrides(next);
                          }}
                          placeholder="Value"
                          className="h-9 px-3 text-[12px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                        />
                        <button
                          onClick={() => setSingleOverrides((prev) => prev.filter((_, idx) => idx !== oi))}
                          className="p-1 text-text-tertiary hover:text-status-error transition-colors duration-150"
                        >
                          <X size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────── Step 4: After the Call ──────────── */}
        {step === 4 && (
          <div className="bg-white border border-border rounded-card p-6 mb-5">
            <h2 className="text-card-title text-text-primary mb-4">After the Call</h2>
            <div className="space-y-5">
              {/* Mode Toggle */}
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-2">Decision Mode</label>
                <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5 w-fit">
                  {(["rules", "ai"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPostActionMode(m)}
                      className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors duration-150 ${
                        postActionMode === m
                          ? "bg-white text-text-primary shadow-sm"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {m === "rules" ? "Simple rules" : "AI decides"}
                    </button>
                  ))}
                </div>
              </div>

              {postActionMode === "ai" && (
                <>
                  {/* Prompt */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                      Business Rules Prompt
                    </label>
                    <textarea
                      value={postActionPrompt}
                      onChange={(e) => setPostActionPrompt(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none"
                    />
                  </div>

                  {/* Available Actions */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-3">
                      Available Actions
                    </label>
                    <div className="space-y-2">
                      {availableActions.map((a) => (
                        <label
                          key={a.type}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-[6px] border border-border hover:bg-surface-page/50 transition-colors duration-150 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={enabledActions.has(a.type)}
                            onChange={() => toggleAction(a.type)}
                            className="mt-0.5 w-4 h-4 rounded border-border text-accent focus:ring-accent/20"
                          />
                          <div>
                            <div className="text-[13px] font-medium text-text-primary">{a.label}</div>
                            <div className="text-[11px] text-text-secondary mt-0.5">{a.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Template Config — shown when send_whatsapp is enabled */}
                  {enabledActions.has("send_whatsapp") && (
                    <div className="bg-[#F0FDF4] border border-[#15803D]/15 rounded-[8px] p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium text-[#15803D]">WhatsApp Message Template</span>
                        <span className="text-[11px] text-text-tertiary">Sent when AI decides to send WhatsApp</span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-text-secondary mb-1">Message</label>
                        <textarea
                          value={waTemplateMessage}
                          onChange={(e) => setWaTemplateMessage(e.target.value)}
                          rows={3}
                          placeholder="Hi {{lead_name}}, thanks for your interest..."
                          className="w-full px-3 py-2 text-[12px] border border-[#15803D]/20 rounded-input bg-white text-text-primary focus:outline-none focus:border-[#15803D] transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed"
                        />
                        <div className="text-[10px] text-text-tertiary mt-1">
                          Use {"{{lead_name}}"}, {"{{project_name}}"}, {"{{agent_name}}"} for dynamic values
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={waIncludeBrochure} onChange={() => setWaIncludeBrochure(!waIncludeBrochure)}
                            className="w-3.5 h-3.5 rounded border-border text-[#15803D] focus:ring-[#15803D]/20" />
                          <span className="text-[12px] text-text-primary">Attach brochure PDF</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={waIncludeImages} onChange={() => setWaIncludeImages(!waIncludeImages)}
                            className="w-3.5 h-3.5 rounded border-border text-[#15803D] focus:ring-[#15803D]/20" />
                          <span className="text-[12px] text-text-primary">Include project images</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-[11px] text-text-secondary mb-1">Send timing</label>
                        <div className="flex gap-2">
                          {([
                            { value: "immediate" as const, label: "Immediately after call" },
                            { value: "5min" as const, label: "5 min after" },
                            { value: "1hr" as const, label: "1 hour after" },
                          ]).map((opt) => (
                            <button key={opt.value} onClick={() => setWaSendTiming(opt.value)}
                              className={`px-3 py-1.5 text-[11px] font-medium rounded-badge transition-colors ${
                                waSendTiming === opt.value ? "bg-[#15803D] text-white" : "bg-white text-text-secondary hover:text-text-primary border border-[#15803D]/20"
                              }`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback */}
                  <div>
                    <label className="block text-[13px] font-medium text-text-primary mb-1.5">
                      Fallback Action (if AI is uncertain)
                    </label>
                    <select
                      value={fallbackAction}
                      onChange={(e) => setFallbackAction(e.target.value as PostActionType)}
                      className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 appearance-none cursor-pointer"
                      style={selectStyle}
                    >
                      {availableActions.map((a) => (
                        <option key={a.type} value={a.type}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {postActionMode === "rules" && (
                <div className="bg-surface-page rounded-[8px] px-4 py-3 text-[12px] text-text-secondary">
                  Simple rules mode: configure condition-based rules (e.g., if outcome = qualified, push to CRM). Full rules builder coming soon.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────────── Step 5: Schedule + Review ──────────── */}
        {step === 5 && (
          <div className="space-y-5">
            {/* Schedule */}
            <div className="bg-white border border-border rounded-card p-6">
              <h2 className="text-card-title text-text-primary mb-4">Schedule</h2>
              <div className="space-y-5">
                {/* Daily limit */}
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Daily Limit</label>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    className="w-[120px] h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 tabular-nums"
                  />
                </div>

                {/* Calling hours */}
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Calling Hours</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                    />
                    <span className="text-[12px] text-text-tertiary">to</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
                    />
                  </div>
                </div>

                {/* Active days */}
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-2">Active Days</label>
                  <div className="flex items-center gap-1.5">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-9 text-[12px] font-medium rounded-[6px] transition-colors duration-150 ${
                          activeDays.includes(day)
                            ? "bg-accent text-white"
                            : "bg-surface-secondary text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Retry */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-text-primary">Retry unanswered calls</span>
                    <button
                      onClick={() => setRetryEnabled(!retryEnabled)}
                      className={`relative w-9 h-5 rounded-full transition-colors duration-150 ${
                        retryEnabled ? "bg-accent" : "bg-silver-light"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${
                          retryEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  {retryEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] text-text-secondary mb-1">Max retries</label>
                        <input
                          type="number"
                          value={maxRetries}
                          onChange={(e) => setMaxRetries(e.target.value)}
                          className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] text-text-secondary mb-1">Retry interval (hours)</label>
                        <input
                          type="number"
                          value={retryInterval}
                          onChange={(e) => setRetryInterval(e.target.value)}
                          className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 tabular-nums"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Summary */}
            <div className="bg-white border border-border rounded-card p-6">
              <h2 className="text-card-title text-text-primary mb-4">Review Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Trigger</span>
                  <span className="text-[13px] font-medium text-text-primary">{triggerLabel}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Routing</span>
                  <span className="text-[13px] font-medium text-text-primary">
                    {routingEnabled ? `${branches.length} branch(es) via ${routingMode === "ai" ? "AI" : "rules"}` : "Single path"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Agent</span>
                  <span className="text-[13px] font-medium text-text-primary">
                    {routingEnabled
                      ? branches.map((b) => newAgentsList.find((a) => a.id === b.agentId)?.name || "Unassigned").join(", ")
                      : newAgentsList.find((a) => a.id === singleAgentId)?.name || "Unassigned"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Channel</span>
                  <span className="text-[13px] font-medium text-text-primary capitalize">
                    {routingEnabled
                      ? [...new Set(branches.map((b) => b.channel === "whatsapp" ? "WhatsApp" : "Voice"))].join(", ")
                      : singleChannel === "whatsapp" ? "WhatsApp" : "Voice"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Post-Action</span>
                  <span className="text-[13px] font-medium text-text-primary">
                    {postActionMode === "ai" ? "AI decides" : "Simple rules"} ({enabledActions.size} actions)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Daily Limit</span>
                  <span className="text-[13px] font-medium text-text-primary tabular-nums">{dailyLimit}/day</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-[12px] text-text-secondary">Calling Hours</span>
                  <span className="text-[13px] font-medium text-text-primary tabular-nums">{startTime} &ndash; {endTime}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[12px] text-text-secondary">Active Days</span>
                  <span className="text-[13px] font-medium text-text-primary">{activeDays.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between py-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : router.push("/workflows"))}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            {step > 1 ? "Back" : "Cancel"}
          </button>

          {step < 5 ? (
            <button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="inline-flex items-center gap-1.5 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          ) : (
            <button
              onClick={() => router.push("/workflows/wf-1")}
              className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
            >
              <Rocket size={15} strokeWidth={1.5} />
              Launch Workflow
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
