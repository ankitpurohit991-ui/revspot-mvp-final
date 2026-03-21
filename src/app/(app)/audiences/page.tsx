"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Globe, Plus } from "lucide-react";

export default function AudiencesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="CRM &rsaquo; Audiences"
        title="Audiences"
        subtitle="Create and manage audience segments for targeted campaigns"
        actions={
          <button className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150">
            <Plus size={15} strokeWidth={2} />
            Create audience
          </button>
        }
      />
      <EmptyState
        icon={Globe}
        title="No audiences yet"
        description="Build audience segments from your contacts to power targeted campaigns and personalized outreach."
      />
    </>
  );
}
