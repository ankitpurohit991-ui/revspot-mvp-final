"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Monitor } from "lucide-react";

export default function CreateCampaignPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Campaigns &rsaquo; Create"
        title="Create Campaign"
        subtitle="Set up a new campaign with AI-powered optimization"
      />
      <EmptyState
        icon={Monitor}
        title="Campaign wizard"
        description="The campaign creation wizard with platform selection, targeting, budget, and creative setup will appear here."
      />
    </>
  );
}
