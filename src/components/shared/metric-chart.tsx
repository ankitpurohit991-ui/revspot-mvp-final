"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { X } from "lucide-react";

const LINE_COLORS = ["#1A1A1A", "#3B82F6", "#22C55E"];

export interface MetricChartDef {
  key: string;
  label: string;
  unit: "currency" | "percentage" | "number";
  data: number[];
}

interface MetricChartProps {
  metrics: MetricChartDef[];
  dates: string[];
  onRemove: (key: string) => void;
  maxMetrics?: number;
}

export function MetricChart({ metrics, dates, onRemove, maxMetrics = 3 }: MetricChartProps) {
  if (metrics.length === 0) return null;

  const chartData = dates.map((date, i) => {
    const point: Record<string, string | number> = { date };
    metrics.forEach((m) => { point[m.key] = m.data[i] ?? 0; });
    return point;
  });

  const hasCurrency = metrics.some((m) => m.unit === "currency");
  const hasNonCurrency = metrics.some((m) => m.unit !== "currency");
  const needsDualAxis = hasCurrency && hasNonCurrency;

  const formatValue = (v: number, unit: string) => {
    if (unit === "currency") return v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;
    if (unit === "percentage") return `${v}%`;
    return `${v}`;
  };

  return (
    <div className="bg-white border border-border rounded-card p-5 space-y-3">
      {/* Selected pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px]">Chart</span>
        {metrics.map((m, i) => (
          <span key={m.key} className="inline-flex items-center gap-1.5 h-6 px-2 text-[10px] font-medium bg-surface-secondary rounded-badge text-text-primary">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} />
            {m.label}
            <button onClick={() => onRemove(m.key)} className="text-text-tertiary hover:text-text-primary transition-colors">
              <X size={10} strokeWidth={2} />
            </button>
          </span>
        ))}
        <span className="text-[10px] text-text-tertiary">{metrics.length}/{maxMetrics}</span>
      </div>

      {/* Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9B9B9B" }} axisLine={{ stroke: "#E5E5E5" }} tickLine={false} interval={2} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: "#9B9B9B" }}
              axisLine={{ stroke: "#E5E5E5" }}
              tickLine={false}
              tickFormatter={(v: number) => formatValue(v, metrics[0]?.unit || "number")}
            />
            {needsDualAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fill: "#9B9B9B" }}
                axisLine={{ stroke: "#E5E5E5" }}
                tickLine={false}
                tickFormatter={(v: number) => {
                  const rightMetric = metrics.find((m) => m.unit !== metrics[0]?.unit);
                  return formatValue(v, rightMetric?.unit || "number");
                }}
              />
            )}
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: "6px", fontSize: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              formatter={(value, name) => {
                const meta = metrics.find((m) => m.key === name);
                if (meta?.unit === "currency") return [`₹${Number(value).toLocaleString("en-IN")}`, meta.label];
                if (meta?.unit === "percentage") return [`${value}%`, meta.label];
                return [value, meta?.label || String(name)];
              }}
            />
            {metrics.map((m, i) => {
              const isFirstUnit = m.unit === metrics[0]?.unit;
              return (
                <Line key={m.key} type="monotone" dataKey={m.key}
                  yAxisId={needsDualAxis && !isFirstUnit ? "right" : "left"}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2}
                  dot={{ r: 2.5, fill: LINE_COLORS[i % LINE_COLORS.length], strokeWidth: 0 }}
                  activeDot={{ r: 4.5, fill: LINE_COLORS[i % LINE_COLORS.length], strokeWidth: 0 }} />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
