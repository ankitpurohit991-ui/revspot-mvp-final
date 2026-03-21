"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Monitor } from "lucide-react";

export default function CampaignDetailPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Campaigns &rsaquo; Detail"
        title="Campaign Detail"
        subtitle="Monitor performance, leads, and settings"
      />
      <EmptyState
        icon={Monitor}
        title="Campaign overview"
        description="Campaign details with Leads, Analysis, and Settings tabs will appear here."
      />
    </>
  );
}
