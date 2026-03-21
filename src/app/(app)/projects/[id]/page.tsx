"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { FolderKanban } from "lucide-react";

export default function ProjectDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Projects &rsaquo; Detail"
        title="Project Detail"
        subtitle="View and manage project campaigns"
      />
      <EmptyState
        icon={FolderKanban}
        title="Project details"
        description="Project overview, campaigns, and performance metrics will appear here."
      />
    </>
  );
}
