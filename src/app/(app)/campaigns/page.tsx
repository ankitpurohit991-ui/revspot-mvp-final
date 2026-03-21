"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Monitor, Plus } from "lucide-react";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Campaigns"
        title="Campaigns"
        subtitle="Create and manage your ad campaigns across platforms"
        actions={
          <Link
            href="/campaigns/create"
            className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Create campaign
          </Link>
        }
      />
      <EmptyState
        icon={Monitor}
        title="No campaigns yet"
        description="Launch your first campaign to start generating leads from Google, Meta, and other platforms."
      />
    </>
  );
}
