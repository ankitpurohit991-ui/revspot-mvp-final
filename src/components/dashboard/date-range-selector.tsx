"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface DateRangeSelectorProps {
  compact?: boolean; // for use inside campaign analysis (no comparison display outside)
}

const presets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Today and yesterday", value: "2d" },
  { label: "This week", value: "thisweek" },
  { label: "Last week", value: "lastweek" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 14 days", value: "14" },
  { label: "Last 30 days", value: "30" },
  { label: "This month", value: "thismonth" },
  { label: "Last month", value: "lastmonth" },
  { label: "Lifetime", value: "lifetime" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getPresetRange(value: string): { start: Date; end: Date; label: string } {
  const now = new Date(2026, 2, 23); // Mar 23, 2026
  const end = new Date(now);
  const start = new Date(now);

  switch (value) {
    case "today": return { start: now, end: now, label: "Today" };
    case "yesterday": start.setDate(start.getDate() - 1); return { start, end: new Date(start), label: "Yesterday" };
    case "2d": start.setDate(start.getDate() - 1); return { start, end, label: "Today and yesterday" };
    case "thisweek": start.setDate(start.getDate() - start.getDay()); return { start, end, label: "This week" };
    case "lastweek": { const s = new Date(now); s.setDate(s.getDate() - s.getDay() - 7); const e = new Date(s); e.setDate(e.getDate() + 6); return { start: s, end: e, label: "Last week" }; }
    case "7": start.setDate(start.getDate() - 6); return { start, end, label: "Last 7 days" };
    case "14": start.setDate(start.getDate() - 13); return { start, end, label: "Last 14 days" };
    case "30": start.setDate(start.getDate() - 29); return { start, end, label: "Last 30 days" };
    case "thismonth": start.setDate(1); return { start, end, label: "This month" };
    case "lastmonth": { const s = new Date(now.getFullYear(), now.getMonth() - 1, 1); const e = new Date(now.getFullYear(), now.getMonth(), 0); return { start: s, end: e, label: "Last month" }; }
    case "lifetime": return { start: new Date(2026, 0, 1), end, label: "Lifetime" };
    default: start.setDate(start.getDate() - 29); return { start, end, label: "Last 30 days" };
  }
}

export function DateRangeSelector({ compact }: DateRangeSelectorProps) {
  const [selected, setSelected] = useState("30");
  const [open, setOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(2); // March (0-indexed)
  const [calYear, setCalYear] = useState(2026);
  const [selStart, setSelStart] = useState<Date | null>(null);
  const [selEnd, setSelEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const range = getPresetRange(selected);
  const prevDuration = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const prevEnd = new Date(range.start); prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - prevDuration + 1);

  const handlePresetClick = (value: string) => {
    setSelected(value);
    setSelStart(null);
    setSelEnd(null);
    setOpen(false);
  };

  const handleDateClick = (d: Date) => {
    if (!selStart || (selStart && selEnd)) {
      setSelStart(d);
      setSelEnd(null);
    } else {
      if (d < selStart) { setSelEnd(selStart); setSelStart(d); }
      else setSelEnd(d);
      setSelected("custom");
    }
  };

  const isInRange = (d: Date) => {
    if (selStart && selEnd) return d >= selStart && d <= selEnd;
    if (selStart && hoveredDate) {
      const min = selStart < hoveredDate ? selStart : hoveredDate;
      const max = selStart < hoveredDate ? hoveredDate : selStart;
      return d >= min && d <= max;
    }
    return false;
  };

  const isStart = (d: Date) => selStart && d.toDateString() === selStart.toDateString();
  const isEnd = (d: Date) => selEnd && d.toDateString() === selEnd.toDateString();

  // Calendar for month
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const prevMonthDays = getDaysInMonth(calYear, calMonth - 1);

  const calDays: { day: number; inMonth: boolean; date: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    calDays.push({ day: prevMonthDays - i, inMonth: false, date: new Date(calYear, calMonth - 1, prevMonthDays - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calDays.push({ day: d, inMonth: true, date: new Date(calYear, calMonth, d) });
  }
  const remaining = 42 - calDays.length;
  for (let d = 1; d <= remaining; d++) {
    calDays.push({ day: d, inMonth: false, date: new Date(calYear, calMonth + 1, d) });
  }

  const navMonth = (dir: number) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  const displayRange = selected === "custom" && selStart && selEnd
    ? `${formatDate(selStart)} – ${formatDate(selEnd)}`
    : `${formatDate(range.start)} – ${formatDate(range.end)}`;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 bg-white border border-border rounded-input text-[13px] text-text-primary hover:border-border-hover transition-colors duration-150">
        <Calendar size={14} strokeWidth={1.5} className="text-text-tertiary" />
        <span className="text-[12px]">{displayRange}</span>
        <ChevronDown size={14} strokeWidth={1.5} className={`text-text-tertiary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {!compact && (
        <div className="text-[10px] text-text-tertiary mt-0.5 text-right">
          vs {formatDate(prevStart)} – {formatDate(prevEnd)}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 bg-white border border-border rounded-card shadow-lg z-30 flex overflow-hidden">
          {/* Presets */}
          <div className="w-[160px] border-r border-border-subtle py-2 max-h-[380px] overflow-y-auto">
            {presets.map((p) => (
              <button key={p.value} onClick={() => handlePresetClick(p.value)}
                className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                  selected === p.value ? "text-text-primary font-medium bg-surface-secondary" : "text-text-secondary hover:bg-surface-page"
                }`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3 w-[270px]">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => navMonth(-1)} className="p-1 hover:bg-surface-page rounded text-text-secondary"><ChevronLeft size={14} strokeWidth={1.5} /></button>
              <span className="text-[12px] font-medium text-text-primary">{MONTH_NAMES[calMonth]} {calYear}</span>
              <button onClick={() => navMonth(1)} className="p-1 hover:bg-surface-page rounded text-text-secondary"><ChevronRight size={14} strokeWidth={1.5} /></button>
            </div>
            <div className="grid grid-cols-7 gap-0">
              {DAY_LABELS.map((d) => (
                <div key={d} className="h-7 flex items-center justify-center text-[10px] font-medium text-text-tertiary">{d}</div>
              ))}
              {calDays.map((cd, i) => {
                const inRange = isInRange(cd.date);
                const start = isStart(cd.date);
                const end = isEnd(cd.date);
                return (
                  <button key={i}
                    onClick={() => handleDateClick(cd.date)}
                    onMouseEnter={() => setHoveredDate(cd.date)}
                    className={`h-7 flex items-center justify-center text-[11px] transition-colors rounded-[4px] ${
                      !cd.inMonth ? "text-text-tertiary/40" :
                      start || end ? "bg-accent text-white font-medium" :
                      inRange ? "bg-surface-secondary text-text-primary" :
                      "text-text-primary hover:bg-surface-page"
                    }`}>
                    {cd.day}
                  </button>
                );
              })}
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle">
              <span className="text-[10px] text-text-tertiary">
                {selStart && !selEnd ? formatDate(selStart) + " – ..." :
                 selStart && selEnd ? `${formatDate(selStart)} – ${formatDate(selEnd)}` :
                 displayRange}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setSelStart(null); setSelEnd(null); setOpen(false); }}
                  className="h-7 px-3 text-[11px] text-text-secondary hover:text-text-primary">Cancel</button>
                <button onClick={() => setOpen(false)}
                  className="h-7 px-3 bg-accent text-white text-[11px] font-medium rounded-button hover:bg-accent-hover">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
