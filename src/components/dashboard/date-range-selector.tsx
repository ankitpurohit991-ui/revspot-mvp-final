"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";

const presets = [
  { label: "Yesterday", value: "1", rangeText: "Mar 22, 2026", prevText: "vs Mar 21" },
  { label: "Last 7 days", value: "7", rangeText: "Mar 17 — Mar 23, 2026", prevText: "vs Mar 10 — Mar 16" },
  { label: "Last 14 days", value: "14", rangeText: "Mar 10 — Mar 23, 2026", prevText: "vs Feb 24 — Mar 9" },
  { label: "Last 30 days", value: "30", rangeText: "Feb 22 — Mar 23, 2026", prevText: "vs Jan 23 — Feb 21" },
  { label: "Last 60 days", value: "60", rangeText: "Jan 23 — Mar 23, 2026", prevText: "vs Nov 24 — Jan 22" },
  { label: "Last 90 days", value: "90", rangeText: "Dec 24 — Mar 23, 2026", prevText: "vs Sep 25 — Dec 23" },
  { label: "Custom", value: "custom", rangeText: "", prevText: "" },
];

export function DateRangeSelector() {
  const [selected, setSelected] = useState("30");
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState("2026-03-01");
  const [customEnd, setCustomEnd] = useState("2026-03-23");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const preset = presets.find((p) => p.value === selected);
  const displayLabel = selected === "custom" ? "Custom range" : preset?.label || "Last 30 days";
  const rangeText = selected === "custom"
    ? `${new Date(customStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(customEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : preset?.rangeText || "";
  const prevText = selected === "custom" ? "vs previous period" : preset?.prevText || "";

  return (
    <div ref={ref} className="relative text-right">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 bg-white border border-border rounded-input text-[13px] text-text-primary hover:border-border-hover transition-colors duration-150"
      >
        <Calendar size={14} strokeWidth={1.5} className="text-text-tertiary" />
        <span>{displayLabel}</span>
        <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
      </button>
      {rangeText && (
        <div className="mt-1">
          <div className="text-[11px] text-text-secondary">{rangeText}</div>
          {prevText && <div className="text-[10px] text-text-tertiary">{prevText}</div>}
        </div>
      )}
      {open && (
        <div className="absolute right-0 top-10 bg-white border border-border rounded-card shadow-lg py-1 z-20 min-w-[200px]">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                if (p.value !== "custom") { setSelected(p.value); setOpen(false); }
                else setSelected("custom");
              }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors duration-150 ${
                selected === p.value ? "text-text-primary font-medium bg-surface-secondary" : "text-text-secondary hover:bg-surface-page"
              }`}
            >
              {p.label}
            </button>
          ))}
          {selected === "custom" && (
            <div className="px-3 py-2 border-t border-border-subtle space-y-2">
              <div>
                <label className="text-[10px] text-text-tertiary uppercase tracking-[0.3px]">Start</label>
                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full h-8 px-2 text-[12px] border border-border rounded-input mt-0.5 focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-[10px] text-text-tertiary uppercase tracking-[0.3px]">End</label>
                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full h-8 px-2 text-[12px] border border-border rounded-input mt-0.5 focus:outline-none focus:border-accent" />
              </div>
              <button onClick={() => setOpen(false)} className="w-full h-8 bg-accent text-white text-[12px] font-medium rounded-button hover:bg-accent-hover transition-colors">
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
