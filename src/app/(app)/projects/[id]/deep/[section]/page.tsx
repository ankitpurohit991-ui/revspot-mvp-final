"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { getProject, type ProjectDetail } from "@/lib/project-data";
import { CampaignsDeepDive } from "@/components/project/deep-dive/campaigns-deep-dive";
import { PersonasDeepDive } from "@/components/project/deep-dive/personas-deep-dive";
import { LibraryDeepDive } from "@/components/project/deep-dive/library-deep-dive";
import { DashboardDeepDive } from "@/components/project/deep-dive/dashboard-deep-dive";
import { SpotSidePanel } from "@/components/project/deep-dive/spot-side-panel";

type Section = "campaigns" | "personas" | "library" | "dashboard";

const SECTION_TITLES: Record<Section, string> = {
  campaigns: "Campaigns",
  personas: "Personas",
  library: "Library",
  dashboard: "Dashboard",
};

/**
 * `localStorage` key for the user's preferred Spot-panel visibility in
 * deep dive. Persists across sessions and across sections.
 */
const SPOT_VIS_KEY = "revspot.deepdive.spotPanel";

export default function DeepDivePage() {
  const params = useParams<{ id: string; section: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const id = (params?.id || "").toString();
  const sectionParam = (params?.section || "").toString() as Section;
  const project = getProject(id);

  // Spot panel visibility — defaults to visible. Honors `?spot=off` in
  // the URL on first load, then falls back to the saved localStorage
  // preference. Toggling updates both URL and localStorage so direct
  // links (e.g. ?focus=spot) still work.
  const initialSpotVisible = (() => {
    if (typeof window === "undefined") return true;
    const fromUrl = search.get("spot");
    if (fromUrl === "off") return false;
    if (fromUrl === "on") return true;
    const saved = window.localStorage.getItem(SPOT_VIS_KEY);
    if (saved === "off") return false;
    return true;
  })();
  const [spotVisible, setSpotVisible] = useState(initialSpotVisible);

  // Hide the global sidebar + spot dock while the deep-dive overlay is up
  // by toggling a data attribute on body. The CSS rule (added in
  // globals.css for this attribute) handles the hiding.
  useEffect(() => {
    document.body.setAttribute("data-deep-dive", "1");
    return () => document.body.removeAttribute("data-deep-dive");
  }, []);

  // Persist preference + reflect in URL when toggled.
  const setSpotAndPersist = (next: boolean) => {
    setSpotVisible(next);
    try {
      window.localStorage.setItem(SPOT_VIS_KEY, next ? "on" : "off");
    } catch {
      // Quota or private-mode failure — ignore.
    }
  };

  if (!project) {
    return (
      <DeepDiveShell
        title="Project not found"
        sub="—"
        section={sectionParam}
        onExit={() => router.push("/projects")}
        spotVisible={spotVisible}
        onToggleSpot={setSpotAndPersist}
      >
        <div className="card-base p-8 text-center text-[12.5px] text-text-tertiary">
          We couldn&apos;t find this project.
        </div>
      </DeepDiveShell>
    );
  }

  if (!isValidSection(sectionParam)) {
    return (
      <DeepDiveShell
        title="Unknown section"
        sub="Pick a valid section"
        section="campaigns"
        onExit={() => router.push(`/projects/${id}`)}
        spotVisible={spotVisible}
        onToggleSpot={setSpotAndPersist}
      >
        <div className="card-base p-8 text-center text-[12.5px] text-text-tertiary">
          The section &quot;{sectionParam}&quot; doesn&apos;t exist. Available sections:
          campaigns, personas, library, dashboard.
        </div>
      </DeepDiveShell>
    );
  }

  const focusSpot = search.get("focus") === "spot";

  return (
    <DeepDiveShell
      title={project.name.split(" · ")[0]}
      sub={`${SECTION_TITLES[sectionParam]} · Deep dive`}
      section={sectionParam}
      onExit={() => router.push(`/projects/${id}`)}
      spotVisible={spotVisible}
      onToggleSpot={setSpotAndPersist}
    >
      <SectionBody
        project={project}
        section={sectionParam}
        focusSpot={focusSpot && spotVisible}
        spotVisible={spotVisible}
        onShowSpot={() => setSpotAndPersist(true)}
      />
    </DeepDiveShell>
  );
}

function isValidSection(s: string): s is Section {
  return s === "campaigns" || s === "personas" || s === "library" || s === "dashboard";
}

function SectionBody({
  project,
  section,
  focusSpot,
  spotVisible,
  onShowSpot,
}: {
  project: ProjectDetail;
  section: Section;
  focusSpot: boolean;
  spotVisible: boolean;
  onShowSpot: () => void;
}) {
  return (
    <div
      className="grid h-full relative"
      style={{
        gridTemplateColumns: spotVisible ? "1fr 360px" : "1fr",
        gap: 0,
        transition: "grid-template-columns 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="overflow-y-auto" style={{ padding: "20px 28px" }}>
        {section === "campaigns" && <CampaignsDeepDive project={project} />}
        {section === "personas" && <PersonasDeepDive project={project} />}
        {section === "library" && <LibraryDeepDive project={project} />}
        {section === "dashboard" && <DashboardDeepDive project={project} />}
      </div>
      {spotVisible && (
        <SpotSidePanel project={project} section={section} autoFocus={focusSpot} />
      )}
      {!spotVisible && (
        <button
          type="button"
          onClick={onShowSpot}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-button"
          title="Open Spot side panel"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            background: "linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)",
            color: "#FFF",
            border: "1px solid transparent",
            boxShadow: "0 8px 24px rgba(124,58,237,0.32)",
            fontSize: 12,
            fontWeight: 600,
            zIndex: 5,
          }}
        >
          <Sparkles size={12} /> Ask Spot
        </button>
      )}
    </div>
  );
}

function DeepDiveShell({
  title,
  sub,
  section,
  onExit,
  spotVisible,
  onToggleSpot,
  children,
}: {
  title: string;
  sub: string;
  section: Section;
  onExit: () => void;
  spotVisible: boolean;
  onToggleSpot: (next: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-page)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-6 py-2.5"
        style={{
          background: "#FFF",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-button border border-border bg-white text-[11.5px] text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={12} /> Back to project
        </button>
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <span className="text-[13.5px] font-semibold truncate">{title}</span>
          <span className="text-[11.5px] text-text-tertiary">· {sub}</span>
        </div>
        <SectionSwitcher current={section} projectId={getProjectIdFromExit()} />
        <button
          type="button"
          onClick={() => onToggleSpot(!spotVisible)}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-button text-[11.5px] transition-colors"
          title={spotVisible ? "Hide Spot panel · full-screen view" : "Show Spot panel"}
          style={{
            background: spotVisible ? "var(--spot-tint)" : "#FFF",
            color: spotVisible ? "#7C3AED" : "var(--text-2)",
            border: `1px solid ${spotVisible ? "var(--spot-stroke)" : "var(--border)"}`,
            fontWeight: 500,
          }}
        >
          {spotVisible ? (
            <>
              <PanelRightClose size={12} /> Hide Spot
            </>
          ) : (
            <>
              <PanelRightOpen size={12} /> Show Spot
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center justify-center h-7 w-7 rounded-button text-text-tertiary hover:text-text-secondary hover:bg-surface-secondary"
          title="Exit deep dive"
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

function SectionSwitcher({
  current,
  projectId,
}: {
  current: Section;
  projectId: string;
}) {
  const router = useRouter();
  const sections: Section[] = ["dashboard", "personas", "campaigns", "library"];
  return (
    <div
      className="inline-flex items-center rounded-button overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "#FFF" }}
    >
      {sections.map((s, i) => {
        const active = s === current;
        return (
          <button
            key={s}
            type="button"
            onClick={() => router.push(`/projects/${projectId}/deep/${s}`)}
            className="h-7 px-2.5 text-[11px] font-medium transition-colors"
            style={{
              background: active ? "#1A1A1A" : "transparent",
              color: active ? "#FFF" : "var(--text-2)",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            {SECTION_TITLES[s]}
          </button>
        );
      })}
    </div>
  );
}

// Helper: extracts the project id from the URL. The shell needs it to
// build the section-switch links, but doesn't receive it directly.
function getProjectIdFromExit(): string {
  if (typeof window === "undefined") return "";
  const m = window.location.pathname.match(/\/projects\/([^/]+)\//);
  return m?.[1] ?? "";
}
