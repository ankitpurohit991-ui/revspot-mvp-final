"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Plus,
  FolderKanban,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { projectsList } from "@/lib/campaign-data";
import type { ProjectItem } from "@/lib/campaign-data";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: ProjectItem["status"] }) {
  const config = {
    active: { label: "Active", cls: "bg-[#F0FDF4] text-[#15803D]" },
    paused: { label: "Paused", cls: "bg-surface-secondary text-text-secondary" },
    completed: { label: "Completed", cls: "bg-[#F0F0F0] text-text-primary" },
  };
  const { label, cls } = config[status];
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const router = useRouter();
  const verifiedRate =
    project.totalLeads > 0
      ? Math.round((project.verifiedLeads / project.totalLeads) * 100)
      : 0;
  const qualifiedRate =
    project.totalLeads > 0
      ? Math.round((project.qualifiedLeads / project.totalLeads) * 100)
      : 0;

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white border border-border rounded-card p-5 text-left w-full hover:shadow-card-hover hover:-translate-y-px transition-all duration-150 group"
    >
      {/* Top row: name + status */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-text-primary truncate group-hover:text-accent transition-colors duration-150">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-text-secondary">{project.client}</span>
            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">
              {project.category}
            </span>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Campaigns count */}
      <div className="text-[12px] text-text-secondary mb-4">
        {project.campaignIds.length} campaign{project.campaignIds.length !== 1 ? "s" : ""}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-[0.3px]">Spend</div>
          <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
            {formatCurrency(project.totalSpend)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-[0.3px]">Leads</div>
          <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
            {project.totalLeads}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-[0.3px] flex items-center gap-1">
            <ShieldCheck size={10} strokeWidth={2} />
            Verified
          </div>
          <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
            {project.verifiedLeads}
            <span className="text-[11px] font-normal text-text-tertiary ml-1">({verifiedRate}%)</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-[0.3px]">Avg CPL</div>
          <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-0.5">
            ₹{project.avgCPL.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-[11px] text-text-tertiary">
          Qualified: {project.qualifiedLeads} ({qualifiedRate}%)
        </span>
        <ArrowRight
          size={14}
          strokeWidth={1.5}
          className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150"
        />
      </div>
    </button>
  );
}

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Projects</h1>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          <Plus size={15} strokeWidth={2} />
          Create project
        </button>
      </motion.div>

      {/* Project Cards Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        {projectsList.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </motion.div>
  );
}
