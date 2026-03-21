"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Projects"
        title="Projects"
        subtitle="Organize campaigns under projects for better tracking"
      />
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to start organizing your campaigns and tracking performance across initiatives."
        action={
          <button className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150">
            <Plus size={15} strokeWidth={2} />
            Create project
          </button>
        }
      />
    </>
  );
}
