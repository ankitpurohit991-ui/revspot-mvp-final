"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, Sparkles, FileText, Upload } from "lucide-react";
import { SpotMark } from "@/components/spot/spot-mark";
import { useSpotStore } from "@/lib/spot/store";

type Stage = "intent" | "brief" | "goal" | "personas" | "review";

const STAGES: { key: Stage; label: string }[] = [
  { key: "intent", label: "Intent" },
  { key: "brief", label: "Brief" },
  { key: "goal", label: "Goal" },
  { key: "personas", label: "Personas" },
  { key: "review", label: "Review" },
];

type Draft = {
  source: "pdf" | "url" | "manual";
  sourceLabel: string;
  name: string;
  rera: string;
  micromarket: string;
  typology: string;
  priceBand: string;
  possession: string;
  goalKind: "leads" | "verified" | "qualified";
  goalTarget: string;
  goalWindow: string;
  personas: Array<{ name: string; role: string; approved: boolean }>;
};

const SEED: Draft = {
  source: "pdf",
  sourceLabel: "Project Brand Book v2.pdf",
  name: "Godrej Sky Gardens · Pune",
  rera: "PRM/MH/RERA/...",
  micromarket: "Kharadi · Pune East",
  typology: "3 BHK Apartments",
  priceBand: "₹1.6 – 2.4 Cr",
  possession: "Mar 2028",
  goalKind: "verified",
  goalTarget: "240",
  goalWindow: "180 days",
  personas: [
    { name: "Senior Tech Lead", role: "Director, IT services", approved: true },
    { name: "Pune Returnee", role: "Returning from BLR/Mumbai", approved: true },
    { name: "NRI Investor", role: "US/UK-based, second home", approved: false },
  ],
};

function StagePill({ stage, current }: { stage: { key: Stage; label: string }; current: Stage }) {
  const idx = STAGES.findIndex((s) => s.key === stage.key);
  const currentIdx = STAGES.findIndex((s) => s.key === current);
  const done = idx < currentIdx;
  const active = idx === currentIdx;
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold"
        style={{
          background: done ? "#22C55E" : active ? "#1A1A1A" : "var(--bg-secondary)",
          color: done || active ? "#FFF" : "var(--text-3)",
        }}
      >
        {done ? "✓" : idx + 1}
      </span>
      <span
        className="text-[11.5px]"
        style={{ color: active ? "var(--text-1)" : "var(--text-3)", fontWeight: active ? 600 : 500 }}
      >
        {stage.label}
      </span>
    </div>
  );
}

function SpotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 mb-3 fadeUp">
      <SpotMark size={20} style={{ flexShrink: 0, marginTop: 2 }} />
      <div
        className="flex-1 min-w-0 p-3"
        style={{
          background: "var(--spot-tint)",
          border: "1px solid var(--spot-stroke)",
          borderRadius: 10,
        }}
      >
        <div className="text-[13.5px] leading-[1.55]">{children}</div>
      </div>
    </div>
  );
}

function DraftCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[10px] p-4 mb-3 fadeUp"
      style={{ background: "#FFFDF6", border: "1px solid #E8C97A" }}
    >
      <div className="uplabel mb-3 flex items-center gap-1.5" style={{ fontSize: 10 }}>
        <Sparkles size={11} style={{ color: "#9C6D00" }} />
        Spot&apos;s draft
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  long,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  long?: boolean;
  rows?: number;
}) {
  return (
    <div className="mb-3">
      <div className="text-[10.5px] uppercase tracking-[0.4px] text-text-tertiary mb-1">{label}</div>
      {long ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 2}
          className="w-full text-[13px] outline-none rounded px-2 py-1.5"
          style={{ border: "1px solid #C9A86A", background: "#FFFEF8" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[13px] outline-none rounded px-2 py-1.5"
          style={{ border: "1px solid #C9A86A", background: "#FFFEF8" }}
        />
      )}
    </div>
  );
}

export function CreateProjectFlow({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (id: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("intent");
  const [draft, setDraft] = useState<Draft>(SEED);
  const showToast = useSpotStore((s) => s.showToast);
  const scrollRef = useRef<HTMLDivElement>(null);

  const next = () => {
    const idx = STAGES.findIndex((s) => s.key === stage);
    if (idx < STAGES.length - 1) setStage(STAGES[idx + 1].key);
  };
  const prev = () => {
    const idx = STAGES.findIndex((s) => s.key === stage);
    if (idx > 0) setStage(STAGES[idx - 1].key);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stage]);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        className="fadeInScale"
        style={{
          position: "fixed",
          top: "5vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(960px, 96vw)",
          maxHeight: "90vh",
          background: "#FFF",
          borderRadius: 14,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
          <SpotMark size={20} />
          <div className="flex-1 min-w-0">
            <div className="uplabel" style={{ fontSize: 10 }}>
              Spot · new project
            </div>
            <div className="text-[15px] font-semibold truncate">
              Set up a new project knowledge base
            </div>
          </div>
          {/* Stage strip */}
          <div className="flex items-center gap-3 mr-3">
            {STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <StagePill stage={s} current={stage} />
                {i < STAGES.length - 1 && (
                  <span className="w-4 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-8 w-8 rounded-button hover:bg-surface-secondary"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 scroll" style={{ background: "var(--chat-bg)" }}>
          {stage === "intent" && (
            <>
              <SpotBubble>
                Let&apos;s set up your new project. The fastest path: drop the brand book PDF and
                I&apos;ll extract everything I need. You can also paste a URL or fill it in yourself.
              </SpotBubble>
              <DraftCard>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { k: "pdf", label: "Upload PDF", Icon: Upload },
                    { k: "url", label: "Paste URL", Icon: FileText },
                    { k: "manual", label: "Manual fill", Icon: Sparkles },
                  ].map(({ k, label, Icon }) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDraft({ ...draft, source: k as Draft["source"] })}
                      className="card-base text-left p-3 flex flex-col items-start gap-1.5"
                      style={{
                        background: draft.source === k ? "#1A1A1A" : "#FFF",
                        color: draft.source === k ? "#FFF" : "var(--text-1)",
                        borderColor: draft.source === k ? "#1A1A1A" : "var(--border)",
                      }}
                    >
                      <Icon size={16} />
                      <span className="text-[12.5px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>
                <Field
                  label="Source label"
                  value={draft.sourceLabel}
                  onChange={(v) => setDraft({ ...draft, sourceLabel: v })}
                />
              </DraftCard>
              <div className="flex justify-end">
                <button type="button" className="apply-btn" onClick={next}>
                  Got it — extract the basics →
                </button>
              </div>
            </>
          )}

          {stage === "brief" && (
            <>
              <SpotBubble>
                Pulled from <strong>{draft.sourceLabel}</strong>. Click any value to edit, or accept
                and move on.
              </SpotBubble>
              <DraftCard>
                <Field label="Project name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
                <Field label="RERA" value={draft.rera} onChange={(v) => setDraft({ ...draft, rera: v })} />
                <Field label="Micromarket" value={draft.micromarket} onChange={(v) => setDraft({ ...draft, micromarket: v })} />
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Typology" value={draft.typology} onChange={(v) => setDraft({ ...draft, typology: v })} />
                  <Field label="Price band" value={draft.priceBand} onChange={(v) => setDraft({ ...draft, priceBand: v })} />
                  <Field label="Possession" value={draft.possession} onChange={(v) => setDraft({ ...draft, possession: v })} />
                </div>
              </DraftCard>
              <div className="flex justify-between">
                <button type="button" className="inline-flex items-center h-8 px-3 rounded-button border border-border bg-white text-[12.5px]" onClick={prev}>
                  Back
                </button>
                <button type="button" className="apply-btn" onClick={next}>
                  Looks right — set the goal →
                </button>
              </div>
            </>
          )}

          {stage === "goal" && (
            <>
              <SpotBubble>
                Most luxury Bengaluru launches at this price band convert ~3% of leads to verified.
                I&apos;ve drafted <strong>{draft.goalTarget} verified leads</strong> over{" "}
                <strong>{draft.goalWindow}</strong> — feel free to dial it.
              </SpotBubble>
              <DraftCard>
                <div className="text-[10.5px] uppercase tracking-[0.4px] text-text-tertiary mb-2">Goal kind</div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(["leads", "verified", "qualified"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDraft({ ...draft, goalKind: k })}
                      className="card-base text-left p-2.5"
                      style={{
                        background: draft.goalKind === k ? "#1A1A1A" : "#FFF",
                        color: draft.goalKind === k ? "#FFF" : "var(--text-1)",
                        borderColor: draft.goalKind === k ? "#1A1A1A" : "var(--border)",
                      }}
                    >
                      <div className="text-[12.5px] font-medium capitalize">{k} leads</div>
                      {k === "verified" && (
                        <div className="text-[10.5px] mt-0.5" style={{ color: draft.goalKind === k ? "rgba(255,255,255,0.7)" : "var(--text-tertiary)" }}>
                          Spot recommends
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Target count" value={draft.goalTarget} onChange={(v) => setDraft({ ...draft, goalTarget: v })} />
                  <Field label="Window" value={draft.goalWindow} onChange={(v) => setDraft({ ...draft, goalWindow: v })} />
                </div>
              </DraftCard>
              <div className="flex justify-between">
                <button type="button" className="inline-flex items-center h-8 px-3 rounded-button border border-border bg-white text-[12.5px]" onClick={prev}>
                  Back
                </button>
                <button type="button" className="apply-btn" onClick={next}>
                  Set goal — draft personas →
                </button>
              </div>
            </>
          )}

          {stage === "personas" && (
            <>
              <SpotBubble>
                I borrowed 3 personas from your existing Bengaluru playbooks. Approve what fits, drop
                what doesn&apos;t, and we can add more via the project page later.
              </SpotBubble>
              <DraftCard>
                <div className="space-y-2">
                  {draft.personas.map((p, i) => (
                    <div
                      key={i}
                      className="card-base bg-white flex items-center gap-3 p-3"
                    >
                      <div
                        className="flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, oklch(0.85 0.06 ${i * 80}) 0%, oklch(0.72 0.08 ${i * 80 + 40}) 100%)`,
                          color: "rgba(0,0,0,0.55)",
                        }}
                      >
                        {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium">{p.name}</div>
                        <div className="text-[11px] text-text-tertiary">{p.role}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...draft.personas];
                          next[i] = { ...next[i], approved: !next[i].approved };
                          setDraft({ ...draft, personas: next });
                        }}
                        className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-button text-[11.5px] ${
                          p.approved
                            ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]"
                            : "bg-white border border-border text-text-secondary"
                        }`}
                      >
                        <Check size={11} /> {p.approved ? "Approved" : "Approve"}
                      </button>
                    </div>
                  ))}
                </div>
              </DraftCard>
              <div className="flex justify-between">
                <button type="button" className="inline-flex items-center h-8 px-3 rounded-button border border-border bg-white text-[12.5px]" onClick={prev}>
                  Back
                </button>
                <button type="button" className="apply-btn" onClick={next}>
                  Approve {draft.personas.filter((p) => p.approved).length} &amp; continue →
                </button>
              </div>
            </>
          )}

          {stage === "review" && (
            <>
              <SpotBubble>
                <strong>Here&apos;s what gets created.</strong> When you confirm I&apos;ll save the
                project and you&apos;ll land on its detail page. You can launch campaigns from there.
              </SpotBubble>
              <div
                className="rounded-[12px] overflow-hidden mb-3"
                style={{
                  background: "linear-gradient(135deg, #FBF7FF 0%, #FFF 60%)",
                  border: "1px solid #C8A8FF",
                }}
              >
                <div
                  className="px-4 py-2.5"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
                    color: "#FFF",
                  }}
                >
                  <div className="text-[12px] uppercase tracking-wide font-semibold">Review &amp; deploy</div>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label: "Project name", value: draft.name },
                    { label: "Micromarket", value: draft.micromarket },
                    { label: "Typology · Price", value: `${draft.typology} · ${draft.priceBand}` },
                    {
                      label: "Goal",
                      value: `${draft.goalTarget} ${draft.goalKind} leads in ${draft.goalWindow}`,
                    },
                    {
                      label: "Personas",
                      value: `${draft.personas.filter((p) => p.approved).length} approved · ${draft.personas.length - draft.personas.filter((p) => p.approved).length} on hold`,
                    },
                  ].map((l) => (
                    <div key={l.label} className="grid" style={{ gridTemplateColumns: "140px 1fr", gap: 12 }}>
                      <div className="uplabel" style={{ fontSize: 10 }}>
                        {l.label}
                      </div>
                      <div className="text-[12.5px]">{l.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button type="button" className="inline-flex items-center h-8 px-3 rounded-button border border-border bg-white text-[12.5px]" onClick={prev}>
                  Back
                </button>
                <button
                  type="button"
                  className="apply-btn"
                  style={{
                    height: 32,
                    fontSize: 13,
                    padding: "0 14px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
                  }}
                  onClick={() => {
                    showToast("Project draft created");
                    // For MVP, route the user to the closest seed project so the page renders.
                    onComplete("godrej-aristocrat");
                  }}
                >
                  <Check size={13} /> Create project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
