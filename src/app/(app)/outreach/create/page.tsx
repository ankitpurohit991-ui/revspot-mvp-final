"use client";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Activity } from "lucide-react";

export default function CreateOutreachPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Lead Generation &rsaquo; Outreach &rsaquo; Create"
        title="Create Outreach"
        subtitle="Set up a new outreach campaign"
      />
      <EmptyState
        icon={Activity}
        title="Outreach builder"
        description="The outreach creation form with audience selection, messaging templates, and scheduling will appear here."
      />
    </>
  );
}
