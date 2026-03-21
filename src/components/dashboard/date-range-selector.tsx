"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";

const presets = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 14 days", value: "14" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 60 days", value: "60" },
  { label: "Last 90 days", value: "90" },
];

export function DateRangeSelector() {
  const [selected, setSelected] = useState("30");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = presets.find((p) => p.value === selected)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 bg-white border border-border rounded-input text-[13px] text-text-primary hover:border-border-hover transition-colors duration-150"
      >
        <Calendar size={14} strokeWidth={1.5} className="text-text-tertiary" />
        <span>{selectedLabel}</span>
        <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-card shadow-card-hover py-1 z-20 min-w-[160px]">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setSelected(preset.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors duration-150 ${
                selected === preset.value
                  ? "text-text-primary font-medium bg-surface-secondary"
                  : "text-text-secondary hover:bg-surface-page"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
