"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { outreachList } from "@/lib/outreach-data";
import type { OutreachStatus } from "@/lib/outreach-data";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function StatusBadge({ status, progress }: { status: OutreachStatus; progress: number }) {
  const config = {
    in_progress: {
      label: `In Progress (${Math.round(progress)}%)`,
      cls: "bg-[#EFF6FF] text-[#1D4ED8]",
    },
    completed: { label: "Completed", cls: "bg-[#F0FDF4] text-[#15803D]" },
    paused: { label: "Paused", cls: "bg-surface-secondary text-text-secondary" },
    scheduled: { label: "Scheduled", cls: "bg-[#FDF4FF] text-[#7C3AED]" },
  };
  const { label, cls } = config[status];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

export default function OutreachPage() {
  const router = useRouter();

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Outreach</h1>
        </div>
        <button
          onClick={() => router.push("/outreach/create")}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          <Plus size={15} strokeWidth={2} />
          New outreach
        </button>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="bg-white border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Name", align: "left" },
                  { label: "Voice Agent", align: "left" },
                  { label: "Contacts", align: "right" },
                  { label: "Called", align: "right" },
                  { label: "Qualified", align: "right" },
                  { label: "Status", align: "left" },
                  { label: "Created", align: "left" },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align}`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outreachList.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/outreach/${o.id}`)}
                  className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-4 py-3 text-[13px] text-text-primary font-medium max-w-[260px] truncate">
                    {o.name}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary max-w-[180px] truncate">
                    {o.voiceAgent}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    {o.totalContacts}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="text-[13px] text-text-primary">{o.called}</span>
                    {o.totalContacts > 0 && (
                      <span className="text-[11px] text-text-tertiary ml-1">
                        ({Math.round((o.called / o.totalContacts) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="text-[13px] text-text-primary">{o.qualified}</span>
                    {o.connected > 0 && (
                      <span className="text-[11px] text-text-tertiary ml-1">
                        ({Math.round((o.qualified / o.connected) * 100)}%)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} progress={o.progress} />
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
