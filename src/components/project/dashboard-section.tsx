"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Sparkles,
  Target,
  ArrowUpRight,
  X,
  Star,
  Video as VideoIcon,
  Image as ImageIcon,
} from "lucide-react";
import type { ProjectDetail, Persona } from "@/lib/project-data";
import { SectionHeader } from "./shared/section-header";
import {
  computeMetrics,
  formatMetric,
  formatDelta,
  deltaColor,
  type MetricSnapshot,
} from "./dashboard-metrics";
import { Sparkline, LargeChart } from "./metric-charts";
import { getWinningConcept, type WinningConcept } from "./persona-hierarchy";
import { PlacementsAnalysis } from "./placements-analysis";

/**
 * Dashboard tab — project pulse, organized around business outcomes.
 *
 * Three metric groups (no operational TOFU at the project level):
 *   · Outcomes — Verified, Qualified, CPVL, CPQL
 *   · Pipeline — Total leads, CPL, Verification %, Qualification %
 *   · Spend & pacing — Spend, Daily burn, Days to goal
 *
 * Plus:
 *   · Pacing strip (goal-anchored)
 *   · Persona performance — winning concept + TOFU signal per persona
 *   · Placements analysis — Meta surface-by-surface breakdown
 *   · Spot's read — derived insights
 */
export function DashboardSection({
  project,
  onAsk,
}: {
  project: ProjectDetail;
  onAsk: (q: string) => void;
}) {
  const metrics = useMemo(() => computeMetrics(project), [project]);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const focused = focusedKey
    ? metrics.find((m) => m.def.key === focusedKey) ?? null
    : null;

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={BarChart3}
        title="Dashboard"
        subtitle="project pulse · click any tile for the 14-day chart"
        onAsk={() =>
          onAsk("Summarize how this project is performing this week against goal")
        }
        actions={
          <a
            href={`/projects/${project.id}/deep/dashboard`}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-button border border-border bg-white text-[11.5px] hover:border-border-hover"
          >
            <ArrowUpRight size={11} /> Deep dive
          </a>
        }
      />

      <PacingStrip project={project} />

      <MetricGroup
        title="Outcomes"
        sub="goal-relevant numbers"
        metrics={metrics.filter((m) => m.def.category === "outcome")}
        focusedKey={focusedKey}
        onSelect={(key) => setFocusedKey((cur) => (cur === key ? null : key))}
      />

      <MetricGroup
        title="Pipeline"
        sub="lead flow + conversion"
        metrics={metrics.filter((m) => m.def.category === "pipeline")}
        focusedKey={focusedKey}
        onSelect={(key) => setFocusedKey((cur) => (cur === key ? null : key))}
      />

      <MetricGroup
        title="Spend & pacing"
        sub="burn rate · runway"
        metrics={metrics.filter((m) => m.def.category === "spend")}
        focusedKey={focusedKey}
        onSelect={(key) => setFocusedKey((cur) => (cur === key ? null : key))}
      />

      {focused && (
        <ExpandedChart
          snapshot={focused}
          onClose={() => setFocusedKey(null)}
          project={project}
        />
      )}

      <PersonaPerformance project={project} />
      <PlacementsAnalysis project={project} />
      <SpotInsightsCard project={project} onAsk={onAsk} />
    </div>
  );
}

// ─── Pacing strip ───────────────────────────────────────────────────────

function PacingStrip({ project }: { project: ProjectDetail }) {
  const goal = project.goal;
  const goalSet = goal.target > 0;
  return (
    <div
      className="rounded-[12px] p-4"
      style={{
        background:
          "linear-gradient(135deg, #FBF7FF 0%, #FFFDF6 60%, #FFFFFF 100%)",
        border: "1px solid #DCC8FF",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
              color: "#FFF",
            }}
          >
            <Target size={16} />
          </span>
          <div>
            <div
              className="uplabel"
              style={{ fontSize: 9.5, color: "#7C3AED", letterSpacing: "0.4px" }}
            >
              {goalSet ? `Goal · ${goal.kind} leads` : "Goal"}
            </div>
            <div className="text-[15px] font-semibold leading-tight">
              {goalSet ? `${goal.achieved} / ${goal.target}` : "No goal set"}
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />

        <PacingStat
          label="Day"
          value={goalSet ? `${goal.daysElapsed} / ${goal.daysTotal}` : "—"}
        />
        <PacingStat
          label="Forecast"
          value={goalSet ? `${goal.forecast}` : "—"}
          accent={
            goalSet && goal.forecast >= goal.target
              ? "var(--ok-fg)"
              : "var(--err-fg)"
          }
        />
        <PacingStat
          label="Pace"
          value={goalSet ? goal.pace : "—"}
          accent={
            goal.pace === "ahead"
              ? "var(--ok-fg)"
              : goal.pace === "behind"
                ? "var(--err-fg)"
                : "var(--text-1)"
          }
        />

        <div className="flex-1" />

        {goalSet ? (
          <div className="text-[11px] text-text-tertiary italic max-w-[300px] text-right">
            {goal.spotRead}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PacingStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="uplabel" style={{ fontSize: 9.5 }}>
        {label}
      </div>
      <div
        className="tabular-nums"
        style={{ fontSize: 15, fontWeight: 600, color: accent || "var(--text-1)" }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Metric group ───────────────────────────────────────────────────────

function MetricGroup({
  title,
  sub,
  metrics,
  focusedKey,
  onSelect,
}: {
  title: string;
  sub: string;
  metrics: MetricSnapshot[];
  focusedKey: string | null;
  onSelect: (key: string) => void;
}) {
  if (metrics.length === 0) return null;
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="uplabel" style={{ fontSize: 9.5 }}>
          {title}
        </span>
        <span className="text-[10.5px] text-text-tertiary">{sub}</span>
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, minmax(0,1fr))`,
        }}
      >
        {metrics.map((m) => (
          <MetricTile
            key={m.def.key}
            snapshot={m}
            focused={focusedKey === m.def.key}
            onClick={() => onSelect(m.def.key)}
          />
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  snapshot,
  focused,
  onClick,
}: {
  snapshot: MetricSnapshot;
  focused: boolean;
  onClick: () => void;
}) {
  const goodTrend =
    !snapshot.delta || snapshot.delta.sign === "flat"
      ? undefined
      : snapshot.def.higherIsBetter
        ? snapshot.delta.sign === "up"
        : snapshot.delta.sign === "down";

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-base p-3 text-left transition-shadow"
      style={{
        background: "#FFF",
        border: `1.5px solid ${focused ? "#1A1A1A" : "var(--border-subtle)"}`,
        boxShadow: focused ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
        cursor: "pointer",
      }}
      title={snapshot.def.hint}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className="uplabel truncate"
          style={{ fontSize: 9.5, color: "var(--text-tertiary)" }}
        >
          {snapshot.def.label}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div
            className="tabular-nums"
            style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.05 }}
          >
            {formatMetric(snapshot.current, snapshot.def.unit)}
          </div>
          <div
            className="text-[10px] tabular-nums mt-1"
            style={{
              color: deltaColor(snapshot.delta, snapshot.def.higherIsBetter),
            }}
          >
            {formatDelta(snapshot.delta)}
          </div>
        </div>
        <Sparkline series={snapshot.series} trendUp={goodTrend} />
      </div>
    </button>
  );
}

// ─── Expanded chart ─────────────────────────────────────────────────────

function ExpandedChart({
  snapshot,
  onClose,
  project,
}: {
  snapshot: MetricSnapshot;
  onClose: () => void;
  project: ProjectDetail;
}) {
  const goodTrend =
    !snapshot.delta || snapshot.delta.sign === "flat"
      ? null
      : snapshot.def.higherIsBetter
        ? snapshot.delta.sign === "up"
        : snapshot.delta.sign === "down";
  return (
    <div className="card-base p-4 fadeUp">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <div
            className="uplabel mb-1"
            style={{ fontSize: 9.5, color: "var(--text-tertiary)" }}
          >
            {snapshot.def.label} · last 14 days
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="tabular-nums"
              style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {formatMetric(snapshot.current, snapshot.def.unit)}
            </span>
            <span
              className="text-[12px] tabular-nums"
              style={{
                color: deltaColor(snapshot.delta, snapshot.def.higherIsBetter),
              }}
            >
              {formatDelta(snapshot.delta)}
            </span>
            {goodTrend != null && (
              <span
                className="pill"
                style={{
                  fontSize: 10,
                  background: goodTrend ? "var(--ok-bg)" : "var(--err-bg)",
                  color: goodTrend ? "var(--ok-fg)" : "var(--err-fg)",
                }}
              >
                {goodTrend ? "Trending well" : "Watch this"}
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-text-secondary mt-1 leading-[1.5] max-w-[600px]">
            {snapshot.def.hint}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center h-7 w-7 rounded-button text-text-tertiary hover:text-text-secondary hover:bg-surface-secondary"
          title="Close"
        >
          <X size={13} />
        </button>
      </div>

      <LargeChart snapshot={snapshot} />

      <PersonaBreakdown project={project} metricKey={snapshot.def.key} />
    </div>
  );
}

function PersonaBreakdown({
  project,
  metricKey,
}: {
  project: ProjectDetail;
  metricKey: string;
}) {
  if (!["verified", "cpvl", "leads"].includes(metricKey)) return null;
  const cells = project.personas.map((p) => {
    let display: string = "—";
    if (metricKey === "verified") display = String(p.verifiedLeads);
    if (metricKey === "cpvl") display = p.cpvl;
    if (metricKey === "leads") display = String(p.verifiedLeads * 2);
    return { id: p.id, name: p.name, share: p.share, display };
  });
  if (cells.length === 0) return null;
  return (
    <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="uplabel mb-2" style={{ fontSize: 9.5 }}>
        By persona
      </div>
      <div className="space-y-1.5">
        {cells.map((c) => (
          <div key={c.id} className="flex items-center gap-3 text-[11.5px]">
            <span className="flex-1 min-w-0 truncate font-medium">{c.name}</span>
            <span
              className="tabular-nums text-text-tertiary"
              style={{ width: 48, textAlign: "right" }}
            >
              {c.share}%
            </span>
            <span className="tabular-nums" style={{ width: 96, textAlign: "right" }}>
              {c.display}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Persona performance (with TOFU-based winning concept) ──────────────

function PersonaPerformance({ project }: { project: ProjectDetail }) {
  const ranked = [...project.personas].sort((a, b) => {
    if (b.verifiedLeads !== a.verifiedLeads)
      return b.verifiedLeads - a.verifiedLeads;
    return b.share - a.share;
  });
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="uplabel" style={{ fontSize: 9.5 }}>
            Persona performance
          </span>
          <span className="text-[10.5px] text-text-tertiary">
            winning concept picked on TOFU signal only · CTR for static · Hook Rate for video
          </span>
        </div>
      </div>
      <div className="card-base overflow-hidden">
        <div
          className="grid px-3.5 py-2 text-[10.5px] uppercase tracking-[0.4px] text-text-tertiary font-semibold"
          style={{
            gridTemplateColumns:
              "32px 1.6fr 1.8fr 0.7fr 0.7fr 0.7fr 0.7fr 0.6fr",
            background: "var(--bg-page)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <span>#</span>
          <span>Persona</span>
          <span>Winning concept</span>
          <span className="text-right">TOFU</span>
          <span className="text-right">CVR</span>
          <span className="text-right">Verified</span>
          <span className="text-right">CPVL</span>
          <span className="text-right">Share</span>
        </div>
        {ranked.map((p, i) => (
          <PersonaPerformanceRow key={p.id} rank={i + 1} persona={p} />
        ))}
        {project.personas.length === 0 && (
          <div className="px-3.5 py-6 text-center text-[12px] text-text-tertiary">
            No personas yet — add one on the Personas tab.
          </div>
        )}
      </div>
    </div>
  );
}

function PersonaPerformanceRow({
  rank,
  persona,
}: {
  rank: number;
  persona: Persona;
}) {
  const winner = getWinningConcept(persona);
  return (
    <div
      className="grid items-center px-3.5 py-2.5 text-[12px]"
      style={{
        gridTemplateColumns:
          "32px 1.6fr 1.8fr 0.7fr 0.7fr 0.7fr 0.7fr 0.6fr",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <span className="tabular-nums text-text-tertiary">#{rank}</span>
      <span className="font-medium truncate" title={persona.role}>
        {persona.name}
      </span>
      <WinningConceptCell winner={winner} />
      <span className="text-right tabular-nums">
        {winner ? `${winner.tofu.value.toFixed(2)}%` : "—"}
      </span>
      <span className="text-right tabular-nums">
        {winner?.cvr != null ? `${winner.cvr.toFixed(1)}%` : "—"}
      </span>
      <span className="text-right tabular-nums">{persona.verifiedLeads}</span>
      <span className="text-right tabular-nums">{persona.cpvl}</span>
      <span className="text-right tabular-nums">{persona.share}%</span>
    </div>
  );
}

function WinningConceptCell({
  winner,
}: {
  winner: WinningConcept | null;
}) {
  if (!winner) {
    return (
      <span className="text-text-tertiary italic text-[11.5px]">
        No TOFU data yet
      </span>
    );
  }
  const isVideo = winner.concept.kind === "video";
  const Icon = isVideo ? VideoIcon : ImageIcon;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="inline-flex items-center gap-1 flex-shrink-0 uppercase"
        style={{
          background: isVideo ? "#F4ECFF" : "var(--bg-secondary)",
          color: isVideo ? "#7C3AED" : "var(--text-2)",
          fontSize: 9.5,
          fontWeight: 600,
          padding: "2px 6px",
          borderRadius: 4,
          letterSpacing: 0.3,
        }}
      >
        <Icon size={9} /> {isVideo ? "Video" : "Static"}
      </span>
      <span className="truncate font-medium" title={winner.angle.name}>
        {winner.angle.name}
      </span>
      <Star
        size={10}
        strokeWidth={2.5}
        className="flex-shrink-0"
        style={{ color: "#15803D" }}
      />
    </div>
  );
}

// ─── Spot insights ──────────────────────────────────────────────────────

function SpotInsightsCard({
  project,
  onAsk,
}: {
  project: ProjectDetail;
  onAsk: (q: string) => void;
}) {
  const insights: string[] = [];
  const liveCount = project.mediaPlan.rows.filter(
    (r) => r.status === "live",
  ).length;
  if (project.goal.target === 0) {
    insights.push(
      "Set a goal first — without a target, projected pace and gap-to-goal can't be calculated.",
    );
  } else if (project.goal.pace === "behind") {
    insights.push(
      `You're tracking behind goal — forecast is ${project.goal.forecast} of ${project.goal.target}. Open the goal popover for a plan-to-close-gap.`,
    );
  } else if (project.goal.pace === "ahead") {
    insights.push(
      `Ahead of pace by ${project.goal.paceDelta}. Consider raising the goal target or reallocating budget to a stretch persona.`,
    );
  }
  if (liveCount === 0 && project.mediaPlan.rows.length > 0) {
    insights.push(
      `${project.mediaPlan.rows.length} campaign${project.mediaPlan.rows.length === 1 ? "" : "s"} drafted, none live yet — deploy from the Campaigns tab.`,
    );
  }
  if (
    project.personas.length > 0 &&
    project.personas.every((p) => p.angles.length <= 1)
  ) {
    insights.push(
      "Most personas have only one angle — drafting a second angle per persona usually lifts CPVL within a week.",
    );
  }

  return (
    <div>
      <div className="uplabel mb-2" style={{ fontSize: 9.5 }}>
        Spot&apos;s read
      </div>
      <div
        className="rounded-[10px] p-3.5"
        style={{
          background: "var(--spot-tint)",
          border: "1px solid var(--spot-stroke)",
        }}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="inline-flex items-center justify-center flex-shrink-0"
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background:
                "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
              color: "#FFF",
            }}
          >
            <Sparkles size={13} />
          </span>
          <div className="flex-1 min-w-0">
            {insights.length > 0 ? (
              <ul className="space-y-1.5">
                {insights.map((line, i) => (
                  <li
                    key={i}
                    className="text-[12px] text-text-secondary leading-[1.55]"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[12px] text-text-secondary leading-[1.55]">
                Everything looks healthy. Ask me anything about this project.
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                onAsk("Give me a week-over-week recap for this project")
              }
              className="mt-2.5 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-button bg-white text-[11.5px] hover:border-border-hover"
              style={{ border: "1px solid var(--border)" }}
            >
              <Sparkles size={11} /> Ask Spot for the full recap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
