"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, ease: "easeOut" as const } };

type SeqStatus = "active" | "draft" | "paused";

const sequences = [
  { id: "seq-1", name: "Prestige Lakeside — Post-Call", agent: "Priya (Qualification Agent)", status: "active" as SeqStatus, campaignsUsing: 2, createdAt: "2026-03-10" },
  { id: "seq-2", name: "Assetz Mizumi — Site Visit Follow-up", agent: "Arjun (Follow-up Agent)", status: "active" as SeqStatus, campaignsUsing: 1, createdAt: "2026-03-15" },
  { id: "seq-3", name: "Brigade Utopia — Re-engagement", agent: "Priya (Qualification Agent)", status: "draft" as SeqStatus, campaignsUsing: 0, createdAt: "2026-03-20" },
];

function StatusBadge({ status }: { status: SeqStatus }) {
  const config = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    draft: { label: "Draft", cls: "bg-surface-secondary text-text-secondary" },
    paused: { label: "Paused", cls: "bg-[#FEF3C7] text-[#92400E]" },
  };
  const { label, cls } = config[status];
  return <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>{label}</span>;
}

export default function SequencesPage() {
  const router = useRouter();

  return (
    <motion.div {...fadeIn}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Agents</div>
          <h1 className="text-page-title text-text-primary">Sequences</h1>
        </div>
        <button onClick={() => router.push("/sequences/create")} className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          <Plus size={15} strokeWidth={2} /> Create sequence
        </button>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              {["Name", "Voice Agent", "Status", "Campaigns Using", "Created"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sequences.map((s, i) => (
              <tr key={s.id} onClick={() => router.push(`/sequences/${s.id}`)}
                className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                <td className="px-4 py-3 text-[13px] text-text-primary font-medium">{s.name}</td>
                <td className="px-4 py-3 text-[12px] text-text-secondary">{s.agent}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-[13px] text-text-primary tabular-nums">{s.campaignsUsing}</td>
                <td className="px-4 py-3 text-[12px] text-text-secondary">{new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
