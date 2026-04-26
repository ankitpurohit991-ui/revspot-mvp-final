"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft, Plus, CircleCheck, AlertTriangle, XCircle, Sparkles, ArrowRight,
} from "lucide-react";
import {
  projectsList, getProjectCampaigns, leadDistributionData, projectInsights,
} from "@/lib/campaign-data";
import type { CampaignHealth, ProjectFinding } from "@/lib/campaign-data";
import { MetricCard } from "@/components/dashboard/metric-card";
import { MetricChart } from "@/components/shared/metric-chart";
import type { MetricChartDef, MetricOption } from "@/components/shared/metric-chart";
import { LeadInsights } from "@/components/campaigns/lead-insights";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { ActionBanner } from "@/components/shared/action-banner";
import { FunnelEvidenceChips } from "@/components/shared/funnel-evidence-chips";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

type Tab = "overview" | "diagnosis" | "leadInsights";

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
      <Icon size={11} strokeWidth={2} /> {label}
    </span>
  );
}

const projectStatusConfig = {
  "on-track": { label: "On track", cls: "bg-[#F0FDF4] text-[#15803D]" },
  "needs-attention": { label: "Needs attention", cls: "bg-[#FEF3C7] text-[#92400E]" },
  underperforming: { label: "Underperforming", cls: "bg-[#FEF2F2] text-[#DC2626]" },
};

// ── Project Trend Data ──────────────────────────────────────
const dates = Array.from({ length: 14 }, (_, i) => `Mar ${10 + i}`);

function makeTrend(start: number, end: number) {
  return Array.from({ length: 14 }, (_, i) => {
    const progress = i / 13;
    return Math.round((start + (end - start) * progress + (Math.random() * start * 0.05 - start * 0.025)) * 10) / 10;
  });
}

const MAX_CHART = 3;

// ── Finding Card (used in both inline panel and Diagnosis tab) ─────────────

const toneStyles = {
  positive: "border-l-[3px] border-l-[#15803D]",
  neutral: "border-l-[3px] border-l-border",
  concern: "border-l-[3px] border-l-[#F59E0B]",
};

function FindingCard({ finding }: { finding: ProjectFinding }) {
  return (
    <div
      className={`bg-white border border-border rounded-card ${toneStyles[finding.tone]} p-4`}
    >
      <div className="flex items-start gap-3">
        <span className="text-[18px] leading-none mt-0.5">{finding.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[14px] font-semibold text-text-primary leading-snug">
              {finding.title}
            </h4>
            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-surface-secondary text-text-secondary uppercase tracking-[0.4px]">
              {finding.scope.replace("_", " ")}
            </span>
          </div>
          <p className="text-[12px] text-text-secondary leading-relaxed mb-2">
            {finding.narrative}
          </p>
          {finding.funnel_evidence && finding.funnel_evidence.length > 0 && (
            <FunnelEvidenceChips evidence={finding.funnel_evidence} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [bannerSnoozed, setBannerSnoozed] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const project = projectsList[0];
  const campaigns = getProjectCampaigns(project.id);
  const insights = projectInsights;

  const verifiedRate = project.totalLeads > 0
    ? ((project.verifiedLeads / project.totalLeads) * 100).toFixed(1) : "0";
  const qualifiedRate = project.totalLeads > 0
    ? ((project.qualifiedLeads / project.totalLeads) * 100).toFixed(1) : "0";

  const projectTrends: Record<string, MetricChartDef> = {
    totalSpend: { key: "totalSpend", label: "Total Spend", unit: "currency", data: makeTrend(180000, project.totalSpend) },
    totalLeads: { key: "totalLeads", label: "Total Leads", unit: "number", data: makeTrend(220, project.totalLeads) },
    verifiedLeads: { key: "verifiedLeads", label: "Verified Leads", unit: "number", data: makeTrend(35, project.verifiedLeads) },
    qualifiedLeads: { key: "qualifiedLeads", label: "Qualified", unit: "number", data: makeTrend(16, project.qualifiedLeads) },
    avgCPL: { key: "avgCPL", label: "Avg CPL", unit: "currency", data: makeTrend(920, project.avgCPL) },
    cpvl: { key: "cpvl", label: "CPVL", unit: "currency", data: makeTrend(4800, project.costPerVerifiedLead) },
    cpql: { key: "cpql", label: "CPQL", unit: "currency", data: makeTrend(9500, project.costPerQualifiedLead) },
  };

  const toggleMetric = useCallback((key: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_CHART) return prev;
      return [...prev, key];
    });
  }, []);

  const selectedChartDefs = selectedMetrics.map((k) => projectTrends[k]).filter(Boolean);

  const projectAvailableMetrics: MetricOption[] = [
    { key: "totalSpend", label: "Total Spend", category: "Overview", currentValue: formatCurrency(project.totalSpend) },
    { key: "totalLeads", label: "Total Leads", category: "Leads", currentValue: project.totalLeads.toString() },
    { key: "verifiedLeads", label: "Verified Leads", category: "Leads", currentValue: project.verifiedLeads.toString() },
    { key: "qualifiedLeads", label: "Qualified", category: "Leads", currentValue: project.qualifiedLeads.toString() },
    { key: "avgCPL", label: "Avg CPL", category: "Cost", currentValue: `₹${project.avgCPL.toLocaleString("en-IN")}` },
    { key: "cpvl", label: "CPVL", category: "Cost", currentValue: `₹${project.costPerVerifiedLead.toLocaleString("en-IN")}` },
    { key: "cpql", label: "CPQL", category: "Cost", currentValue: `₹${project.costPerQualifiedLead.toLocaleString("en-IN")}` },
  ];

  // For the inline panel: show the top 3 findings (priority by tone+scope, but
  // we let the mock author already order them sensibly — just take the first 3).
  const topFindings = insights.findings.slice(0, 3);
  const projectStatusCfg = projectStatusConfig[insights.project_status];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "leadInsights", label: "Lead Insights" },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push("/projects")}
          className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-150">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>
        <span className="text-meta text-text-secondary">Lead Generation › Projects › {project.name}</span>
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
            <span>{project.campaignIds.length} campaign{project.campaignIds.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeSelector compact />
          <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
            <Plus size={15} strokeWidth={2} /> Attach campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
              activeTab === tab.key ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}>
            <span>{tab.label}</span>
            {activeTab === tab.key && (
              <motion.div layoutId="project-tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" transition={{ duration: 0.15 }} />
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Metric Cards — clickable for charting */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <MetricCard label="Verified leads" value={project.verifiedLeads.toString()}
              subMetric={`${verifiedRate}% verification rate`}
              chartKey="verifiedLeads" isSelected={selectedMetrics.includes("verifiedLeads")} onToggle={toggleMetric} />
            <MetricCard label="Total leads" value={project.totalLeads.toLocaleString()}
              chartKey="totalLeads" isSelected={selectedMetrics.includes("totalLeads")} onToggle={toggleMetric} />
            <MetricCard label="Total spend" value={formatCurrency(project.totalSpend)}
              chartKey="totalSpend" isSelected={selectedMetrics.includes("totalSpend")} onToggle={toggleMetric} />
            <MetricCard label="Qualified" value={project.qualifiedLeads.toString()}
              subMetric={`${qualifiedRate}% qualification rate`}
              chartKey="qualifiedLeads" isSelected={selectedMetrics.includes("qualifiedLeads")} onToggle={toggleMetric}
              warning="1 campaign without agent" />
            <MetricCard label="Avg CPL" value={`₹${project.avgCPL.toLocaleString("en-IN")}`}
              chartKey="avgCPL" isSelected={selectedMetrics.includes("avgCPL")} onToggle={toggleMetric} />
            <MetricCard label="CPVL" value={`₹${project.costPerVerifiedLead.toLocaleString("en-IN")}`}
              chartKey="cpvl" isSelected={selectedMetrics.includes("cpvl")} onToggle={toggleMetric} />
            <MetricCard label="CPQL" value={`₹${project.costPerQualifiedLead.toLocaleString("en-IN")}`}
              chartKey="cpql" isSelected={selectedMetrics.includes("cpql")} onToggle={toggleMetric}
              warning="1 campaign without agent" />
          </div>

          {/* Chart */}
          {selectedChartDefs.length > 0 && (
            <div className="mb-6">
              <MetricChart metrics={selectedChartDefs} dates={dates} onRemove={toggleMetric}
                onAdd={toggleMetric} availableMetrics={projectAvailableMetrics} selectedKeys={selectedMetrics} maxMetrics={MAX_CHART} />
            </div>
          )}

          {selectedChartDefs.length === 0 && (
            <div className="text-[11px] text-text-tertiary text-center py-2 mb-4">
              Click any metric card to visualize its trend
            </div>
          )}

          {/* Action banner — project-level recommendation */}
          {!bannerSnoozed && insights.headline_action && (
            <ActionBanner
              verb={insights.headline_action.verb}
              target={insights.headline_action.target}
              outcome={insights.headline_action.outcome}
              expectedImpact={insights.headline_action.expected_impact}
              ctaLabel={insights.headline_action.cta_label}
              ctaHref={insights.headline_action.cta_href}
              onSnooze={() => setBannerSnoozed(true)}
              variant="project"
            />
          )}

          {/* Top insights panel */}
          <div className="bg-white border border-border rounded-card overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} strokeWidth={1.5} className="text-text-tertiary" />
                <span className="text-section-header text-text-primary">Top insights</span>
                <span className="text-[11px] text-text-tertiary">· Generated {insights.generated_at}</span>
              </div>
              <button onClick={() => setActiveTab("diagnosis")}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-150">
                View all {insights.findings.length} insights <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {topFindings.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white border border-border rounded-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-section-header text-text-primary">Campaigns</h2>
              <span className="text-[12px] text-text-tertiary">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    {[
                      { label: "Campaign", align: "left" }, { label: "Status", align: "left" },
                      { label: "Spend", align: "right" }, { label: "Leads", align: "right" },
                      { label: "Verified", align: "right" }, { label: "CPL", align: "right" },
                      { label: "Health", align: "center" },
                    ].map((h) => (
                      <th key={h.label} className={`px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-[0.5px] text-${h.align}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={c.id} onClick={() => router.push(`/campaigns/${c.id}`)}
                      className={`hover:bg-surface-page transition-colors duration-150 cursor-pointer border-b border-border-subtle last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                      <td className="px-4 py-3 text-[13px] text-text-primary font-medium max-w-[280px] truncate">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${
                          c.status === "enabled"
                            ? "bg-[#F0FDF4] text-[#15803D]"
                            : c.status === "draft"
                            ? "bg-[#FEF3C7] text-[#92400E]"
                            : "bg-surface-secondary text-text-secondary"
                        }`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">{formatCurrency(c.spend)}</td>
                      <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">{c.leads}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="text-[13px] text-text-primary">{c.verifiedLeads}</span>
                        <span className="text-[11px] text-text-tertiary ml-1">({Math.round((c.verifiedLeads / c.leads) * 100)}%)</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-primary text-right tabular-nums">₹{c.cpl.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-center"><HealthBadge health={c.health} /></td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-[13px] text-text-tertiary">No campaigns in this project yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DIAGNOSIS TAB */}
      {activeTab === "diagnosis" && (
        <>
          {/* Action banner — same as overview, repeated here so the diagnosis tab reads stand-alone */}
          {!bannerSnoozed && insights.headline_action && (
            <ActionBanner
              verb={insights.headline_action.verb}
              target={insights.headline_action.target}
              outcome={insights.headline_action.outcome}
              expectedImpact={insights.headline_action.expected_impact}
              ctaLabel={insights.headline_action.cta_label}
              ctaHref={insights.headline_action.cta_href}
              onSnooze={() => setBannerSnoozed(true)}
              variant="project"
            />
          )}

          {/* Project diagnosis card */}
          <div className="bg-[#FAFAF8] border border-border rounded-card overflow-hidden mb-5">
            <div className="border-l-4 border-l-accent p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center">
                    <Sparkles size={14} strokeWidth={1.5} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-text-primary">Project Diagnosis</h3>
                    <span className="text-[11px] text-text-tertiary">Cross-campaign analysis · {insights.findings.length} findings</span>
                  </div>
                </div>
                <span className={`inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-badge ${projectStatusCfg.cls}`}>
                  {projectStatusCfg.label}
                </span>
              </div>
              <p className="text-[14px] text-text-primary leading-relaxed font-medium">{insights.summary}</p>
              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border-subtle">
                <Sparkles size={11} strokeWidth={1.5} className="text-text-tertiary" />
                <span className="text-[10px] text-text-tertiary">Generated by Revspot AI · Updated {insights.generated_at}</span>
              </div>
            </div>
          </div>

          {/* Findings list */}
          <div className="space-y-3">
            {insights.findings.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </>
      )}

      {/* LEAD INSIGHTS TAB */}
      {activeTab === "leadInsights" && (
        <LeadInsights
          distributions={leadDistributionData}
        />
      )}
    </motion.div>
  );
}
