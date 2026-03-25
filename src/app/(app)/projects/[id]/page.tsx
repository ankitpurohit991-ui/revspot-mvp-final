"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  CircleCheck,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import {
  projectsList,
  getProjectCampaigns,
} from "@/lib/campaign-data";
import type { CampaignHealth } from "@/lib/campaign-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
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

export default function ProjectDetailPage() {
  const router = useRouter();

  // Use first project as default for any id
  const project = projectsList[0];
  const campaigns = getProjectCampaigns(project.id);

  const verifiedRate =
    project.totalLeads > 0
      ? ((project.verifiedLeads / project.totalLeads) * 100).toFixed(1)
      : "0";

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/projects")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">
          Lead Generation › Projects › {project.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-page-title text-text-primary">{project.name}</h1>
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge bg-[#F0FDF4] text-[#15803D]">
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-text-secondary">
            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">{project.category}</span>
            <span className="text-border">|</span>
            <span>
              {project.campaignIds.length} campaign{project.campaignIds.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          <Plus size={15} strokeWidth={2} />
          Add campaign
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total spend", value: formatCurrency(project.totalSpend) },
          { label: "Total leads", value: project.totalLeads.toLocaleString() },
          {
            label: "Verified leads",
            value: project.verifiedLeads.toString(),
            sub: `${verifiedRate}% rate`,
            hasIcon: true,
          },
          { label: "Qualified", value: project.qualifiedLeads.toString() },
          { label: "Avg CPL", value: `₹${project.avgCPL.toLocaleString("en-IN")}` },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-border rounded-card px-4 py-3.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.3px] mb-1">
              {m.hasIcon && <ShieldCheck size={10} strokeWidth={2} />}
              {m.label}
            </div>
            <div className="text-[22px] font-semibold text-text-primary leading-tight tabular-nums">
              {m.value}
            </div>
            {m.sub && <div className="text-[11px] text-text-tertiary mt-1">{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-section-header text-text-primary">Campaigns</h2>
          <span className="text-[12px] text-text-tertiary">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {[
                  { label: "Campaign", align: "left" },
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
              {campaigns.map((c, i) => (
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
                    <span
                      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                        c.status === "active"
                          ? "bg-[#F0FDF4] text-[#15803D]"
                          : c.status === "paused"
                          ? "bg-surface-secondary text-text-secondary"
                          : "bg-[#F0F0F0] text-text-primary"
                      }`}
                    >
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
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
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-text-tertiary">
                    No campaigns in this project yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
