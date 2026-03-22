"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  CircleCheck,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Lightbulb,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  campaignDiagnosis,
  adSetsData,
  campaignDetail,
} from "@/lib/campaign-data";
import { analysisChartData, chartMetricOptions } from "@/lib/wizard-data";
import type { AdSetRow } from "@/lib/campaign-data";

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function DiagnosisBadge({ diagnosis }: { diagnosis: AdSetRow["diagnosis"] }) {
  const config = {
    "on-track": { icon: CircleCheck, label: "On Track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": {
      icon: AlertTriangle,
      label: "Attention",
      cls: "text-[#92400E] bg-[#FEF3C7]",
    },
    "pause-candidate": {
      icon: XCircle,
      label: "Pause",
      cls: "text-status-error bg-[#FEF2F2]",
    },
  };
  const { icon: Icon, label, cls } = config[diagnosis];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}
    >
      <Icon size={11} strokeWidth={2} />
      {label}
    </span>
  );
}

function CampaignStatusBadge({
  status,
}: {
  status: "on-target" | "near-target" | "off-target";
}) {
  const config = {
    "on-target": { label: "On Target", cls: "bg-[#F0FDF4] text-[#15803D]" },
    "near-target": { label: "Near Target", cls: "bg-[#FEF3C7] text-[#92400E]" },
    "off-target": { label: "Off Target", cls: "bg-[#FEF2F2] text-[#DC2626]" },
  };
  const { label, cls } = config[status];
  return (
    <span
      className={`inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-badge ${cls}`}
    >
      {label}
    </span>
  );
}

// Dashboard-style metric card
interface AnalysisMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: { value: number; direction: "up" | "down"; positive?: boolean };
  chartKey?: string;
  isSelected?: boolean;
  isMaxed?: boolean;
  onToggle?: () => void;
}

function AnalysisMetricCard({
  label,
  value,
  subtext,
  trend,
  chartKey,
  isSelected,
  isMaxed,
  onToggle,
}: AnalysisMetricCardProps) {
  const trendIsPositive = trend
    ? trend.positive !== undefined
      ? trend.positive
      : trend.direction === "up"
    : false;

  return (
    <button
      onClick={onToggle}
      className={`relative bg-white border rounded-card px-4 py-3.5 text-left w-full transition-all duration-150 ${
        isSelected
          ? "border-accent ring-1 ring-accent/20 hover:shadow-card-hover hover:-translate-y-px"
          : isMaxed && chartKey
          ? "border-border opacity-60 cursor-not-allowed"
          : "border-border hover:shadow-card-hover hover:-translate-y-px"
      } ${chartKey && !isMaxed ? "cursor-pointer" : chartKey && isSelected ? "cursor-pointer" : !chartKey ? "cursor-default" : ""}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px]">
          {label}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
              trendIsPositive ? "text-status-success" : "text-status-error"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight size={11} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={11} strokeWidth={2.5} />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      <span className="text-[22px] font-semibold text-text-primary leading-tight tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      {subtext && (
        <div className="mt-1.5 text-[11px] text-text-tertiary">{subtext}</div>
      )}
      {isSelected && chartKey && (
        <div
          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
          style={{
            backgroundColor:
              chartMetricOptions.find((m) => m.key === chartKey)?.color || "#1A1A1A",
          }}
        />
      )}
    </button>
  );
}

const metricCards = [
  {
    label: "Total spend",
    value: "₹2.2L",
    subtext: "₹2,20,000",
    chartKey: "spend",
    trend: { value: 25.9, direction: "up" as const },
  },
  {
    label: "Total leads",
    value: 186,
    chartKey: "leads",
    trend: { value: 12, direction: "up" as const },
  },
  {
    label: "Verified leads",
    value: 42,
    subtext: "22.6% rate",
    chartKey: "verifiedLeads",
    trend: { value: 22.1, direction: "up" as const },
  },
  {
    label: "CPL",
    value: "₹1,183",
    subtext: "vs target ₹1,200",
    chartKey: "cpl",
    trend: { value: 5, direction: "down" as const, positive: true },
  },
  {
    label: "Qualified (SQL)",
    value: 22,
    subtext: "11.8% rate",
    chartKey: "qualifiedLeads",
    trend: { value: 7.9, direction: "up" as const },
  },
  {
    label: "CTR",
    value: "2.1%",
    chartKey: "ctr",
    trend: { value: 15, direction: "up" as const },
  },
  {
    label: "CPVL",
    value: "₹5,238",
    subtext: "Cost per verified",
    trend: { value: 3.1, direction: "up" as const, positive: false },
  },
  {
    label: "CPQL",
    value: "₹10,000",
    subtext: "Cost per SQL",
  },
  {
    label: "Margin %",
    value: "1.4%",
    subtext: "vs target",
  },
  {
    label: "Daily budget",
    value: "₹8,000",
  },
  {
    label: "Sent to CRM",
    value: 18,
    subtext: "81.8% of SQL",
  },
  {
    label: "AI qualified",
    value: 34,
    subtext: "18.3% rate",
  },
];

export function AnalysisTab() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["cpl"]);

  const MAX_METRICS = 3;

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_METRICS) return prev; // cap at 3
      return [...prev, key];
    });
  };

  const selectedOptions = chartMetricOptions.filter((m) =>
    selectedMetrics.includes(m.key)
  );
  const hasCurrency = selectedOptions.some((m) => m.format === "currency");
  const hasNumber = selectedOptions.some(
    (m) => m.format === "number" || m.format === "percent"
  );
  const needsDualAxis = hasCurrency && hasNumber;

  return (
    <div className="space-y-5">
      {/* Target CPL Bar */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-badge bg-surface-secondary text-text-secondary">
          <Target size={13} strokeWidth={1.5} />
          Target CPL: ₹{campaignDetail.targetCPL.toLocaleString("en-IN")}
        </span>
        <CampaignStatusBadge status={campaignDiagnosis.status} />
      </div>

      {/* Metric Cards — Dashboard style, 4x3 grid */}
      <div className="grid grid-cols-4 gap-3">
        {metricCards.map((m) => {
          const isSelected = m.chartKey ? selectedMetrics.includes(m.chartKey) : false;
          return (
            <AnalysisMetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              subtext={m.subtext}
              trend={m.trend}
              chartKey={m.chartKey}
              isSelected={isSelected}
              isMaxed={!isSelected && selectedMetrics.length >= MAX_METRICS}
              onToggle={m.chartKey ? () => toggleMetric(m.chartKey!) : undefined}
            />
          );
        })}
      </div>

      {/* Hint */}
      <div className="text-[11px] text-text-tertiary">
        Click metric cards to add/remove from chart •{" "}
        {selectedMetrics.length}/{MAX_METRICS} selected
        {selectedMetrics.length >= MAX_METRICS && (
          <span className="text-text-tertiary ml-1">(max reached — deselect one to add another)</span>
        )}
      </div>

      {/* Multi-metric Chart */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-section-header text-text-primary">Trend Analysis</h3>
          <div className="flex items-center gap-3">
            {selectedOptions.map((opt) => (
              <div key={opt.key} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="text-[11px] text-text-secondary">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
          {selectedMetrics.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-text-tertiary">
              Click a metric card above to plot it on the chart
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analysisChartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9B9B9B" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#9B9B9B" }}
                  axisLine={{ stroke: "#E5E5E5" }}
                  tickLine={false}
                  tickFormatter={(v: number) => {
                    if (hasCurrency)
                      return v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;
                    return `${v}`;
                  }}
                />
                {needsDualAxis && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#9B9B9B" }}
                    axisLine={{ stroke: "#E5E5E5" }}
                    tickLine={false}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  formatter={(value, name) => {
                    const opt = chartMetricOptions.find((m) => m.key === name);
                    if (opt?.format === "currency")
                      return [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        opt.label,
                      ];
                    if (opt?.format === "percent") return [`${value}%`, opt.label];
                    return [value, opt?.label || String(name)];
                  }}
                />
                {selectedMetrics.includes("cpl") && (
                  <ReferenceLine
                    yAxisId="left"
                    y={campaignDetail.targetCPL}
                    stroke="#9B9B9B"
                    strokeDasharray="6 4"
                    label={{
                      value: `Target ₹${campaignDetail.targetCPL}`,
                      position: "insideTopRight",
                      fill: "#9B9B9B",
                      fontSize: 11,
                    }}
                  />
                )}
                {selectedOptions.map((opt) => (
                  <Line
                    key={opt.key}
                    type="monotone"
                    dataKey={opt.key}
                    yAxisId={
                      needsDualAxis &&
                      (opt.format === "number" || opt.format === "percent")
                        ? "right"
                        : "left"
                    }
                    stroke={opt.color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: opt.color, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: opt.color, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Diagnosis Card */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-section-header text-text-primary">Campaign Diagnosis</h3>
          <CampaignStatusBadge status={campaignDiagnosis.status} />
        </div>
        <p className="text-[13px] text-text-primary leading-relaxed mb-5">
          {campaignDiagnosis.summary}
        </p>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">
                Why
              </span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.reasons.map((r, i) => (
                <li
                  key={i}
                  className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-text-tertiary before:rounded-full"
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Lightbulb size={14} strokeWidth={1.5} className="text-text-tertiary" />
              <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">
                What to do
              </span>
            </div>
            <ul className="space-y-2">
              {campaignDiagnosis.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="text-[12px] text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-accent before:rounded-full"
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ad Sets Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h3 className="text-section-header text-text-primary">Ad Sets Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Ad Set", align: "left" },
                  { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" },
                  { label: "Verified", align: "right" },
                  { label: "QLs", align: "right" },
                  { label: "CPL", align: "right" },
                  { label: "CPQL", align: "right" },
                  { label: "CTR%", align: "right" },
                  { label: "Enriched%", align: "right" },
                  { label: "SQL%", align: "right" },
                  { label: "Diagnosis", align: "center" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-3 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align} whitespace-nowrap`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adSetsData.map((adset, i) => (
                <tr
                  key={adset.id}
                  className={`border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-3 py-2.5 text-[12px] text-text-primary font-medium whitespace-nowrap max-w-[180px] truncate">
                    {adset.name}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {formatCurrency(adset.spend)}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.leads}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    <span className="text-[12px] text-text-primary">{adset.verifiedLeads}</span>
                    <span className="text-[10px] text-text-tertiary ml-0.5">
                      ({Math.round((adset.verifiedLeads / adset.leads) * 100)}%)
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.qualifiedLeads}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    ₹{adset.cpl.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.cpql > 0 ? `₹${adset.cpql.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.ctr}%
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.enrichedPercent}%
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-text-primary text-right tabular-nums">
                    {adset.sqlPercent}%
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <DiagnosisBadge diagnosis={adset.diagnosis} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
