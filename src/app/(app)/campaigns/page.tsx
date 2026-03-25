"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Plus,
  Search,
  CircleCheck,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { campaignsList } from "@/lib/campaign-data";
import type { CampaignStatus, CampaignHealth } from "@/lib/campaign-data";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    paused: { label: "Paused", cls: "bg-surface-secondary text-text-secondary" },
    completed: { label: "Completed", cls: "bg-[#F0F0F0] text-text-primary" },
  };
  const { label, cls } = config[status];
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      {label}
    </span>
  );
}

function HealthBadge({ health }: { health: CampaignHealth }) {
  const config = {
    "on-track": { icon: CircleCheck, label: "On track", cls: "text-status-success bg-[#F0FDF4]" },
    "needs-attention": { icon: AlertTriangle, label: "Attention", cls: "text-[#92400E] bg-[#FEF3C7]" },
    underperforming: { icon: XCircle, label: "Low", cls: "text-status-error bg-[#FEF2F2]" },
  };
  const { icon: Icon, label, cls } = config[health];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>
      <Icon size={11} strokeWidth={2} />
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
      type === "Performance"
        ? "bg-[#EFF6FF] text-[#1D4ED8]"
        : "bg-[#FDF4FF] text-[#7C3AED]"
    }`}>
      {type}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function CampaignsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CampaignStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return campaignsList.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (
        search &&
        !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.client.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Campaigns</h1>
        </div>
        <button
          onClick={() => router.push("/campaigns/create")}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150"
        >
          <Plus size={15} strokeWidth={2} />
          Create campaign
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-0.5 bg-surface-secondary rounded-input p-0.5">
          {(["all", "active", "paused", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] transition-colors duration-150 capitalize ${
                statusFilter === s
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-[280px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 pl-8 pr-3 text-[13px] border border-border rounded-input bg-white focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="bg-white border border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Campaign", align: "left" },
                  { label: "Type", align: "left" },
                  { label: "Project", align: "left" },
                  { label: "Status", align: "left" },
                  { label: "Spend", align: "right" },
                  { label: "Leads", align: "right" },
                  { label: "Verified", align: "right" },
                  { label: "CPL", align: "right" },
                  { label: "Health", align: "center" },
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
              {paginated.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/campaigns/${c.id}`)}
                  className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-surface-page/40"
                  }`}
                >
                  <td className="px-4 py-3 text-[13px] text-text-primary font-medium max-w-[280px] truncate">
                    {c.name}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={c.type} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary">{c.client}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    {formatCurrency(c.spend)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    {c.leads}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="text-[13px] text-text-primary">{c.verifiedLeads}</span>
                    <span className="text-[11px] text-text-tertiary ml-1">
                      ({Math.round((c.verifiedLeads / c.leads) * 100)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">
                    ₹{c.cpl.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <HealthBadge health={c.health} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
          <span className="text-[12px] text-text-tertiary">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} campaigns
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-button text-text-secondary hover:bg-surface-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
