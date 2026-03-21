"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Activity, Plus } from "lucide-react";
import Link from "next/link";

export default function OutreachPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Outreach"
        title="Outreach"
        subtitle="Manage your outreach campaigns and track responses"
        actions={
          <Link
            href="/outreach/create"
            className="h-9 px-4 bg-accent text-white text-[13px] font-medium rounded-button flex items-center gap-2 hover:bg-accent-hover transition-colors duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Create outreach
          </Link>
        }
      />
      <EmptyState
        icon={Activity}
        title="No outreach campaigns"
        description="Create targeted outreach campaigns to engage your leads with personalized messaging."
      />
    </>
  );
}
