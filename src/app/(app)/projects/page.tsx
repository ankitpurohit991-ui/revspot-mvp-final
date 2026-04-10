"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Plus, ArrowRight, ChevronDown, ChevronRight, X, Upload, FileText,
} from "lucide-react";
import { campaignsList, projectsList } from "@/lib/campaign-data";
import type { ProjectItem, CampaignListItem } from "@/lib/campaign-data";
import { EmptyState } from "@/components/layout/empty-state";
import { IllustrationProjects } from "@/components/illustrations/empty-states";
import { useDemoMode } from "@/lib/demo-mode";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } };

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
  return <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-badge ${cls}`}>{label}</span>;
}

// ── Project Card ────────────────────────────────────────────
function ProjectCard({ project }: { project: ProjectItem }) {
  const router = useRouter();
  const hasDisconnectedAgent = project.campaignIds.some(
    (cid) => campaignsList.find((c) => c.id === cid)?.agentConnected === false
  );

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white border border-border rounded-card p-5 text-left w-full hover:shadow-card-hover hover:-translate-y-px transition-all duration-150 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-text-primary truncate group-hover:text-accent transition-colors duration-150">{project.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-badge bg-[#EFF6FF] text-[#1D4ED8]">{project.category}</span>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="text-[12px] text-text-secondary mb-4">{project.campaignIds.length} campaign{project.campaignIds.length !== 1 ? "s" : ""} ({project.activeCampaigns} active)</div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
        <div>
          <div className="text-[10px] text-text-tertiary">Spend</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">{formatCurrency(project.totalSpend)}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Leads</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">{project.totalLeads}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Verified ({project.verificationRate}%)</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">{project.verifiedLeads}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">Qualified</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">{project.qualifiedLeads}</div>
          {hasDisconnectedAgent && <div className="text-[8px] text-[#92400E] mt-0.5">1 campaign without agent</div>}
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">CPL</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">₹{project.avgCPL.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">CPVL</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">₹{project.costPerVerifiedLead.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-tertiary">CPQL</div>
          <div className="text-[14px] font-semibold text-text-primary tabular-nums mt-0.5">₹{project.costPerQualifiedLead.toLocaleString("en-IN")}</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-end">
        <ArrowRight size={14} strokeWidth={1.5} className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150" />
      </div>
    </button>
  );
}

// ── Assign Dropdown ─────────────────────────────────────────
function AssignDropdown({ campaignId, onAssign, onCreateNew }: { campaignId: string; onAssign: (projectId: string) => void; onCreateNew: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary border border-border rounded-button px-2 py-1 transition-colors">
        Assign <ChevronDown size={10} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-[6px] shadow-lg py-1 z-20 min-w-[200px]">
          {projectsList.map((p) => (
            <button key={p.id} onClick={() => { onAssign(p.id); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:bg-surface-page transition-colors">{p.name}</button>
          ))}
          <div className="border-t border-border-subtle my-1" />
          <button onClick={() => { onCreateNew(); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-[12px] text-text-primary font-medium hover:bg-surface-page transition-colors flex items-center gap-1">
            <Plus size={12} strokeWidth={2} /> Create new project
          </button>
        </div>
      )}
    </div>
  );
}

// ── Create Project Modal ────────────────────────────────────
function CreateProjectModal({ onClose, unassignedCampaigns, preSelectedCampaign }: {
  onClose: () => void;
  unassignedCampaigns: CampaignListItem[];
  preSelectedCampaign?: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(preSelectedCampaign ? [preSelectedCampaign] : []);
  const [brochureFiles, setBrochureFiles] = useState<string[]>([]);

  const toggleCampaign = (id: string) => {
    setSelectedCampaigns((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[60]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-card border border-border shadow-lg w-full max-w-[520px] max-h-[85vh] overflow-y-auto">
          <div className="px-6 py-5 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-text-primary">Create project</h2>
            <button onClick={onClose} className="p-1 rounded-button text-text-secondary hover:bg-surface-secondary transition-colors"><X size={16} strokeWidth={1.5} /></button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-text-primary mb-1.5">Project name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Whitefield Luxury Villas"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-tertiary" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-primary mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional — describe the project" rows={2}
                className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-tertiary resize-none" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-primary mb-1.5">Website URL</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://"
                className="w-full h-10 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-tertiary" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-primary mb-1.5">Brochures & Documents <span className="text-text-tertiary font-normal">(optional)</span></label>
              <div
                onClick={() => setBrochureFiles((prev) => [...prev, "Project_Brochure.pdf"])}
                className="border-2 border-dashed border-border rounded-input p-5 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150"
              >
                <Upload size={18} strokeWidth={1.5} className="mx-auto text-text-tertiary mb-1.5" />
                <p className="text-[12px] text-text-secondary">Upload brochures, images, or documents</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">PDF, PPT, DOCX, JPG, PNG up to 25MB</p>
              </div>
              {brochureFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {brochureFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-surface-page rounded-[5px] px-2.5 py-1.5 border border-border-subtle">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} strokeWidth={1.5} className="text-text-tertiary" />
                        <span className="text-[11px] text-text-primary">{f}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setBrochureFiles((prev) => prev.filter((_, j) => j !== i)); }}
                        className="text-text-tertiary hover:text-text-primary transition-colors duration-150">
                        <X size={11} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {unassignedCampaigns.length > 0 && (
              <div>
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Assign campaigns</label>
                <div className="border border-border rounded-input max-h-[160px] overflow-y-auto">
                  {unassignedCampaigns.map((c) => (
                    <label key={c.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-surface-page cursor-pointer border-b border-border-subtle last:border-0">
                      <input type="checkbox" checked={selectedCampaigns.includes(c.id)} onChange={() => toggleCampaign(c.id)}
                        className="w-3.5 h-3.5 rounded border-border text-accent cursor-pointer" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-text-primary font-medium truncate">{c.name}</div>
                        <div className="text-[10px] text-text-tertiary">{formatCurrency(c.spend)} · {c.leads} leads</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedCampaigns.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCampaigns.map((id) => {
                      const camp = unassignedCampaigns.find((c) => c.id === id);
                      return camp ? (
                        <span key={id} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-badge bg-surface-secondary text-text-secondary">
                          {camp.name.split("—")[0].trim()}
                          <button onClick={() => toggleCampaign(id)} className="hover:text-text-primary"><X size={10} strokeWidth={2} /></button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-2">
            <button onClick={onClose} className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors">Cancel</button>
            <button onClick={onClose} disabled={!name.trim()} className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Create Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function ProjectsPage() {
  const router = useRouter();
  const { isEmpty } = useDemoMode();
  const [showModal, setShowModal] = useState(false);
  const [preSelectedCampaign, setPreSelectedCampaign] = useState<string | undefined>();
  const [unassignedCollapsed, setUnassignedCollapsed] = useState(false);

  const unassigned = useMemo(() => isEmpty ? [] : campaignsList.filter((c) => c.projectId === null), [isEmpty]);
  const projects = isEmpty ? [] : projectsList;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <div className="text-meta text-text-secondary mb-1">Lead Generation</div>
          <h1 className="text-page-title text-text-primary">Projects</h1>
        </div>
        <button onClick={() => { setPreSelectedCampaign(undefined); setShowModal(true); }}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
          <Plus size={15} strokeWidth={2} /> Create project
        </button>
      </motion.div>

      {/* Unassigned Campaigns */}
      {unassigned.length > 0 && (
        <motion.div variants={fadeUp} className="mb-6">
          <button onClick={() => setUnassignedCollapsed(!unassignedCollapsed)} className="flex items-center gap-2 mb-3 group">
            {unassignedCollapsed ? <ChevronRight size={14} strokeWidth={1.5} className="text-text-tertiary" /> : <ChevronDown size={14} strokeWidth={1.5} className="text-text-tertiary" />}
            <span className="text-[13px] font-medium text-text-primary">Unassigned campaigns</span>
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-badge bg-[#FEF3C7] text-[#92400E]">{unassigned.length}</span>
          </button>
          {!unassignedCollapsed && (
            <>
              <p className="text-[12px] text-text-tertiary mb-3 ml-[22px]">These campaigns aren&apos;t part of any project yet.</p>
              <div className="bg-white border border-border rounded-card overflow-hidden ml-[22px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {["Campaign", "Spend", "Leads", "Created", ""].map((h) => (
                        <th key={h} className={`px-4 py-2.5 text-[10px] font-medium text-text-tertiary uppercase tracking-[0.5px] ${h === "" ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {unassigned.map((c, i) => (
                      <tr key={c.id} className={`border-b border-border-subtle last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-surface-page/40"}`}>
                        <td className="px-4 py-2.5 text-[12px] text-text-primary font-medium">{c.name}</td>
                        <td className="px-4 py-2.5 text-[12px] text-text-secondary tabular-nums">{formatCurrency(c.spend)}</td>
                        <td className="px-4 py-2.5 text-[12px] text-text-secondary tabular-nums">{c.leads}</td>
                        <td className="px-4 py-2.5 text-[12px] text-text-tertiary">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                        <td className="px-4 py-2.5 text-right">
                          <AssignDropdown
                            campaignId={c.id}
                            onAssign={() => {}}
                            onCreateNew={() => { setPreSelectedCampaign(c.id); setShowModal(true); }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Project Cards Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        {projects.length === 0 && unassigned.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              illustration={<IllustrationProjects />}
              title="No projects yet"
              description="Group your campaigns into projects for better organization and reporting."
              action={
                <button onClick={() => { setPreSelectedCampaign(undefined); setShowModal(true); }}
                  className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150">
                  Create project
                </button>
              }
            />
          </div>
        ) : projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>

      {/* Create Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          unassignedCampaigns={unassigned}
          preSelectedCampaign={preSelectedCampaign}
        />
      )}
    </motion.div>
  );
}
